babelHelpers.asyncToGenerator(function* () {
  yield 'ok';
})();
babelHelpers.asyncToGenerator(function* () {
  yield 'ok';
})();
(function notIIFE() {
  return babelHelpers.callAsync(function* () {
    yield 'ok';
  }, this, arguments);
});
/*#__PURE__*/babelHelpers.asyncToGenerator(function* () {
  yield 'not iife';
});
