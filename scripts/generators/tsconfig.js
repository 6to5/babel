import fs from "fs";
import archivedSyntaxPkgs from "./archived-syntax-pkgs.json" with { type: "json" };

function importJSON(path) {
  return JSON.parse(fs.readFileSync(path));
}

function maybeWriteFile(url, contents) {
  try {
    if (fs.readFileSync(url, "utf8") === contents) return;
  } catch {}
  fs.writeFileSync(url, contents);
}

const thirdPartyBabelPlugins = [
  "@babel/preset-modules/lib/plugins/transform-async-arrows-in-class",
  "@babel/preset-modules/lib/plugins/transform-edge-default-parameters",
  "@babel/preset-modules/lib/plugins/transform-edge-function-name",
  "@babel/preset-modules/lib/plugins/transform-tagged-template-caching",
  "@babel/preset-modules/lib/plugins/transform-safari-block-shadowing",
  "@babel/preset-modules/lib/plugins/transform-safari-for-shadowing",
  "babel-plugin-polyfill-corejs2",
  "babel-plugin-polyfill-corejs3",
  "babel-plugin-polyfill-regenerator",
  "regenerator-transform",
];

const rootURL = new URL("../../", import.meta.url);

// used in /lib/third-party.d.ts
const dependencyAliases = new Map([
  ["babel-plugin-polyfill-corejs2", "@babel/helper-plugin-utils"],
  ["babel-plugin-polyfill-corejs3", "@babel/helper-plugin-utils"],
  ["babel-plugin-polyfill-regenerator", "@babel/helper-plugin-utils"],
  ["@babel/preset-modules", "@babel/helper-plugin-utils"],
  ["regenerator-transform", "@babel/helper-plugin-utils"],
]);

function getTsPkgs(subRoot) {
  return fs
    .readdirSync(new URL(subRoot, rootURL))
    .filter(name => name.startsWith("babel-"))
    .map(name => ({
      name: name.replace(/^babel-/, "@babel/"),
      relative: `./${subRoot}/${name}`,
    }))
    .filter(({ name, relative }) => {
      const ret =
        // They are special-cased because them dose not have a index.ts
        name === "@babel/register" ||
        name === "@babel/cli" ||
        name === "@babel/node" ||
        name === "@babel/eslint-parser" ||
        // @babel/compat-data is used by preset-env
        name === "@babel/compat-data" ||
        fs.existsSync(new URL(relative + "/src/index.ts", rootURL));
      if (!ret) {
        // console.log(`Skipping ${name} for tsconfig.json`);
      }
      return ret;
    })
    .map(({ name, relative }) => {
      const packageJSON = importJSON(
        new URL(relative + "/package.json", rootURL)
      );
      try {
        fs.rmSync(new URL(relative + "/tsconfig.json", rootURL));
      } catch {}
      // Babel 8 exports > Babel 7 exports > {}
      const exports =
        packageJSON.conditions?.BABEL_8_BREAKING?.[0]?.exports ??
        packageJSON.exports ??
        {};
      const subExports = Object.entries(exports).flatMap(
        ([_export, exportPath]) => {
          // The @babel/standalone has babel.js as exports, but we don't have src/babel.ts
          if (name === "@babel/standalone") {
            return [["", "/src"]];
          }
          if (name === "@babel/compat-data") {
            // map ./plugins to ./data/plugins.json
            const subExport = _export.slice(1);
            const subExportPath = exportPath
              .replace("./", "/data/")
              .replace(/\.js$/, ".json");
            return [[subExport, subExportPath]];
          }
          // [{esm, default}, "./lib/index.js"]
          if (Array.isArray(exportPath)) {
            exportPath = exportPath[1];
          }
          if (typeof exportPath === "object") {
            exportPath = exportPath.default;
          }
          if (
            exportPath.startsWith("./lib") &&
            (exportPath.endsWith(".js") || exportPath.endsWith(".cjs"))
          ) {
            // remove the leading `.` and trailing `.js`
            const subExport = _export.slice(1).replace(/\.c?js$/, "");
            const subExportPath = exportPath
              .replace("./lib", "/src")
              .replace(/\.js$/, ".ts")
              .replace(/\.cjs$/, ".cts")
              .replace(/\/index\.c?ts$/, "");
            return [[subExport, subExportPath]];
          }
          return [];
        }
      );
      const dependencies = new Set([
        ...Object.keys(packageJSON.dependencies ?? {}),
        ...(name === "@babel/standalone"
          ? Object.keys(packageJSON.devDependencies ?? {})
          : []),
        ...Object.keys(packageJSON.peerDependencies ?? {}),
      ]);
      if (name === "@babel/core") {
        // This dependency is only used in Babel 7, and does not affect
        // types. Remove it to avoid a cycle.
        dependencies.delete("@babel/helper-module-transforms");
      }
      dependencyAliases.forEach((alias, dep) => {
        if (dependencies.has(dep)) dependencies.add(alias);
      });
      return [
        name,
        {
          name,
          relative,
          subExports,
          dependencies,
          dfsOutIndex: -1,
          cycleRoot: name,
        },
      ];
    });
}

const tsPkgs = new Map([
  ...getTsPkgs("packages"),
  ...getTsPkgs("eslint"),
  ...getTsPkgs("codemods"),
]);

const roots = new Set(tsPkgs.keys());

tsPkgs.forEach(({ dependencies }) => {
  dependencies.forEach(dep => {
    if (!tsPkgs.has(dep)) dependencies.delete(dep);
    roots.delete(dep);
  });
});

const seen = new Set();
const stack = [];
let index = 0;
for (const name of roots) {
  (function dfs(node) {
    if (seen.has(node)) {
      if (stack.includes(node.cycleRoot)) {
        for (
          let i = stack.length - 1;
          i >= 0 && stack[i] !== node.cycleRoot;
          i--
        ) {
          tsPkgs.get(stack[i]).cycleRoot = node.cycleRoot;
        }
      }
      return;
    }
    seen.add(node);
    stack.push(node.name);
    for (const dep of node.dependencies) {
      dfs(tsPkgs.get(dep));
    }
    stack.pop();
    node.dfsOutIndex = index++;
  })(tsPkgs.get(name));
}

// Find strongly connected components
const sccs = new Map();
for (const [name, node] of tsPkgs) {
  let { cycleRoot } = node;
  if (name !== cycleRoot) {
    let rootNode = tsPkgs.get(cycleRoot);
    while (rootNode.name !== rootNode.cycleRoot) {
      ({ cycleRoot } = rootNode);
      rootNode = tsPkgs.get(cycleRoot);
    }
    if (!sccs.has(cycleRoot)) sccs.set(cycleRoot, [cycleRoot]);
    sccs.get(cycleRoot).push(name);
    node.dfsOutIndex = tsPkgs.get(cycleRoot).dfsOutIndex;
    node.cycleRoot = cycleRoot;
  }
}
sccs.forEach(scc => {
  console.log("SCC:", scc.join(" <> "));
});
if (sccs.size > 0) {
  throw new Error("Cycles detected");
}

const topoSorted = Array.from(tsPkgs.values()).sort((a, b) => {
  return a.dfsOutIndex - b.dfsOutIndex;
});

const projectsFolders = new Map();

for (let i = 0; i < topoSorted.length; i++) {
  const root = tsPkgs.get(topoSorted[i].cycleRoot);
  const chunk = [topoSorted[i]];
  const index = root.dfsOutIndex;
  while (i + 1 < topoSorted.length && topoSorted[i + 1].dfsOutIndex === index) {
    i++;
    chunk.push(topoSorted[i]);
  }
  chunk.sort();

  const allDeps = new Set();
  chunk.forEach(({ name, dependencies }) => {
    dependencies.forEach(allDeps.add, allDeps);
    projectsFolders.set(name, root.relative);
  });
  chunk.forEach(({ name }) => allDeps.delete(name));

  const tsConfig = buildTSConfig(
    chunk,
    allDeps,
    fs.existsSync(new URL(root.relative + "/tsconfig.overrides.json", rootURL))
  );

  maybeWriteFile(
    new URL(root.relative + "/tsconfig.json", rootURL),
    "/* This file is automatically generated by scripts/generators/tsconfig.js */\n" +
      JSON.stringify(tsConfig, null, 2)
  );
}

function buildTSConfig(pkgs, allDeps, hasOverrides) {
  const paths = {};
  const referencePaths = new Set();

  for (const name of allDeps) {
    const { relative, subExports } = tsPkgs.get(name);
    for (const [subExport, subExportPath] of subExports) {
      paths[name + subExport] = ["../../" + relative.slice(2) + subExportPath];
    }
    referencePaths.add("../../" + projectsFolders.get(name).slice(2));
  }

  return {
    extends: [
      "../../tsconfig.base.json",
      "../../tsconfig.paths.json",
      hasOverrides && "./tsconfig.overrides.json",
    ].filter(Boolean),
    include: pkgs
      .map(({ name, relative }) => {
        return name === "@babel/eslint-parser" || name === "@babel/register"
          ? `../../${relative.slice(2)}/src/**/*.cts`
          : `../../${relative.slice(2)}/src/**/*.ts`;
      })
      .concat(
        [
          "../../lib/globals.d.ts",
          "../../scripts/repo-utils/*.d.ts",
          pkgs.some(p => p.name === "@babel/parser")
            ? "../../packages/babel-parser/typings/*.d.ts"
            : null,
        ].filter(Boolean)
      ),
    references: Array.from(referencePaths, path => ({ path })),
  };
}

maybeWriteFile(
  new URL("tsconfig.paths.json", rootURL),
  "/* This file is automatically generated by scripts/generators/tsconfig.js */\n" +
    JSON.stringify(
      {
        compilerOptions: {
          paths: Object.fromEntries([
            ...Array.from(tsPkgs.values()).flatMap(
              ({ name, relative, subExports }) => {
                return subExports.map(([subExport, subExportPath]) => {
                  return [name + subExport, [relative + subExportPath]];
                });
              }
            ),
            ...archivedSyntaxPkgs.map(name => [
              name,
              ["./lib/archived-libs.d.ts"],
            ]),
            ...thirdPartyBabelPlugins.map(name => [
              name,
              ["./lib/third-party-libs.d.ts"],
            ]),
            [
              "babel-plugin-dynamic-import-node/utils",
              ["./lib/babel-plugin-dynamic-import-node.d.ts"],
            ],
            ["commander", ["./lib/third-party-libs.d.ts"]],
            ["glob", ["./node_modules/glob-BABEL_8_BREAKING-true"]],
            ["globals", ["./node_modules/globals-BABEL_8_BREAKING-true"]],
            ["js-tokens", ["./node_modules/js-tokens-BABEL_8_BREAKING-true"]],
            ["regexpu-core", ["./lib/regexpu-core.d.ts"]],
            [
              "to-fast-properties",
              ["./node_modules/to-fast-properties-BABEL_8_BREAKING-true"],
            ],
            ["slash", ["./node_modules/slash-BABEL_8_BREAKING-true"]],
            ["kexec", ["./lib/kexec.d.ts"]],
          ]),
        },
      },
      null,
      2
    )
);

maybeWriteFile(
  new URL("tsconfig.json", rootURL),
  "/* This file is automatically generated by scripts/generators/tsconfig.js */\n" +
    JSON.stringify(
      {
        extends: ["./tsconfig.base.json", "./tsconfig.paths.json"],
        compilerOptions: {
          skipLibCheck: false,
        },
        include: [
          "./lib/libdom-minimal.d.ts",
          "packages/babel-parser/typings/*.d.ts",
          "dts/**/*.d.ts",
        ],
        references: Array.from(new Set(projectsFolders.values()))
          .sort()
          .map(path => ({ path })),
      },
      null,
      2
    )
);
