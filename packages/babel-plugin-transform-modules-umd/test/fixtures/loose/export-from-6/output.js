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

  _exports.__esModule = true;
  _reexports(_exports, _foo);
  function _reexports(exports, mod) {
    for (const k in mod) {
      if (k === "default" || k === "__esModule") continue;
      k in exports && exports[k] === mod[k] || (exports[k] = mod[k]);
    }
  }
});
