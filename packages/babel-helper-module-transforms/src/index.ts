import assert from "assert";
import * as t from "@babel/types";
import template from "@babel/template";

import { isModule } from "@babel/helper-module-imports";

import rewriteThis from "./rewrite-this";
import rewriteLiveReferences from "./rewrite-live-references";
import normalizeModuleAndLoadMetadata, {
  hasExports,
  isSideEffectImport,
  validateImportInteropOption,
} from "./normalize-and-load-metadata";
import type {
  InteropType,
  ModuleMetadata,
  SourceModuleMetadata,
} from "./normalize-and-load-metadata";
import type { NodePath } from "@babel/traverse";

export { default as getModuleName } from "./get-module-name";

export { hasExports, isSideEffectImport, isModule, rewriteThis };

/**
 * Perform all of the generic ES6 module rewriting needed to handle initial
 * module processing. This function will rewrite the majority of the given
 * program to reference the modules described by the returned metadata,
 * and returns a list of statements for use when initializing the module.
 */
export function rewriteModuleStatementsAndPrepareHeader(
  path: NodePath<t.Program>,
  {
    // TODO(Babel 8): Remove this
    loose,

    exportName,
    strict,
    allowTopLevelThis,
    strictMode,
    noInterop,
    importInterop = noInterop ? "none" : "babel",
    lazy,
    esNamespaceOnly,

    constantReexports = loose,
    enumerableModuleMeta = loose,
    noIncompleteNsImportDetection,
  }: {
    exportName?;
    strict;
    allowTopLevelThis?;
    strictMode;
    loose?;
    importInterop?: "none" | "babel" | "node";
    noInterop?;
    lazy?;
    esNamespaceOnly?;
    constantReexports?;
    enumerableModuleMeta?;
    noIncompleteNsImportDetection?: boolean;
  },
) {
  validateImportInteropOption(importInterop);
  assert(isModule(path), "Cannot process module statements in a script");
  path.node.sourceType = "script";

  const meta = normalizeModuleAndLoadMetadata(path, exportName, {
    importInterop,
    initializeReexports: constantReexports,
    lazy,
    esNamespaceOnly,
  });

  if (!allowTopLevelThis) {
    rewriteThis(path);
  }

  rewriteLiveReferences(path, meta);

  if (strictMode !== false) {
    const hasStrict = path.node.directives.some(directive => {
      return directive.value.value === "use strict";
    });
    if (!hasStrict) {
      path.unshiftContainer(
        "directives",
        t.directive(t.directiveLiteral("use strict")),
      );
    }
  }

  const headers = [];
  if (hasExports(meta) && !strict) {
    headers.push(buildESModuleHeader(meta, enumerableModuleMeta));
  }

  const nameList = buildExportNameListDeclaration(path, meta);

  if (nameList) {
    meta.exportNameListName = nameList.name;
    headers.push(nameList.statement);
  }

  for (const srcMeta of meta.source.values()) {
    if (srcMeta.reexportAll) {
      const reexportFunc = buildReexportFromThis(path, meta, constantReexports);
      meta.reexportFromThisName = reexportFunc.name;
      headers.push(reexportFunc.statement);
      break;
    }
  }

  // Create all of the statically known named exports.
  headers.push(
    ...buildExportInitializationStatements(
      path,
      meta,
      constantReexports,
      noIncompleteNsImportDetection,
    ),
  );

  return { meta, headers };
}

/**
 * Flag a set of statements as hoisted above all else so that module init
 * statements all run before user code.
 */
export function ensureStatementsHoisted(statements) {
  // Force all of the header fields to be at the top of the file.
  statements.forEach(header => {
    header._blockHoist = 3;
  });
}

/**
 * Given an expression for a standard import object, like "require('foo')",
 * wrap it in a call to the interop helpers based on the type.
 */
export function wrapInterop(
  programPath: NodePath,
  expr: t.Expression,
  type: InteropType,
): t.CallExpression {
  if (type === "none") {
    return null;
  }

  if (type === "node-namespace") {
    return t.callExpression(
      programPath.hub.addHelper("interopRequireWildcard"),
      [expr, t.booleanLiteral(true)],
    );
  } else if (type === "node-default") {
    return null;
  }

  let helper;
  if (type === "default") {
    helper = "interopRequireDefault";
  } else if (type === "namespace") {
    helper = "interopRequireWildcard";
  } else {
    throw new Error(`Unknown interop: ${type}`);
  }

  return t.callExpression(programPath.hub.addHelper(helper), [expr]);
}

/**
 * Create the runtime initialization statements for a given requested source.
 * These will initialize all of the runtime import/export logic that
 * can't be handled statically by the statements created by
 * buildExportInitializationStatements().
 */
export function buildNamespaceInitStatements(
  metadata: ModuleMetadata,
  sourceMetadata: SourceModuleMetadata,
  constantReexports: boolean = false,
) {
  const statements = [];

  let srcNamespace: t.Node = t.identifier(sourceMetadata.name);
  if (sourceMetadata.lazy) srcNamespace = t.callExpression(srcNamespace, []);

  for (const localName of sourceMetadata.importsNamespace) {
    if (localName === sourceMetadata.name) continue;

    // Create and assign binding to namespace object
    statements.push(
      template.statement`var NAME = SOURCE;`({
        NAME: localName,
        SOURCE: t.cloneNode(srcNamespace),
      }),
    );
  }
  if (constantReexports) {
    statements.push(...buildReexportsFromMeta(metadata, sourceMetadata, true));
  }
  for (const exportName of sourceMetadata.reexportNamespace) {
    // Assign export to namespace object.
    statements.push(
      sourceMetadata.lazy
        ? template.statement`REEXPORT(NAME, () => NAMESPACE);`({
            REEXPORT: metadata.reexportByGetName,
            NAME: t.stringLiteral(exportName),
            NAMESPACE: t.cloneNode(srcNamespace),
          })
        : template.statement`EXPORTS.NAME = NAMESPACE;`({
            EXPORTS: metadata.exportName,
            NAME: exportName,
            NAMESPACE: t.cloneNode(srcNamespace),
          }),
    );
  }
  if (sourceMetadata.reexportAll) {
    const statement = template.statement`
      Object.keys(NAMESPACE).forEach(REEXPORT, NAMESPACE);
    `({
      REEXPORT: metadata.reexportFromThisName,
      NAMESPACE: t.cloneNode(srcNamespace),
    });
    statement.loc = sourceMetadata.reexportAll.loc;

    // Iterate props creating getter for each prop.
    statements.push(statement);
  }
  return statements;
}

const ReexportTemplate = {
  constant: template.statement`EXPORTS.EXPORT_NAME = NAMESPACE_IMPORT;`,
  constantComputed: template.statement`EXPORTS["EXPORT_NAME"] = NAMESPACE_IMPORT;`,
  spec: template.statement`EXPORT_FUNC(EXPORT_KEY, () => NAMESPACE_IMPORT);`,
};

const buildReexportsFromMeta = (
  meta: ModuleMetadata,
  metadata: SourceModuleMetadata,
  constantReexports: boolean,
) => {
  const namespace = metadata.lazy
    ? t.callExpression(t.identifier(metadata.name), [])
    : t.identifier(metadata.name);

  const { stringSpecifiers } = meta;
  return Array.from(metadata.reexports, ([exportName, importName]) => {
    let NAMESPACE_IMPORT: t.Expression = t.cloneNode(namespace);
    if (importName === "default" && metadata.interop === "node-default") {
      // Nothing, it's ok as-is
    } else if (stringSpecifiers.has(importName)) {
      NAMESPACE_IMPORT = t.memberExpression(
        NAMESPACE_IMPORT,
        t.stringLiteral(importName),
        true,
      );
    } else {
      NAMESPACE_IMPORT = t.memberExpression(
        NAMESPACE_IMPORT,
        t.identifier(importName),
      );
    }
    const astNodes = {
      EXPORTS: meta.exportName,
      EXPORT_NAME: exportName,
      NAMESPACE_IMPORT,
    };
    if (constantReexports || t.isIdentifier(NAMESPACE_IMPORT)) {
      if (stringSpecifiers.has(exportName)) {
        return ReexportTemplate.constantComputed(astNodes);
      } else {
        return ReexportTemplate.constant(astNodes);
      }
    } else {
      return ReexportTemplate.spec({
        EXPORT_FUNC: meta.reexportByGetName,
        EXPORT_KEY: t.stringLiteral(exportName),
        NAMESPACE_IMPORT,
      });
    }
  });
};

/**
 * Build an "__esModule" header statement setting the property on a given object.
 */
function buildESModuleHeader(
  metadata: ModuleMetadata,
  enumerableModuleMeta: boolean = false,
) {
  return (
    enumerableModuleMeta
      ? template.statement`
        EXPORTS.__esModule = true;
      `
      : template.statement`
        Object.defineProperty(EXPORTS, "__esModule", {
          value: true,
        });
      `
  )({ EXPORTS: metadata.exportName });
}

/**
 * Create re-export initialization function.
 */
function buildReexportFromThis(
  programPath: NodePath,
  metadata: ModuleMetadata,
  constantReexports: boolean = false,
) {
  const EXPORT_FROM_THIS =
    programPath.scope.generateUidIdentifier("exportFromThis");

  const VERIFY_NAME_LIST = template.expression(
    metadata.exportNameListName
      ? `(Object.prototype.hasOwnProperty.call(${metadata.exportNameListName}, key))`
      : `(key === "default" || key === "__esModule")`,
  )();

  const SET_EXPORTS_PROPERTY = template.statement(
    constantReexports
      ? `EXPORTS[key] = this[key];`
      : `
        Object.defineProperty(EXPORTS, key, {
          enumerable: true,
          get: () => this[key],
        });
        `,
  )({
    EXPORTS: metadata.exportName,
  });

  // Also skip already assigned bindings if they are strictly equal
  // to be somewhat more spec-compliant when a file has multiple
  // namespace re-exports that would cause a binding to be exported
  // multiple times. However, multiple bindings of the same name that
  // export the same primitive value are silently skipped
  // (the spec requires an "ambigous bindings" early error here).

  return {
    name: EXPORT_FROM_THIS.name,
    statement: template.statement`
      function EXPORT_FROM_THIS(key) {
        if (VERIFY_NAME_LIST) return;
        if (key in EXPORTS && EXPORTS[key] === this[key]) return;
        SET_EXPORTS_PROPERTY;
      }
    `({
      EXPORTS: metadata.exportName,
      EXPORT_FROM_THIS,
      VERIFY_NAME_LIST,
      SET_EXPORTS_PROPERTY,
    }),
  };
}

/**
 * Build a statement declaring a variable that contains all of the exported
 * variable names in an object so they can easily be referenced from an
 * export * from statement to check for conflicts.
 */
function buildExportNameListDeclaration(
  programPath: NodePath,
  metadata: ModuleMetadata,
) {
  const exportedVars = Object.create(null);
  for (const data of metadata.local.values()) {
    for (const name of data.names) {
      exportedVars[name] = true;
    }
  }

  let hasReexport = false;
  for (const data of metadata.source.values()) {
    for (const exportName of data.reexports.keys()) {
      exportedVars[exportName] = true;
    }
    for (const exportName of data.reexportNamespace) {
      exportedVars[exportName] = true;
    }

    hasReexport = hasReexport || !!data.reexportAll;
  }

  exportedVars.default = true;
  exportedVars.__esModule = true;

  if (!hasReexport || Object.keys(exportedVars).length === 2) return null;

  const name = programPath.scope.generateUidIdentifier("exportNames");

  return {
    name: name.name,
    statement: t.variableDeclaration("var", [
      t.variableDeclarator(name, t.valueToNode(exportedVars)),
    ]),
  };
}

/**
 * Check whether we need to re-export some named imports lazily.
 */
function needsReexportByGet(
  metadata: ModuleMetadata,
  constantReexports: boolean = false,
) {
  for (const srcMeta of metadata.source.values()) {
    if (srcMeta.lazy && srcMeta.reexportNamespace.size) {
      // reexportByGetName needed in buildNamespaceInitStatements()
      return true;
    }
    if (!constantReexports && srcMeta.reexports.size) {
      if (srcMeta.lazy || srcMeta.interop !== "node-default") {
        // reexportByGetName needed in buildReexportsFromMeta()
        return true;
      }
      for (const importName of srcMeta.reexports.values()) {
        if (importName !== "default") {
          // reexportByGetName needed in buildReexportsFromMeta()
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Create a set of statements that will initialize all of the statically-known
 * export names with their expected values.
 */
function buildExportInitializationStatements(
  programPath: NodePath,
  metadata: ModuleMetadata,
  constantReexports: boolean = false,
  noIncompleteNsImportDetection = false,
) {
  const initStatements = [];

  const exportNames = [];
  for (const [localName, data] of metadata.local) {
    if (data.kind === "import") {
      // No-open since these are explicitly set with the "reexports" block.
    } else if (data.kind === "hoisted") {
      initStatements.push(
        buildInitStatement(metadata, data.names, t.identifier(localName)),
      );
    } else {
      exportNames.push(...data.names);
    }
  }

  if (needsReexportByGet(metadata, constantReexports)) {
    const id = programPath.scope.generateUidIdentifier("export");
    const decl = template.statement`
      function REEXPORT(key, get) {
        Object.defineProperty(EXPORTS, key, { enumerable: true, get });
      }
    `({
      REEXPORT: id,
      EXPORTS: metadata.exportName,
    });
    metadata.reexportByGetName = id.name;
    initStatements.push(decl);
  }

  for (const data of metadata.source.values()) {
    if (!constantReexports) {
      initStatements.push(...buildReexportsFromMeta(metadata, data, false));
    }
    for (const exportName of data.reexportNamespace) {
      exportNames.push(exportName);
    }
  }

  if (!noIncompleteNsImportDetection) {
    initStatements.push(
      ...chunk(exportNames, 100).map(members => {
        return buildInitStatement(
          metadata,
          members,
          programPath.scope.buildUndefinedNode(),
        );
      }),
    );
  }

  return initStatements;
}

/**
 * Given a set of export names, create a set of nested assignments to
 * initialize them all to a given expression.
 */
const InitTemplate = {
  computed: template.expression`EXPORTS["NAME"] = VALUE`,
  default: template.expression`EXPORTS.NAME = VALUE`,
};

function buildInitStatement(metadata: ModuleMetadata, exportNames, initExpr) {
  const { stringSpecifiers, exportName: EXPORTS } = metadata;
  return t.expressionStatement(
    exportNames.reduce((acc, exportName) => {
      const params = {
        EXPORTS,
        NAME: exportName,
        VALUE: acc,
      };
      if (stringSpecifiers.has(exportName)) {
        return InitTemplate.computed(params);
      } else {
        return InitTemplate.default(params);
      }
    }, initExpr),
  );
}

function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
