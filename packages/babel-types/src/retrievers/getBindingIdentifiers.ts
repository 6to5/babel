import {
  isExportDeclaration,
  isIdentifier,
  isClassExpression,
  isDeclaration,
  isFunctionDeclaration,
  isFunctionExpression,
  isExportAllDeclaration,
  isAssignmentExpression,
  isUnaryExpression,
  isUpdateExpression,
} from "../validators/generated/index.ts";
import type * as t from "../index.ts";

export { getBindingIdentifiers as default };

function getBindingIdentifiers(
  node: t.Node,
  duplicates: true,
  outerOnly?: boolean,
  newBindingsOnly?: boolean,
): Record<string, Array<t.Identifier>>;

function getBindingIdentifiers(
  node: t.Node,
  duplicates?: false,
  outerOnly?: boolean,
  newBindingsOnly?: boolean,
): Record<string, t.Identifier>;

function getBindingIdentifiers(
  node: t.Node,
  duplicates?: boolean,
  outerOnly?: boolean,
  newBindingsOnly?: boolean,
): Record<string, t.Identifier> | Record<string, Array<t.Identifier>>;

/**
 * Return a list of binding identifiers associated with the input `node`.
 */
function getBindingIdentifiers(
  node: t.Node,
  duplicates?: boolean,
  outerOnly?: boolean,
  newBindingsOnly?: boolean,
): Record<string, t.Identifier> | Record<string, Array<t.Identifier>> {
  const search: t.Node[] = [].concat(node);
  const ids = Object.create(null);

  while (search.length) {
    const id = search.shift();
    if (!id) continue;

    if (
      newBindingsOnly &&
      // These nodes do not introduce _new_ bindings, but they are included
      // in getBindingIdentifiers.keys for backwards compatibility.
      // TODO(@nicolo-ribaudo): Check if we can remove them from .keys in a
      // backward-compatible way, and if not what we need to do to remove them
      // in Babel 8.
      (isAssignmentExpression(id) ||
        isUnaryExpression(id) ||
        isUpdateExpression(id))
    ) {
      continue;
    }

    if (isIdentifier(id)) {
      if (duplicates) {
        const _ids = (ids[id.name] = ids[id.name] || []);
        _ids.push(id);
      } else {
        ids[id.name] = id;
      }
      continue;
    }

    if (isExportDeclaration(id) && !isExportAllDeclaration(id)) {
      if (isDeclaration(id.declaration)) {
        search.push(id.declaration);
      }
      continue;
    }

    if (outerOnly) {
      if (isFunctionDeclaration(id)) {
        search.push(id.id);
        continue;
      }

      if (
        isFunctionExpression(id) ||
        (process.env.BABEL_8_BREAKING && isClassExpression(id))
      ) {
        continue;
      }
    }

    const keys = getBindingIdentifiers.keys[id.type];

    if (keys) {
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const nodes =
          // @ts-expect-error key must present in id
          id[key] as t.Node[] | t.Node | undefined | null;
        if (nodes) {
          if (Array.isArray(nodes)) {
            search.push(...nodes);
          } else {
            search.push(nodes);
          }
        }
      }
    }
  }
  return ids;
}

/**
 * Mapping of types to their identifier keys.
 */
type KeysMap = {
  [N in t.Node as N["type"]]?: (keyof N)[];
};

const keys: KeysMap = {
  DeclareClass: ["id"],
  DeclareFunction: ["id"],
  DeclareModule: ["id"],
  DeclareVariable: ["id"],
  DeclareInterface: ["id"],
  DeclareTypeAlias: ["id"],
  DeclareOpaqueType: ["id"],
  InterfaceDeclaration: ["id"],
  TypeAlias: ["id"],
  OpaqueType: ["id"],

  CatchClause: ["param"],
  LabeledStatement: ["label"],
  UnaryExpression: ["argument"],
  AssignmentExpression: ["left"],

  ImportSpecifier: ["local"],
  ImportNamespaceSpecifier: ["local"],
  ImportDefaultSpecifier: ["local"],
  ImportDeclaration: ["specifiers"],
  TSImportEqualsDeclaration: ["id"],

  ExportSpecifier: ["exported"],
  ExportNamespaceSpecifier: ["exported"],
  ExportDefaultSpecifier: ["exported"],

  FunctionDeclaration: ["id", "params"],
  FunctionExpression: ["id", "params"],
  ArrowFunctionExpression: ["params"],
  ObjectMethod: ["params"],
  ClassMethod: ["params"],
  ClassPrivateMethod: ["params"],

  ForInStatement: ["left"],
  ForOfStatement: ["left"],

  ClassDeclaration: ["id"],
  ClassExpression: ["id"],

  RestElement: ["argument"],
  UpdateExpression: ["argument"],

  ObjectProperty: ["value"],

  AssignmentPattern: ["left"],
  ArrayPattern: ["elements"],
  ObjectPattern: ["properties"],

  VariableDeclaration: ["declarations"],
  VariableDeclarator: ["id"],
};

getBindingIdentifiers.keys = keys;
