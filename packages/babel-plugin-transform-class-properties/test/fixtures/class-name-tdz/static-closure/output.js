let _foo;
let foo;
_foo = foo = () => A.x;
let A = /*#__PURE__*/babelHelpers.createClass(function A() {
  "use strict";

  babelHelpers.classCallCheck(this, A);
});
babelHelpers.defineProperty(A, "x", 42);
babelHelpers.defineProperty(A, _foo, void 0);
expect(foo()).toBe(42);
