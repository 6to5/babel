"use strict";

const cache = require("./cache.cjs");

function initialize(babel: typeof import("@babel/core")) {
  exports.init = null;
  exports.version = babel.version;
  exports.DEFAULT_EXTENSIONS = babel.DEFAULT_EXTENSIONS;
  exports.loadOptionsAsync = babel.loadOptionsAsync;
  exports.transformAsync = babel.transformAsync;
  exports.getEnv = babel.getEnv;

  if (!process.env.BABEL_8_BREAKING) {
    // @ts-expect-error Babel 7
    exports.OptionManager = babel.OptionManager;
    exports.transformSync = babel.transformSync;
  }

  cache.initializeCacheFilename();
}

if (USE_ESM) {
  exports.init = import("@babel/core").then(initialize);
} else {
  initialize(require("@babel/core"));
}
