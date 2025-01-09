"use strict";

const path = require("path");
const fs = require("fs");
const os = require("os");
const findCacheDir = require("find-cache-dir");

let FILENAME = process.env.BABEL_CACHE_PATH;

// This function needs to be exported before requiring ./babel-core, because
// there is a circular dependency between these two files.
exports.initializeCacheFilename = function () {
  FILENAME ||= path.join(
    findCacheDir({ name: "@babel/register" }) || os.homedir() || os.tmpdir(),
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    `.babel.${babel.version}.${babel.getEnv()}.json`,
  );
};

const babel = require("./babel-core.cjs");

let data = {};

let cacheDirty = false;

let cacheDisabled = false;

function isCacheDisabled() {
  return process.env.BABEL_DISABLE_CACHE ?? cacheDisabled;
}

exports.save = save;
/**
 * Write stringified cache to disk.
 */
function save() {
  if (isCacheDisabled() || !cacheDirty) return;
  cacheDirty = false;

  let serialised = "{}";

  try {
    serialised = JSON.stringify(data);
  } catch (err) {
    if (err.message === "Invalid string length") {
      err.message = "Cache too large so it's been cleared.";
      console.error(err.stack);
    } else {
      throw err;
    }
  }

  try {
    fs.mkdirSync(path.dirname(FILENAME), { recursive: true });
    fs.writeFileSync(FILENAME, serialised);
  } catch (e) {
    switch (e.code) {
      // workaround https://github.com/nodejs/node/issues/31481
      // todo: remove the ENOENT error check when we drop node.js 13 support
      case "ENOENT":
      case "EACCES":
      case "EPERM":
        console.warn(
          `Babel could not write cache to file: ${FILENAME}
due to a permission issue. Cache is disabled.`,
        );
        cacheDisabled = true;
        break;
      case "EROFS":
        console.warn(
          `Babel could not write cache to file: ${FILENAME}
because it resides in a readonly filesystem. Cache is disabled.`,
        );
        cacheDisabled = true;
        break;
      default:
        throw e;
    }
  }
}

/**
 * Load cache from disk and parse.
 */

exports.load = function load() {
  if (isCacheDisabled()) {
    data = {};
    return;
  }

  process.on("exit", save);
  process.nextTick(save);

  let cacheContent;

  try {
    cacheContent = fs.readFileSync(FILENAME, "utf8");
  } catch (e) {
    switch (e.code) {
      // check EACCES only as fs.readFileSync will never throw EPERM on Windows
      // https://github.com/libuv/libuv/blob/076df64dbbda4320f93375913a728efc40e12d37/src/win/fs.c#L735
      case "EACCES":
        console.warn(
          `Babel could not read cache file: ${FILENAME}
due to a permission issue. Cache is disabled.`,
        );
        cacheDisabled = true;
      /* fall through */
      default:
        return;
    }
  }

  try {
    data = JSON.parse(cacheContent);
  } catch {}
};

/**
 * Retrieve data from cache.
 */
exports.get = function get() {
  return data;
};

/**
 * Set the cache dirty bit.
 */
exports.setDirty = function setDirty() {
  cacheDirty = true;
};

/**
 * Clear the cache object.
 */
exports.clear = function clear() {
  data = {};
};
