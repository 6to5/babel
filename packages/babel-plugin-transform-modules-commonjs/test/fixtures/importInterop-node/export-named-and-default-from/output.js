"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.name = exports.default = void 0;
var _dep = babelHelpers.interopRequireWildcard(require("dep"), true);
_export("default", _dep);
_export("name", _dep);
function _export(name, mod, name2) {
  Object.defineProperty(exports, name, {
    enumerable: true,
    get: function () {
      return mod[name2 == null ? name : name2];
    }
  });
}
