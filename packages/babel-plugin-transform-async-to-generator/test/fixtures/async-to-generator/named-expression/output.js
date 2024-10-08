var foo = function bar() {
  return babelHelpers.callAsync(function* () {
    console.log(bar);
  }, this, arguments);
};
