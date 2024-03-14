"use strict";

var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _indexOfInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/index-of");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault").default;
exports.__esModule = true;
exports.exp = void 0;
var _bar = _interopRequireDefault(require("bar"));
var _fuz = require("fuz");
__exportStar(require("mod"));
function __exportStar(mod) {
  var _context;
  _forEachInstanceProperty(_context = _Object$keys(mod)).call(_context, function (k) {
    var _context2;
    if (_indexOfInstanceProperty(_context2 = ["default", "__esModule", "exp"]).call(_context2, k) < 0 && !(k in exports && exports[k] === mod[k])) {
      exports[k] = mod[k];
    }
  });
  return mod;
}
const exp = exports.exp = _bar.default + _fuz.baz;
