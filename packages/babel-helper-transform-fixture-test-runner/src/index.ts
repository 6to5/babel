/* eslint-env jest */
import * as babel from "@babel/core";
import {
  buildExternalHelpers,
  type InputOptions,
  type FileResult,
} from "@babel/core";
import {
  default as getFixtures,
  resolveOptionPluginOrPreset,
  readFile,
  type Test,
  type TestFile,
  type TaskOptions,
} from "@babel/helper-fixtures";
import { codeFrameColumns } from "@babel/code-frame";
import * as helpers from "./helpers.ts";
import visualizeSourceMap from "./source-map-visualizer.ts";
import assert from "assert";
import fs, { readFileSync, realpathSync } from "fs";
import path from "path";
import vm from "vm";
import LruCache from "lru-cache";
import { fileURLToPath } from "url";
import { diff } from "jest-diff";
import type { ChildProcess } from "child_process";
import { spawn } from "child_process";
import os from "os";
import readdirRecursive from "fs-readdir-recursive";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const dirname = path.dirname(fileURLToPath(import.meta.url));

import checkDuplicateNodes from "@babel/helper-check-duplicate-nodes";
import { createHash } from "crypto";

type Module = {
  id: string;
  exports: Record<string, unknown>;
};

if (!process.env.BABEL_8_BREAKING) {
  // Introduced in Node.js 10
  if (!assert.rejects) {
    assert.rejects = async function (block, validateError) {
      try {
        await (typeof block === "function" ? block() : block);
        return Promise.reject(new Error("Promise not rejected"));
      } catch (error) {
        // @ts-expect-error Fixme: validateError can be a string | object
        // see https://nodejs.org/api/assert.html#assertrejectsasyncfn-error-message
        if (typeof validateError === "function" && !validateError(error)) {
          return Promise.reject(
            new Error("Promise rejected with invalid error"),
          );
        }
      }
    };
  }
}

const EXTERNAL_HELPERS_VERSION = "7.100.0";

const cachedScripts = new LruCache<
  string,
  { code: string; cachedData?: Buffer }
>({ max: 10 });
const contextModuleCache = new WeakMap();

// We never want our tests to accidentally load the root
// babel.config.js file, so we disable config loading by
// default. Tests can still set `configFile: true | string`
// to re-enable config loading.
function transformWithoutConfigFile(code: string, opts: InputOptions) {
  return babel.transformSync(code, {
    configFile: false,
    babelrc: false,
    ...opts,
  });
}
function transformAsyncWithoutConfigFile(code: string, opts: InputOptions) {
  return babel.transformAsync(code, {
    configFile: false,
    babelrc: false,
    ...opts,
  });
}

export function createTestContext() {
  const context = vm.createContext({
    ...helpers,
    process: process,
    transform: transformWithoutConfigFile,
    transformAsync: transformAsyncWithoutConfigFile,
    setTimeout: setTimeout,
    setImmediate: setImmediate,
    expect,
  });
  context.global = context;

  const moduleCache = Object.create(null);
  contextModuleCache.set(context, moduleCache);

  // Populate the "babelHelpers" global with Babel's helper utilities.
  runCacheableScriptInTestContext(
    path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "babel-helpers-in-memory.js",
    ),
    buildExternalHelpers,
    context,
    moduleCache,
  );

  return context;
}

function runCacheableScriptInTestContext(
  filename: string,
  srcFn: () => string,
  context: vm.Context,
  moduleCache: any,
): Module {
  let cached = cachedScripts.get(filename);
  if (!cached) {
    const code = `(function (exports, require, module, __filename, __dirname) {\n${srcFn()}\n});`;
    cached = {
      code,
      cachedData: undefined,
    };
    cachedScripts.set(filename, cached);
  }

  let script: vm.Script;
  if (process.env.BABEL_8_BREAKING) {
    script = new vm.Script(cached.code, {
      filename,
      lineOffset: -1,
      cachedData: cached.cachedData,
    });
    cached.cachedData = script.createCachedData();
  } else {
    script = new vm.Script(cached.code, {
      filename,
      lineOffset: -1,
      cachedData: cached.cachedData,
      produceCachedData: true,
    });
    if (script.cachedDataProduced) {
      cached.cachedData = script.cachedData;
    }
  }

  const module = {
    id: filename,
    exports: {},
  };
  moduleCache[filename] = module;

  const req = (id: string) =>
    runModuleInTestContext(id, filename, context, moduleCache);
  const dirname = path.dirname(filename);

  script
    .runInContext(context)
    .call(module.exports, module.exports, req, module, filename, dirname);

  return module;
}

/**
 * A basic implementation of CommonJS so we can execute `@babel/polyfill` inside our test context.
 * This allows us to run our unittests
 */
function runModuleInTestContext(
  id: string,
  relativeFilename: string,
  context: vm.Context,
  moduleCache: any,
) {
  const filename = require.resolve(id, {
    paths: [path.dirname(relativeFilename)],
  });

  // Expose Node-internal modules if the tests want them. Note, this will not execute inside
  // the context's global scope.
  if (filename === id) return require(id);

  // Modules can only evaluate once per context, so the moduleCache is a
  // stronger cache guarantee than the LRU's Script cache.
  if (moduleCache[filename]) return moduleCache[filename].exports;

  return runCacheableScriptInTestContext(
    filename,
    () => fs.readFileSync(filename, "utf8"),
    context,
    moduleCache,
  ).exports;
}

let sharedTestContext: vm.Context;

/**
 * Run the given snippet of code inside a CommonJS module.
 *
 * Exposed for unit tests, not for use as an API.
 */
export function runCodeInTestContext(
  code: string,
  opts: {
    filename: string;
  },
  context = (sharedTestContext ??= createTestContext()),
) {
  const filename = opts.filename;
  const dirname = path.dirname(filename);
  const moduleCache = contextModuleCache.get(context);
  const req = (id: string) =>
    runModuleInTestContext(id, filename, context, moduleCache);

  const module: Module = {
    id: filename,
    exports: {},
  };

  const oldCwd = process.cwd();
  try {
    if (opts.filename) process.chdir(path.dirname(opts.filename));

    // Expose the test options as "opts", but otherwise run the test in a CommonJS-like environment.
    // Note: This isn't doing .call(module.exports, ...) because some of our tests currently
    // rely on 'this === global'.
    const src = `(function(exports, require, module, __filename, __dirname, opts) {\n${code}\n});`;
    return vm.runInContext(src, context, {
      filename,
      displayErrors: true,
      lineOffset: -1,
    })(module.exports, req, module, filename, dirname, opts);
  } finally {
    process.chdir(oldCwd);
  }
}

async function maybeMockConsole<R>(
  validateLogs: boolean,
  run: () => Promise<R>,
) {
  const actualLogs = { stdout: "", stderr: "" };

  if (!validateLogs) return { result: await run(), actualLogs };

  const spy1 = jest.spyOn(console, "log").mockImplementation(msg => {
    actualLogs.stdout += `${msg}\n`;
  });
  const spy2 = jest.spyOn(console, "warn").mockImplementation(msg => {
    actualLogs.stderr += `${msg}\n`;
  });

  try {
    return { result: await run(), actualLogs };
  } finally {
    spy1.mockRestore();
    spy2.mockRestore();
  }
}

async function run(task: Test) {
  const {
    actual,
    expect: expected,
    exec,
    options: opts,
    doNotSetSourceType,
    optionsDir,
    validateLogs,
    ignoreOutput,
    stdout,
    stderr,
  } = task;

  // todo(flow->ts) add proper return type (added any, because empty object is inferred)
  function getOpts(self: TestFile): any {
    const newOpts = {
      ast: true,
      cwd: path.dirname(self.loc),
      filename: self.loc,
      filenameRelative: self.filename,
      sourceFileName: self.filename,
      ...(doNotSetSourceType ? {} : { sourceType: "script" }),
      babelrc: false,
      configFile: false,
      inputSourceMap: task.inputSourceMap || undefined,
      ...opts,
    };

    return resolveOptionPluginOrPreset(newOpts, optionsDir);
  }

  let execCode = exec.code;
  let result: FileResult;
  let resultExec;

  let execErr: Error;

  if (execCode) {
    const context = createTestContext();
    const execOpts = getOpts(exec);

    // Ignore Babel logs of exec.js files.
    // They will be validated in input/output files.
    ({ result } = await maybeMockConsole(validateLogs, () =>
      babel.transformAsync(execCode, execOpts),
    ));

    checkDuplicateNodes(result.ast);
    execCode = result.code;

    try {
      resultExec = runCodeInTestContext(execCode, execOpts, context);
    } catch (err) {
      // Pass empty location to include the whole file in the output.
      if (typeof err === "object" && err.message) {
        err.message =
          `${exec.loc}: ${err.message}\n` +
          codeFrameColumns(execCode, {} as any);
      }

      execErr = err;
    }
  }

  const inputCode = actual.code;
  const expectedCode = expected.code;
  if (!execCode || inputCode) {
    let actualLogs;

    ({ result, actualLogs } = await maybeMockConsole(validateLogs, () =>
      babel.transformAsync(inputCode, getOpts(actual)),
    ));

    const outputCode = normalizeOutput(result.code, {
      normalizePathSeparator: true,
    });

    checkDuplicateNodes(result.ast);
    if (!ignoreOutput) {
      if (
        !expected.code &&
        outputCode &&
        !opts.throws &&
        fs.statSync(path.dirname(expected.loc)).isDirectory() &&
        !process.env.CI
      ) {
        const expectedFile = expected.loc.replace(
          /\.m?js$/,
          result.sourceType === "module" ? ".mjs" : ".js",
        );

        console.log(`New test file created: ${expectedFile}`);
        fs.writeFileSync(expectedFile, `${outputCode}\n`);

        if (expected.loc !== expectedFile) {
          try {
            fs.unlinkSync(expected.loc);
          } catch (_) {}
        }
      } else {
        validateFile(outputCode, expected.loc, expectedCode);

        if (inputCode) {
          expect(expected.loc).toMatch(
            result.sourceType === "module" ? /\.mjs$/ : /\.js$/,
          );
        }
      }
    }

    if (validateLogs) {
      const normalizationOpts = {
        normalizePathSeparator: true,
        normalizePresetEnvDebug: task.taskDir.includes("babel-preset-env"),
      };

      validateFile(
        normalizeOutput(actualLogs.stdout, normalizationOpts),
        stdout.loc,
        process.env.BABEL_8_BREAKING
          ? // In Babel 8, preset-env does not enable all the unnecessary syntax
            // plugins. For simplicity, just strip them fro the expected output
            // so that we do not need to separate tests for every fixture.
            stdout.code.replace(
              /\n\s*syntax-(?!import-attributes|import-assertions).*/g,
              "",
            )
          : stdout.code,
      );
      validateFile(
        normalizeOutput(actualLogs.stderr, normalizationOpts),
        stderr.loc,
        stderr.code,
      );
    }
  }

  if (execErr) {
    throw execErr;
  }

  if (task.validateSourceMapVisual === true) {
    const visual = visualizeSourceMap(result.code, result.map);
    try {
      expect(visual).toEqual(task.sourceMapVisual.code);
    } catch (e) {
      if (!process.env.OVERWRITE && task.sourceMapVisual.code) throw e;

      console.log(`Updated test file: ${task.sourceMapVisual.loc}`);
      fs.writeFileSync(
        task.sourceMapVisual.loc ?? task.taskDir + "/source-map-visual.txt",
        visual + "\n",
      );
    }
  }

  if (opts.sourceMaps === true) {
    try {
      expect(result.map).toEqual(task.sourceMap);
    } catch (e) {
      if (!process.env.OVERWRITE && task.sourceMap) throw e;

      task.sourceMapFile.loc ??= task.taskDir + "/source-map.json";

      console.log(`Updated test file: ${task.sourceMapFile.loc}`);
      fs.writeFileSync(
        task.sourceMapFile.loc,
        JSON.stringify(result.map, null, 2),
      );
    }
  }

  if (execCode && resultExec) {
    return resultExec;
  }
}

function validateFile(
  actualCode: string,
  expectedLoc: string,
  expectedCode: string,
) {
  if (actualCode !== expectedCode) {
    if (process.env.OVERWRITE) {
      console.log(`Updated test file: ${expectedLoc}`);
      fs.writeFileSync(expectedLoc, `${actualCode}\n`);
      return;
    }

    throw new Error(
      `Expected ${expectedLoc} to match transform output.\n` +
        `To autogenerate a passing version of this file, delete ` +
        `the file and re-run the tests.\n\n` +
        `Diff:\n\n${diff(expectedCode, actualCode, { expand: false })}`,
    );
  }
}

function escapeRegExp(string: string) {
  return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
}

function normalizeOutput(
  code: string,
  { normalizePathSeparator = false, normalizePresetEnvDebug = false } = {},
) {
  const dir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../../",
  );
  const symbol = "<CWD>";
  let result = code
    .trim()
    // (non-win32) /foo/babel/packages -> <CWD>/packages
    // (win32) C:\foo\babel\packages -> <CWD>\packages
    .replace(new RegExp(escapeRegExp(dir), "g"), symbol);
  if (process.platform === "win32") {
    result = result
      // C:/foo/babel/packages -> <CWD>/packages
      .replace(new RegExp(escapeRegExp(dir.replace(/\\/g, "/")), "g"), symbol)
      // C:\\foo\\babel\\packages -> <CWD>\\packages (in js string literal)
      .replace(
        new RegExp(escapeRegExp(dir.replace(/\\/g, "\\\\")), "g"),
        symbol,
      );
    if (normalizePathSeparator) {
      result = result.replace(
        new RegExp(`${escapeRegExp(symbol)}[\\w\\\\/.-]+`, "g"),
        path => path.replace(/\\\\?/g, "/"),
      );
    }
  }

  if (!process.env.BABEL_8_BREAKING) {
    // In Babel 8, preset-env logs transform- instead of proposal-. Manually rewrite
    // the output logs so that we don't have to duplicate all the debug fixtures for
    // the two different Babel versions.
    if (normalizePresetEnvDebug) {
      result = result.replace(/(\s+)proposal-/g, "$1transform-");
    }

    // For some reasons, in older Node.js versions some symlinks are not properly
    // resolved. The behavior is still ok, but we need to unify the output with
    // newer Node.js versions.
    if (parseInt(process.versions.node, 10) <= 8) {
      result = result.replace(
        /<CWD>\/node_modules\/@babel\/runtime-corejs3/g,
        "<CWD>/packages/babel-runtime-corejs3",
      );
    }
  }

  return result;
}

export type SuiteOptions = {
  ignoreSuites?: string[];
  ignoreTasks?: string[];
};

export default function (
  fixturesLoc: string,
  name: string,
  suiteOpts: SuiteOptions = {},
  taskOpts: TaskOptions = {},
  dynamicOpts?: (options: TaskOptions, task: Test) => void,
) {
  const suites = getFixtures(fixturesLoc);

  for (const testSuite of suites) {
    if (suiteOpts.ignoreSuites?.includes(testSuite.title)) continue;

    describe(name + "/" + testSuite.title, function () {
      if (
        !process.env.IS_PUBLISH &&
        process.env.TEST_babel7plugins_babel8core
      ) {
        // Make sure that the ESM version of @babel/core is always loaded
        // for babel7-8 interop tests.
        // In `eval` so that it doesn't cause a syntax error when running
        // tests in old Node.js.
        beforeAll(() => eval('import("@babel/core")').catch(console.error));
      }

      for (const task of testSuite.tests) {
        if (
          suiteOpts.ignoreTasks?.includes(task.title) ||
          suiteOpts.ignoreTasks?.includes(testSuite.title + "/" + task.title)
        ) {
          continue;
        }

        const testFn = task.disabled ? it.skip : it;
        const testTitle =
          typeof task.disabled === "string"
            ? `(SKIP: ${task.disabled}) ${task.title}`
            : task.title;

        testFn(
          testTitle,

          async function () {
            const runTask = () => run(task);

            if ("sourceMap" in task.options) {
              throw new Error(
                "`sourceMap` option is deprecated. Use `sourceMaps` instead.",
              );
            }

            if ("sourceMaps" in task.options === false) {
              task.options.sourceMaps = !!task.sourceMap;
            }

            Object.assign(task.options, taskOpts);

            if (dynamicOpts) dynamicOpts(task.options, task);

            if (task.externalHelpers) {
              (task.options.plugins ??= [])
                // @ts-expect-error manipulating input options
                .push([
                  "external-helpers",
                  { helperVersion: EXTERNAL_HELPERS_VERSION },
                ]);
            }

            const throwMsg = task.options.throws;
            if (throwMsg) {
              // internal api doesn't have this option but it's best not to pollute
              // the options object with useless options
              delete task.options.throws;

              await assert.rejects(runTask, function (err: Error) {
                assert.ok(
                  throwMsg === true || err.message.includes(throwMsg),
                  `
Expected Error: ${throwMsg}
Actual Error: ${err.message}`,
                );
                return true;
              });
            } else {
              return runTask();
            }
          },
        );
      }
    });
  }
}

export type ProcessTestOpts = {
  args: string[];
  executor?: string;
  ipc?: boolean;
  ipcMessage?: string;
  stdout?: string;
  stderr?: string;
  stdin?: string;
  stdoutPath?: string;
  stderrPath?: string;
  stdoutContains?: boolean;
  stderrContains?: boolean;
  testLoc?: string;
  outFiles?: Record<string, string>;
  inFiles?: Record<string, string>;
  noBabelrc?: boolean;
  minNodeVersion?: number;
  flaky?: boolean;
  env?: Record<string, string>;
  BABEL_8_BREAKING?: boolean;
};

export type ProcessTest = {
  suiteName: string;
  testName: string;
  skip: boolean;
  fn: Function;
  opts: ProcessTestOpts;
  binLoc?: string;
};

export type ProcessTestBeforeHook = (test: ProcessTest, tmpDir: string) => void;
export type ProcessTestAfterHook = (
  test: ProcessTest,
  tmpDir: string,
  stdout: string,
  stderr: string,
) => {
  stdout: string;
  stderr: string;
};

const nodeGte8 = parseInt(process.versions.node, 10) >= 8;

// https://github.com/nodejs/node/issues/11422#issue-208189446
const tmpDir = realpathSync(os.tmpdir());

const readDir = function (loc: string, pathFilter: (arg0: string) => boolean) {
  const files: Record<string, string> = {};
  if (fs.existsSync(loc)) {
    if (process.env.BABEL_8_BREAKING) {
      fs.readdirSync(loc, { withFileTypes: true, recursive: true })
        .filter(dirent => dirent.isFile() && pathFilter(dirent.name))
        .forEach(dirent => {
          const fullpath = path.join(dirent.path, dirent.name);
          files[path.relative(loc, fullpath)] = readFile(fullpath);
        });
    } else {
      readdirRecursive(loc, pathFilter).forEach(function (filename) {
        files[filename] = readFile(path.join(loc, filename));
      });
    }
  }
  return files;
};

const outputFileSync = function (filePath: string, data: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, data);
};

function deleteDir(path: string): void {
  fs.rmSync(path, { force: true, recursive: true });
}

const pathFilter = function (x: string) {
  return path.basename(x) !== ".DS_Store";
};

const assertTest = function (
  stdout: string,
  stderr: string,
  ipcMessage: unknown,
  opts: ProcessTestOpts,
  tmpDir: string,
) {
  const expectStderr = opts.stderr.trim();
  stderr = stderr.trim();

  try {
    if (opts.stderr) {
      if (opts.stderrContains) {
        expect(stderr).toContain(expectStderr);
      } else {
        expect(stderr).toBe(expectStderr);
      }
    } else if (stderr) {
      throw new Error("stderr:\n" + stderr);
    }
  } catch (e) {
    if (!process.env.OVERWRITE) throw e;
    console.log(`Updated test file: ${opts.stderrPath}`);
    outputFileSync(opts.stderrPath, stderr + "\n");
  }

  const expectStdout = opts.stdout.trim();
  stdout = stdout.trim();
  stdout = stdout.replace(/\\/g, "/");

  try {
    if (opts.stdout) {
      if (opts.stdoutContains) {
        expect(stdout).toContain(expectStdout);
      } else {
        expect(stdout).toBe(expectStdout);
      }
    } else if (stdout) {
      throw new Error("stdout:\n" + stdout);
    }
  } catch (e) {
    if (!process.env.OVERWRITE) throw e;
    console.log(`Updated test file: ${opts.stdoutPath}`);
    outputFileSync(opts.stdoutPath, stdout + "\n");
  }

  if (opts.ipc) {
    expect(ipcMessage).toEqual(opts.ipcMessage);
  }

  if (opts.outFiles) {
    const actualFiles = readDir(tmpDir, pathFilter);

    Object.keys(actualFiles).forEach(function (filename) {
      try {
        if (
          // saveInFiles always creates an empty .babelrc, so lets exclude for now
          filename !== ".babelrc" &&
          filename !== ".babelignore" &&
          !Object.hasOwn(opts.inFiles, filename)
        ) {
          const expected = opts.outFiles[filename];
          const actual = actualFiles[filename];

          expect(actual).toBe(expected || "");
        }
      } catch (e) {
        if (!process.env.OVERWRITE) {
          e.message += "\n at " + filename;
          throw e;
        }
        const expectedLoc = path.join(opts.testLoc, "out-files", filename);
        console.log(`Updated test file: ${expectedLoc}`);
        outputFileSync(expectedLoc, actualFiles[filename]);
      }
    });

    Object.keys(opts.outFiles).forEach(function (filename) {
      expect(actualFiles).toHaveProperty([filename]);
    });
  }
};

export function buildParallelProcessTests(name: string, tests: ProcessTest[]) {
  return function (curr: number, total: number) {
    const sliceLength = Math.ceil(tests.length / total);
    const sliceStart = curr * sliceLength;
    const sliceEnd = sliceStart + sliceLength;
    const testsSlice = tests.slice(sliceStart, sliceEnd);

    describe(`${name} [${curr}/${total}]`, function () {
      it("dummy", () => {});
      for (const test of testsSlice) {
        (test.skip ? it.skip : it)(
          test.suiteName + " " + test.testName,
          test.fn as any,
        );
      }
    });
  };
}

export function buildProcessTests(
  dir: string,
  beforeHook: ProcessTestBeforeHook,
  afterHook?: ProcessTestAfterHook,
) {
  const tests: ProcessTest[] = [];

  fs.readdirSync(dir).forEach(function (suiteName) {
    if (suiteName.startsWith(".") || suiteName === "package.json") return;

    const suiteLoc = path.join(dir, suiteName);

    fs.readdirSync(suiteLoc).forEach(function (testName) {
      if (testName.startsWith(".")) return;

      const testLoc = path.join(suiteLoc, testName);

      let opts: ProcessTestOpts = {
        args: [],
      };

      const optionsLoc = path.join(testLoc, "options.json");
      if (fs.existsSync(optionsLoc)) {
        const taskOpts = JSON.parse(readFileSync(optionsLoc, "utf8"));
        if (taskOpts.os) {
          let os = taskOpts.os;

          if (!Array.isArray(os) && typeof os !== "string") {
            throw new Error(
              `'os' should be either string or string array: ${taskOpts.os}`,
            );
          }

          if (typeof os === "string") {
            os = [os];
          }

          if (!os.includes(process.platform)) {
            return;
          }

          delete taskOpts.os;
        }
        opts = { args: [], ...taskOpts };
      }

      const executorLoc = path.join(testLoc, "executor.js");
      if (fs.existsSync(executorLoc)) {
        opts.executor = executorLoc;
      }

      opts.stderrPath = path.join(testLoc, "stderr.txt");
      opts.stdoutPath = path.join(testLoc, "stdout.txt");
      for (const key of ["stdout", "stdin", "stderr"] as const) {
        const loc = path.join(testLoc, key + ".txt");
        if (fs.existsSync(loc)) {
          opts[key] = readFile(loc);
        } else {
          opts[key] = opts[key] || "";
        }
      }

      opts.testLoc = testLoc;
      opts.outFiles = readDir(path.join(testLoc, "out-files"), pathFilter);
      opts.inFiles = readDir(path.join(testLoc, "in-files"), pathFilter);

      const babelrcLoc = path.join(testLoc, ".babelrc");
      const babelIgnoreLoc = path.join(testLoc, ".babelignore");
      if (fs.existsSync(babelrcLoc)) {
        // copy .babelrc file to tmp directory
        opts.inFiles[".babelrc"] = readFile(babelrcLoc);
      } else if (!opts.noBabelrc) {
        opts.inFiles[".babelrc"] = "{}";
      }
      if (fs.existsSync(babelIgnoreLoc)) {
        // copy .babelignore file to tmp directory
        opts.inFiles[".babelignore"] = readFile(babelIgnoreLoc);
      }

      const skip =
        (opts.minNodeVersion &&
          parseInt(process.versions.node, 10) < opts.minNodeVersion) ||
        (opts.flaky && !process.env.BABEL_CLI_FLAKY_TESTS) ||
        (process.env.BABEL_8_BREAKING
          ? opts.BABEL_8_BREAKING === false
          : opts.BABEL_8_BREAKING === true);

      if (opts.flaky) {
        testName += " (flaky)";
      }

      const test: ProcessTest = {
        suiteName,
        testName,
        skip,
        opts,
        fn: function (callback: Function) {
          const tmpLoc = path.join(
            tmpDir,
            "babel-process-test",
            createHash("sha1").update(testLoc).digest("hex"),
          );
          deleteDir(tmpLoc);
          fs.mkdirSync(tmpLoc, { recursive: true });

          const { inFiles } = opts;
          for (const filename of Object.keys(inFiles)) {
            outputFileSync(path.join(tmpLoc, filename), inFiles[filename]);
          }

          try {
            beforeHook(test, tmpLoc);

            if (test.binLoc === undefined) {
              throw new Error("test.binLoc is undefined");
            }

            let args =
              opts.executor && nodeGte8
                ? [
                    "--require",
                    path.join(dirname, "./exit-loader.cjs"),
                    test.binLoc,
                  ]
                : [test.binLoc];

            args = args.concat(opts.args);
            const env = { ...process.env, FORCE_COLOR: "false", ...opts.env };
            const child = spawn(process.execPath, args, {
              env,
              cwd: tmpLoc,
              stdio:
                (opts.executor && nodeGte8) || opts.ipc
                  ? ["pipe", "pipe", "pipe", "ipc"]
                  : "pipe",
            });

            let stderr = "";
            let stdout = "";
            let ipcMessage: unknown;

            child.on("close", function () {
              let err;

              try {
                const result = afterHook
                  ? afterHook(test, tmpLoc, stdout, stderr)
                  : { stdout, stderr };
                assertTest(
                  result.stdout,
                  result.stderr,
                  ipcMessage,
                  opts,
                  tmpLoc,
                );
              } catch (e) {
                err = e;
              } finally {
                try {
                  deleteDir(tmpLoc);
                } catch (error) {
                  console.error(error);
                }
              }

              if (err) {
                err.message =
                  args.map(arg => `"${arg}"`).join(" ") + ": " + err.message;
              }

              callback(err);
            });

            if (opts.ipc) {
              child.on("message", function (message) {
                ipcMessage = message;
              });
            }

            if (opts.stdin) {
              child.stdin.write(opts.stdin);
              child.stdin.end();
            }

            const captureOutput = (proc: ChildProcess) => {
              proc.stderr.on("data", function (chunk) {
                stderr += chunk;
              });

              proc.stdout.on("data", function (chunk) {
                stdout += chunk;
              });
            };

            if (opts.executor) {
              const executor = spawn(process.execPath, [opts.executor], {
                cwd: tmpLoc,
              });

              child.stdout.pipe(executor.stdin);
              child.stderr.pipe(executor.stdin);

              executor.on("close", function () {
                if (nodeGte8) {
                  child.send("exit");
                } else {
                  child.kill("SIGKILL");
                }
              });

              captureOutput(executor);
            } else {
              captureOutput(child);
            }
          } catch (e) {
            deleteDir(tmpLoc);
            throw e;
          }
        },
      };
      tests.push(test);
    });
  });

  tests.sort(function (testA, testB) {
    const nameA = testA.suiteName + "/" + testA.testName;
    const nameB = testB.suiteName + "/" + testB.testName;
    return nameA.localeCompare(nameB);
  });

  return tests;
}
