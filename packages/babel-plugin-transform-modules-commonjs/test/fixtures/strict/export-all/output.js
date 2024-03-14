"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.a = void 0;
exports.b = b;
exports.d = exports.c = void 0;
exports.default = _default;
exports.z = exports.f = exports.e = void 0;
var _mod = __exportStar(require("mod"));
_export("c", _mod);
function __exportStar(mod) {
  Object.keys(mod).forEach(function (k) {
    if (["default", "__esModule", "z", "a", "b", "d", "e", "f", "c"].indexOf(k) < 0 && !(k in exports && exports[k] === mod[k])) {
      Object.defineProperty(exports, k, {
        get: function () {
          return mod[k];
        },
        enumerable: true
      });
    }
  });
  return mod;
}
function _export(name, mod, name2) {
  Object.defineProperty(exports, name, {
    enumerable: true,
    get: function () {
      return mod[name2 == null ? name : name2];
    }
  });
}
var z = exports.z = 100;
class a {}
exports.a = a;
function b() {}
var d = exports.d = 42;
var e = exports.e = 1,
  f = exports.f = 2;
function _default() {}
