"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foo = foo;
function foo() {
  return babelHelpers.callAsync(function* () {}, this, arguments);
}
