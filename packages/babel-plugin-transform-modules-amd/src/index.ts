import { declare } from "@babel/helper-plugin-utils";
import {
  buildDynamicImport,
  isModule,
  rewriteModuleStatementsAndPrepareHeader,
  type RewriteModuleStatementsAndPrepareHeaderOptions,
  hasExports,
  isSideEffectImport,
  buildNamespaceInitStatements,
  ensureStatementsHoisted,
  wrapInterop,
  getModuleName,
} from "@babel/helper-module-transforms";
import { template, types as t, type PluginPass } from "@babel/core";
import type { PluginOptions } from "@babel/helper-module-transforms";
import type { NodePath } from "@babel/traverse";

const buildWrapper = template.statement(`
  define(MODULE_NAME, AMD_ARGUMENTS, function(IMPORT_NAMES) {
  })
`);

const buildAnonymousWrapper = template.statement(`
  define(["require"], function(REQUIRE) {
  })
`);

function injectWrapper(
  path: NodePath<t.Program>,
  wrapper: t.ExpressionStatement,
) {
  const { body, directives } = path.node;
  path.node.directives = [];
  path.node.body = [];
  const amdFactoryCall = path
    .pushContainer("body", wrapper)[0]
    .get("expression") as NodePath<t.CallExpression>;
  const amdFactoryCallArgs = amdFactoryCall.get("arguments");
  const amdFactory = (
    amdFactoryCallArgs[
      amdFactoryCallArgs.length - 1
    ] as NodePath<t.FunctionExpression>
  ).get("body");
  amdFactory.pushContainer("directives", directives);
  amdFactory.pushContainer("body", body);
}

export interface Options extends PluginOptions {
  allowTopLevelThis?: boolean;
  importInterop?: RewriteModuleStatementsAndPrepareHeaderOptions["importInterop"];
  loose?: boolean;
  noInterop?: boolean;
  strict?: boolean;
  strictMode?: boolean;
}

type State = {
  requireId?: t.Identifier;
  resolveId?: t.Identifier;
  rejectId?: t.Identifier;
};

export default declare<State>((api, options: Options) => {
  api.assertVersion(REQUIRED_VERSION(7));

  const { allowTopLevelThis, strict, strictMode, importInterop, noInterop } =
    options;

  const constantReexports =
    api.assumption("constantReexports") ?? options.loose;
  const enumerableModuleMeta =
    api.assumption("enumerableModuleMeta") ?? options.loose;

  return {
    name: "transform-modules-amd",

    pre() {
      this.file.set("@babel/plugin-transform-modules-*", "amd");
    },

    visitor: {
      ["CallExpression" +
        (api.types.importExpression ? "|ImportExpression" : "")](
        this: State & PluginPass,
        path: NodePath<t.CallExpression | t.ImportExpression>,
        state: State,
      ) {
        if (!this.file.has("@babel/plugin-proposal-dynamic-import")) return;
        if (path.isCallExpression() && !path.get("callee").isImport()) return;

        let { requireId, resolveId, rejectId } = state;
        if (!requireId) {
          requireId = path.scope.generateUidIdentifier("require");
          state.requireId = requireId;
        }
        if (!resolveId || !rejectId) {
          resolveId = path.scope.generateUidIdentifier("resolve");
          rejectId = path.scope.generateUidIdentifier("reject");
          state.resolveId = resolveId;
          state.rejectId = rejectId;
        }

        let result: t.Node = t.identifier("imported");
        if (!noInterop) {
          result = wrapInterop(this.file.path, result, "namespace");
        }

        path.replaceWith(
          buildDynamicImport(
            path.node,
            false,
            false,
            specifier => template.expression.ast`
              new Promise((${resolveId}, ${rejectId}) =>
                ${requireId}(
                  [${specifier}],
                  imported => ${t.cloneNode(resolveId)}(${result}),
                  ${t.cloneNode(rejectId)}
                )
              )
            `,
          ),
        );
      },
      Program: {
        exit(path, { requireId }) {
          if (!isModule(path)) {
            if (requireId) {
              injectWrapper(
                path,
                buildAnonymousWrapper({
                  REQUIRE: t.cloneNode(requireId),
                }) as t.ExpressionStatement,
              );
            }
            return;
          }

          const amdArgs = [];
          const importNames = [];
          if (requireId) {
            amdArgs.push(t.stringLiteral("require"));
            importNames.push(t.cloneNode(requireId));
          }

          let moduleName = getModuleName(this.file.opts, options);
          // @ts-expect-error todo(flow->ts): do not reuse variables
          if (moduleName) moduleName = t.stringLiteral(moduleName);

          const { meta, headers } = rewriteModuleStatementsAndPrepareHeader(
            path,
            {
              implicitAssignmentExports: true,
              enumerableModuleMeta,
              constantReexports,
              strict,
              strictMode,
              allowTopLevelThis,
              importInterop,
              noInterop,
              filename: this.file.opts.filename,
            },
          );

          if (hasExports(meta)) {
            amdArgs.push(t.stringLiteral("exports"));

            importNames.push(t.identifier(meta.exportName));
          }

          for (const [source, metadata] of meta.source) {
            amdArgs.push(t.stringLiteral(source));
            importNames.push(t.identifier(metadata.name));

            if (!isSideEffectImport(metadata)) {
              const interop = wrapInterop(
                path,
                t.identifier(metadata.name),
                metadata.interop,
              );
              if (interop) {
                const header = t.expressionStatement(
                  t.assignmentExpression(
                    "=",
                    t.identifier(metadata.name),
                    interop,
                  ),
                );
                header.loc = metadata.loc;
                headers.push(header);
              }
            }

            headers.push(
              ...buildNamespaceInitStatements(
                meta,
                metadata,
                constantReexports,
              ),
            );
          }

          ensureStatementsHoisted(headers);
          path.unshiftContainer("body", headers);

          injectWrapper(
            path,
            buildWrapper({
              MODULE_NAME: moduleName,

              AMD_ARGUMENTS: t.arrayExpression(amdArgs),
              IMPORT_NAMES: importNames,
            }) as t.ExpressionStatement,
          );
        },
      },
    },
  };
});
