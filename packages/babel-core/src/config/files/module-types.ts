import { isAsync, waitFor } from "../../gensync-utils/async.ts";
import type { Handler } from "gensync";
import path from "path";
import { pathToFileURL } from "url";
import { createRequire } from "module";
import semver from "semver";
import buildDebug from "debug";

import { endHiddenCallStack } from "../../errors/rewrite-stack-trace.ts";
import ConfigError from "../../errors/config-error.ts";

import type { InputOptions } from "../index.ts";
import { transformFileSync } from "../../transform-file.ts";

const debug = buildDebug("babel:config:loading:files:module-types");

const require = createRequire(import.meta.url);

if (!process.env.BABEL_8_BREAKING) {
  try {
    // Old Node.js versions don't support import() syntax.
    // eslint-disable-next-line no-var
    var import_:
      | ((specifier: string | URL) => any)
      | undefined = require("./import.cjs");
  } catch {}
}

export const supportsESM = semver.satisfies(
  process.versions.node,
  // older versions, starting from 10, support the dynamic
  // import syntax but always return a rejected promise.
  "^12.17 || >=13.2",
);

const LOADING_CJS_FILES = new Set();

function loadCjsDefault(filepath: string) {
  // The `require()` call below can make this code reentrant if a require hook
  // like @babel/register has been loaded into the system. That would cause
  // Babel to attempt to compile the `.babelrc.js` file as it loads below. To
  // cover this case, we auto-ignore re-entrant config processing. ESM loaders
  // do not have this problem, because loaders do not apply to themselves.
  if (LOADING_CJS_FILES.has(filepath)) {
    debug("Auto-ignoring usage of config %o.", filepath);
    return {};
  }

  let module;
  try {
    LOADING_CJS_FILES.add(filepath);
    module = endHiddenCallStack(require)(filepath);
  } finally {
    LOADING_CJS_FILES.delete(filepath);
  }

  if (process.env.BABEL_8_BREAKING) {
    return module != null &&
      (module.__esModule || module[Symbol.toStringTag] === "Module")
      ? module.default
      : module;
  } else {
    return module != null &&
      (module.__esModule || module[Symbol.toStringTag] === "Module")
      ? module.default ||
          /* fallbackToTranspiledModule */ (arguments[1] ? module : undefined)
      : module;
  }
}

const loadMjsFromPath = endHiddenCallStack(async function loadMjsFromPath(
  filepath: string,
) {
  // Add ?import as a workaround for https://github.com/nodejs/node/issues/55500
  const url = pathToFileURL(filepath).toString() + "?import";

  if (process.env.BABEL_8_BREAKING) {
    return await import(url);
  } else {
    if (!import_) {
      throw new ConfigError(
        "Internal error: Native ECMAScript modules aren't supported by this platform.\n",
        filepath,
      );
    }

    return await import_(url);
  }
});

const SUPPORTED_EXTENSIONS = {
  ".js": "unknown",
  ".mjs": "esm",
  ".cjs": "cjs",
  ".ts": "unknown",
  ".mts": "esm",
  ".cts": "cjs",
} as const;

const asyncModules = new Set();

export default function* loadCodeDefault(
  filepath: string,
  loader: "require" | "auto",
  esmError: string,
  tlaError: string,
): Handler<unknown> {
  let async;

  const ext = path.extname(filepath);
  const isTS = ext === ".ts" || ext === ".cts" || ext === ".mts";

  const type =
    SUPPORTED_EXTENSIONS[
      Object.hasOwn(SUPPORTED_EXTENSIONS, ext)
        ? (ext as keyof typeof SUPPORTED_EXTENSIONS)
        : (".js" as const)
    ];

  const pattern = `${loader} ${type}` as const;
  switch (pattern) {
    case "require cjs":
    case "auto cjs":
      if (isTS) {
        return ensureTsSupport(filepath, ext, () => loadCjsDefault(filepath));
      } else if (process.env.BABEL_8_BREAKING) {
        return loadCjsDefault(filepath);
      } else {
        return loadCjsDefault(
          filepath,
          // @ts-ignore(Babel 7 vs Babel 8) Removed in Babel 8
          /* fallbackToTranspiledModule */ arguments[2],
        );
      }
    case "auto unknown":
    case "require unknown":
    case "require esm":
      try {
        if (isTS) {
          return ensureTsSupport(filepath, ext, () => loadCjsDefault(filepath));
        } else if (process.env.BABEL_8_BREAKING) {
          return loadCjsDefault(filepath);
        } else {
          return loadCjsDefault(
            filepath,
            // @ts-ignore(Babel 7 vs Babel 8) Removed in Babel 8
            /* fallbackToTranspiledModule */ arguments[2],
          );
        }
      } catch (e) {
        if (
          e.code === "ERR_REQUIRE_ASYNC_MODULE" ||
          // Node.js 13.0.0 throws ERR_REQUIRE_CYCLE_MODULE instead of
          // ERR_REQUIRE_ASYNC_MODULE when requiring a module a second time
          // https://github.com/nodejs/node/issues/55516
          // This `asyncModules` won't catch all of such cases, but it will
          // at least catch those caused by Babel trying to load a module twice.
          (e.code === "ERR_REQUIRE_CYCLE_MODULE" && asyncModules.has(filepath))
        ) {
          asyncModules.add(filepath);
          if (!(async ??= yield* isAsync())) {
            throw new ConfigError(tlaError, filepath);
          }
          // fall through: require() failed due to TLA
        } else if (
          e.code === "ERR_REQUIRE_ESM" ||
          (!process.env.BABEL_8_BREAKING && type === "esm")
        ) {
          // fall through: require() failed due to ESM
        } else {
          throw e;
        }
      }
    // fall through: require() failed due to ESM or TLA, try import()
    case "auto esm":
      if ((async ??= yield* isAsync())) {
        const promise = isTS
          ? ensureTsSupport(filepath, ext, () => loadMjsFromPath(filepath))
          : loadMjsFromPath(filepath);

        return (yield* waitFor(promise)).default;
      }
      throw new ConfigError(esmError, filepath);
    default:
      throw new Error("Internal Babel error: unreachable code.");
  }
}

function ensureTsSupport<T>(
  filepath: string,
  ext: string,
  callback: () => T,
): T {
  if (
    require.extensions[".ts"] ||
    require.extensions[".cts"] ||
    require.extensions[".mts"]
  ) {
    return callback();
  }

  if (ext !== ".cts") {
    throw new ConfigError(
      `\
You are using a ${ext} config file, but Babel only supports transpiling .cts configs. Either:
- Use a .cts config file
- Update to Node.js 23.6.0, which has native TypeScript support
- Install ts-node to transpile ${ext} files on the fly\
`,
      filepath,
    );
  }

  const opts: InputOptions = {
    babelrc: false,
    configFile: false,
    sourceType: "unambiguous",
    sourceMaps: "inline",
    sourceFileName: path.basename(filepath),
    presets: [
      [
        getTSPreset(filepath),
        {
          onlyRemoveTypeImports: true,
          optimizeConstEnums: true,
          ...(process.env.BABEL_8_BREAKING ? {} : { allowDeclareFields: true }),
        },
      ],
    ],
  };

  let handler: NodeJS.RequireExtensions[""] = function (m, filename) {
    // If we want to support `.ts`, `.d.ts` must be handled specially.
    if (handler && filename.endsWith(".cts")) {
      try {
        // @ts-expect-error Undocumented API
        return m._compile(
          transformFileSync(filename, {
            ...opts,
            filename,
          }).code,
          filename,
        );
      } catch (error) {
        // TODO(Babel 8): Add this as an optional peer dependency
        // eslint-disable-next-line import/no-extraneous-dependencies
        const packageJson = require("@babel/preset-typescript/package.json");
        if (semver.lt(packageJson.version, "7.21.4")) {
          console.error(
            "`.cts` configuration file failed to load, please try to update `@babel/preset-typescript`.",
          );
        }
        throw error;
      }
    }
    return require.extensions[".js"](m, filename);
  };
  require.extensions[ext] = handler;

  try {
    return callback();
  } finally {
    if (require.extensions[ext] === handler) delete require.extensions[ext];
    handler = undefined;
  }
}

function getTSPreset(filepath: string) {
  try {
    // eslint-disable-next-line import/no-extraneous-dependencies
    return require("@babel/preset-typescript");
  } catch (error) {
    if (error.code !== "MODULE_NOT_FOUND") throw error;

    let message =
      "You appear to be using a .cts file as Babel configuration, but the `@babel/preset-typescript` package was not found: please install it!";

    if (!process.env.BABEL_8_BREAKING) {
      if (process.versions.pnp) {
        // Using Yarn PnP, which doesn't allow requiring packages that are not
        // explicitly specified as dependencies.
        message += `
If you are using Yarn Plug'n'Play, you may also need to add the following configuration to your .yarnrc.yml file:

packageExtensions:
\t"@babel/core@*":
\t\tpeerDependencies:
\t\t\t"@babel/preset-typescript": "*"
`;
      }
    }

    throw new ConfigError(message, filepath);
  }
}
