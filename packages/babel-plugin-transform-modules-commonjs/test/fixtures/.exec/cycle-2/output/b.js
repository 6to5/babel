"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bar = void 0;
var _index = require("./index.js");
_export("bar", _index);
function _export(name, mod, name2) {
  Object.defineProperty(exports, name, {
    enumerable: true,
    get: function () {
      return mod[name2 == null ? name : name2];
    }
  });
}