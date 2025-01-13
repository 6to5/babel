expect(() => {
  let _ref;
  _ref = (() => (babelHelpers.classNameTDZError("A"), A).x)();
  let A = /*#__PURE__*/babelHelpers.createClass(function A() {
    "use strict";

    babelHelpers.classCallCheck(this, A);
  });
  babelHelpers.defineProperty(A, "x", 42);
  babelHelpers.defineProperty(A, _ref, void 0);
}).toThrow(ReferenceError);
