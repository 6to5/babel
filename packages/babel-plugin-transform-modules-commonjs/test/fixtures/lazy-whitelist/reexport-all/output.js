"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _exportFromThis(key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === this[key]) return;
  var imports = this;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return imports[key];
    }
  });
}

var _white = require("white");

Object.keys(_white).forEach(_exportFromThis, _white);

var _black = require("black");

Object.keys(_black).forEach(_exportFromThis, _black);
