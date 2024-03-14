"use strict";

exports.__esModule = true;
__exportStar(require("foo"));
function __exportStar(mod) {
  Object.keys(mod).forEach(function (k) {
    if (["default", "__esModule"].indexOf(k) < 0 && !(k in exports && exports[k] === mod[k])) {
      exports[k] = mod[k];
    }
  });
  return mod;
}
