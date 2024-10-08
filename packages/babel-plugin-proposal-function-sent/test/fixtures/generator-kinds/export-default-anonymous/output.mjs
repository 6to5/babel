export default function () {
  return babelHelpers.callSkipFirstGeneratorNext(function* () {
    let _functionSent = yield;
    return _functionSent;
  }, this, arguments);
}
