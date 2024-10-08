(function poll() {
  return babelHelpers.callAsync(function* () {
    console.log(yield Promise.resolve('Hello'));
    setTimeout(poll, 1000);
  }, this, arguments);
})();
