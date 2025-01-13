import { declare } from "@babel/helper-plugin-utils";
import syntaxTypeScript from "@babel/plugin-syntax-typescript";
import type { PluginPass, types as t, Scope, NodePath } from "@babel/core";
import { injectInitialization } from "@babel/helper-create-class-features-plugin";
import type { Options as SyntaxOptions } from "@babel/plugin-syntax-typescript";

import transpileConstEnum from "./const-enum.ts";
import type { NodePathConstEnum } from "./const-enum.ts";
import transpileEnum from "./enum.ts";
import {
  GLOBAL_TYPES,
  isGlobalType,
  registerGlobalType,
} from "./global-types.ts";
import transpileNamespace, { getFirstIdentifier } from "./namespace.ts";

function isInType(path: NodePath) {
  switch (path.parent.type) {
    case "TSTypeReference":
    case process.env.BABEL_8_BREAKING
      ? "TSClassImplements"
      : "TSExpressionWithTypeArguments":
    case process.env.BABEL_8_BREAKING
      ? "TSInterfaceHeritage"
      : "TSExpressionWithTypeArguments":
    case "TSTypeQuery":
      return true;
    case "TSQualifiedName":
      return (
        // `import foo = ns.bar` is transformed to `var foo = ns.bar` and should not be removed
        path.parentPath.findParent(path => path.type !== "TSQualifiedName")
          .type !== "TSImportEqualsDeclaration"
      );
    case "ExportSpecifier":
      return (
        // export { type foo };
        path.parent.exportKind === "type" ||
        // export type { foo };
        // @ts-expect-error: DeclareExportDeclaration does not have `exportKind`
        (path.parentPath as NodePath<t.ExportSpecifier>).parent.exportKind ===
          "type"
      );
    default:
      return false;
  }
}

// Track programs which contain imports/exports of values, so that we can include
// empty exports for programs that do not, but were parsed as modules. This allows
// tools to infer unambiguously that results are ESM.
const NEEDS_EXPLICIT_ESM = new WeakMap();
const PARSED_PARAMS = new WeakSet();

// A hack to avoid removing the impl Binding when we remove the declare NodePath
function safeRemove(path: NodePath) {
  const ids = path.getBindingIdentifiers();
  for (const name of Object.keys(ids)) {
    const binding = path.scope.getBinding(name);
    if (binding && binding.identifier === ids[name]) {
      binding.scope.removeBinding(name);
    }
  }
  path.opts.noScope = true;
  path.remove();
  path.opts.noScope = false;
}

function assertCjsTransformEnabled(
  path: NodePath,
  pass: PluginPass,
  wrong: string,
  suggestion: string,
  extra: string = "",
): void {
  if (pass.file.get("@babel/plugin-transform-modules-*") !== "commonjs") {
    throw path.buildCodeFrameError(
      `\`${wrong}\` is only supported when compiling modules to CommonJS.\n` +
        `Please consider using \`${suggestion}\`${extra}, or add ` +
        `@babel/plugin-transform-modules-commonjs to your Babel config.`,
    );
  }
}

export interface Options extends SyntaxOptions {
  /** @default true */
  allowNamespaces?: boolean;
  /** @default "React.createElement" */
  jsxPragma?: string;
  /** @default "React.Fragment" */
  jsxPragmaFrag?: string;
  onlyRemoveTypeImports?: boolean;
  optimizeConstEnums?: boolean;
  allowDeclareFields?: boolean;
}

type ExtraNodeProps = {
  declare?: unknown;
  accessibility?: unknown;
  abstract?: unknown;
  optional?: unknown;
  override?: unknown;
};

export default declare((api, opts: Options) => {
  // `@babel/core` and `@babel/types` are bundled in some downstream libraries.
  // Ref: https://github.com/babel/babel/issues/15089
  const { types: t, template } = api;

  api.assertVersion(REQUIRED_VERSION(7));

  const JSX_PRAGMA_REGEX = /\*?\s*@jsx((?:Frag)?)\s+(\S+)/;

  const {
    allowNamespaces = true,
    jsxPragma = "React.createElement",
    jsxPragmaFrag = "React.Fragment",
    onlyRemoveTypeImports = false,
    optimizeConstEnums = false,
  } = opts;

  if (!process.env.BABEL_8_BREAKING) {
    // eslint-disable-next-line no-var
    var { allowDeclareFields = false } = opts;
  }

  const classMemberVisitors = {
    field(
      path: NodePath<
        (t.ClassPrivateProperty | t.ClassProperty | t.ClassAccessorProperty) &
          ExtraNodeProps
      >,
    ) {
      const { node } = path;

      if (!process.env.BABEL_8_BREAKING) {
        if (!allowDeclareFields && node.declare) {
          throw path.buildCodeFrameError(
            `The 'declare' modifier is only allowed when the 'allowDeclareFields' option of ` +
              `@babel/plugin-transform-typescript or @babel/preset-typescript is enabled.`,
          );
        }
      }
      if (node.declare) {
        if (node.value) {
          throw path.buildCodeFrameError(
            `Fields with the 'declare' modifier cannot be initialized here, but only in the constructor`,
          );
        }
        if (!node.decorators) {
          path.remove();
        }
      } else if (node.definite) {
        if (node.value) {
          throw path.buildCodeFrameError(
            `Definitely assigned fields cannot be initialized here, but only in the constructor`,
          );
        }
        if (!process.env.BABEL_8_BREAKING) {
          // keep the definitely assigned fields only when `allowDeclareFields` (equivalent of
          // Typescript's `useDefineForClassFields`) is true
          if (
            !allowDeclareFields &&
            !node.decorators &&
            !t.isClassPrivateProperty(node)
          ) {
            path.remove();
          }
        }
      } else if (node.abstract) {
        path.remove();
      } else if (!process.env.BABEL_8_BREAKING) {
        if (
          !allowDeclareFields &&
          !node.value &&
          !node.decorators &&
          !t.isClassPrivateProperty(node)
        ) {
          path.remove();
        }
      }

      if (node.accessibility) node.accessibility = null;
      if (node.abstract) node.abstract = null;
      if (node.readonly) node.readonly = null;
      if (node.optional) node.optional = null;
      if (node.typeAnnotation) node.typeAnnotation = null;
      if (node.definite) node.definite = null;
      if (node.declare) node.declare = null;
      if (node.override) node.override = null;
    },
    method({ node }: NodePath<t.ClassMethod | t.ClassPrivateMethod>) {
      if (node.accessibility) node.accessibility = null;
      if (node.abstract) node.abstract = null;
      if (node.optional) node.optional = null;
      if (node.override) node.override = null;

      // Rest handled by Function visitor
    },
    constructor(path: NodePath<t.ClassMethod>, classPath: NodePath<t.Class>) {
      if (path.node.accessibility) path.node.accessibility = null;
      // Collects parameter properties so that we can add an assignment
      // for each of them in the constructor body
      //
      // We use a WeakSet to ensure an assignment for a parameter
      // property is only added once. This is necessary for cases like
      // using `transform-classes`, which causes this visitor to run
      // twice.
      const assigns: t.ExpressionStatement[] = [];
      const { scope } = path;
      for (const paramPath of path.get("params")) {
        const param = paramPath.node;
        if (param.type === "TSParameterProperty") {
          const parameter = param.parameter;
          if (PARSED_PARAMS.has(parameter)) continue;
          PARSED_PARAMS.add(parameter);
          let id;
          if (t.isIdentifier(parameter)) {
            id = parameter;
          } else if (
            t.isAssignmentPattern(parameter) &&
            t.isIdentifier(parameter.left)
          ) {
            id = parameter.left;
          } else {
            throw paramPath.buildCodeFrameError(
              "Parameter properties can not be destructuring patterns.",
            );
          }
          assigns.push(
            template.statement.ast`
              this.${t.cloneNode(id)} = ${t.cloneNode(id)}
            ` as t.ExpressionStatement,
          );

          paramPath.replaceWith(paramPath.get("parameter"));
          scope.registerBinding("param", paramPath);
        }
      }
      injectInitialization(classPath, path, assigns);
    },
  };

  return {
    name: "transform-typescript",
    inherits: syntaxTypeScript,

    visitor: {
      //"Pattern" alias doesn't include Identifier or RestElement.
      Pattern: visitPattern,
      Identifier: visitPattern,
      RestElement: visitPattern,

      Program: {
        enter(path, state) {
          const { file } = state;
          let fileJsxPragma = null;
          let fileJsxPragmaFrag = null;
          const programScope = path.scope;

          if (!GLOBAL_TYPES.has(programScope)) {
            GLOBAL_TYPES.set(programScope, new Set());
          }

          if (file.ast.comments) {
            for (const comment of file.ast.comments) {
              const jsxMatches = JSX_PRAGMA_REGEX.exec(comment.value);
              if (jsxMatches) {
                if (jsxMatches[1]) {
                  // isFragment
                  fileJsxPragmaFrag = jsxMatches[2];
                } else {
                  fileJsxPragma = jsxMatches[2];
                }
              }
            }
          }

          let pragmaImportName = fileJsxPragma || jsxPragma;
          if (pragmaImportName) {
            [pragmaImportName] = pragmaImportName.split(".");
          }

          let pragmaFragImportName = fileJsxPragmaFrag || jsxPragmaFrag;
          if (pragmaFragImportName) {
            [pragmaFragImportName] = pragmaFragImportName.split(".");
          }

          // remove type imports
          for (let stmt of path.get("body") as Iterable<
            NodePath<t.Statement | t.Expression>
          >) {
            if (stmt.isImportDeclaration()) {
              if (!NEEDS_EXPLICIT_ESM.has(state.file.ast.program)) {
                NEEDS_EXPLICIT_ESM.set(state.file.ast.program, true);
              }

              if (stmt.node.importKind === "type") {
                for (const specifier of stmt.node.specifiers) {
                  registerGlobalType(programScope, specifier.local.name);
                }
                stmt.remove();
                continue;
              }

              const importsToRemove: Set<NodePath<t.Node>> = new Set();
              const specifiersLength = stmt.node.specifiers.length;
              const isAllSpecifiersElided = () =>
                specifiersLength > 0 &&
                specifiersLength === importsToRemove.size;

              for (const specifier of stmt.node.specifiers) {
                if (
                  specifier.type === "ImportSpecifier" &&
                  specifier.importKind === "type"
                ) {
                  registerGlobalType(programScope, specifier.local.name);
                  const binding = stmt.scope.getBinding(specifier.local.name);
                  if (binding) {
                    importsToRemove.add(binding.path);
                  }
                }
              }

              // If onlyRemoveTypeImports is `true`, only remove type-only imports
              // and exports introduced in TypeScript 3.8.
              if (onlyRemoveTypeImports) {
                NEEDS_EXPLICIT_ESM.set(path.node, false);
              } else {
                // Note: this will allow both `import { } from "m"` and `import "m";`.
                // In TypeScript, the former would be elided.
                if (stmt.node.specifiers.length === 0) {
                  NEEDS_EXPLICIT_ESM.set(path.node, false);
                  continue;
                }

                for (const specifier of stmt.node.specifiers) {
                  const binding = stmt.scope.getBinding(specifier.local.name);

                  // The binding may not exist if the import node was explicitly
                  // injected by another plugin. Currently core does not do a good job
                  // of keeping scope bindings synchronized with the AST. For now we
                  // just bail if there is no binding, since chances are good that if
                  // the import statement was injected then it wasn't a typescript type
                  // import anyway.
                  if (binding && !importsToRemove.has(binding.path)) {
                    if (
                      isImportTypeOnly({
                        binding,
                        programPath: path,
                        pragmaImportName,
                        pragmaFragImportName,
                      })
                    ) {
                      importsToRemove.add(binding.path);
                    } else {
                      NEEDS_EXPLICIT_ESM.set(path.node, false);
                    }
                  }
                }
              }

              if (isAllSpecifiersElided() && !onlyRemoveTypeImports) {
                stmt.remove();
              } else {
                for (const importPath of importsToRemove) {
                  importPath.remove();
                }
              }

              continue;
            }

            if (!onlyRemoveTypeImports && stmt.isTSImportEqualsDeclaration()) {
              const { id, isExport } = stmt.node;
              const binding = stmt.scope.getBinding(id.name);
              if (
                binding &&
                !isExport &&
                isImportTypeOnly({
                  binding,
                  programPath: path,
                  pragmaImportName,
                  pragmaFragImportName,
                })
              ) {
                stmt.remove();
                continue;
              }
            }

            if (stmt.isExportDeclaration()) {
              stmt = stmt.get("declaration");
            }

            if (stmt.isVariableDeclaration({ declare: true })) {
              for (const name of Object.keys(stmt.getBindingIdentifiers())) {
                registerGlobalType(programScope, name);
              }
            } else if (
              stmt.isTSTypeAliasDeclaration() ||
              (stmt.isTSDeclareFunction() && stmt.get("id").isIdentifier()) ||
              stmt.isTSInterfaceDeclaration() ||
              stmt.isClassDeclaration({ declare: true }) ||
              stmt.isTSEnumDeclaration({ declare: true }) ||
              (stmt.isTSModuleDeclaration({ declare: true }) &&
                stmt.get("id").isIdentifier())
            ) {
              registerGlobalType(
                programScope,
                (stmt.node.id as t.Identifier).name,
              );
            }
          }
        },
        exit(path) {
          if (
            path.node.sourceType === "module" &&
            NEEDS_EXPLICIT_ESM.get(path.node)
          ) {
            // If there are no remaining value exports, this file can no longer
            // be inferred to be ESM. Leave behind an empty export declaration
            // so it can be.
            path.pushContainer("body", t.exportNamedDeclaration());
          }
        },
      },

      ExportNamedDeclaration(path, state) {
        if (!NEEDS_EXPLICIT_ESM.has(state.file.ast.program)) {
          NEEDS_EXPLICIT_ESM.set(state.file.ast.program, true);
        }

        if (path.node.exportKind === "type") {
          path.remove();
          return;
        }

        // remove export declaration that is filled with type-only specifiers
        //   export { type A1, type A2 } from "a";
        if (
          path.node.source &&
          path.node.specifiers.length > 0 &&
          path.node.specifiers.every(
            specifier =>
              specifier.type === "ExportSpecifier" &&
              specifier.exportKind === "type",
          )
        ) {
          path.remove();
          return;
        }

        // remove export declaration if it's exporting only types
        // This logic is needed when exportKind is "value", because
        // currently the "type" keyword is optional.
        // TODO:
        // Also, currently @babel/parser sets exportKind to "value" for
        //   export interface A {}
        //   etc.
        if (
          !path.node.source &&
          path.node.specifiers.length > 0 &&
          path.node.specifiers.every(
            specifier =>
              t.isExportSpecifier(specifier) &&
              isGlobalType(path, specifier.local.name),
          )
        ) {
          path.remove();
          return;
        }

        // Convert `export namespace X {}` into `export let X; namespace X {}`,
        // so that when visiting TSModuleDeclaration we do not have to possibly
        // replace its parent path.
        if (t.isTSModuleDeclaration(path.node.declaration)) {
          const namespace = path.node.declaration;
          if (!t.isStringLiteral(namespace.id)) {
            const id = getFirstIdentifier(namespace.id);
            if (path.scope.hasOwnBinding(id.name)) {
              path.replaceWith(namespace);
            } else {
              const [newExport] = path.replaceWithMultiple([
                t.exportNamedDeclaration(
                  t.variableDeclaration("let", [
                    t.variableDeclarator(t.cloneNode(id)),
                  ]),
                ),
                namespace,
              ]);
              path.scope.registerDeclaration(newExport);
            }
          }
        }

        NEEDS_EXPLICIT_ESM.set(state.file.ast.program, false);
      },

      ExportAllDeclaration(path) {
        if (path.node.exportKind === "type") path.remove();
      },

      ExportSpecifier(path) {
        // remove type exports
        type Parent = t.ExportDeclaration & { source?: t.StringLiteral };
        const parent = path.parent as Parent;
        if (
          (!parent.source && isGlobalType(path, path.node.local.name)) ||
          path.node.exportKind === "type"
        ) {
          path.remove();
        }
      },

      ExportDefaultDeclaration(path, state) {
        if (!NEEDS_EXPLICIT_ESM.has(state.file.ast.program)) {
          NEEDS_EXPLICIT_ESM.set(state.file.ast.program, true);
        }

        // remove whole declaration if it's exporting a TS type
        if (
          t.isIdentifier(path.node.declaration) &&
          isGlobalType(path, path.node.declaration.name)
        ) {
          path.remove();

          return;
        }

        NEEDS_EXPLICIT_ESM.set(state.file.ast.program, false);
      },

      TSDeclareFunction(path) {
        safeRemove(path);
      },

      TSDeclareMethod(path) {
        safeRemove(path);
      },

      VariableDeclaration(path) {
        if (path.node.declare) {
          safeRemove(path);
        }
      },

      VariableDeclarator({ node }) {
        if (node.definite) node.definite = null;
      },

      TSIndexSignature(path) {
        path.remove();
      },

      ClassDeclaration(path) {
        const { node } = path;
        if (node.declare) {
          safeRemove(path);
        }
      },

      Class(path) {
        const { node }: { node: typeof path.node & ExtraNodeProps } = path;

        if (node.typeParameters) node.typeParameters = null;
        if (process.env.BABEL_8_BREAKING) {
          // @ts-ignore(Babel 7 vs Babel 8) Renamed
          if (node.superTypeArguments) node.superTypeArguments = null;
        } else {
          // @ts-ignore(Babel 7 vs Babel 8) Renamed
          if (node.superTypeParameters) node.superTypeParameters = null;
        }
        if (node.implements) node.implements = null;
        if (node.abstract) node.abstract = null;

        // Similar to the logic in `transform-flow-strip-types`, we need to
        // handle `TSParameterProperty` and `ClassProperty` here because the
        // class transform would transform the class, causing more specific
        // visitors to not run.
        path.get("body.body").forEach(child => {
          if (child.isClassMethod() || child.isClassPrivateMethod()) {
            if (child.node.kind === "constructor") {
              classMemberVisitors.constructor(
                // @ts-expect-error A constructor must not be a private method
                child,
                path,
              );
            } else {
              classMemberVisitors.method(child);
            }
          } else if (
            child.isClassProperty() ||
            child.isClassPrivateProperty() ||
            child.isClassAccessorProperty()
          ) {
            classMemberVisitors.field(child);
          }
        });
      },

      Function(path) {
        const { node } = path;
        if (node.typeParameters) node.typeParameters = null;
        if (node.returnType) node.returnType = null;

        const params = node.params;
        if (params.length > 0 && t.isIdentifier(params[0], { name: "this" })) {
          params.shift();
        }
      },

      TSModuleDeclaration(path) {
        transpileNamespace(path, allowNamespaces);
      },

      TSInterfaceDeclaration(path) {
        path.remove();
      },

      TSTypeAliasDeclaration(path) {
        path.remove();
      },

      TSEnumDeclaration(path) {
        if (optimizeConstEnums && path.node.const) {
          transpileConstEnum(path as NodePathConstEnum, t);
        } else {
          transpileEnum(path, t);
        }
      },

      TSImportEqualsDeclaration(
        path: NodePath<t.TSImportEqualsDeclaration>,
        pass,
      ) {
        const { id, moduleReference, isExport } = path.node;

        let init: t.Expression;
        let varKind: "var" | "const";
        if (t.isTSExternalModuleReference(moduleReference)) {
          // import alias = require('foo');
          assertCjsTransformEnabled(
            path,
            pass,
            `import ${id.name} = require(...);`,
            `import ${id.name} from '...';`,
            " alongside Typescript's --allowSyntheticDefaultImports option",
          );
          init = t.callExpression(t.identifier("require"), [
            moduleReference.expression,
          ]);
          varKind = "const";
        } else {
          // import alias = Namespace;
          init = entityNameToExpr(moduleReference);
          varKind = "var";
        }
        const newNode = t.variableDeclaration(varKind, [
          t.variableDeclarator(id, init),
        ]);

        path.replaceWith(
          isExport ? t.exportNamedDeclaration(newNode) : newNode,
        );
        path.scope.registerDeclaration(path);
      },

      TSExportAssignment(path, pass) {
        assertCjsTransformEnabled(
          path,
          pass,
          `export = <value>;`,
          `export default <value>;`,
        );
        path.replaceWith(
          template.statement.ast`module.exports = ${path.node.expression}`,
        );
      },

      TSTypeAssertion(path) {
        path.replaceWith(path.node.expression);
      },

      [`TSAsExpression${
        // Added in Babel 7.20.0
        t.tsSatisfiesExpression ? "|TSSatisfiesExpression" : ""
      }`](path: NodePath<t.TSAsExpression | t.TSSatisfiesExpression>) {
        let { node }: { node: t.Expression } = path;
        do {
          node = node.expression;
        } while (t.isTSAsExpression(node) || t.isTSSatisfiesExpression?.(node));
        path.replaceWith(node);
      },

      [process.env.BABEL_8_BREAKING
        ? "TSNonNullExpression|TSInstantiationExpression"
        : /* This has been introduced in Babel 7.18.0
             We use api.types.* and not t.* for feature detection,
             because the Babel version that is running this plugin
             (where we check if the visitor is valid) might be different
             from the Babel version that we resolve with `import "@babel/core"`.
             This happens, for example, with Next.js that bundled `@babel/core`
             but allows loading unbundled plugin (which cannot obviously import
             the bundled `@babel/core` version).
           */
          api.types.tsInstantiationExpression
          ? "TSNonNullExpression|TSInstantiationExpression"
          : "TSNonNullExpression"](
        path: NodePath<t.TSNonNullExpression | t.TSInstantiationExpression>,
      ) {
        path.replaceWith(path.node.expression);
      },

      CallExpression(path) {
        if (process.env.BABEL_8_BREAKING) {
          path.node.typeArguments = null;
        } else {
          // @ts-ignore(Babel 7 vs Babel 8) Removed in Babel 8
          path.node.typeParameters = null;
        }
      },

      OptionalCallExpression(path) {
        if (process.env.BABEL_8_BREAKING) {
          path.node.typeArguments = null;
        } else {
          // @ts-ignore(Babel 7 vs Babel 8) Removed in Babel 8
          path.node.typeParameters = null;
        }
      },

      NewExpression(path) {
        if (process.env.BABEL_8_BREAKING) {
          path.node.typeArguments = null;
        } else {
          // @ts-ignore(Babel 7 vs Babel 8) Removed in Babel 8
          path.node.typeParameters = null;
        }
      },

      JSXOpeningElement(path) {
        if (process.env.BABEL_8_BREAKING) {
          //@ts-ignore(Babel 7 vs Babel 8) Babel 8 AST
          path.node.typeArguments = null;
        } else {
          // @ts-ignore(Babel 7 vs Babel 8) Removed in Babel 8
          path.node.typeParameters = null;
        }
      },

      TaggedTemplateExpression(path) {
        if (process.env.BABEL_8_BREAKING) {
          // @ts-ignore(Babel 7 vs Babel 8) Babel 8 AST
          path.node.typeArguments = null;
        } else {
          // @ts-ignore(Babel 7 vs Babel 8) Removed in Babel 8
          path.node.typeParameters = null;
        }
      },
    },
  };

  function entityNameToExpr(node: t.TSEntityName): t.Expression {
    if (t.isTSQualifiedName(node)) {
      return t.memberExpression(entityNameToExpr(node.left), node.right);
    }

    return node;
  }

  function visitPattern({
    node,
  }: NodePath<t.Identifier | t.Pattern | t.RestElement>) {
    if (node.typeAnnotation) node.typeAnnotation = null;
    if (t.isIdentifier(node) && node.optional) node.optional = null;
    // 'access' and 'readonly' are only for parameter properties, so constructor visitor will handle them.
  }

  function isImportTypeOnly({
    binding,
    programPath,
    pragmaImportName,
    pragmaFragImportName,
  }: {
    binding: Scope.Binding;
    programPath: NodePath<t.Program>;
    pragmaImportName: string;
    pragmaFragImportName: string;
  }) {
    for (const path of binding.referencePaths) {
      if (!isInType(path)) {
        return false;
      }
    }

    if (
      binding.identifier.name !== pragmaImportName &&
      binding.identifier.name !== pragmaFragImportName
    ) {
      return true;
    }

    // "React" or the JSX pragma is referenced as a value if there are any JSX elements/fragments in the code.
    let sourceFileHasJsx = false;
    programPath.traverse({
      "JSXElement|JSXFragment"(path) {
        sourceFileHasJsx = true;
        path.stop();
      },
    });
    return !sourceFileHasJsx;
  }
});
