(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "foo"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("foo"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.foo);
    global.input = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _foo) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exportStar(_foo);
  function _exportStar(mod) {
    Object.keys(mod).forEach(function (k) {
      if (["default", "__esModule"].indexOf(k) < 0 && !(k in _exports && _exports[k] === mod[k])) {
        _exports[k] = mod[k];
      }
    });
    return mod;
  }
});
