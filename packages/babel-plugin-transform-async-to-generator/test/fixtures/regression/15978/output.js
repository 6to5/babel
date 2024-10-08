babelHelpers.asyncToGenerator(function* () {
  let items = [1, 2, 3, 4];
  for (const item of items) {
    yield f(function (_x) {
      return babelHelpers.callAsync(function* (x) {
        console.log(item);
      }, this, arguments);
    });
  }
})();
function f(_x2) {
  return babelHelpers.callAsync(function* (lambda) {
    yield lambda();
  }, this, arguments);
}
