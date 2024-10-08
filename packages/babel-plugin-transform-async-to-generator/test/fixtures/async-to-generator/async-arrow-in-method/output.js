let TestClass = {
  name: "John Doe",
  testMethodFailure() {
    var _this = this;
    return new Promise(function (_x) {
      return babelHelpers.callAsync(function* (resolve) {
        console.log(_this);
        setTimeout(resolve, 1000);
      }, this, arguments);
    });
  }
};
