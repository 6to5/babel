var _initProto, _methodDecs, _initProto2, _methodDecs2;
const dec = () => {};
class A extends B {
  static {
    _methodDecs = deco;
    [_initProto] = babelHelpers.applyDecs(this, [[_methodDecs, 2, "method"]], []);
  }
  constructor() {
    if (Math.random() > 0.5) {
      _initProto(super(true));
    } else {
      _initProto(super(false));
    }
  }
  method() {}
}
class C extends B {
  static {
    _methodDecs2 = deco;
    [_initProto2] = babelHelpers.applyDecs(this, [[_methodDecs2, 2, "method"]], []);
  }
  constructor() {
    try {
      _initProto2(super(_initProto2(super()), null.x));
    } catch {}
  }
  method() {}
}
