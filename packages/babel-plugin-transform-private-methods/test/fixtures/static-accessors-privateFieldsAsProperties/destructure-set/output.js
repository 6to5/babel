var _C;
var _p = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("p");
var _q = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("q");
class C {
  constructor() {
    [babelHelpers.classPrivateFieldLoose(C, _p, 1)[_p]] = [0];
  }
}
_C = C;
function _set_p(v) {
  babelHelpers.classPrivateFieldLoose(_C, _q, 1)[_q] = v;
}
Object.defineProperty(C, _p, {
  get: void 0,
  set: _set_p
});
Object.defineProperty(C, _q, {
  writable: true,
  value: void 0
});
new C();
