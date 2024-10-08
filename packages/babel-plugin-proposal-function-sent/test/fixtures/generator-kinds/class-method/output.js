class Foo {
  gen() {
    return babelHelpers.callSkipFirstGeneratorNext(function* () {
      let _functionSent = yield;
      return _functionSent;
    });
  }
}
