var _initProto, _call_a, _Foo;
const dec = () => {};
var _a = /*#__PURE__*/new WeakSet();
class Foo {
  constructor() {
    babelHelpers.classPrivateMethodInitSpec(this, _a);
    babelHelpers.defineProperty(this, "value", (_initProto(this), 1));
  }
  setA(v) {
    babelHelpers.classPrivateSetter(this, _a, _set_a, v);
  }
}
_Foo = Foo;
function _set_a(v) {
  _call_a(this, v);
}
[_call_a, _initProto] = babelHelpers.applyDecs2305(_Foo, [[dec, 4, "a", function (v) {
  return this.value = v;
}]], [], 0, _ => _a.has(babelHelpers.checkInRHS(_))).e;
