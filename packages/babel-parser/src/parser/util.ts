import type { Position } from "../util/location.ts";
import {
  tokenIsLiteralPropertyName,
  tt,
  type TokenType,
} from "../tokenizer/types.ts";
import Tokenizer from "../tokenizer/index.ts";
import type State from "../tokenizer/state.ts";
import type {
  EstreePropertyDefinition,
  Node,
  ObjectMethod,
  ObjectProperty,
  PrivateName,
} from "../types.d.ts";
import { hasNewLine } from "../util/whitespace.ts";
import { isIdentifierChar } from "../util/identifier.ts";
import ClassScopeHandler from "../util/class-scope.ts";
import ExpressionScopeHandler from "../util/expression-scope.ts";
import { ScopeFlag } from "../util/scopeflags.ts";
import ProductionParameterHandler, {
  ParamKind,
} from "../util/production-parameter.ts";
import {
  Errors,
  type ParseError,
  type ParseErrorConstructor,
} from "../parse-error.ts";
import type Parser from "./index.ts";

import type ScopeHandler from "../util/scope.ts";

type TryParse<Node, Error, Thrown, Aborted, FailState> = {
  node: Node;
  error: Error;
  thrown: Thrown;
  aborted: Aborted;
  failState: FailState;
};

// ## Parser utilities

export default abstract class UtilParser extends Tokenizer {
  // Forward-declaration: defined in parser/index.js
  abstract getScopeHandler(): new (...args: any) => ScopeHandler;

  addExtra(
    node: Partial<Node>,
    key: string,
    value: any,
    enumerable: boolean = true,
  ): void {
    if (!node) return;

    let { extra } = node;
    if (extra == null) {
      extra = {};
      node.extra = extra;
    }

    if (enumerable) {
      extra[key] = value;
    } else {
      Object.defineProperty(extra, key, { enumerable, value });
    }
  }

  // Tests whether parsed token is a contextual keyword.

  isContextual(token: TokenType): boolean {
    return this.state.type === token && !this.state.containsEsc;
  }

  isUnparsedContextual(nameStart: number, name: string): boolean {
    const nameEnd = nameStart + name.length;
    if (this.input.slice(nameStart, nameEnd) === name) {
      const nextCh = this.input.charCodeAt(nameEnd);
      return !(
        isIdentifierChar(nextCh) ||
        // check if `nextCh is between 0xd800 - 0xdbff,
        // if `nextCh` is NaN, `NaN & 0xfc00` is 0, the function
        // returns true
        (nextCh & 0xfc00) === 0xd800
      );
    }
    return false;
  }

  isLookaheadContextual(name: string): boolean {
    const next = this.nextTokenStart();
    return this.isUnparsedContextual(next, name);
  }

  // Consumes contextual keyword if possible.

  eatContextual(token: TokenType): boolean {
    if (this.isContextual(token)) {
      this.next();
      return true;
    }
    return false;
  }

  // Asserts that following token is given contextual keyword.

  expectContextual(
    token: TokenType,
    toParseError?: ParseErrorConstructor<any>,
  ): void {
    if (!this.eatContextual(token)) {
      if (toParseError != null) {
        throw this.raise(toParseError, this.state.startLoc);
      }
      this.unexpected(null, token);
    }
  }

  // Test whether a semicolon can be inserted at the current position.

  canInsertSemicolon(): boolean {
    return (
      this.match(tt.eof) ||
      this.match(tt.braceR) ||
      this.hasPrecedingLineBreak()
    );
  }

  hasPrecedingLineBreak(): boolean {
    return hasNewLine(
      this.input,
      this.offsetToSourcePos(this.state.lastTokEndLoc.index),
      this.state.start,
    );
  }

  hasFollowingLineBreak(): boolean {
    return hasNewLine(this.input, this.state.end, this.nextTokenStart());
  }

  isLineTerminator(): boolean {
    return this.eat(tt.semi) || this.canInsertSemicolon();
  }

  // Consume a semicolon, or, failing that, see if we are allowed to
  // pretend that there is a semicolon at this position.

  semicolon(allowAsi: boolean = true): void {
    if (allowAsi ? this.isLineTerminator() : this.eat(tt.semi)) return;
    this.raise(Errors.MissingSemicolon, this.state.lastTokEndLoc);
  }

  // Expect a token of a given type. If found, consume it, otherwise,
  // raise an unexpected token error at given pos.

  expect(type: TokenType, loc?: Position | null): void {
    if (!this.eat(type)) {
      this.unexpected(loc, type);
    }
  }

  // tryParse will clone parser state.
  // It is expensive and should be used with cautions
  tryParse<T extends Node | ReadonlyArray<Node>>(
    fn: (abort: (node?: T) => never) => T,
    oldState: State = this.state.clone(),
  ):
    | TryParse<T, null, false, false, null>
    | TryParse<T | null, ParseError<any>, boolean, false, State>
    | TryParse<T | null, null, false, true, State> {
    const abortSignal: {
      node: T | null;
    } = { node: null };
    try {
      const node = fn((node = null) => {
        abortSignal.node = node;
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw abortSignal;
      });
      if (this.state.errors.length > oldState.errors.length) {
        const failState = this.state;
        this.state = oldState;
        // tokensLength should be preserved during error recovery mode
        // since the parser does not halt and will instead parse the
        // remaining tokens
        this.state.tokensLength = failState.tokensLength;
        return {
          node,
          error: failState.errors[oldState.errors.length],
          thrown: false,
          aborted: false,
          failState,
        };
      }

      return {
        node,
        error: null,
        thrown: false,
        aborted: false,
        failState: null,
      };
    } catch (error) {
      const failState = this.state;
      this.state = oldState;
      if (error instanceof SyntaxError) {
        // @ts-expect-error casting general syntax error to parse error
        return { node: null, error, thrown: true, aborted: false, failState };
      }
      if (error === abortSignal) {
        return {
          node: abortSignal.node,
          error: null,
          thrown: false,
          aborted: true,
          failState,
        };
      }

      throw error;
    }
  }

  checkExpressionErrors(
    refExpressionErrors: ExpressionErrors | undefined | null,
    andThrow: boolean,
  ) {
    if (!refExpressionErrors) return false;
    const {
      shorthandAssignLoc,
      doubleProtoLoc,
      privateKeyLoc,
      optionalParametersLoc,
    } = refExpressionErrors;

    const hasErrors =
      !!shorthandAssignLoc ||
      !!doubleProtoLoc ||
      !!optionalParametersLoc ||
      !!privateKeyLoc;

    if (!andThrow) {
      return hasErrors;
    }

    if (shorthandAssignLoc != null) {
      this.raise(Errors.InvalidCoverInitializedName, shorthandAssignLoc);
    }

    if (doubleProtoLoc != null) {
      this.raise(Errors.DuplicateProto, doubleProtoLoc);
    }

    if (privateKeyLoc != null) {
      this.raise(Errors.UnexpectedPrivateField, privateKeyLoc);
    }

    if (optionalParametersLoc != null) {
      this.unexpected(optionalParametersLoc);
    }
  }

  /**
   * Test if current token is a literal property name
   * https://tc39.es/ecma262/#prod-LiteralPropertyName
   * LiteralPropertyName:
   *   IdentifierName
   *   StringLiteral
   *   NumericLiteral
   *   BigIntLiteral
   */
  isLiteralPropertyName(): boolean {
    return tokenIsLiteralPropertyName(this.state.type);
  }

  /**
   * Test if given node is a PrivateName
   * will be overridden in ESTree plugin
   */
  isPrivateName(node: Node): node is PrivateName {
    return node.type === "PrivateName";
  }

  /**
   * Return the string value of a given private name
   * WITHOUT `#`
   * @see {@link https://tc39.es/ecma262/#sec-static-semantics-stringvalue}
   */
  getPrivateNameSV(node: PrivateName): string {
    return node.id.name;
  }

  /**
   * Return whether the given node is a member/optional chain that
   * contains a private name as its property
   * It is overridden in ESTree plugin
   */
  hasPropertyAsPrivateName(node: Node): boolean {
    return (
      (node.type === "MemberExpression" ||
        node.type === "OptionalMemberExpression") &&
      this.isPrivateName(node.property)
    );
  }

  isObjectProperty(
    node: Node,
  ): node is ObjectProperty | EstreePropertyDefinition {
    return node.type === "ObjectProperty";
  }

  isObjectMethod(node: Node): node is ObjectMethod {
    return node.type === "ObjectMethod";
  }

  initializeScopes(
    this: Parser,
    inModule: boolean = this.options.sourceType === "module",
  ): () => void {
    // Initialize state
    const oldLabels = this.state.labels;
    this.state.labels = [];

    const oldExportedIdentifiers = this.exportedIdentifiers;
    this.exportedIdentifiers = new Set();

    // initialize scopes
    const oldInModule = this.inModule;
    this.inModule = inModule;

    const oldScope = this.scope;
    const ScopeHandler = this.getScopeHandler();
    this.scope = new ScopeHandler(this, inModule);

    const oldProdParam = this.prodParam;
    this.prodParam = new ProductionParameterHandler();

    const oldClassScope = this.classScope;
    this.classScope = new ClassScopeHandler(this);

    const oldExpressionScope = this.expressionScope;
    this.expressionScope = new ExpressionScopeHandler(this);

    return () => {
      // Revert state
      this.state.labels = oldLabels;
      this.exportedIdentifiers = oldExportedIdentifiers;

      // Revert scopes
      this.inModule = oldInModule;
      this.scope = oldScope;
      this.prodParam = oldProdParam;
      this.classScope = oldClassScope;
      this.expressionScope = oldExpressionScope;
    };
  }

  enterInitialScopes() {
    let paramFlags = ParamKind.PARAM;
    if (this.inModule) {
      paramFlags |= ParamKind.PARAM_AWAIT;
    }
    this.scope.enter(ScopeFlag.PROGRAM);
    this.prodParam.enter(paramFlags);
  }

  checkDestructuringPrivate(refExpressionErrors: ExpressionErrors) {
    const { privateKeyLoc } = refExpressionErrors;
    if (privateKeyLoc !== null) {
      this.expectPlugin("destructuringPrivate", privateKeyLoc);
    }
  }
}

/**
 * The ExpressionErrors is a context struct used to track ambiguous patterns
 * When we are sure the parsed pattern is a RHS, which means it is not a pattern,
 * we will throw on this position on invalid assign syntax, otherwise it will be reset to -1
 *
 * Types of ExpressionErrors:
 *
 * - **shorthandAssignLoc**: track initializer `=` position
 * - **doubleProtoLoc**: track the duplicate `__proto__` key position
 * - **privateKey**: track private key `#p` position
 * - **optionalParametersLoc**: track the optional parameter (`?`).
 * It's only used by typescript and flow plugins
 */
export class ExpressionErrors {
  shorthandAssignLoc: Position | undefined | null = null;
  doubleProtoLoc: number | undefined | null = null;
  privateKeyLoc: Position | undefined | null = null;
  optionalParametersLoc: Position | undefined | null = null;
}
