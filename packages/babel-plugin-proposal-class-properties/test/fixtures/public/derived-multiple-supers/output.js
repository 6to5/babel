var Foo =
/*#__PURE__*/
function (_Bar) {
  "use strict";

  babelHelpers.inherits(Foo, _Bar);

  function Foo() {
    var _this;

    babelHelpers.classCallCheck(this, Foo);

    if (condition) {
      _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(Foo).call(this));
      babelHelpers.defineProperty(babelHelpers.assertThisInitialized(_this), "bar", "foo");
    } else {
      babelHelpers.defineProperty(babelHelpers.assertThisInitialized(_this), "bar", "foo");
      _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(Foo).call(this));
    }

    return babelHelpers.possibleConstructorReturn(_this);
  }

  return Foo;
}(Bar);
