"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.a = void 0;
var _foo = require("foo");
var _exportNames = ["default", "__esModule", "a"];
Object.keys(_foo).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _foo[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _foo[key];
    }
  });
});
var a;
