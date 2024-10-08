import Promise from 'somewhere';
function foo() {
  return babelHelpers.callAsync(function* () {
    yield Promise.resolve();
  }, this, arguments);
}
