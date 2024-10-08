let Promise;
function foo() {
  return babelHelpers.callAsync(function* () {
    yield new Promise(resolve => {
      resolve();
    });
  }, this, arguments);
}
