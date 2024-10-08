function foo(_x) {
  return babelHelpers.callAsync(function* (bar) {}, this, arguments);
}
