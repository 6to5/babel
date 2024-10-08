function fn() {
  return babelHelpers.callAsync(function* () {
    yield 0;
    try {
      var _usingCtx = babelHelpers.usingCtx();
      const x = _usingCtx.a(y);
      yield 1;
    } catch (_) {
      _usingCtx.e = _;
    } finally {
      yield _usingCtx.d();
    }
  }, this, arguments);
}
