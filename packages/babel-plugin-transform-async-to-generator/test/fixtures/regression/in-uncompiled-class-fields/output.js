// Angular needs to always compile async functions, even if
// the targets support class fields.
// https://github.com/babel/babel/issues/14749

class A {
  a = babelHelpers.asyncToGenerator(function* () {
    return _this;
  });
  b = function (_x, _x2, _x3) {
    return babelHelpers.callAsync(function* (x, y, z) {
      return _this2;
    }, this, arguments);
  };
}
