"use strict";

/**
 * This file wraps the compiled ES6 module implementation of register so
 * that it can be used both from a standard CommonJS environment, and also
 * from a compiled Babel import.
 */

if (USE_ESM) {
  module.exports = require("./experimental-worker.cjs");
} else if (process.env.BABEL_8_BREAKING) {
  module.exports = require("./experimental-worker.cjs");
} else {
  exports = module.exports = function () {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return register.apply(this, arguments);
  };
  exports.__esModule = true;

  const node = require("./nodeWrapper.cjs");
  const register = node.default;

  Object.assign(exports, node);
}
