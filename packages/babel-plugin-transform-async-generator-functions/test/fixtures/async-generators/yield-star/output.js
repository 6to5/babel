function g() {
  return babelHelpers.newAsyncGenerator(function* () {
    yield* babelHelpers.asyncGeneratorDelegate(babelHelpers.asyncIterator([1, 2, 3]));
    yield* babelHelpers.asyncGeneratorDelegate(babelHelpers.asyncIterator(iterable));
  }, this, arguments);
}
