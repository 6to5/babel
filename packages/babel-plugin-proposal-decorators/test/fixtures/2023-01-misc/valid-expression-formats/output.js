var _initProto, _initClass, _classDecs, _methodDecs;
const dec = () => {};
_classDecs = [dec, call(), chain.expr(), arbitrary + expr, array[expr]];
let _Foo;
class Foo {
  static {
    _methodDecs = [dec, call(), chain.expr(), arbitrary + expr, array[expr]];
    ({
      e: [_initProto],
      c: [_Foo, _initClass]
    } = babelHelpers.applyDecs2301(this, [[_methodDecs, 2, "method"]], _classDecs));
  }
  #a = void _initProto(this);
  method() {}
  makeClass() {
    var _barDecs, _init_bar, _outerThis;
    return _outerThis = this, class Nested {
      static {
        _barDecs = _outerThis.#a;
        [_init_bar] = babelHelpers.applyDecs2301(this, [[_barDecs, 0, "bar"]], []).e;
      }
      bar = _init_bar(this);
    };
  }
  static {
    _initClass();
  }
}
