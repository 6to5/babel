const foo = function gen() {
  return babelHelpers.callSkipFirstGeneratorNext(function* () {
    let _functionSent = yield;
    return _functionSent;
  }, this, arguments);
};
