var _A = /*#__PURE__*/new WeakMap();

var _foo = /*#__PURE__*/new WeakMap();

let Foo = /*#__PURE__*/function () {
  "use strict";

  function Foo() {
    babelHelpers.classCallCheck(this, Foo);
    babelHelpers.classPrivateFieldInitSpec(this, _foo, {
      get: _get_foo,
      set: _set_foo
    });
    babelHelpers.classPrivateFieldInitSpec(this, _A, {
      writable: true,
      value: void 0
    });
  }

  babelHelpers.createClass(Foo, [{
    key: "test",
    value: function test(other) {
      return _foo.has(other);
    }
  }]);
  return Foo;
}();

function _get_foo() {
  return babelHelpers.classPrivateFieldGet(this, _A);
}

function _set_foo(v) {
  babelHelpers.classPrivateFieldSet(this, _A, v);
}
