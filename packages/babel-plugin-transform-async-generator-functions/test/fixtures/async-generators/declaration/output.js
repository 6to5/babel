function agf() {
  return babelHelpers.newAsyncGenerator(function* () {
    this;
    yield babelHelpers.awaitAsyncGenerator(1);
    yield 2;
    return 3;
  }, this, arguments);
}
