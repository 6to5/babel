if (true) {
  var _run = function _run() {
    return babelHelpers.callAsync(function* () {
      return true;
    }, this, arguments);
  };
}
function test() {
  return run();
}
