function fn() {
  return babelHelpers.newAsyncGenerator(function* () {
    class A {
      [yield 1]() {}
    }
    class B extends A {
      [yield babelHelpers.awaitAsyncGenerator(1)]() {}
    }
  }, this, arguments);
}
