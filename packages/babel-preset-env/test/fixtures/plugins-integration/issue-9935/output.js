class MyClass extends BaseClass {
  loadEntity() {
    var _superprop_getLoadEntity = () => super.loadEntity,
      _this = this;
    return babelHelpers.callAsync(function* () {
      _this.website = yield _this.loadWebsite();
      _this.report.setCompany(_this.website.company);
      _superprop_getLoadEntity().call(_this);
    });
  }
}
