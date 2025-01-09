// @ts-expect-error no types
import cloneDeep = require("clone-deep");
import path = require("path");
import fs = require("fs");

const babel = require("./babel-core.cjs");
const registerCache = require("./cache.cjs");

const nmRE = escapeRegExp(path.sep + "node_modules" + path.sep);

function escapeRegExp(string: string) {
  return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
}

type CacheItem = { value: { code: string; map: any }; mtime: number };

let cache: Record<string, CacheItem>;
let transformOpts: any;
function setOptions(opts: any) {
  if (opts.cache === false && cache) {
    registerCache.clear();
    cache = null;
  } else if (opts.cache !== false && !cache) {
    registerCache.load();
    cache = registerCache.get();
  }

  delete opts.cache;
  delete opts.extensions;

  transformOpts = {
    ...opts,
    caller: {
      name: "@babel/register",
      ...(opts.caller || {}),
    },
  };

  let { cwd = "." } = transformOpts;

  // Ensure that the working directory is resolved up front so that
  // things don't break if it changes later.
  cwd = transformOpts.cwd = path.resolve(cwd);

  if (transformOpts.ignore === undefined && transformOpts.only === undefined) {
    const cwdRE = escapeRegExp(cwd);

    // Only compile things inside the current working directory.
    transformOpts.only = [new RegExp("^" + cwdRE, "i")];
    // Ignore any node_modules inside the current working directory.
    transformOpts.ignore = [
      new RegExp(`^${cwdRE}(?:${path.sep}.*)?${nmRE}`, "i"),
    ];
  }
}

async function transform(input: string, filename: string) {
  const opts = await babel.loadOptionsAsync({
    // sourceRoot can be overwritten
    sourceRoot: path.dirname(filename) + path.sep,
    ...cloneDeep(transformOpts),
    filename,
  });

  // Bail out ASAP if the file has been ignored.
  if (opts === null) return null;

  const { cached, store } = cacheLookup(opts, filename);
  if (cached) return cached;

  const { code, map } = await babel.transformAsync(input, {
    ...opts,
    sourceMaps: opts.sourceMaps === undefined ? "both" : opts.sourceMaps,
    ast: false,
  });

  return store({ code, map });
}

export = { setOptions, transform };

if (!process.env.BABEL_8_BREAKING) {
  module.exports.transformSync = function (input: string, filename: string) {
    const opts = new babel.OptionManager().init({
      // sourceRoot can be overwritten
      sourceRoot: path.dirname(filename) + path.sep,
      ...cloneDeep(transformOpts),
      filename,
    });

    // Bail out ASAP if the file has been ignored.
    if (opts === null) return null;

    const { cached, store } = cacheLookup(opts, filename);
    if (cached) return cached;

    const { code, map } = babel.transformSync(input, {
      ...opts,
      sourceMaps: opts.sourceMaps === undefined ? "both" : opts.sourceMaps,
      ast: false,
    });

    return store({ code, map });
  };
}

const id = (value: unknown) => value;

function cacheLookup(opts: unknown, filename: string) {
  if (!cache) return { cached: null, store: id };

  let cacheKey = `${JSON.stringify(opts)}:${babel.version}`;

  const env = babel.getEnv();
  if (env) cacheKey += `:${env}`;

  const cached = cache[cacheKey];
  const fileMtime = +fs.statSync(filename).mtime;

  if (cached && cached.mtime === fileMtime) {
    return { cached: cached.value, store: id };
  }

  return {
    cached: null,
    store(value: CacheItem["value"]) {
      cache[cacheKey] = { value, mtime: fileMtime };
      registerCache.setDirty();
      return value;
    },
  };
}
