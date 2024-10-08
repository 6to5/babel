var _ref;
function foo() {
  return babelHelpers.newAsyncGenerator(_ref = _ref || babelHelpers.skipFirstGeneratorNext(function* () {
    let _functionSent = yield;
    _functionSent = yield babelHelpers.awaitAsyncGenerator(_functionSent);
  }), this, arguments);
}
