function gen() {
  return babelHelpers.callSkipFirstGeneratorNext(function* () {
    let _functionSent = yield;
    let sent = _functionSent;
  }, this, arguments);
}
