function fn() {
  return babelHelpers.newAsyncGenerator(function* () {
    yield* babelHelpers.asyncGeneratorDelegate(babelHelpers.asyncIterator([Promise.resolve("ok")]), babelHelpers.awaitAsyncGenerator); // CreateAsyncFromSyncIterator
  }, this, arguments);
}
