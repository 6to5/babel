"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = __exportStar(require("react"));
function __exportStar(mod) {
  mod = babelHelpers.interopRequireWildcard(mod);
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
// The fact that this exports both a normal default, and all of the names via
// re-export is an edge case that is important not to miss. See
// https://github.com/babel/babel/issues/8306 as an example.
var _default2 = exports.default = _react.default;
