import cp from "child_process";
import util from "util";
import path from "path";
import { fileURLToPath } from "url";
import * as babel from "../../lib";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// "minNodeVersion": "10.0.0" <-- For Ctrl+F when dropping node 10
const nodeSupportsESM = parseInt(process.versions.node) >= 12;
const isWindows = process.platform === "win32";

export const supportsESM = nodeSupportsESM && !isWindows;

export const isMJS = file => path.extname(file) === ".mjs";

export const itESM = supportsESM ? it : it.skip;

export function skipUnsupportedESM(esm, name) {
  if (esm && !nodeSupportsESM) {
    console.warn(
      `Skipping "${name}" because native ECMAScript modules are not supported.`,
    );
    return true;
  }
  // This can be removed when loadOptionsAsyncInSpawedProcess is removed.
  if (esm && isWindows) {
    console.warn(
      `Skipping "${name}" because the ESM runner cannot be spawned on Windows.`,
    );
    return true;
  }
  return false;
}

export function loadOptionsAsync({ filename, cwd = dirname }, mjs) {
  if (mjs) {
    // import() crashes with jest
    return spawn("load-options-async", filename, cwd);
  }

  return babel.loadOptionsAsync({ filename, cwd });
}

export function spawnTransformAsync() {
  // import() crashes with jest
  return spawn("compile-async");
}

export function spawnTransformSync() {
  // import() crashes with jest
  return spawn("compile-sync");
}

// !!!! hack is coming !!!!
// Remove this function when https://github.com/nodejs/node/issues/35889 is resolved.
// Jest supports dynamic import(), but Node.js segfaults when using it in our tests.
async function spawn(runner, filename, cwd = process.cwd()) {
  const { stdout, stderr } = await util.promisify(cp.execFile)(
    require.resolve(`../fixtures/babel-${runner}.mjs`),
    // pass `cwd` as params as `process.cwd()` will normalize `cwd` on macOS
    [filename, cwd],
    { cwd, env: process.env },
  );

  const EXPERIMENTAL_WARNING = /\(node:\d+\) ExperimentalWarning: The ESM module loader is experimental\./;

  if (stderr.replace(EXPERIMENTAL_WARNING, "").trim()) {
    throw new Error(
      `error is thrown in babel-${runner}.mjs: stdout\n` +
        stdout +
        "\nstderr:\n" +
        stderr,
    );
  }
  return JSON.parse(stdout);
}
