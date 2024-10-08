var foo = function foo() {
  return babelHelpers.callAsync(function* () {
    var wat = yield bar();
  }, this, arguments);
};
var foo2 = function foo2() {
    return babelHelpers.callAsync(function* () {
      var wat = yield bar();
    }, this, arguments);
  },
  bar = function bar() {
    return babelHelpers.callAsync(function* () {
      var wat = yield foo();
    }, this, arguments);
  };
