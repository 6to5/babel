import { template, types as t, type NodePath } from "@babel/core";

import { registerGlobalType } from "./global-types.ts";
import { EXPORTED_CONST_ENUMS_IN_NAMESPACE } from "./const-enum.ts";

export function getFirstIdentifier(node: t.TSEntityName): t.Identifier {
  if (t.isIdentifier(node)) {
    return node;
  }
  // In Babel 8 TSEntityName also includes ThisExpression, however, a namespace
  // id must not be a ThisExpression or a TSQualifiedName { left: ThisExpression }.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  return getFirstIdentifier((node as t.TSQualifiedName).left);
}

export default function transpileNamespace(
  path: NodePath<t.TSModuleDeclaration>,
  allowNamespaces: boolean,
) {
  if (path.node.declare || path.node.id.type === "StringLiteral") {
    path.remove();
    return;
  }

  if (!allowNamespaces) {
    throw path
      .get("id")
      .buildCodeFrameError(
        "Namespace not marked type-only declare." +
          " Non-declarative namespaces are only supported experimentally in Babel." +
          " To enable and review caveats see:" +
          " https://babeljs.io/docs/en/babel-plugin-transform-typescript",
      );
  }

  const name = getFirstIdentifier(path.node.id).name;
  const value = handleNested(path, path.node);
  if (value === null) {
    // This means that `path` is a type-only namespace.
    // We call `registerGlobalType` here to allow it to be stripped.
    const program = path.findParent(p => p.isProgram());
    registerGlobalType(program.scope, name);

    path.remove();
  } else if (path.scope.hasOwnBinding(name)) {
    path.replaceWith(value);
  } else {
    path.scope.registerDeclaration(
      path.replaceWithMultiple([getDeclaration(name), value])[0],
    );
  }
}

function getDeclaration(name: string) {
  return t.variableDeclaration("let", [
    t.variableDeclarator(t.identifier(name)),
  ]);
}

function getMemberExpression(name: string, itemName: string) {
  return t.memberExpression(t.identifier(name), t.identifier(itemName));
}

/**
 * Convert export const foo = 1 to Namespace.foo = 1;
 *
 * @param {t.VariableDeclaration} node given variable declaration, e.g. `const foo = 1`
 * @param {string} name the generated unique namespace member name
 * @param {*} hub An instance implements HubInterface defined in `@babel/traverse` that can throw a code frame error
 */
function handleVariableDeclaration(
  node: t.VariableDeclaration,
  name: string,
  hub: any,
): t.Statement[] {
  if (node.kind !== "const") {
    throw hub.file.buildCodeFrameError(
      node,
      "Namespaces exporting non-const are not supported by Babel." +
        " Change to const or see:" +
        " https://babeljs.io/docs/en/babel-plugin-transform-typescript",
    );
  }
  const { declarations } = node;
  if (
    declarations.every(
      (declarator): declarator is t.VariableDeclarator & { id: t.Identifier } =>
        t.isIdentifier(declarator.id),
    )
  ) {
    // `export const a = 1` transforms to `const a = N.a = 1`, the output
    // is smaller than `const a = 1; N.a = a`;
    for (const declarator of declarations) {
      declarator.init = t.assignmentExpression(
        "=",
        getMemberExpression(name, declarator.id.name),
        declarator.init,
      );
    }
    return [node];
  }
  // Now we have pattern in declarators
  // `export const [a] = 1` transforms to `const [a] = 1; N.a = a`
  const bindingIdentifiers = t.getBindingIdentifiers(node);
  const assignments = [];
  // getBindingIdentifiers returns an object without prototype.
  // eslint-disable-next-line guard-for-in
  for (const idName in bindingIdentifiers) {
    assignments.push(
      t.assignmentExpression(
        "=",
        getMemberExpression(name, idName),
        t.cloneNode(bindingIdentifiers[idName]),
      ),
    );
  }
  return [node, t.expressionStatement(t.sequenceExpression(assignments))];
}

function buildNestedAmbientModuleError(path: NodePath, node: t.Node) {
  return path.hub.buildError(
    node,
    "Ambient modules cannot be nested in other modules or namespaces.",
    Error,
  );
}

function handleNested(
  path: NodePath,
  node: t.TSModuleDeclaration,
  parentExport?: t.Expression,
): t.Statement | null {
  const names = new Set();
  const realName =
    !process.env.BABEL_8_BREAKING || t.isIdentifier(node.id)
      ? (node.id as t.Identifier)
      : getFirstIdentifier(node.id as unknown as t.TSQualifiedName);

  const name = path.scope.generateUid(realName.name);

  const body = node.body;
  let id = node.id;
  let namespaceTopLevel: t.Statement[];
  if (process.env.BABEL_8_BREAKING) {
    if (t.isTSQualifiedName(id)) {
      // @ts-ignore(Babel 7 vs Babel 8) Babel 8 AST shape
      namespaceTopLevel = body.body;
      while (t.isTSQualifiedName(id)) {
        namespaceTopLevel = [
          t.exportNamedDeclaration(
            t.tsModuleDeclaration(
              // @ts-ignore(Babel 7 vs Babel 8) Babel 8 AST shape
              t.cloneNode(id.right),
              t.tsModuleBlock(namespaceTopLevel),
            ),
          ),
        ];

        // @ts-ignore(Babel 7 vs Babel 8) Babel 8 AST shape
        id = id.left;
      }
    } else {
      // @ts-ignore(Babel 7 vs Babel 8) Babel 8 AST shape
      namespaceTopLevel = body.body;
    }
  } else {
    namespaceTopLevel = t.isTSModuleBlock(body)
      ? body.body
      : // We handle `namespace X.Y {}` as if it was
        //   namespace X {
        //     export namespace Y {}
        //   }
        [t.exportNamedDeclaration(body)];
  }

  let isEmpty = true;

  for (let i = 0; i < namespaceTopLevel.length; i++) {
    const subNode = namespaceTopLevel[i];

    // The first switch is mainly to detect name usage. Only export
    // declarations require further transformation.
    switch (subNode.type) {
      case "TSModuleDeclaration": {
        if (!t.isIdentifier(subNode.id)) {
          throw buildNestedAmbientModuleError(path, subNode);
        }

        const transformed = handleNested(path, subNode);
        if (transformed !== null) {
          isEmpty = false;
          const moduleName = subNode.id.name;
          if (names.has(moduleName)) {
            namespaceTopLevel[i] = transformed;
          } else {
            names.add(moduleName);
            namespaceTopLevel.splice(
              i++,
              1,
              getDeclaration(moduleName),
              transformed,
            );
          }
        }
        continue;
      }
      case "TSEnumDeclaration":
      case "FunctionDeclaration":
      case "ClassDeclaration":
        isEmpty = false;
        names.add(subNode.id.name);
        continue;
      case "VariableDeclaration": {
        isEmpty = false;
        // getBindingIdentifiers returns an object without prototype.
        // eslint-disable-next-line guard-for-in
        for (const name in t.getBindingIdentifiers(subNode)) {
          names.add(name);
        }
        continue;
      }
      default:
        isEmpty &&= t.isTypeScript(subNode);
        // Neither named declaration nor export, continue to next item.
        continue;
      case "ExportNamedDeclaration":
      // Export declarations get parsed using the next switch.
    }

    if ("declare" in subNode.declaration && subNode.declaration.declare) {
      continue;
    }

    // Transform the export declarations that occur inside of a namespace.
    switch (subNode.declaration.type) {
      case "TSEnumDeclaration":
        EXPORTED_CONST_ENUMS_IN_NAMESPACE.add(subNode.declaration);
      // fallthrough
      case "FunctionDeclaration":
      case "ClassDeclaration": {
        isEmpty = false;
        const itemName = subNode.declaration.id.name;
        names.add(itemName);
        namespaceTopLevel.splice(
          i++,
          1,
          subNode.declaration,
          t.expressionStatement(
            t.assignmentExpression(
              "=",
              getMemberExpression(name, itemName),
              t.identifier(itemName),
            ),
          ),
        );
        break;
      }
      case "VariableDeclaration": {
        isEmpty = false;
        const nodes = handleVariableDeclaration(
          subNode.declaration,
          name,
          path.hub,
        );
        namespaceTopLevel.splice(i, nodes.length, ...nodes);
        i += nodes.length - 1;
        break;
      }
      case "TSModuleDeclaration": {
        if (!t.isIdentifier(subNode.declaration.id)) {
          throw buildNestedAmbientModuleError(path, subNode.declaration);
        }

        const transformed = handleNested(
          path,
          subNode.declaration,
          t.identifier(name),
        );
        if (transformed !== null) {
          isEmpty = false;
          const moduleName = subNode.declaration.id.name;
          if (names.has(moduleName)) {
            namespaceTopLevel[i] = transformed;
          } else {
            names.add(moduleName);
            namespaceTopLevel.splice(
              i++,
              1,
              getDeclaration(moduleName),
              transformed,
            );
          }
        } else {
          namespaceTopLevel.splice(i, 1);
          i--;
        }
      }
    }
  }

  if (isEmpty) return null;

  // {}
  let fallthroughValue: t.Expression = t.objectExpression([]);

  if (parentExport) {
    const memberExpr = t.memberExpression(parentExport, realName);
    fallthroughValue = template.expression.ast`
      ${t.cloneNode(memberExpr)} ||
        (${t.cloneNode(memberExpr)} = ${fallthroughValue})
    `;
  }

  return template.statement.ast`
    (function (${t.identifier(name)}) {
      ${namespaceTopLevel}
    })(${realName} || (${t.cloneNode(realName)} = ${fallthroughValue}));
  `;
}
