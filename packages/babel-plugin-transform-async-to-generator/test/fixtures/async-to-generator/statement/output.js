function foo() {
  return babelHelpers.callAsync(function* () {
    var wat = yield bar();
  }, this, arguments);
}
