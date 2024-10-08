class Test {
  static method1() {
    var _this = this;
    return babelHelpers.callAsync(function* () {
      console.log(_this);
      setTimeout(/*#__PURE__*/babelHelpers.asyncToGenerator(function* () {
        console.log(_this);
      }));
    });
  }
  static method2() {
    var _this2 = this;
    return babelHelpers.callAsync(function* () {
      console.log(_this2);
      setTimeout(function (_x) {
        return babelHelpers.callAsync(function* (arg) {
          console.log(_this2);
        }, this, arguments);
      });
    });
  }
  method1() {
    var _this3 = this;
    return babelHelpers.callAsync(function* () {
      console.log(_this3);
      setTimeout(/*#__PURE__*/babelHelpers.asyncToGenerator(function* () {
        console.log(_this3);
      }));
    });
  }
  method2() {
    var _this4 = this;
    return babelHelpers.callAsync(function* () {
      console.log(_this4);
      setTimeout(function (_x2) {
        return babelHelpers.callAsync(function* (arg) {
          console.log(_this4);
        }, this, arguments);
      });
    });
  }
}
