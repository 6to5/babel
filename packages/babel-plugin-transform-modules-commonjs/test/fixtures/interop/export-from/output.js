"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
__exportStar(require("foo"));
function __exportStar(mod) {
  Object.keys(mod).forEach(function (k) {
    if (["default", "__esModule"].indexOf(k) < 0 && !(k in exports && exports[k] === mod[k])) {
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
