var Base = /*#__PURE__*/function () {
  "use strict";

  function Base() {
    babelHelpers.classCallCheck(this, Base);
  }
  return babelHelpers.createClass(Base, [{
    key: "method",
    value: function method() {}
  }]);
}();
var Foo = /*#__PURE__*/function (_Base) {
  "use strict";

  function Foo() {
    var _thisSuper, _this;
    babelHelpers.classCallCheck(this, Foo);
    _this = babelHelpers.callSuper(this, Foo);
    if (true) {
      var _Foo;
      babelHelpers.get((_thisSuper = babelHelpers.assertThisInitialized(_this), babelHelpers.getPrototypeOf(Foo.prototype)), "method", _thisSuper).call(_thisSuper);
    }
    return _this;
  }
  babelHelpers.inherits(Foo, _Base);
  return babelHelpers.createClass(Foo, [{
    key: "method",
    value: function method() {}
  }]);
}(Base);
