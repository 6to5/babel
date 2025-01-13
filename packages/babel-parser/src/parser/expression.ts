// A recursive descent parser operates by defining functions for all
// syntactic elements, and recursively calling those, each function
// advancing the input stream and returning an AST node. Precedence
// of constructs (for example, the fact that `!x[1]` means `!(x[1])`
// instead of `(!x)[1]` is handled by the fact that the parser
// function that parses unary prefix operators is called first, and
// in turn calls the function that parses `[]` subscripts — that
// way, it'll receive the node for `x[1]` already parsed, and wraps
// *that* in the unary operator node.
//
// Acorn uses an [operator precedence parser][opp] to handle binary
// operator precedence, because it is much more compact than using
// the technique outlined above, which uses different, nesting
// functions to specify precedence, for all of the ten binary
// precedence levels that JavaScript defines.
//
// [opp]: http://en.wikipedia.org/wiki/Operator-precedence_parser

import {
  tokenCanStartExpression,
  tokenIsAssignment,
  tokenIsIdentifier,
  tokenIsKeywordOrIdentifier,
  tokenIsOperator,
  tokenIsPostfix,
  tokenIsPrefix,
  tokenIsRightAssociative,
  tokenIsTemplate,
  tokenKeywordOrIdentifierIsKeyword,
  tokenLabelName,
  tokenOperatorPrecedence,
  tt,
  type TokenType,
} from "../tokenizer/types.ts";
import type * as N from "../types.ts";
import LValParser from "./lval.ts";
import {
  isKeyword,
  isReservedWord,
  isStrictReservedWord,
  isStrictBindReservedWord,
  isIdentifierStart,
  canBeReservedWord,
} from "../util/identifier.ts";
import {
  type Position,
  createPositionWithColumnOffset,
} from "../util/location.ts";
import * as charCodes from "charcodes";
import { ScopeFlag, BindingFlag } from "../util/scopeflags.ts";
import { ExpressionErrors } from "./util.ts";
import { ParamKind, functionFlags } from "../util/production-parameter.ts";
import {
  newArrowHeadScope,
  newAsyncArrowScope,
  newExpressionScope,
} from "../util/expression-scope.ts";
import { Errors, type ParseError } from "../parse-error.ts";
import {
  UnparenthesizedPipeBodyDescriptions,
  type UnparenthesizedPipeBodyTypes,
} from "../parse-error/pipeline-operator-errors.ts";
import { setInnerComments } from "./comments.ts";
import { cloneIdentifier, type Undone } from "./node.ts";
import type Parser from "./index.ts";

import { OptionFlags, type SourceType } from "../options.ts";

export default abstract class ExpressionParser extends LValParser {
  // Forward-declaration: defined in statement.js
  abstract parseBlock(
    allowDirectives?: boolean,
    createNewLexicalScope?: boolean,
    afterBlockParse?: (hasStrictModeDirective: boolean) => void,
  ): N.BlockStatement;
  abstract parseClass(
    node: N.Class,
    isStatement: boolean,
    optionalId?: boolean,
  ): N.Class;
  abstract parseDecorators(allowExport?: boolean): void;
  abstract parseFunction<T extends N.NormalFunction>(
    node: T,
    statement?: number,
    allowExpressionBody?: boolean,
    isAsync?: boolean,
  ): T;
  abstract parseFunctionParams(node: N.Function, isConstructor?: boolean): void;
  abstract parseBlockOrModuleBlockBody(
    body: N.Statement[],
    directives: N.Directive[] | null | undefined,
    topLevel: boolean,
    end: TokenType,
    afterBlockParse?: (hasStrictModeDirective: boolean) => void,
  ): void;
  abstract parseProgram(
    program: N.Program,
    end: TokenType,
    sourceType?: SourceType,
  ): N.Program;

  // For object literal, check if property __proto__ has been used more than once.
  // If the expression is a destructuring assignment, then __proto__ may appear
  // multiple times. Otherwise, __proto__ is a duplicated key.

  // For record expression, check if property __proto__ exists

  checkProto(
    prop: N.ObjectMember | N.SpreadElement,
    isRecord: boolean | undefined | null,
    protoRef: {
      used: boolean;
    },
    refExpressionErrors?: ExpressionErrors | null,
  ): void {
    if (
      prop.type === "SpreadElement" ||
      this.isObjectMethod(prop) ||
      prop.computed ||
      prop.shorthand
    ) {
      return;
    }

    const key = prop.key as
      | N.Identifier
      | N.StringLiteral
      | N.NumericLiteral
      | N.BigIntLiteral;
    // It is either an Identifier or a String/NumericLiteral
    const name = key.type === "Identifier" ? key.name : key.value;

    if (name === "__proto__") {
      if (isRecord) {
        this.raise(Errors.RecordNoProto, key);
        return;
      }
      if (protoRef.used) {
        if (refExpressionErrors) {
          // Store the first redefinition's position, otherwise ignore because
          // we are parsing ambiguous pattern
          if (refExpressionErrors.doubleProtoLoc === null) {
            refExpressionErrors.doubleProtoLoc = key.loc.start;
          }
        } else {
          this.raise(Errors.DuplicateProto, key);
        }
      }

      protoRef.used = true;
    }
  }

  shouldExitDescending(
    expr: N.Expression | N.PrivateName,
    potentialArrowAt: number,
  ): expr is N.ArrowFunctionExpression {
    return (
      expr.type === "ArrowFunctionExpression" &&
      this.offsetToSourcePos(expr.start) === potentialArrowAt
    );
  }

  // Convenience method to parse an Expression only
  getExpression(this: Parser): N.Expression & N.ParserOutput {
    this.enterInitialScopes();
    this.nextToken();
    const expr = this.parseExpression() as N.Expression & N.ParserOutput;
    if (!this.match(tt.eof)) {
      this.unexpected();
    }
    // Unlike parseTopLevel, we need to drain remaining commentStacks
    // because the top level node is _not_ Program.
    this.finalizeRemainingComments();
    expr.comments = this.comments;
    expr.errors = this.state.errors;
    if (this.optionFlags & OptionFlags.Tokens) {
      expr.tokens = this.tokens;
    }
    return expr;
  }

  // ### Expression parsing

  // These nest, from the most general expression type at the top to
  // 'atomic', nondivisible expression types at the bottom. Most of
  // the functions will simply let the function (s) below them parse,
  // and, *if* the syntactic construct they handle is present, wrap
  // the AST node that the inner parser gave them in another node.

  // Parse a full expression.
  // - `disallowIn`
  //   is used to forbid the `in` operator (in for loops initialization expressions)
  //   When `disallowIn` is true, the production parameter [In] is not present.

  // - `refExpressionErrors `
  //   provides reference for storing '=' operator inside shorthand
  //   property assignment in contexts where both object expression
  //   and object pattern might appear (so it's possible to raise
  //   delayed syntax error at correct position).

  parseExpression(
    this: Parser,
    disallowIn?: boolean,
    refExpressionErrors?: ExpressionErrors,
  ): N.Expression {
    if (disallowIn) {
      return this.disallowInAnd(() =>
        this.parseExpressionBase(refExpressionErrors),
      );
    }
    return this.allowInAnd(() => this.parseExpressionBase(refExpressionErrors));
  }

  // https://tc39.es/ecma262/#prod-Expression
  parseExpressionBase(
    this: Parser,
    refExpressionErrors?: ExpressionErrors,
  ): N.Expression {
    const startLoc = this.state.startLoc;
    const expr = this.parseMaybeAssign(refExpressionErrors);
    if (this.match(tt.comma)) {
      const node = this.startNodeAt<N.SequenceExpression>(startLoc);
      node.expressions = [expr];
      while (this.eat(tt.comma)) {
        node.expressions.push(this.parseMaybeAssign(refExpressionErrors));
      }
      this.toReferencedList(node.expressions);
      return this.finishNode(node, "SequenceExpression");
    }
    return expr;
  }

  // Set [~In] parameter for assignment expression
  parseMaybeAssignDisallowIn(
    this: Parser,
    refExpressionErrors?: ExpressionErrors | null,
    afterLeftParse?: Function,
  ) {
    return this.disallowInAnd(() =>
      this.parseMaybeAssign(refExpressionErrors, afterLeftParse),
    );
  }

  // Set [+In] parameter for assignment expression
  parseMaybeAssignAllowIn(
    this: Parser,
    refExpressionErrors?: ExpressionErrors | null,
    afterLeftParse?: Function,
  ) {
    return this.allowInAnd(() =>
      this.parseMaybeAssign(refExpressionErrors, afterLeftParse),
    );
  }

  // This method is only used by
  // the typescript and flow plugins.
  setOptionalParametersError(
    refExpressionErrors: ExpressionErrors,
    resultError?: ParseError<any>,
  ) {
    refExpressionErrors.optionalParametersLoc =
      resultError?.loc ?? this.state.startLoc;
  }

  // Parse an assignment expression. This includes applications of
  // operators like `+=`.
  // https://tc39.es/ecma262/#prod-AssignmentExpression
  parseMaybeAssign(
    this: Parser,
    refExpressionErrors?: ExpressionErrors | null,
    afterLeftParse?: Function,
  ): N.Expression {
    const startLoc = this.state.startLoc;
    if (this.isContextual(tt._yield)) {
      if (this.prodParam.hasYield) {
        let left = this.parseYield();
        if (afterLeftParse) {
          left = afterLeftParse.call(this, left, startLoc);
        }
        return left;
      }
    }

    let ownExpressionErrors;
    if (refExpressionErrors) {
      ownExpressionErrors = false;
    } else {
      refExpressionErrors = new ExpressionErrors();
      ownExpressionErrors = true;
    }
    const { type } = this.state;

    if (type === tt.parenL || tokenIsIdentifier(type)) {
      this.state.potentialArrowAt = this.state.start;
    }

    let left = this.parseMaybeConditional(refExpressionErrors);
    if (afterLeftParse) {
      left = afterLeftParse.call(this, left, startLoc);
    }
    if (tokenIsAssignment(this.state.type)) {
      const node = this.startNodeAt<N.AssignmentExpression>(startLoc);
      const operator = this.state.value;
      node.operator = operator;

      if (this.match(tt.eq)) {
        this.toAssignable(left, /* isLHS */ true);
        node.left = left;

        const startIndex = startLoc.index;
        if (
          refExpressionErrors.doubleProtoLoc != null &&
          refExpressionErrors.doubleProtoLoc.index >= startIndex
        ) {
          refExpressionErrors.doubleProtoLoc = null; // reset because double __proto__ is valid in assignment expression
        }
        if (
          refExpressionErrors.shorthandAssignLoc != null &&
          refExpressionErrors.shorthandAssignLoc.index >= startIndex
        ) {
          refExpressionErrors.shorthandAssignLoc = null; // reset because shorthand default was used correctly
        }
        if (
          refExpressionErrors.privateKeyLoc != null &&
          refExpressionErrors.privateKeyLoc.index >= startIndex
        ) {
          this.checkDestructuringPrivate(refExpressionErrors);
          refExpressionErrors.privateKeyLoc = null; // reset because `({ #x: x })` is an assignable pattern
        }
      } else {
        node.left = left as unknown as N.Assignable; // checked a few lines further down
      }

      this.next();
      node.right = this.parseMaybeAssign();
      this.checkLVal(left, this.finishNode(node, "AssignmentExpression"));
      // @ts-expect-error todo(flow->ts) improve node types
      return node;
    } else if (ownExpressionErrors) {
      this.checkExpressionErrors(refExpressionErrors, true);
    }

    return left;
  }

  // Parse a ternary conditional (`?:`) operator.
  // https://tc39.es/ecma262/#prod-ConditionalExpression

  parseMaybeConditional(
    this: Parser,
    refExpressionErrors: ExpressionErrors,
  ): N.Expression {
    const startLoc = this.state.startLoc;
    const potentialArrowAt = this.state.potentialArrowAt;
    const expr = this.parseExprOps(refExpressionErrors);

    if (this.shouldExitDescending(expr, potentialArrowAt)) {
      return expr;
    }

    return this.parseConditional(expr, startLoc, refExpressionErrors);
  }

  parseConditional(
    this: Parser,
    expr: N.Expression,
    startLoc: Position,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    refExpressionErrors?: ExpressionErrors | null,
  ): N.Expression {
    if (this.eat(tt.question)) {
      const node = this.startNodeAt<N.ConditionalExpression>(startLoc);
      node.test = expr;
      node.consequent = this.parseMaybeAssignAllowIn();
      this.expect(tt.colon);
      node.alternate = this.parseMaybeAssign();
      return this.finishNode(node, "ConditionalExpression");
    }
    return expr;
  }

  parseMaybeUnaryOrPrivate(
    this: Parser,
    refExpressionErrors?: ExpressionErrors,
  ): N.Expression | N.PrivateName {
    return this.match(tt.privateName)
      ? this.parsePrivateName()
      : this.parseMaybeUnary(refExpressionErrors);
  }

  // Start the precedence parser.
  // https://tc39.es/ecma262/#prod-ShortCircuitExpression

  parseExprOps(
    this: Parser,
    refExpressionErrors: ExpressionErrors,
  ): N.Expression {
    const startLoc = this.state.startLoc;
    const potentialArrowAt = this.state.potentialArrowAt;
    const expr = this.parseMaybeUnaryOrPrivate(refExpressionErrors);

    if (this.shouldExitDescending(expr, potentialArrowAt)) {
      return expr;
    }

    return this.parseExprOp(expr, startLoc, -1);
  }

  // Parse binary operators with the operator precedence parsing
  // algorithm. `left` is the left-hand side of the operator.
  // `minPrec` provides context that allows the function to stop and
  // defer further parser to one of its callers when it encounters an
  // operator that has a lower precedence than the set it is parsing.

  parseExprOp(
    this: Parser,
    left: N.Expression | N.PrivateName,
    leftStartLoc: Position,
    minPrec: number,
  ): N.Expression {
    if (this.isPrivateName(left)) {
      // https://tc39.es/ecma262/#prod-RelationalExpression
      // RelationalExpression [In, Yield, Await]
      //   [+In] PrivateIdentifier in ShiftExpression[?Yield, ?Await]

      const value = this.getPrivateNameSV(left);

      if (
        minPrec >= tokenOperatorPrecedence(tt._in) ||
        !this.prodParam.hasIn ||
        !this.match(tt._in)
      ) {
        this.raise(Errors.PrivateInExpectedIn, left, {
          identifierName: value,
        });
      }

      this.classScope.usePrivateName(value, left.loc.start);
    }

    const op = this.state.type;
    if (tokenIsOperator(op) && (this.prodParam.hasIn || !this.match(tt._in))) {
      let prec = tokenOperatorPrecedence(op);
      if (prec > minPrec) {
        if (op === tt.pipeline) {
          this.expectPlugin("pipelineOperator");
          if (this.state.inFSharpPipelineDirectBody) {
            // PrivateName must be followed by `in`, but we have `|>`
            return left as N.Expression;
          }
          this.checkPipelineAtInfixOperator(left as N.Expression, leftStartLoc);
        }
        const node = this.startNodeAt<N.LogicalExpression | N.BinaryExpression>(
          leftStartLoc,
        );
        node.left = left;
        node.operator = this.state.value;

        const logical = op === tt.logicalOR || op === tt.logicalAND;
        const coalesce = op === tt.nullishCoalescing;

        if (coalesce) {
          // Handle the precedence of `tt.coalesce` as equal to the range of logical expressions.
          // In other words, `node.right` shouldn't contain logical expressions in order to check the mixed error.
          prec = tokenOperatorPrecedence(tt.logicalAND);
        }

        this.next();

        if (
          !process.env.BABEL_8_BREAKING &&
          op === tt.pipeline &&
          // @ts-expect-error: Only in Babel 7
          this.hasPlugin(["pipelineOperator", { proposal: "minimal" }])
        ) {
          if (this.state.type === tt._await && this.prodParam.hasAwait) {
            throw this.raise(
              Errors.UnexpectedAwaitAfterPipelineBody,
              this.state.startLoc,
            );
          }
        }

        node.right = this.parseExprOpRightExpr(op, prec);
        const finishedNode = this.finishNode(
          node,
          logical || coalesce ? "LogicalExpression" : "BinaryExpression",
        );
        /* this check is for all ?? operators
         * a ?? b && c for this example
         * when op is coalesce and nextOp is logical (&&), throw at the pos of nextOp that it can not be mixed.
         * Symmetrically it also throws when op is logical and nextOp is coalesce
         */
        const nextOp = this.state.type;
        if (
          (coalesce && (nextOp === tt.logicalOR || nextOp === tt.logicalAND)) ||
          (logical && nextOp === tt.nullishCoalescing)
        ) {
          throw this.raise(
            Errors.MixingCoalesceWithLogical,
            this.state.startLoc,
          );
        }

        return this.parseExprOp(finishedNode, leftStartLoc, minPrec);
      }
    }
    // PrivateName is followed by `in` and handled by the previous if statement
    return left as N.Expression;
  }

  // Helper function for `parseExprOp`. Parse the right-hand side of binary-
  // operator expressions, then apply any operator-specific functions.

  parseExprOpRightExpr(
    this: Parser,
    op: TokenType,
    prec: number,
  ): N.Expression {
    const startLoc = this.state.startLoc;
    switch (op) {
      case tt.pipeline:
        switch (this.getPluginOption("pipelineOperator", "proposal")) {
          case "hack":
            return this.withTopicBindingContext(() => {
              return this.parseHackPipeBody();
            });

          case "fsharp":
            return this.withSoloAwaitPermittingContext(() => {
              return this.parseFSharpPipelineBody(prec);
            });
        }

        if (
          !process.env.BABEL_8_BREAKING &&
          // @ts-expect-error: Babel 7 only
          this.getPluginOption("pipelineOperator", "proposal") === "smart"
        ) {
          return this.withTopicBindingContext(() => {
            if (this.prodParam.hasYield && this.isContextual(tt._yield)) {
              throw this.raise(Errors.PipeBodyIsTighter, this.state.startLoc);
            }
            return this.parseSmartPipelineBodyInStyle(
              this.parseExprOpBaseRightExpr(op, prec),
              startLoc,
            );
          });
        }

      // Falls through.
      default:
        return this.parseExprOpBaseRightExpr(op, prec);
    }
  }

  // Helper function for `parseExprOpRightExpr`. Parse the right-hand side of
  // binary-operator expressions without applying any operator-specific functions.

  parseExprOpBaseRightExpr(
    this: Parser,
    op: TokenType,
    prec: number,
  ): N.Expression {
    const startLoc = this.state.startLoc;

    return this.parseExprOp(
      this.parseMaybeUnaryOrPrivate(),
      startLoc,
      tokenIsRightAssociative(op) ? prec - 1 : prec,
    );
  }

  parseHackPipeBody(this: Parser): N.Expression {
    const { startLoc } = this.state;
    const body = this.parseMaybeAssign();
    const requiredParentheses = UnparenthesizedPipeBodyDescriptions.has(
      // @ts-expect-error TS2345: Argument of type 'string' is not assignable to parameter of type '"ArrowFunctionExpression" | "YieldExpression" | "AssignmentExpression" | "ConditionalExpression"'.
      body.type,
    );

    // TODO: Check how to handle type casts in Flow and TS once they are supported
    if (requiredParentheses && !body.extra?.parenthesized) {
      this.raise(Errors.PipeUnparenthesizedBody, startLoc, {
        type: body.type as UnparenthesizedPipeBodyTypes,
      });
    }
    if (!this.topicReferenceWasUsedInCurrentContext()) {
      // A Hack pipe body must use the topic reference at least once.
      this.raise(Errors.PipeTopicUnused, startLoc);
    }

    return body;
  }

  checkExponentialAfterUnary(
    node: N.AwaitExpression | Undone<N.UnaryExpression>,
  ) {
    if (this.match(tt.exponent)) {
      this.raise(Errors.UnexpectedTokenUnaryExponentiation, node.argument);
    }
  }

  // Parse unary operators, both prefix and postfix.
  // https://tc39.es/ecma262/#prod-UnaryExpression
  parseMaybeUnary(
    this: Parser,
    refExpressionErrors?: ExpressionErrors | null,
    sawUnary?: boolean,
  ): N.Expression {
    const startLoc = this.state.startLoc;
    const isAwait = this.isContextual(tt._await);

    if (isAwait && this.recordAwaitIfAllowed()) {
      this.next();
      const expr = this.parseAwait(startLoc);
      if (!sawUnary) this.checkExponentialAfterUnary(expr);
      return expr;
    }
    const update = this.match(tt.incDec);
    const node = this.startNode<N.UnaryExpression | N.UpdateExpression>();
    if (tokenIsPrefix(this.state.type)) {
      node.operator = this.state.value;
      node.prefix = true;

      if (this.match(tt._throw)) {
        this.expectPlugin("throwExpressions");
      }
      const isDelete = this.match(tt._delete);
      this.next();

      node.argument = this.parseMaybeUnary(null, true);

      this.checkExpressionErrors(refExpressionErrors, true);

      if (this.state.strict && isDelete) {
        const arg = node.argument;

        if (arg.type === "Identifier") {
          this.raise(Errors.StrictDelete, node);
        } else if (this.hasPropertyAsPrivateName(arg)) {
          this.raise(Errors.DeletePrivateField, node);
        }
      }

      if (!update) {
        if (!sawUnary) {
          this.checkExponentialAfterUnary(node as Undone<N.UnaryExpression>);
        }
        return this.finishNode(node, "UnaryExpression");
      }
    }

    const expr = this.parseUpdate(
      // @ts-expect-error using "Undone" node as "done"
      node,
      update,
      refExpressionErrors,
    );

    if (isAwait) {
      const { type } = this.state;
      const startsExpr = this.hasPlugin("v8intrinsic")
        ? tokenCanStartExpression(type)
        : tokenCanStartExpression(type) && !this.match(tt.modulo);
      if (startsExpr && !this.isAmbiguousAwait()) {
        this.raiseOverwrite(Errors.AwaitNotInAsyncContext, startLoc);
        return this.parseAwait(startLoc);
      }
    }

    return expr;
  }

  // https://tc39.es/ecma262/#prod-UpdateExpression
  parseUpdate(
    this: Parser,
    node: N.Expression,
    update: boolean,
    refExpressionErrors?: ExpressionErrors | null,
  ): N.Expression {
    if (update) {
      const updateExpressionNode = node as Undone<N.UpdateExpression>;
      this.checkLVal(
        updateExpressionNode.argument,
        this.finishNode(updateExpressionNode, "UpdateExpression"),
      );
      return node;
    }

    const startLoc = this.state.startLoc;
    let expr = this.parseExprSubscripts(refExpressionErrors);
    if (this.checkExpressionErrors(refExpressionErrors, false)) return expr;
    while (tokenIsPostfix(this.state.type) && !this.canInsertSemicolon()) {
      const node = this.startNodeAt<N.UpdateExpression>(startLoc);
      node.operator = this.state.value;
      node.prefix = false;
      node.argument = expr;
      this.next();
      this.checkLVal(expr, (expr = this.finishNode(node, "UpdateExpression")));
    }
    return expr;
  }

  // Parse call, dot, and `[]`-subscript expressions.
  // https://tc39.es/ecma262/#prod-LeftHandSideExpression
  parseExprSubscripts(
    this: Parser,
    refExpressionErrors?: ExpressionErrors | null,
  ): N.Expression {
    const startLoc = this.state.startLoc;
    const potentialArrowAt = this.state.potentialArrowAt;
    const expr = this.parseExprAtom(refExpressionErrors);

    if (this.shouldExitDescending(expr, potentialArrowAt)) {
      return expr;
    }

    return this.parseSubscripts(expr, startLoc);
  }

  parseSubscripts(
    this: Parser,
    base: N.Expression,
    startLoc: Position,
    noCalls?: boolean | null,
  ): N.Expression {
    const state = {
      optionalChainMember: false,
      maybeAsyncArrow: this.atPossibleAsyncArrow(base),
      stop: false,
    };
    do {
      base = this.parseSubscript(base, startLoc, noCalls, state);

      // After parsing a subscript, this isn't "async" for sure.
      state.maybeAsyncArrow = false;
    } while (!state.stop);
    return base;
  }

  /**
   * @param state Set 'state.stop = true' to indicate that we should stop parsing subscripts.
   *   state.optionalChainMember to indicate that the member is currently in OptionalChain
   */
  parseSubscript(
    this: Parser,
    base: N.Expression,
    startLoc: Position,
    noCalls: boolean | undefined | null,
    state: N.ParseSubscriptState,
  ): N.Expression {
    const { type } = this.state;
    if (!noCalls && type === tt.doubleColon) {
      return this.parseBind(base, startLoc, noCalls, state);
    } else if (tokenIsTemplate(type)) {
      return this.parseTaggedTemplateExpression(base, startLoc, state);
    }

    let optional = false;

    if (type === tt.questionDot) {
      if (noCalls) {
        this.raise(Errors.OptionalChainingNoNew, this.state.startLoc);
        if (this.lookaheadCharCode() === charCodes.leftParenthesis) {
          // stop at `?.` when parsing `new a?.()`
          state.stop = true;
          return base;
        }
      }
      state.optionalChainMember = optional = true;
      this.next();
    }

    if (!noCalls && this.match(tt.parenL)) {
      return this.parseCoverCallAndAsyncArrowHead(
        base,
        startLoc,
        state,
        optional,
      );
    } else {
      const computed = this.eat(tt.bracketL);
      if (computed || optional || this.eat(tt.dot)) {
        return this.parseMember(base, startLoc, state, computed, optional);
      } else {
        state.stop = true;
        return base;
      }
    }
  }

  // base[?Yield, ?Await] [ Expression[+In, ?Yield, ?Await] ]
  // base[?Yield, ?Await] . IdentifierName
  // base[?Yield, ?Await] . PrivateIdentifier
  //   where `base` is one of CallExpression, MemberExpression and OptionalChain
  parseMember(
    this: Parser,
    base: N.Expression,
    startLoc: Position,
    state: N.ParseSubscriptState,
    computed: boolean,
    optional: boolean,
  ): N.OptionalMemberExpression | N.MemberExpression {
    const node = this.startNodeAt<
      N.OptionalMemberExpression | N.MemberExpression
    >(startLoc);
    node.object = base;
    node.computed = computed;
    if (computed) {
      node.property = this.parseExpression();
      this.expect(tt.bracketR);
    } else if (this.match(tt.privateName)) {
      if (base.type === "Super") {
        this.raise(Errors.SuperPrivateField, startLoc);
      }
      this.classScope.usePrivateName(this.state.value, this.state.startLoc);
      node.property = this.parsePrivateName();
    } else {
      node.property = this.parseIdentifier(true);
    }

    if (state.optionalChainMember) {
      (node as N.OptionalMemberExpression).optional = optional;
      return this.finishNode(node, "OptionalMemberExpression");
    } else {
      return this.finishNode(node, "MemberExpression");
    }
  }

  // https://github.com/tc39/proposal-bind-operator#syntax
  parseBind(
    this: Parser,
    base: N.Expression,
    startLoc: Position,
    noCalls: boolean | undefined | null,
    state: N.ParseSubscriptState,
  ): N.Expression {
    const node = this.startNodeAt<N.BindExpression>(startLoc);
    node.object = base;
    this.next(); // eat '::'
    node.callee = this.parseNoCallExpr();
    state.stop = true;
    return this.parseSubscripts(
      this.finishNode(node, "BindExpression"),
      startLoc,
      noCalls,
    );
  }

  // https://tc39.es/ecma262/#prod-CoverCallExpressionAndAsyncArrowHead
  // CoverCallExpressionAndAsyncArrowHead
  // CallExpression[?Yield, ?Await] Arguments[?Yield, ?Await]
  // OptionalChain[?Yield, ?Await] Arguments[?Yield, ?Await]
  parseCoverCallAndAsyncArrowHead(
    this: Parser,
    base: N.Expression,
    startLoc: Position,
    state: N.ParseSubscriptState,
    optional: boolean,
  ): N.Expression {
    const oldMaybeInArrowParameters = this.state.maybeInArrowParameters;
    let refExpressionErrors: ExpressionErrors | null = null;

    this.state.maybeInArrowParameters = true;
    this.next(); // eat `(`

    const node = this.startNodeAt<N.CallExpression | N.OptionalCallExpression>(
      startLoc,
    );
    node.callee = base;
    const { maybeAsyncArrow, optionalChainMember } = state;

    if (maybeAsyncArrow) {
      this.expressionScope.enter(newAsyncArrowScope());
      refExpressionErrors = new ExpressionErrors();
    }

    if (optionalChainMember) {
      // @ts-expect-error when optionalChainMember is true, node must be an optional call
      node.optional = optional;
    }

    if (optional) {
      node.arguments = this.parseCallExpressionArguments(tt.parenR);
    } else {
      node.arguments = this.parseCallExpressionArguments(
        tt.parenR,
        base.type !== "Super",
        node,
        refExpressionErrors,
      );
    }
    let finishedNode:
      | N.CallExpression
      | N.OptionalCallExpression
      | N.ArrowFunctionExpression = this.finishCallExpression(
      node,
      optionalChainMember,
    );

    if (maybeAsyncArrow && this.shouldParseAsyncArrow() && !optional) {
      /*:: invariant(refExpressionErrors != null) */
      state.stop = true;
      this.checkDestructuringPrivate(refExpressionErrors);
      this.expressionScope.validateAsPattern();
      this.expressionScope.exit();
      finishedNode = this.parseAsyncArrowFromCallExpression(
        this.startNodeAt<N.ArrowFunctionExpression>(startLoc),
        finishedNode as N.CallExpression,
      );
    } else {
      if (maybeAsyncArrow) {
        this.checkExpressionErrors(refExpressionErrors, true);
        this.expressionScope.exit();
      }
      this.toReferencedArguments(finishedNode);
    }

    this.state.maybeInArrowParameters = oldMaybeInArrowParameters;

    return finishedNode;
  }

  toReferencedArguments(
    node: N.CallExpression | N.OptionalCallExpression,
    isParenthesizedExpr?: boolean,
  ) {
    this.toReferencedListDeep(node.arguments, isParenthesizedExpr);
  }

  // MemberExpression [?Yield, ?Await] TemplateLiteral[?Yield, ?Await, +Tagged]
  // CallExpression [?Yield, ?Await] TemplateLiteral[?Yield, ?Await, +Tagged]
  parseTaggedTemplateExpression(
    this: Parser,
    base: N.Expression,
    startLoc: Position,
    state: N.ParseSubscriptState,
  ): N.TaggedTemplateExpression {
    const node = this.startNodeAt<N.TaggedTemplateExpression>(startLoc);
    node.tag = base;
    node.quasi = this.parseTemplate(true);
    if (state.optionalChainMember) {
      this.raise(Errors.OptionalChainingNoTemplate, startLoc);
    }
    return this.finishNode(node, "TaggedTemplateExpression");
  }

  atPossibleAsyncArrow(base: N.Expression): boolean {
    return (
      base.type === "Identifier" &&
      base.name === "async" &&
      this.state.lastTokEndLoc.index === base.end &&
      !this.canInsertSemicolon() &&
      // check there are no escape sequences, such as \u{61}sync
      base.end - base.start === 5 &&
      this.offsetToSourcePos(base.start) === this.state.potentialArrowAt
    );
  }

  finishCallExpression<T extends N.CallExpression | N.OptionalCallExpression>(
    node: Undone<T>,
    optional: boolean,
  ): T {
    if (node.callee.type === "Import") {
      if (node.arguments.length === 0 || node.arguments.length > 2) {
        this.raise(Errors.ImportCallArity, node);
      } else {
        for (const arg of node.arguments) {
          if (arg.type === "SpreadElement") {
            this.raise(Errors.ImportCallSpreadArgument, arg);
          }
        }
      }
    }
    return this.finishNode(
      node,
      optional ? "OptionalCallExpression" : "CallExpression",
    );
  }

  parseCallExpressionArguments(
    this: Parser,
    close: TokenType,
    allowPlaceholder?: boolean,
    nodeForExtra?: Undone<N.Node> | null,
    refExpressionErrors?: ExpressionErrors | null,
  ): Array<N.Expression> {
    const elts: N.Expression[] = [];
    let first = true;
    const oldInFSharpPipelineDirectBody = this.state.inFSharpPipelineDirectBody;
    this.state.inFSharpPipelineDirectBody = false;

    while (!this.eat(close)) {
      if (first) {
        first = false;
      } else {
        this.expect(tt.comma);
        if (this.match(close)) {
          if (nodeForExtra) {
            this.addTrailingCommaExtraToNode(nodeForExtra);
          }
          this.next();
          break;
        }
      }

      elts.push(
        this.parseExprListItem(false, refExpressionErrors, allowPlaceholder),
      );
    }

    this.state.inFSharpPipelineDirectBody = oldInFSharpPipelineDirectBody;

    return elts;
  }

  shouldParseAsyncArrow(): boolean {
    return this.match(tt.arrow) && !this.canInsertSemicolon();
  }

  parseAsyncArrowFromCallExpression(
    this: Parser,
    node: Undone<N.ArrowFunctionExpression>,
    call: N.CallExpression,
  ): N.ArrowFunctionExpression {
    this.resetPreviousNodeTrailingComments(call);
    this.expect(tt.arrow);
    this.parseArrowExpression(
      node,
      call.arguments,
      true,
      call.extra?.trailingCommaLoc,
    );
    // mark inner comments of `async()` as inner comments of `async () =>`
    if (call.innerComments) {
      setInnerComments(node, call.innerComments);
    }
    // mark trailing comments of `async` to be inner comments
    if (call.callee.trailingComments) {
      setInnerComments(node, call.callee.trailingComments);
    }
    return node as N.ArrowFunctionExpression;
  }

  // Parse a no-call expression (like argument of `new` or `::` operators).
  // https://tc39.es/ecma262/#prod-MemberExpression
  parseNoCallExpr(this: Parser): N.Expression {
    const startLoc = this.state.startLoc;
    return this.parseSubscripts(this.parseExprAtom(), startLoc, true);
  }

  // Parse an atomic expression — either a single token that is an
  // expression, an expression started by a keyword like `function` or
  // `new`, or an expression wrapped in punctuation like `()`, `[]`,
  // or `{}`.

  // https://tc39.es/ecma262/#prod-PrimaryExpression
  // https://tc39.es/ecma262/#prod-AsyncArrowFunction
  // PrimaryExpression
  // Super
  // Import
  // AsyncArrowFunction

  parseExprAtom(
    this: Parser,
    refExpressionErrors?: ExpressionErrors | null,
  ): N.Expression {
    let node;
    let decorators: N.Decorator[] | null = null;

    const { type } = this.state;
    switch (type) {
      case tt._super:
        return this.parseSuper();

      case tt._import:
        node = this.startNode<N.MetaProperty | N.Import | N.ImportExpression>();
        this.next();

        if (this.match(tt.dot)) {
          return this.parseImportMetaProperty(node as Undone<N.MetaProperty>);
        }

        if (this.match(tt.parenL)) {
          if (this.optionFlags & OptionFlags.CreateImportExpressions) {
            return this.parseImportCall(node as Undone<N.ImportExpression>);
          } else {
            return this.finishNode(node, "Import");
          }
        } else {
          this.raise(Errors.UnsupportedImport, this.state.lastTokStartLoc);
          return this.finishNode(node, "Import");
        }

      case tt._this:
        node = this.startNode<N.ThisExpression>();
        this.next();
        return this.finishNode(node, "ThisExpression");

      case tt._do: {
        return this.parseDo(this.startNode(), false);
      }

      case tt.slash:
      case tt.slashAssign: {
        this.readRegexp();
        return this.parseRegExpLiteral(this.state.value);
      }

      case tt.num:
        return this.parseNumericLiteral(this.state.value);

      case tt.bigint:
        return this.parseBigIntLiteral(this.state.value);

      case tt.string:
        return this.parseStringLiteral(this.state.value);

      case tt._null:
        return this.parseNullLiteral();

      case tt._true:
        return this.parseBooleanLiteral(true);
      case tt._false:
        return this.parseBooleanLiteral(false);

      case tt.parenL: {
        const canBeArrow = this.state.potentialArrowAt === this.state.start;
        return this.parseParenAndDistinguishExpression(canBeArrow);
      }

      case tt.bracketBarL:
      case tt.bracketHashL: {
        return this.parseArrayLike(
          this.state.type === tt.bracketBarL ? tt.bracketBarR : tt.bracketR,
          /* canBePattern */ false,
          /* isTuple */ true,
        );
      }
      case tt.bracketL: {
        return this.parseArrayLike(
          tt.bracketR,
          /* canBePattern */ true,
          /* isTuple */ false,
          refExpressionErrors,
        );
      }
      case tt.braceBarL:
      case tt.braceHashL: {
        return this.parseObjectLike(
          this.state.type === tt.braceBarL ? tt.braceBarR : tt.braceR,
          /* isPattern */ false,
          /* isRecord */ true,
        );
      }
      case tt.braceL: {
        return this.parseObjectLike(
          tt.braceR,
          /* isPattern */ false,
          /* isRecord */ false,
          refExpressionErrors,
        );
      }
      case tt._function:
        return this.parseFunctionOrFunctionSent();

      case tt.at:
        decorators = this.parseDecorators();
      // fall through
      case tt._class:
        return this.parseClass(
          this.maybeTakeDecorators(
            decorators,
            this.startNode<N.ClassExpression>(),
          ),
          false,
        );

      case tt._new:
        return this.parseNewOrNewTarget();

      case tt.templateNonTail:
      case tt.templateTail:
        return this.parseTemplate(false);

      // BindExpression[Yield]
      //   :: MemberExpression[?Yield]
      case tt.doubleColon: {
        node = this.startNode<N.BindExpression>();
        this.next();
        node.object = null;
        const callee = (node.callee = this.parseNoCallExpr());
        if (callee.type === "MemberExpression") {
          return this.finishNode(node, "BindExpression");
        } else {
          throw this.raise(Errors.UnsupportedBind, callee);
        }
      }

      case tt.privateName: {
        // Standalone private names are only allowed in "#x in obj"
        // expressions, and they are directly handled by callers of
        // parseExprOp. If we reach this, the input is always invalid.
        // We can throw a better error message and recover, rather than
        // just throwing "Unexpected token" (which is the default
        // behavior of this big switch statement).
        this.raise(Errors.PrivateInExpectedIn, this.state.startLoc, {
          identifierName: this.state.value,
        });
        return this.parsePrivateName() as unknown as N.Expression;
      }

      case tt.moduloAssign: {
        return this.parseTopicReferenceThenEqualsSign(tt.modulo, "%");
      }

      case tt.xorAssign: {
        return this.parseTopicReferenceThenEqualsSign(tt.bitwiseXOR, "^");
      }

      case tt.doubleCaret:
      case tt.doubleAt: {
        return this.parseTopicReference("hack");
      }

      case tt.bitwiseXOR:
      case tt.modulo:
      case tt.hash: {
        const pipeProposal = this.getPluginOption(
          "pipelineOperator",
          "proposal",
        );

        if (pipeProposal) {
          return this.parseTopicReference(pipeProposal);
        }
        this.unexpected();
        break;
      }

      case tt.lt: {
        const lookaheadCh = this.input.codePointAt(this.nextTokenStart());
        if (
          isIdentifierStart(lookaheadCh) || // Element/Type Parameter <foo>
          lookaheadCh === charCodes.greaterThan // Fragment <>
        ) {
          this.expectOnePlugin(["jsx", "flow", "typescript"]);
        } else {
          this.unexpected();
        }
        break;
      }

      default:
        if (!process.env.BABEL_8_BREAKING && type === tt.decimal) {
          return this.parseDecimalLiteral(this.state.value);
        }

        if (tokenIsIdentifier(type)) {
          if (
            this.isContextual(tt._module) &&
            this.lookaheadInLineCharCode() === charCodes.leftCurlyBrace
          ) {
            return this.parseModuleExpression();
          }
          const canBeArrow = this.state.potentialArrowAt === this.state.start;
          const containsEsc = this.state.containsEsc;
          const id = this.parseIdentifier();

          if (
            !containsEsc &&
            id.name === "async" &&
            !this.canInsertSemicolon()
          ) {
            const { type } = this.state;
            if (type === tt._function) {
              this.resetPreviousNodeTrailingComments(id);
              this.next();
              return this.parseAsyncFunctionExpression(
                this.startNodeAtNode(id),
              );
            } else if (tokenIsIdentifier(type)) {
              // If the next token begins with "=", commit to parsing an async
              // arrow function. (Peeking ahead for "=" lets us avoid a more
              // expensive full-token lookahead on this common path.)
              if (this.lookaheadCharCode() === charCodes.equalsTo) {
                // although `id` is not used in async arrow unary function,
                // we don't need to reset `async`'s trailing comments because
                // it will be attached to the upcoming async arrow binding identifier
                return this.parseAsyncArrowUnaryFunction(
                  this.startNodeAtNode(id),
                );
              } else {
                // Otherwise, treat "async" as an identifier and let calling code
                // deal with the current tt.name token.
                return id;
              }
            } else if (type === tt._do) {
              this.resetPreviousNodeTrailingComments(id);
              return this.parseDo(this.startNodeAtNode(id), true);
            }
          }

          if (
            canBeArrow &&
            this.match(tt.arrow) &&
            !this.canInsertSemicolon()
          ) {
            this.next();
            return this.parseArrowExpression(
              this.startNodeAtNode(id),
              [id],
              false,
            );
          }

          return id;
        } else {
          this.unexpected();
        }
    }
  }

  // This helper method should only be called
  // when the parser has reached a potential Hack pipe topic token
  // that is followed by an equals sign.
  // See <https://github.com/js-choi/proposal-hack-pipes>.
  // If we find ^= or %= in an expression position
  // (i.e., the tt.moduloAssign or tt.xorAssign token types), and if the
  // Hack-pipes proposal is active with ^ or % as its topicToken, then the ^ or
  // % could be the topic token (e.g., in x |> ^==y or x |> ^===y), and so we
  // reparse the current token as ^ or %.
  // Otherwise, this throws an unexpected-token error.
  parseTopicReferenceThenEqualsSign(
    topicTokenType: TokenType,
    topicTokenValue: string,
  ): N.Expression {
    const pipeProposal = this.getPluginOption("pipelineOperator", "proposal");

    if (pipeProposal) {
      // Set the most-recent token to be a topic token
      // given by the tokenType and tokenValue.
      // Now the next readToken() call (in parseTopicReference)
      // will consume that “topic token”.
      this.state.type = topicTokenType;
      this.state.value = topicTokenValue;
      // Rewind the tokenizer to the end of the “topic token”, so that the
      // following token starts at the equals sign after that topic token.
      this.state.pos--;
      this.state.end--;
      // This is safe to do since the preceding character was either ^ or %, and
      // thus not a newline.
      this.state.endLoc = createPositionWithColumnOffset(this.state.endLoc, -1);
      // Now actually consume the topic token.
      return this.parseTopicReference(pipeProposal);
    } else {
      this.unexpected();
    }
  }

  // This helper method should only be called
  // when the proposal-pipeline-operator plugin is active,
  // and when the parser has reached a potential Hack pipe topic token.
  // Although a pipe-operator proposal is assumed to be active,
  // its configuration might not match the current token’s type.
  // See <https://github.com/js-choi/proposal-hack-pipes>.
  parseTopicReference(pipeProposal: string): N.Expression {
    const node = this.startNode<N.TopicReference>();
    const startLoc = this.state.startLoc;
    const tokenType = this.state.type;

    // Consume the current token.
    this.next();

    // If the pipe-operator plugin’s configuration matches the current token’s type,
    // then this will return `node`, will have been finished as a topic reference.
    // Otherwise, this will throw a `PipeTopicUnconfiguredToken` error.
    return this.finishTopicReference(node, startLoc, pipeProposal, tokenType);
  }

  // This helper method attempts to finish the given `node`
  // into a topic-reference node for the given `pipeProposal`.
  // See <https://github.com/js-choi/proposal-hack-pipes>.
  //
  // The method assumes that any topic token was consumed before it was called.
  //
  // If the `pipelineOperator` plugin is active,
  // and if the given `tokenType` matches the plugin’s configuration,
  // then this method will return the finished `node`.
  //
  // If the `pipelineOperator` plugin is active,
  // but if the given `tokenType` does not match the plugin’s configuration,
  // then this method will throw a `PipeTopicUnconfiguredToken` error.
  finishTopicReference<
    T extends N.PipelinePrimaryTopicReference | N.TopicReference,
  >(
    node: Undone<T>,
    startLoc: Position,
    pipeProposal: string,
    tokenType: TokenType,
  ): T {
    if (
      this.testTopicReferenceConfiguration(pipeProposal, startLoc, tokenType)
    ) {
      // The token matches the plugin’s configuration.
      // The token is therefore a topic reference.

      if (process.env.BABEL_8_BREAKING || pipeProposal === "hack") {
        if (!this.topicReferenceIsAllowedInCurrentContext()) {
          this.raise(Errors.PipeTopicUnbound, startLoc);
        }

        // Register the topic reference so that its pipe body knows
        // that its topic was used at least once.
        this.registerTopicReference();

        return this.finishNode(node, "TopicReference");
      } else {
        // pipeProposal is "smart"

        if (!this.topicReferenceIsAllowedInCurrentContext()) {
          this.raise(Errors.PrimaryTopicNotAllowed, startLoc);
        }
        this.registerTopicReference();
        return this.finishNode(node, "PipelinePrimaryTopicReference");
      }
    } else {
      // The token does not match the plugin’s configuration.
      throw this.raise(Errors.PipeTopicUnconfiguredToken, startLoc, {
        token: tokenLabelName(tokenType),
      });
    }
  }

  // This helper method tests whether the given token type
  // matches the pipelineOperator parser plugin’s configuration.
  // If the active pipe proposal is Hack style,
  // and if the given token is the same as the plugin configuration’s `topicToken`,
  // then this is a valid topic reference.
  // If the active pipe proposal is smart mix,
  // then the topic token must always be `#`.
  // If the active pipe proposal is neither (e.g., "minimal"(Babel 7) or "fsharp"),
  // then an error is thrown.
  testTopicReferenceConfiguration(
    pipeProposal: string,
    startLoc: Position,
    tokenType: TokenType,
  ): boolean {
    switch (pipeProposal) {
      case "hack": {
        return this.hasPlugin([
          "pipelineOperator",
          {
            // @ts-expect-error token must have a label
            topicToken: tokenLabelName(tokenType),
          },
        ]);
      }
      case "smart":
        return tokenType === tt.hash;
      default:
        throw this.raise(Errors.PipeTopicRequiresHackPipes, startLoc);
    }
  }

  // async [no LineTerminator here] AsyncArrowBindingIdentifier[?Yield] [no LineTerminator here] => AsyncConciseBody[?In]
  parseAsyncArrowUnaryFunction(
    this: Parser,
    node: Undone<N.ArrowFunctionExpression>,
  ): N.ArrowFunctionExpression {
    // We don't need to push a new ParameterDeclarationScope here since we are sure
    // 1) it is an async arrow, 2) no biding pattern is allowed in params
    this.prodParam.enter(functionFlags(true, this.prodParam.hasYield));
    const params = [this.parseIdentifier()];
    this.prodParam.exit();
    if (this.hasPrecedingLineBreak()) {
      this.raise(Errors.LineTerminatorBeforeArrow, this.state.curPosition());
    }
    this.expect(tt.arrow);
    // let foo = async bar => {};
    return this.parseArrowExpression(node, params, true);
  }

  // https://github.com/tc39/proposal-do-expressions
  // https://github.com/tc39/proposal-async-do-expressions
  parseDo(
    this: Parser,
    node: Undone<N.DoExpression>,
    isAsync: boolean,
  ): N.DoExpression {
    this.expectPlugin("doExpressions");
    if (isAsync) {
      this.expectPlugin("asyncDoExpressions");
    }
    node.async = isAsync;
    this.next(); // eat `do`
    const oldLabels = this.state.labels;
    this.state.labels = [];
    if (isAsync) {
      // AsyncDoExpression :
      // async [no LineTerminator here] do Block[~Yield, +Await, ~Return]
      this.prodParam.enter(ParamKind.PARAM_AWAIT);
      node.body = this.parseBlock();
      this.prodParam.exit();
    } else {
      node.body = this.parseBlock();
    }

    this.state.labels = oldLabels;
    return this.finishNode(node, "DoExpression");
  }

  // Parse the `super` keyword
  parseSuper(): N.Super {
    const node = this.startNode<N.Super>();
    this.next(); // eat `super`
    if (
      this.match(tt.parenL) &&
      !this.scope.allowDirectSuper &&
      !(this.optionFlags & OptionFlags.AllowSuperOutsideMethod)
    ) {
      this.raise(Errors.SuperNotAllowed, node);
    } else if (
      !this.scope.allowSuper &&
      !(this.optionFlags & OptionFlags.AllowSuperOutsideMethod)
    ) {
      this.raise(Errors.UnexpectedSuper, node);
    }

    if (
      !this.match(tt.parenL) &&
      !this.match(tt.bracketL) &&
      !this.match(tt.dot)
    ) {
      this.raise(Errors.UnsupportedSuper, node);
    }

    return this.finishNode(node, "Super");
  }

  parsePrivateName(): N.PrivateName {
    const node = this.startNode<N.PrivateName>();
    const id = this.startNodeAt<N.Identifier>(
      // The position is hardcoded because we merge `#` and name into a single
      // tt.privateName token
      createPositionWithColumnOffset(this.state.startLoc, 1),
    );
    const name = this.state.value;
    this.next(); // eat #name;
    node.id = this.createIdentifier(id, name);
    return this.finishNode(node, "PrivateName");
  }

  parseFunctionOrFunctionSent(
    this: Parser,
  ): N.FunctionExpression | N.MetaProperty {
    const node = this.startNode<N.FunctionExpression | N.MetaProperty>();

    // We do not do parseIdentifier here because when parseFunctionOrFunctionSent
    // is called we already know that the current token is a "name" with the value "function"
    // This will improve perf a tiny little bit as we do not do validation but more importantly
    // here is that parseIdentifier will remove an item from the expression stack
    // if "function" or "class" is parsed as identifier (in objects e.g.), which should not happen here.
    this.next(); // eat `function`

    if (this.prodParam.hasYield && this.match(tt.dot)) {
      const meta = this.createIdentifier(
        this.startNodeAtNode<N.Identifier>(node),
        "function",
      );
      this.next(); // eat `.`
      // https://github.com/tc39/proposal-function.sent#syntax-1
      if (this.match(tt._sent)) {
        this.expectPlugin("functionSent");
      } else if (!this.hasPlugin("functionSent")) {
        // The code wasn't `function.sent` but just `function.`, so a simple error is less confusing.
        this.unexpected();
      }
      return this.parseMetaProperty(
        node as Undone<N.MetaProperty>,
        meta,
        "sent",
      );
    }
    return this.parseFunction(node as Undone<N.FunctionExpression>);
  }

  parseMetaProperty(
    node: Undone<N.MetaProperty>,
    meta: N.Identifier,
    propertyName: string,
  ): N.MetaProperty {
    node.meta = meta;

    const containsEsc = this.state.containsEsc;

    node.property = this.parseIdentifier(true);

    if (node.property.name !== propertyName || containsEsc) {
      this.raise(Errors.UnsupportedMetaProperty, node.property, {
        target: meta.name,
        onlyValidPropertyName: propertyName,
      });
    }

    return this.finishNode(node, "MetaProperty");
  }

  // https://tc39.es/ecma262/#prod-ImportMeta
  parseImportMetaProperty(
    this: Parser,
    node: Undone<N.MetaProperty | N.ImportExpression>,
  ): N.MetaProperty | N.ImportExpression {
    const id = this.createIdentifier(
      this.startNodeAtNode<N.Identifier>(node),
      "import",
    );
    this.next(); // eat `.`

    if (this.isContextual(tt._meta)) {
      if (!this.inModule) {
        this.raise(Errors.ImportMetaOutsideModule, id);
      }
      this.sawUnambiguousESM = true;
    } else if (this.isContextual(tt._source) || this.isContextual(tt._defer)) {
      const isSource = this.isContextual(tt._source);

      this.expectPlugin(
        isSource ? "sourcePhaseImports" : "deferredImportEvaluation",
      );
      if (!(this.optionFlags & OptionFlags.CreateImportExpressions)) {
        throw this.raise(
          Errors.DynamicImportPhaseRequiresImportExpressions,
          this.state.startLoc,
          {
            phase: this.state.value,
          },
        );
      }
      this.next();
      (node as Undone<N.ImportExpression>).phase = isSource
        ? "source"
        : "defer";
      return this.parseImportCall(node as Undone<N.ImportExpression>);
    }

    return this.parseMetaProperty(node as Undone<N.MetaProperty>, id, "meta");
  }

  parseLiteralAtNode<T extends N.Node>(
    value: any,
    type: T["type"],
    node: any,
  ): T {
    this.addExtra(node, "rawValue", value);
    this.addExtra(
      node,
      "raw",
      this.input.slice(this.offsetToSourcePos(node.start), this.state.end),
    );
    node.value = value;
    this.next();
    return this.finishNode<T>(node, type);
  }

  parseLiteral<T extends N.Node>(value: any, type: T["type"]): T {
    const node = this.startNode();
    return this.parseLiteralAtNode(value, type, node);
  }

  parseStringLiteral(value: any) {
    return this.parseLiteral<N.StringLiteral>(value, "StringLiteral");
  }

  parseNumericLiteral(value: any) {
    return this.parseLiteral<N.NumericLiteral>(value, "NumericLiteral");
  }

  parseBigIntLiteral(value: any) {
    return this.parseLiteral<N.BigIntLiteral>(value, "BigIntLiteral");
  }

  // TODO: Remove this in Babel 8
  parseDecimalLiteral(value: any) {
    return this.parseLiteral<N.DecimalLiteral>(value, "DecimalLiteral");
  }

  parseRegExpLiteral(value: {
    value: any;
    pattern: string;
    flags: N.RegExpLiteral["flags"];
  }) {
    const node = this.startNode<N.RegExpLiteral>();
    this.addExtra(
      node,
      "raw",
      this.input.slice(this.offsetToSourcePos(node.start), this.state.end),
    );
    node.pattern = value.pattern;
    node.flags = value.flags;
    this.next();
    return this.finishNode(node, "RegExpLiteral");
  }

  parseBooleanLiteral(value: boolean) {
    const node = this.startNode<N.BooleanLiteral>();
    node.value = value;
    this.next();
    return this.finishNode(node, "BooleanLiteral");
  }

  parseNullLiteral() {
    const node = this.startNode<N.NullLiteral>();
    this.next();
    return this.finishNode(node, "NullLiteral");
  }

  // https://tc39.es/ecma262/#prod-CoverParenthesizedExpressionAndArrowParameterList
  parseParenAndDistinguishExpression(
    this: Parser,
    canBeArrow: boolean,
  ): N.Expression {
    const startLoc = this.state.startLoc;

    let val;
    this.next(); // eat `(`
    this.expressionScope.enter(newArrowHeadScope());

    const oldMaybeInArrowParameters = this.state.maybeInArrowParameters;
    const oldInFSharpPipelineDirectBody = this.state.inFSharpPipelineDirectBody;
    this.state.maybeInArrowParameters = true;
    this.state.inFSharpPipelineDirectBody = false;

    const innerStartLoc = this.state.startLoc;
    const exprList: (N.Expression | N.RestElement)[] = [];
    const refExpressionErrors = new ExpressionErrors();
    let first = true;
    let spreadStartLoc;
    let optionalCommaStartLoc;

    while (!this.match(tt.parenR)) {
      if (first) {
        first = false;
      } else {
        this.expect(
          tt.comma,
          refExpressionErrors.optionalParametersLoc === null
            ? null
            : refExpressionErrors.optionalParametersLoc,
        );
        if (this.match(tt.parenR)) {
          optionalCommaStartLoc = this.state.startLoc;
          break;
        }
      }

      if (this.match(tt.ellipsis)) {
        const spreadNodeStartLoc = this.state.startLoc;
        spreadStartLoc = this.state.startLoc;
        exprList.push(
          this.parseParenItem(this.parseRestBinding(), spreadNodeStartLoc),
        );

        if (!this.checkCommaAfterRest(charCodes.rightParenthesis)) {
          break;
        }
      } else {
        exprList.push(
          this.parseMaybeAssignAllowIn(
            refExpressionErrors,
            this.parseParenItem,
          ),
        );
      }
    }

    const innerEndLoc = this.state.lastTokEndLoc;
    this.expect(tt.parenR);

    this.state.maybeInArrowParameters = oldMaybeInArrowParameters;
    this.state.inFSharpPipelineDirectBody = oldInFSharpPipelineDirectBody;

    let arrowNode = this.startNodeAt<N.ArrowFunctionExpression>(startLoc);
    if (
      canBeArrow &&
      this.shouldParseArrow(exprList) &&
      (arrowNode = this.parseArrow(arrowNode))
    ) {
      this.checkDestructuringPrivate(refExpressionErrors);
      this.expressionScope.validateAsPattern();
      this.expressionScope.exit();
      this.parseArrowExpression(arrowNode, exprList, false);
      // @ts-expect-error todo(flow->ts) improve node types
      return arrowNode;
    }
    this.expressionScope.exit();

    if (!exprList.length) {
      this.unexpected(this.state.lastTokStartLoc);
    }
    if (optionalCommaStartLoc) this.unexpected(optionalCommaStartLoc);
    if (spreadStartLoc) this.unexpected(spreadStartLoc);
    this.checkExpressionErrors(refExpressionErrors, true);

    this.toReferencedListDeep(exprList, /* isParenthesizedExpr */ true);
    if (exprList.length > 1) {
      val = this.startNodeAt<N.SequenceExpression>(innerStartLoc);
      val.expressions = exprList as N.Expression[];
      // finish node at current location so it can pick up comments after `)`
      this.finishNode(val, "SequenceExpression");
      this.resetEndLocation(val, innerEndLoc);
    } else {
      val = exprList[0];
    }

    return this.wrapParenthesis(
      startLoc,
      // @ts-expect-error todo(flow->ts)
      val,
    );
  }

  wrapParenthesis(startLoc: Position, expression: N.Expression): N.Expression {
    if (!(this.optionFlags & OptionFlags.CreateParenthesizedExpressions)) {
      this.addExtra(expression, "parenthesized", true);
      this.addExtra(expression, "parenStart", startLoc.index);

      this.takeSurroundingComments(
        expression,
        startLoc.index,
        this.state.lastTokEndLoc.index,
      );

      return expression;
    }

    const parenExpression =
      this.startNodeAt<N.ParenthesizedExpression>(startLoc);
    parenExpression.expression = expression;
    return this.finishNode(parenExpression, "ParenthesizedExpression");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- `params` is used in typescript plugin
  shouldParseArrow(params: Array<N.Node>): boolean {
    return !this.canInsertSemicolon();
  }

  parseArrow(
    node: Undone<N.ArrowFunctionExpression>,
  ): Undone<N.ArrowFunctionExpression> | undefined {
    if (this.eat(tt.arrow)) {
      return node;
    }
  }

  parseParenItem<T extends N.Expression | N.RestElement | N.SpreadElement>(
    node: T,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    startLoc: Position,
  ): T | N.TypeCastExpression | N.TsTypeCastExpression {
    return node;
  }

  parseNewOrNewTarget(this: Parser): N.NewExpression | N.MetaProperty {
    const node = this.startNode<N.NewExpression | N.MetaProperty>();
    this.next();
    if (this.match(tt.dot)) {
      // https://tc39.es/ecma262/#prod-NewTarget
      const meta = this.createIdentifier(
        this.startNodeAtNode<N.Identifier>(node),
        "new",
      );
      this.next();
      const metaProp = this.parseMetaProperty(
        node as Undone<N.MetaProperty>,
        meta,
        "target",
      );

      if (
        !this.scope.inNonArrowFunction &&
        !this.scope.inClass &&
        !(this.optionFlags & OptionFlags.AllowNewTargetOutsideFunction)
      ) {
        this.raise(Errors.UnexpectedNewTarget, metaProp);
      }

      return metaProp;
    }

    return this.parseNew(node as Undone<N.NewExpression>);
  }

  // New's precedence is slightly tricky. It must allow its argument to
  // be a `[]` or dot subscript expression, but not a call — at least,
  // not without wrapping it in parentheses. Thus, it uses the noCalls
  // argument to parseSubscripts to prevent it from consuming the
  // argument list.
  // https://tc39.es/ecma262/#prod-NewExpression
  parseNew(this: Parser, node: Undone<N.NewExpression>): N.NewExpression {
    this.parseNewCallee(node);

    if (this.eat(tt.parenL)) {
      const args = this.parseExprList(tt.parenR);
      this.toReferencedList(args);
      // (parseExprList should be all non-null in this case)
      node.arguments = args;
    } else {
      node.arguments = [];
    }

    return this.finishNode(node, "NewExpression");
  }

  parseNewCallee(this: Parser, node: Undone<N.NewExpression>): void {
    const isImport = this.match(tt._import);
    const callee = this.parseNoCallExpr();
    node.callee = callee;
    if (
      isImport &&
      (callee.type === "Import" || callee.type === "ImportExpression")
    ) {
      this.raise(Errors.ImportCallNotNewExpression, callee);
    }
  }

  // Parse template expression.

  parseTemplateElement(isTagged: boolean): N.TemplateElement {
    const { start, startLoc, end, value } = this.state;
    const elemStart = start + 1;
    const elem = this.startNodeAt<N.TemplateElement>(
      createPositionWithColumnOffset(startLoc, 1),
    );
    if (value === null) {
      if (!isTagged) {
        this.raise(
          Errors.InvalidEscapeSequenceTemplate,
          // FIXME: Adding 1 is probably wrong.
          createPositionWithColumnOffset(
            this.state.firstInvalidTemplateEscapePos,
            1,
          ),
        );
      }
    }

    const isTail = this.match(tt.templateTail);
    const endOffset = isTail ? -1 : -2;
    const elemEnd = end + endOffset;
    elem.value = {
      raw: this.input.slice(elemStart, elemEnd).replace(/\r\n?/g, "\n"),
      cooked: value === null ? null : value.slice(1, endOffset),
    };
    elem.tail = isTail;
    this.next();
    const finishedNode = this.finishNode(elem, "TemplateElement");
    this.resetEndLocation(
      finishedNode,
      createPositionWithColumnOffset(this.state.lastTokEndLoc, endOffset),
    );
    return finishedNode;
  }

  // https://tc39.es/ecma262/#prod-TemplateLiteral
  parseTemplate(this: Parser, isTagged: boolean): N.TemplateLiteral {
    const node = this.startNode<N.TemplateLiteral>();
    let curElt = this.parseTemplateElement(isTagged);
    const quasis = [curElt];
    const substitutions = [];
    while (!curElt.tail) {
      substitutions.push(this.parseTemplateSubstitution());
      this.readTemplateContinuation();
      quasis.push((curElt = this.parseTemplateElement(isTagged)));
    }
    // Type cast from (N.Expression[] | N.TsType[]). parseTemplateSubstitution
    // returns consistent results.
    node.expressions = substitutions as N.Expression[] | N.TsType[];
    node.quasis = quasis;
    return this.finishNode(node, "TemplateLiteral");
  }

  // This is overwritten by the TypeScript plugin to parse template types
  parseTemplateSubstitution(this: Parser): N.Expression | N.TsType {
    return this.parseExpression();
  }

  // Parse an object literal, binding pattern, or record.

  parseObjectLike(
    close: TokenType,
    isPattern: true,
    isRecord?: boolean | null,
    refExpressionErrors?: ExpressionErrors | null,
  ): N.ObjectPattern;
  parseObjectLike(
    close: TokenType,
    isPattern: false,
    isRecord?: false | null,
    refExpressionErrors?: ExpressionErrors | null,
  ): N.ObjectExpression;
  parseObjectLike(
    close: TokenType,
    isPattern: false,
    isRecord?: true,
    refExpressionErrors?: ExpressionErrors | null,
  ): N.RecordExpression;
  parseObjectLike<T extends N.ObjectPattern | N.ObjectExpression>(
    this: Parser,
    close: TokenType,
    isPattern: boolean,
    isRecord?: boolean | null,
    refExpressionErrors?: ExpressionErrors | null,
  ): T {
    if (isRecord) {
      this.expectPlugin("recordAndTuple");
    }
    const oldInFSharpPipelineDirectBody = this.state.inFSharpPipelineDirectBody;
    this.state.inFSharpPipelineDirectBody = false;
    const propHash: any = Object.create(null);
    let first = true;
    const node = this.startNode<
      N.ObjectExpression | N.ObjectPattern | N.RecordExpression
    >();

    node.properties = [];
    this.next();

    while (!this.match(close)) {
      if (first) {
        first = false;
      } else {
        this.expect(tt.comma);
        if (this.match(close)) {
          this.addTrailingCommaExtraToNode(node);
          break;
        }
      }

      let prop;
      if (isPattern) {
        prop = this.parseBindingProperty();
      } else {
        prop = this.parsePropertyDefinition(refExpressionErrors);
        this.checkProto(prop, isRecord, propHash, refExpressionErrors);
      }

      if (
        isRecord &&
        !this.isObjectProperty(prop) &&
        prop.type !== "SpreadElement"
      ) {
        this.raise(Errors.InvalidRecordProperty, prop);
      }

      if (!process.env.BABEL_8_BREAKING) {
        // @ts-expect-error shorthand may not index prop
        if (prop.shorthand) {
          this.addExtra(prop, "shorthand", true);
        }
      }

      // @ts-expect-error Fixme: refine typings
      node.properties.push(prop);
    }

    this.next();

    this.state.inFSharpPipelineDirectBody = oldInFSharpPipelineDirectBody;
    let type = "ObjectExpression";
    if (isPattern) {
      type = "ObjectPattern";
    } else if (isRecord) {
      type = "RecordExpression";
    }
    // @ts-expect-error type is well defined
    return this.finishNode(node, type);
  }

  addTrailingCommaExtraToNode(node: Undone<N.Node>): void {
    this.addExtra(node, "trailingComma", this.state.lastTokStartLoc.index);
    this.addExtra(node, "trailingCommaLoc", this.state.lastTokStartLoc, false);
  }

  // Check grammar production:
  //   IdentifierName *_opt PropertyName
  // It is used in `parsePropertyDefinition` to detect AsyncMethod and Accessors
  maybeAsyncOrAccessorProp(
    prop: Undone<N.ObjectProperty>,
  ): prop is typeof prop & { key: N.Identifier } {
    return (
      !prop.computed &&
      prop.key.type === "Identifier" &&
      (this.isLiteralPropertyName() ||
        this.match(tt.bracketL) ||
        this.match(tt.star))
    );
  }

  // https://tc39.es/ecma262/#prod-PropertyDefinition
  parsePropertyDefinition(
    this: Parser,
    refExpressionErrors?: ExpressionErrors | null,
  ): N.ObjectMember | N.SpreadElement {
    let decorators = [];
    if (this.match(tt.at)) {
      if (this.hasPlugin("decorators")) {
        this.raise(Errors.UnsupportedPropertyDecorator, this.state.startLoc);
      }

      // we needn't check if decorators (stage 0) plugin is enabled since it's checked by
      // the call to this.parseDecorator
      while (this.match(tt.at)) {
        decorators.push(this.parseDecorator());
      }
    }

    const prop = this.startNode<N.ObjectProperty>();
    let isAsync = false;
    let isAccessor = false;
    let startLoc;

    if (this.match(tt.ellipsis)) {
      if (decorators.length) this.unexpected();
      return this.parseSpread();
    }

    if (decorators.length) {
      prop.decorators = decorators;
      decorators = [];
    }

    prop.method = false;

    if (refExpressionErrors) {
      startLoc = this.state.startLoc;
    }

    let isGenerator = this.eat(tt.star);
    this.parsePropertyNamePrefixOperator(prop);
    const containsEsc = this.state.containsEsc;
    this.parsePropertyName(prop, refExpressionErrors);

    if (!isGenerator && !containsEsc && this.maybeAsyncOrAccessorProp(prop)) {
      const { key } = prop;
      const keyName = key.name;
      // https://tc39.es/ecma262/#prod-AsyncMethod
      // https://tc39.es/ecma262/#prod-AsyncGeneratorMethod
      if (keyName === "async" && !this.hasPrecedingLineBreak()) {
        isAsync = true;
        this.resetPreviousNodeTrailingComments(key);
        isGenerator = this.eat(tt.star);
        this.parsePropertyName(prop);
      }
      // get PropertyName[?Yield, ?Await] () { FunctionBody[~Yield, ~Await] }
      // set PropertyName[?Yield, ?Await] ( PropertySetParameterList ) { FunctionBody[~Yield, ~Await] }
      if (keyName === "get" || keyName === "set") {
        isAccessor = true;
        this.resetPreviousNodeTrailingComments(key);
        prop.kind = keyName;
        if (this.match(tt.star)) {
          isGenerator = true;
          this.raise(Errors.AccessorIsGenerator, this.state.curPosition(), {
            kind: keyName,
          });
          this.next();
        }
        this.parsePropertyName(prop);
      }
    }

    return this.parseObjPropValue(
      prop,
      startLoc,
      isGenerator,
      isAsync,
      false /* isPattern */,
      isAccessor,
      refExpressionErrors,
    );
  }

  getGetterSetterExpectedParamCount(
    method: N.ObjectMethod | N.ClassMethod,
  ): number {
    return method.kind === "get" ? 0 : 1;
  }

  // This exists so we can override within the ESTree plugin
  getObjectOrClassMethodParams(method: N.ObjectMethod | N.ClassMethod) {
    return method.params;
  }

  // get methods aren't allowed to have any parameters
  // set methods must have exactly 1 parameter which is not a rest parameter
  checkGetterSetterParams(method: N.ObjectMethod | N.ClassMethod): void {
    const paramCount = this.getGetterSetterExpectedParamCount(method);
    const params = this.getObjectOrClassMethodParams(method);

    if (params.length !== paramCount) {
      this.raise(
        method.kind === "get" ? Errors.BadGetterArity : Errors.BadSetterArity,
        method,
      );
    }

    if (
      method.kind === "set" &&
      params[params.length - 1]?.type === "RestElement"
    ) {
      this.raise(Errors.BadSetterRestParameter, method);
    }
  }

  // https://tc39.es/ecma262/#prod-MethodDefinition
  parseObjectMethod(
    this: Parser,
    prop: Undone<N.ObjectMethod>,
    isGenerator: boolean,
    isAsync: boolean,
    isPattern: boolean,
    isAccessor: boolean,
  ): N.ObjectMethod | undefined | null {
    if (isAccessor) {
      // isAccessor implies isAsync: false, isPattern: false, isGenerator: false
      const finishedProp = this.parseMethod(
        prop,
        // This _should_ be false, but with error recovery, we allow it to be
        // set for informational purposes
        isGenerator,
        /* isAsync */ false,
        /* isConstructor */ false,
        false,
        "ObjectMethod",
      );
      this.checkGetterSetterParams(finishedProp);
      return finishedProp;
    }

    if (isAsync || isGenerator || this.match(tt.parenL)) {
      if (isPattern) this.unexpected();
      prop.kind = "method";
      prop.method = true;
      return this.parseMethod(
        prop,
        isGenerator,
        isAsync,
        /* isConstructor */ false,
        false,
        "ObjectMethod",
      );
    }
  }

  // if `isPattern` is true, parse https://tc39.es/ecma262/#prod-BindingProperty
  // else https://tc39.es/ecma262/#prod-PropertyDefinition
  parseObjectProperty(
    this: Parser,
    prop: Undone<N.ObjectProperty>,
    startLoc: Position | undefined | null,
    isPattern: boolean,
    refExpressionErrors?: ExpressionErrors | null,
  ): N.ObjectProperty | undefined | null {
    prop.shorthand = false;

    if (this.eat(tt.colon)) {
      prop.value = isPattern
        ? this.parseMaybeDefault(this.state.startLoc)
        : this.parseMaybeAssignAllowIn(refExpressionErrors);

      return this.finishNode(prop, "ObjectProperty");
    }

    if (!prop.computed && prop.key.type === "Identifier") {
      // PropertyDefinition:
      //   IdentifierReference
      //   CoverInitializedName
      // Note: `{ eval } = {}` will be checked in `checkLVal` later.
      this.checkReservedWord(prop.key.name, prop.key.loc.start, true, false);

      if (isPattern) {
        prop.value = this.parseMaybeDefault(
          startLoc,
          cloneIdentifier(prop.key),
        );
      } else if (this.match(tt.eq)) {
        const shorthandAssignLoc = this.state.startLoc;
        if (refExpressionErrors != null) {
          if (refExpressionErrors.shorthandAssignLoc === null) {
            refExpressionErrors.shorthandAssignLoc = shorthandAssignLoc;
          }
        } else {
          this.raise(Errors.InvalidCoverInitializedName, shorthandAssignLoc);
        }
        prop.value = this.parseMaybeDefault(
          startLoc,
          cloneIdentifier(prop.key),
        );
      } else {
        prop.value = cloneIdentifier(prop.key);
      }
      prop.shorthand = true;

      return this.finishNode(prop, "ObjectProperty");
    }
  }

  parseObjPropValue<T extends N.ObjectMember>(
    this: Parser,
    prop: Undone<T>,
    startLoc: Position | undefined | null,
    isGenerator: boolean,
    isAsync: boolean,
    isPattern: boolean,
    isAccessor: boolean,
    refExpressionErrors?: ExpressionErrors | null,
  ): T {
    const node = (this.parseObjectMethod(
      prop as Undone<N.ObjectMethod>,
      isGenerator,
      isAsync,
      isPattern,
      isAccessor,
    ) ||
      this.parseObjectProperty(
        prop as Undone<N.ObjectProperty>,
        startLoc,
        isPattern,
        refExpressionErrors,
      )) as T;

    if (!node) this.unexpected();

    return node;
  }

  // https://tc39.es/ecma262/#prod-PropertyName
  // when refExpressionErrors presents, it will parse private name
  // and record the position of the first private name
  parsePropertyName(
    this: Parser,
    prop:
      | Undone<N.ObjectOrClassMember | N.ClassMember>
      | N.TsNamedTypeElementBase,
    refExpressionErrors?: ExpressionErrors | null,
  ): void {
    if (this.eat(tt.bracketL)) {
      (prop as Undone<N.ObjectOrClassMember>).computed = true;
      prop.key = this.parseMaybeAssignAllowIn();
      this.expect(tt.bracketR);
    } else {
      // We check if it's valid for it to be a private name when we push it.
      const { type, value } = this.state;
      let key;
      // most un-computed property names are identifiers
      if (tokenIsKeywordOrIdentifier(type)) {
        key = this.parseIdentifier(true);
      } else {
        switch (type) {
          case tt.num:
            key = this.parseNumericLiteral(value);
            break;
          case tt.string:
            key = this.parseStringLiteral(value);
            break;
          case tt.bigint:
            key = this.parseBigIntLiteral(value);
            break;
          case tt.privateName: {
            // the class private key has been handled in parseClassElementName
            const privateKeyLoc = this.state.startLoc;
            if (refExpressionErrors != null) {
              if (refExpressionErrors.privateKeyLoc === null) {
                refExpressionErrors.privateKeyLoc = privateKeyLoc;
              }
            } else {
              this.raise(Errors.UnexpectedPrivateField, privateKeyLoc);
            }
            key = this.parsePrivateName();
            break;
          }
          default:
            if (!process.env.BABEL_8_BREAKING && type === tt.decimal) {
              key = this.parseDecimalLiteral(value);
              break;
            }

            this.unexpected();
        }
      }
      (prop as any).key = key;
      if (type !== tt.privateName) {
        // ClassPrivateProperty is never computed, so we don't assign in that case.
        prop.computed = false;
      }
    }
  }

  // Initialize empty function node.

  initFunction(node: N.BodilessFunctionOrMethodBase, isAsync: boolean): void {
    node.id = null;
    node.generator = false;
    node.async = isAsync;
  }

  // Parse object or class method.

  parseMethod<T extends N.ObjectMethod | N.ClassMethod | N.ClassPrivateMethod>(
    this: Parser,
    node: Undone<T>,
    isGenerator: boolean,
    isAsync: boolean,
    isConstructor: boolean,
    allowDirectSuper: boolean,
    type: T["type"],
    inClassScope: boolean = false,
  ): T {
    this.initFunction(node, isAsync);
    node.generator = isGenerator;
    this.scope.enter(
      ScopeFlag.FUNCTION |
        ScopeFlag.SUPER |
        (inClassScope ? ScopeFlag.CLASS : 0) |
        (allowDirectSuper ? ScopeFlag.DIRECT_SUPER : 0),
    );
    this.prodParam.enter(functionFlags(isAsync, node.generator));
    this.parseFunctionParams(node, isConstructor);
    const finishedNode = this.parseFunctionBodyAndFinish(node, type, true);
    this.prodParam.exit();
    this.scope.exit();

    return finishedNode;
  }

  // parse an array literal or tuple literal
  // https://tc39.es/ecma262/#prod-ArrayLiteral
  // https://tc39.es/proposal-record-tuple/#prod-TupleLiteral
  parseArrayLike(
    this: Parser,
    close: TokenType,
    canBePattern: boolean,
    isTuple: boolean,
    refExpressionErrors?: ExpressionErrors | null,
  ): N.ArrayExpression | N.TupleExpression {
    if (isTuple) {
      this.expectPlugin("recordAndTuple");
    }
    const oldInFSharpPipelineDirectBody = this.state.inFSharpPipelineDirectBody;
    this.state.inFSharpPipelineDirectBody = false;
    const node = this.startNode<N.ArrayExpression | N.TupleExpression>();
    this.next();
    node.elements = this.parseExprList(
      close,
      /* allowEmpty */ !isTuple,
      refExpressionErrors,
      // @ts-expect-error todo(flow->ts)
      node,
    );
    this.state.inFSharpPipelineDirectBody = oldInFSharpPipelineDirectBody;
    return this.finishNode(
      node,
      isTuple ? "TupleExpression" : "ArrayExpression",
    );
  }

  // Parse arrow function expression.
  // If the parameters are provided, they will be converted to an
  // assignable list.
  parseArrowExpression(
    this: Parser,
    node: Undone<N.ArrowFunctionExpression>,
    params:
      | Array<N.Expression | N.SpreadElement>
      | Array<N.Expression | N.RestElement>,
    isAsync: boolean,
    trailingCommaLoc?: Position | null,
  ): N.ArrowFunctionExpression {
    this.scope.enter(ScopeFlag.FUNCTION | ScopeFlag.ARROW);
    let flags = functionFlags(isAsync, false);
    // ConciseBody[In] :
    //   [lookahead ≠ {] ExpressionBody[?In, ~Await]
    //   { FunctionBody[~Yield, ~Await] }
    if (!this.match(tt.braceL) && this.prodParam.hasIn) {
      flags |= ParamKind.PARAM_IN;
    }
    this.prodParam.enter(flags);
    this.initFunction(node, isAsync);
    const oldMaybeInArrowParameters = this.state.maybeInArrowParameters;

    if (params) {
      this.state.maybeInArrowParameters = true;
      this.setArrowFunctionParameters(node, params, trailingCommaLoc);
    }
    this.state.maybeInArrowParameters = false;
    this.parseFunctionBody(node, true);

    this.prodParam.exit();
    this.scope.exit();
    this.state.maybeInArrowParameters = oldMaybeInArrowParameters;

    return this.finishNode(node, "ArrowFunctionExpression");
  }

  setArrowFunctionParameters(
    node: Undone<N.ArrowFunctionExpression>,
    params:
      | Array<N.Expression | N.SpreadElement>
      | Array<N.Expression | N.RestElement>,
    trailingCommaLoc?: Position | null,
  ): void {
    this.toAssignableList(params, trailingCommaLoc, false);
    node.params = params as (N.Pattern | N.TSParameterProperty)[];
  }

  parseFunctionBodyAndFinish<
    T extends
      | N.Function
      | N.TSDeclareMethod
      | N.TSDeclareFunction
      | N.ClassPrivateMethod,
  >(node: Undone<T>, type: T["type"], isMethod: boolean = false): T {
    // @ts-expect-error (node is not bodiless if we get here)
    this.parseFunctionBody(node, false, isMethod);
    return this.finishNode(node, type);
  }

  // Parse function body and check parameters.
  parseFunctionBody(
    this: Parser,
    node: Undone<N.Function>,
    allowExpression?: boolean | null,
    isMethod: boolean = false,
  ): void {
    const isExpression = allowExpression && !this.match(tt.braceL);
    this.expressionScope.enter(newExpressionScope());

    if (isExpression) {
      // https://tc39.es/ecma262/#prod-ExpressionBody
      (node as Undone<N.ArrowFunctionExpression>).body =
        this.parseMaybeAssign();
      this.checkParams(node, false, allowExpression, false);
    } else {
      const oldStrict = this.state.strict;
      // Start a new scope with regard to labels
      // flag (restore them to their old value afterwards).
      const oldLabels = this.state.labels;
      this.state.labels = [];

      // FunctionBody[Yield, Await]:
      //   StatementList[?Yield, ?Await, +Return] opt
      this.prodParam.enter(
        this.prodParam.currentFlags() | ParamKind.PARAM_RETURN,
      );
      node.body = this.parseBlock(
        true,
        false,
        // Strict mode function checks after we parse the statements in the function body.
        (hasStrictModeDirective: boolean) => {
          const nonSimple = !this.isSimpleParamList(node.params);

          if (hasStrictModeDirective && nonSimple) {
            // This logic is here to align the error location with the ESTree plugin.
            this.raise(
              Errors.IllegalLanguageModeDirective,
              // @ts-expect-error kind may not index node
              (node.kind === "method" || node.kind === "constructor") &&
                // @ts-expect-error key may not index node
                !!node.key
                ? // @ts-expect-error node.key has been guarded
                  node.key.loc.end
                : node,
            );
          }

          const strictModeChanged = !oldStrict && this.state.strict;

          // Add the params to varDeclaredNames to ensure that an error is thrown
          // if a let/const declaration in the function clashes with one of the params.
          this.checkParams(
            node,
            !this.state.strict && !allowExpression && !isMethod && !nonSimple,
            allowExpression,
            strictModeChanged,
          );

          // Ensure the function name isn't a forbidden identifier in strict mode, e.g. 'eval'
          if (this.state.strict && node.id) {
            this.checkIdentifier(
              node.id,
              BindingFlag.TYPE_OUTSIDE,
              strictModeChanged,
            );
          }
        },
      );
      this.prodParam.exit();
      this.state.labels = oldLabels;
    }
    this.expressionScope.exit();
  }

  isSimpleParameter(node: N.Pattern | N.TSParameterProperty): boolean {
    return node.type === "Identifier";
  }

  isSimpleParamList(
    params: ReadonlyArray<N.Pattern | N.TSParameterProperty>,
  ): boolean {
    for (let i = 0, len = params.length; i < len; i++) {
      if (!this.isSimpleParameter(params[i])) return false;
    }
    return true;
  }

  checkParams(
    node: Undone<N.Function>,
    allowDuplicates: boolean,
    isArrowFunction?: boolean | null,
    strictModeChanged: boolean = true,
  ): void {
    const checkClashes = !allowDuplicates && new Set<string>();
    // We create a fake node with the "ephemeral" type `FormalParameters`[1]
    // since we just store an array of parameters. Perhaps someday we can have
    // something like class FormalParameters extends Array { ... }, which would
    // also be helpful when traversing this node.
    //
    // 1. https://tc39.es/ecma262/#prod-FormalParameters
    const formalParameters = { type: "FormalParameters" } as const;
    for (const param of node.params) {
      this.checkLVal(
        param,
        formalParameters,
        BindingFlag.TYPE_VAR,
        checkClashes,
        strictModeChanged,
      );
    }
  }

  // Parses a comma-separated list of expressions, and returns them as
  // an array. `close` is the token type that ends the list, and
  // `allowEmpty` can be turned on to allow subsequent commas with
  // nothing in between them to be parsed as `null` (which is needed
  // for array literals).

  parseExprList(
    this: Parser,
    close: TokenType,
    allowEmpty?: boolean,
    refExpressionErrors?: ExpressionErrors | null,
    nodeForExtra?: N.Node | null,
  ): (N.Expression | null)[] {
    const elts: (N.Expression | null)[] = [];
    let first = true;

    while (!this.eat(close)) {
      if (first) {
        first = false;
      } else {
        this.expect(tt.comma);
        if (this.match(close)) {
          if (nodeForExtra) {
            this.addTrailingCommaExtraToNode(nodeForExtra);
          }
          this.next();
          break;
        }
      }

      elts.push(this.parseExprListItem(allowEmpty, refExpressionErrors));
    }
    return elts;
  }

  parseExprListItem(
    this: Parser,
    allowEmpty?: boolean,
    refExpressionErrors?: ExpressionErrors | null,
    allowPlaceholder?: boolean | null,
  ): N.Expression | null;
  parseExprListItem(
    this: Parser,
    allowEmpty?: false,
    refExpressionErrors?: ExpressionErrors | null,
    allowPlaceholder?: boolean | null,
  ): N.Expression;
  parseExprListItem(
    this: Parser,
    allowEmpty?: boolean | null,
    refExpressionErrors?: ExpressionErrors | null,
    allowPlaceholder?: boolean | null,
  ): N.Expression | N.SpreadElement | N.ArgumentPlaceholder | null {
    let elt;
    if (this.match(tt.comma)) {
      if (!allowEmpty) {
        this.raise(Errors.UnexpectedToken, this.state.curPosition(), {
          unexpected: ",",
        });
      }
      elt = null;
    } else if (this.match(tt.ellipsis)) {
      const spreadNodeStartLoc = this.state.startLoc;

      elt = this.parseParenItem(
        this.parseSpread(refExpressionErrors),
        spreadNodeStartLoc,
      );
    } else if (this.match(tt.question)) {
      this.expectPlugin("partialApplication");
      if (!allowPlaceholder) {
        this.raise(Errors.UnexpectedArgumentPlaceholder, this.state.startLoc);
      }
      const node = this.startNode<N.ArgumentPlaceholder>();
      this.next();
      elt = this.finishNode(node, "ArgumentPlaceholder");
    } else {
      elt = this.parseMaybeAssignAllowIn(
        refExpressionErrors,
        this.parseParenItem,
      );
    }
    return elt;
  }

  // Parse the next token as an identifier. If `liberal` is true (used
  // when parsing properties), it will also convert keywords into
  // identifiers.
  // This shouldn't be used to parse the keywords of meta properties, since they
  // are not identifiers and cannot contain escape sequences.

  parseIdentifier(liberal?: boolean): N.Identifier {
    const node = this.startNode<N.Identifier>();
    const name = this.parseIdentifierName(liberal);

    return this.createIdentifier(node, name);
  }

  createIdentifier(
    node: Omit<N.Identifier, "type">,
    name: string,
  ): N.Identifier {
    node.name = name;
    node.loc.identifierName = name;

    return this.finishNode(node, "Identifier");
  }

  parseIdentifierName(liberal?: boolean): string {
    let name: string;

    const { startLoc, type } = this.state;

    if (tokenIsKeywordOrIdentifier(type)) {
      name = this.state.value;
    } else {
      this.unexpected();
    }

    const tokenIsKeyword = tokenKeywordOrIdentifierIsKeyword(type);

    if (liberal) {
      // If the current token is not used as a keyword, set its type to "tt.name".
      // This will prevent this.next() from throwing about unexpected escapes.
      if (tokenIsKeyword) {
        this.replaceToken(tt.name);
      }
    } else {
      this.checkReservedWord(name, startLoc, tokenIsKeyword, false);
    }

    this.next();

    return name;
  }

  checkReservedWord(
    word: string,
    startLoc: Position,
    checkKeywords: boolean,
    isBinding: boolean,
  ): void {
    // Every JavaScript reserved word is 10 characters or less.
    if (word.length > 10) {
      return;
    }
    // Most identifiers are not reservedWord-like, they don't need special
    // treatments afterward, which very likely ends up throwing errors
    if (!canBeReservedWord(word)) {
      return;
    }

    if (checkKeywords && isKeyword(word)) {
      this.raise(Errors.UnexpectedKeyword, startLoc, {
        keyword: word,
      });
      return;
    }

    const reservedTest = !this.state.strict
      ? isReservedWord
      : isBinding
        ? isStrictBindReservedWord
        : isStrictReservedWord;

    if (reservedTest(word, this.inModule)) {
      this.raise(Errors.UnexpectedReservedWord, startLoc, {
        reservedWord: word,
      });
      return;
    } else if (word === "yield") {
      if (this.prodParam.hasYield) {
        this.raise(Errors.YieldBindingIdentifier, startLoc);
        return;
      }
    } else if (word === "await") {
      if (this.prodParam.hasAwait) {
        this.raise(Errors.AwaitBindingIdentifier, startLoc);
        return;
      }

      if (this.scope.inStaticBlock) {
        this.raise(Errors.AwaitBindingIdentifierInStaticBlock, startLoc);
        return;
      }

      this.expressionScope.recordAsyncArrowParametersError(startLoc);
    } else if (word === "arguments") {
      if (this.scope.inClassAndNotInNonArrowFunction) {
        this.raise(Errors.ArgumentsInClass, startLoc);
        return;
      }
    }
  }

  // Returns wether `await` is allowed or not in this context, and if it is
  // keeps track of it to determine whether a module uses top-level await.
  recordAwaitIfAllowed(): boolean {
    const isAwaitAllowed =
      this.prodParam.hasAwait ||
      (this.optionFlags & OptionFlags.AllowAwaitOutsideFunction &&
        !this.scope.inFunction);

    if (isAwaitAllowed && !this.scope.inFunction) {
      this.state.hasTopLevelAwait = true;
    }

    return isAwaitAllowed;
  }

  // Parses await expression inside async function.

  parseAwait(this: Parser, startLoc: Position): N.AwaitExpression {
    const node = this.startNodeAt<N.AwaitExpression>(startLoc);

    this.expressionScope.recordParameterInitializerError(
      Errors.AwaitExpressionFormalParameter,
      // @ts-expect-error todo(flow->ts)
      node,
    );

    if (this.eat(tt.star)) {
      this.raise(Errors.ObsoleteAwaitStar, node);
    }

    if (
      !this.scope.inFunction &&
      !(this.optionFlags & OptionFlags.AllowAwaitOutsideFunction)
    ) {
      if (this.isAmbiguousAwait()) {
        this.ambiguousScriptDifferentAst = true;
      } else {
        this.sawUnambiguousESM = true;
      }
    }

    if (!this.state.soloAwait) {
      node.argument = this.parseMaybeUnary(null, true);
    }

    return this.finishNode(node, "AwaitExpression");
  }

  isAmbiguousAwait(): boolean {
    if (this.hasPrecedingLineBreak()) return true;
    const { type } = this.state;
    return (
      // All the following expressions are ambiguous:
      //   await + 0, await - 0, await ( 0 ), await [ 0 ], await / 0 /u, await ``, await of []
      type === tt.plusMin ||
      type === tt.parenL ||
      type === tt.bracketL ||
      tokenIsTemplate(type) ||
      (type === tt._of && !this.state.containsEsc) ||
      // Sometimes the tokenizer generates tt.slash for regexps, and this is
      // handler by parseExprAtom
      type === tt.regexp ||
      type === tt.slash ||
      // This code could be parsed both as a modulo operator or as an intrinsic:
      //   await %x(0)
      (this.hasPlugin("v8intrinsic") && type === tt.modulo)
    );
  }

  // Parses yield expression inside generator.

  parseYield(this: Parser): N.YieldExpression {
    const node = this.startNode<N.YieldExpression>();

    this.expressionScope.recordParameterInitializerError(
      Errors.YieldInParameter,
      // @ts-expect-error todo(flow->ts)
      node,
    );

    this.next();
    let delegating = false;
    let argument: N.Expression | null = null;
    if (!this.hasPrecedingLineBreak()) {
      delegating = this.eat(tt.star);
      switch (this.state.type) {
        case tt.semi:
        case tt.eof:
        case tt.braceR:
        case tt.parenR:
        case tt.bracketR:
        case tt.braceBarR:
        case tt.colon:
        case tt.comma:
          // The above is the complete set of tokens that can
          // follow an AssignmentExpression, and none of them
          // can start an AssignmentExpression
          if (!delegating) break;
        /* fallthrough */
        default:
          argument = this.parseMaybeAssign();
      }
    }
    node.delegate = delegating;
    node.argument = argument;
    return this.finishNode(node, "YieldExpression");
  }

  // https://tc39.es/ecma262/#prod-ImportCall
  parseImportCall(
    this: Parser,
    node: Undone<N.ImportExpression>,
  ): N.ImportExpression {
    this.next(); // eat tt.parenL
    node.source = this.parseMaybeAssignAllowIn();
    node.options = null;
    if (this.eat(tt.comma)) {
      if (!this.match(tt.parenR)) {
        node.options = this.parseMaybeAssignAllowIn();

        if (this.eat(tt.comma) && !this.match(tt.parenR)) {
          // keep consuming arguments, to then throw ImportCallArity
          // instead of "expected )"
          do {
            this.parseMaybeAssignAllowIn();
          } while (this.eat(tt.comma) && !this.match(tt.parenR));

          this.raise(Errors.ImportCallArity, node);
        }
      }
    }
    this.expect(tt.parenR);
    return this.finishNode(node, "ImportExpression");
  }

  // Validates a pipeline (for any of the pipeline Babylon plugins) at the point
  // of the infix operator `|>`.

  checkPipelineAtInfixOperator(left: N.Expression, leftStartLoc: Position) {
    // @ts-expect-error Remove this in Babel 8
    if (this.hasPlugin(["pipelineOperator", { proposal: "smart" }])) {
      if (left.type === "SequenceExpression") {
        // Ensure that the pipeline head is not a comma-delimited
        // sequence expression.
        this.raise(Errors.PipelineHeadSequenceExpression, leftStartLoc);
      }
    }
  }

  parseSmartPipelineBodyInStyle(childExpr: N.Expression, startLoc: Position) {
    if (this.isSimpleReference(childExpr)) {
      const bodyNode = this.startNodeAt<N.PipelineBareFunction>(startLoc);
      bodyNode.callee = childExpr;
      return this.finishNode(bodyNode, "PipelineBareFunction");
    } else {
      const bodyNode = this.startNodeAt<N.PipelineTopicExpression>(startLoc);
      this.checkSmartPipeTopicBodyEarlyErrors(startLoc);
      bodyNode.expression = childExpr;
      return this.finishNode(bodyNode, "PipelineTopicExpression");
    }
  }

  isSimpleReference(expression: N.Expression): boolean {
    switch (expression.type) {
      case "MemberExpression":
        return (
          !expression.computed && this.isSimpleReference(expression.object)
        );
      case "Identifier":
        return true;
      default:
        return false;
    }
  }

  // This helper method is to be called immediately
  // after a topic-style smart-mix pipe body is parsed.
  // The `startLoc` is the starting position of the pipe body.

  checkSmartPipeTopicBodyEarlyErrors(startLoc: Position): void {
    // If the following token is invalidly `=>`, then throw a human-friendly error
    // instead of something like 'Unexpected token, expected ";"'.
    // For example, `x => x |> y => #` (assuming `#` is the topic reference)
    // groups into `x => (x |> y) => #`,
    // and `(x |> y) => #` is an invalid arrow function.
    // This is because smart-mix `|>` has tighter precedence than `=>`.
    if (this.match(tt.arrow)) {
      throw this.raise(Errors.PipelineBodyNoArrow, this.state.startLoc);
    }

    // A topic-style smart-mix pipe body must use the topic reference at least once.
    if (!this.topicReferenceWasUsedInCurrentContext()) {
      this.raise(Errors.PipelineTopicUnused, startLoc);
    }
  }

  // Enable topic references from outer contexts within Hack-style pipe bodies.
  // The function modifies the parser's topic-context state to enable or disable
  // the use of topic references.
  // The function then calls a callback, then resets the parser
  // to the old topic-context state that it had before the function was called.

  withTopicBindingContext<T>(callback: () => T): T {
    const outerContextTopicState = this.state.topicContext;
    this.state.topicContext = {
      // Enable the use of the primary topic reference.
      maxNumOfResolvableTopics: 1,
      // Hide the use of any topic references from outer contexts.
      maxTopicIndex: null,
    };

    try {
      return callback();
    } finally {
      this.state.topicContext = outerContextTopicState;
    }
  }

  // This helper method is used only with the deprecated smart-mix pipe proposal.
  // Disables topic references from outer contexts within syntax constructs
  // such as the bodies of iteration statements.
  // The function modifies the parser's topic-context state to enable or disable
  // the use of topic references with the smartPipelines plugin. They then run a
  // callback, then they reset the parser to the old topic-context state that it
  // had before the function was called.

  withSmartMixTopicForbiddingContext<T>(callback: () => T): T {
    // TODO(Babel 8): Remove this method

    if (
      !process.env.BABEL_8_BREAKING &&
      // @ts-expect-error Babel 7 only
      this.hasPlugin(["pipelineOperator", { proposal: "smart" }])
    ) {
      // Reset the parser’s topic context only if the smart-mix pipe proposal is active.
      const outerContextTopicState = this.state.topicContext;
      this.state.topicContext = {
        // Disable the use of the primary topic reference.
        maxNumOfResolvableTopics: 0,
        // Hide the use of any topic references from outer contexts.
        maxTopicIndex: null,
      };

      try {
        return callback();
      } finally {
        this.state.topicContext = outerContextTopicState;
      }
    } else {
      // If the pipe proposal is "minimal"(Babel 7), "fsharp", or "hack",
      // or if no pipe proposal is active,
      // then the callback result is returned
      // without touching any extra parser state.
      return callback();
    }
  }

  withSoloAwaitPermittingContext<T>(callback: () => T): T {
    const outerContextSoloAwaitState = this.state.soloAwait;
    this.state.soloAwait = true;

    try {
      return callback();
    } finally {
      this.state.soloAwait = outerContextSoloAwaitState;
    }
  }

  allowInAnd<T>(callback: () => T): T {
    const flags = this.prodParam.currentFlags();
    const prodParamToSet = ParamKind.PARAM_IN & ~flags;
    if (prodParamToSet) {
      this.prodParam.enter(flags | ParamKind.PARAM_IN);
      try {
        return callback();
      } finally {
        this.prodParam.exit();
      }
    }
    return callback();
  }

  disallowInAnd<T>(callback: () => T): T {
    const flags = this.prodParam.currentFlags();
    const prodParamToClear = ParamKind.PARAM_IN & flags;
    if (prodParamToClear) {
      this.prodParam.enter(flags & ~ParamKind.PARAM_IN);
      try {
        return callback();
      } finally {
        this.prodParam.exit();
      }
    }
    return callback();
  }

  // Register the use of a topic reference within the current
  // topic-binding context.
  registerTopicReference(): void {
    this.state.topicContext.maxTopicIndex = 0;
  }

  topicReferenceIsAllowedInCurrentContext(): boolean {
    return this.state.topicContext.maxNumOfResolvableTopics >= 1;
  }

  topicReferenceWasUsedInCurrentContext(): boolean {
    return (
      this.state.topicContext.maxTopicIndex != null &&
      this.state.topicContext.maxTopicIndex >= 0
    );
  }

  parseFSharpPipelineBody(this: Parser, prec: number): N.Expression {
    const startLoc = this.state.startLoc;

    this.state.potentialArrowAt = this.state.start;
    const oldInFSharpPipelineDirectBody = this.state.inFSharpPipelineDirectBody;
    this.state.inFSharpPipelineDirectBody = true;

    const ret = this.parseExprOp(
      this.parseMaybeUnaryOrPrivate(),
      startLoc,
      prec,
    );

    this.state.inFSharpPipelineDirectBody = oldInFSharpPipelineDirectBody;

    return ret;
  }

  // https://github.com/tc39/proposal-js-module-blocks
  parseModuleExpression(this: Parser): N.ModuleExpression {
    this.expectPlugin("moduleBlocks");
    const node = this.startNode<N.ModuleExpression>();
    this.next(); // eat "module"
    if (!this.match(tt.braceL)) {
      this.unexpected(null, tt.braceL);
    }
    // start program node immediately after `{`
    const program = this.startNodeAt<N.Program>(this.state.endLoc);
    this.next(); // eat `{`

    const revertScopes = this.initializeScopes(/** inModule */ true);
    this.enterInitialScopes();

    try {
      node.body = this.parseProgram(program, tt.braceR, "module");
    } finally {
      revertScopes();
    }
    return this.finishNode<N.ModuleExpression>(node, "ModuleExpression");
  }

  // Used in Flow plugin
  parsePropertyNamePrefixOperator(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    prop: Undone<N.ObjectOrClassMember | N.ClassMember>,
  ): void {}
}
