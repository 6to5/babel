import { declare } from "@babel/helper-plugin-utils";
import { basename, extname } from "path";
import {
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
import type { PluginOptions } from "@babel/helper-module-transforms";
import { types as t, template } from "@babel/core";
import type { NodePath } from "@babel/traverse";

const buildPrerequisiteAssignment = template(`
  GLOBAL_REFERENCE = GLOBAL_REFERENCE || {}
`);
// Note: we avoid comparing typeof results with "object" or "symbol" otherwise
// they will be processed by `transform-typeof-symbol`, which in return could
// cause typeof helper used before declaration
const buildWrapper = template(`
  (function (global, factory) {
    if (typeof define === "function" && define.amd) {
      define(MODULE_NAME, AMD_ARGUMENTS, factory);
    } else if (typeof exports !== "undefined") {
      factory(COMMONJS_ARGUMENTS);
    } else {
      var mod = { exports: {} };
      factory(BROWSER_ARGUMENTS);

      GLOBAL_TO_ASSIGN;
    }
  })(
    typeof globalThis !== "undefined" ? globalThis
      : typeof self !== "undefined" ? self
      : this,
    function(IMPORT_NAMES) {
  })
`);

export interface Options extends PluginOptions {
  allowTopLevelThis?: boolean;
  exactGlobals?: boolean;
  globals?: Record<string, string>;
  importInterop?: RewriteModuleStatementsAndPrepareHeaderOptions["importInterop"];
  loose?: boolean;
  noInterop?: boolean;
  strict?: boolean;
  strictMode?: boolean;
}

export default declare((api, options: Options) => {
  api.assertVersion(REQUIRED_VERSION(7));

  const {
    globals,
    exactGlobals,
    allowTopLevelThis,
    strict,
    strictMode,
    noInterop,
    importInterop,
  } = options;

  const constantReexports =
    api.assumption("constantReexports") ?? options.loose;
  const enumerableModuleMeta =
    api.assumption("enumerableModuleMeta") ?? options.loose;

  /**
   * Build the assignment statements that initialize the UMD global.
   */
  function buildBrowserInit(
    browserGlobals: Record<string, string>,
    exactGlobals: boolean,
    filename: string,
    moduleName: t.StringLiteral | void,
  ) {
    const moduleNameOrBasename = moduleName
      ? moduleName.value
      : basename(filename, extname(filename));
    let globalToAssign = t.memberExpression(
      t.identifier("global"),
      t.identifier(t.toIdentifier(moduleNameOrBasename)),
    );
    let initAssignments = [];

    if (exactGlobals) {
      const globalName = browserGlobals[moduleNameOrBasename];

      if (globalName) {
        initAssignments = [];

        const members = globalName.split(".");
        globalToAssign = members.slice(1).reduce(
          (accum, curr) => {
            initAssignments.push(
              buildPrerequisiteAssignment({
                GLOBAL_REFERENCE: t.cloneNode(accum),
              }),
            );
            return t.memberExpression(accum, t.identifier(curr));
          },
          t.memberExpression(t.identifier("global"), t.identifier(members[0])),
        );
      }
    }

    initAssignments.push(
      t.expressionStatement(
        t.assignmentExpression(
          "=",
          globalToAssign,
          t.memberExpression(t.identifier("mod"), t.identifier("exports")),
        ),
      ),
    );

    return initAssignments;
  }

  /**
   * Build the member expression that reads from a global for a given source.
   */
  function buildBrowserArg(
    browserGlobals: Record<string, string>,
    exactGlobals: boolean,
    source: string,
  ) {
    let memberExpression: t.MemberExpression;
    if (exactGlobals) {
      const globalRef = browserGlobals[source];
      if (globalRef) {
        memberExpression = globalRef
          .split(".")
          .reduce(
            (accum: t.Identifier | t.MemberExpression, curr) =>
              t.memberExpression(accum, t.identifier(curr)),
            t.identifier("global"),
          ) as t.MemberExpression;
      } else {
        memberExpression = t.memberExpression(
          t.identifier("global"),
          t.identifier(t.toIdentifier(source)),
        );
      }
    } else {
      const requireName = basename(source, extname(source));
      const globalName = browserGlobals[requireName] || requireName;
      memberExpression = t.memberExpression(
        t.identifier("global"),
        t.identifier(t.toIdentifier(globalName)),
      );
    }
    return memberExpression;
  }

  return {
    name: "transform-modules-umd",

    visitor: {
      Program: {
        exit(path) {
          if (!isModule(path)) return;

          const browserGlobals = globals || {};

          const moduleName = getModuleName(this.file.opts, options);
          let moduleNameLiteral: void | t.StringLiteral;
          if (moduleName) moduleNameLiteral = t.stringLiteral(moduleName);

          const { meta, headers } = rewriteModuleStatementsAndPrepareHeader(
            path,
            {
              implicitAssignmentExports: true,
              constantReexports,
              enumerableModuleMeta,
              strict,
              strictMode,
              allowTopLevelThis,
              noInterop,
              importInterop,
              filename: this.file.opts.filename,
            },
          );

          const amdArgs = [];
          const commonjsArgs = [];
          const browserArgs = [];
          const importNames = [];

          if (hasExports(meta)) {
            amdArgs.push(t.stringLiteral("exports"));
            commonjsArgs.push(t.identifier("exports"));
            browserArgs.push(
              t.memberExpression(t.identifier("mod"), t.identifier("exports")),
            );
            importNames.push(t.identifier(meta.exportName));
          }

          for (const [source, metadata] of meta.source) {
            amdArgs.push(t.stringLiteral(source));
            commonjsArgs.push(
              t.callExpression(t.identifier("require"), [
                t.stringLiteral(source),
              ]),
            );
            browserArgs.push(
              buildBrowserArg(browserGlobals, exactGlobals, source),
            );
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
                // @ts-expect-error todo(flow->ts)
                header.loc = meta.loc;
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

          const { body, directives } = path.node;
          path.node.directives = [];
          path.node.body = [];
          const umdWrapper = path.pushContainer("body", [
            buildWrapper({
              //todo: buildWrapper does not handle void moduleNameLiteral
              MODULE_NAME: moduleNameLiteral,

              AMD_ARGUMENTS: t.arrayExpression(amdArgs),
              COMMONJS_ARGUMENTS: commonjsArgs,
              BROWSER_ARGUMENTS: browserArgs,
              IMPORT_NAMES: importNames,

              GLOBAL_TO_ASSIGN: buildBrowserInit(
                browserGlobals,
                exactGlobals,
                this.filename || "unknown",
                moduleNameLiteral,
              ),
            }) as t.Statement,
          ])[0] as NodePath<t.ExpressionStatement>;
          const umdFactory = (
            umdWrapper.get("expression.arguments")[1] as NodePath<t.Function>
          ).get("body") as NodePath<t.BlockStatement>;
          umdFactory.pushContainer("directives", directives);
          umdFactory.pushContainer("body", body);
        },
      },
    },
  };
});
