import t from "../../lib/index.js";
import stringifyValidator from "../utils/stringifyValidator.js";

export default function generateAstTypes() {
  let code = `// NOTE: This file is autogenerated. Do not modify.
// See packages/babel-types/scripts/generators/ast-types.js for script used.

interface BaseComment {
  value: string;
  start?: number;
  end?: number;
  loc?: SourceLocation;
  type: "CommentBlock" | "CommentLine";
}

export interface CommentBlock extends BaseComment {
  type: "CommentBlock";
}

export interface CommentLine extends BaseComment {
  type: "CommentLine";
}

export type Comment = CommentBlock | CommentLine;

export interface SourceLocation {
  start: {
    line: number;
    column: number;
  };

  end: {
    line: number;
    column: number;
  };
}

interface BaseNode {
  type: Node["type"];
  leadingComments?: Comment[] | null;
  innerComments?: Comment[] | null;
  trailingComments?: Comment[] | null;
  start?: number | null;
  end?: number | null;
  loc?: SourceLocation | null;
  range?: [number, number];
  extra?: Record<string, unknown>;
}

export type CommentTypeShorthand = "leading" | "inner" | "trailing";

export type Node = ${t.TYPES.filter(k => !t.FLIPPED_ALIAS_KEYS[k])
    .sort()
    .join(" | ")};\n\n`;

  const deprecatedAlias = {};
  for (const type in t.DEPRECATED_KEYS) {
    deprecatedAlias[t.DEPRECATED_KEYS[type]] = type;
  }
  for (const type in t.NODE_FIELDS) {
    const fields = t.NODE_FIELDS[type];
    const fieldNames = sortFieldNames(Object.keys(t.NODE_FIELDS[type]), type);
    const struct = [];

    fieldNames.forEach(fieldName => {
      const field = fields[fieldName];
      // Future / annoying TODO:
      // MemberExpression.property, ObjectProperty.key and ObjectMethod.key need special cases; either:
      // - convert the declaration to chain() like ClassProperty.key and ClassMethod.key,
      // - declare an alias type for valid keys, detect the case and reuse it here,
      // - declare a disjoint union with, for example, ObjectPropertyBase,
      //   ObjectPropertyLiteralKey and ObjectPropertyComputedKey, and declare ObjectProperty
      //   as "ObjectPropertyBase & (ObjectPropertyLiteralKey | ObjectPropertyComputedKey)"
      let typeAnnotation = stringifyValidator(field.validate, "");

      if (isNullable(field) && !hasDefault(field)) {
        typeAnnotation += " | null";
      }

      const alphaNumeric = /^\w+$/;
      const optional = field.optional ? "?" : "";

      if (t.isValidIdentifier(fieldName) || alphaNumeric.test(fieldName)) {
        struct.push(`${fieldName}${optional}: ${typeAnnotation};`);
      } else {
        struct.push(`"${fieldName}"${optional}: ${typeAnnotation};`);
      }
    });

    code += `export interface ${type} extends BaseNode {
  type: "${type}";
  ${struct.join("\n  ").trim()}
}\n\n`;

    if (deprecatedAlias[type]) {
      code += `/**
 * @deprecated Use \`${type}\`
 */
export interface ${deprecatedAlias[type]} extends BaseNode {
  type: "${deprecatedAlias[type]}";
  ${struct.join("\n  ").trim()}
}\n\n
`;
    }
  }

  for (const type in t.FLIPPED_ALIAS_KEYS) {
    const types = t.FLIPPED_ALIAS_KEYS[type];
    code += `export type ${type} = ${types
      .map(type => `${type}`)
      .join(" | ")};\n`;
  }
  code += "\n";

  code += "export interface Aliases {\n";
  for (const type in t.FLIPPED_ALIAS_KEYS) {
    code += `  ${type}: ${type};\n`;
  }
  code += "}\n\n";
  code += `export type DeprecatedAliases = ${Object.keys(
    t.DEPRECATED_KEYS
  ).join(" | ")}\n\n`;

  return code;
}

function hasDefault(field) {
  return field.default != null;
}

function isNullable(field) {
  return field.optional || hasDefault(field);
}

function sortFieldNames(fields, type) {
  return fields.sort((fieldA, fieldB) => {
    const indexA = t.BUILDER_KEYS[type].indexOf(fieldA);
    const indexB = t.BUILDER_KEYS[type].indexOf(fieldB);
    if (indexA === indexB) return fieldA < fieldB ? -1 : 1;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
}
