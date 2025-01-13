let _aDecs, _init_a, _init_extra_a;
class Foo {
  static {
    [_init_a, _init_extra_a] = babelHelpers.applyDecs2311(this, [], [[_aDecs, 0, "a"]]).e;
  }
  constructor() {
    _init_extra_a(this);
  }
  [(_aDecs = dec(function () {}), "a")] = _init_a(this);
}
