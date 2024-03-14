import { basename, extname } from "path";
import type * as t from "@babel/types";

import { isIdentifierName } from "@babel/helper-validator-identifier";
import splitExportDeclaration from "@babel/helper-split-export-declaration";
import type { NodePath } from "@babel/traverse";

export interface ModuleMetadata {
  // `undefined` means legacy behavior, `boolean` means emit `exports.x = y` for `cjs-module-lexer` compat.
  implicitAssignmentExports: boolean | undefined;
  programPath: NodePath<t.Program>;
  exportName: string;
  exportNameList?: string[];
  hasExports: boolean;
  // Lookup from local binding to export information.
  local: Map<string, LocalExportMetadata>;
  // Lookup of source file to source file metadata.
  source: Map<string, SourceModuleMetadata>;
  // List of names that should only be printed as string literals.
  // i.e. `import { "any unicode" as foo } from "some-module"`
  // `stringSpecifiers` is Set(1) ["any unicode"]
  // In most cases `stringSpecifiers` is an empty Set
  stringSpecifiers: Set<string>;
}

export type InteropType =
  | "default" // Babel interop for default-only imports
  | "namespace" // Babel interop for namespace or default+named imports
  | "node-default" // Node.js interop for default-only imports
  | "node-namespace" // Node.js interop for namespace or default+named imports
  | "none"; // No interop, or named-only imports

export type ImportInterop =
  | "none"
  | "babel"
  | "node"
  | ((source: string, filename?: string) => "none" | "babel" | "node");

export interface SourceModuleMetadata {
  // A unique variable name to use for this namespace object. Centralized for simplicity.
  name: string;
  loc: t.SourceLocation | undefined | null;
  interop: InteropType;
  // Local binding to reference from this source namespace. Key: Local name, value: Import name
  imports: Map<string, string>;
  // Local names that reference namespace object.
  importsNamespace: Set<string>;
  // Reexports to create for namespace. Key: Export name, value: Import name
  reexports: Map<string, string>;
  // List of names to re-export namespace as.
  reexportNamespace: Set<string>;
  // Tracks if the source should be re-exported.
  reexportAll: null | {
    loc: t.SourceLocation | undefined | null;
  };
  wrap?: unknown;
  referenced: boolean;
}

export interface LocalExportMetadata {
  names: Array<string>; // names of exports,
  kind: "import" | "hoisted" | "block" | "var";
}

/**
 * Check if the module has any exports that need handling.
 */
export function hasExports(metadata: ModuleMetadata) {
  return metadata.hasExports;
}

/**
 * Check if a given source is an anonymous import, e.g. "import 'foo';"
 */
export function isSideEffectImport(source: SourceModuleMetadata) {
  return (
    source.imports.size === 0 &&
    source.importsNamespace.size === 0 &&
    source.reexports.size === 0 &&
    source.reexportNamespace.size === 0 &&
    !source.reexportAll
  );
}

export function validateImportInteropOption(
  importInterop: any,
): importInterop is ImportInterop {
  if (
    typeof importInterop !== "function" &&
    importInterop !== "none" &&
    importInterop !== "babel" &&
    importInterop !== "node"
  ) {
    throw new Error(
      `.importInterop must be one of "none", "babel", "node", or a function returning one of those values (received ${importInterop}).`,
    );
  }
  return importInterop;
}

function resolveImportInterop(
  importInterop: ImportInterop,
  source: string,
  filename: string | undefined,
) {
  if (typeof importInterop === "function") {
    return validateImportInteropOption(importInterop(source, filename));
  }
  return importInterop;
}

/**
 * Remove all imports and exports from the file, and return all metadata
 * needed to reconstruct the module's behavior.
 */
export default function normalizeModuleAndLoadMetadata(
  programPath: NodePath<t.Program>,
  exportName: string,
  {
    importInterop,
    initializeReexports = false,
    getWrapperPayload,
    esNamespaceOnly = false,
    filename,
  }: {
    importInterop: ImportInterop;
    initializeReexports: boolean | void;
    getWrapperPayload?: (
      source: string,
      metadata: SourceModuleMetadata,
      importNodes: t.Node[],
    ) => unknown;
    esNamespaceOnly: boolean;
    filename: string;
  },
): ModuleMetadata {
  if (!exportName) {
    exportName = programPath.scope.generateUidIdentifier("exports").name;
  }
  const stringSpecifiers = new Set<string>();

  nameAnonymousExports(programPath);

  const { local, sources, hasExports } = getModuleMetadata(
    programPath,
    { initializeReexports, getWrapperPayload },
    stringSpecifiers,
  );

  removeImportExportDeclarations(programPath);

  // Reuse the imported namespace name if there is one.
  for (const [source, metadata] of sources) {
    const { importsNamespace, imports } = metadata;
    // If there is at least one namespace import and other imports, it may collipse with local ident, can be seen in issue 15879.
    if (importsNamespace.size > 0 && imports.size === 0) {
      const [nameOfnamespace] = importsNamespace;
      metadata.name = nameOfnamespace;
    }

    const resolvedInterop = resolveImportInterop(
      importInterop,
      source,
      filename,
    );

    if (resolvedInterop === "none") {
      metadata.interop = "none";
    } else if (resolvedInterop === "node" && metadata.interop === "namespace") {
      metadata.interop = "node-namespace";
    } else if (resolvedInterop === "node" && metadata.interop === "default") {
      metadata.interop = "node-default";
    } else if (esNamespaceOnly && metadata.interop === "namespace") {
      // Both the default and namespace interops pass through __esModule
      // objects, but the namespace interop is used to enable Babel's
      // destructuring-like interop behavior for normal CommonJS.
      // Since some tooling has started to remove that behavior, we expose
      // it as the `esNamespace` option.
      metadata.interop = "default";
    }
  }

  return {
    implicitAssignmentExports: undefined,
    programPath,
    exportName,
    hasExports,
    local,
    source: sources,
    stringSpecifiers,
  };
}

function getExportSpecifierName(
  path: NodePath,
  stringSpecifiers: Set<string>,
): string {
  if (path.isIdentifier()) {
    return path.node.name;
  } else if (path.isStringLiteral()) {
    const stringValue = path.node.value;
    // add specifier value to `stringSpecifiers` only when it can not be converted to an identifier name
    // i.e In `import { "foo" as bar }`
    // we do not consider `"foo"` to be a `stringSpecifier` because we can treat it as
    // `import { foo as bar }`
    // This helps minimize the size of `stringSpecifiers` and reduce overhead of checking valid identifier names
    // when building transpiled code from metadata
    if (!isIdentifierName(stringValue)) {
      stringSpecifiers.add(stringValue);
    }
    return stringValue;
  } else {
    throw new Error(
      `Expected export specifier to be either Identifier or StringLiteral, got ${path.node.type}`,
    );
  }
}

function assertExportSpecifier(
  path: NodePath,
): asserts path is NodePath<t.ExportSpecifier> {
  if (path.isExportSpecifier()) {
    return;
  } else if (path.isExportNamespaceSpecifier()) {
    throw path.buildCodeFrameError(
      "Export namespace should be first transformed by `@babel/plugin-transform-export-namespace-from`.",
    );
  } else {
    throw path.buildCodeFrameError("Unexpected export specifier type");
  }
}

/**
 * Get metadata about the imports and exports present in this module.
 */
function getModuleMetadata(
  programPath: NodePath<t.Program>,
  {
    getWrapperPayload,
    initializeReexports,
  }: {
    getWrapperPayload?: (
      source: string,
      metadata: SourceModuleMetadata,
      importNodes: t.Node[],
    ) => unknown;
    initializeReexports: boolean | void;
  },
  stringSpecifiers: Set<string>,
) {
  const localData = getLocalExportMetadata(
    programPath,
    initializeReexports,
    stringSpecifiers,
  );

  const importNodes = new Map<string, t.Node[]>();
  const sourceData = new Map<string, SourceModuleMetadata>();
  const getData = (sourceNode: t.StringLiteral, node: t.Node) => {
    const source = sourceNode.value;

    let data = sourceData.get(source);
    if (!data) {
      data = {
        name: programPath.scope.generateUidIdentifier(
          basename(source, extname(source)),
        ).name,

        interop: "none",

        loc: null,

        // Data about the requested sources and names.
        imports: new Map(),
        importsNamespace: new Set(),

        // Metadata about data that is passed directly from source to export.
        reexports: new Map(),
        reexportNamespace: new Set(),
        reexportAll: null,

        wrap: null,

        // @ts-expect-error lazy is not listed in the type.
        // This is needed for compatibility with older version of the commonjs
        // plusing.
        // TODO(Babel 8): Remove this
        get lazy() {
          return this.wrap === "lazy";
        },

        referenced: false,
      };
      sourceData.set(source, data);
      importNodes.set(source, [node]);
    } else {
      importNodes.get(source).push(node);
    }
    return data;
  };
  let hasExports = false;
  programPath.get("body").forEach(child => {
    if (child.isImportDeclaration()) {
      const data = getData(child.node.source, child.node);
      if (!data.loc) data.loc = child.node.loc;

      child.get("specifiers").forEach(spec => {
        if (spec.isImportDefaultSpecifier()) {
          const localName = spec.get("local").node.name;

          data.imports.set(localName, "default");

          const reexport = localData.get(localName);
          if (reexport) {
            localData.delete(localName);

            reexport.names.forEach(name => {
              data.reexports.set(name, "default");
            });
            data.referenced = true;
          }
        } else if (spec.isImportNamespaceSpecifier()) {
          const localName = spec.get("local").node.name;

          data.importsNamespace.add(localName);
          const reexport = localData.get(localName);
          if (reexport) {
            localData.delete(localName);

            reexport.names.forEach(name => {
              data.reexportNamespace.add(name);
            });
            data.referenced = true;
          }
        } else if (spec.isImportSpecifier()) {
          const importName = getExportSpecifierName(
            spec.get("imported"),
            stringSpecifiers,
          );
          const localName = spec.get("local").node.name;

          data.imports.set(localName, importName);

          const reexport = localData.get(localName);
          if (reexport) {
            localData.delete(localName);

            reexport.names.forEach(name => {
              data.reexports.set(name, importName);
            });
            data.referenced = true;
          }
        }
      });
    } else if (child.isExportAllDeclaration()) {
      hasExports = true;
      const data = getData(child.node.source, child.node);
      if (!data.loc) data.loc = child.node.loc;

      data.reexportAll = {
        loc: child.node.loc,
      };
      data.referenced = true;
    } else if (child.isExportNamedDeclaration() && child.node.source) {
      hasExports = true;
      const data = getData(child.node.source, child.node);
      if (!data.loc) data.loc = child.node.loc;

      child.get("specifiers").forEach(spec => {
        assertExportSpecifier(spec);
        const importName = getExportSpecifierName(
          spec.get("local"),
          stringSpecifiers,
        );
        const exportName = getExportSpecifierName(
          spec.get("exported"),
          stringSpecifiers,
        );

        data.reexports.set(exportName, importName);
        data.referenced = true;

        if (exportName === "__esModule") {
          throw spec
            .get("exported")
            .buildCodeFrameError('Illegal export "__esModule".');
        }
      });
    } else if (
      child.isExportNamedDeclaration() ||
      child.isExportDefaultDeclaration()
    ) {
      hasExports = true;
    }
  });

  for (const metadata of sourceData.values()) {
    let needsDefault = false;
    let needsNamed = false;

    if (metadata.importsNamespace.size > 0) {
      needsDefault = true;
      needsNamed = true;
    }

    if (metadata.reexportAll) {
      needsNamed = true;
    }

    for (const importName of metadata.imports.values()) {
      if (importName === "default") needsDefault = true;
      else needsNamed = true;
    }
    for (const importName of metadata.reexports.values()) {
      if (importName === "default") needsDefault = true;
      else needsNamed = true;
    }

    if (needsDefault && needsNamed) {
      // TODO(logan): Using the namespace interop here is unfortunate. Revisit.
      metadata.interop = "namespace";
    } else if (needsDefault) {
      metadata.interop = "default";
    }
  }

  if (getWrapperPayload) {
    for (const [source, metadata] of sourceData) {
      metadata.wrap = getWrapperPayload(
        source,
        metadata,
        importNodes.get(source),
      );
    }
  }

  return {
    hasExports,
    local: localData,
    sources: sourceData,
  };
}

type ModuleBindingKind = "import" | "hoisted" | "block" | "var";
/**
 * Get metadata about local variables that are exported.
 */
function getLocalExportMetadata(
  programPath: NodePath<t.Program>,
  initializeReexports: boolean | void,
  stringSpecifiers: Set<string>,
): Map<string, LocalExportMetadata> {
  const bindingKindLookup = new Map();

  programPath.get("body").forEach((child: NodePath) => {
    let kind: ModuleBindingKind;
    if (child.isImportDeclaration()) {
      kind = "import";
    } else {
      if (child.isExportDefaultDeclaration()) {
        child = child.get("declaration");
      }
      if (child.isExportNamedDeclaration()) {
        if (child.node.declaration) {
          child = child.get("declaration");
        } else if (
          initializeReexports &&
          child.node.source &&
          child.get("source").isStringLiteral()
        ) {
          child.get("specifiers").forEach(spec => {
            assertExportSpecifier(spec);
            bindingKindLookup.set(spec.get("local").node.name, "block");
          });
          return;
        }
      }

      if (child.isFunctionDeclaration()) {
        kind = "hoisted";
      } else if (child.isClassDeclaration()) {
        kind = "block";
      } else if (child.isVariableDeclaration({ kind: "var" })) {
        kind = "var";
      } else if (child.isVariableDeclaration()) {
        kind = "block";
      } else {
        return;
      }
    }

    Object.keys(child.getOuterBindingIdentifiers()).forEach(name => {
      bindingKindLookup.set(name, kind);
    });
  });

  const localMetadata = new Map();
  const getLocalMetadata = (idPath: NodePath<t.Identifier>) => {
    const localName = idPath.node.name;
    let metadata = localMetadata.get(localName);

    if (!metadata) {
      const kind = bindingKindLookup.get(localName);

      if (kind === undefined) {
        throw idPath.buildCodeFrameError(
          `Exporting local "${localName}", which is not declared.`,
        );
      }

      metadata = {
        names: [],
        kind,
      };
      localMetadata.set(localName, metadata);
    }
    return metadata;
  };

  programPath.get("body").forEach(child => {
    if (
      child.isExportNamedDeclaration() &&
      (initializeReexports || !child.node.source)
    ) {
      if (child.node.declaration) {
        const declaration = child.get("declaration");
        const ids = declaration.getOuterBindingIdentifierPaths();
        Object.keys(ids).forEach(name => {
          if (name === "__esModule") {
            throw declaration.buildCodeFrameError(
              'Illegal export "__esModule".',
            );
          }
          getLocalMetadata(ids[name]).names.push(name);
        });
      } else {
        child.get("specifiers").forEach(spec => {
          const local = spec.get("local");
          const exported = spec.get("exported");
          const localMetadata = getLocalMetadata(local);
          const exportName = getExportSpecifierName(exported, stringSpecifiers);

          if (exportName === "__esModule") {
            throw exported.buildCodeFrameError('Illegal export "__esModule".');
          }
          localMetadata.names.push(exportName);
        });
      }
    } else if (child.isExportDefaultDeclaration()) {
      const declaration = child.get("declaration");
      if (
        declaration.isFunctionDeclaration() ||
        declaration.isClassDeclaration()
      ) {
        // @ts-expect-error todo(flow->ts): improve babel-types
        getLocalMetadata(declaration.get("id")).names.push("default");
      } else {
        // These should have been removed by the nameAnonymousExports() call.
        throw declaration.buildCodeFrameError(
          "Unexpected default expression export.",
        );
      }
    }
  });
  return localMetadata;
}

/**
 * Ensure that all exported values have local binding names.
 */
function nameAnonymousExports(programPath: NodePath<t.Program>) {
  // Name anonymous exported locals.
  programPath.get("body").forEach(child => {
    if (!child.isExportDefaultDeclaration()) return;
    splitExportDeclaration(child);
  });
}

function removeImportExportDeclarations(programPath: NodePath<t.Program>) {
  programPath.get("body").forEach(child => {
    if (child.isImportDeclaration()) {
      child.remove();
    } else if (child.isExportNamedDeclaration()) {
      if (child.node.declaration) {
        // @ts-expect-error todo(flow->ts): avoid mutations
        child.node.declaration._blockHoist = child.node._blockHoist;
        child.replaceWith(child.node.declaration);
      } else {
        child.remove();
      }
    } else if (child.isExportDefaultDeclaration()) {
      // export default foo;
      const declaration = child.get("declaration");
      if (
        declaration.isFunctionDeclaration() ||
        declaration.isClassDeclaration()
      ) {
        // @ts-expect-error todo(flow->ts): avoid mutations
        declaration._blockHoist = child.node._blockHoist;
        child.replaceWith(
          declaration as NodePath<t.FunctionDeclaration | t.ClassDeclaration>,
        );
      } else {
        // These should have been removed by the nameAnonymousExports() call.
        throw declaration.buildCodeFrameError(
          "Unexpected default expression export.",
        );
      }
    } else if (child.isExportAllDeclaration()) {
      child.remove();
    }
  });
}
