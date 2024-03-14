import { declare } from "@babel/helper-plugin-utils";
import {
  isModule,
  rewriteModuleStatementsAndPrepareHeader,
  type RewriteModuleStatementsAndPrepareHeaderOptions,
  isSideEffectImport,
  buildNamespaceInitStatements,
  ensureStatementsHoisted,
  wrapInterop,
  getModuleName,
  addPrivateHelper,
} from "@babel/helper-module-transforms";
import simplifyAccess from "@babel/helper-simple-access";
import { template, types as t, type PluginPass } from "@babel/core";
import type { PluginOptions } from "@babel/helper-module-transforms";
import type { Visitor, Scope, NodePath } from "@babel/traverse";

import { transformDynamicImport } from "./dynamic-import.ts";
import { lazyImportsHook } from "./lazy.ts";

import { defineCommonJSHook, makeInvokers } from "./hooks.ts";
export { defineCommonJSHook };

export interface Options extends PluginOptions {
  allowCommonJSExports?: boolean;
  allowTopLevelThis?: boolean;
  importInterop?: RewriteModuleStatementsAndPrepareHeaderOptions["importInterop"];
  lazy?: RewriteModuleStatementsAndPrepareHeaderOptions["lazy"];
  loose?: boolean;
  mjsStrictNamespace?: boolean;
  noInterop?: boolean;
  strict?: boolean;
  strictMode?: boolean;
  strictNamespace?: boolean;
}

export default declare((api, options: Options) => {
  api.assertVersion(REQUIRED_VERSION(7));

  const {
    // 'true' for imports to strictly have .default, instead of having
    // destructuring-like behavior for their properties. This matches the behavior
    // of the initial Node.js (v12) behavior when importing a CommonJS without
    // the __esMoule property.
    // .strictNamespace is for non-mjs files, mjsStrictNamespace if for mjs files.
    strictNamespace = false,
    mjsStrictNamespace = strictNamespace,

    allowTopLevelThis,
    strict,
    strictMode,
    noInterop,
    importInterop,
    lazy = false,
    // Defaulting to 'true' for now. May change before 7.x major.
    allowCommonJSExports = true,
    loose = false,
  } = options;

  const constantReexports = api.assumption("constantReexports") ?? loose;
  const enumerableModuleMeta = api.assumption("enumerableModuleMeta") ?? loose;
  const noIncompleteNsImportDetection =
    api.assumption("noIncompleteNsImportDetection") ?? false;

  if (
    typeof lazy !== "boolean" &&
    typeof lazy !== "function" &&
    (!Array.isArray(lazy) || !lazy.every(item => typeof item === "string"))
  ) {
    throw new Error(`.lazy must be a boolean, array of strings, or a function`);
  }

  if (typeof strictNamespace !== "boolean") {
    throw new Error(`.strictNamespace must be a boolean, or undefined`);
  }
  if (typeof mjsStrictNamespace !== "boolean") {
    throw new Error(`.mjsStrictNamespace must be a boolean, or undefined`);
  }

  const getAssertion = (localName: string) => template.expression.ast`
    (function(){
      throw new Error(
        "The CommonJS '" + "${localName}" + "' variable is not available in ES6 modules." +
        "Consider setting setting sourceType:script or sourceType:unambiguous in your " +
        "Babel config for this file.");
    })()
  `;

  const moduleExportsVisitor: Visitor<{ scope: Scope }> = {
    ReferencedIdentifier(path) {
      const localName = path.node.name;
      if (localName !== "module" && localName !== "exports") return;

      const localBinding = path.scope.getBinding(localName);
      const rootBinding = this.scope.getBinding(localName);

      if (
        // redeclared in this scope
        rootBinding !== localBinding ||
        (path.parentPath.isObjectProperty({ value: path.node }) &&
          path.parentPath.parentPath.isObjectPattern()) ||
        path.parentPath.isAssignmentExpression({ left: path.node }) ||
        path.isAssignmentExpression({ left: path.node })
      ) {
        return;
      }

      path.replaceWith(getAssertion(localName));
    },

    UpdateExpression(path) {
      const arg = path.get("argument");
      if (!arg.isIdentifier()) return;
      const localName = arg.node.name;
      if (localName !== "module" && localName !== "exports") return;

      const localBinding = path.scope.getBinding(localName);
      const rootBinding = this.scope.getBinding(localName);

      // redeclared in this scope
      if (rootBinding !== localBinding) return;

      path.replaceWith(
        t.assignmentExpression(
          path.node.operator[0] + "=",
          arg.node,
          getAssertion(localName),
        ),
      );
    },

    AssignmentExpression(path) {
      const left = path.get("left");
      if (left.isIdentifier()) {
        const localName = left.node.name;
        if (localName !== "module" && localName !== "exports") return;

        const localBinding = path.scope.getBinding(localName);
        const rootBinding = this.scope.getBinding(localName);

        // redeclared in this scope
        if (rootBinding !== localBinding) return;

        const right = path.get("right");
        right.replaceWith(
          t.sequenceExpression([right.node, getAssertion(localName)]),
        );
      } else if (left.isPattern()) {
        const ids = left.getOuterBindingIdentifiers();
        const localName = Object.keys(ids).filter(localName => {
          if (localName !== "module" && localName !== "exports") return false;

          return (
            this.scope.getBinding(localName) ===
            path.scope.getBinding(localName)
          );
        })[0];

        if (localName) {
          const right = path.get("right");
          right.replaceWith(
            t.sequenceExpression([right.node, getAssertion(localName)]),
          );
        }
      }
    },
  };

  return {
    name: "transform-modules-commonjs",

    pre() {
      this.file.set("@babel/plugin-transform-modules-*", "commonjs");

      if (lazy) defineCommonJSHook(this.file, lazyImportsHook(lazy));
    },

    visitor: {
      ["CallExpression" +
        (api.types.importExpression ? "|ImportExpression" : "")](
        this: PluginPass,
        path: NodePath<t.CallExpression | t.ImportExpression>,
      ) {
        if (!this.file.has("@babel/plugin-proposal-dynamic-import")) return;
        if (path.isCallExpression() && !t.isImport(path.node.callee)) return;

        let { scope } = path;
        do {
          scope.rename("require");
        } while ((scope = scope.parent));

        transformDynamicImport(path, noInterop, this.file);
      },

      Program: {
        exit(path, state) {
          if (!isModule(path)) return;

          // Rename the bindings auto-injected into the scope so there is no
          // risk of conflict between the bindings.
          path.scope.rename("exports");
          path.scope.rename("module");
          path.scope.rename("require");
          path.scope.rename("__filename");
          path.scope.rename("__dirname");

          // Rewrite references to 'module' and 'exports' to throw exceptions.
          // These objects are specific to CommonJS and are not available in
          // real ES6 implementations.
          if (!allowCommonJSExports) {
            if (process.env.BABEL_8_BREAKING) {
              simplifyAccess(path, new Set(["module", "exports"]));
            } else {
              // @ts-ignore(Babel 7 vs Babel 8) The third param has been removed in Babel 8.
              simplifyAccess(path, new Set(["module", "exports"]), false);
            }
            path.traverse(moduleExportsVisitor, {
              scope: path.scope,
            });
          }

          let moduleName = getModuleName(this.file.opts, options);
          // @ts-expect-error todo(flow->ts): do not reuse variables
          if (moduleName) moduleName = t.stringLiteral(moduleName);

          const hooks = makeInvokers(this.file);

          const { meta, headers, namedReexports } =
            rewriteModuleStatementsAndPrepareHeader(path, {
              implicitAssignmentExports: lazy ? undefined : false,
              exportName: "exports",
              constantReexports,
              enumerableModuleMeta,
              strict,
              strictMode,
              allowTopLevelThis,
              noInterop,
              importInterop,
              wrapReference: hooks.wrapReference,
              getWrapperPayload: hooks.getWrapperPayload,
              esNamespaceOnly:
                typeof state.filename === "string" &&
                /\.mjs$/.test(state.filename)
                  ? mjsStrictNamespace
                  : strictNamespace,
              noIncompleteNsImportDetection,
              filename: this.file.opts.filename,
            });

          const interopTypes = new Map<number, t.CallExpression>();
          const exportStarFnBody = t.blockStatement([]);
          let exportStarBody: t.Statement[];

          let interopTypeId: t.Identifier;
          let lastInteropType: number;

          const hasExportStar = path.scope.hasBinding("__exportStar");

          for (const [source, metadata] of meta.source) {
            const loadExpr = t.callExpression(t.identifier("require"), [
              t.stringLiteral(source),
            ]);

            if (metadata.reexportAll && !lazy && !hasExportStar) {
              const interopType = (
                {
                  none: 0,
                  "node-default": 0,
                  namespace: 1,
                  "node-namespace": 2,
                  default: 3,
                } as const
              )[metadata.interop];

              if (lastInteropType !== interopType) {
                if (lastInteropType != null) {
                  if (!interopTypeId) {
                    interopTypeId = path.scope.generateUidIdentifier("interop");
                    path.scope.push({
                      id: interopTypeId,
                      kind: "var",
                    });
                  }
                  headers.push(
                    t.expressionStatement(
                      t.assignmentExpression(
                        "=",
                        t.cloneNode(interopTypeId),
                        t.numericLiteral(interopType),
                      ),
                    ),
                  );
                }
                lastInteropType = interopType;
              }

              headers.push(
                ...buildNamespaceInitStatements(
                  meta,
                  metadata,
                  constantReexports,
                  hooks.wrapReference,
                  body => {
                    exportStarBody ??= body;

                    if (interopType && !interopTypes.has(interopType)) {
                      interopTypes.set(
                        interopType,
                        wrapInterop(
                          path,
                          t.identifier("mod"),
                          metadata.interop,
                        ),
                      );
                    }

                    const exportStarHelper = addPrivateHelper(
                      path,
                      "_exportStar",
                      () =>
                        t.functionExpression(
                          null,
                          [t.identifier("mod")],
                          exportStarFnBody,
                        ),
                    );
                    const interopRequire = t.callExpression(exportStarHelper, [
                      loadExpr,
                    ]);
                    interopRequire.loc = metadata.loc;

                    if (
                      metadata.importsNamespace.size ||
                      metadata.imports.size ||
                      metadata.reexports.size ||
                      metadata.reexportNamespace.size
                    ) {
                      return t.variableDeclaration("var", [
                        t.variableDeclarator(
                          t.identifier(metadata.name),
                          interopRequire,
                        ),
                      ]);
                    } else {
                      return t.expressionStatement(interopRequire);
                    }
                  },
                ),
              );
            } else {
              let header: t.Statement;
              if (isSideEffectImport(metadata)) {
                if (lazy && metadata.wrap === "function") {
                  throw new Error("Assertion failure");
                }

                header = t.expressionStatement(loadExpr);
              } else {
                const init =
                  wrapInterop(path, loadExpr, metadata.interop) || loadExpr;

                if (metadata.wrap) {
                  const res = hooks.buildRequireWrapper(
                    metadata.name,
                    init,
                    metadata.wrap,
                    metadata.referenced,
                  );
                  if (res === false) continue;
                  else header = res;
                }
                header ??= template.statement.ast`
                var ${metadata.name} = ${init};
              `;
              }
              header.loc = metadata.loc;

              headers.push(header);
              headers.push(
                ...buildNamespaceInitStatements(
                  meta,
                  metadata,
                  constantReexports,
                  hooks.wrapReference,
                ),
              );
            }
          }

          if (exportStarBody) {
            let cond: t.Identifier | t.ConditionalExpression =
              t.identifier("mod");

            if (interopTypeId) {
              interopTypes.forEach((call, type) => {
                cond = t.conditionalExpression(
                  t.binaryExpression(
                    "==",
                    t.cloneNode(interopTypeId),
                    t.numericLiteral(type),
                  ),
                  call,
                  cond,
                );
              });

              exportStarFnBody.body.push(
                t.expressionStatement(
                  t.assignmentExpression("=", t.identifier("mod"), cond),
                ),
              );
            } else if (lastInteropType) {
              exportStarFnBody.body.push(
                t.expressionStatement(
                  t.assignmentExpression(
                    "=",
                    t.identifier("mod"),
                    interopTypes.get(lastInteropType),
                  ),
                ),
              );
            }
            exportStarFnBody.body.push(...exportStarBody);
          }

          const newHeaders = headers
            .filter(header => !namedReexports.has(header as any))
            .concat(Array.from(namedReexports.values()));

          ensureStatementsHoisted(newHeaders);
          path.unshiftContainer("body", newHeaders);
          path.get("body").forEach(path => {
            if (newHeaders.indexOf(path.node) === -1) return;
            if (path.isVariableDeclaration()) {
              path.scope.registerDeclaration(path);
            }
          });
        },
      },
    },
  };
});
