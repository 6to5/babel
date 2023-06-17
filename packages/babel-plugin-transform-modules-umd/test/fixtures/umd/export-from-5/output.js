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
  _defineGetter(_exports, "bar", function () {
    return _foo.bar;
  });
  _defineGetter(_exports, "foo", function () {
    return _foo.foo;
  });
  function _defineGetter(obj, prop, fn) {
    Object.defineProperty(obj, prop, {
      enumerable: true,
      get: fn
    });
  }
});
