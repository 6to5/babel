import is from "../validators/is";
import isValidIdentifier from "../validators/isValidIdentifier";
import { isKeyword, isReservedWord } from "@babel/helper-validator-identifier";
import type * as t from "..";
import { readStringContents } from "@babel/helper-string-parser";

import {
  BINARY_OPERATORS,
  LOGICAL_OPERATORS,
  ASSIGNMENT_OPERATORS,
  UNARY_OPERATORS,
  UPDATE_OPERATORS,
  AWAIT_OPERATIONS,
} from "../constants";

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
} from "./utils";

const defineType = defineAliasedType("Standardized");

defineType("ArrayExpression", {
  fields: {
    elements: {
      validate: chain(
        assertValueType("array"),
        assertEach(
          assertNodeOrValueType("null", "Expression", "SpreadElement"),
        ),
      ),
      default: !process.env.BABEL_TYPES_8_BREAKING ? [] : undefined,
    },
  },
  visitor: ["elements"],
  aliases: ["Expression"],
});

defineType("AssignmentExpression", {
  fields: {
    operator: {
      validate: (function () {
        if (!process.env.BABEL_TYPES_8_BREAKING) {
          return assertValueType("string");
        }

        const identifier = assertOneOf(...ASSIGNMENT_OPERATORS);
        const pattern = assertOneOf("=");

        return function (node: t.AssignmentExpression, key, val) {
          const validator = is("Pattern", node.left) ? pattern : identifier;
          validator(node, key, val);
        };
      })(),
    },
    left: {
      validate: !process.env.BABEL_TYPES_8_BREAKING
        ? assertNodeType("LVal")
        : assertNodeType(
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
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("Directive")),
      ),
      default: [],
    },
    body: {
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("Statement")),
      ),
    },
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
    arguments: {
      validate: chain(
        assertValueType("array"),
        assertEach(
          assertNodeType(
            "Expression",
            "SpreadElement",
            "JSXNamespacedName",
            "ArgumentPlaceholder",
          ),
        ),
      ),
    },
    ...(!process.env.BABEL_TYPES_8_BREAKING
      ? {
          optional: {
            validate: assertOneOf(true, false),
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
  visitor: ["test", "body"],
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
      validate: !process.env.BABEL_TYPES_8_BREAKING
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
      validate: !process.env.BABEL_TYPES_8_BREAKING
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
  params: {
    validate: chain(
      assertValueType("array"),
      assertEach(assertNodeType("Identifier", "Pattern", "RestElement")),
    ),
  },
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
  visitor: ["id", "params", "body", "returnType", "typeParameters"],
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
  validate: (function () {
    if (!process.env.BABEL_TYPES_8_BREAKING) return () => {};

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
    validate: chain(
      assertValueType("array"),
      assertEach(assertNodeType("Decorator")),
    ),
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
      validate: chain(
        assertValueType("string"),
        Object.assign(
          function (node, key, val) {
            if (!process.env.BABEL_TYPES_8_BREAKING) return;

            if (!isValidIdentifier(val, false)) {
              throw new TypeError(`"${val}" is not a valid identifier name`);
            }
          } as Validator,
          { type: "string" },
        ),
      ),
    },
  },
  validate(parent, key, node) {
    if (!process.env.BABEL_TYPES_8_BREAKING) return;

    const match = /\.(\w+)$/.exec(key);
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
  },
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
      validate: assertValueType("number"),
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
      validate: chain(
        assertValueType("string"),
        Object.assign(
          function (node, key, val) {
            if (!process.env.BABEL_TYPES_8_BREAKING) return;

            const invalid = /[^gimsuy]/.exec(val);
            if (invalid) {
              throw new TypeError(`"${invalid[0]}" is not a valid RegExp flag`);
            }
          } as Validator,
          { type: "string" },
        ),
      ),
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
    ...(!process.env.BABEL_TYPES_8_BREAKING ? ["optional"] : []),
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
    ...(!process.env.BABEL_TYPES_8_BREAKING
      ? {
          optional: {
            validate: assertOneOf(true, false),
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
    sourceFile: {
      validate: assertValueType("string"),
    },
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
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("Directive")),
      ),
      default: [],
    },
    body: {
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("Statement")),
      ),
    },
  },
  aliases: ["Scopable", "BlockParent", "Block"],
});

defineType("ObjectExpression", {
  visitor: ["properties"],
  aliases: ["Expression"],
  fields: {
    properties: {
      validate: chain(
        assertValueType("array"),
        assertEach(
          assertNodeType("ObjectMethod", "ObjectProperty", "SpreadElement"),
        ),
      ),
    },
  },
});

defineType("ObjectMethod", {
  builder: ["kind", "key", "params", "body", "computed", "generator", "async"],
  fields: {
    ...functionCommon(),
    ...functionTypeAnnotationCommon(),
    kind: {
      validate: assertOneOf("method", "get", "set"),
      ...(!process.env.BABEL_TYPES_8_BREAKING ? { default: "method" } : {}),
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
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("Decorator")),
      ),
      optional: true,
    },
    body: {
      validate: assertNodeType("BlockStatement"),
    },
  },
  visitor: [
    "key",
    "params",
    "body",
    "decorators",
    "returnType",
    "typeParameters",
  ],
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
    ...(!process.env.BABEL_TYPES_8_BREAKING ? ["decorators"] : []),
  ],
  fields: {
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
            oneOfNodeTypes: [
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
      validate: chain(
        assertValueType("boolean"),
        Object.assign(
          function (node: t.ObjectProperty, key, val) {
            if (!process.env.BABEL_TYPES_8_BREAKING) return;

            if (val && node.computed) {
              throw new TypeError(
                "Property shorthand of ObjectProperty cannot be true if computed is true",
              );
            }
          } as Validator,
          { type: "boolean" },
        ),
        function (node: t.ObjectProperty, key, val) {
          if (!process.env.BABEL_TYPES_8_BREAKING) return;

          if (val && !is("Identifier", node.key)) {
            throw new TypeError(
              "Property shorthand of ObjectProperty cannot be true if key is not an Identifier",
            );
          }
        } as Validator,
      ),
      default: false,
    },
    decorators: {
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("Decorator")),
      ),
      optional: true,
    },
  },
  visitor: ["key", "value", "decorators"],
  aliases: ["UserWhitespacable", "Property", "ObjectMember"],
  validate: (function () {
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
      if (!process.env.BABEL_TYPES_8_BREAKING) return;

      const validator = is("ObjectPattern", parent) ? pattern : expression;
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
      validate: !process.env.BABEL_TYPES_8_BREAKING
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
  validate(parent: t.ArrayPattern | t.ObjectPattern, key) {
    if (!process.env.BABEL_TYPES_8_BREAKING) return;

    const match = /(\w+)\[(\d+)\]/.exec(key);
    if (!match) throw new Error("Internal Babel error: malformed key.");

    const [, listKey, index] = match as unknown as [
      string,
      keyof typeof parent,
      string,
    ];
    if ((parent[listKey] as t.Node[]).length > +index + 1) {
      throw new TypeError(`RestElement must be last element of ${listKey}`);
    }
  },
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
    expressions: {
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("Expression")),
      ),
    },
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
    consequent: {
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("Statement")),
      ),
    },
  },
});

defineType("SwitchStatement", {
  visitor: ["discriminant", "cases"],
  aliases: ["Statement", "BlockParent", "Scopable"],
  fields: {
    discriminant: {
      validate: assertNodeType("Expression"),
    },
    cases: {
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("SwitchCase")),
      ),
    },
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
      validate: chain(
        assertNodeType("BlockStatement"),
        Object.assign(
          function (node: t.TryStatement) {
            if (!process.env.BABEL_TYPES_8_BREAKING) return;

            // This validator isn't put at the top level because we can run it
            // even if this node doesn't have a parent.

            if (!node.handler && !node.finalizer) {
              throw new TypeError(
                "TryStatement expects either a handler or finalizer, or both",
              );
            }
          } as Validator,
          {
            oneOfNodeTypes: ["BlockStatement"],
          },
        ),
      ),
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
      validate: !process.env.BABEL_TYPES_8_BREAKING
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
      ),
    },
    declarations: {
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("VariableDeclarator")),
      ),
    },
  },
  validate(parent, key, node) {
    if (!process.env.BABEL_TYPES_8_BREAKING) return;

    if (!is("ForXStatement", parent, { left: node })) return;
    if (node.declarations.length !== 1) {
      throw new TypeError(
        `Exactly one VariableDeclarator is required in the VariableDeclaration of a ${parent.type}`,
      );
    }
  },
});

defineType("VariableDeclarator", {
  visitor: ["id", "init"],
  fields: {
    id: {
      validate: (function () {
        if (!process.env.BABEL_TYPES_8_BREAKING) {
          return assertNodeType("LVal");
        }

        const normal = assertNodeType(
          "Identifier",
          "ArrayPattern",
          "ObjectPattern",
        );
        const without = assertNodeType("Identifier");

        return function (node: t.VariableDeclarator, key, val) {
          const validator = node.init ? normal : without;
          validator(node, key, val);
        };
      })(),
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
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("Decorator")),
      ),
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
  visitor: ["params", "body", "returnType", "typeParameters"],
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
    body: {
      validate: chain(
        assertValueType("array"),
        assertEach(
          assertNodeType(
            "ClassMethod",
            "ClassPrivateMethod",
            "ClassProperty",
            "ClassPrivateProperty",
            "ClassAccessorProperty",
            "TSDeclareMethod",
            "TSIndexSignature",
            "StaticBlock",
          ),
        ),
      ),
    },
  },
});

defineType("ClassExpression", {
  builder: ["id", "superClass", "body", "decorators"],
  visitor: [
    "id",
    "body",
    "superClass",
    "mixins",
    "typeParameters",
    "superTypeParameters",
    "implements",
    "decorators",
  ],
  aliases: ["Scopable", "Class", "Expression"],
  fields: {
    id: {
      validate: assertNodeType("Identifier"),
      // In declarations, this is missing if this is the
      // child of an ExportDefaultDeclaration.
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
      validate: chain(
        assertValueType("array"),
        assertEach(
          assertNodeType("TSExpressionWithTypeArguments", "ClassImplements"),
        ),
      ),
      optional: true,
    },
    decorators: {
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("Decorator")),
      ),
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
      validate: chain(
        assertValueType("array"),
        assertEach(
          assertNodeType("TSExpressionWithTypeArguments", "ClassImplements"),
        ),
      ),
      optional: true,
    },
    decorators: {
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("Decorator")),
      ),
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
  validate: (function () {
    const identifier = assertNodeType("Identifier");

    return function (parent, key, node) {
      if (!process.env.BABEL_TYPES_8_BREAKING) return;

      if (!is("ExportDefaultDeclaration", parent)) {
        identifier(node, "id", node.id);
      }
    };
  })(),
});

defineType("ExportAllDeclaration", {
  visitor: ["source"],
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
    assertions: {
      optional: true,
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("ImportAttribute")),
      ),
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
    declaration: {
      validate: assertNodeType(
        "TSDeclareFunction",
        "FunctionDeclaration",
        "ClassDeclaration",
        "Expression",
      ),
    },
    exportKind: validateOptional(assertOneOf("value")),
  },
});

defineType("ExportNamedDeclaration", {
  visitor: ["declaration", "specifiers", "source"],
  aliases: [
    "Statement",
    "Declaration",
    "ImportOrExportDeclaration",
    "ExportDeclaration",
  ],
  fields: {
    declaration: {
      optional: true,
      validate: chain(
        assertNodeType("Declaration"),
        Object.assign(
          function (node: t.ExportNamedDeclaration, key, val) {
            if (!process.env.BABEL_TYPES_8_BREAKING) return;

            // This validator isn't put at the top level because we can run it
            // even if this node doesn't have a parent.

            if (val && node.specifiers.length) {
              throw new TypeError(
                "Only declaration or specifiers is allowed on ExportNamedDeclaration",
              );
            }
          } as Validator,
          { oneOfNodeTypes: ["Declaration"] },
        ),
        function (node: t.ExportNamedDeclaration, key, val) {
          if (!process.env.BABEL_TYPES_8_BREAKING) return;

          // This validator isn't put at the top level because we can run it
          // even if this node doesn't have a parent.

          if (val && node.source) {
            throw new TypeError("Cannot export a declaration from a source");
          }
        },
      ),
    },
    assertions: {
      optional: true,
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("ImportAttribute")),
      ),
    },
    specifiers: {
      default: [],
      validate: chain(
        assertValueType("array"),
        assertEach(
          (function () {
            const sourced = assertNodeType(
              "ExportSpecifier",
              "ExportDefaultSpecifier",
              "ExportNamespaceSpecifier",
            );
            const sourceless = assertNodeType("ExportSpecifier");

            if (!process.env.BABEL_TYPES_8_BREAKING) return sourced;

            return function (node: t.ExportNamedDeclaration, key, val) {
              const validator = node.source ? sourced : sourceless;
              validator(node, key, val);
            } as Validator;
          })(),
        ),
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
        if (!process.env.BABEL_TYPES_8_BREAKING) {
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

        return function (node, key, val) {
          if (is("VariableDeclaration", val)) {
            declaration(node, key, val);
          } else {
            lval(node, key, val);
          }
        };
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
  visitor: ["specifiers", "source"],
  aliases: ["Statement", "Declaration", "ImportOrExportDeclaration"],
  fields: {
    assertions: {
      optional: true,
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("ImportAttribute")),
      ),
    },
    module: {
      optional: true,
      validate: assertValueType("boolean"),
    },
    specifiers: {
      validate: chain(
        assertValueType("array"),
        assertEach(
          assertNodeType(
            "ImportSpecifier",
            "ImportDefaultSpecifier",
            "ImportNamespaceSpecifier",
          ),
        ),
      ),
    },
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
  visitor: ["local", "imported"],
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

defineType("MetaProperty", {
  visitor: ["meta", "property"],
  aliases: ["Expression"],
  fields: {
    meta: {
      validate: chain(
        assertNodeType("Identifier"),
        Object.assign(
          function (node: t.MetaProperty, key, val) {
            if (!process.env.BABEL_TYPES_8_BREAKING) return;

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
      ),
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
  params: {
    validate: chain(
      assertValueType("array"),
      assertEach(
        assertNodeType(
          "Identifier",
          "Pattern",
          "RestElement",
          "TSParameterProperty",
        ),
      ),
    ),
  },
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
    validate: chain(
      assertValueType("array"),
      assertEach(assertNodeType("Decorator")),
    ),
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
    "key",
    "params",
    "body",
    "decorators",
    "returnType",
    "typeParameters",
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
    properties: {
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("RestElement", "ObjectProperty")),
      ),
    },
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
  visitor: ["tag", "quasi", "typeParameters"],
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
    quasis: {
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("TemplateElement")),
      ),
    },
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
      validate: chain(
        assertValueType("boolean"),
        Object.assign(
          function (node: t.YieldExpression, key, val) {
            if (!process.env.BABEL_TYPES_8_BREAKING) return;

            if (val && !node.argument) {
              throw new TypeError(
                "Property delegate of YieldExpression cannot be true if there is no argument",
              );
            }
          } as Validator,
          { type: "boolean" },
        ),
      ),
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
  builder: ["argument", "operation"],
  visitor: ["argument", "operation"],
  aliases: ["Expression", "Terminatorless"],
  fields: {
    argument: {
      validate: assertNodeType("Expression"),
    },
    // https://github.com/tc39/proposal-await.ops
    operation: {
      validate: chain(assertNodeType("Identifier"), function (
        node: t.AwaitExpression,
        key,
        val: t.Identifier,
      ) {
        if (!(AWAIT_OPERATIONS as readonly string[]).includes(val.name)) {
          throw new TypeError(
            `The only valid await operations are "all", "allSettled", "any" and "race", but got "${val.name}"`,
          );
        }
      } as Validator),
      optional: true,
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
      validate: !process.env.BABEL_TYPES_8_BREAKING
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
    arguments: {
      validate: chain(
        assertValueType("array"),
        assertEach(
          assertNodeType(
            "Expression",
            "SpreadElement",
            "JSXNamespacedName",
            "ArgumentPlaceholder",
          ),
        ),
      ),
    },
    optional: {
      validate: !process.env.BABEL_TYPES_8_BREAKING
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
  visitor: ["key", "value", "typeAnnotation", "decorators"],
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
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("Decorator")),
      ),
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
  visitor: ["key", "value", "typeAnnotation", "decorators"],
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
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("Decorator")),
      ),
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
  visitor: ["key", "value", "decorators", "typeAnnotation"],
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
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("Decorator")),
      ),
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
    "key",
    "params",
    "body",
    "decorators",
    "returnType",
    "typeParameters",
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
    body: {
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("Statement")),
      ),
    },
  },
  aliases: ["Scopable", "BlockParent", "FunctionParent"],
});
