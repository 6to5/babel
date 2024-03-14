(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./traverse/x", "./traverse/traverse"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./traverse/x"), require("./traverse/traverse"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.x, global.traverse);
    global.input = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _x, _traverse) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.traverse = void 0;
  _exportStar(_x);
  _traverse = babelHelpers.interopRequireWildcard(_traverse);
  _exports.traverse = _traverse.default;
  _exportStar(_traverse);
  function _exportStar(mod) {
    Object.keys(mod).forEach(function (k) {
      if (["default", "__esModule", "traverse"].indexOf(k) < 0 && !(k in _exports && _exports[k] === mod[k])) {
        _exports[k] = mod[k];
      }
    });
    return mod;
  }
});
