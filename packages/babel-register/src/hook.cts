import type { IClient, Options } from "./types.cts";

import pirates = require("pirates");
const sourceMapSupport: typeof import("@cspotcode/source-map-support") = process
  .env.BABEL_8_BREAKING
  ? require("@cspotcode/source-map-support")
  : require("source-map-support");

let piratesRevert: () => void;
const maps = Object.create(null);

function installSourceMapSupport() {
  // @ts-expect-error assign to function
  installSourceMapSupport = () => {};

  sourceMapSupport.install({
    handleUncaughtExceptions: false,
    environment: "node",
    retrieveSourceMap(filename: string) {
      const map = maps?.[filename];
      if (map) {
        return { url: null, map: map };
      } else {
        return null;
      }
    },
  });
}

if (!process.env.BABEL_8_BREAKING) {
  // Babel 7 compiles files in the same thread where it hooks `require()`,
  // so we must prevent mixing Babel plugin dependencies with the files
  // to be compiled.
  // All the `!process.env.BABEL_8_BREAKING` code in this file is for
  // this purpose.

  const Module = require("module");

  let compiling = false;
  const internalModuleCache = Module._cache;

  // eslint-disable-next-line no-var
  var compileBabel7 = function compileBabel7(
    client: IClient,
    code: string,
    filename: string,
  ) {
    // @ts-expect-error Babel 7 property
    if (!client.isLocalClient) return compile(client, code, filename);

    if (compiling) return code;

    const globalModuleCache = Module._cache;
    try {
      compiling = true;
      Module._cache = internalModuleCache;
      return compile(client, code, filename);
    } finally {
      compiling = false;
      Module._cache = globalModuleCache;
    }
  };
}

function compile(client: IClient, inputCode: string, filename: string) {
  const result = client.transform(inputCode, filename);

  if (result === null) return inputCode;

  const { code, map } = result;
  if (map) {
    maps[filename] = map;
    installSourceMapSupport();
  }
  return code;
}

function register(client: IClient, opts: Options = {}) {
  if (piratesRevert) piratesRevert();

  piratesRevert = pirates.addHook(
    (process.env.BABEL_8_BREAKING ? compile : compileBabel7).bind(null, client),
    {
      exts: opts.extensions ?? client.getDefaultExtensions(),
      ignoreNodeModules: false,
    },
  );

  client.setOptions(opts);
}

function revert() {
  if (piratesRevert) piratesRevert();
}

export = { register, revert };
