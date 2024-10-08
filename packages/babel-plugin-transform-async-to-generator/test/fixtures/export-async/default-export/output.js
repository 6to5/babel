"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = myFunc;
function myFunc() {
  return babelHelpers.callAsync(function* () {}, this, arguments);
}
