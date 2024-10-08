function g() {
  return babelHelpers.newAsyncGenerator(function* () {
    var _this = this;
    () => this;
    function f() {
      () => this;
    }
    /*#__PURE__*/babelHelpers.asyncToGenerator(function* () {
      _this;
      yield 1;
    });
    yield babelHelpers.awaitAsyncGenerator(1);
  }, this, arguments);
}
