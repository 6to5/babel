import { importAttributes } from "./core.ts";
import {
  defineAliasedType,
  arrayOfType,
  assertOneOf,
  assertValueType,
  validate,
  validateArrayOfType,
  validateOptional,
  validateOptionalType,
  validateType,
} from "./utils.ts";

const defineType = defineAliasedType("Flow");

const defineInterfaceishType = (
  name: "DeclareClass" | "DeclareInterface" | "InterfaceDeclaration",
) => {
  const isDeclareClass = name === "DeclareClass";

  defineType(name, {
    builder: ["id", "typeParameters", "extends", "body"],
    visitor: [
      "id",
      "typeParameters",
      "extends",
      ...(isDeclareClass ? ["mixins", "implements"] : []),
      "body",
    ],
    aliases: ["FlowDeclaration", "Statement", "Declaration"],
    fields: {
      id: validateType("Identifier"),
      typeParameters: validateOptionalType("TypeParameterDeclaration"),
      extends: validateOptional(arrayOfType("InterfaceExtends")),
      ...(isDeclareClass
        ? {
            mixins: validateOptional(arrayOfType("InterfaceExtends")),
            implements: validateOptional(arrayOfType("ClassImplements")),
          }
        : {}),
      body: validateType("ObjectTypeAnnotation"),
    },
  });
};

defineType("AnyTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"],
});

defineType("ArrayTypeAnnotation", {
  visitor: ["elementType"],
  aliases: ["FlowType"],
  fields: {
    elementType: validateType("FlowType"),
  },
});

defineType("BooleanTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"],
});

defineType("BooleanLiteralTypeAnnotation", {
  builder: ["value"],
  aliases: ["FlowType"],
  fields: {
    value: validate(assertValueType("boolean")),
  },
});

defineType("NullLiteralTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"],
});

defineType("ClassImplements", {
  visitor: ["id", "typeParameters"],
  fields: {
    id: validateType("Identifier"),
    typeParameters: validateOptionalType("TypeParameterInstantiation"),
  },
});

defineInterfaceishType("DeclareClass");

defineType("DeclareFunction", {
  builder: ["id"],
  visitor: ["id", "predicate"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    id: validateType("Identifier"),
    predicate: validateOptionalType("DeclaredPredicate"),
  },
});

defineInterfaceishType("DeclareInterface");

defineType("DeclareModule", {
  builder: ["id", "body", "kind"],
  visitor: ["id", "body"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    id: validateType("Identifier", "StringLiteral"),
    body: validateType("BlockStatement"),
    kind: validateOptional(assertOneOf("CommonJS", "ES")),
  },
});

defineType("DeclareModuleExports", {
  visitor: ["typeAnnotation"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    typeAnnotation: validateType("TypeAnnotation"),
  },
});

defineType("DeclareTypeAlias", {
  visitor: ["id", "typeParameters", "right"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    id: validateType("Identifier"),
    typeParameters: validateOptionalType("TypeParameterDeclaration"),
    right: validateType("FlowType"),
  },
});

defineType("DeclareOpaqueType", {
  visitor: ["id", "typeParameters", "supertype"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    id: validateType("Identifier"),
    typeParameters: validateOptionalType("TypeParameterDeclaration"),
    supertype: validateOptionalType("FlowType"),
    impltype: validateOptionalType("FlowType"),
  },
});

defineType("DeclareVariable", {
  visitor: ["id"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    id: validateType("Identifier"),
  },
});

defineType("DeclareExportDeclaration", {
  visitor: ["declaration", "specifiers", "source", "attributes"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    declaration: validateOptionalType("Flow"),
    specifiers: validateOptional(
      arrayOfType("ExportSpecifier", "ExportNamespaceSpecifier"),
    ),
    source: validateOptionalType("StringLiteral"),
    default: validateOptional(assertValueType("boolean")),
    ...importAttributes,
  },
});

defineType("DeclareExportAllDeclaration", {
  visitor: ["source", "attributes"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    source: validateType("StringLiteral"),
    exportKind: validateOptional(assertOneOf("type", "value")),
    ...importAttributes,
  },
});

defineType("DeclaredPredicate", {
  visitor: ["value"],
  aliases: ["FlowPredicate"],
  fields: {
    value: validateType("Flow"),
  },
});

defineType("ExistsTypeAnnotation", {
  aliases: ["FlowType"],
});

defineType("FunctionTypeAnnotation", {
  builder: ["typeParameters", "params", "rest", "returnType"],
  visitor: ["typeParameters", "this", "params", "rest", "returnType"],
  aliases: ["FlowType"],
  fields: {
    typeParameters: validateOptionalType("TypeParameterDeclaration"),
    params: validateArrayOfType("FunctionTypeParam"),
    rest: validateOptionalType("FunctionTypeParam"),
    this: validateOptionalType("FunctionTypeParam"),
    returnType: validateType("FlowType"),
  },
});

defineType("FunctionTypeParam", {
  visitor: ["name", "typeAnnotation"],
  fields: {
    name: validateOptionalType("Identifier"),
    typeAnnotation: validateType("FlowType"),
    optional: validateOptional(assertValueType("boolean")),
  },
});

defineType("GenericTypeAnnotation", {
  visitor: ["id", "typeParameters"],
  aliases: ["FlowType"],
  fields: {
    id: validateType("Identifier", "QualifiedTypeIdentifier"),
    typeParameters: validateOptionalType("TypeParameterInstantiation"),
  },
});

defineType("InferredPredicate", {
  aliases: ["FlowPredicate"],
});

defineType("InterfaceExtends", {
  visitor: ["id", "typeParameters"],
  fields: {
    id: validateType("Identifier", "QualifiedTypeIdentifier"),
    typeParameters: validateOptionalType("TypeParameterInstantiation"),
  },
});

defineInterfaceishType("InterfaceDeclaration");

defineType("InterfaceTypeAnnotation", {
  visitor: ["extends", "body"],
  aliases: ["FlowType"],
  fields: {
    extends: validateOptional(arrayOfType("InterfaceExtends")),
    body: validateType("ObjectTypeAnnotation"),
  },
});

defineType("IntersectionTypeAnnotation", {
  visitor: ["types"],
  aliases: ["FlowType"],
  fields: {
    types: validate(arrayOfType("FlowType")),
  },
});

defineType("MixedTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"],
});

defineType("EmptyTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"],
});

defineType("NullableTypeAnnotation", {
  visitor: ["typeAnnotation"],
  aliases: ["FlowType"],
  fields: {
    typeAnnotation: validateType("FlowType"),
  },
});

defineType("NumberLiteralTypeAnnotation", {
  builder: ["value"],
  aliases: ["FlowType"],
  fields: {
    value: validate(assertValueType("number")),
  },
});

defineType("NumberTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"],
});

defineType("ObjectTypeAnnotation", {
  visitor: ["properties", "indexers", "callProperties", "internalSlots"],
  aliases: ["FlowType"],
  builder: [
    "properties",
    "indexers",
    "callProperties",
    "internalSlots",
    "exact",
  ],
  fields: {
    properties: validate(
      arrayOfType("ObjectTypeProperty", "ObjectTypeSpreadProperty"),
    ),
    indexers: {
      validate: arrayOfType("ObjectTypeIndexer"),
      optional: process.env.BABEL_8_BREAKING ? false : true,
      default: [],
    },
    callProperties: {
      validate: arrayOfType("ObjectTypeCallProperty"),
      optional: process.env.BABEL_8_BREAKING ? false : true,
      default: [],
    },
    internalSlots: {
      validate: arrayOfType("ObjectTypeInternalSlot"),
      optional: process.env.BABEL_8_BREAKING ? false : true,
      default: [],
    },
    exact: {
      validate: assertValueType("boolean"),
      default: false,
    },
    // If the inexact flag is present then this is an object type, and not a
    // declare class, declare interface, or interface. If it is true, the
    // object uses ... to express that it is inexact.
    inexact: validateOptional(assertValueType("boolean")),
  },
});

defineType("ObjectTypeInternalSlot", {
  visitor: ["id", "value"],
  builder: ["id", "value", "optional", "static", "method"],
  aliases: ["UserWhitespacable"],
  fields: {
    id: validateType("Identifier"),
    value: validateType("FlowType"),
    optional: validate(assertValueType("boolean")),
    static: validate(assertValueType("boolean")),
    method: validate(assertValueType("boolean")),
  },
});

defineType("ObjectTypeCallProperty", {
  visitor: ["value"],
  aliases: ["UserWhitespacable"],
  fields: {
    value: validateType("FlowType"),
    static: validate(assertValueType("boolean")),
  },
});

defineType("ObjectTypeIndexer", {
  visitor: ["variance", "id", "key", "value"],
  builder: ["id", "key", "value", "variance"],
  aliases: ["UserWhitespacable"],
  fields: {
    id: validateOptionalType("Identifier"),
    key: validateType("FlowType"),
    value: validateType("FlowType"),
    static: validate(assertValueType("boolean")),
    variance: validateOptionalType("Variance"),
  },
});

defineType("ObjectTypeProperty", {
  visitor: ["key", "value", "variance"],
  aliases: ["UserWhitespacable"],
  fields: {
    key: validateType("Identifier", "StringLiteral"),
    value: validateType("FlowType"),
    kind: validate(assertOneOf("init", "get", "set")),
    static: validate(assertValueType("boolean")),
    proto: validate(assertValueType("boolean")),
    optional: validate(assertValueType("boolean")),
    variance: validateOptionalType("Variance"),
    method: validate(assertValueType("boolean")),
  },
});

defineType("ObjectTypeSpreadProperty", {
  visitor: ["argument"],
  aliases: ["UserWhitespacable"],
  fields: {
    argument: validateType("FlowType"),
  },
});

defineType("OpaqueType", {
  visitor: ["id", "typeParameters", "supertype", "impltype"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    id: validateType("Identifier"),
    typeParameters: validateOptionalType("TypeParameterDeclaration"),
    supertype: validateOptionalType("FlowType"),
    impltype: validateType("FlowType"),
  },
});

defineType("QualifiedTypeIdentifier", {
  visitor: ["qualification", "id"],
  builder: ["id", "qualification"],
  fields: {
    id: validateType("Identifier"),
    qualification: validateType("Identifier", "QualifiedTypeIdentifier"),
  },
});

defineType("StringLiteralTypeAnnotation", {
  builder: ["value"],
  aliases: ["FlowType"],
  fields: {
    value: validate(assertValueType("string")),
  },
});

defineType("StringTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"],
});

defineType("SymbolTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"],
});

defineType("ThisTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"],
});

defineType("TupleTypeAnnotation", {
  visitor: ["types"],
  aliases: ["FlowType"],
  fields: {
    types: validate(arrayOfType("FlowType")),
  },
});

defineType("TypeofTypeAnnotation", {
  visitor: ["argument"],
  aliases: ["FlowType"],
  fields: {
    argument: validateType("FlowType"),
  },
});

defineType("TypeAlias", {
  visitor: ["id", "typeParameters", "right"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    id: validateType("Identifier"),
    typeParameters: validateOptionalType("TypeParameterDeclaration"),
    right: validateType("FlowType"),
  },
});

defineType("TypeAnnotation", {
  visitor: ["typeAnnotation"],
  fields: {
    typeAnnotation: validateType("FlowType"),
  },
});

defineType("TypeCastExpression", {
  visitor: ["expression", "typeAnnotation"],
  aliases: ["ExpressionWrapper", "Expression"],
  fields: {
    expression: validateType("Expression"),
    typeAnnotation: validateType("TypeAnnotation"),
  },
});

defineType("TypeParameter", {
  visitor: ["bound", "default", "variance"],
  fields: {
    name: validate(assertValueType("string")),
    bound: validateOptionalType("TypeAnnotation"),
    default: validateOptionalType("FlowType"),
    variance: validateOptionalType("Variance"),
  },
});

defineType("TypeParameterDeclaration", {
  visitor: ["params"],
  fields: {
    params: validate(arrayOfType("TypeParameter")),
  },
});

defineType("TypeParameterInstantiation", {
  visitor: ["params"],
  fields: {
    params: validate(arrayOfType("FlowType")),
  },
});

defineType("UnionTypeAnnotation", {
  visitor: ["types"],
  aliases: ["FlowType"],
  fields: {
    types: validate(arrayOfType("FlowType")),
  },
});

defineType("Variance", {
  builder: ["kind"],
  fields: {
    kind: validate(assertOneOf("minus", "plus")),
  },
});

defineType("VoidTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"],
});

// Enums
defineType("EnumDeclaration", {
  aliases: ["Statement", "Declaration"],
  visitor: ["id", "body"],
  fields: {
    id: validateType("Identifier"),
    body: validateType(
      "EnumBooleanBody",
      "EnumNumberBody",
      "EnumStringBody",
      "EnumSymbolBody",
    ),
  },
});

defineType("EnumBooleanBody", {
  aliases: ["EnumBody"],
  visitor: ["members"],
  fields: {
    explicitType: validate(assertValueType("boolean")),
    members: validateArrayOfType("EnumBooleanMember"),
    hasUnknownMembers: validate(assertValueType("boolean")),
  },
});

defineType("EnumNumberBody", {
  aliases: ["EnumBody"],
  visitor: ["members"],
  fields: {
    explicitType: validate(assertValueType("boolean")),
    members: validateArrayOfType("EnumNumberMember"),
    hasUnknownMembers: validate(assertValueType("boolean")),
  },
});

defineType("EnumStringBody", {
  aliases: ["EnumBody"],
  visitor: ["members"],
  fields: {
    explicitType: validate(assertValueType("boolean")),
    members: validateArrayOfType("EnumStringMember", "EnumDefaultedMember"),
    hasUnknownMembers: validate(assertValueType("boolean")),
  },
});

defineType("EnumSymbolBody", {
  aliases: ["EnumBody"],
  visitor: ["members"],
  fields: {
    members: validateArrayOfType("EnumDefaultedMember"),
    hasUnknownMembers: validate(assertValueType("boolean")),
  },
});

defineType("EnumBooleanMember", {
  aliases: ["EnumMember"],
  builder: ["id"],
  visitor: ["id", "init"],
  fields: {
    id: validateType("Identifier"),
    init: validateType("BooleanLiteral"),
  },
});

defineType("EnumNumberMember", {
  aliases: ["EnumMember"],
  visitor: ["id", "init"],
  fields: {
    id: validateType("Identifier"),
    init: validateType("NumericLiteral"),
  },
});

defineType("EnumStringMember", {
  aliases: ["EnumMember"],
  visitor: ["id", "init"],
  fields: {
    id: validateType("Identifier"),
    init: validateType("StringLiteral"),
  },
});

defineType("EnumDefaultedMember", {
  aliases: ["EnumMember"],
  visitor: ["id"],
  fields: {
    id: validateType("Identifier"),
  },
});

defineType("IndexedAccessType", {
  visitor: ["objectType", "indexType"],
  aliases: ["FlowType"],
  fields: {
    objectType: validateType("FlowType"),
    indexType: validateType("FlowType"),
  },
});

defineType("OptionalIndexedAccessType", {
  visitor: ["objectType", "indexType"],
  aliases: ["FlowType"],
  fields: {
    objectType: validateType("FlowType"),
    indexType: validateType("FlowType"),
    optional: validate(assertValueType("boolean")),
  },
});
