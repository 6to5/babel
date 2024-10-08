class Foo extends class {} {
  method() {
    var _superprop_getMethod = () => super.method,
      _this = this;
    return babelHelpers.callAsync(function* () {
      _superprop_getMethod().call(_this);
      var arrow = () => _superprop_getMethod().call(_this);
    });
  }
}
