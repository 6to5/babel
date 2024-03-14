"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foo = exports.bar = void 0;
var _foo = require("foo");
_export("bar", _foo);
_export("foo", _foo);
function _export(name, mod, name2) {
  Object.defineProperty(exports, name, {
    enumerable: true,
    get: function () {
      return mod[name2 == null ? name : name2];
    }
  });
}
