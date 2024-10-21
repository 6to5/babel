import is from "../validators/is.ts";
import isValidIdentifier from "../validators/isValidIdentifier.ts";
import { isKeyword, isReservedWord } from "@babel/helper-validator-identifier";
import type * as t from "../index.ts";
import { readStringContents } from "@babel/helper-string-parser";

import {
  BINARY_OPERATORS,
  LOGICAL_OPERATORS,
  ASSIGNMENT_OPERATORS,
  UNARY_OPERATORS,
  UPDATE_OPERATORS,
} from "../constants/index.ts";

import {
  defineAliasedType,
  assertShape,
  assertOptionalChainStart,
  assertValueType,
  assertNodeType,
  assertNodeOrValueType,
  assertEach,
  chain,
  assertOneOf,
  validateOptional,
  type Validator,
  arrayOf,
  arrayOfType,
  validateArrayOfType,
  validateType,
} from "./utils.ts";

const defineType = defineAliasedType("Standardized");

defineType("ArrayExpression", {
  fields: {
    elements: {
      validate: arrayOf(
        assertNodeOrValueType("null", "Expression", "SpreadElement"),
      ),
      default:
        !process.env.BABEL_8_BREAKING && !process.env.BABEL_TYPES_8_BREAKING
          ? []
          : undefined,
    },
  },
  visitor: ["elements"],
  aliases: ["Expression"],
});

defineType("AssignmentExpression", {
  fields: {
    operator: {
      validate:
        !process.env.BABEL_8_BREAKING && !process.env.BABEL_TYPES_8_BREAKING
          ? assertValueType("string")
          : Object.assign(
              (function () {
                const identifier = assertOneOf(...ASSIGNMENT_OPERATORS);
                const pattern = assertOneOf("=");

                return function (node: t.AssignmentExpression, key, val) {
                  const validator = is("Pattern", node.left)
                    ? pattern
                    : identifier;
                  validator(node, key, val);
                } as Validator;
              })(),
              { type: "string" },
            ),
    },
    left: {
      validate:
        !process.env.BABEL_8_BREAKING && !process.env.BABEL_TYPES_8_BREAKING
          ? assertNodeType("LVal", "OptionalMemberExpression")
          : assertNodeType(
              "Identifier",
              "MemberExpression",
              "OptionalMemberExpression",
              "ArrayPattern",
              "ObjectPattern",
              "TSAsExpression",
              "TSSatisfiesExpression",
              "TSTypeAssertion",
              "TSNonNullExpression",
            ),
    },
    right: {
      validate: assertNodeType("Expression"),
    },
  },
  builder: ["operator", "left", "right"],
  visitor: ["left", "right"],
  aliases: ["Expression"],
});

defineType("BinaryExpression", {
  builder: ["operator", "left", "right"],
  fields: {
    operator: {
      validate: assertOneOf(...BINARY_OPERATORS),
    },
    left: {
      validate: (function () {
        const expression = assertNodeType("Expression");
        const inOp = assertNodeType("Expression", "PrivateName");

        const validator: Validator = Object.assign(
          function (node: t.BinaryExpression, key, val) {
            const validator = node.operator === "in" ? inOp : expression;
            validator(node, key, val);
          } as Validator,
          // todo(ts): can be discriminated union by `operator` property
          { oneOfNodeTypes: ["Expression", "PrivateName"] },
        );
        return validator;
      })(),
    },
    right: {
      validate: assertNodeType("Expression"),
    },
  },
  visitor: ["left", "right"],
  aliases: ["Binary", "Expression"],
});

defineType("InterpreterDirective", {
  builder: ["value"],
  fields: {
    value: {
      validate: assertValueType("string"),
    },
  },
});

defineType("Directive", {
  visitor: ["value"],
  fields: {
    value: {
      validate: assertNodeType("DirectiveLiteral"),
    },
  },
});

defineType("DirectiveLiteral", {
  builder: ["value"],
  fields: {
    value: {
      validate: assertValueType("string"),
    },
  },
});

defineType("BlockStatement", {
  builder: ["body", "directives"],
  visitor: ["directives", "body"],
  fields: {
    directives: {
      validate: arrayOfType("Directive"),
      default: [],
    },
    body: validateArrayOfType("Statement"),
  },
  aliases: ["Scopable", "BlockParent", "Block", "Statement"],
});

defineType("BreakStatement", {
  visitor: ["label"],
  fields: {
    label: {
      validate: assertNodeType("Identifier"),
      optional: true,
    },
  },
  aliases: ["Statement", "Terminatorless", "CompletionStatement"],
});

defineType("CallExpression", {
  visitor: ["callee", "arguments", "typeParameters", "typeArguments"],
  builder: ["callee", "arguments"],
  aliases: ["Expression"],
  fields: {
    callee: {
      validate: assertNodeType("Expression", "Super", "V8IntrinsicIdentifier"),
    },
    arguments: validateArrayOfType(
      "Expression",
      "SpreadElement",
      "ArgumentPlaceholder",
    ),
    ...(!process.env.BABEL_8_BREAKING && !process.env.BABEL_TYPES_8_BREAKING
      ? {
          optional: {
            validate: assertValueType("boolean"),
            optional: true,
          },
        }
      : {}),
    typeArguments: {
      validate: assertNodeType("TypeParameterInstantiation"),
      optional: true,
    },
    typeParameters: {
      validate: assertNodeType("TSTypeParameterInstantiation"),
      optional: true,
    },
  },
});

defineType("CatchClause", {
  visitor: ["param", "body"],
  fields: {
    param: {
      validate: assertNodeType("Identifier", "ArrayPattern", "ObjectPattern"),
      optional: true,
    },
    body: {
      validate: assertNodeType("BlockStatement"),
    },
  },
  aliases: ["Scopable", "BlockParent"],
});

defineType("ConditionalExpression", {
  visitor: ["test", "consequent", "alternate"],
  fields: {
    test: {
      validate: assertNodeType("Expression"),
    },
    consequent: {
      validate: assertNodeType("Expression"),
    },
    alternate: {
      validate: assertNodeType("Expression"),
    },
  },
  aliases: ["Expression", "Conditional"],
});

defineType("ContinueStatement", {
  visitor: ["label"],
  fields: {
    label: {
      validate: assertNodeType("Identifier"),
      optional: true,
    },
  },
  aliases: ["Statement", "Terminatorless", "CompletionStatement"],
});

defineType("DebuggerStatement", {
  aliases: ["Statement"],
});

defineType("DoWhileStatement", {
  builder: ["test", "body"],
  visitor: ["body", "test"],
  fields: {
    test: {
      validate: assertNodeType("Expression"),
    },
    body: {
      validate: assertNodeType("Statement"),
    },
  },
  aliases: ["Statement", "BlockParent", "Loop", "While", "Scopable"],
});

defineType("EmptyStatement", {
  aliases: ["Statement"],
});

defineType("ExpressionStatement", {
  visitor: ["expression"],
  fields: {
    expression: {
      validate: assertNodeType("Expression"),
    },
  },
  aliases: ["Statement", "ExpressionWrapper"],
});

defineType("File", {
  builder: ["program", "comments", "tokens"],
  visitor: ["program"],
  fields: {
    program: {
      validate: assertNodeType("Program"),
    },
    comments: {
      validate:
        !process.env.BABEL_8_BREAKING && !process.env.BABEL_TYPES_8_BREAKING
          ? Object.assign(() => {}, {
              each: { oneOfNodeTypes: ["CommentBlock", "CommentLine"] },
            })
          : assertEach(assertNodeType("CommentBlock", "CommentLine")),
      optional: true,
    },
    tokens: {
      // todo(ts): add Token type
      validate: assertEach(Object.assign(() => {}, { type: "any" })),
      optional: true,
    },
  },
});

defineType("ForInStatement", {
  visitor: ["left", "right", "body"],
  aliases: [
    "Scopable",
    "Statement",
    "For",
    "BlockParent",
    "Loop",
    "ForXStatement",
  ],
  fields: {
    left: {
      validate:
        !process.env.BABEL_8_BREAKING && !process.env.BABEL_TYPES_8_BREAKING
          ? assertNodeType("VariableDeclaration", "LVal")
          : assertNodeType(
              "VariableDeclaration",
              "Identifier",
              "MemberExpression",
              "ArrayPattern",
              "ObjectPattern",
              "TSAsExpression",
              "TSSatisfiesExpression",
              "TSTypeAssertion",
              "TSNonNullExpression",
            ),
    },
    right: {
      validate: assertNodeType("Expression"),
    },
    body: {
      validate: assertNodeType("Statement"),
    },
  },
});

defineType("ForStatement", {
  visitor: ["init", "test", "update", "body"],
  aliases: ["Scopable", "Statement", "For", "BlockParent", "Loop"],
  fields: {
    init: {
      validate: assertNodeType("VariableDeclaration", "Expression"),
      optional: true,
    },
    test: {
      validate: assertNodeType("Expression"),
      optional: true,
    },
    update: {
      validate: assertNodeType("Expression"),
      optional: true,
    },
    body: {
      validate: assertNodeType("Statement"),
    },
  },
});

export const functionCommon = () => ({
  params: validateArrayOfType("Identifier", "Pattern", "RestElement"),
  generator: {
    default: false,
  },
  async: {
    default: false,
  },
});

export const functionTypeAnnotationCommon = () => ({
  returnType: {
    validate: process.env.BABEL_8_BREAKING
      ? assertNodeType("TypeAnnotation", "TSTypeAnnotation")
      : assertNodeType(
          "TypeAnnotation",
          "TSTypeAnnotation",
          // @ts-ignore(Babel 7 vs Babel 8) Babel 7 AST
          "Noop",
        ),
    optional: true,
  },
  typeParameters: {
    validate: process.env.BABEL_8_BREAKING
      ? assertNodeType("TypeParameterDeclaration", "TSTypeParameterDeclaration")
      : assertNodeType(
          "TypeParameterDeclaration",
          "TSTypeParameterDeclaration",
          // @ts-ignore(Babel 7 vs Babel 8) Babel 7 AST
          "Noop",
        ),
    optional: true,
  },
});

export const functionDeclarationCommon = () => ({
  ...functionCommon(),
  declare: {
    validate: assertValueType("boolean"),
    optional: true,
  },
  id: {
    validate: assertNodeType("Identifier"),
    optional: true, // May be null for `export default function`
  },
});

defineType("FunctionDeclaration", {
  builder: ["id", "params", "body", "generator", "async"],
  visitor: ["id", "typeParameters", "params", "returnType", "body"],
  fields: {
    ...functionDeclarationCommon(),
    ...functionTypeAnnotationCommon(),
    body: {
      validate: assertNodeType("BlockStatement"),
    },
    predicate: {
      validate: assertNodeType("DeclaredPredicate", "InferredPredicate"),
      optional: true,
    },
  },
  aliases: [
    "Scopable",
    "Function",
    "BlockParent",
    "FunctionParent",
    "Statement",
    "Pureish",
    "Declaration",
  ],
  validate:
    !process.env.BABEL_8_BREAKING && !process.env.BABEL_TYPES_8_BREAKING
      ? undefined
      : (function () {
          const identifier = assertNodeType("Identifier");

          return function (parent, key, node) {
            if (!is("ExportDefaultDeclaration", parent)) {
              identifier(node, "id", node.id);
            }
          };
        })(),
});

defineType("FunctionExpression", {
  inherits: "FunctionDeclaration",
  aliases: [
    "Scopable",
    "Function",
    "BlockParent",
    "FunctionParent",
    "Expression",
    "Pureish",
  ],
  fields: {
    ...functionCommon(),
    ...functionTypeAnnotationCommon(),
    id: {
      validate: assertNodeType("Identifier"),
      optional: true,
    },
    body: {
      validate: assertNodeType("BlockStatement"),
    },
    predicate: {
      validate: assertNodeType("DeclaredPredicate", "InferredPredicate"),
      optional: true,
    },
  },
});

export const patternLikeCommon = () => ({
  typeAnnotation: {
    validate: process.env.BABEL_8_BREAKING
      ? assertNodeType("TypeAnnotation", "TSTypeAnnotation")
      : assertNodeType(
          "TypeAnnotation",
          "TSTypeAnnotation",
          // @ts-ignore(Babel 7 vs Babel 8) Babel 7 AST
          "Noop",
        ),
    optional: true,
  },
  optional: {
    validate: assertValueType("boolean"),
    optional: true,
  },
  decorators: {
    validate: arrayOfType("Decorator"),
    optional: true,
  },
});

defineType("Identifier", {
  builder: ["name"],
  visitor: ["typeAnnotation", "decorators" /* for legacy param decorators */],
  aliases: ["Expression", "PatternLike", "LVal", "TSEntityName"],
  fields: {
    ...patternLikeCommon(),
    name: {
      validate:
        process.env.BABEL_8_BREAKING || process.env.BABEL_TYPES_8_BREAKING
          ? chain(
              assertValueType("string"),
              Object.assign(
                function (node, key, val) {
                  if (!isValidIdentifier(val, false)) {
                    throw new TypeError(
                      `"${val}" is not a valid identifier name`,
                    );
                  }
                } as Validator,
                { type: "string" },
              ),
            )
          : assertValueType("string"),
    },
  },
  validate:
    process.env.BABEL_8_BREAKING || process.env.BABEL_TYPES_8_BREAKING
      ? function (parent, key, node) {
          const match = /\.(\w+)$/.exec(key.toString());
          if (!match) return;

          const [, parentKey] = match;
          const nonComp = { computed: false };

          // We can't check if `parent.property === node`, because nodes are validated
          // before replacing them in the AST.
          if (parentKey === "property") {
            if (is("MemberExpression", parent, nonComp)) return;
            if (is("OptionalMemberExpression", parent, nonComp)) return;
          } else if (parentKey === "key") {
            if (is("Property", parent, nonComp)) return;
            if (is("Method", parent, nonComp)) return;
          } else if (parentKey === "exported") {
            if (is("ExportSpecifier", parent)) return;
          } else if (parentKey === "imported") {
            if (is("ImportSpecifier", parent, { imported: node })) return;
          } else if (parentKey === "meta") {
            if (is("MetaProperty", parent, { meta: node })) return;
          }

          if (
            // Ideally we should call isStrictReservedWord if this node is a descendant
            // of a block in strict mode. Also, we should pass the inModule option so
            // we can disable "await" in module.
            (isKeyword(node.name) || isReservedWord(node.name, false)) &&
            // Even if "this" is a keyword, we are using the Identifier
            // node to represent it.
            node.name !== "this"
          ) {
            throw new TypeError(`"${node.name}" is not a valid identifier`);
          }
        }
      : undefined,
});

defineType("IfStatement", {
  visitor: ["test", "consequent", "alternate"],
  aliases: ["Statement", "Conditional"],
  fields: {
    test: {
      validate: assertNodeType("Expression"),
    },
    consequent: {
      validate: assertNodeType("Statement"),
    },
    alternate: {
      optional: true,
      validate: assertNodeType("Statement"),
    },
  },
});

defineType("LabeledStatement", {
  visitor: ["label", "body"],
  aliases: ["Statement"],
  fields: {
    label: {
      validate: assertNodeType("Identifier"),
    },
    body: {
      validate: assertNodeType("Statement"),
    },
  },
});

defineType("StringLiteral", {
  builder: ["value"],
  fields: {
    value: {
      validate: assertValueType("string"),
    },
  },
  aliases: ["Expression", "Pureish", "Literal", "Immutable"],
});

defineType("NumericLiteral", {
  builder: ["value"],
  deprecatedAlias: "NumberLiteral",
  fields: {
    value: {
      validate: chain(
        assertValueType("number"),
        Object.assign(
          function (node, key, val) {
            if (1 / val < 0 || !Number.isFinite(val)) {
              const error = new Error(
                "NumericLiterals must be non-negative finite numbers. " +
                  `You can use t.valueToNode(${val}) instead.`,
              );
              if (process.env.BABEL_8_BREAKING) {
                // TODO(@nicolo-ribaudo) Fix regenerator to not pass negative
                // numbers here.
                if (!IS_STANDALONE) {
                  if (!new Error().stack.includes("regenerator")) {
                    throw error;
                  }
                }
              } else {
                // TODO: Enable this warning once regenerator is fixed.
                // https://github.com/facebook/regenerator/pull/680
                // console.warn(error);
              }
            }
          } satisfies Validator,
          { type: "number" },
        ),
      ),
    },
  },
  aliases: ["Expression", "Pureish", "Literal", "Immutable"],
});

defineType("NullLiteral", {
  aliases: ["Expression", "Pureish", "Literal", "Immutable"],
});

defineType("BooleanLiteral", {
  builder: ["value"],
  fields: {
    value: {
      validate: assertValueType("boolean"),
    },
  },
  aliases: ["Expression", "Pureish", "Literal", "Immutable"],
});

defineType("RegExpLiteral", {
  builder: ["pattern", "flags"],
  deprecatedAlias: "RegexLiteral",
  aliases: ["Expression", "Pureish", "Literal"],
  fields: {
    pattern: {
      validate: assertValueType("string"),
    },
    flags: {
      validate:
        process.env.BABEL_8_BREAKING || process.env.BABEL_TYPES_8_BREAKING
          ? chain(
              assertValueType("string"),
              Object.assign(
                function (node, key, val) {
                  const invalid = /[^gimsuy]/.exec(val);
                  if (invalid) {
                    throw new TypeError(
                      `"${invalid[0]}" is not a valid RegExp flag`,
                    );
                  }
                } as Validator,
                { type: "string" },
              ),
            )
          : assertValueType("string"),
      default: "",
    },
  },
});

defineType("LogicalExpression", {
  builder: ["operator", "left", "right"],
  visitor: ["left", "right"],
  aliases: ["Binary", "Expression"],
  fields: {
    operator: {
      validate: assertOneOf(...LOGICAL_OPERATORS),
    },
    left: {
      validate: assertNodeType("Expression"),
    },
    right: {
      validate: assertNodeType("Expression"),
    },
  },
});

defineType("MemberExpression", {
  builder: [
    "object",
    "property",
    "computed",
    ...(!process.env.BABEL_8_BREAKING && !process.env.BABEL_TYPES_8_BREAKING
      ? ["optional"]
      : []),
  ],
  visitor: ["object", "property"],
  aliases: ["Expression", "LVal"],
  fields: {
    object: {
      validate: assertNodeType("Expression", "Super"),
    },
    property: {
      validate: (function () {
        const normal = assertNodeType("Identifier", "PrivateName");
        const computed = assertNodeType("Expression");

        const validator: Validator = function (
          node: t.MemberExpression,
          key,
          val,
        ) {
          const validator: Validator = node.computed ? computed : normal;
          validator(node, key, val);
        };
        // @ts-expect-error todo(ts): can be discriminated union by `computed` property
        validator.oneOfNodeTypes = ["Expression", "Identifier", "PrivateName"];
        return validator;
      })(),
    },
    computed: {
      default: false,
    },
    ...(!process.env.BABEL_8_BREAKING && !process.env.BABEL_TYPES_8_BREAKING
      ? {
          optional: {
            validate: assertValueType("boolean"),
            optional: true,
          },
        }
      : {}),
  },
});

defineType("NewExpression", { inherits: "CallExpression" });

defineType("Program", {
  // Note: We explicitly leave 'interpreter' out here because it is
  // conceptually comment-like, and Babel does not traverse comments either.
  visitor: ["directives", "body"],
  builder: ["body", "directives", "sourceType", "interpreter"],
  fields: {
    sourceType: {
      validate: assertOneOf("script", "module"),
      default: "script",
    },
    interpreter: {
      validate: assertNodeType("InterpreterDirective"),
      default: null,
      optional: true,
    },
    directives: {
      validate: arrayOfType("Directive"),
      default: [],
    },
    body: validateArrayOfType("Statement"),
  },
  aliases: ["Scopable", "BlockParent", "Block"],
});

defineType("ObjectExpression", {
  visitor: ["properties"],
  aliases: ["Expression"],
  fields: {
    properties: validateArrayOfType(
      "ObjectMethod",
      "ObjectProperty",
      "SpreadElement",
    ),
  },
});

defineType("ObjectMethod", {
  builder: ["kind", "key", "params", "body", "computed", "generator", "async"],
  visitor: [
    "decorators",
    "key",
    "typeParameters",
    "params",
    "returnType",
    "body",
  ],
  fields: {
    ...functionCommon(),
    ...functionTypeAnnotationCommon(),
    kind: {
      validate: assertOneOf("method", "get", "set"),
      ...(!process.env.BABEL_8_BREAKING && !process.env.BABEL_TYPES_8_BREAKING
        ? { default: "method" }
        : {}),
    },
    computed: {
      default: false,
    },
    key: {
      validate: (function () {
        const normal = assertNodeType(
          "Identifier",
          "StringLiteral",
          "NumericLiteral",
          "BigIntLiteral",
        );
        const computed = assertNodeType("Expression");

        const validator: Validator = function (node: t.ObjectMethod, key, val) {
          const validator = node.computed ? computed : normal;
          validator(node, key, val);
        };
        // @ts-expect-error todo(ts): can be discriminated union by `computed` property
        validator.oneOfNodeTypes = [
          "Expression",
          "Identifier",
          "StringLiteral",
          "NumericLiteral",
          "BigIntLiteral",
        ];
        return validator;
      })(),
    },
    decorators: {
      validate: arrayOfType("Decorator"),
      optional: true,
    },
    body: {
      validate: assertNodeType("BlockStatement"),
    },
  },
  aliases: [
    "UserWhitespacable",
    "Function",
    "Scopable",
    "BlockParent",
    "FunctionParent",
    "Method",
    "ObjectMember",
  ],
});

defineType("ObjectProperty", {
  builder: [
    "key",
    "value",
    "computed",
    "shorthand",
    ...(!process.env.BABEL_8_BREAKING && !process.env.BABEL_TYPES_8_BREAKING
      ? ["decorators"]
      : []),
  ],
  fields: {
    computed: {
      default: false,
    },
    key: {
      validate: (function () {
        const normal = process.env.BABEL_8_BREAKING
          ? assertNodeType(
              "Identifier",
              "StringLiteral",
              "NumericLiteral",
              "BigIntLiteral",
              "PrivateName",
            )
          : assertNodeType(
              "Identifier",
              "StringLiteral",
              "NumericLiteral",
              "BigIntLiteral",
              // @ts-ignore(Babel 7 vs Babel 8) Babel 7 AST
              "DecimalLiteral",
              "PrivateName",
            );
        const computed = assertNodeType("Expression");

        const validator: Validator = Object.assign(
          function (node: t.ObjectProperty, key, val) {
            const validator = node.computed ? computed : normal;
            validator(node, key, val);
          } as Validator,
          {
            // todo(ts): can be discriminated union by `computed` property
            oneOfNodeTypes: process.env.BABEL_8_BREAKING
              ? [
                  "Expression",
                  "Identifier",
                  "StringLiteral",
                  "NumericLiteral",
                  "BigIntLiteral",
                  "PrivateName",
                ]
              : [
                  "Expression",
                  "Identifier",
                  "StringLiteral",
                  "NumericLiteral",
                  "BigIntLiteral",
                  "DecimalLiteral",
                  "PrivateName",
                ],
          },
        );
        return validator;
      })(),
    },
    value: {
      // Value may be PatternLike if this is an AssignmentProperty
      // https://github.com/babel/babylon/issues/434
      validate: assertNodeType("Expression", "PatternLike"),
    },
    shorthand: {
      validate:
        process.env.BABEL_8_BREAKING || process.env.BABEL_TYPES_8_BREAKING
          ? chain(
              assertValueType("boolean"),
              Object.assign(
                function (node: t.ObjectProperty, key, shorthand) {
                  if (!shorthand) return;

                  if (node.computed) {
                    throw new TypeError(
                      "Property shorthand of ObjectProperty cannot be true if computed is true",
                    );
                  }

                  if (!is("Identifier", node.key)) {
                    throw new TypeError(
                      "Property shorthand of ObjectProperty cannot be true if key is not an Identifier",
                    );
                  }
                } as Validator,
                { type: "boolean" },
              ),
            )
          : assertValueType("boolean"),
      default: false,
    },
    decorators: {
      validate: arrayOfType("Decorator"),
      optional: true,
    },
  },
  visitor: ["key", "value", "decorators"],
  aliases: ["UserWhitespacable", "Property", "ObjectMember"],
  validate:
    !process.env.BABEL_8_BREAKING && !process.env.BABEL_TYPES_8_BREAKING
      ? undefined
      : (function () {
          const pattern = assertNodeType(
            "Identifier",
            "Pattern",
            "TSAsExpression",
            "TSSatisfiesExpression",
            "TSNonNullExpression",
            "TSTypeAssertion",
          );
          const expression = assertNodeType("Expression");

          return function (parent, key, node) {
            const validator = is("ObjectPattern", parent)
              ? pattern
              : expression;
            validator(node, "value", node.value);
          };
        })(),
});

defineType("RestElement", {
  visitor: ["argument", "typeAnnotation"],
  builder: ["argument"],
  aliases: ["LVal", "PatternLike"],
  deprecatedAlias: "RestProperty",
  fields: {
    ...patternLikeCommon(),
    argument: {
      validate:
        !process.env.BABEL_8_BREAKING && !process.env.BABEL_TYPES_8_BREAKING
          ? assertNodeType("LVal")
          : assertNodeType(
              "Identifier",
              "ArrayPattern",
              "ObjectPattern",
              "MemberExpression",
              "TSAsExpression",
              "TSSatisfiesExpression",
              "TSTypeAssertion",
              "TSNonNullExpression",
            ),
    },
  },
  validate:
    process.env.BABEL_8_BREAKING || process.env.BABEL_TYPES_8_BREAKING
      ? function (parent: t.ArrayPattern | t.ObjectPattern, key) {
          const match = /(\w+)\[(\d+)\]/.exec(key.toString());
          if (!match) throw new Error("Internal Babel error: malformed key.");

          const [, listKey, index] = match as unknown as [
            string,
            keyof typeof parent,
            string,
          ];
          if ((parent[listKey] as t.Node[]).length > +index + 1) {
            throw new TypeError(
              `RestElement must be last element of ${listKey}`,
            );
          }
        }
      : undefined,
});

defineType("ReturnStatement", {
  visitor: ["argument"],
  aliases: ["Statement", "Terminatorless", "CompletionStatement"],
  fields: {
    argument: {
      validate: assertNodeType("Expression"),
      optional: true,
    },
  },
});

defineType("SequenceExpression", {
  visitor: ["expressions"],
  fields: {
    expressions: validateArrayOfType("Expression"),
  },
  aliases: ["Expression"],
});

defineType("ParenthesizedExpression", {
  visitor: ["expression"],
  aliases: ["Expression", "ExpressionWrapper"],
  fields: {
    expression: {
      validate: assertNodeType("Expression"),
    },
  },
});

defineType("SwitchCase", {
  visitor: ["test", "consequent"],
  fields: {
    test: {
      validate: assertNodeType("Expression"),
      optional: true,
    },
    consequent: validateArrayOfType("Statement"),
  },
});

defineType("SwitchStatement", {
  visitor: ["discriminant", "cases"],
  aliases: ["Statement", "BlockParent", "Scopable"],
  fields: {
    discriminant: {
      validate: assertNodeType("Expression"),
    },
    cases: validateArrayOfType("SwitchCase"),
  },
});

defineType("ThisExpression", {
  aliases: ["Expression"],
});

defineType("ThrowStatement", {
  visitor: ["argument"],
  aliases: ["Statement", "Terminatorless", "CompletionStatement"],
  fields: {
    argument: {
      validate: assertNodeType("Expression"),
    },
  },
});

defineType("TryStatement", {
  visitor: ["block", "handler", "finalizer"],
  aliases: ["Statement"],
  fields: {
    block: {
      validate:
        process.env.BABEL_8_BREAKING || process.env.BABEL_TYPES_8_BREAKING
          ? chain(
              assertNodeType("BlockStatement"),
              Object.assign(
                function (node: t.TryStatement) {
                  // This validator isn't put at the top level because we can run it
                  // even if this node doesn't have a parent.

                  if (!node.handler && !node.finalizer) {
                    throw new TypeError(
                      "TryStatement expects either a handler or finalizer, or both",
                    );
                  }
                } as Validator,
                { oneOfNodeTypes: ["BlockStatement"] },
              ),
            )
          : assertNodeType("BlockStatement"),
    },
    handler: {
      optional: true,
      validate: assertNodeType("CatchClause"),
    },
    finalizer: {
      optional: true,
      validate: assertNodeType("BlockStatement"),
    },
  },
});

defineType("UnaryExpression", {
  builder: ["operator", "argument", "prefix"],
  fields: {
    prefix: {
      default: true,
    },
    argument: {
      validate: assertNodeType("Expression"),
    },
    operator: {
      validate: assertOneOf(...UNARY_OPERATORS),
    },
  },
  visitor: ["argument"],
  aliases: ["UnaryLike", "Expression"],
});

defineType("UpdateExpression", {
  builder: ["operator", "argument", "prefix"],
  fields: {
    prefix: {
      default: false,
    },
    argument: {
      validate:
        !process.env.BABEL_8_BREAKING && !process.env.BABEL_TYPES_8_BREAKING
          ? assertNodeType("Expression")
          : assertNodeType("Identifier", "MemberExpression"),
    },
    operator: {
      validate: assertOneOf(...UPDATE_OPERATORS),
    },
  },
  visitor: ["argument"],
  aliases: ["Expression"],
});

defineType("VariableDeclaration", {
  builder: ["kind", "declarations"],
  visitor: ["declarations"],
  aliases: ["Statement", "Declaration"],
  fields: {
    declare: {
      validate: assertValueType("boolean"),
      optional: true,
    },
    kind: {
      validate: assertOneOf(
        "var",
        "let",
        "const",
        // https://github.com/tc39/proposal-explicit-resource-management
        "using",
        // https://github.com/tc39/proposal-async-explicit-resource-management
        "await using",
      ),
    },
    declarations: validateArrayOfType("VariableDeclarator"),
  },
  validate:
    process.env.BABEL_8_BREAKING || process.env.BABEL_TYPES_8_BREAKING
      ? (() => {
          const withoutInit = assertNodeType("Identifier");

          return function (parent, key, node: t.VariableDeclaration) {
            if (is("ForXStatement", parent, { left: node })) {
              if (node.declarations.length !== 1) {
                throw new TypeError(
                  `Exactly one VariableDeclarator is required in the VariableDeclaration of a ${parent.type}`,
                );
              }
            } else {
              node.declarations.forEach(decl => {
                if (!decl.init) withoutInit(decl, "id", decl.id);
              });
            }
          };
        })()
      : undefined,
});

defineType("VariableDeclarator", {
  visitor: ["id", "init"],
  fields: {
    id: {
      validate:
        !process.env.BABEL_8_BREAKING && !process.env.BABEL_TYPES_8_BREAKING
          ? assertNodeType("LVal")
          : assertNodeType("Identifier", "ArrayPattern", "ObjectPattern"),
    },
    definite: {
      optional: true,
      validate: assertValueType("boolean"),
    },
    init: {
      optional: true,
      validate: assertNodeType("Expression"),
    },
  },
});

defineType("WhileStatement", {
  visitor: ["test", "body"],
  aliases: ["Statement", "BlockParent", "Loop", "While", "Scopable"],
  fields: {
    test: {
      validate: assertNodeType("Expression"),
    },
    body: {
      validate: assertNodeType("Statement"),
    },
  },
});

defineType("WithStatement", {
  visitor: ["object", "body"],
  aliases: ["Statement"],
  fields: {
    object: {
      validate: assertNodeType("Expression"),
    },
    body: {
      validate: assertNodeType("Statement"),
    },
  },
});

// --- ES2015 ---
defineType("AssignmentPattern", {
  visitor: ["left", "right", "decorators" /* for legacy param decorators */],
  builder: ["left", "right"],
  aliases: ["Pattern", "PatternLike", "LVal"],
  fields: {
    ...patternLikeCommon(),
    left: {
      validate: assertNodeType(
        "Identifier",
        "ObjectPattern",
        "ArrayPattern",
        "MemberExpression",
        "TSAsExpression",
        "TSSatisfiesExpression",
        "TSTypeAssertion",
        "TSNonNullExpression",
      ),
    },
    right: {
      validate: assertNodeType("Expression"),
    },
    // For TypeScript
    decorators: {
      validate: arrayOfType("Decorator"),
      optional: true,
    },
  },
});

defineType("ArrayPattern", {
  visitor: ["elements", "typeAnnotation"],
  builder: ["elements"],
  aliases: ["Pattern", "PatternLike", "LVal"],
  fields: {
    ...patternLikeCommon(),
    elements: {
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeOrValueType("null", "PatternLike", "LVal")),
      ),
    },
  },
});

defineType("ArrowFunctionExpression", {
  builder: ["params", "body", "async"],
  visitor: ["typeParameters", "params", "returnType", "body"],
  aliases: [
    "Scopable",
    "Function",
    "BlockParent",
    "FunctionParent",
    "Expression",
    "Pureish",
  ],
  fields: {
    ...functionCommon(),
    ...functionTypeAnnotationCommon(),
    expression: {
      // https://github.com/babel/babylon/issues/505
      validate: assertValueType("boolean"),
    },
    body: {
      validate: assertNodeType("BlockStatement", "Expression"),
    },
    predicate: {
      validate: assertNodeType("DeclaredPredicate", "InferredPredicate"),
      optional: true,
    },
  },
});

defineType("ClassBody", {
  visitor: ["body"],
  fields: {
    body: validateArrayOfType(
      "ClassMethod",
      "ClassPrivateMethod",
      "ClassProperty",
      "ClassPrivateProperty",
      "ClassAccessorProperty",
      "TSDeclareMethod",
      "TSIndexSignature",
      "StaticBlock",
    ),
  },
});

defineType("ClassExpression", {
  builder: ["id", "superClass", "body", "decorators"],
  visitor: [
    "decorators",
    "id",
    "typeParameters",
    "superClass",
    "superTypeParameters",
    "mixins",
    "implements",
    "body",
  ],
  aliases: ["Scopable", "Class", "Expression"],
  fields: {
    id: {
      validate: assertNodeType("Identifier"),
      optional: true,
    },
    typeParameters: {
      validate: process.env.BABEL_8_BREAKING
        ? assertNodeType(
            "TypeParameterDeclaration",
            "TSTypeParameterDeclaration",
          )
        : assertNodeType(
            "TypeParameterDeclaration",
            "TSTypeParameterDeclaration",
            // @ts-ignore(Babel 7 vs Babel 8) Babel 7 AST
            "Noop",
          ),
      optional: true,
    },
    body: {
      validate: assertNodeType("ClassBody"),
    },
    superClass: {
      optional: true,
      validate: assertNodeType("Expression"),
    },
    superTypeParameters: {
      validate: assertNodeType(
        "TypeParameterInstantiation",
        "TSTypeParameterInstantiation",
      ),
      optional: true,
    },
    implements: {
      validate: arrayOfType(
        // @ts-ignore(Babel 7 vs Babel 8) Babel 7 AST
        process.env.BABEL_8_BREAKING
          ? "TSClassImplements"
          : "TSExpressionWithTypeArguments",
        "ClassImplements",
      ),
      optional: true,
    },
    decorators: {
      validate: arrayOfType("Decorator"),
      optional: true,
    },
    mixins: {
      validate: assertNodeType("InterfaceExtends"),
      optional: true,
    },
  },
});

defineType("ClassDeclaration", {
  inherits: "ClassExpression",
  aliases: ["Scopable", "Class", "Statement", "Declaration"],
  fields: {
    id: {
      validate: assertNodeType("Identifier"),
      // The id may be omitted if this is the child of an
      // ExportDefaultDeclaration.
      optional: true,
    },
    typeParameters: {
      validate: process.env.BABEL_8_BREAKING
        ? assertNodeType(
            "TypeParameterDeclaration",
            "TSTypeParameterDeclaration",
          )
        : assertNodeType(
            "TypeParameterDeclaration",
            "TSTypeParameterDeclaration",
            // @ts-ignore(Babel 7 vs Babel 8) Babel 7 AST
            "Noop",
          ),
      optional: true,
    },
    body: {
      validate: assertNodeType("ClassBody"),
    },
    superClass: {
      optional: true,
      validate: assertNodeType("Expression"),
    },
    superTypeParameters: {
      validate: assertNodeType(
        "TypeParameterInstantiation",
        "TSTypeParameterInstantiation",
      ),
      optional: true,
    },
    implements: {
      validate: arrayOfType(
        // @ts-ignore(Babel 7 vs Babel 8) Babel 7 AST
        process.env.BABEL_8_BREAKING
          ? "TSClassImplements"
          : "TSExpressionWithTypeArguments",
        "ClassImplements",
      ),
      optional: true,
    },
    decorators: {
      validate: arrayOfType("Decorator"),
      optional: true,
    },
    mixins: {
      validate: assertNodeType("InterfaceExtends"),
      optional: true,
    },
    declare: {
      validate: assertValueType("boolean"),
      optional: true,
    },
    abstract: {
      validate: assertValueType("boolean"),
      optional: true,
    },
  },
  validate:
    !process.env.BABEL_8_BREAKING && !process.env.BABEL_TYPES_8_BREAKING
      ? undefined
      : (function () {
          const identifier = assertNodeType("Identifier");
          return function (parent, key, node) {
            if (!is("ExportDefaultDeclaration", parent)) {
              identifier(node, "id", node.id);
            }
          };
        })(),
});

defineType("ExportAllDeclaration", {
  builder: ["source"],
  visitor: ["source", "attributes", "assertions"],
  aliases: [
    "Statement",
    "Declaration",
    "ImportOrExportDeclaration",
    "ExportDeclaration",
  ],
  fields: {
    source: {
      validate: assertNodeType("StringLiteral"),
    },
    exportKind: validateOptional(assertOneOf("type", "value")),
    attributes: {
      optional: true,
      validate: arrayOfType("ImportAttribute"),
    },
    assertions: {
      deprecated: true,
      optional: true,
      validate: arrayOfType("ImportAttribute"),
    },
  },
});

defineType("ExportDefaultDeclaration", {
  visitor: ["declaration"],
  aliases: [
    "Statement",
    "Declaration",
    "ImportOrExportDeclaration",
    "ExportDeclaration",
  ],
  fields: {
    declaration: validateType(
      "TSDeclareFunction",
      "FunctionDeclaration",
      "ClassDeclaration",
      "Expression",
    ),
    exportKind: validateOptional(assertOneOf("value")),
  },
});

defineType("ExportNamedDeclaration", {
  builder: ["declaration", "specifiers", "source"],
  visitor: process.env
    ? ["declaration", "specifiers", "source", "attributes"]
    : ["declaration", "specifiers", "source", "attributes", "assertions"],
  aliases: [
    "Statement",
    "Declaration",
    "ImportOrExportDeclaration",
    "ExportDeclaration",
  ],
  fields: {
    declaration: {
      optional: true,
      validate:
        process.env.BABEL_8_BREAKING || process.env.BABEL_TYPES_8_BREAKING
          ? chain(
              assertNodeType("Declaration"),
              Object.assign(
                function (node: t.ExportNamedDeclaration, key, val) {
                  // This validator isn't put at the top level because we can run it
                  // even if this node doesn't have a parent.

                  if (val && node.specifiers.length) {
                    throw new TypeError(
                      "Only declaration or specifiers is allowed on ExportNamedDeclaration",
                    );
                  }

                  // This validator isn't put at the top level because we can run it
                  // even if this node doesn't have a parent.

                  if (val && node.source) {
                    throw new TypeError(
                      "Cannot export a declaration from a source",
                    );
                  }
                } as Validator,
                { oneOfNodeTypes: ["Declaration"] },
              ),
            )
          : assertNodeType("Declaration"),
    },
    attributes: {
      optional: true,
      validate: arrayOfType("ImportAttribute"),
    },
    assertions: {
      deprecated: true,
      optional: true,
      validate: arrayOfType("ImportAttribute"),
    },
    specifiers: {
      default: [],
      validate: arrayOf(
        (function () {
          const sourced = assertNodeType(
            "ExportSpecifier",
            "ExportDefaultSpecifier",
            "ExportNamespaceSpecifier",
          );
          const sourceless = assertNodeType("ExportSpecifier");

          if (
            !process.env.BABEL_8_BREAKING &&
            !process.env.BABEL_TYPES_8_BREAKING
          )
            return sourced;

          return Object.assign(
            function (node: t.ExportNamedDeclaration, key, val) {
              const validator = node.source ? sourced : sourceless;
              validator(node, key, val);
            } as Validator,
            {
              oneOfNodeTypes: [
                "ExportSpecifier",
                "ExportDefaultSpecifier",
                "ExportNamespaceSpecifier",
              ],
            },
          );
        })(),
      ),
    },
    source: {
      validate: assertNodeType("StringLiteral"),
      optional: true,
    },
    exportKind: validateOptional(assertOneOf("type", "value")),
  },
});

defineType("ExportSpecifier", {
  visitor: ["local", "exported"],
  aliases: ["ModuleSpecifier"],
  fields: {
    local: {
      validate: assertNodeType("Identifier"),
    },
    exported: {
      validate: assertNodeType("Identifier", "StringLiteral"),
    },
    exportKind: {
      // And TypeScript's "export { type foo } from"
      validate: assertOneOf("type", "value"),
      optional: true,
    },
  },
});

defineType("ForOfStatement", {
  visitor: ["left", "right", "body"],
  builder: ["left", "right", "body", "await"],
  aliases: [
    "Scopable",
    "Statement",
    "For",
    "BlockParent",
    "Loop",
    "ForXStatement",
  ],
  fields: {
    left: {
      validate: (function () {
        if (
          !process.env.BABEL_8_BREAKING &&
          !process.env.BABEL_TYPES_8_BREAKING
        ) {
          return assertNodeType("VariableDeclaration", "LVal");
        }

        const declaration = assertNodeType("VariableDeclaration");
        const lval = assertNodeType(
          "Identifier",
          "MemberExpression",
          "ArrayPattern",
          "ObjectPattern",
          "TSAsExpression",
          "TSSatisfiesExpression",
          "TSTypeAssertion",
          "TSNonNullExpression",
        );

        return Object.assign(
          function (node, key, val) {
            if (is("VariableDeclaration", val)) {
              declaration(node, key, val);
            } else {
              lval(node, key, val);
            }
          } as Validator,
          {
            oneOfNodeTypes: [
              "VariableDeclaration",
              "Identifier",
              "MemberExpression",
              "ArrayPattern",
              "ObjectPattern",
              "TSAsExpression",
              "TSSatisfiesExpression",
              "TSTypeAssertion",
              "TSNonNullExpression",
            ],
          },
        );
      })(),
    },
    right: {
      validate: assertNodeType("Expression"),
    },
    body: {
      validate: assertNodeType("Statement"),
    },
    await: {
      default: false,
    },
  },
});

defineType("ImportDeclaration", {
  builder: ["specifiers", "source"],
  visitor: process.env.BABEL_8_BREAKING
    ? ["specifiers", "source", "attributes"]
    : ["specifiers", "source", "attributes", "assertions"],
  aliases: ["Statement", "Declaration", "ImportOrExportDeclaration"],
  fields: {
    attributes: {
      optional: true,
      validate: arrayOfType("ImportAttribute"),
    },
    assertions: {
      deprecated: true,
      optional: true,
      validate: arrayOfType("ImportAttribute"),
    },
    module: {
      optional: true,
      validate: assertValueType("boolean"),
    },
    phase: {
      default: null,
      validate: assertOneOf("source", "defer"),
    },
    specifiers: validateArrayOfType(
      "ImportSpecifier",
      "ImportDefaultSpecifier",
      "ImportNamespaceSpecifier",
    ),
    source: {
      validate: assertNodeType("StringLiteral"),
    },
    importKind: {
      // Handle TypeScript/Flowtype's extension "import type foo from"
      // TypeScript doesn't support typeof
      validate: assertOneOf("type", "typeof", "value"),
      optional: true,
    },
  },
});

defineType("ImportDefaultSpecifier", {
  visitor: ["local"],
  aliases: ["ModuleSpecifier"],
  fields: {
    local: {
      validate: assertNodeType("Identifier"),
    },
  },
});

defineType("ImportNamespaceSpecifier", {
  visitor: ["local"],
  aliases: ["ModuleSpecifier"],
  fields: {
    local: {
      validate: assertNodeType("Identifier"),
    },
  },
});

defineType("ImportSpecifier", {
  visitor: ["imported", "local"],
  builder: ["local", "imported"],
  aliases: ["ModuleSpecifier"],
  fields: {
    local: {
      validate: assertNodeType("Identifier"),
    },
    imported: {
      validate: assertNodeType("Identifier", "StringLiteral"),
    },
    importKind: {
      // Handle Flowtype's extension "import {typeof foo} from"
      // And TypeScript's "import { type foo } from"
      validate: assertOneOf("type", "typeof", "value"),
      optional: true,
    },
  },
});

defineType("ImportExpression", {
  visitor: ["source", "options"],
  aliases: ["Expression"],
  fields: {
    phase: {
      default: null,
      validate: assertOneOf("source", "defer"),
    },
    source: {
      validate: assertNodeType("Expression"),
    },
    options: {
      validate: assertNodeType("Expression"),
      optional: true,
    },
  },
});

defineType("MetaProperty", {
  visitor: ["meta", "property"],
  aliases: ["Expression"],
  fields: {
    meta: {
      validate:
        process.env.BABEL_8_BREAKING || process.env.BABEL_TYPES_8_BREAKING
          ? chain(
              assertNodeType("Identifier"),
              Object.assign(
                function (node: t.MetaProperty, key, val) {
                  let property;
                  switch (val.name) {
                    case "function":
                      property = "sent";
                      break;
                    case "new":
                      property = "target";
                      break;
                    case "import":
                      property = "meta";
                      break;
                  }
                  if (!is("Identifier", node.property, { name: property })) {
                    throw new TypeError("Unrecognised MetaProperty");
                  }
                } as Validator,
                { oneOfNodeTypes: ["Identifier"] },
              ),
            )
          : assertNodeType("Identifier"),
    },
    property: {
      validate: assertNodeType("Identifier"),
    },
  },
});

export const classMethodOrPropertyCommon = () => ({
  abstract: {
    validate: assertValueType("boolean"),
    optional: true,
  },
  accessibility: {
    validate: assertOneOf("public", "private", "protected"),
    optional: true,
  },
  static: {
    default: false,
  },
  override: {
    default: false,
  },
  computed: {
    default: false,
  },
  optional: {
    validate: assertValueType("boolean"),
    optional: true,
  },
  key: {
    validate: chain(
      (function () {
        const normal = assertNodeType(
          "Identifier",
          "StringLiteral",
          "NumericLiteral",
          "BigIntLiteral",
        );
        const computed = assertNodeType("Expression");

        return function (node: any, key: string, val: any) {
          const validator = node.computed ? computed : normal;
          validator(node, key, val);
        };
      })(),
      assertNodeType(
        "Identifier",
        "StringLiteral",
        "NumericLiteral",
        "BigIntLiteral",
        "Expression",
      ),
    ),
  },
});

export const classMethodOrDeclareMethodCommon = () => ({
  ...functionCommon(),
  ...classMethodOrPropertyCommon(),
  params: validateArrayOfType(
    "Identifier",
    "Pattern",
    "RestElement",
    "TSParameterProperty",
  ),
  kind: {
    validate: assertOneOf("get", "set", "method", "constructor"),
    default: "method",
  },
  access: {
    validate: chain(
      assertValueType("string"),
      assertOneOf("public", "private", "protected"),
    ),
    optional: true,
  },
  decorators: {
    validate: arrayOfType("Decorator"),
    optional: true,
  },
});

defineType("ClassMethod", {
  aliases: ["Function", "Scopable", "BlockParent", "FunctionParent", "Method"],
  builder: [
    "kind",
    "key",
    "params",
    "body",
    "computed",
    "static",
    "generator",
    "async",
  ],
  visitor: [
    "decorators",
    "key",
    "typeParameters",
    "params",
    "returnType",
    "body",
  ],
  fields: {
    ...classMethodOrDeclareMethodCommon(),
    ...functionTypeAnnotationCommon(),
    body: {
      validate: assertNodeType("BlockStatement"),
    },
  },
});

defineType("ObjectPattern", {
  visitor: [
    "properties",
    "typeAnnotation",
    "decorators" /* for legacy param decorators */,
  ],
  builder: ["properties"],
  aliases: ["Pattern", "PatternLike", "LVal"],
  fields: {
    ...patternLikeCommon(),
    properties: validateArrayOfType("RestElement", "ObjectProperty"),
  },
});

defineType("SpreadElement", {
  visitor: ["argument"],
  aliases: ["UnaryLike"],
  deprecatedAlias: "SpreadProperty",
  fields: {
    argument: {
      validate: assertNodeType("Expression"),
    },
  },
});

defineType(
  "Super",
  process.env.BABEL_8_BREAKING
    ? undefined
    : {
        aliases: ["Expression"],
      },
);

defineType("TaggedTemplateExpression", {
  visitor: ["tag", "typeParameters", "quasi"],
  builder: ["tag", "quasi"],
  aliases: ["Expression"],
  fields: {
    tag: {
      validate: assertNodeType("Expression"),
    },
    quasi: {
      validate: assertNodeType("TemplateLiteral"),
    },
    typeParameters: {
      validate: assertNodeType(
        "TypeParameterInstantiation",
        "TSTypeParameterInstantiation",
      ),
      optional: true,
    },
  },
});

defineType("TemplateElement", {
  builder: ["value", "tail"],
  fields: {
    value: {
      validate: chain(
        assertShape({
          raw: {
            validate: assertValueType("string"),
          },
          cooked: {
            validate: assertValueType("string"),
            optional: true,
          },
        }),
        function templateElementCookedValidator(node: t.TemplateElement) {
          const raw = node.value.raw;

          let unterminatedCalled = false;

          const error = () => {
            // unreachable
            throw new Error("Internal @babel/types error.");
          };
          const { str, firstInvalidLoc } = readStringContents(
            "template",
            raw,
            0,
            0,
            0,
            {
              unterminated() {
                unterminatedCalled = true;
              },
              strictNumericEscape: error,
              invalidEscapeSequence: error,
              numericSeparatorInEscapeSequence: error,
              unexpectedNumericSeparator: error,
              invalidDigit: error,
              invalidCodePoint: error,
            },
          );
          if (!unterminatedCalled) throw new Error("Invalid raw");

          node.value.cooked = firstInvalidLoc ? null : str;
        },
      ),
    },
    tail: {
      default: false,
    },
  },
});

defineType("TemplateLiteral", {
  visitor: ["quasis", "expressions"],
  aliases: ["Expression", "Literal"],
  fields: {
    quasis: validateArrayOfType("TemplateElement"),
    expressions: {
      validate: chain(
        assertValueType("array"),
        assertEach(
          assertNodeType(
            "Expression",
            // For TypeScript template literal types
            "TSType",
          ),
        ),
        function (node: t.TemplateLiteral, key, val) {
          if (node.quasis.length !== val.length + 1) {
            throw new TypeError(
              `Number of ${
                node.type
              } quasis should be exactly one more than the number of expressions.\nExpected ${
                val.length + 1
              } quasis but got ${node.quasis.length}`,
            );
          }
        } as Validator,
      ),
    },
  },
});

defineType("YieldExpression", {
  builder: ["argument", "delegate"],
  visitor: ["argument"],
  aliases: ["Expression", "Terminatorless"],
  fields: {
    delegate: {
      validate:
        process.env.BABEL_8_BREAKING || process.env.BABEL_TYPES_8_BREAKING
          ? chain(
              assertValueType("boolean"),
              Object.assign(
                function (node: t.YieldExpression, key, val) {
                  if (val && !node.argument) {
                    throw new TypeError(
                      "Property delegate of YieldExpression cannot be true if there is no argument",
                    );
                  }
                } as Validator,
                { type: "boolean" },
              ),
            )
          : assertValueType("boolean"),
      default: false,
    },
    argument: {
      optional: true,
      validate: assertNodeType("Expression"),
    },
  },
});

// --- ES2017 ---
defineType("AwaitExpression", {
  builder: ["argument"],
  visitor: ["argument"],
  aliases: ["Expression", "Terminatorless"],
  fields: {
    argument: {
      validate: assertNodeType("Expression"),
    },
  },
});

// --- ES2019 ---
defineType("Import", {
  aliases: ["Expression"],
});

// --- ES2020 ---
defineType("BigIntLiteral", {
  builder: ["value"],
  fields: {
    value: {
      validate: assertValueType("string"),
    },
  },
  aliases: ["Expression", "Pureish", "Literal", "Immutable"],
});

defineType("ExportNamespaceSpecifier", {
  visitor: ["exported"],
  aliases: ["ModuleSpecifier"],
  fields: {
    exported: {
      validate: assertNodeType("Identifier"),
    },
  },
});

defineType("OptionalMemberExpression", {
  builder: ["object", "property", "computed", "optional"],
  visitor: ["object", "property"],
  aliases: ["Expression"],
  fields: {
    object: {
      validate: assertNodeType("Expression"),
    },
    property: {
      validate: (function () {
        const normal = assertNodeType("Identifier");
        const computed = assertNodeType("Expression");

        const validator: Validator = Object.assign(
          function (node: t.OptionalMemberExpression, key, val) {
            const validator = node.computed ? computed : normal;
            validator(node, key, val);
          } as Validator,
          // todo(ts): can be discriminated union by `computed` property
          { oneOfNodeTypes: ["Expression", "Identifier"] },
        );
        return validator;
      })(),
    },
    computed: {
      default: false,
    },
    optional: {
      validate:
        !process.env.BABEL_8_BREAKING && !process.env.BABEL_TYPES_8_BREAKING
          ? assertValueType("boolean")
          : chain(assertValueType("boolean"), assertOptionalChainStart()),
    },
  },
});

defineType("OptionalCallExpression", {
  visitor: ["callee", "arguments", "typeParameters", "typeArguments"],
  builder: ["callee", "arguments", "optional"],
  aliases: ["Expression"],
  fields: {
    callee: {
      validate: assertNodeType("Expression"),
    },
    arguments: validateArrayOfType(
      "Expression",
      "SpreadElement",
      "ArgumentPlaceholder",
    ),
    optional: {
      validate:
        !process.env.BABEL_8_BREAKING && !process.env.BABEL_TYPES_8_BREAKING
          ? assertValueType("boolean")
          : chain(assertValueType("boolean"), assertOptionalChainStart()),
    },
    typeArguments: {
      validate: assertNodeType("TypeParameterInstantiation"),
      optional: true,
    },
    typeParameters: {
      validate: assertNodeType("TSTypeParameterInstantiation"),
      optional: true,
    },
  },
});

// --- ES2022 ---
defineType("ClassProperty", {
  visitor: ["decorators", "key", "typeAnnotation", "value"],
  builder: [
    "key",
    "value",
    "typeAnnotation",
    "decorators",
    "computed",
    "static",
  ],
  aliases: ["Property"],
  fields: {
    ...classMethodOrPropertyCommon(),
    value: {
      validate: assertNodeType("Expression"),
      optional: true,
    },
    definite: {
      validate: assertValueType("boolean"),
      optional: true,
    },
    typeAnnotation: {
      validate: process.env.BABEL_8_BREAKING
        ? assertNodeType("TypeAnnotation", "TSTypeAnnotation")
        : assertNodeType(
            "TypeAnnotation",
            "TSTypeAnnotation",
            // @ts-ignore(Babel 7 vs Babel 8) Babel 7 AST
            "Noop",
          ),
      optional: true,
    },
    decorators: {
      validate: arrayOfType("Decorator"),
      optional: true,
    },
    readonly: {
      validate: assertValueType("boolean"),
      optional: true,
    },
    declare: {
      validate: assertValueType("boolean"),
      optional: true,
    },
    variance: {
      validate: assertNodeType("Variance"),
      optional: true,
    },
  },
});

defineType("ClassAccessorProperty", {
  visitor: ["decorators", "key", "typeAnnotation", "value"],
  builder: [
    "key",
    "value",
    "typeAnnotation",
    "decorators",
    "computed",
    "static",
  ],
  aliases: ["Property", "Accessor"],
  fields: {
    ...classMethodOrPropertyCommon(),
    key: {
      validate: chain(
        (function () {
          const normal = assertNodeType(
            "Identifier",
            "StringLiteral",
            "NumericLiteral",
            "BigIntLiteral",
            "PrivateName",
          );
          const computed = assertNodeType("Expression");

          return function (node: any, key: string, val: any) {
            const validator = node.computed ? computed : normal;
            validator(node, key, val);
          };
        })(),
        assertNodeType(
          "Identifier",
          "StringLiteral",
          "NumericLiteral",
          "BigIntLiteral",
          "Expression",
          "PrivateName",
        ),
      ),
    },
    value: {
      validate: assertNodeType("Expression"),
      optional: true,
    },
    definite: {
      validate: assertValueType("boolean"),
      optional: true,
    },
    typeAnnotation: {
      validate: process.env.BABEL_8_BREAKING
        ? assertNodeType("TypeAnnotation", "TSTypeAnnotation")
        : assertNodeType(
            "TypeAnnotation",
            "TSTypeAnnotation",
            // @ts-ignore(Babel 7 vs Babel 8) Babel 7 AST
            "Noop",
          ),
      optional: true,
    },
    decorators: {
      validate: arrayOfType("Decorator"),
      optional: true,
    },
    readonly: {
      validate: assertValueType("boolean"),
      optional: true,
    },
    declare: {
      validate: assertValueType("boolean"),
      optional: true,
    },
    variance: {
      validate: assertNodeType("Variance"),
      optional: true,
    },
  },
});

defineType("ClassPrivateProperty", {
  visitor: ["decorators", "key", "typeAnnotation", "value"],
  builder: ["key", "value", "decorators", "static"],
  aliases: ["Property", "Private"],
  fields: {
    key: {
      validate: assertNodeType("PrivateName"),
    },
    value: {
      validate: assertNodeType("Expression"),
      optional: true,
    },
    typeAnnotation: {
      validate: process.env.BABEL_8_BREAKING
        ? assertNodeType("TypeAnnotation", "TSTypeAnnotation")
        : assertNodeType(
            "TypeAnnotation",
            "TSTypeAnnotation",
            // @ts-ignore(Babel 7 vs Babel 8) Babel 7 AST
            "Noop",
          ),
      optional: true,
    },
    decorators: {
      validate: arrayOfType("Decorator"),
      optional: true,
    },
    static: {
      validate: assertValueType("boolean"),
      default: false,
    },
    readonly: {
      validate: assertValueType("boolean"),
      optional: true,
    },
    definite: {
      validate: assertValueType("boolean"),
      optional: true,
    },
    variance: {
      validate: assertNodeType("Variance"),
      optional: true,
    },
  },
});

defineType("ClassPrivateMethod", {
  builder: ["kind", "key", "params", "body", "static"],
  visitor: [
    "decorators",
    "key",
    "typeParameters",
    "params",
    "returnType",
    "body",
  ],
  aliases: [
    "Function",
    "Scopable",
    "BlockParent",
    "FunctionParent",
    "Method",
    "Private",
  ],
  fields: {
    ...classMethodOrDeclareMethodCommon(),
    ...functionTypeAnnotationCommon(),
    kind: {
      validate: assertOneOf("get", "set", "method"),
      default: "method",
    },
    key: {
      validate: assertNodeType("PrivateName"),
    },
    body: {
      validate: assertNodeType("BlockStatement"),
    },
  },
});

defineType("PrivateName", {
  visitor: ["id"],
  aliases: ["Private"],
  fields: {
    id: {
      validate: assertNodeType("Identifier"),
    },
  },
});

defineType("StaticBlock", {
  visitor: ["body"],
  fields: {
    body: validateArrayOfType("Statement"),
  },
  aliases: ["Scopable", "BlockParent", "FunctionParent"],
});
