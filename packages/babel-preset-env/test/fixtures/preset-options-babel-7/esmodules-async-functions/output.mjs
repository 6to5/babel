function f() {
  return babelHelpers.callAsync(function* () {}, this, arguments);
}
