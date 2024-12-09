import path from "path";
import fs from "fs";
import { cpus } from "os";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { Transform as TransformStream } from "stream";
import { callbackify } from "util";
import colors from "picocolors";
import gulp from "gulp";
import { rollup } from "rollup";
import {
  babel as rollupBabel,
  getBabelOutputPlugin,
} from "@rollup/plugin-babel";
import rollupCommonJs from "@rollup/plugin-commonjs";
import rollupJson from "@rollup/plugin-json";
import rollupPolyfillNode from "rollup-plugin-polyfill-node";
import rollupNodeResolve from "@rollup/plugin-node-resolve";
import rollupReplace from "@rollup/plugin-replace";
import rollupTerser from "@rollup/plugin-terser";
import rollupDts from "rollup-plugin-dts";
import rollupDts5 from "rollup-plugin-dts-5";
import { Worker as JestWorker } from "jest-worker";
import { Glob } from "glob";
import { resolve as importMetaResolve } from "import-meta-resolve";

import rollupBabelSource from "./scripts/rollup-plugin-babel-source.js";
import rollupStandaloneInternals from "./scripts/rollup-plugin-standalone-internals.js";
import rollupDependencyCondition from "./scripts/rollup-plugin-dependency-condition.js";
import formatCode from "./scripts/utils/formatCode.js";
import { log } from "./scripts/utils/logger.cjs";
import { USE_ESM, commonJS } from "$repo-utils";

const { require, __dirname: monorepoRoot } = commonJS(import.meta.url);

const defaultPackagesGlob = "./@(codemods|packages|eslint)/*";
const defaultSourcesGlob = [
  `${defaultPackagesGlob}/src/**/{*.js,*.cjs,!(*.d).ts,!(*.d).cts}`,
  "!./packages/babel-helpers/src/helpers/*",
];

const babelStandalonePluginConfigGlob =
  "./packages/babel-standalone/scripts/pluginConfig.json";

const buildTypingsWatchGlob = [
  "./packages/babel-types/lib/definitions/**/*.js",
  "./packages/babel-types/scripts/generators/*.js",
];

// env vars from the cli are always strings, so !!ENV_VAR returns true for "false"
function bool(value) {
  return Boolean(value) && value !== "false" && value !== "0";
}

/**
 * map source code path to the generated artifacts path
 * @example
 * mapSrcToLib("packages/babel-core/src/index.js")
 * // returns "packages/babel-core/lib/index.js"
 * @example
 * mapSrcToLib("packages/babel-template/src/index.ts")
 * // returns "packages/babel-template/lib/index.js"
 * @example
 * mapSrcToLib("packages/babel-template/src/index.d.ts")
 * // returns "packages/babel-template/lib/index.d.ts"
 * @param {string} srcPath
 * @returns {string}
 */
function mapSrcToLib(srcPath) {
  const parts = srcPath
    .replace(/(?<!\.d)\.ts$/, ".js")
    .replace(/(?<!\.d)\.cts$/, ".cjs")
    .split("/");
  parts[2] = "lib";
  return parts.join("/");
}

function mapToDts(packageName) {
  return packageName.replace(
    /(?<=\\|\/|^)(packages|eslint|codemods)(?=\\|\/)/,
    "dts/$1"
  );
}

function getIndexFromPackage(name) {
  try {
    fs.statSync(`./${name}/src/index.ts`);
    return `${name}/src/index.ts`;
  } catch {
    return `${name}/src/index.js`;
  }
}

/**
 * @param {string} generator
 * @param {string} pkg
 * @param {string} filename
 * @param {string} message
 */
async function generateHelpers(generator, dest, filename, message) {
  const { default: generateCode } = await import(generator);
  const result = await formatCode(
    await generateCode(filename),
    path.join(dest, filename)
  );
  fs.writeFileSync(path.join(dest, filename), result, { mode: 0o644 });
  log(`${colors.green("✔")} Generated ${message}`);
}

/**
 *
 * @typedef {("asserts" | "builders" | "constants" | "validators")} TypesHelperKind
 * @param {TypesHelperKind} helperKind
 * @param {string} filename
 */
async function generateTypeHelpers(helperKind, filename = "index.ts") {
  return generateHelpers(
    `./packages/babel-types/scripts/generators/${helperKind}.js`,
    `./packages/babel-types/src/${helperKind}/generated/`,
    filename,
    `@babel/types -> ${helperKind}`
  );
}

/**
 *
 * @typedef {("asserts" | "validators")} TraverseHelperKind
 * @param {TraverseHelperKind} helperKind
 */
function generateTraverseHelpers(helperKind, outBase = "") {
  return generateHelpers(
    `./packages/babel-traverse/scripts/generators/${helperKind}.js`,
    `./packages/babel-traverse/src/${outBase}/generated/`,
    `${helperKind}.d.ts`,
    `@babel/traverse -> ${helperKind}`
  );
}

async function generateRuntimeHelpers() {
  await generateHelpers(
    `./packages/babel-helpers/scripts/generate-regenerator-runtime.js`,
    `./packages/babel-helpers/src/helpers/`,
    "regeneratorRuntime.js",
    "@babel/helpers -> regeneratorRuntime"
  );

  return generateHelpers(
    `./packages/babel-helpers/scripts/generate-helpers.js`,
    `./packages/babel-helpers/src/`,
    "helpers-generated.ts",
    "@babel/helpers"
  );
}

const kebabToCamel = str => str.replace(/-[a-z]/g, c => c[1].toUpperCase());

function generateStandalone() {
  const dest = "./packages/babel-standalone/src/generated/";
  return gulp
    .src(babelStandalonePluginConfigGlob, { base: monorepoRoot })
    .pipe(
      new TransformStream({
        objectMode: true,
        transform: callbackify(async file => {
          log("Generating @babel/standalone files");
          const pluginConfig = JSON.parse(file.contents);
          let imports = `import makeNoopPlugin from "../make-noop-plugin.ts";`;
          let exportDecls = "";
          let exportsList = "";
          let allList = "";

          for (const plugin of pluginConfig.noopPlugins) {
            const camelPlugin = kebabToCamel(plugin);
            exportDecls += `${camelPlugin} = makeNoopPlugin(),`;
            allList += `"${plugin}": ${camelPlugin},`;
          }

          for (const plugin of pluginConfig.externalPlugins) {
            const camelPlugin = kebabToCamel(plugin);
            imports += `import ${camelPlugin} from "@babel/plugin-${plugin}";`;
            exportsList += `${camelPlugin},`;
            allList += `"${plugin}": ${camelPlugin},`;
          }

          const fileContents = `/*
   * This file is auto-generated! Do not modify it directly.
   * To re-generate run 'yarn gulp generate-standalone'
   */
  ${imports}
  export const ${exportDecls.slice(0, -1)};
  export {${exportsList}};
  export const all: { [k: string]: any } = {${allList}};`;
          file.path = "plugins.ts";
          file.contents = Buffer.from(
            await formatCode(fileContents, dest + file.path)
          );

          return file;
        }),
      })
    )
    .pipe(gulp.dest(dest));
}

function createWorker(useWorker) {
  const numWorkers = Math.ceil(Math.max(cpus().length, 1) / 2) - 1;
  if (
    numWorkers === 0 ||
    !useWorker ||
    // For some reason, on CircleCI the workers hang indefinitely.
    process.env.CIRCLECI
  ) {
    return require("./babel-worker.cjs");
  }
  const worker = new JestWorker(require.resolve("./babel-worker.cjs"), {
    enableWorkerThreads: true,
    numWorkers,
    exposedMethods: ["transform"],
  });
  worker.getStdout().pipe(process.stdout);
  worker.getStderr().pipe(process.stderr);
  return worker;
}

async function buildBabel(useWorker, ignore = []) {
  const worker = createWorker(useWorker);
  const files = new Glob(defaultSourcesGlob, {
    ignore: ignore.map(p => `${p.src}/**`),
    posix: true,
  });

  const promises = [];
  for await (const file of files) {
    // @example ./packages/babel-parser/src/index.js
    const dest = "./" + mapSrcToLib(file);
    promises.push(
      worker.transform(file, dest, {
        sourceMaps: !file.endsWith(".d.ts"),
      })
    );
  }
  return Promise.allSettled(promises)
    .then(results => {
      results.forEach(result => {
        if (result.status === "rejected") {
          if (process.env.WATCH_SKIP_BUILD) {
            console.error(result.reason);
          } else {
            throw result.reason;
          }
        }
      });
    })
    .finally(() => {
      worker.end?.();
    });
}

/**
 * Resolve a nested dependency starting from the given file
 */
function resolveChain(baseUrl, ...packages) {
  const require = createRequire(baseUrl);

  return packages.reduce(
    (base, pkg) =>
      path.dirname(require.resolve(pkg + "/package.json", { paths: [base] })),
    path.dirname(fileURLToPath(baseUrl))
  );
}

// If this build is part of a pull request, include the pull request number in
// the version number.
let versionSuffix = "";
if (process.env.CIRCLE_PR_NUMBER) {
  versionSuffix = "+pr." + process.env.CIRCLE_PR_NUMBER;
}

const babelVersion =
  require("./packages/babel-core/package.json").version + versionSuffix;
function buildRollup(packages, buildStandalone) {
  const sourcemap = process.env.NODE_ENV === "production";
  return Promise.all(
    packages.map(
      async ({
        src,
        format,
        input,
        dest,
        name,
        filename,
        envName = "rollup",
      }) => {
        const pkgJSON = require("./" + src + "/package.json");
        const version = pkgJSON.version + versionSuffix;
        const { dependencies = {}, peerDependencies = {} } = pkgJSON;
        const external = [
          ...Object.keys(dependencies),
          ...Object.keys(peerDependencies),
          // @babel/compat-data sub exports
          /@babel\/compat-data\/.*/,
          // Ideally they should be constructed from package.json exports
          // required by modules-commonjs
          /babel-plugin-dynamic-import-node\/utils/,
          // required by preset-env
          /@babel\/preset-modules\/.*/,
        ];

        log(`Compiling '${colors.cyan(input)}' with rollup ...`);
        const bundle = await rollup({
          input,
          external: buildStandalone ? [] : external,
          // all node modules are resolved as if they were placed in the n_m folder of package root
          preserveSymlinks: true,
          onwarn(warning, warn) {
            switch (warning.code) {
              case "CIRCULAR_DEPENDENCY":
              case "SOURCEMAP_ERROR": // Rollup warns about the babel-polyfills source maps
              case "INCONSISTENT_IMPORT_ATTRIBUTES": // @rollup/plugin-commonjs transforms require("...json") to an import without attributes
                return;
              case "UNUSED_EXTERNAL_IMPORT":
                warn(warning);
                return;
              case "MISSING_EXPORT":
                // Rollup warns about using babel.default at
                // https://github.com/babel/babel-polyfills/blob/4ac92be5b70b13e3d8a34614d8ecd900eb3f40e4/packages/babel-helper-define-polyfill-provider/src/types.js#L5
                // We can safely ignore this warning, and let Rollup replace it with undefined.
                if (
                  warning.exporter
                    .replace(/\\/g, "/")
                    .endsWith("packages/babel-core/src/index.ts") &&
                  warning.binding === "default" &&
                  [
                    "@babel/helper-define-polyfill-provider",
                    "babel-plugin-polyfill-corejs2",
                    "babel-plugin-polyfill-corejs3",
                    "babel-plugin-polyfill-regenerator",
                  ].some(pkg => warning.id.replace(/\\/g, "/").includes(pkg))
                ) {
                  return;
                }
            }

            // We use console.warn here since it prints more info than just "warn",
            // in case we want to stop throwing for a specific message.
            console.warn(warning);

            // https://github.com/babel/babel/pull/12011#discussion_r540434534
            throw new Error("Rollup aborted due to warnings above");
          },
          plugins: [
            buildStandalone && rollupStandaloneInternals(),
            rollupBabelSource(),
            process.env.STRIP_BABEL_8_FLAG &&
              rollupDependencyCondition(bool(process.env.BABEL_8_BREAKING)),
            rollupReplace({
              preventAssignment: true,
              values: {
                "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
                BABEL_VERSION: JSON.stringify(babelVersion),
                VERSION: JSON.stringify(version),
              },
            }),
            rollupCommonJs({
              include: [
                // Bundle node_modules only when building standalone
                buildStandalone ? /node_modules/ : "./node_modules/*/*.js",
                "packages/babel-runtime/regenerator/**",
                "packages/babel-runtime/helpers/*.js",
                "packages/babel-preset-env/data/*.js",
                // Rollup doesn't read export maps, so it loads the cjs fallback
                "packages/babel-compat-data/*.js",
                // Used by @babel/standalone
                "packages/babel-compat-data/scripts/data/legacy-plugin-aliases.js",
                "packages/*/src/**/*.cjs",
              ],
              ignore:
                process.env.STRIP_BABEL_8_FLAG &&
                bool(process.env.BABEL_8_BREAKING)
                  ? [
                      // These require()s are all in babel-preset-env/src/polyfills/babel-7-plugins.cjs
                      // and packages/babel-preset-env/src/babel-7-available-plugins.cjs.
                      // They are gated by a !process.env.BABEL_8_BREAKING check, but
                      // @rollup/plugin-commonjs extracts them to import statements outside of the
                      // check and thus they end up in the final bundle.
                      "babel-plugin-polyfill-corejs2",
                      "babel-plugin-polyfill-regenerator",
                      "./babel-polyfill.cjs",
                      "./regenerator.cjs",
                      "@babel/compat-data/corejs2-built-ins",
                      "@babel/plugin-syntax-import-assertions",
                      "@babel/plugin-syntax-import-attributes",
                    ]
                  : [],
              dynamicRequireTargets: [
                // https://github.com/mathiasbynens/regexpu-core/blob/ffd8fff2e31f4597f6fdfee75d5ac1c5c8111ec3/rewrite-pattern.js#L48
                resolveChain(
                  import.meta.url,
                  "./packages/babel-helper-create-regexp-features-plugin",
                  "regexpu-core",
                  "regenerate-unicode-properties"
                ).replace(/\\/g, "/") + "/**/*.js", // Must be posix path in rollup 3
              ],
              // Never delegate to the native require()
              ignoreDynamicRequires: false,
              // Align with the Node.js behavior
              defaultIsModuleExports: true,
            }),
            rollupBabel({
              envName,
              babelHelpers: "bundled",
              configFile: "./babel.config.js",
              extensions: [".ts", ".js", ".mjs", ".cjs"],
              ignore: ["packages/babel-runtime/helpers/*.js"],
            }),
            rollupNodeResolve({
              extensions: [".ts", ".js", ".mjs", ".cjs", ".json"],
              browser: buildStandalone,
              exportConditions: buildStandalone ? ["browser"] : [],
              // It needs to be set to 'false' when using rollupNodePolyfills
              // https://github.com/rollup/plugins/issues/772
              preferBuiltins: !buildStandalone,
            }),
            rollupJson(),
            src === "packages/babel-parser" &&
              getBabelOutputPlugin({
                configFile: false,
                babelrc: false,
                plugins: [
                  function babelPluginInlineConstNumericObjects({ types: t }) {
                    return {
                      visitor: {
                        VariableDeclarator(path) {
                          const { node } = path;
                          if (
                            !t.isIdentifier(node.id) ||
                            !t.isObjectExpression(node.init)
                          ) {
                            return;
                          }

                          const binding = path.scope.getBinding(node.id.name);
                          if (!binding.constant) return;

                          const vals = new Map();
                          for (const { key, value } of node.init.properties) {
                            if (!t.isIdentifier(key)) return;
                            if (!t.isNumericLiteral(value)) return;
                            vals.set(key.name, value.value);
                          }

                          let all = true;
                          binding.referencePaths.forEach(({ parentPath }) => {
                            const { node } = parentPath;
                            if (
                              !t.isMemberExpression(node) ||
                              !t.isIdentifier(node.property) ||
                              node.computed ||
                              !vals.has(node.property.name)
                            ) {
                              all = false;
                              return;
                            }
                            parentPath.replaceWith(
                              t.numericLiteral(vals.get(node.property.name))
                            );
                          });

                          if (all) path.remove();
                        },
                      },
                    };
                  },
                ],
              }),
            buildStandalone &&
              rollupPolyfillNode({
                sourceMap: sourcemap,
                include: "**/*.{js,mjs,cjs,ts}",
              }),
          ].filter(Boolean),
        });

        const outputFile = path.join(src, dest, filename || "index.js");
        await bundle.write({
          esModule: true,
          file: outputFile,
          format,
          name,
          sourcemap: sourcemap,
          exports: "named",
          interop(id) {
            // We have manually applied commonjs-esm interop to the source
            // for library not in this monorepo
            // https://github.com/babel/babel/pull/12795
            if (!id.startsWith("@babel/")) return "default";

            // Some syntax plugins have been archived
            if (id.includes("plugin-syntax")) {
              const srcPath = path.join(
                path.dirname(fileURLToPath(import.meta.url)),
                "/packages/" + id.replace("@babel/", "babel-")
              );
              if (!fs.existsSync(srcPath)) return "default";
            }

            if (id.includes("@babel/preset-modules")) {
              return "default";
            }

            return "auto";
          },
        });

        // Only minify @babel/standalone
        if (!buildStandalone) {
          return;
        }

        if (!process.env.IS_PUBLISH) {
          log(
            colors.yellow(
              `Skipped minification of '${colors.cyan(
                outputFile
              )}' because not publishing`
            )
          );
          return undefined;
        }
        log(`Minifying '${colors.cyan(outputFile)}'...`);

        await bundle.write({
          file: outputFile.replace(/\.js$/, ".min.js"),
          format,
          esModule: true,
          interop: "compat",
          name,
          sourcemap: sourcemap,
          exports: "named",
          plugins: [
            rollupTerser({
              // workaround https://bugs.webkit.org/show_bug.cgi?id=212725
              format: {
                ascii_only: true,
              },
              maxWorkers: process.env.CIRCLECI ? 1 : undefined,
            }),
          ],
        });
      }
    )
  );
}

function buildRollupDts(packages) {
  async function build(input, output, banner, packageName) {
    log(`Bundling '${colors.cyan(output)}' with rollup ...`);

    let external;
    if (packageName) {
      const pkgJSON = require("./" + packageName + "/package.json");
      const {
        dependencies = {},
        devDependencies = {},
        peerDependencies = {},
      } = pkgJSON;
      external = [
        ...Object.keys(dependencies),
        ...Object.keys(peerDependencies),
        // TODO: These should all be moved to dependencies
        ...Object.keys(devDependencies),
      ].map(dep => new RegExp(`^${dep}(?:/.+)?$`));
    }

    const bundle = await rollup({
      input,
      plugins: [
        {
          transform: code =>
            code.replace(
              /type BABEL_8_BREAKING\s*=\s*boolean/g,
              `type BABEL_8_BREAKING = ${bool(process.env.BABEL_8_BREAKING)}`
            ),
        },
        bool(process.env.BABEL_8_BREAKING) ? rollupDts() : rollupDts5(),
      ],
      external,
      onwarn(warning) {
        if (
          warning.code === "UNUSED_EXTERNAL_IMPORT" &&
          warning.names.length === 1 &&
          warning.names[0] === "default"
        ) {
          // rollup-plugin-dts doesn't like default imports when they are just re-exported
          return;
        }
        if (warning.code === "UNRESOLVED_IMPORT" && warning.exporter === "vm") {
          // TODO: We probably need @types/node
          return;
        }
        console.warn(warning);
      },
    });

    await bundle.write({
      file: output,
      format: "es",
      banner,
    });
  }

  const tasks = packages.map(async packageName => {
    const input = `${mapToDts(packageName)}/src/index.d.ts`;
    const output = `${packageName}/lib/index.d.ts`;

    await build(input, output, "", packageName);
  });

  tasks.push(
    build(
      "packages/babel-parser/typings/babel-parser.source.d.ts",
      "packages/babel-parser/typings/babel-parser.d.ts",
      "// This file is auto-generated! Do not modify it directly.\n" +
        // @typescript-eslint/no-redundant-type-constituents can be removed once we drop the IF_BABEL_7 type
        "/* eslint-disable @typescript-eslint/consistent-type-imports, @typescript-eslint/no-redundant-type-constituents */",
      "packages/babel-parser"
    )
  );

  return Promise.all(tasks);
}

function* packagesIterator(exclude) {
  for (const packageDir of ["packages", "codemods"]) {
    for (const dir of fs.readdirSync(new URL(packageDir, import.meta.url))) {
      const src = `${packageDir}/${dir}`;
      if (exclude.has(src)) continue;
      if (!fs.existsSync(new URL(`${src}/package.json`, import.meta.url))) {
        continue;
      }
      yield src;
    }
  }
}

function* libBundlesIterator() {
  const noBundle = new Set(
    [
      // @rollup/plugin-commonjs will mess up with babel-helper-fixtures
      "babel-helper-fixtures",
      // babel-standalone is handled by rollup-babel-standalone task
      "babel-standalone",
      // todo: Rollup hangs on allowHashBang: true with babel-cli/src/babel/index.ts hashbang
      "babel-cli",
      // todo: @rollup/node-resolve 'browsers' option does not work when package.json contains `exports`
      // https://github.com/rollup/plugins/tree/master/packages/node-resolve#browser
      "babel-register",
      "babel-core",
      "babel-plugin-transform-runtime",
      // @babel/node invokes internal lib/_babel-node.js
      "babel-node",
      // todo: test/helpers/define-helper requires internal lib/helpers access
      "babel-helpers",
      // multiple exports
      "babel-plugin-transform-react-jsx",
      // rollup bug https://github.com/babel/babel/pull/16001
      "babel-helper-builder-react-jsx",
      // exit-loader.cjs
      "babel-helper-transform-fixture-test-runner",
    ].map(n => `packages/${n}`)
  );
  for (const src of packagesIterator(noBundle)) {
    const pkgJSON = JSON.parse(
      fs.readFileSync(new URL(`${src}/package.json`, import.meta.url))
    );
    if (pkgJSON.main) {
      yield {
        src,
        format: USE_ESM ? "esm" : "cjs",
        dest: "lib",
        input: getIndexFromPackage(src),
      };
    } else if (pkgJSON.bin) {
      for (const binPath of Object.values(pkgJSON.bin)) {
        const filename = binPath.slice(binPath.lastIndexOf("/") + 1);
        const input =
          src === "packages/babel-cli" && filename === "babel.js"
            ? `${src}/src/babel/index.ts`
            : `${src}/src/${filename.slice(0, -3) + ".ts"}`;
        yield {
          src,
          format: USE_ESM ? "esm" : "cjs",
          dest: "lib",
          filename,
          input,
        };
      }
    }
  }
}

let libBundles;
if (bool(process.env.BABEL_8_BREAKING)) {
  libBundles = Array.from(libBundlesIterator());
} else {
  libBundles = [
    "packages/babel-code-frame",
    "packages/babel-parser",
    "packages/babel-plugin-proposal-destructuring-private",
    "packages/babel-plugin-transform-object-rest-spread",
    "packages/babel-plugin-transform-optional-chaining",
    "packages/babel-preset-react",
    "packages/babel-plugin-transform-destructuring",
    "packages/babel-preset-typescript",
    "packages/babel-helper-member-expression-to-functions",
    "packages/babel-plugin-bugfix-v8-spread-parameters-in-optional-chaining",
    "packages/babel-plugin-bugfix-v8-static-class-fields-redefine-readonly",
    "packages/babel-plugin-bugfix-safari-id-destructuring-collision-in-function-expression",
    "packages/babel-plugin-bugfix-safari-class-field-initializer-scope",
  ].map(src => ({
    src,
    format: USE_ESM ? "esm" : "cjs",
    dest: "lib",
    input: getIndexFromPackage(src),
  }));
}

const cjsBundles = [
  // This is used by @babel/register and @babel/eslint-parser
  { src: "packages/babel-parser" },
];

const dtsBundles = bool(process.env.BABEL_8_BREAKING)
  ? Array.from(
      packagesIterator(
        new Set([
          // CLIs
          "packages/babel-cli",
          "packages/babel-node",
          // This will be just JSON
          "packages/babel-compat-data",
          // Not meant to be consumed manually
          "packages/babel-runtime",
          "packages/babel-runtime-corejs2",
          "packages/babel-runtime-corejs3",
          // TODO: Add type definitions
          "packages/babel-register",
        ])
      )
    )
  : ["packages/babel-types"];

const standaloneBundle = [
  {
    src: "packages/babel-standalone",
    format: "umd",
    name: "Babel",
    filename: "babel.js",
    dest: "",
    version: babelVersion,
    envName: "standalone",
    input: getIndexFromPackage("packages/babel-standalone"),
  },
];

gulp.task("generate-type-helpers", () => {
  log("Generating @babel/types and @babel/traverse dynamic functions");

  return Promise.all([
    generateTypeHelpers("asserts"),
    generateTypeHelpers("builders"),
    generateTypeHelpers("builders", "uppercase.js"),
    generateTypeHelpers("constants"),
    generateTypeHelpers("validators"),
    generateTypeHelpers("ast-types"),
    generateTraverseHelpers("asserts", "path"),
    generateTraverseHelpers("validators", "path"),
    generateTraverseHelpers("visitor-types"),
  ]);
});

gulp.task("generate-runtime-helpers", () => {
  log("Generating @babel/helpers runtime helpers");

  return generateRuntimeHelpers();
});

gulp.task("generate-standalone", () => generateStandalone());

gulp.task("build-rollup", () => buildRollup(libBundles));
gulp.task("rollup-babel-standalone", () => buildRollup(standaloneBundle, true));
gulp.task(
  "build-babel-standalone",
  gulp.series("generate-standalone", "rollup-babel-standalone")
);

gulp.task("bundle-dts", () => buildRollupDts(dtsBundles));

gulp.task("build-babel", () => buildBabel(true, /* exclude */ libBundles));

gulp.task("build-vendor", async () => {
  const input = fileURLToPath(
    importMetaResolve("import-meta-resolve", import.meta.url)
  );
  const output = "./packages/babel-core/src/vendor/import-meta-resolve.js";

  const bundle = await rollup({
    input,
    onwarn(warning, warn) {
      if (warning.code === "CIRCULAR_DEPENDENCY") return;
      warn(warning);
    },
    plugins: [
      rollupCommonJs({ defaultIsModuleExports: true }),
      rollupNodeResolve({
        extensions: [".js", ".mjs", ".cjs", ".json"],
        preferBuiltins: true,
      }),
      {
        // Remove the node: prefix from imports, so that it works in old Node.js version
        // TODO(Babel 8): This can be removed.
        transform: code => code.replace(/(?<=from ["'])node:/g, ""),
      },
    ],
  });

  await bundle.write({
    file: output,
    format: "es",
    sourcemap: false,
    exports: "named",
    banner: String.raw`
/****************************************************************************\
 *                         NOTE FROM BABEL AUTHORS                          *
 * This file is inlined from https://github.com/wooorm/import-meta-resolve, *
 * because we need to compile it to CommonJS.                               *
\****************************************************************************/

/*
${fs.readFileSync(path.join(path.dirname(input), "license"), "utf8")}*/
`,
  });

  fs.writeFileSync(
    output.replace(".js", ".d.ts"),
    `export function resolve(specifier: string, parent: string): string;`
  );
});

gulp.task("build-cjs-bundles", () => {
  if (!USE_ESM) {
    log(
      colors.yellow(
        "Skipping CJS-compat bundles for ESM-based builds, because not compiling to ESM"
      )
    );
    return Promise.resolve();
  }
  return Promise.all(
    cjsBundles.map(async ({ src, external = [] }) => {
      const input = `./${src}/lib/index.js`;
      const output = `./${src}/lib/index.cjs`;

      const bundle = await rollup({
        input,
        external,
        onwarn(warning, warn) {
          if (warning.code === "CIRCULAR_DEPENDENCY") return;
          warn(warning);
        },
        plugins: [
          rollupCommonJs({ defaultIsModuleExports: true }),
          rollupNodeResolve({
            extensions: [".js", ".mjs", ".cjs", ".json"],
            preferBuiltins: true,
          }),
        ],
      });

      await bundle.write({
        file: output,
        format: "cjs",
        interop: "compat",
        sourcemap: false,
      });
    })
  );
});

gulp.task(
  "build",
  gulp.series(
    "build-vendor",
    gulp.parallel("build-rollup", "build-babel"),
    gulp.parallel("generate-type-helpers", "generate-runtime-helpers"),
    // rebuild @babel/types and @babel/helpers since
    // type-helpers and generated helpers may be changed
    gulp.parallel("build-rollup", "build-babel"),
    gulp.parallel("generate-standalone", "build-cjs-bundles")
  )
);

gulp.task("default", gulp.series("build"));

// First build on worker processes for compilation speed
gulp.task("build-no-bundle", () => buildBabel(true));
// Incremental builds take place in main process
gulp.task("build-no-bundle-watch", () => buildBabel(false));

gulp.task(
  "build-dev",
  gulp.series(
    "build-vendor",
    "build-no-bundle",
    gulp.parallel(
      "generate-standalone",
      "generate-runtime-helpers",
      gulp.series(
        "generate-type-helpers",
        // rebuild @babel/types since type-helpers may be changed
        "build-no-bundle",
        "build-cjs-bundles"
      )
    )
  )
);

function watch() {
  gulp.watch(
    defaultSourcesGlob,
    gulp.series("build-no-bundle-watch", "build-cjs-bundles")
  );
  gulp.watch(babelStandalonePluginConfigGlob, gulp.task("generate-standalone"));
  gulp.watch(buildTypingsWatchGlob, gulp.task("generate-type-helpers"));
  gulp.watch(
    [
      "./packages/babel-helpers/src/helpers/*",
      "!./packages/babel-helpers/src/helpers/regeneratorRuntime.js",
    ],
    gulp.task("generate-runtime-helpers")
  );
  if (USE_ESM) {
    gulp.watch(
      cjsBundles.map(({ src }) => `./${src}/lib/**.js`),
      gulp.task("build-cjs-bundles")
    );
  }
}

gulp.task(
  "watch",
  process.env.WATCH_SKIP_BUILD ? watch : gulp.series("build-dev", watch)
);
