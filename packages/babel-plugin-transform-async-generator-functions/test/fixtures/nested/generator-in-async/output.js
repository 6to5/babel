function f() {
  return babelHelpers.callAsync(function* () {
    yield 1;
    function g() {
      return babelHelpers.newAsyncGenerator(function* () {
        yield babelHelpers.awaitAsyncGenerator(2);
        yield 3;
      }, this, arguments);
    }
  }, this, arguments);
}
