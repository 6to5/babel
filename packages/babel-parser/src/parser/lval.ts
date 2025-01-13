import * as charCodes from "charcodes";
import { tt, type TokenType } from "../tokenizer/types.ts";
import type {
  AssignmentPattern,
  TSParameterProperty,
  Decorator,
  Expression,
  Identifier,
  Node,
  Pattern,
  RestElement,
  SpreadElement,
  ObjectOrClassMember,
  ClassMember,
  ObjectMember,
  TsNamedTypeElementBase,
  PrivateName,
  ObjectExpression,
  ObjectPattern,
  ArrayPattern,
  AssignmentProperty,
  Assignable,
} from "../types.ts";
import type { Pos, Position } from "../util/location.ts";
import {
  isStrictBindOnlyReservedWord,
  isStrictBindReservedWord,
} from "../util/identifier.ts";
import { NodeUtils, type Undone } from "./node.ts";
import { BindingFlag } from "../util/scopeflags.ts";
import type { ExpressionErrors } from "./util.ts";
import { Errors, type LValAncestor } from "../parse-error.ts";
import type Parser from "./index.ts";
import { OptionFlags } from "../options.ts";

const unwrapParenthesizedExpression = (node: Node): Node => {
  return node.type === "ParenthesizedExpression"
    ? unwrapParenthesizedExpression(node.expression)
    : node;
};

export const enum ParseBindingListFlags {
  ALLOW_EMPTY = 1 << 0,
  IS_FUNCTION_PARAMS = 1 << 1,
  IS_CONSTRUCTOR_PARAMS = 1 << 2,
}

export default abstract class LValParser extends NodeUtils {
  // Forward-declaration: defined in expression.js
  abstract parseIdentifier(liberal?: boolean): Identifier;
  abstract parseMaybeAssign(
    refExpressionErrors?: ExpressionErrors | null,
    afterLeftParse?: Function,
    refNeedsArrowPos?: Pos | null,
  ): Expression;

  abstract parseMaybeAssignAllowIn(
    refExpressionErrors?: ExpressionErrors | null,
    afterLeftParse?: Function,
    refNeedsArrowPos?: Pos | null,
  ): Expression;

  abstract parseObjectLike<T extends ObjectPattern | ObjectExpression>(
    close: TokenType,
    isPattern: boolean,
    isRecord?: boolean,
    refExpressionErrors?: ExpressionErrors,
  ): T;
  abstract parseObjPropValue(
    prop: any,
    startLoc: Position | null,
    isGenerator: boolean,
    isAsync: boolean,
    isPattern: boolean,
    isAccessor: boolean,
    refExpressionErrors?: ExpressionErrors | null,
  ): void;
  abstract parsePropertyName(
    prop: ObjectOrClassMember | ClassMember | TsNamedTypeElementBase,
  ): void;
  abstract parsePrivateName(): PrivateName;
  // Forward-declaration: defined in statement.js
  abstract parseDecorator(): Decorator;

  /**
   * Convert existing expression atom to assignable pattern
   * if possible. Also checks invalid destructuring targets:
   *
   * - Parenthesized Destructuring patterns
   * - RestElement is not the last element
   * - Missing `=` in assignment pattern
   *
   * NOTE: There is a corresponding "isAssignable" method.
   * When this one is updated, please check if also that one needs to be updated.
   *
   * @param node The expression atom
   * @param isLHS Whether we are parsing a LeftHandSideExpression.
   *              If isLHS is `true`, the following cases are allowed: `[(a)] = [0]`, `[(a.b)] = [0]`
   *              If isLHS is `false`, we are in an arrow function parameters list.
   */
  toAssignable(node: Node, isLHS: boolean = false): asserts node is Assignable {
    let parenthesized = undefined;
    if (node.type === "ParenthesizedExpression" || node.extra?.parenthesized) {
      parenthesized = unwrapParenthesizedExpression(node);
      if (isLHS) {
        // an LHS can be reinterpreted to a binding pattern but not vice versa.
        // therefore a parenthesized identifier is ambiguous until we are sure it is an assignment expression
        // i.e. `([(a) = []] = []) => {}`
        // see also `recordArrowParameterBindingError` signature in packages/babel-parser/src/util/expression-scope.js
        if (parenthesized.type === "Identifier") {
          this.expressionScope.recordArrowParameterBindingError(
            Errors.InvalidParenthesizedAssignment,
            node,
          );
        } else if (
          parenthesized.type !== "MemberExpression" &&
          !this.isOptionalMemberExpression(parenthesized)
        ) {
          // A parenthesized member expression can be in LHS but not in pattern.
          // If the LHS is later interpreted as a pattern, `checkLVal` will throw for member expression binding
          // i.e. `([(a.b) = []] = []) => {}`
          this.raise(Errors.InvalidParenthesizedAssignment, node);
        }
      } else {
        this.raise(Errors.InvalidParenthesizedAssignment, node);
      }
    }

    switch (node.type) {
      case "Identifier":
      case "ObjectPattern":
      case "ArrayPattern":
      case "AssignmentPattern":
      case "RestElement":
        break;

      case "ObjectExpression":
        (node as Node).type = "ObjectPattern";
        for (
          let i = 0, length = node.properties.length, last = length - 1;
          i < length;
          i++
        ) {
          const prop = node.properties[i];
          const isLast = i === last;
          this.toAssignableObjectExpressionProp(prop, isLast, isLHS);

          if (
            isLast &&
            (prop as Node).type === "RestElement" &&
            node.extra?.trailingCommaLoc
          ) {
            this.raise(Errors.RestTrailingComma, node.extra.trailingCommaLoc);
          }
        }
        break;

      case "ObjectProperty": {
        const { key, value } = node;
        if (this.isPrivateName(key)) {
          this.classScope.usePrivateName(this.getPrivateNameSV(key), key.start);
        }
        this.toAssignable(value, isLHS);
        break;
      }

      case "SpreadElement": {
        throw new Error(
          "Internal @babel/parser error (this is a bug, please report it)." +
            " SpreadElement should be converted by .toAssignable's caller.",
        );
      }

      case "ArrayExpression":
        (node as Node).type = "ArrayPattern";
        this.toAssignableList(
          node.elements,
          node.extra?.trailingCommaLoc,
          isLHS,
        );
        break;

      case "AssignmentExpression":
        if (node.operator !== "=") {
          this.raise(
            Errors.MissingEqInAssignment,
            this.optionFlags & OptionFlags.Locations
              ? node.left.loc.end
              : node.left,
          );
        }

        (node as Node).type = "AssignmentPattern";
        delete node.operator;
        this.toAssignable(node.left, isLHS);
        break;

      case "ParenthesizedExpression":
        /*::invariant (parenthesized !== undefined) */
        this.toAssignable(parenthesized, isLHS);
        break;

      default:
      // We don't know how to deal with this node. It will
      // be reported by a later call to checkLVal
    }
  }

  toAssignableObjectExpressionProp(
    prop: Node,
    isLast: boolean,
    isLHS: boolean,
  ) {
    if (prop.type === "ObjectMethod") {
      this.raise(
        prop.kind === "get" || prop.kind === "set"
          ? Errors.PatternHasAccessor
          : Errors.PatternHasMethod,
        prop.key,
      );
    } else if (prop.type === "SpreadElement") {
      (prop as Node).type = "RestElement";
      const arg = prop.argument;
      this.checkToRestConversion(arg, /* allowPattern */ false);
      this.toAssignable(arg, isLHS);

      if (!isLast) {
        this.raise(Errors.RestTrailingComma, prop);
      }
    } else {
      this.toAssignable(prop, isLHS);
    }
  }

  // Convert list of expression atoms to binding list.

  toAssignableList(
    exprList: (Expression | SpreadElement | RestElement)[],
    trailingCommaLoc: Position | undefined | null,
    isLHS: boolean,
  ): void {
    const end = exprList.length - 1;

    for (let i = 0; i <= end; i++) {
      const elt = exprList[i];
      if (!elt) continue;

      if (elt.type === "SpreadElement") {
        (elt as unknown as RestElement).type = "RestElement";
        const arg = elt.argument;
        this.checkToRestConversion(arg, /* allowPattern */ true);
        this.toAssignable(arg, isLHS);
      } else {
        this.toAssignable(elt, isLHS);
      }

      if (elt.type === "RestElement") {
        if (i < end) {
          this.raise(Errors.RestTrailingComma, elt);
        } else if (trailingCommaLoc) {
          this.raise(Errors.RestTrailingComma, trailingCommaLoc);
        }
      }
    }
  }

  isAssignable(node: Node, isBinding?: boolean): boolean {
    switch (node.type) {
      case "Identifier":
      case "ObjectPattern":
      case "ArrayPattern":
      case "AssignmentPattern":
      case "RestElement":
        return true;

      case "ObjectExpression": {
        const last = node.properties.length - 1;
        return node.properties.every((prop, i) => {
          return (
            prop.type !== "ObjectMethod" &&
            (i === last || prop.type !== "SpreadElement") &&
            this.isAssignable(prop)
          );
        });
      }

      case "ObjectProperty":
        return this.isAssignable(node.value);

      case "SpreadElement":
        return this.isAssignable(node.argument);

      case "ArrayExpression":
        return node.elements.every(
          element => element === null || this.isAssignable(element),
        );

      case "AssignmentExpression":
        return node.operator === "=";

      case "ParenthesizedExpression":
        return this.isAssignable(node.expression);

      case "MemberExpression":
      case "OptionalMemberExpression":
        return !isBinding;

      default:
        return false;
    }
  }

  // Convert list of expression atoms to a list of

  toReferencedList(
    exprList:
      | ReadonlyArray<Expression | SpreadElement>
      | ReadonlyArray<Expression | RestElement>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isParenthesizedExpr?: boolean,
  ):
    | ReadonlyArray<Expression | SpreadElement>
    | ReadonlyArray<Expression | RestElement> {
    return exprList;
  }

  toReferencedListDeep(
    exprList:
      | ReadonlyArray<Expression | SpreadElement>
      | ReadonlyArray<Expression | RestElement>,
    isParenthesizedExpr?: boolean,
  ): void {
    this.toReferencedList(exprList, isParenthesizedExpr);

    for (const expr of exprList) {
      if (expr?.type === "ArrayExpression") {
        this.toReferencedListDeep(expr.elements);
      }
    }
  }

  // Parses spread element.

  parseSpread(
    this: Parser,
    refExpressionErrors?: ExpressionErrors | null,
  ): SpreadElement {
    const node = this.startNode<SpreadElement>();
    this.next();
    node.argument = this.parseMaybeAssignAllowIn(
      refExpressionErrors,
      undefined,
    );
    return this.finishNode(node, "SpreadElement");
  }

  // https://tc39.es/ecma262/#prod-BindingRestProperty
  // https://tc39.es/ecma262/#prod-BindingRestElement
  parseRestBinding(this: Parser): RestElement {
    const node = this.startNode<RestElement>();
    this.next(); // eat `...`
    node.argument = this.parseBindingAtom();
    return this.finishNode(node, "RestElement");
  }

  // Parses lvalue (assignable) atom.
  parseBindingAtom(this: Parser): Pattern {
    // https://tc39.es/ecma262/#prod-BindingPattern
    switch (this.state.type) {
      case tt.bracketL: {
        const node = this.startNode<ArrayPattern>();
        this.next();
        // @ts-expect-error: Fixme: TSParameterProperty can not be assigned to node.elements
        node.elements = this.parseBindingList(
          tt.bracketR,
          charCodes.rightSquareBracket,
          ParseBindingListFlags.ALLOW_EMPTY,
        );
        return this.finishNode(node, "ArrayPattern");
      }

      case tt.braceL:
        return this.parseObjectLike(tt.braceR, true);
    }

    // https://tc39.es/ecma262/#prod-BindingIdentifier
    return this.parseIdentifier();
  }

  // https://tc39.es/ecma262/#prod-BindingElementList
  parseBindingList(
    this: Parser,
    close: TokenType,
    closeCharCode: (typeof charCodes)[keyof typeof charCodes],
    flags: ParseBindingListFlags,
  ): Array<Pattern | TSParameterProperty> {
    const allowEmpty = flags & ParseBindingListFlags.ALLOW_EMPTY;

    const elts: Array<Pattern | TSParameterProperty> = [];
    let first = true;
    while (!this.eat(close)) {
      if (first) {
        first = false;
      } else {
        this.expect(tt.comma);
      }
      if (allowEmpty && this.match(tt.comma)) {
        elts.push(null);
      } else if (this.eat(close)) {
        break;
      } else if (this.match(tt.ellipsis)) {
        let rest: Pattern = this.parseRestBinding();
        if (
          (!process.env.BABEL_8_BREAKING && this.hasPlugin("flow")) ||
          flags & ParseBindingListFlags.IS_FUNCTION_PARAMS
        ) {
          rest = this.parseFunctionParamType(rest);
        }
        elts.push(rest);
        if (!this.checkCommaAfterRest(closeCharCode)) {
          this.expect(close);
          break;
        }
      } else {
        const decorators = [];
        if (this.match(tt.at) && this.hasPlugin("decorators")) {
          this.raise(Errors.UnsupportedParameterDecorator, this.state.startLoc);
        }
        // invariant: hasPlugin("decorators-legacy")
        while (this.match(tt.at)) {
          decorators.push(this.parseDecorator());
        }
        elts.push(this.parseAssignableListItem(flags, decorators));
      }
    }
    return elts;
  }

  // https://tc39.es/ecma262/#prod-BindingRestProperty
  parseBindingRestProperty(
    this: Parser,
    prop: Undone<RestElement>,
  ): RestElement {
    this.next(); // eat '...'
    // Don't use parseRestBinding() as we only allow Identifier here.
    prop.argument = this.parseIdentifier();
    this.checkCommaAfterRest(charCodes.rightCurlyBrace);
    return this.finishNode(prop, "RestElement");
  }

  // https://tc39.es/ecma262/#prod-BindingProperty
  parseBindingProperty(this: Parser): AssignmentProperty | RestElement {
    const { type, startLoc } = this.state;
    if (type === tt.ellipsis) {
      return this.parseBindingRestProperty(this.startNode());
    }

    const prop = this.startNode<AssignmentProperty>();
    if (type === tt.privateName) {
      this.expectPlugin("destructuringPrivate", startLoc);
      this.classScope.usePrivateName(this.state.value, startLoc);
      prop.key = this.parsePrivateName();
    } else {
      this.parsePropertyName(prop);
    }
    prop.method = false;
    return this.parseObjPropValue(
      prop,
      startLoc,
      false /* isGenerator */,
      false /* isAsync */,
      true /* isPattern */,
      false /* isAccessor */,
    );
  }

  parseAssignableListItem(
    this: Parser,
    flags: ParseBindingListFlags,
    decorators: Decorator[],
  ): Pattern | TSParameterProperty {
    const { startLoc } = this.state;
    const left = this.parseMaybeDefault();
    if (
      (!process.env.BABEL_8_BREAKING && this.hasPlugin("flow")) ||
      flags & ParseBindingListFlags.IS_FUNCTION_PARAMS
    ) {
      this.parseFunctionParamType(left);
    }
    const elt = this.parseMaybeDefault(startLoc, left);
    if (decorators.length) {
      left.decorators = decorators;
    }
    return elt;
  }

  // Used by flow/typescript plugin to add type annotations to binding elements
  parseFunctionParamType(param: Pattern): Pattern {
    return param;
  }

  // Parses assignment pattern around given atom if possible.
  // https://tc39.es/ecma262/#prod-BindingElement
  parseMaybeDefault(
    this: Parser,
    startLoc?: Position | null,
    left?: Pattern | null,
  ): Pattern {
    startLoc ??= this.state.startLoc;
    left = left ?? this.parseBindingAtom();
    if (!this.eat(tt.eq)) return left;

    const node = this.startNodeAt<AssignmentPattern>(startLoc);
    node.left = left;
    node.right = this.parseMaybeAssignAllowIn();
    return this.finishNode(node, "AssignmentPattern");
  }
  /**
   * Return information use in determining whether a Node of a given type is an LVal,
   * possibly given certain additional context information.
   *
   * Subclasser notes: This method has kind of a lot of mixed, but related,
   * responsibilities. If we can definitively determine with the information
   * provided that this either *is* or *isn't* a valid `LVal`, then the return
   * value is easy: just return `true` or `false`. However, if it is a valid
   * LVal *ancestor*, and thus its descendants must be subsequently visited to
   * continue the "investigation", then this method should return the relevant
   * child key as a `string`. In some special cases, you additionally want to
   * convey that this node should be treated as if it were parenthesized. In
   * that case, a tuple of [key: string, parenthesized: boolean] is returned.
   * The `string`-only return option is actually just a shorthand for:
   * `[key: string, parenthesized: false]`.
   *
   * @param type A Node `type` string
   * @param isUnparenthesizedInAssign
   *        Whether the node in question is unparenthesized and its parent
   *        is either an assignment pattern or an assignment expression.
   * @param binding
   *        The binding operation that is being considered for this potential
   *        LVal.
   * @returns `true` or `false` if we can immediately determine whether the node
   *          type in question can be treated as an `LVal`.
   *          A `string` key to traverse if we must check this child.
   *          A `[string, boolean]` tuple if we need to check this child and
   *          treat is as parenthesized.
   */
  isValidLVal(
    type: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isUnparenthesizedInAssign: boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binding: BindingFlag,
  ): string | boolean | [string, boolean] {
    switch (type) {
      case "AssignmentPattern":
        return "left";
      case "RestElement":
        return "argument";
      case "ObjectProperty":
        return "value";
      case "ParenthesizedExpression":
        return "expression";
      case "ArrayPattern":
        return "elements";
      case "ObjectPattern":
        return "properties";
    }
    return false;
  }

  // Overridden by the estree plugin
  isOptionalMemberExpression(expression: Node): boolean {
    return expression.type === "OptionalMemberExpression";
  }

  /**
   * Verify that a target expression is an lval (something that can be assigned to).
   *
   * @param expression The expression in question to check.
   * @param ancestor
   *        The relevant ancestor to provide context information for the error
   *        if the check fails.
   * @param binding
   *        The desired binding type. If the given expression is an identifier
   *        and `binding` is not `BindingFlag.TYPE_NONE`, `checkLVal` will register binding
   *        to the parser scope See also `src/util/scopeflags.js`
   * @param checkClashes
   *        An optional string set to check if an identifier name is included.
   *        `checkLVal` will add checked identifier name to `checkClashes` It is
   *        used in tracking duplicates in function parameter lists. If it is
   *        false, `checkLVal` will skip duplicate checks
   * @param strictModeChanged
   *        Whether an identifier has been parsed in a sloppy context but should
   *        be reinterpreted as strict-mode. e.g. `(arguments) => { "use strict "}`
   * @param hasParenthesizedAncestor
   *        This is only used internally during recursive calls, and you should
   *        not have to set it yourself.
   */

  checkLVal(
    expression:
      | Expression
      | ObjectMember
      | RestElement
      | Pattern
      | TSParameterProperty,
    ancestor: LValAncestor,
    binding: BindingFlag = BindingFlag.TYPE_NONE,
    checkClashes: Set<string> | false = false,
    strictModeChanged: boolean = false,
    hasParenthesizedAncestor: boolean = false,
  ): void {
    const type = expression.type;

    // If we find here an ObjectMethod, it's because this was originally
    // an ObjectExpression which has then been converted.
    // toAssignable already reported this error with a nicer message.
    if (this.isObjectMethod(expression)) return;

    const isOptionalMemberExpression =
      this.isOptionalMemberExpression(expression);

    if (isOptionalMemberExpression || type === "MemberExpression") {
      if (isOptionalMemberExpression) {
        this.expectPlugin("optionalChainingAssign", expression.start);
        if (ancestor.type !== "AssignmentExpression") {
          this.raise(Errors.InvalidLhsOptionalChaining, expression, {
            ancestor,
          });
        }
      }

      if (binding !== BindingFlag.TYPE_NONE) {
        this.raise(Errors.InvalidPropertyBindingPattern, expression);
      }
      return;
    }

    if (type === "Identifier") {
      this.checkIdentifier(expression, binding, strictModeChanged);

      const { name } = expression;

      if (checkClashes) {
        if (checkClashes.has(name)) {
          this.raise(Errors.ParamDupe, expression);
        } else {
          checkClashes.add(name);
        }
      }

      return;
    }

    const validity = this.isValidLVal(
      type,
      !(hasParenthesizedAncestor || expression.extra?.parenthesized) &&
        ancestor.type === "AssignmentExpression",
      binding,
    );

    if (validity === true) return;
    if (validity === false) {
      const ParseErrorClass =
        binding === BindingFlag.TYPE_NONE
          ? Errors.InvalidLhs
          : Errors.InvalidLhsBinding;

      this.raise(ParseErrorClass, expression, { ancestor });
      return;
    }

    let key: string, isParenthesizedExpression: boolean;
    if (typeof validity === "string") {
      key = validity;
      isParenthesizedExpression = type === "ParenthesizedExpression";
    } else {
      [key, isParenthesizedExpression] = validity;
    }

    const nextAncestor =
      type === "ArrayPattern" || type === "ObjectPattern"
        ? ({ type } as const)
        : ancestor;

    // @ts-expect-error key may not index expression.
    const val = expression[key];
    if (Array.isArray(val)) {
      for (const child of val) {
        if (child) {
          this.checkLVal(
            child,
            nextAncestor,
            binding,
            checkClashes,
            strictModeChanged,
            isParenthesizedExpression,
          );
        }
      }
    } else if (val) {
      this.checkLVal(
        val,
        nextAncestor,
        binding,
        checkClashes,
        strictModeChanged,
        isParenthesizedExpression,
      );
    }
  }

  checkIdentifier(
    at: Identifier,
    bindingType: BindingFlag,
    strictModeChanged: boolean = false,
  ) {
    if (
      this.state.strict &&
      (strictModeChanged
        ? isStrictBindReservedWord(at.name, this.inModule)
        : isStrictBindOnlyReservedWord(at.name))
    ) {
      if (bindingType === BindingFlag.TYPE_NONE) {
        this.raise(Errors.StrictEvalArguments, at, { referenceName: at.name });
      } else {
        this.raise(Errors.StrictEvalArgumentsBinding, at, {
          bindingName: at.name,
        });
      }
    }

    if (bindingType & BindingFlag.FLAG_NO_LET_IN_LEXICAL && at.name === "let") {
      this.raise(Errors.LetInLexicalBinding, at);
    }

    if (!(bindingType & BindingFlag.TYPE_NONE)) {
      this.declareNameFromIdentifier(at, bindingType);
    }
  }

  declareNameFromIdentifier(identifier: Identifier, binding: BindingFlag) {
    this.scope.declareName(identifier.name, binding, identifier.start);
  }

  checkToRestConversion(node: Node, allowPattern: boolean): void {
    switch (node.type) {
      case "ParenthesizedExpression":
        this.checkToRestConversion(node.expression, allowPattern);
        break;
      case "Identifier":
      case "MemberExpression":
        break;
      case "ArrayExpression":
      case "ObjectExpression":
        if (allowPattern) break;
      /* falls through */
      default:
        this.raise(Errors.InvalidRestAssignmentPattern, node);
    }
  }

  checkCommaAfterRest(
    close: (typeof charCodes)[keyof typeof charCodes],
  ): boolean {
    if (!this.match(tt.comma)) {
      return false;
    }

    this.raise(
      this.lookaheadCharCode() === close
        ? Errors.RestTrailingComma
        : Errors.ElementAfterRest,
      this.state.startLoc,
    );

    return true;
  }
}
