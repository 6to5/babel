function fn() {
  return babelHelpers.callAsync(function* () {
    yield yield 1;
  }, this, arguments);
}
