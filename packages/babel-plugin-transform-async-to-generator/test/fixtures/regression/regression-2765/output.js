function f() {
  var _this = this;
  let g = function g() {
    return babelHelpers.callAsync(function* () {
      _this;
    }, this, arguments);
  };
}
class Class {
  m() {
    var _this2 = this;
    return babelHelpers.callAsync(function* () {
      var c = function c(_x) {
        return babelHelpers.callAsync(function* (b) {
          _this2;
        }, this, arguments);
      };
    });
  }
}
