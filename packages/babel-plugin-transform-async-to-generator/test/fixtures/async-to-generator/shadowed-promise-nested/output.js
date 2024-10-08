let Promise;
function foo() {
  return babelHelpers.callAsync(function* () {
    let Promise;
    yield bar();
    function bar() {
      return babelHelpers.callAsync(function* () {
        return Promise.resolve();
      }, this, arguments);
    }
  }, this, arguments);
}
