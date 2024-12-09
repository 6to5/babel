import type State from "../../tokenizer/state.ts";
import {
  tokenIsIdentifier,
  tokenIsTSDeclarationStart,
  tokenIsTSTypeOperator,
  tokenOperatorPrecedence,
  tokenIsKeywordOrIdentifier,
  tt,
  type TokenType,
  tokenIsTemplate,
  tokenCanStartExpression,
} from "../../tokenizer/types.ts";
import { types as tc } from "../../tokenizer/context.ts";
import type * as N from "../../types.ts";
import type { Position } from "../../util/location.ts";
import { createPositionWithColumnOffset } from "../../util/location.ts";
import type Parser from "../../parser/index.ts";
import { ScopeFlag, BindingFlag } from "../../util/scopeflags.ts";
import TypeScriptScopeHandler from "./scope.ts";
import * as charCodes from "charcodes";
import type { ExpressionErrors } from "../../parser/util.ts";
import type { ParseStatementFlag } from "../../parser/statement.ts";
import { ParamKind } from "../../util/production-parameter.ts";
import { Errors, ParseErrorEnum } from "../../parse-error.ts";
import { cloneIdentifier, type Undone } from "../../parser/node.ts";
import type { Pattern } from "../../types.ts";
import type { Expression } from "../../types.ts";
import type { IJSXParserMixin } from "../jsx/index.ts";
import { ParseBindingListFlags } from "../../parser/lval.ts";

type TsModifier =
  | "readonly"
  | "abstract"
  | "declare"
  | "static"
  | "override"
  | "const"
  | N.Accessibility
  | N.VarianceAnnotations;

function nonNull<T>(x?: T | null): T {
  if (x == null) {
    throw new Error(`Unexpected ${x} value.`);
  }
  return x;
}

function assert(x: boolean): void {
  if (!x) {
    throw new Error("Assert fail");
  }
}

type ParsingContext =
  | "EnumMembers"
  | "HeritageClauseElement"
  | "TupleElementTypes"
  | "TypeMembers"
  | "TypeParametersOrArguments";

type ModifierBase = {
  accessibility?: N.Accessibility;
} & {
  [key in TsModifier]?: boolean | undefined | null;
};

/* eslint sort-keys: "error" */
const TSErrors = ParseErrorEnum`typescript`({
  AbstractMethodHasImplementation: ({ methodName }: { methodName: string }) =>
    `Method '${methodName}' cannot have an implementation because it is marked abstract.`,
  AbstractPropertyHasInitializer: ({
    propertyName,
  }: {
    propertyName: string;
  }) =>
    `Property '${propertyName}' cannot have an initializer because it is marked abstract.`,
  AccessorCannotBeOptional:
    "An 'accessor' property cannot be declared optional.",
  AccessorCannotDeclareThisParameter:
    "'get' and 'set' accessors cannot declare 'this' parameters.",
  AccessorCannotHaveTypeParameters: "An accessor cannot have type parameters.",
  ClassMethodHasDeclare: "Class methods cannot have the 'declare' modifier.",
  ClassMethodHasReadonly: "Class methods cannot have the 'readonly' modifier.",
  ConstInitializerMustBeStringOrNumericLiteralOrLiteralEnumReference:
    "A 'const' initializer in an ambient context must be a string or numeric literal or literal enum reference.",
  ConstructorHasTypeParameters:
    "Type parameters cannot appear on a constructor declaration.",
  DeclareAccessor: ({ kind }: { kind: "get" | "set" }) =>
    `'declare' is not allowed in ${kind}ters.`,
  DeclareClassFieldHasInitializer:
    "Initializers are not allowed in ambient contexts.",
  DeclareFunctionHasImplementation:
    "An implementation cannot be declared in ambient contexts.",
  DuplicateAccessibilityModifier:
    // `Accessibility modifier already seen: ${modifier}` would be more helpful.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ modifier }: { modifier: N.Accessibility }) =>
      `Accessibility modifier already seen.`,
  DuplicateModifier: ({ modifier }: { modifier: TsModifier }) =>
    `Duplicate modifier: '${modifier}'.`,
  // `token` matches the terminology used by typescript:
  // https://github.com/microsoft/TypeScript/blob/main/src/compiler/types.ts#L2915
  EmptyHeritageClauseType: ({ token }: { token: "extends" | "implements" }) =>
    `'${token}' list cannot be empty.`,
  EmptyTypeArguments: "Type argument list cannot be empty.",
  EmptyTypeParameters: "Type parameter list cannot be empty.",
  ExpectedAmbientAfterExportDeclare:
    "'export declare' must be followed by an ambient declaration.",
  ImportAliasHasImportType: "An import alias can not use 'import type'.",
  ImportReflectionHasImportType:
    "An `import module` declaration can not use `type` modifier",
  IncompatibleModifiers: ({
    modifiers,
  }: {
    modifiers: [TsModifier, TsModifier];
  }) =>
    `'${modifiers[0]}' modifier cannot be used with '${modifiers[1]}' modifier.`,
  IndexSignatureHasAbstract:
    "Index signatures cannot have the 'abstract' modifier.",
  IndexSignatureHasAccessibility: ({
    modifier,
  }: {
    modifier: N.Accessibility;
  }) =>
    `Index signatures cannot have an accessibility modifier ('${modifier}').`,
  IndexSignatureHasDeclare:
    "Index signatures cannot have the 'declare' modifier.",
  IndexSignatureHasOverride:
    "'override' modifier cannot appear on an index signature.",
  IndexSignatureHasStatic:
    "Index signatures cannot have the 'static' modifier.",
  InitializerNotAllowedInAmbientContext:
    "Initializers are not allowed in ambient contexts.",
  InvalidModifierOnTypeMember: ({ modifier }: { modifier: TsModifier }) =>
    `'${modifier}' modifier cannot appear on a type member.`,
  InvalidModifierOnTypeParameter: ({ modifier }: { modifier: TsModifier }) =>
    `'${modifier}' modifier cannot appear on a type parameter.`,
  InvalidModifierOnTypeParameterPositions: ({
    modifier,
  }: {
    modifier: TsModifier;
  }) =>
    `'${modifier}' modifier can only appear on a type parameter of a class, interface or type alias.`,
  InvalidModifiersOrder: ({
    orderedModifiers,
  }: {
    orderedModifiers: [TsModifier, TsModifier];
  }) =>
    `'${orderedModifiers[0]}' modifier must precede '${orderedModifiers[1]}' modifier.`,
  InvalidPropertyAccessAfterInstantiationExpression:
    "Invalid property access after an instantiation expression. " +
    "You can either wrap the instantiation expression in parentheses, or delete the type arguments.",
  InvalidTupleMemberLabel:
    "Tuple members must be labeled with a simple identifier.",
  MissingInterfaceName:
    "'interface' declarations must be followed by an identifier.",
  NonAbstractClassHasAbstractMethod:
    "Abstract methods can only appear within an abstract class.",
  NonClassMethodPropertyHasAbstractModifer:
    "'abstract' modifier can only appear on a class, method, or property declaration.",
  OptionalTypeBeforeRequired:
    "A required element cannot follow an optional element.",
  OverrideNotInSubClass:
    "This member cannot have an 'override' modifier because its containing class does not extend another class.",
  PatternIsOptional:
    "A binding pattern parameter cannot be optional in an implementation signature.",
  PrivateElementHasAbstract:
    "Private elements cannot have the 'abstract' modifier.",
  PrivateElementHasAccessibility: ({
    modifier,
  }: {
    modifier: N.Accessibility;
  }) =>
    `Private elements cannot have an accessibility modifier ('${modifier}').`,
  ReadonlyForMethodSignature:
    "'readonly' modifier can only appear on a property declaration or index signature.",
  ReservedArrowTypeParam:
    "This syntax is reserved in files with the .mts or .cts extension. Add a trailing comma, as in `<T,>() => ...`.",
  ReservedTypeAssertion:
    "This syntax is reserved in files with the .mts or .cts extension. Use an `as` expression instead.",
  SetAccessorCannotHaveOptionalParameter:
    "A 'set' accessor cannot have an optional parameter.",
  SetAccessorCannotHaveRestParameter:
    "A 'set' accessor cannot have rest parameter.",
  SetAccessorCannotHaveReturnType:
    "A 'set' accessor cannot have a return type annotation.",
  SingleTypeParameterWithoutTrailingComma: ({
    typeParameterName,
  }: {
    typeParameterName: string;
  }) =>
    `Single type parameter ${typeParameterName} should have a trailing comma. Example usage: <${typeParameterName},>.`,
  StaticBlockCannotHaveModifier:
    "Static class blocks cannot have any modifier.",
  TupleOptionalAfterType:
    "A labeled tuple optional element must be declared using a question mark after the name and before the colon (`name?: type`), rather than after the type (`name: type?`).",
  TypeAnnotationAfterAssign:
    "Type annotations must come before default assignments, e.g. instead of `age = 25: number` use `age: number = 25`.",
  TypeImportCannotSpecifyDefaultAndNamed:
    "A type-only import can specify a default import or named bindings, but not both.",
  TypeModifierIsUsedInTypeExports:
    "The 'type' modifier cannot be used on a named export when 'export type' is used on its export statement.",
  TypeModifierIsUsedInTypeImports:
    "The 'type' modifier cannot be used on a named import when 'import type' is used on its import statement.",
  UnexpectedParameterModifier:
    "A parameter property is only allowed in a constructor implementation.",
  UnexpectedReadonly:
    "'readonly' type modifier is only permitted on array and tuple literal types.",
  UnexpectedTypeAnnotation: "Did not expect a type annotation here.",
  UnexpectedTypeCastInParameter: "Unexpected type cast in parameter position.",
  UnsupportedImportTypeArgument:
    "Argument in a type import must be a string literal.",
  UnsupportedParameterPropertyKind:
    "A parameter property may not be declared using a binding pattern.",
  UnsupportedSignatureParameterKind: ({ type }: { type: string }) =>
    `Name in a signature must be an Identifier, ObjectPattern or ArrayPattern, instead got ${type}.`,
});

/* eslint-disable sort-keys */

// Doesn't handle "void" or "null" because those are keywords, not identifiers.
// It also doesn't handle "intrinsic", since usually it's not a keyword.
function keywordTypeFromName(value: string): N.TsKeywordTypeType | undefined {
  switch (value) {
    case "any":
      return "TSAnyKeyword";
    case "boolean":
      return "TSBooleanKeyword";
    case "bigint":
      return "TSBigIntKeyword";
    case "never":
      return "TSNeverKeyword";
    case "number":
      return "TSNumberKeyword";
    case "object":
      return "TSObjectKeyword";
    case "string":
      return "TSStringKeyword";
    case "symbol":
      return "TSSymbolKeyword";
    case "undefined":
      return "TSUndefinedKeyword";
    case "unknown":
      return "TSUnknownKeyword";
    default:
      return undefined;
  }
}

function tsIsAccessModifier(modifier: string): modifier is N.Accessibility {
  return (
    modifier === "private" || modifier === "public" || modifier === "protected"
  );
}

function tsIsVarianceAnnotations(
  modifier: string,
): modifier is N.VarianceAnnotations {
  return modifier === "in" || modifier === "out";
}

type ClassWithMixin<
  T extends new (...args: any) => any,
  M extends object,
> = T extends new (...args: infer P) => infer I
  ? new (...args: P) => I & M
  : never;

export default (superClass: ClassWithMixin<typeof Parser, IJSXParserMixin>) =>
  class TypeScriptParserMixin extends superClass implements Parser {
    getScopeHandler(): new (...args: any) => TypeScriptScopeHandler {
      return TypeScriptScopeHandler;
    }

    tsIsIdentifier(): boolean {
      // TODO: actually a bit more complex in TypeScript, but shouldn't matter.
      // See https://github.com/Microsoft/TypeScript/issues/15008
      return tokenIsIdentifier(this.state.type);
    }

    tsTokenCanFollowModifier() {
      return (
        this.match(tt.bracketL) ||
        this.match(tt.braceL) ||
        this.match(tt.star) ||
        this.match(tt.ellipsis) ||
        this.match(tt.privateName) ||
        this.isLiteralPropertyName()
      );
    }

    tsNextTokenOnSameLineAndCanFollowModifier() {
      this.next();
      if (this.hasPrecedingLineBreak()) {
        return false;
      }
      return this.tsTokenCanFollowModifier();
    }

    tsNextTokenCanFollowModifier() {
      // Note: TypeScript's implementation is much more complicated because
      // more things are considered modifiers there.
      // This implementation only handles modifiers not handled by @babel/parser itself. And "static".
      if (this.match(tt._static)) {
        this.next();
        return this.tsTokenCanFollowModifier();
      }
      return this.tsNextTokenOnSameLineAndCanFollowModifier();
    }

    /** Parses a modifier matching one the given modifier names. */
    tsParseModifier<T extends TsModifier>(
      allowedModifiers: T[],
      stopOnStartOfClassStaticBlock?: boolean,
    ): T | undefined | null {
      if (
        !tokenIsIdentifier(this.state.type) &&
        this.state.type !== tt._in &&
        this.state.type !== tt._const
      ) {
        return undefined;
      }

      const modifier = this.state.value;
      if (allowedModifiers.includes(modifier)) {
        if (stopOnStartOfClassStaticBlock && this.tsIsStartOfStaticBlocks()) {
          return undefined;
        }
        if (this.tsTryParse(this.tsNextTokenCanFollowModifier.bind(this))) {
          return modifier;
        }
      }
      return undefined;
    }

    /** Parses a list of modifiers, in any order.
     *  If you need a specific order, you must call this function multiple times:
     *    this.tsParseModifiers({ modified: node, allowedModifiers: ["public"] });
     *    this.tsParseModifiers({ modified: node, allowedModifiers: ["abstract", "readonly"] });
     */
    tsParseModifiers<N extends ModifierBase>(
      {
        allowedModifiers,
        disallowedModifiers,
        stopOnStartOfClassStaticBlock,
        errorTemplate = TSErrors.InvalidModifierOnTypeMember,
      }: {
        allowedModifiers: readonly TsModifier[];
        disallowedModifiers?: TsModifier[];
        stopOnStartOfClassStaticBlock?: boolean;
        errorTemplate?: typeof TSErrors.InvalidModifierOnTypeMember;
      },
      modified: N,
    ): void {
      const enforceOrder = (
        loc: Position,
        modifier: TsModifier,
        before: TsModifier,
        after: TsModifier,
      ) => {
        if (modifier === before && modified[after]) {
          this.raise(TSErrors.InvalidModifiersOrder, loc, {
            orderedModifiers: [before, after],
          });
        }
      };
      const incompatible = (
        loc: Position,
        modifier: TsModifier,
        mod1: TsModifier,
        mod2: TsModifier,
      ) => {
        if (
          (modified[mod1] && modifier === mod2) ||
          (modified[mod2] && modifier === mod1)
        ) {
          this.raise(TSErrors.IncompatibleModifiers, loc, {
            modifiers: [mod1, mod2],
          });
        }
      };

      for (;;) {
        const { startLoc } = this.state;
        const modifier: TsModifier | undefined | null = this.tsParseModifier(
          allowedModifiers.concat(disallowedModifiers ?? []),
          stopOnStartOfClassStaticBlock,
        );

        if (!modifier) break;

        if (tsIsAccessModifier(modifier)) {
          if (modified.accessibility) {
            this.raise(TSErrors.DuplicateAccessibilityModifier, startLoc, {
              modifier,
            });
          } else {
            enforceOrder(startLoc, modifier, modifier, "override");
            enforceOrder(startLoc, modifier, modifier, "static");
            enforceOrder(startLoc, modifier, modifier, "readonly");

            modified.accessibility = modifier;
          }
        } else if (tsIsVarianceAnnotations(modifier)) {
          if (modified[modifier]) {
            this.raise(TSErrors.DuplicateModifier, startLoc, { modifier });
          }
          modified[modifier] = true;

          enforceOrder(startLoc, modifier, "in", "out");
        } else {
          if (Object.hasOwn(modified, modifier)) {
            this.raise(TSErrors.DuplicateModifier, startLoc, { modifier });
          } else {
            enforceOrder(startLoc, modifier, "static", "readonly");
            enforceOrder(startLoc, modifier, "static", "override");
            enforceOrder(startLoc, modifier, "override", "readonly");
            enforceOrder(startLoc, modifier, "abstract", "override");

            incompatible(startLoc, modifier, "declare", "override");
            incompatible(startLoc, modifier, "static", "abstract");
          }
          modified[modifier] = true;
        }

        if (disallowedModifiers?.includes(modifier)) {
          this.raise(errorTemplate, startLoc, {
            modifier,
          });
        }
      }
    }

    tsIsListTerminator(kind: ParsingContext): boolean {
      switch (kind) {
        case "EnumMembers":
        case "TypeMembers":
          return this.match(tt.braceR);
        case "HeritageClauseElement":
          return this.match(tt.braceL);
        case "TupleElementTypes":
          return this.match(tt.bracketR);
        case "TypeParametersOrArguments":
          return this.match(tt.gt);
      }
    }

    tsParseList<T extends N.Node>(
      kind: ParsingContext,
      parseElement: () => T,
    ): T[] {
      const result: T[] = [];
      while (!this.tsIsListTerminator(kind)) {
        // Skipping "parseListElement" from the TS source since that's just for error handling.
        result.push(parseElement());
      }
      return result;
    }

    tsParseDelimitedList<T extends N.Node>(
      kind: ParsingContext,
      parseElement: () => T,
      refTrailingCommaPos?: {
        value: number;
      },
    ): T[] {
      return nonNull(
        this.tsParseDelimitedListWorker(
          kind,
          parseElement,
          /* expectSuccess */ true,
          refTrailingCommaPos,
        ),
      );
    }

    /**
     * If !expectSuccess, returns undefined instead of failing to parse.
     * If expectSuccess, parseElement should always return a defined value.
     */
    tsParseDelimitedListWorker<T extends N.Node>(
      kind: ParsingContext,
      parseElement: () => T | undefined,
      expectSuccess: boolean,
      refTrailingCommaPos?: {
        value: number;
      },
    ): T[] | undefined {
      const result: T[] = [];
      let trailingCommaPos = -1;

      for (;;) {
        if (this.tsIsListTerminator(kind)) {
          break;
        }
        trailingCommaPos = -1;

        const element = parseElement();
        if (element == null) {
          return undefined;
        }
        result.push(element);

        if (this.eat(tt.comma)) {
          trailingCommaPos = this.state.lastTokStartLoc.index;
          continue;
        }

        if (this.tsIsListTerminator(kind)) {
          break;
        }

        if (expectSuccess) {
          // This will fail with an error about a missing comma
          this.expect(tt.comma);
        }
        return undefined;
      }

      if (refTrailingCommaPos) {
        refTrailingCommaPos.value = trailingCommaPos;
      }

      return result;
    }

    tsParseBracketedList<T extends N.Node>(
      kind: ParsingContext,
      parseElement: () => T,
      bracket: boolean,
      skipFirstToken: boolean,
      refTrailingCommaPos?: {
        value: number;
      },
    ): T[] {
      if (!skipFirstToken) {
        if (bracket) {
          this.expect(tt.bracketL);
        } else {
          this.expect(tt.lt);
        }
      }

      const result = this.tsParseDelimitedList(
        kind,
        parseElement,
        refTrailingCommaPos,
      );

      if (bracket) {
        this.expect(tt.bracketR);
      } else {
        this.expect(tt.gt);
      }

      return result;
    }

    tsParseImportType(): N.TsImportType {
      const node = this.startNode<N.TsImportType>();
      this.expect(tt._import);
      this.expect(tt.parenL);
      if (!this.match(tt.string)) {
        this.raise(TSErrors.UnsupportedImportTypeArgument, this.state.startLoc);
      }

      // For compatibility to estree we cannot call parseLiteral directly here
      node.argument = super.parseExprAtom() as N.StringLiteral;
      if (this.eat(tt.comma) && !this.match(tt.parenR)) {
        node.options = super.parseMaybeAssignAllowIn();
        this.eat(tt.comma);
      } else {
        node.options = null;
      }
      this.expect(tt.parenR);

      if (this.eat(tt.dot)) {
        // In this instance, the entity name will actually itself be a
        // qualifier, so allow it to be a reserved word as well.
        node.qualifier = this.tsParseEntityName();
      }
      if (this.match(tt.lt)) {
        node.typeParameters = this.tsParseTypeArguments();
      }
      return this.finishNode(node, "TSImportType");
    }

    tsParseEntityName(allowReservedWords: boolean = true): N.TsEntityName {
      let entity: N.TsEntityName = this.parseIdentifier(allowReservedWords);
      while (this.eat(tt.dot)) {
        const node: Undone<N.TsQualifiedName> =
          this.startNodeAtNode<N.TsQualifiedName>(entity);
        node.left = entity;
        node.right = this.parseIdentifier(allowReservedWords);
        entity = this.finishNode(node, "TSQualifiedName");
      }
      return entity;
    }

    tsParseTypeReference(): N.TsTypeReference {
      const node = this.startNode<N.TsTypeReference>();
      node.typeName = this.tsParseEntityName();
      if (!this.hasPrecedingLineBreak() && this.match(tt.lt)) {
        if (process.env.BABEL_8_BREAKING) {
          node.typeArguments = this.tsParseTypeArguments();
        } else {
          node.typeParameters = this.tsParseTypeArguments();
        }
      }
      return this.finishNode(node, "TSTypeReference");
    }

    tsParseThisTypePredicate(lhs: N.TsThisType): N.TsTypePredicate {
      this.next();
      const node = this.startNodeAtNode<N.TsTypePredicate>(lhs);
      node.parameterName = lhs;
      node.typeAnnotation = this.tsParseTypeAnnotation(/* eatColon */ false);
      node.asserts = false;
      return this.finishNode(node, "TSTypePredicate");
    }

    tsParseThisTypeNode(): N.TsThisType {
      const node = this.startNode<N.TsThisType>();
      this.next();
      return this.finishNode(node, "TSThisType");
    }

    tsParseTypeQuery(): N.TsTypeQuery {
      const node = this.startNode<N.TsTypeQuery>();
      this.expect(tt._typeof);
      if (this.match(tt._import)) {
        node.exprName = this.tsParseImportType();
      } else {
        node.exprName = this.tsParseEntityName();
      }
      if (!this.hasPrecedingLineBreak() && this.match(tt.lt)) {
        node.typeParameters = this.tsParseTypeArguments();
      }
      return this.finishNode(node, "TSTypeQuery");
    }

    tsParseInOutModifiers = this.tsParseModifiers.bind(this, {
      allowedModifiers: ["in", "out"],
      disallowedModifiers: [
        "const",
        "public",
        "private",
        "protected",
        "readonly",
        "declare",
        "abstract",
        "override",
      ],
      errorTemplate: TSErrors.InvalidModifierOnTypeParameter,
    });

    tsParseConstModifier = this.tsParseModifiers.bind(this, {
      allowedModifiers: ["const"],
      // for better error recovery
      disallowedModifiers: ["in", "out"],
      errorTemplate: TSErrors.InvalidModifierOnTypeParameterPositions,
    });

    tsParseInOutConstModifiers = this.tsParseModifiers.bind(this, {
      allowedModifiers: ["in", "out", "const"],
      disallowedModifiers: [
        "public",
        "private",
        "protected",
        "readonly",
        "declare",
        "abstract",
        "override",
      ],
      errorTemplate: TSErrors.InvalidModifierOnTypeParameter,
    });

    tsParseTypeParameter(
      parseModifiers: (node: Undone<N.TsTypeParameter>) => void,
    ): N.TsTypeParameter {
      const node = this.startNode<N.TsTypeParameter>();

      parseModifiers(node);

      node.name = this.tsParseTypeParameterName();
      node.constraint = this.tsEatThenParseType(tt._extends);
      node.default = this.tsEatThenParseType(tt.eq);
      return this.finishNode(node, "TSTypeParameter");
    }

    tsTryParseTypeParameters(
      parseModifiers: (node: N.TsTypeParameter) => void,
    ): N.TsTypeParameterDeclaration | undefined | null {
      if (this.match(tt.lt)) {
        return this.tsParseTypeParameters(parseModifiers);
      }
    }

    tsParseTypeParameters(parseModifiers: (node: N.TsTypeParameter) => void) {
      const node = this.startNode<N.TsTypeParameterDeclaration>();

      if (this.match(tt.lt) || this.match(tt.jsxTagStart)) {
        this.next();
      } else {
        this.unexpected();
      }

      const refTrailingCommaPos = { value: -1 };

      node.params = this.tsParseBracketedList(
        "TypeParametersOrArguments",
        this.tsParseTypeParameter.bind(this, parseModifiers),
        /* bracket */ false,
        /* skipFirstToken */ true,
        refTrailingCommaPos,
      );
      if (node.params.length === 0) {
        this.raise(TSErrors.EmptyTypeParameters, node);
      }
      if (refTrailingCommaPos.value !== -1) {
        this.addExtra(node, "trailingComma", refTrailingCommaPos.value);
      }
      return this.finishNode(node, "TSTypeParameterDeclaration");
    }

    // Note: In TypeScript implementation we must provide `yieldContext` and `awaitContext`,
    // but here it's always false, because this is only used for types.
    tsFillSignature(
      returnToken: TokenType,
      signature: Undone<N.TsSignatureDeclaration>,
    ): void {
      // Arrow fns *must* have return token (`=>`). Normal functions can omit it.
      const returnTokenRequired = returnToken === tt.arrow;

      // https://github.com/babel/babel/issues/9231
      const paramsKey = process.env.BABEL_8_BREAKING ? "params" : "parameters";
      const returnTypeKey = process.env.BABEL_8_BREAKING
        ? "returnType"
        : "typeAnnotation";

      signature.typeParameters = this.tsTryParseTypeParameters(
        this.tsParseConstModifier,
      );
      this.expect(tt.parenL);
      signature[paramsKey] = this.tsParseBindingListForSignature();
      if (returnTokenRequired) {
        signature[returnTypeKey] =
          this.tsParseTypeOrTypePredicateAnnotation(returnToken);
      } else if (this.match(returnToken)) {
        signature[returnTypeKey] =
          this.tsParseTypeOrTypePredicateAnnotation(returnToken);
      }
    }

    tsParseBindingListForSignature(): Array<
      N.Identifier | N.RestElement | N.ObjectPattern | N.ArrayPattern
    > {
      const list = super.parseBindingList(
        tt.parenR,
        charCodes.rightParenthesis,
        ParseBindingListFlags.IS_FUNCTION_PARAMS,
      );
      for (const pattern of list) {
        const { type } = pattern;
        if (type === "AssignmentPattern" || type === "TSParameterProperty") {
          this.raise(TSErrors.UnsupportedSignatureParameterKind, pattern, {
            type,
          });
        }
      }
      return list as Exclude<
        (typeof list)[0],
        N.AssignmentPattern | N.TSParameterProperty
      >[];
    }

    tsParseTypeMemberSemicolon(): void {
      if (!this.eat(tt.comma) && !this.isLineTerminator()) {
        this.expect(tt.semi);
      }
    }

    tsParseSignatureMember(
      kind: "TSCallSignatureDeclaration" | "TSConstructSignatureDeclaration",
      node: Undone<
        N.TsCallSignatureDeclaration | N.TsConstructSignatureDeclaration
      >,
    ): N.TsCallSignatureDeclaration | N.TsConstructSignatureDeclaration {
      this.tsFillSignature(tt.colon, node);
      this.tsParseTypeMemberSemicolon();
      return this.finishNode(node, kind);
    }

    tsIsUnambiguouslyIndexSignature() {
      this.next(); // Skip '{'
      if (tokenIsIdentifier(this.state.type)) {
        this.next();
        return this.match(tt.colon);
      }
      return false;
    }

    tsTryParseIndexSignature(
      node: Undone<N.TsIndexSignature>,
    ): N.TsIndexSignature | undefined {
      if (
        !(
          this.match(tt.bracketL) &&
          this.tsLookAhead(this.tsIsUnambiguouslyIndexSignature.bind(this))
        )
      ) {
        return;
      }

      this.expect(tt.bracketL);
      const id = this.parseIdentifier();
      id.typeAnnotation = this.tsParseTypeAnnotation();
      this.resetEndLocation(id); // set end position to end of type

      this.expect(tt.bracketR);
      node.parameters = [id];

      const type = this.tsTryParseTypeAnnotation();
      if (type) node.typeAnnotation = type;
      this.tsParseTypeMemberSemicolon();
      return this.finishNode(node, "TSIndexSignature");
    }

    tsParsePropertyOrMethodSignature(
      node: N.TsPropertySignature | N.TsMethodSignature,
      readonly: boolean,
    ): N.TsPropertySignature | N.TsMethodSignature {
      if (this.eat(tt.question)) node.optional = true;
      const nodeAny: any = node;

      if (this.match(tt.parenL) || this.match(tt.lt)) {
        if (readonly) {
          this.raise(TSErrors.ReadonlyForMethodSignature, node);
        }
        const method: N.TsMethodSignature = nodeAny;
        if (method.kind && this.match(tt.lt)) {
          this.raise(
            TSErrors.AccessorCannotHaveTypeParameters,
            this.state.curPosition(),
          );
        }
        this.tsFillSignature(tt.colon, method);
        this.tsParseTypeMemberSemicolon();
        const paramsKey = process.env.BABEL_8_BREAKING
          ? "params"
          : "parameters";
        const returnTypeKey = process.env.BABEL_8_BREAKING
          ? "returnType"
          : "typeAnnotation";
        if (method.kind === "get") {
          if (method[paramsKey].length > 0) {
            this.raise(Errors.BadGetterArity, this.state.curPosition());
            if (this.isThisParam(method[paramsKey][0])) {
              this.raise(
                TSErrors.AccessorCannotDeclareThisParameter,
                this.state.curPosition(),
              );
            }
          }
        } else if (method.kind === "set") {
          if (method[paramsKey].length !== 1) {
            this.raise(Errors.BadSetterArity, this.state.curPosition());
          } else {
            const firstParameter = method[paramsKey][0];
            if (this.isThisParam(firstParameter)) {
              this.raise(
                TSErrors.AccessorCannotDeclareThisParameter,
                this.state.curPosition(),
              );
            }
            if (
              firstParameter.type === "Identifier" &&
              firstParameter.optional
            ) {
              this.raise(
                TSErrors.SetAccessorCannotHaveOptionalParameter,
                this.state.curPosition(),
              );
            }
            if (firstParameter.type === "RestElement") {
              this.raise(
                TSErrors.SetAccessorCannotHaveRestParameter,
                this.state.curPosition(),
              );
            }
          }
          if (method[returnTypeKey]) {
            this.raise(
              TSErrors.SetAccessorCannotHaveReturnType,
              method[returnTypeKey],
            );
          }
        } else {
          method.kind = "method";
        }
        return this.finishNode(method, "TSMethodSignature");
      } else {
        const property: N.TsPropertySignature = nodeAny;
        if (readonly) property.readonly = true;
        const type = this.tsTryParseTypeAnnotation();
        if (type) property.typeAnnotation = type;
        this.tsParseTypeMemberSemicolon();
        return this.finishNode(property, "TSPropertySignature");
      }
    }

    tsParseTypeMember(): N.TsTypeElement {
      const node: any = this.startNode();

      if (this.match(tt.parenL) || this.match(tt.lt)) {
        return this.tsParseSignatureMember("TSCallSignatureDeclaration", node);
      }

      if (this.match(tt._new)) {
        const id = this.startNode<N.Identifier>();
        this.next();
        if (this.match(tt.parenL) || this.match(tt.lt)) {
          return this.tsParseSignatureMember(
            "TSConstructSignatureDeclaration",
            node,
          );
        } else {
          node.key = this.createIdentifier(id, "new");
          return this.tsParsePropertyOrMethodSignature(node, false);
        }
      }

      this.tsParseModifiers(
        {
          allowedModifiers: ["readonly"],
          disallowedModifiers: [
            "declare",
            "abstract",
            "private",
            "protected",
            "public",
            "static",
            "override",
          ],
        },
        node,
      );

      const idx = this.tsTryParseIndexSignature(node);
      if (idx) {
        return idx;
      }

      super.parsePropertyName(node);
      if (
        !node.computed &&
        node.key.type === "Identifier" &&
        (node.key.name === "get" || node.key.name === "set") &&
        this.tsTokenCanFollowModifier()
      ) {
        node.kind = node.key.name;
        super.parsePropertyName(node);
      }
      return this.tsParsePropertyOrMethodSignature(node, !!node.readonly);
    }

    tsParseTypeLiteral(): N.TsTypeLiteral {
      const node = this.startNode<N.TsTypeLiteral>();
      node.members = this.tsParseObjectTypeMembers();
      return this.finishNode(node, "TSTypeLiteral");
    }

    tsParseObjectTypeMembers(): Array<N.TsTypeElement> {
      this.expect(tt.braceL);
      const members = this.tsParseList(
        "TypeMembers",
        this.tsParseTypeMember.bind(this),
      );
      this.expect(tt.braceR);
      return members;
    }

    tsIsStartOfMappedType(): boolean {
      this.next();
      if (this.eat(tt.plusMin)) {
        return this.isContextual(tt._readonly);
      }
      if (this.isContextual(tt._readonly)) {
        this.next();
      }
      if (!this.match(tt.bracketL)) {
        return false;
      }
      this.next();
      if (!this.tsIsIdentifier()) {
        return false;
      }
      this.next();
      return this.match(tt._in);
    }

    tsParseMappedType(): N.TsMappedType {
      const node = this.startNode<N.TsMappedType>();

      this.expect(tt.braceL);

      if (this.match(tt.plusMin)) {
        node.readonly = this.state.value;
        this.next();
        this.expectContextual(tt._readonly);
      } else if (this.eatContextual(tt._readonly)) {
        node.readonly = true;
      }

      this.expect(tt.bracketL);
      if (process.env.BABEL_8_BREAKING) {
        node.key = this.tsParseTypeParameterName() as N.Identifier;
        node.constraint = this.tsExpectThenParseType(tt._in);
      } else {
        const typeParameter = this.startNode<N.TsTypeParameter>();
        typeParameter.name = this.tsParseTypeParameterName();
        typeParameter.constraint = this.tsExpectThenParseType(tt._in);
        // @ts-expect-error for Babel 7
        node.typeParameter = this.finishNode(typeParameter, "TSTypeParameter");
      }
      node.nameType = this.eatContextual(tt._as) ? this.tsParseType() : null;

      this.expect(tt.bracketR);

      if (this.match(tt.plusMin)) {
        node.optional = this.state.value;
        this.next();
        this.expect(tt.question);
      } else if (this.eat(tt.question)) {
        node.optional = true;
      }

      node.typeAnnotation = this.tsTryParseType();
      this.semicolon();
      this.expect(tt.braceR);

      return this.finishNode(node, "TSMappedType");
    }

    tsParseTupleType(): N.TsTupleType {
      const node = this.startNode<N.TsTupleType>();
      node.elementTypes = this.tsParseBracketedList(
        "TupleElementTypes",
        this.tsParseTupleElementType.bind(this),
        /* bracket */ true,
        /* skipFirstToken */ false,
      );

      // Validate the elementTypes to ensure that no mandatory elements
      // follow optional elements
      let seenOptionalElement = false;
      node.elementTypes.forEach(elementNode => {
        const { type } = elementNode;

        if (
          seenOptionalElement &&
          type !== "TSRestType" &&
          type !== "TSOptionalType" &&
          !(type === "TSNamedTupleMember" && elementNode.optional)
        ) {
          this.raise(TSErrors.OptionalTypeBeforeRequired, elementNode);
        }

        seenOptionalElement ||=
          (type === "TSNamedTupleMember" && elementNode.optional) ||
          type === "TSOptionalType";
      });

      return this.finishNode(node, "TSTupleType");
    }

    tsParseTupleElementType(): N.TsNamedTupleMember | N.TsType {
      // parses `...TsType[]`

      const { startLoc } = this.state;

      const rest = this.eat(tt.ellipsis);

      let labeled: boolean;
      let label: N.Identifier;
      let optional: boolean;
      let type: N.TsNamedTupleMember | N.TsType;

      const isWord = tokenIsKeywordOrIdentifier(this.state.type);
      const chAfterWord = isWord ? this.lookaheadCharCode() : null;
      if (chAfterWord === charCodes.colon) {
        labeled = true;
        optional = false;
        label = this.parseIdentifier(true);
        this.expect(tt.colon);
        type = this.tsParseType();
      } else if (chAfterWord === charCodes.questionMark) {
        optional = true;
        const startLoc = this.state.startLoc;
        const wordName = this.state.value;
        const typeOrLabel = this.tsParseNonArrayType();

        if (this.lookaheadCharCode() === charCodes.colon) {
          labeled = true;
          label = this.createIdentifier(
            this.startNodeAt<N.Identifier>(startLoc),
            wordName,
          );
          this.expect(tt.question);
          this.expect(tt.colon);
          type = this.tsParseType();
        } else {
          labeled = false;
          type = typeOrLabel;
          this.expect(tt.question);
        }
      } else {
        type = this.tsParseType();
        optional = this.eat(tt.question);
        // In this case (labeled === true) could be only in invalid label.
        // E.g. [x.y:type]
        // An error is raised while processing node.
        labeled = this.eat(tt.colon);
      }

      if (labeled) {
        let labeledNode: Undone<N.TsNamedTupleMember>;
        if (label) {
          labeledNode = this.startNodeAtNode<N.TsNamedTupleMember>(label);
          labeledNode.optional = optional;
          labeledNode.label = label;
          labeledNode.elementType = type;

          if (this.eat(tt.question)) {
            labeledNode.optional = true;
            this.raise(
              TSErrors.TupleOptionalAfterType,
              this.state.lastTokStartLoc,
            );
          }
        } else {
          labeledNode = this.startNodeAtNode<N.TsNamedTupleMember>(type);
          labeledNode.optional = optional;
          this.raise(TSErrors.InvalidTupleMemberLabel, type);
          // @ts-expect-error This produces an invalid AST, but at least we don't drop
          // nodes representing the invalid source.
          labeledNode.label = type;
          labeledNode.elementType = this.tsParseType();
        }
        type = this.finishNode(labeledNode, "TSNamedTupleMember");
      } else if (optional) {
        const optionalTypeNode = this.startNodeAtNode<N.TsOptionalType>(type);
        optionalTypeNode.typeAnnotation = type;
        type = this.finishNode(optionalTypeNode, "TSOptionalType");
      }

      if (rest) {
        const restNode = this.startNodeAt<N.TsRestType>(startLoc);
        restNode.typeAnnotation = type;
        type = this.finishNode(restNode, "TSRestType");
      }

      return type;
    }

    tsParseParenthesizedType(): N.TsParenthesizedType {
      const node = this.startNode<N.TsParenthesizedType>();
      this.expect(tt.parenL);
      node.typeAnnotation = this.tsParseType();
      this.expect(tt.parenR);
      return this.finishNode(node, "TSParenthesizedType");
    }

    tsParseFunctionOrConstructorType(
      type: "TSFunctionType" | "TSConstructorType",
      abstract?: boolean,
    ): N.TsFunctionOrConstructorType {
      const node = this.startNode<
        N.TsFunctionOrConstructorType | N.TsConstructorType
      >();
      if (type === "TSConstructorType") {
        (node as Undone<N.TsConstructorType>).abstract = !!abstract;
        if (abstract) this.next();
        this.next(); // eat `new`
      }
      this.tsInAllowConditionalTypesContext(() =>
        this.tsFillSignature(tt.arrow, node),
      );
      return this.finishNode(node, type);
    }

    tsParseLiteralTypeNode(): N.TsLiteralType {
      const node = this.startNode<N.TsLiteralType>();
      switch (this.state.type) {
        case tt.num:
        case tt.bigint:
        case tt.string:
        case tt._true:
        case tt._false:
          // For compatibility to estree we cannot call parseLiteral directly here
          // @ts-expect-error refine typings
          node.literal = super.parseExprAtom();
          break;
        default:
          this.unexpected();
      }
      return this.finishNode(node, "TSLiteralType");
    }

    tsParseTemplateLiteralType(): N.TsType {
      const node = this.startNode<N.TsLiteralType>();
      node.literal = super.parseTemplate(false);
      return this.finishNode(node, "TSLiteralType");
    }

    parseTemplateSubstitution(): N.TsType | N.Expression {
      if (this.state.inType) return this.tsParseType();
      return super.parseTemplateSubstitution();
    }

    tsParseThisTypeOrThisTypePredicate(): N.TsThisType | N.TsTypePredicate {
      const thisKeyword = this.tsParseThisTypeNode();
      if (this.isContextual(tt._is) && !this.hasPrecedingLineBreak()) {
        return this.tsParseThisTypePredicate(thisKeyword);
      } else {
        return thisKeyword;
      }
    }

    tsParseNonArrayType(): N.TsType {
      switch (this.state.type) {
        case tt.string:
        case tt.num:
        case tt.bigint:
        case tt._true:
        case tt._false:
          return this.tsParseLiteralTypeNode();
        case tt.plusMin:
          if (this.state.value === "-") {
            const node = this.startNode<N.TsLiteralType>();
            const nextToken = this.lookahead();
            if (nextToken.type !== tt.num && nextToken.type !== tt.bigint) {
              this.unexpected();
            }
            // @ts-expect-error: parseMaybeUnary must returns unary expression
            node.literal = this.parseMaybeUnary();
            return this.finishNode(node, "TSLiteralType");
          }
          break;
        case tt._this:
          return this.tsParseThisTypeOrThisTypePredicate();
        case tt._typeof:
          return this.tsParseTypeQuery();
        case tt._import:
          return this.tsParseImportType();
        case tt.braceL:
          return this.tsLookAhead(this.tsIsStartOfMappedType.bind(this))
            ? this.tsParseMappedType()
            : this.tsParseTypeLiteral();
        case tt.bracketL:
          return this.tsParseTupleType();
        case tt.parenL:
          if (process.env.BABEL_8_BREAKING) {
            if (!this.options.createParenthesizedExpressions) {
              const startLoc = this.state.startLoc;
              this.next();
              const type = this.tsParseType();
              this.expect(tt.parenR);
              this.addExtra(type, "parenthesized", true);
              this.addExtra(type, "parenStart", startLoc.index);
              return type;
            }
          }

          return this.tsParseParenthesizedType();
        case tt.templateNonTail:
        case tt.templateTail:
          return this.tsParseTemplateLiteralType();
        default: {
          const { type } = this.state;
          if (
            tokenIsIdentifier(type) ||
            type === tt._void ||
            type === tt._null
          ) {
            const nodeType =
              type === tt._void
                ? "TSVoidKeyword"
                : type === tt._null
                  ? "TSNullKeyword"
                  : keywordTypeFromName(this.state.value);
            if (
              nodeType !== undefined &&
              this.lookaheadCharCode() !== charCodes.dot
            ) {
              const node = this.startNode<N.TsKeywordType>();
              this.next();
              return this.finishNode(node, nodeType);
            }
            return this.tsParseTypeReference();
          }
        }
      }

      this.unexpected();
    }

    tsParseArrayTypeOrHigher(): N.TsType {
      let type = this.tsParseNonArrayType();
      while (!this.hasPrecedingLineBreak() && this.eat(tt.bracketL)) {
        if (this.match(tt.bracketR)) {
          const node = this.startNodeAtNode<N.TsArrayType>(type);
          node.elementType = type;
          this.expect(tt.bracketR);
          type = this.finishNode(node, "TSArrayType");
        } else {
          const node = this.startNodeAtNode<N.TsIndexedAccessType>(type);
          node.objectType = type;
          node.indexType = this.tsParseType();
          this.expect(tt.bracketR);
          type = this.finishNode(node, "TSIndexedAccessType");
        }
      }
      return type;
    }

    tsParseTypeOperator(): N.TsTypeOperator {
      const node = this.startNode<N.TsTypeOperator>();
      const operator = this.state.value;
      this.next(); // eat operator
      node.operator = operator;
      node.typeAnnotation = this.tsParseTypeOperatorOrHigher();

      if (operator === "readonly") {
        this.tsCheckTypeAnnotationForReadOnly(node);
      }

      return this.finishNode(node, "TSTypeOperator");
    }

    tsCheckTypeAnnotationForReadOnly(node: Undone<N.TsTypeOperator>) {
      switch (node.typeAnnotation.type) {
        case "TSTupleType":
        case "TSArrayType":
          return;
        default:
          this.raise(TSErrors.UnexpectedReadonly, node);
      }
    }

    tsParseInferType(): N.TsInferType {
      const node = this.startNode<N.TsInferType>();
      this.expectContextual(tt._infer);
      const typeParameter = this.startNode<N.TsTypeParameter>();
      typeParameter.name = this.tsParseTypeParameterName();
      typeParameter.constraint = this.tsTryParse(() =>
        this.tsParseConstraintForInferType(),
      );
      node.typeParameter = this.finishNode(typeParameter, "TSTypeParameter");
      return this.finishNode(node, "TSInferType");
    }

    tsParseConstraintForInferType() {
      if (this.eat(tt._extends)) {
        const constraint = this.tsInDisallowConditionalTypesContext(() =>
          this.tsParseType(),
        );
        if (
          this.state.inDisallowConditionalTypesContext ||
          !this.match(tt.question)
        ) {
          return constraint;
        }
      }
    }

    tsParseTypeOperatorOrHigher(): N.TsType {
      const isTypeOperator =
        tokenIsTSTypeOperator(this.state.type) && !this.state.containsEsc;
      return isTypeOperator
        ? this.tsParseTypeOperator()
        : this.isContextual(tt._infer)
          ? this.tsParseInferType()
          : this.tsInAllowConditionalTypesContext(() =>
              this.tsParseArrayTypeOrHigher(),
            );
    }

    tsParseUnionOrIntersectionType(
      kind: "TSUnionType" | "TSIntersectionType",
      parseConstituentType: () => N.TsType,
      operator: TokenType,
    ): N.TsType {
      const node = this.startNode<N.TsUnionType | N.TsIntersectionType>();
      const hasLeadingOperator = this.eat(operator);
      const types = [];
      do {
        types.push(parseConstituentType());
      } while (this.eat(operator));
      if (types.length === 1 && !hasLeadingOperator) {
        return types[0];
      }
      node.types = types;
      return this.finishNode(node, kind);
    }

    tsParseIntersectionTypeOrHigher(): N.TsType {
      return this.tsParseUnionOrIntersectionType(
        "TSIntersectionType",
        this.tsParseTypeOperatorOrHigher.bind(this),
        tt.bitwiseAND,
      );
    }

    tsParseUnionTypeOrHigher() {
      return this.tsParseUnionOrIntersectionType(
        "TSUnionType",
        this.tsParseIntersectionTypeOrHigher.bind(this),
        tt.bitwiseOR,
      );
    }

    tsIsStartOfFunctionType() {
      if (this.match(tt.lt)) {
        return true;
      }
      return (
        this.match(tt.parenL) &&
        this.tsLookAhead(this.tsIsUnambiguouslyStartOfFunctionType.bind(this))
      );
    }

    tsSkipParameterStart(): boolean {
      if (tokenIsIdentifier(this.state.type) || this.match(tt._this)) {
        this.next();
        return true;
      }

      if (this.match(tt.braceL)) {
        // Return true if we can parse an object pattern without errors
        const { errors } = this.state;
        const previousErrorCount = errors.length;
        try {
          this.parseObjectLike(tt.braceR, true);
          return errors.length === previousErrorCount;
        } catch {
          return false;
        }
      }

      if (this.match(tt.bracketL)) {
        this.next();
        // Return true if we can parse an array pattern without errors
        const { errors } = this.state;
        const previousErrorCount = errors.length;
        try {
          super.parseBindingList(
            tt.bracketR,
            charCodes.rightSquareBracket,
            ParseBindingListFlags.ALLOW_EMPTY,
          );
          return errors.length === previousErrorCount;
        } catch {
          return false;
        }
      }

      return false;
    }

    tsIsUnambiguouslyStartOfFunctionType(): boolean {
      this.next();
      if (this.match(tt.parenR) || this.match(tt.ellipsis)) {
        // ( )
        // ( ...
        return true;
      }
      if (this.tsSkipParameterStart()) {
        if (
          this.match(tt.colon) ||
          this.match(tt.comma) ||
          this.match(tt.question) ||
          this.match(tt.eq)
        ) {
          // ( xxx :
          // ( xxx ,
          // ( xxx ?
          // ( xxx =
          return true;
        }
        if (this.match(tt.parenR)) {
          this.next();
          if (this.match(tt.arrow)) {
            // ( xxx ) =>
            return true;
          }
        }
      }
      return false;
    }

    tsParseTypeOrTypePredicateAnnotation(
      returnToken: TokenType,
    ): N.TsTypeAnnotation {
      return this.tsInType(() => {
        const t = this.startNode<N.TsTypeAnnotation>();
        this.expect(returnToken);

        const node = this.startNode<N.TsTypePredicate>();

        const asserts = !!this.tsTryParse(
          this.tsParseTypePredicateAsserts.bind(this),
        );

        if (asserts && this.match(tt._this)) {
          // When asserts is false, thisKeyword is handled by tsParseNonArrayType
          // : asserts this is type
          let thisTypePredicate = this.tsParseThisTypeOrThisTypePredicate();
          // if it turns out to be a `TSThisType`, wrap it with `TSTypePredicate`
          // : asserts this
          if (thisTypePredicate.type === "TSThisType") {
            node.parameterName = thisTypePredicate;
            node.asserts = true;
            (node as N.TsTypePredicate).typeAnnotation = null;
            thisTypePredicate = this.finishNode(node, "TSTypePredicate");
          } else {
            this.resetStartLocationFromNode(thisTypePredicate, node);
            thisTypePredicate.asserts = true;
          }
          t.typeAnnotation = thisTypePredicate;
          return this.finishNode(t, "TSTypeAnnotation");
        }

        const typePredicateVariable =
          this.tsIsIdentifier() &&
          this.tsTryParse(this.tsParseTypePredicatePrefix.bind(this));

        if (!typePredicateVariable) {
          if (!asserts) {
            // : type
            return this.tsParseTypeAnnotation(/* eatColon */ false, t);
          }

          // : asserts foo
          node.parameterName = this.parseIdentifier();
          node.asserts = asserts;
          (node as N.TsTypePredicate).typeAnnotation = null;
          t.typeAnnotation = this.finishNode(node, "TSTypePredicate");
          return this.finishNode(t, "TSTypeAnnotation");
        }

        // : asserts foo is type
        const type = this.tsParseTypeAnnotation(/* eatColon */ false);
        node.parameterName = typePredicateVariable;
        node.typeAnnotation = type;
        node.asserts = asserts;
        t.typeAnnotation = this.finishNode(node, "TSTypePredicate");
        return this.finishNode(t, "TSTypeAnnotation");
      });
    }

    tsTryParseTypeOrTypePredicateAnnotation(): N.TsTypeAnnotation | undefined {
      if (this.match(tt.colon)) {
        return this.tsParseTypeOrTypePredicateAnnotation(tt.colon);
      }
    }

    tsTryParseTypeAnnotation(): N.TsTypeAnnotation | undefined {
      if (this.match(tt.colon)) {
        return this.tsParseTypeAnnotation();
      }
    }

    tsTryParseType(): N.TsType | undefined {
      return this.tsEatThenParseType(tt.colon);
    }

    tsParseTypePredicatePrefix(): N.Identifier | undefined {
      const id = this.parseIdentifier();
      if (this.isContextual(tt._is) && !this.hasPrecedingLineBreak()) {
        this.next();
        return id;
      }
    }

    tsParseTypePredicateAsserts(): boolean {
      if (this.state.type !== tt._asserts) {
        return false;
      }
      const containsEsc = this.state.containsEsc;
      this.next();
      if (!tokenIsIdentifier(this.state.type) && !this.match(tt._this)) {
        return false;
      }

      if (containsEsc) {
        this.raise(
          Errors.InvalidEscapedReservedWord,
          this.state.lastTokStartLoc,
          {
            reservedWord: "asserts",
          },
        );
      }

      return true;
    }

    tsParseTypeAnnotation(
      eatColon = true,
      t: Undone<N.TsTypeAnnotation> = this.startNode<N.TsTypeAnnotation>(),
    ): N.TsTypeAnnotation {
      this.tsInType(() => {
        if (eatColon) this.expect(tt.colon);
        t.typeAnnotation = this.tsParseType();
      });
      return this.finishNode(t, "TSTypeAnnotation");
    }

    /** Be sure to be in a type context before calling this, using `tsInType`. */
    tsParseType(): N.TsType {
      // Need to set `state.inType` so that we don't parse JSX in a type context.
      assert(this.state.inType);
      const type = this.tsParseNonConditionalType();

      if (
        this.state.inDisallowConditionalTypesContext ||
        this.hasPrecedingLineBreak() ||
        !this.eat(tt._extends)
      ) {
        return type;
      }
      const node = this.startNodeAtNode<N.TsConditionalType>(type);
      node.checkType = type;

      node.extendsType = this.tsInDisallowConditionalTypesContext(() =>
        this.tsParseNonConditionalType(),
      );

      this.expect(tt.question);
      node.trueType = this.tsInAllowConditionalTypesContext(() =>
        this.tsParseType(),
      );

      this.expect(tt.colon);
      node.falseType = this.tsInAllowConditionalTypesContext(() =>
        this.tsParseType(),
      );

      return this.finishNode(node, "TSConditionalType");
    }

    isAbstractConstructorSignature(): boolean {
      return (
        this.isContextual(tt._abstract) && this.lookahead().type === tt._new
      );
    }

    tsParseNonConditionalType(): N.TsType {
      if (this.tsIsStartOfFunctionType()) {
        return this.tsParseFunctionOrConstructorType("TSFunctionType");
      }
      if (this.match(tt._new)) {
        // As in `new () => Date`
        return this.tsParseFunctionOrConstructorType("TSConstructorType");
      } else if (this.isAbstractConstructorSignature()) {
        // As in `abstract new () => Date`
        return this.tsParseFunctionOrConstructorType(
          "TSConstructorType",
          /* abstract */ true,
        );
      }
      return this.tsParseUnionTypeOrHigher();
    }

    tsParseTypeAssertion(): N.TsTypeAssertion {
      if (this.getPluginOption("typescript", "disallowAmbiguousJSXLike")) {
        this.raise(TSErrors.ReservedTypeAssertion, this.state.startLoc);
      }

      const node = this.startNode<N.TsTypeAssertion>();
      node.typeAnnotation = this.tsInType(() => {
        this.next(); // "<"
        return this.match(tt._const)
          ? this.tsParseTypeReference()
          : this.tsParseType();
      });
      this.expect(tt.gt);
      node.expression = this.parseMaybeUnary();
      return this.finishNode(node, "TSTypeAssertion");
    }

    tsParseHeritageClause(token: "extends"): Array<N.TSInterfaceHeritage>;
    tsParseHeritageClause(token: "implements"): Array<N.TSClassImplements>;
    tsParseHeritageClause(
      token: "extends" | "implements",
    ): Array<N.TSClassImplements> | Array<N.TSInterfaceHeritage> {
      const originalStartLoc = this.state.startLoc;

      const delimitedList = this.tsParseDelimitedList(
        "HeritageClauseElement",
        () => {
          const node = this.startNode<
            N.TSClassImplements | N.TSInterfaceHeritage
          >();
          node.expression = this.tsParseEntityName();
          if (this.match(tt.lt)) {
            node.typeParameters = this.tsParseTypeArguments();
          }

          return this.finishNode(
            node,
            // @ts-expect-error Babel 7 vs Babel 8
            process.env.BABEL_8_BREAKING
              ? token === "extends"
                ? "TSInterfaceHeritage"
                : "TSClassImplements"
              : "TSExpressionWithTypeArguments",
          );
        },
      );

      if (!delimitedList.length) {
        this.raise(TSErrors.EmptyHeritageClauseType, originalStartLoc, {
          token,
        });
      }

      return delimitedList as
        | Array<N.TSClassImplements>
        | Array<N.TSInterfaceHeritage>;
    }

    tsParseInterfaceDeclaration(
      node: Undone<N.TsInterfaceDeclaration>,
      properties: {
        declare?: true;
      } = {},
    ): N.TsInterfaceDeclaration | null {
      if (this.hasFollowingLineBreak()) return null;
      this.expectContextual(tt._interface);
      if (properties.declare) node.declare = true;
      if (tokenIsIdentifier(this.state.type)) {
        node.id = this.parseIdentifier();
        this.checkIdentifier(node.id, BindingFlag.TYPE_TS_INTERFACE);
      } else {
        node.id = null;
        this.raise(TSErrors.MissingInterfaceName, this.state.startLoc);
      }

      node.typeParameters = this.tsTryParseTypeParameters(
        this.tsParseInOutConstModifiers,
      );
      if (this.eat(tt._extends)) {
        node.extends = this.tsParseHeritageClause("extends");
      }
      const body = this.startNode<N.TSInterfaceBody>();
      body.body = this.tsInType(this.tsParseObjectTypeMembers.bind(this));
      node.body = this.finishNode(body, "TSInterfaceBody");
      return this.finishNode(node, "TSInterfaceDeclaration");
    }

    tsParseTypeAliasDeclaration(
      node: N.TsTypeAliasDeclaration,
    ): N.TsTypeAliasDeclaration {
      node.id = this.parseIdentifier();
      this.checkIdentifier(node.id, BindingFlag.TYPE_TS_TYPE);

      node.typeAnnotation = this.tsInType(() => {
        node.typeParameters = this.tsTryParseTypeParameters(
          this.tsParseInOutModifiers,
        );

        this.expect(tt.eq);

        if (
          this.isContextual(tt._intrinsic) &&
          this.lookahead().type !== tt.dot
        ) {
          const node = this.startNode<N.TsKeywordType>();
          this.next();
          return this.finishNode(node, "TSIntrinsicKeyword");
        }

        return this.tsParseType();
      });

      this.semicolon();
      return this.finishNode(node, "TSTypeAliasDeclaration");
    }

    tsInNoContext<T>(cb: () => T): T {
      const oldContext = this.state.context;
      this.state.context = [oldContext[0]];
      try {
        return cb();
      } finally {
        this.state.context = oldContext;
      }
    }

    /**
     * Runs `cb` in a type context.
     * This should be called one token *before* the first type token,
     * so that the call to `next()` is run in type context.
     */
    tsInType<T>(cb: () => T): T {
      const oldInType = this.state.inType;
      this.state.inType = true;
      try {
        return cb();
      } finally {
        this.state.inType = oldInType;
      }
    }

    tsInDisallowConditionalTypesContext<T>(cb: () => T): T {
      const oldInDisallowConditionalTypesContext =
        this.state.inDisallowConditionalTypesContext;
      this.state.inDisallowConditionalTypesContext = true;
      try {
        return cb();
      } finally {
        this.state.inDisallowConditionalTypesContext =
          oldInDisallowConditionalTypesContext;
      }
    }

    tsInAllowConditionalTypesContext<T>(cb: () => T): T {
      const oldInDisallowConditionalTypesContext =
        this.state.inDisallowConditionalTypesContext;
      this.state.inDisallowConditionalTypesContext = false;
      try {
        return cb();
      } finally {
        this.state.inDisallowConditionalTypesContext =
          oldInDisallowConditionalTypesContext;
      }
    }

    tsEatThenParseType(token: TokenType): N.TsType | undefined {
      if (this.match(token)) {
        return this.tsNextThenParseType();
      }
    }

    tsExpectThenParseType(token: TokenType): N.TsType {
      return this.tsInType(() => {
        this.expect(token);
        return this.tsParseType();
      });
    }

    tsNextThenParseType(): N.TsType {
      return this.tsInType(() => {
        this.next();
        return this.tsParseType();
      });
    }

    tsParseEnumMember(): N.TsEnumMember {
      const node = this.startNode<N.TsEnumMember>();
      // Computed property names are grammar errors in an enum, so accept just string literal or identifier.
      node.id = this.match(tt.string)
        ? super.parseStringLiteral(this.state.value)
        : this.parseIdentifier(/* liberal */ true);
      if (this.eat(tt.eq)) {
        node.initializer = super.parseMaybeAssignAllowIn();
      }
      return this.finishNode(node, "TSEnumMember");
    }

    tsParseEnumDeclaration(
      node: Undone<N.TsEnumDeclaration>,
      properties: {
        const?: true;
        declare?: true;
      } = {},
    ): N.TsEnumDeclaration {
      if (properties.const) node.const = true;
      if (properties.declare) node.declare = true;
      this.expectContextual(tt._enum);
      node.id = this.parseIdentifier();
      this.checkIdentifier(
        node.id,
        node.const ? BindingFlag.TYPE_TS_CONST_ENUM : BindingFlag.TYPE_TS_ENUM,
      );

      this.expect(tt.braceL);
      node.members = this.tsParseDelimitedList(
        "EnumMembers",
        this.tsParseEnumMember.bind(this),
      );
      this.expect(tt.braceR);
      return this.finishNode(node, "TSEnumDeclaration");
    }

    tsParseModuleBlock(): N.TsModuleBlock {
      const node = this.startNode<N.TsModuleBlock>();
      this.scope.enter(ScopeFlag.OTHER);

      this.expect(tt.braceL);
      // Inside of a module block is considered "top-level", meaning it can have imports and exports.
      super.parseBlockOrModuleBlockBody(
        (node.body = []),
        /* directives */ undefined,
        /* topLevel */ true,
        /* end */ tt.braceR,
      );
      this.scope.exit();
      return this.finishNode(node, "TSModuleBlock");
    }

    tsParseModuleOrNamespaceDeclaration(
      node: Undone<N.TsModuleDeclaration>,
      nested: boolean = false,
    ): N.TsModuleDeclaration {
      node.id = process.env.BABEL_8_BREAKING
        ? this.tsParseEntityName()
        : this.parseIdentifier();

      if (
        process.env.BABEL_8_BREAKING ? node.id.type === "Identifier" : !nested
      ) {
        // @ts-expect-error checked above
        this.checkIdentifier(node.id, BindingFlag.TYPE_TS_NAMESPACE);
      }

      if (!process.env.BABEL_8_BREAKING && this.eat(tt.dot)) {
        const inner = this.startNode<N.TsModuleDeclaration>();
        this.tsParseModuleOrNamespaceDeclaration(inner, true);
        // @ts-expect-error Fixme: refine typings
        node.body = inner;
      } else {
        this.scope.enter(ScopeFlag.TS_MODULE);
        this.prodParam.enter(ParamKind.PARAM);
        node.body = this.tsParseModuleBlock();
        this.prodParam.exit();
        this.scope.exit();
      }
      return this.finishNode(node, "TSModuleDeclaration");
    }

    tsParseAmbientExternalModuleDeclaration(
      node: N.TsModuleDeclaration,
    ): N.TsModuleDeclaration {
      if (this.isContextual(tt._global)) {
        node.kind = "global";
        if (!process.env.BABEL_8_BREAKING) {
          node.global = true;
        }
        node.id = this.parseIdentifier();
      } else if (this.match(tt.string)) {
        node.kind = "module";
        node.id = super.parseStringLiteral(this.state.value);
      } else {
        this.unexpected();
      }
      if (this.match(tt.braceL)) {
        this.scope.enter(ScopeFlag.TS_MODULE);
        this.prodParam.enter(ParamKind.PARAM);
        node.body = this.tsParseModuleBlock();
        this.prodParam.exit();
        this.scope.exit();
      } else {
        this.semicolon();
      }

      return this.finishNode(node, "TSModuleDeclaration");
    }

    tsParseImportEqualsDeclaration(
      node: Undone<N.TsImportEqualsDeclaration>,
      maybeDefaultIdentifier?: N.Identifier | null,
      isExport?: boolean,
    ): N.TsImportEqualsDeclaration {
      node.isExport = isExport || false;
      node.id = maybeDefaultIdentifier || this.parseIdentifier();
      this.checkIdentifier(node.id, BindingFlag.TYPE_TS_VALUE_IMPORT);
      this.expect(tt.eq);
      const moduleReference = this.tsParseModuleReference();
      if (
        node.importKind === "type" &&
        moduleReference.type !== "TSExternalModuleReference"
      ) {
        this.raise(TSErrors.ImportAliasHasImportType, moduleReference);
      }
      node.moduleReference = moduleReference;
      this.semicolon();
      return this.finishNode(node, "TSImportEqualsDeclaration");
    }

    tsIsExternalModuleReference(): boolean {
      return (
        this.isContextual(tt._require) &&
        this.lookaheadCharCode() === charCodes.leftParenthesis
      );
    }

    tsParseModuleReference(): N.TsModuleReference {
      return this.tsIsExternalModuleReference()
        ? this.tsParseExternalModuleReference()
        : this.tsParseEntityName(/* allowReservedWords */ false);
    }

    tsParseExternalModuleReference(): N.TsExternalModuleReference {
      const node = this.startNode<N.TsExternalModuleReference>();
      this.expectContextual(tt._require);
      this.expect(tt.parenL);
      if (!this.match(tt.string)) {
        this.unexpected();
      }
      // For compatibility to estree we cannot call parseLiteral directly here
      node.expression = super.parseExprAtom() as N.StringLiteral;
      this.expect(tt.parenR);
      this.sawUnambiguousESM = true;
      return this.finishNode(node, "TSExternalModuleReference");
    }

    // Utilities

    tsLookAhead<T>(f: () => T): T {
      const state = this.state.clone();
      const res = f();
      this.state = state;
      return res;
    }

    tsTryParseAndCatch<T extends N.NodeBase | undefined | null>(
      f: () => T,
    ): T | undefined | null {
      const result = this.tryParse(
        abort =>
          // @ts-expect-error todo(flow->ts)
          f() || abort(),
      );

      if (result.aborted || !result.node) return;
      if (result.error) this.state = result.failState;
      // @ts-expect-error refine typings
      return result.node;
    }

    tsTryParse<T>(f: () => T | undefined | false): T | undefined {
      const state = this.state.clone();
      const result = f();
      if (result !== undefined && result !== false) {
        return result;
      }
      this.state = state;
    }

    tsTryParseDeclare(nany: any): N.Declaration | undefined {
      if (this.isLineTerminator()) {
        return;
      }
      let startType = this.state.type;
      let kind: "let" | null;

      if (this.isContextual(tt._let)) {
        startType = tt._var;
        kind = "let";
      }

      // @ts-expect-error refine typings
      return this.tsInAmbientContext(() => {
        switch (startType) {
          case tt._function:
            nany.declare = true;
            return super.parseFunctionStatement(
              nany,
              /* async */ false,
              /* isHangingDeclaration */ false,
            );
          case tt._class:
            // While this is also set by tsParseExpressionStatement, we need to set it
            // before parsing the class declaration to know how to register it in the scope.
            nany.declare = true;
            return this.parseClass(
              nany,
              /* isStatement */ true,
              /* optionalId */ false,
            );
          case tt._enum:
            return this.tsParseEnumDeclaration(nany, { declare: true });
          case tt._global:
            return this.tsParseAmbientExternalModuleDeclaration(nany);
          case tt._const:
          case tt._var:
            if (!this.match(tt._const) || !this.isLookaheadContextual("enum")) {
              nany.declare = true;
              return this.parseVarStatement(
                nany,
                kind || this.state.value,
                true,
              );
            }

            // `const enum = 0;` not allowed because "enum" is a strict mode reserved word.
            this.expect(tt._const);
            return this.tsParseEnumDeclaration(nany, {
              const: true,
              declare: true,
            });
          case tt._interface: {
            const result = this.tsParseInterfaceDeclaration(nany, {
              declare: true,
            });
            if (result) return result;
          }
          // fallthrough
          default:
            if (tokenIsIdentifier(startType)) {
              return this.tsParseDeclaration(
                nany,
                this.state.value,
                /* next */ true,
                /* decorators */ null,
              );
            }
        }
      });
    }

    // Note: this won't be called unless the keyword is allowed in `shouldParseExportDeclaration`.
    tsTryParseExportDeclaration(): N.Declaration | undefined {
      return this.tsParseDeclaration(
        this.startNode(),
        this.state.value,
        /* next */ true,
        /* decorators */ null,
      );
    }

    tsParseExpressionStatement(
      node: Undone<N.TsModuleDeclaration>,
      expr: N.Identifier,
      decorators: N.Decorator[] | null,
    ): N.Declaration | undefined {
      switch (expr.name) {
        case "declare": {
          const declaration = this.tsTryParseDeclare(node);
          if (declaration) {
            declaration.declare = true;
          }
          return declaration;
        }
        case "global":
          // `global { }` (with no `declare`) may appear inside an ambient module declaration.
          // Would like to use tsParseAmbientExternalModuleDeclaration here, but already ran past "global".
          if (this.match(tt.braceL)) {
            this.scope.enter(ScopeFlag.TS_MODULE);
            this.prodParam.enter(ParamKind.PARAM);
            const mod = node;
            mod.kind = "global";
            if (!process.env.BABEL_8_BREAKING) {
              node.global = true;
            }
            mod.id = expr;
            mod.body = this.tsParseModuleBlock();
            this.scope.exit();
            this.prodParam.exit();
            return this.finishNode(mod, "TSModuleDeclaration");
          }
          break;

        default:
          return this.tsParseDeclaration(
            node,
            expr.name,
            /* next */ false,
            decorators,
          );
      }
    }

    // Common to tsTryParseDeclare, tsTryParseExportDeclaration, and tsParseExpressionStatement.
    tsParseDeclaration(
      node: any,
      value: string,
      next: boolean,
      decorators: N.Decorator[] | null,
    ): N.Declaration | undefined | null {
      // no declaration apart from enum can be followed by a line break.
      switch (value) {
        case "abstract":
          if (
            this.tsCheckLineTerminator(next) &&
            (this.match(tt._class) || tokenIsIdentifier(this.state.type))
          ) {
            return this.tsParseAbstractDeclaration(node, decorators);
          }
          break;

        case "module":
          if (this.tsCheckLineTerminator(next)) {
            if (this.match(tt.string)) {
              return this.tsParseAmbientExternalModuleDeclaration(node);
            } else if (tokenIsIdentifier(this.state.type)) {
              node.kind = "module";
              return this.tsParseModuleOrNamespaceDeclaration(node);
            }
          }
          break;

        case "namespace":
          if (
            this.tsCheckLineTerminator(next) &&
            tokenIsIdentifier(this.state.type)
          ) {
            node.kind = "namespace";
            return this.tsParseModuleOrNamespaceDeclaration(node);
          }
          break;

        case "type":
          if (
            this.tsCheckLineTerminator(next) &&
            tokenIsIdentifier(this.state.type)
          ) {
            return this.tsParseTypeAliasDeclaration(node);
          }
          break;
      }
    }

    tsCheckLineTerminator(next: boolean) {
      if (next) {
        if (this.hasFollowingLineBreak()) return false;
        this.next();
        return true;
      }
      return !this.isLineTerminator();
    }

    tsTryParseGenericAsyncArrowFunction(
      startLoc: Position,
    ): N.ArrowFunctionExpression | undefined {
      if (!this.match(tt.lt)) return;

      const oldMaybeInArrowParameters = this.state.maybeInArrowParameters;
      this.state.maybeInArrowParameters = true;

      const res: Undone<N.ArrowFunctionExpression> | undefined =
        this.tsTryParseAndCatch(() => {
          const node = this.startNodeAt<N.ArrowFunctionExpression>(startLoc);
          node.typeParameters = this.tsParseTypeParameters(
            this.tsParseConstModifier,
          );
          // Don't use overloaded parseFunctionParams which would look for "<" again.
          super.parseFunctionParams(node);
          node.returnType = this.tsTryParseTypeOrTypePredicateAnnotation();
          this.expect(tt.arrow);
          return node;
        });

      this.state.maybeInArrowParameters = oldMaybeInArrowParameters;

      if (!res) return;

      return super.parseArrowExpression(
        res,
        /* params are already set */ null,
        /* async */ true,
      );
    }

    // Used when parsing type arguments from ES productions, where the first token
    // has been created without state.inType. Thus we need to rescan the lt token.
    tsParseTypeArgumentsInExpression():
      | N.TsTypeParameterInstantiation
      | undefined {
      if (this.reScan_lt() !== tt.lt) return;
      return this.tsParseTypeArguments();
    }

    tsParseTypeArguments(): N.TsTypeParameterInstantiation {
      const node = this.startNode<N.TsTypeParameterInstantiation>();
      node.params = this.tsInType(() =>
        // Temporarily remove a JSX parsing context, which makes us scan different tokens.
        this.tsInNoContext(() => {
          this.expect(tt.lt);
          return this.tsParseDelimitedList(
            "TypeParametersOrArguments",
            this.tsParseType.bind(this),
          );
        }),
      );
      if (node.params.length === 0) {
        this.raise(TSErrors.EmptyTypeArguments, node);
      } else if (!this.state.inType && this.curContext() === tc.brace) {
        // rescan `>` when we are no longer in type context and JSX parsing context
        // since it was tokenized when `inType` is `true`.
        this.reScan_lt_gt();
      }
      this.expect(tt.gt);
      return this.finishNode(node, "TSTypeParameterInstantiation");
    }

    tsIsDeclarationStart(): boolean {
      return tokenIsTSDeclarationStart(this.state.type);
    }

    // ======================================================
    // OVERRIDES
    // ======================================================

    isExportDefaultSpecifier(): boolean {
      if (this.tsIsDeclarationStart()) return false;
      return super.isExportDefaultSpecifier();
    }

    parseAssignableListItem(
      flags: ParseBindingListFlags,
      decorators: N.Decorator[],
    ): N.Pattern | N.TSParameterProperty {
      // Store original location to include modifiers in range
      const startLoc = this.state.startLoc;

      const modified: ModifierBase = {};
      this.tsParseModifiers(
        {
          allowedModifiers: [
            "public",
            "private",
            "protected",
            "override",
            "readonly",
          ],
        },
        modified,
      );
      const accessibility = modified.accessibility;
      const override = modified.override;
      const readonly = modified.readonly;
      if (
        !(flags & ParseBindingListFlags.IS_CONSTRUCTOR_PARAMS) &&
        (accessibility || readonly || override)
      ) {
        this.raise(TSErrors.UnexpectedParameterModifier, startLoc);
      }

      const left = this.parseMaybeDefault();
      if (flags & ParseBindingListFlags.IS_FUNCTION_PARAMS) {
        this.parseFunctionParamType(left);
      }
      const elt = this.parseMaybeDefault(left.loc.start, left);
      if (accessibility || readonly || override) {
        const pp = this.startNodeAt<N.TSParameterProperty>(startLoc);
        if (decorators.length) {
          pp.decorators = decorators;
        }
        if (accessibility) pp.accessibility = accessibility;
        if (readonly) pp.readonly = readonly;
        if (override) pp.override = override;
        if (elt.type !== "Identifier" && elt.type !== "AssignmentPattern") {
          this.raise(TSErrors.UnsupportedParameterPropertyKind, pp);
        }
        pp.parameter = elt as any as N.Identifier | N.AssignmentPattern;
        return this.finishNode(pp, "TSParameterProperty");
      }

      if (decorators.length) {
        left.decorators = decorators;
      }

      return elt;
    }

    isSimpleParameter(node: N.Pattern | N.TSParameterProperty): boolean {
      return (
        (node.type === "TSParameterProperty" &&
          super.isSimpleParameter(node.parameter)) ||
        super.isSimpleParameter(node)
      );
    }

    tsDisallowOptionalPattern(node: Undone<N.Function>) {
      for (const param of node.params) {
        if (
          param.type !== "Identifier" &&
          (param as any).optional &&
          !this.state.isAmbientContext
        ) {
          this.raise(TSErrors.PatternIsOptional, param);
        }
      }
    }

    setArrowFunctionParameters(
      node: Undone<N.ArrowFunctionExpression>,
      params: N.Expression[],
      trailingCommaLoc?: Position | null,
    ): void {
      super.setArrowFunctionParameters(node, params, trailingCommaLoc);
      this.tsDisallowOptionalPattern(node);
    }

    parseFunctionBodyAndFinish<
      T extends
        | N.Function
        | N.TSDeclareMethod
        | N.TSDeclareFunction
        | N.ClassPrivateMethod,
    >(node: Undone<T>, type: T["type"], isMethod: boolean = false): T {
      if (this.match(tt.colon)) {
        node.returnType = this.tsParseTypeOrTypePredicateAnnotation(tt.colon);
      }

      const bodilessType =
        type === "FunctionDeclaration"
          ? "TSDeclareFunction"
          : type === "ClassMethod" || type === "ClassPrivateMethod"
            ? "TSDeclareMethod"
            : undefined;
      if (bodilessType && !this.match(tt.braceL) && this.isLineTerminator()) {
        return this.finishNode(node, bodilessType);
      }
      if (bodilessType === "TSDeclareFunction" && this.state.isAmbientContext) {
        this.raise(TSErrors.DeclareFunctionHasImplementation, node);
        if ((node as Undone<N.FunctionDeclaration>).declare) {
          return super.parseFunctionBodyAndFinish(node, bodilessType, isMethod);
        }
      }
      this.tsDisallowOptionalPattern(node);

      return super.parseFunctionBodyAndFinish(node, type, isMethod);
    }

    registerFunctionStatementId(node: N.Function): void {
      if (!node.body && node.id) {
        // Function ids are validated after parsing their body.
        // For bodiless function, we need to do it here.
        this.checkIdentifier(node.id, BindingFlag.TYPE_TS_AMBIENT);
      } else {
        super.registerFunctionStatementId(node);
      }
    }

    tsCheckForInvalidTypeCasts(items: Array<N.Expression | N.SpreadElement>) {
      items.forEach(node => {
        if (node?.type === "TSTypeCastExpression") {
          this.raise(TSErrors.UnexpectedTypeAnnotation, node.typeAnnotation);
        }
      });
    }

    toReferencedList(
      exprList: Array<N.Expression | undefined | null>,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      isInParens?: boolean,
    ): Array<N.Expression | undefined | null> {
      // Handles invalid scenarios like: `f(a:b)`, `(a:b);`, and `(a:b,c:d)`.
      //
      // Note that `f<T>(a:b)` goes through a different path and is handled
      // in `parseSubscript` directly.
      this.tsCheckForInvalidTypeCasts(exprList);
      return exprList;
    }

    parseArrayLike(
      close: TokenType,
      canBePattern: boolean,
      isTuple: boolean,
      refExpressionErrors?: ExpressionErrors | null,
    ): N.ArrayExpression | N.TupleExpression {
      const node = super.parseArrayLike(
        close,
        canBePattern,
        isTuple,
        refExpressionErrors,
      );

      if (node.type === "ArrayExpression") {
        this.tsCheckForInvalidTypeCasts(node.elements);
      }

      return node;
    }

    parseSubscript(
      base: N.Expression,

      startLoc: Position,
      noCalls: boolean | undefined | null,
      state: N.ParseSubscriptState,
    ): N.Expression {
      if (!this.hasPrecedingLineBreak() && this.match(tt.bang)) {
        // When ! is consumed as a postfix operator (non-null assertion),
        // disallow JSX tag forming after. e.g. When parsing `p! < n.p!`
        // `<n.p` can not be a start of JSX tag
        this.state.canStartJSXElement = false;
        this.next();

        const nonNullExpression =
          this.startNodeAt<N.TsNonNullExpression>(startLoc);
        nonNullExpression.expression = base;
        return this.finishNode(nonNullExpression, "TSNonNullExpression");
      }

      let isOptionalCall = false;
      if (
        this.match(tt.questionDot) &&
        this.lookaheadCharCode() === charCodes.lessThan
      ) {
        if (noCalls) {
          state.stop = true;
          return base;
        }
        state.optionalChainMember = isOptionalCall = true;
        this.next();
      }

      // handles 'f<<T>'
      if (this.match(tt.lt) || this.match(tt.bitShiftL)) {
        let missingParenErrorLoc;
        // tsTryParseAndCatch is expensive, so avoid if not necessary.
        // There are number of things we are going to "maybe" parse, like type arguments on
        // tagged template expressions. If any of them fail, walk it back and continue.
        const result = this.tsTryParseAndCatch(() => {
          if (!noCalls && this.atPossibleAsyncArrow(base)) {
            // Almost certainly this is a generic async function `async <T>() => ...
            // But it might be a call with a type argument `async<T>();`
            const asyncArrowFn =
              this.tsTryParseGenericAsyncArrowFunction(startLoc);
            if (asyncArrowFn) {
              return asyncArrowFn;
            }
          }

          const typeArguments = this.tsParseTypeArgumentsInExpression();
          if (!typeArguments) return;

          if (isOptionalCall && !this.match(tt.parenL)) {
            missingParenErrorLoc = this.state.curPosition();
            return;
          }

          if (tokenIsTemplate(this.state.type)) {
            const result = super.parseTaggedTemplateExpression(
              base,
              startLoc,
              state,
            );
            result.typeParameters = typeArguments;
            return result;
          }

          if (!noCalls && this.eat(tt.parenL)) {
            const node = this.startNodeAt<
              N.CallExpression | N.OptionalCallExpression
            >(startLoc);
            node.callee = base;
            // @ts-expect-error (won't be any undefined arguments)
            node.arguments = this.parseCallExpressionArguments(tt.parenR);

            // Handles invalid case: `f<T>(a:b)`
            this.tsCheckForInvalidTypeCasts(node.arguments);

            node.typeParameters = typeArguments;
            if (state.optionalChainMember) {
              (node as Undone<N.OptionalCallExpression>).optional =
                isOptionalCall;
            }

            return this.finishCallExpression(node, state.optionalChainMember);
          }

          const tokenType = this.state.type;
          if (
            // a<b>>c is not (a<b>)>c, but a<(b>>c)
            tokenType === tt.gt ||
            // a<b>>>c is not (a<b>)>>c, but a<(b>>>c)
            tokenType === tt.bitShiftR ||
            // a<b>c is (a<b)>c
            (tokenType !== tt.parenL &&
              tokenCanStartExpression(tokenType) &&
              !this.hasPrecedingLineBreak())
          ) {
            // Bail out.
            return;
          }

          const node = this.startNodeAt<N.TsInstantiationExpression>(startLoc);
          node.expression = base;
          node.typeParameters = typeArguments;
          return this.finishNode(node, "TSInstantiationExpression");
        });

        if (missingParenErrorLoc) {
          this.unexpected(missingParenErrorLoc, tt.parenL);
        }

        if (result) {
          if (
            result.type === "TSInstantiationExpression" &&
            (this.match(tt.dot) ||
              (this.match(tt.questionDot) &&
                this.lookaheadCharCode() !== charCodes.leftParenthesis))
          ) {
            this.raise(
              TSErrors.InvalidPropertyAccessAfterInstantiationExpression,
              this.state.startLoc,
            );
          }
          return result;
        }
      }

      return super.parseSubscript(base, startLoc, noCalls, state);
    }

    parseNewCallee(node: N.NewExpression): void {
      super.parseNewCallee(node);

      const { callee } = node;
      if (
        callee.type === "TSInstantiationExpression" &&
        !callee.extra?.parenthesized
      ) {
        node.typeParameters = callee.typeParameters;
        node.callee = callee.expression;
      }
    }

    parseExprOp(
      left: N.Expression,
      leftStartLoc: Position,
      minPrec: number,
    ): N.Expression {
      let isSatisfies: boolean;
      if (
        tokenOperatorPrecedence(tt._in) > minPrec &&
        !this.hasPrecedingLineBreak() &&
        (this.isContextual(tt._as) ||
          (isSatisfies = this.isContextual(tt._satisfies)))
      ) {
        const node = this.startNodeAt<
          N.TsAsExpression | N.TsSatisfiesExpression
        >(leftStartLoc);
        node.expression = left;
        node.typeAnnotation = this.tsInType(() => {
          this.next(); // "as" or "satisfies"
          if (this.match(tt._const)) {
            if (isSatisfies) {
              this.raise(Errors.UnexpectedKeyword, this.state.startLoc, {
                keyword: "const",
              });
            }
            return this.tsParseTypeReference();
          }

          return this.tsParseType();
        });
        this.finishNode(
          node,
          isSatisfies ? "TSSatisfiesExpression" : "TSAsExpression",
        );
        // rescan `<`, `>` because they were scanned when this.state.inType was true
        this.reScan_lt_gt();
        return this.parseExprOp(
          // @ts-expect-error todo(flow->ts)
          node,
          leftStartLoc,
          minPrec,
        );
      }

      return super.parseExprOp(left, leftStartLoc, minPrec);
    }

    checkReservedWord(
      word: string,
      startLoc: Position,
      checkKeywords: boolean,
      isBinding: boolean,
    ): void {
      // Strict mode words may be allowed as in `declare namespace N { const static: number; }`.
      // And we have a type checker anyway, so don't bother having the parser do it.
      if (!this.state.isAmbientContext) {
        super.checkReservedWord(word, startLoc, checkKeywords, isBinding);
      }
    }

    checkImportReflection(node: Undone<N.ImportDeclaration>) {
      super.checkImportReflection(node);
      if (node.module && node.importKind !== "value") {
        this.raise(
          TSErrors.ImportReflectionHasImportType,
          node.specifiers[0].loc.start,
        );
      }
    }

    /*
    Don't bother doing this check in TypeScript code because:
    1. We may have a nested export statement with the same name:
      export const x = 0;
      export namespace N {
        export const x = 1;
      }
    2. We have a type checker to warn us about this sort of thing.
    */
    checkDuplicateExports() {}

    isPotentialImportPhase(isExport: boolean): boolean {
      if (super.isPotentialImportPhase(isExport)) return true;
      if (this.isContextual(tt._type)) {
        const ch = this.lookaheadCharCode();
        return isExport
          ? ch === charCodes.leftCurlyBrace || ch === charCodes.asterisk
          : ch !== charCodes.equalsTo;
      }
      return !isExport && this.isContextual(tt._typeof);
    }

    applyImportPhase(
      node: Undone<N.ImportDeclaration | N.ExportNamedDeclaration>,
      isExport: boolean,
      phase: string | null,
      loc?: Position,
    ): void {
      super.applyImportPhase(node, isExport, phase, loc);
      if (isExport) {
        (node as N.ExportNamedDeclaration).exportKind =
          phase === "type" ? "type" : "value";
      } else {
        (node as N.ImportDeclaration).importKind =
          phase === "type" || phase === "typeof" ? phase : "value";
      }
    }

    parseImport(
      node: Undone<N.ImportDeclaration | N.TsImportEqualsDeclaration>,
    ): N.AnyImport {
      if (this.match(tt.string)) {
        node.importKind = "value";
        return super.parseImport(node as Undone<N.ImportDeclaration>);
      }

      let importNode;
      if (
        tokenIsIdentifier(this.state.type) &&
        this.lookaheadCharCode() === charCodes.equalsTo
      ) {
        node.importKind = "value";
        return this.tsParseImportEqualsDeclaration(
          node as Undone<N.TsImportEqualsDeclaration>,
        );
      } else if (this.isContextual(tt._type)) {
        const maybeDefaultIdentifier = this.parseMaybeImportPhase(
          node as Undone<N.ImportDeclaration>,
          /* isExport */ false,
        );
        if (this.lookaheadCharCode() === charCodes.equalsTo) {
          return this.tsParseImportEqualsDeclaration(
            node as Undone<N.TsImportEqualsDeclaration>,
            maybeDefaultIdentifier,
          );
        } else {
          importNode = super.parseImportSpecifiersAndAfter(
            node as Undone<N.ImportDeclaration>,
            maybeDefaultIdentifier,
          );
        }
      } else {
        importNode = super.parseImport(node as Undone<N.ImportDeclaration>);
      }

      // `import type` can only be used on imports with named imports or with a
      // default import - but not both
      if (
        importNode.importKind === "type" &&
        // @ts-expect-error refine typings
        importNode.specifiers.length > 1 &&
        // @ts-expect-error refine typings
        importNode.specifiers[0].type === "ImportDefaultSpecifier"
      ) {
        this.raise(TSErrors.TypeImportCannotSpecifyDefaultAndNamed, importNode);
      }

      return importNode;
    }

    parseExport(
      node: Undone<
        | N.ExportDefaultDeclaration
        | N.ExportAllDeclaration
        | N.ExportNamedDeclaration
      >,
      decorators: N.Decorator[] | null,
    ): N.AnyExport {
      if (this.match(tt._import)) {
        // `export import A = B;`
        this.next(); // eat `tt._import`
        const nodeImportEquals = node as Undone<N.TsImportEqualsDeclaration>;
        let maybeDefaultIdentifier: N.Identifier | null = null;
        if (
          this.isContextual(tt._type) &&
          // We pass false here, because we are parsing an `import ... =`
          this.isPotentialImportPhase(/* isExport */ false)
        ) {
          maybeDefaultIdentifier = this.parseMaybeImportPhase(
            nodeImportEquals,
            /* isExport */ false,
          );
        } else {
          nodeImportEquals.importKind = "value";
        }
        return this.tsParseImportEqualsDeclaration(
          nodeImportEquals,
          maybeDefaultIdentifier,
          /* isExport */ true,
        );
      } else if (this.eat(tt.eq)) {
        // `export = x;`
        const assign = node as Undone<N.TsExportAssignment>;
        assign.expression = super.parseExpression();
        this.semicolon();
        this.sawUnambiguousESM = true;
        return this.finishNode(assign, "TSExportAssignment");
      } else if (this.eatContextual(tt._as)) {
        // `export as namespace A;`
        const decl = node as Undone<N.TsNamespaceExportDeclaration>;
        // See `parseNamespaceExportDeclaration` in TypeScript's own parser
        this.expectContextual(tt._namespace);
        decl.id = this.parseIdentifier();
        this.semicolon();
        return this.finishNode(decl, "TSNamespaceExportDeclaration");
      } else {
        return super.parseExport(
          node as Undone<N.ExportAllDeclaration | N.ExportDefaultDeclaration>,
          decorators,
        );
      }
    }

    isAbstractClass(): boolean {
      return (
        this.isContextual(tt._abstract) && this.lookahead().type === tt._class
      );
    }

    parseExportDefaultExpression(): N.ExportDefaultDeclaration["declaration"] {
      if (this.isAbstractClass()) {
        const cls = this.startNode<N.Class>();
        this.next(); // Skip "abstract"
        cls.abstract = true;
        return this.parseClass(cls, true, true);
      }

      // export default interface allowed in:
      // https://github.com/Microsoft/TypeScript/pull/16040
      if (this.match(tt._interface)) {
        const result = this.tsParseInterfaceDeclaration(
          this.startNode<N.TsInterfaceDeclaration>(),
        );
        if (result) return result;
      }

      return super.parseExportDefaultExpression();
    }

    parseVarStatement(
      node: N.VariableDeclaration,
      kind: "var" | "let" | "const" | "using",
      allowMissingInitializer: boolean = false,
    ) {
      const { isAmbientContext } = this.state;
      const declaration = super.parseVarStatement(
        node,
        kind,
        allowMissingInitializer || isAmbientContext,
      );

      if (!isAmbientContext) return declaration;

      for (const { id, init } of declaration.declarations) {
        // Empty initializer is the easy case that we want.
        if (!init) continue;

        // var and let aren't ever allowed initializers.
        if (kind !== "const" || !!id.typeAnnotation) {
          this.raise(TSErrors.InitializerNotAllowedInAmbientContext, init);
        } else if (
          !isValidAmbientConstInitializer(init, this.hasPlugin("estree"))
        ) {
          this.raise(
            TSErrors.ConstInitializerMustBeStringOrNumericLiteralOrLiteralEnumReference,
            init,
          );
        }
      }

      return declaration;
    }

    parseStatementContent(
      flags: ParseStatementFlag,
      decorators?: N.Decorator[] | null,
    ): N.Statement {
      if (this.match(tt._const) && this.isLookaheadContextual("enum")) {
        const node = this.startNode<N.TsEnumDeclaration>();
        this.expect(tt._const); // eat 'const'
        return this.tsParseEnumDeclaration(node, { const: true });
      }

      if (this.isContextual(tt._enum)) {
        return this.tsParseEnumDeclaration(
          this.startNode<N.TsEnumDeclaration>(),
        );
      }

      if (this.isContextual(tt._interface)) {
        const result = this.tsParseInterfaceDeclaration(this.startNode());
        if (result) return result;
      }

      return super.parseStatementContent(flags, decorators);
    }

    parseAccessModifier(): N.Accessibility | undefined | null {
      return this.tsParseModifier(["public", "protected", "private"]);
    }

    tsHasSomeModifiers(member: any, modifiers: readonly TsModifier[]): boolean {
      return modifiers.some(modifier => {
        if (tsIsAccessModifier(modifier)) {
          return member.accessibility === modifier;
        }
        return !!member[modifier];
      });
    }

    tsIsStartOfStaticBlocks() {
      return (
        this.isContextual(tt._static) &&
        this.lookaheadCharCode() === charCodes.leftCurlyBrace
      );
    }

    parseClassMember(
      classBody: N.ClassBody,
      member: any,
      state: N.ParseClassMemberState,
    ): void {
      const modifiers = [
        "declare",
        "private",
        "public",
        "protected",
        "override",
        "abstract",
        "readonly",
        "static",
      ] as const;
      this.tsParseModifiers(
        {
          allowedModifiers: modifiers,
          disallowedModifiers: ["in", "out"],
          stopOnStartOfClassStaticBlock: true,
          errorTemplate: TSErrors.InvalidModifierOnTypeParameterPositions,
        },
        member,
      );

      const callParseClassMemberWithIsStatic = () => {
        if (this.tsIsStartOfStaticBlocks()) {
          this.next(); // eat "static"
          this.next(); // eat "{"
          if (this.tsHasSomeModifiers(member, modifiers)) {
            this.raise(
              TSErrors.StaticBlockCannotHaveModifier,
              this.state.curPosition(),
            );
          }
          super.parseClassStaticBlock(classBody, member as N.StaticBlock);
        } else {
          this.parseClassMemberWithIsStatic(
            classBody,
            member,
            state,
            !!member.static,
          );
        }
      };
      if (member.declare) {
        this.tsInAmbientContext(callParseClassMemberWithIsStatic);
      } else {
        callParseClassMemberWithIsStatic();
      }
    }

    parseClassMemberWithIsStatic(
      classBody: N.ClassBody,
      member: Undone<N.ClassMember | N.TsIndexSignature>,
      state: N.ParseClassMemberState,
      isStatic: boolean,
    ): void {
      const idx = this.tsTryParseIndexSignature(
        member as Undone<N.TsIndexSignature>,
      );
      if (idx) {
        classBody.body.push(idx);

        if ((member as any).abstract) {
          this.raise(TSErrors.IndexSignatureHasAbstract, member);
        }
        if ((member as any).accessibility) {
          this.raise(TSErrors.IndexSignatureHasAccessibility, member, {
            modifier: (member as any).accessibility,
          });
        }
        if ((member as any).declare) {
          this.raise(TSErrors.IndexSignatureHasDeclare, member);
        }
        if ((member as any).override) {
          this.raise(TSErrors.IndexSignatureHasOverride, member);
        }

        return;
      }

      if (!this.state.inAbstractClass && (member as any).abstract) {
        this.raise(TSErrors.NonAbstractClassHasAbstractMethod, member);
      }

      if ((member as any).override) {
        if (!state.hadSuperClass) {
          this.raise(TSErrors.OverrideNotInSubClass, member);
        }
      }

      /*:: invariant(member.type !== "TSIndexSignature") */

      super.parseClassMemberWithIsStatic(
        classBody,
        member as Undone<N.ClassMember>,
        state,
        isStatic,
      );
    }

    parsePostMemberNameModifiers(
      methodOrProp: N.ClassMethod | N.ClassProperty | N.ClassPrivateProperty,
    ): void {
      const optional = this.eat(tt.question);
      if (optional) methodOrProp.optional = true;

      if ((methodOrProp as any).readonly && this.match(tt.parenL)) {
        this.raise(TSErrors.ClassMethodHasReadonly, methodOrProp);
      }

      if ((methodOrProp as any).declare && this.match(tt.parenL)) {
        this.raise(TSErrors.ClassMethodHasDeclare, methodOrProp);
      }
    }

    // Note: The reason we do this in `parseExpressionStatement` and not `parseStatement`
    // is that e.g. `type()` is valid JS, so we must try parsing that first.
    // If it's really a type, we will parse `type` as the statement, and can correct it here
    // by parsing the rest.
    // @ts-expect-error plugin overrides interfaces
    parseExpressionStatement(
      node: Undone<N.ExpressionStatement>,
      expr: N.Expression,
      decorators: N.Decorator[] | null,
    ): N.Statement {
      const decl =
        expr.type === "Identifier"
          ? // @ts-expect-error refine typings
            this.tsParseExpressionStatement(node, expr, decorators)
          : undefined;
      return decl || super.parseExpressionStatement(node, expr, decorators);
    }

    // export type
    // Should be true for anything parsed by `tsTryParseExportDeclaration`.
    shouldParseExportDeclaration(): boolean {
      if (this.tsIsDeclarationStart()) return true;
      return super.shouldParseExportDeclaration();
    }

    // An apparent conditional expression could actually be an optional parameter in an arrow function.
    parseConditional(
      expr: N.Expression,

      startLoc: Position,
      refExpressionErrors?: ExpressionErrors | null,
    ): N.Expression {
      // only do the expensive clone if there is a question mark
      // and if we come from inside parens
      if (!this.state.maybeInArrowParameters || !this.match(tt.question)) {
        return super.parseConditional(
          expr,

          startLoc,
          refExpressionErrors,
        );
      }

      const result = this.tryParse(() =>
        super.parseConditional(expr, startLoc),
      );

      if (!result.node) {
        if (result.error) {
          /*:: invariant(refExpressionErrors != null) */
          super.setOptionalParametersError(refExpressionErrors, result.error);
        }

        return expr;
      }
      if (result.error) this.state = result.failState;
      return result.node;
    }

    // Note: These "type casts" are *not* valid TS expressions.
    // But we parse them here and change them when completing the arrow function.
    parseParenItem<T extends N.Expression | N.RestElement | N.SpreadElement>(
      node: T,
      startLoc: Position,
    ): T | N.TsTypeCastExpression {
      const newNode = super.parseParenItem(node, startLoc);
      if (this.eat(tt.question)) {
        (newNode as N.Identifier).optional = true;
        // Include questionmark in location of node
        // Don't use this.finishNode() as otherwise we might process comments twice and
        // include already consumed parens
        this.resetEndLocation(node);
      }

      if (this.match(tt.colon)) {
        const typeCastNode = this.startNodeAt<N.TsTypeCastExpression>(startLoc);
        typeCastNode.expression = node as N.Expression;
        typeCastNode.typeAnnotation = this.tsParseTypeAnnotation();

        return this.finishNode(typeCastNode, "TSTypeCastExpression");
      }

      return node;
    }

    parseExportDeclaration(
      node: N.ExportNamedDeclaration,
    ): N.Declaration | undefined | null {
      if (!this.state.isAmbientContext && this.isContextual(tt._declare)) {
        return this.tsInAmbientContext(() => this.parseExportDeclaration(node));
      }

      // Store original location
      const startLoc = this.state.startLoc;

      const isDeclare = this.eatContextual(tt._declare);

      if (
        isDeclare &&
        (this.isContextual(tt._declare) || !this.shouldParseExportDeclaration())
      ) {
        throw this.raise(
          TSErrors.ExpectedAmbientAfterExportDeclare,
          this.state.startLoc,
        );
      }

      const isIdentifier = tokenIsIdentifier(this.state.type);
      const declaration: N.Declaration | undefined | null =
        (isIdentifier && this.tsTryParseExportDeclaration()) ||
        super.parseExportDeclaration(node);

      if (!declaration) return null;

      if (
        declaration.type === "TSInterfaceDeclaration" ||
        declaration.type === "TSTypeAliasDeclaration" ||
        isDeclare
      ) {
        node.exportKind = "type";
      }

      if (isDeclare) {
        // Reset location to include `declare` in range
        this.resetStartLocation(declaration, startLoc);

        declaration.declare = true;
      }

      return declaration;
    }

    parseClassId(
      node: N.Class,
      isStatement: boolean,
      optionalId?: boolean | null,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      bindingType?: BindingFlag,
    ): void {
      if ((!isStatement || optionalId) && this.isContextual(tt._implements)) {
        return;
      }

      super.parseClassId(
        node,
        isStatement,
        optionalId,
        (node as any).declare
          ? BindingFlag.TYPE_TS_AMBIENT
          : BindingFlag.TYPE_CLASS,
      );
      const typeParameters = this.tsTryParseTypeParameters(
        this.tsParseInOutConstModifiers,
      );
      if (typeParameters) node.typeParameters = typeParameters;
    }

    parseClassPropertyAnnotation(
      node: N.ClassProperty | N.ClassPrivateProperty | N.ClassAccessorProperty,
    ): void {
      if (!node.optional) {
        if (this.eat(tt.bang)) {
          node.definite = true;
        } else if (this.eat(tt.question)) {
          node.optional = true;
        }
      }

      const type = this.tsTryParseTypeAnnotation();
      if (type) node.typeAnnotation = type;
    }

    parseClassProperty(node: N.ClassProperty): N.ClassProperty {
      this.parseClassPropertyAnnotation(node);

      if (
        this.state.isAmbientContext &&
        !(node.readonly && !node.typeAnnotation) &&
        this.match(tt.eq)
      ) {
        this.raise(
          TSErrors.DeclareClassFieldHasInitializer,
          this.state.startLoc,
        );
      }
      if (node.abstract && this.match(tt.eq)) {
        const { key } = node;
        this.raise(
          TSErrors.AbstractPropertyHasInitializer,
          this.state.startLoc,
          {
            propertyName:
              key.type === "Identifier" && !node.computed
                ? key.name
                : `[${this.input.slice(this.offsetToSourcePos(key.start), this.offsetToSourcePos(key.end))}]`,
          },
        );
      }

      return super.parseClassProperty(node);
    }

    parseClassPrivateProperty(
      node: N.ClassPrivateProperty,
    ): N.ClassPrivateProperty {
      // @ts-expect-error abstract may not index node
      if (node.abstract) {
        this.raise(TSErrors.PrivateElementHasAbstract, node);
      }

      // @ts-expect-error accessibility may not index node
      if (node.accessibility) {
        this.raise(TSErrors.PrivateElementHasAccessibility, node, {
          // @ts-expect-error refine typings
          modifier: node.accessibility,
        });
      }

      this.parseClassPropertyAnnotation(node);
      return super.parseClassPrivateProperty(node);
    }

    parseClassAccessorProperty(
      node: N.ClassAccessorProperty,
    ): N.ClassAccessorProperty {
      this.parseClassPropertyAnnotation(node);
      if (node.optional) {
        this.raise(TSErrors.AccessorCannotBeOptional, node);
      }
      return super.parseClassAccessorProperty(node);
    }

    pushClassMethod(
      classBody: N.ClassBody,
      method: N.ClassMethod,
      isGenerator: boolean,
      isAsync: boolean,
      isConstructor: boolean,
      allowsDirectSuper: boolean,
    ): void {
      const typeParameters = this.tsTryParseTypeParameters(
        this.tsParseConstModifier,
      );
      if (typeParameters && isConstructor) {
        this.raise(TSErrors.ConstructorHasTypeParameters, typeParameters);
      }

      // @ts-expect-error declare does not exist in ClassMethod
      const { declare = false, kind } = method;

      if (declare && (kind === "get" || kind === "set")) {
        this.raise(TSErrors.DeclareAccessor, method, { kind });
      }
      if (typeParameters) method.typeParameters = typeParameters;
      super.pushClassMethod(
        classBody,
        method,
        isGenerator,
        isAsync,
        isConstructor,
        allowsDirectSuper,
      );
    }

    pushClassPrivateMethod(
      classBody: N.ClassBody,
      method: N.ClassPrivateMethod,
      isGenerator: boolean,
      isAsync: boolean,
    ): void {
      const typeParameters = this.tsTryParseTypeParameters(
        this.tsParseConstModifier,
      );
      if (typeParameters) method.typeParameters = typeParameters;
      super.pushClassPrivateMethod(classBody, method, isGenerator, isAsync);
    }

    declareClassPrivateMethodInScope(
      node: N.ClassPrivateMethod | N.TSDeclareMethod,
      kind: number,
    ) {
      if (node.type === "TSDeclareMethod") return;
      // This happens when using the "estree" plugin.
      if (
        (node as N.Node).type === "MethodDefinition" &&
        !Object.hasOwn(
          (node as unknown as N.EstreeMethodDefinition).value,
          "body",
        )
      ) {
        return;
      }

      super.declareClassPrivateMethodInScope(node, kind);
    }

    parseClassSuper(node: N.Class): void {
      super.parseClassSuper(node);
      // handle `extends f<<T>
      if (node.superClass && (this.match(tt.lt) || this.match(tt.bitShiftL))) {
        if (process.env.BABEL_8_BREAKING) {
          node.superTypeArguments = this.tsParseTypeArgumentsInExpression();
        } else {
          node.superTypeParameters = this.tsParseTypeArgumentsInExpression();
        }
      }
      if (this.eatContextual(tt._implements)) {
        node.implements = this.tsParseHeritageClause("implements");
      }
    }

    parseObjPropValue<T extends N.ObjectMember>(
      prop: Undone<T>,
      startLoc: Position | undefined | null,
      isGenerator: boolean,
      isAsync: boolean,
      isPattern: boolean,
      isAccessor: boolean,
      refExpressionErrors?: ExpressionErrors | null,
    ): T {
      const typeParameters = this.tsTryParseTypeParameters(
        this.tsParseConstModifier,
      );
      if (typeParameters) prop.typeParameters = typeParameters;

      return super.parseObjPropValue(
        prop,

        startLoc,
        isGenerator,
        isAsync,
        isPattern,
        isAccessor,
        refExpressionErrors,
      );
    }

    parseFunctionParams(node: N.Function, isConstructor: boolean): void {
      const typeParameters = this.tsTryParseTypeParameters(
        this.tsParseConstModifier,
      );
      if (typeParameters) node.typeParameters = typeParameters;
      super.parseFunctionParams(node, isConstructor);
    }

    // `let x: number;`
    parseVarId(
      decl: N.VariableDeclarator,
      kind: "var" | "let" | "const" | "using",
    ): void {
      super.parseVarId(decl, kind);
      if (
        decl.id.type === "Identifier" &&
        !this.hasPrecedingLineBreak() &&
        this.eat(tt.bang)
      ) {
        decl.definite = true;
      }

      const type = this.tsTryParseTypeAnnotation();
      if (type) {
        decl.id.typeAnnotation = type;
        this.resetEndLocation(decl.id); // set end position to end of type
      }
    }

    // parse the return type of an async arrow function - let foo = (async (): number => {});
    parseAsyncArrowFromCallExpression(
      node: N.ArrowFunctionExpression,
      call: N.CallExpression,
    ): N.ArrowFunctionExpression {
      if (this.match(tt.colon)) {
        node.returnType = this.tsParseTypeAnnotation();
      }
      return super.parseAsyncArrowFromCallExpression(node, call);
    }

    parseMaybeAssign(
      refExpressionErrors?: ExpressionErrors | null,
      afterLeftParse?: Function,
    ): N.Expression {
      // Note: When the JSX plugin is on, type assertions (`<T> x`) aren't valid syntax.

      let state: State | undefined | null;
      let jsx;
      let typeCast;

      if (
        this.hasPlugin("jsx") &&
        (this.match(tt.jsxTagStart) || this.match(tt.lt))
      ) {
        // Prefer to parse JSX if possible. But may be an arrow fn.
        state = this.state.clone();

        jsx = this.tryParse(
          () => super.parseMaybeAssign(refExpressionErrors, afterLeftParse),
          state,
        );

        /*:: invariant(!jsx.aborted) */
        /*:: invariant(jsx.node != null) */
        if (!jsx.error) return jsx.node;

        // Remove `tc.j_expr` or `tc.j_oTag` from context added
        // by parsing `jsxTagStart` to stop the JSX plugin from
        // messing with the tokens
        const { context } = this.state;
        const currentContext = context[context.length - 1];
        if (currentContext === tc.j_oTag || currentContext === tc.j_expr) {
          context.pop();
        }
      }

      if (!jsx?.error && !this.match(tt.lt)) {
        return super.parseMaybeAssign(refExpressionErrors, afterLeftParse);
      }

      // Either way, we're looking at a '<': tt.jsxTagStart or relational.

      // If the state was cloned in the JSX parsing branch above but there
      // have been any error in the tryParse call, this.state is set to state
      // so we still need to clone it.
      if (!state || state === this.state) state = this.state.clone();

      let typeParameters: N.TsTypeParameterDeclaration | undefined | null;
      // We need to explicitly annotate 'abort' for microsoft/TypeScript#58170
      const arrow = this.tryParse((abort: () => never) => {
        // This is similar to TypeScript's `tryParseParenthesizedArrowFunctionExpression`.
        typeParameters = this.tsParseTypeParameters(this.tsParseConstModifier);
        const expr = super.parseMaybeAssign(
          refExpressionErrors,
          afterLeftParse,
        );

        if (
          expr.type !== "ArrowFunctionExpression" ||
          expr.extra?.parenthesized
        ) {
          abort();
        }

        // Correct TypeScript code should have at least 1 type parameter, but don't crash on bad code.
        if (typeParameters?.params.length !== 0) {
          this.resetStartLocationFromNode(expr, typeParameters);
        }
        expr.typeParameters = typeParameters;

        if (process.env.BABEL_8_BREAKING) {
          if (
            this.hasPlugin("jsx") &&
            expr.typeParameters.params.length === 1 &&
            !expr.typeParameters.extra?.trailingComma
          ) {
            // report error if single type parameter used without trailing comma.
            const parameter = expr.typeParameters
              .params[0] as N.TsTypeParameter;
            if (!parameter.constraint) {
              // A single type parameter must either have constraints
              // or a trailing comma, otherwise it's ambiguous with JSX.
              this.raise(
                TSErrors.SingleTypeParameterWithoutTrailingComma,
                createPositionWithColumnOffset(parameter.loc.end, 1),
                {
                  typeParameterName: process.env.BABEL_8_BREAKING
                    ? (parameter.name as N.Identifier).name
                    : (parameter.name as string),
                },
              );
            }
          }
        }

        return expr;
      }, state);

      /*:: invariant(arrow.node != null) */
      if (!arrow.error && !arrow.aborted) {
        // This error is reported outside of the this.tryParse call so that
        // in case of <T>(x) => 2, we don't consider <T>(x) as a type assertion
        // because of this error.
        if (typeParameters) this.reportReservedArrowTypeParam(typeParameters);
        return arrow.node;
      }

      if (!jsx) {
        // Try parsing a type cast instead of an arrow function.
        // This will never happen outside of JSX.
        // (Because in JSX the '<' should be a jsxTagStart and not a relational.
        assert(!this.hasPlugin("jsx"));

        // This will start with a type assertion (via parseMaybeUnary).
        // But don't directly call `this.tsParseTypeAssertion` because we want to handle any binary after it.
        typeCast = this.tryParse(
          () => super.parseMaybeAssign(refExpressionErrors, afterLeftParse),
          state,
        );
        /*:: invariant(!typeCast.aborted) */
        /*:: invariant(typeCast.node != null) */
        if (!typeCast.error) return typeCast.node;
      }

      if (jsx?.node) {
        /*:: invariant(jsx.failState) */
        this.state = jsx.failState;
        return jsx.node;
      }

      if (arrow.node) {
        /*:: invariant(arrow.failState) */
        this.state = arrow.failState;
        if (typeParameters) this.reportReservedArrowTypeParam(typeParameters);
        return arrow.node;
      }

      if (typeCast?.node) {
        /*:: invariant(typeCast.failState) */
        this.state = typeCast.failState;
        return typeCast.node;
      }

      throw jsx?.error || arrow.error || typeCast?.error;
    }

    reportReservedArrowTypeParam(node: any) {
      if (
        node.params.length === 1 &&
        !node.params[0].constraint &&
        !node.extra?.trailingComma &&
        this.getPluginOption("typescript", "disallowAmbiguousJSXLike")
      ) {
        this.raise(TSErrors.ReservedArrowTypeParam, node);
      }
    }

    // Handle type assertions
    parseMaybeUnary(
      refExpressionErrors?: ExpressionErrors | null,
      sawUnary?: boolean,
    ): N.Expression {
      if (!this.hasPlugin("jsx") && this.match(tt.lt)) {
        return this.tsParseTypeAssertion();
      }
      return super.parseMaybeUnary(refExpressionErrors, sawUnary);
    }

    parseArrow(
      node: Undone<N.ArrowFunctionExpression>,
    ): Undone<N.ArrowFunctionExpression> | undefined | null {
      if (this.match(tt.colon)) {
        // This is different from how the TS parser does it.
        // TS uses lookahead. The Babel Parser parses it as a parenthesized expression and converts.

        const result = this.tryParse(abort => {
          const returnType = this.tsParseTypeOrTypePredicateAnnotation(
            tt.colon,
          );
          if (this.canInsertSemicolon() || !this.match(tt.arrow)) abort();
          return returnType;
        });

        if (result.aborted) return;

        if (!result.thrown) {
          if (result.error) this.state = result.failState;
          // @ts-expect-error refine typings
          node.returnType = result.node;
        }
      }

      return super.parseArrow(node);
    }

    // Allow type annotations inside of a parameter list.
    parseFunctionParamType(param: N.Pattern) {
      if (this.eat(tt.question)) {
        (param as any as N.Identifier).optional = true;
      }
      const type = this.tsTryParseTypeAnnotation();
      if (type) param.typeAnnotation = type;
      this.resetEndLocation(param);

      return param;
    }

    isAssignable(node: N.Node, isBinding?: boolean): boolean {
      switch (node.type) {
        case "TSTypeCastExpression":
          return this.isAssignable(node.expression, isBinding);
        case "TSParameterProperty":
          return true;
        default:
          return super.isAssignable(node, isBinding);
      }
    }

    toAssignable(node: N.Node, isLHS: boolean = false): void {
      switch (node.type) {
        case "ParenthesizedExpression":
          this.toAssignableParenthesizedExpression(node, isLHS);
          break;
        case "TSAsExpression":
        case "TSSatisfiesExpression":
        case "TSNonNullExpression":
        case "TSTypeAssertion":
          if (isLHS) {
            this.expressionScope.recordArrowParameterBindingError(
              TSErrors.UnexpectedTypeCastInParameter,
              node,
            );
          } else {
            this.raise(TSErrors.UnexpectedTypeCastInParameter, node);
          }
          this.toAssignable(node.expression, isLHS);
          break;
        case "AssignmentExpression":
          if (!isLHS && node.left.type === "TSTypeCastExpression") {
            node.left = this.typeCastToParameter(node.left) as N.Assignable;
          }
        /* fall through */
        default:
          super.toAssignable(node, isLHS);
      }
    }

    toAssignableParenthesizedExpression(
      node: N.ParenthesizedExpression,
      isLHS: boolean,
    ): void {
      switch (node.expression.type) {
        case "TSAsExpression":
        case "TSSatisfiesExpression":
        case "TSNonNullExpression":
        case "TSTypeAssertion":
        case "ParenthesizedExpression":
          this.toAssignable(node.expression, isLHS);
          break;
        default:
          super.toAssignable(node, isLHS);
      }
    }

    checkToRestConversion(node: N.Node, allowPattern: boolean): void {
      switch (node.type) {
        case "TSAsExpression":
        case "TSSatisfiesExpression":
        case "TSTypeAssertion":
        case "TSNonNullExpression":
          this.checkToRestConversion(node.expression, false);
          break;
        default:
          super.checkToRestConversion(node, allowPattern);
      }
    }

    isValidLVal(
      type:
        | "TSTypeCastExpression"
        | "TSParameterProperty"
        | "TSNonNullExpression"
        | "TSInstantiationExpression"
        | "TSAsExpression"
        | "TSSatisfiesExpression"
        | "TSTypeAssertion",
      isUnparenthesizedInAssign: boolean,
      binding: BindingFlag,
    ) {
      switch (type) {
        // Allow "typecasts" to appear on the left of assignment expressions,
        // because it may be in an arrow function.
        // e.g. `const f = (foo: number = 0) => foo;`
        case "TSTypeCastExpression":
          return true;
        case "TSParameterProperty":
          return "parameter";
        case "TSNonNullExpression":
        case "TSInstantiationExpression":
          return "expression";
        case "TSAsExpression":
        case "TSSatisfiesExpression":
        case "TSTypeAssertion":
          return (
            (binding !== BindingFlag.TYPE_NONE || !isUnparenthesizedInAssign) &&
            (["expression", true] as [string, boolean])
          );
        default:
          return super.isValidLVal(type, isUnparenthesizedInAssign, binding);
      }
    }

    parseBindingAtom(): N.Pattern {
      if (this.state.type === tt._this) {
        return this.parseIdentifier(/* liberal */ true);
      }
      return super.parseBindingAtom();
    }

    parseMaybeDecoratorArguments(expr: N.Expression): N.Expression {
      // handles `@f<<T>`
      if (this.match(tt.lt) || this.match(tt.bitShiftL)) {
        const typeArguments = this.tsParseTypeArgumentsInExpression();

        if (this.match(tt.parenL)) {
          const call = super.parseMaybeDecoratorArguments(
            expr,
          ) as N.CallExpression;
          call.typeParameters = typeArguments;
          return call;
        }

        this.unexpected(null, tt.parenL);
      }

      return super.parseMaybeDecoratorArguments(expr);
    }

    checkCommaAfterRest(
      close: (typeof charCodes)[keyof typeof charCodes],
    ): boolean {
      if (
        this.state.isAmbientContext &&
        this.match(tt.comma) &&
        this.lookaheadCharCode() === close
      ) {
        this.next();
        return false;
      }
      return super.checkCommaAfterRest(close);
    }

    // === === === === === === === === === === === === === === === ===
    // Note: All below methods are duplicates of something in flow.js.
    // Not sure what the best way to combine these is.
    // === === === === === === === === === === === === === === === ===

    isClassMethod(): boolean {
      return this.match(tt.lt) || super.isClassMethod();
    }

    isClassProperty(): boolean {
      return (
        this.match(tt.bang) || this.match(tt.colon) || super.isClassProperty()
      );
    }

    parseMaybeDefault(
      startLoc?: Position | null,
      left?: Pattern | null,
    ): N.Pattern {
      const node = super.parseMaybeDefault(startLoc, left);

      if (
        node.type === "AssignmentPattern" &&
        node.typeAnnotation &&
        node.right.start < node.typeAnnotation.start
      ) {
        this.raise(TSErrors.TypeAnnotationAfterAssign, node.typeAnnotation);
      }

      return node;
    }

    // ensure that inside types, we bypass the jsx parser plugin
    getTokenFromCode(code: number): void {
      if (this.state.inType) {
        if (code === charCodes.greaterThan) {
          this.finishOp(tt.gt, 1);
          return;
        }
        if (code === charCodes.lessThan) {
          this.finishOp(tt.lt, 1);
          return;
        }
      }
      super.getTokenFromCode(code);
    }

    // used after we have finished parsing types
    reScan_lt_gt() {
      const { type } = this.state;
      if (type === tt.lt) {
        this.state.pos -= 1;
        this.readToken_lt();
      } else if (type === tt.gt) {
        this.state.pos -= 1;
        this.readToken_gt();
      }
    }

    reScan_lt() {
      const { type } = this.state;
      if (type === tt.bitShiftL) {
        this.state.pos -= 2;
        this.finishOp(tt.lt, 1);
        return tt.lt;
      }
      return type;
    }

    toAssignableList(
      exprList: Expression[],
      trailingCommaLoc: Position | undefined | null,
      isLHS: boolean,
    ): void {
      for (let i = 0; i < exprList.length; i++) {
        const expr = exprList[i];
        if (expr?.type === "TSTypeCastExpression") {
          exprList[i] = this.typeCastToParameter(expr);
        }
      }
      super.toAssignableList(exprList, trailingCommaLoc, isLHS);
    }

    typeCastToParameter(node: N.TsTypeCastExpression): N.Expression {
      (node.expression as N.Identifier).typeAnnotation = node.typeAnnotation;

      this.resetEndLocation(node.expression, node.typeAnnotation.loc.end);

      return node.expression;
    }

    shouldParseArrow(params: Array<N.Node>) {
      if (this.match(tt.colon)) {
        return params.every(expr => this.isAssignable(expr, true));
      }
      return super.shouldParseArrow(params);
    }

    shouldParseAsyncArrow(): boolean {
      return this.match(tt.colon) || super.shouldParseAsyncArrow();
    }

    canHaveLeadingDecorator() {
      // Avoid unnecessary lookahead in checking for abstract class unless needed!
      return super.canHaveLeadingDecorator() || this.isAbstractClass();
    }

    jsxParseOpeningElementAfterName(
      node: N.JSXOpeningElement,
    ): N.JSXOpeningElement {
      // handles `<Component<<T>`
      if (this.match(tt.lt) || this.match(tt.bitShiftL)) {
        const typeArguments = this.tsTryParseAndCatch(() =>
          this.tsParseTypeArgumentsInExpression(),
        );
        if (typeArguments) node.typeParameters = typeArguments;
      }
      return super.jsxParseOpeningElementAfterName(node);
    }

    getGetterSetterExpectedParamCount(
      method: N.ObjectMethod | N.ClassMethod,
    ): number {
      const baseCount = super.getGetterSetterExpectedParamCount(method);
      const params = this.getObjectOrClassMethodParams(method);
      const firstParam = params[0];
      const hasContextParam = firstParam && this.isThisParam(firstParam);

      return hasContextParam ? baseCount + 1 : baseCount;
    }

    parseCatchClauseParam(): N.Pattern {
      const param = super.parseCatchClauseParam();
      const type = this.tsTryParseTypeAnnotation();

      if (type) {
        param.typeAnnotation = type;
        this.resetEndLocation(param);
      }

      return param;
    }

    tsInAmbientContext<T>(cb: () => T): T {
      const { isAmbientContext: oldIsAmbientContext, strict: oldStrict } =
        this.state;
      this.state.isAmbientContext = true;
      this.state.strict = false;
      try {
        return cb();
      } finally {
        this.state.isAmbientContext = oldIsAmbientContext;
        this.state.strict = oldStrict;
      }
    }

    parseClass<T extends N.Class>(
      node: Undone<T>,
      isStatement: boolean,
      optionalId?: boolean,
    ): T {
      const oldInAbstractClass = this.state.inAbstractClass;
      this.state.inAbstractClass = !!(node as any).abstract;
      try {
        return super.parseClass(node, isStatement, optionalId);
      } finally {
        this.state.inAbstractClass = oldInAbstractClass;
      }
    }

    tsParseAbstractDeclaration(
      node: any,
      decorators: N.Decorator[] | null,
    ): N.ClassDeclaration | N.TsInterfaceDeclaration | undefined | null {
      if (this.match(tt._class)) {
        node.abstract = true;
        return this.maybeTakeDecorators(
          decorators,
          this.parseClass<N.ClassDeclaration>(
            node as N.ClassDeclaration,
            /* isStatement */ true,
            /* optionalId */ false,
          ),
        );
      } else if (this.isContextual(tt._interface)) {
        // for invalid abstract interface

        // To avoid
        //   abstract interface
        //   Foo {}
        if (!this.hasFollowingLineBreak()) {
          node.abstract = true;
          this.raise(TSErrors.NonClassMethodPropertyHasAbstractModifer, node);
          return this.tsParseInterfaceDeclaration(
            node as N.TsInterfaceDeclaration,
          );
        }
      } else {
        this.unexpected(null, tt._class);
      }
    }

    parseMethod<
      T extends N.ObjectMethod | N.ClassMethod | N.ClassPrivateMethod,
    >(
      node: Undone<T>,
      isGenerator: boolean,
      isAsync: boolean,
      isConstructor: boolean,
      allowDirectSuper: boolean,
      type: T["type"],
      inClassScope?: boolean,
    ) {
      const method = super.parseMethod<T>(
        node,
        isGenerator,
        isAsync,
        isConstructor,
        allowDirectSuper,
        type,
        inClassScope,
      );
      // @ts-expect-error todo(flow->ts) property not defined for all types in union
      if (method.abstract) {
        const hasBody = this.hasPlugin("estree")
          ? // @ts-expect-error estree typings
            !!method.value.body
          : !!method.body;
        if (hasBody) {
          const { key } = method;
          this.raise(TSErrors.AbstractMethodHasImplementation, method, {
            methodName:
              key.type === "Identifier" && !method.computed
                ? key.name
                : `[${this.input.slice(this.offsetToSourcePos(key.start), this.offsetToSourcePos(key.end))}]`,
          });
        }
      }
      return method;
    }

    tsParseTypeParameterName(): N.Identifier | string {
      const typeName: N.Identifier = this.parseIdentifier();
      return process.env.BABEL_8_BREAKING ? typeName : typeName.name;
    }

    shouldParseAsAmbientContext(): boolean {
      return !!this.getPluginOption("typescript", "dts");
    }

    parse() {
      if (this.shouldParseAsAmbientContext()) {
        this.state.isAmbientContext = true;
      }
      return super.parse();
    }

    getExpression() {
      if (this.shouldParseAsAmbientContext()) {
        this.state.isAmbientContext = true;
      }
      return super.getExpression();
    }

    parseExportSpecifier(
      node: Undone<N.ExportSpecifier>,
      isString: boolean,
      isInTypeExport: boolean,
      isMaybeTypeOnly: boolean,
    ) {
      if (!isString && isMaybeTypeOnly) {
        this.parseTypeOnlyImportExportSpecifier(
          node,
          /* isImport */ false,
          isInTypeExport,
        );
        return this.finishNode<N.ExportSpecifier>(node, "ExportSpecifier");
      }
      node.exportKind = "value";
      return super.parseExportSpecifier(
        node,
        isString,
        isInTypeExport,
        isMaybeTypeOnly,
      );
    }

    parseImportSpecifier(
      specifier: Undone<N.ImportSpecifier>,
      importedIsString: boolean,
      isInTypeOnlyImport: boolean,
      isMaybeTypeOnly: boolean,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      bindingType: BindingFlag | undefined,
    ): N.ImportSpecifier {
      if (!importedIsString && isMaybeTypeOnly) {
        this.parseTypeOnlyImportExportSpecifier(
          specifier,
          /* isImport */ true,
          isInTypeOnlyImport,
        );
        return this.finishNode<N.ImportSpecifier>(specifier, "ImportSpecifier");
      }
      specifier.importKind = "value";
      return super.parseImportSpecifier(
        specifier,
        importedIsString,
        isInTypeOnlyImport,
        isMaybeTypeOnly,
        isInTypeOnlyImport
          ? BindingFlag.TYPE_TS_TYPE_IMPORT
          : BindingFlag.TYPE_TS_VALUE_IMPORT,
      );
    }

    parseTypeOnlyImportExportSpecifier(
      node: any,
      isImport: boolean,
      isInTypeOnlyImportExport: boolean,
    ): void {
      const leftOfAsKey = isImport ? "imported" : "local";
      const rightOfAsKey = isImport ? "local" : "exported";

      let leftOfAs = node[leftOfAsKey];
      let rightOfAs;

      let hasTypeSpecifier = false;
      let canParseAsKeyword = true;

      const loc = leftOfAs.loc.start;

      // https://github.com/microsoft/TypeScript/blob/fc4f9d83d5939047aa6bb2a43965c6e9bbfbc35b/src/compiler/parser.ts#L7411-L7456
      // import { type } from "mod";          - hasTypeSpecifier: false, leftOfAs: type
      // import { type as } from "mod";       - hasTypeSpecifier: true,  leftOfAs: as
      // import { type as as } from "mod";    - hasTypeSpecifier: false, leftOfAs: type, rightOfAs: as
      // import { type as as as } from "mod"; - hasTypeSpecifier: true,  leftOfAs: as,   rightOfAs: as
      if (this.isContextual(tt._as)) {
        // { type as ...? }
        const firstAs = this.parseIdentifier();
        if (this.isContextual(tt._as)) {
          // { type as as ...? }
          const secondAs = this.parseIdentifier();
          if (tokenIsKeywordOrIdentifier(this.state.type)) {
            // { type as as something }
            hasTypeSpecifier = true;
            leftOfAs = firstAs;
            rightOfAs = isImport
              ? this.parseIdentifier()
              : this.parseModuleExportName();
            canParseAsKeyword = false;
          } else {
            // { type as as }
            rightOfAs = secondAs;
            canParseAsKeyword = false;
          }
        } else if (tokenIsKeywordOrIdentifier(this.state.type)) {
          // { type as something }
          canParseAsKeyword = false;
          rightOfAs = isImport
            ? this.parseIdentifier()
            : this.parseModuleExportName();
        } else {
          // { type as }
          hasTypeSpecifier = true;
          leftOfAs = firstAs;
        }
      } else if (tokenIsKeywordOrIdentifier(this.state.type)) {
        // { type something ...? }
        hasTypeSpecifier = true;
        if (isImport) {
          leftOfAs = this.parseIdentifier(true);
          if (!this.isContextual(tt._as)) {
            this.checkReservedWord(
              leftOfAs.name,
              leftOfAs.loc.start,
              true,
              true,
            );
          }
        } else {
          leftOfAs = this.parseModuleExportName();
        }
      }
      if (hasTypeSpecifier && isInTypeOnlyImportExport) {
        this.raise(
          isImport
            ? TSErrors.TypeModifierIsUsedInTypeImports
            : TSErrors.TypeModifierIsUsedInTypeExports,
          loc,
        );
      }

      node[leftOfAsKey] = leftOfAs;
      node[rightOfAsKey] = rightOfAs;

      const kindKey = isImport ? "importKind" : "exportKind";
      node[kindKey] = hasTypeSpecifier ? "type" : "value";

      if (canParseAsKeyword && this.eatContextual(tt._as)) {
        node[rightOfAsKey] = isImport
          ? this.parseIdentifier()
          : this.parseModuleExportName();
      }
      if (!node[rightOfAsKey]) {
        node[rightOfAsKey] = cloneIdentifier(node[leftOfAsKey]);
      }
      if (isImport) {
        this.checkIdentifier(
          node[rightOfAsKey],
          hasTypeSpecifier
            ? BindingFlag.TYPE_TS_TYPE_IMPORT
            : BindingFlag.TYPE_TS_VALUE_IMPORT,
        );
      }
    }
  };

function isPossiblyLiteralEnum(expression: N.Expression): boolean {
  if (expression.type !== "MemberExpression") return false;

  const { computed, property } = expression;

  if (
    computed &&
    property.type !== "StringLiteral" &&
    (property.type !== "TemplateLiteral" || property.expressions.length > 0)
  ) {
    return false;
  }

  return isUncomputedMemberExpressionChain(expression.object);
}

// If a const declaration has no type annotation and is initialized to
// a string literal, numeric literal, or enum reference, then it is
// allowed. In an ideal world, we'd check whether init was *actually* an
// enum reference, but we allow anything that "could be" a literal enum
// in `isPossiblyLiteralEnum` since we don't have all the information
// that the typescript compiler has.
function isValidAmbientConstInitializer(
  expression: N.Expression,
  estree: boolean,
): boolean {
  const { type } = expression;
  if (expression.extra?.parenthesized) {
    return false;
  }
  if (estree) {
    if (type === "Literal") {
      const { value } = expression;
      if (typeof value === "string" || typeof value === "boolean") {
        return true;
      }
    }
  } else {
    if (type === "StringLiteral" || type === "BooleanLiteral") {
      return true;
    }
  }
  if (isNumber(expression, estree) || isNegativeNumber(expression, estree)) {
    return true;
  }
  if (type === "TemplateLiteral" && expression.expressions.length === 0) {
    return true;
  }
  if (isPossiblyLiteralEnum(expression)) {
    return true;
  }
  return false;
}

function isNumber(expression: N.Expression, estree: boolean): boolean {
  if (estree) {
    return (
      expression.type === "Literal" &&
      (typeof expression.value === "number" || "bigint" in expression)
    );
  }
  return (
    expression.type === "NumericLiteral" || expression.type === "BigIntLiteral"
  );
}

function isNegativeNumber(expression: N.Expression, estree: boolean): boolean {
  if (expression.type === "UnaryExpression") {
    const { operator, argument } = expression;
    if (operator === "-" && isNumber(argument, estree)) {
      return true;
    }
  }
  return false;
}

function isUncomputedMemberExpressionChain(expression: N.Expression): boolean {
  if (expression.type === "Identifier") return true;
  if (expression.type !== "MemberExpression" || expression.computed) {
    return false;
  }

  return isUncomputedMemberExpressionChain(expression.object);
}
