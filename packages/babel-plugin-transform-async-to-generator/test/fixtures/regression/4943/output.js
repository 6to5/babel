"use strict";

function mandatory(paramName) {
  throw new Error(`Missing parameter: ${paramName}`);
}
function foo(_x) {
  return babelHelpers.callAsync(function (_ref) {
    let a = _ref.a,
      _ref$b = _ref.b,
      b = _ref$b === void 0 ? mandatory("b") : _ref$b;
    return function* () {
      return Promise.resolve(b);
    }();
  }, this, arguments);
}
