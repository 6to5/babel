var _initStatic, _initClass, _accessorDecs, _init_accessor, _init_extra_accessor, _getterDecs, _setterDecs, _methodDecs, _propertyDecs, _init_property, _init_extra_property, _temp;
let original, replaced, accessorThis, getterThis, setterThis, methodThis, propertyThis;
function dec(Klass) {
  original = Klass;
  replaced = class extends Klass {};
  return replaced;
}
function captureInitializerThis(callback) {
  return function (_, context) {
    context.addInitializer(function () {
      callback(this);
    });
  };
}
_accessorDecs = captureInitializerThis(v => accessorThis = v);
_getterDecs = captureInitializerThis(v => getterThis = v);
_setterDecs = captureInitializerThis(v => setterThis = v);
_methodDecs = captureInitializerThis(v => methodThis = v);
_propertyDecs = captureInitializerThis(v => propertyThis = v);
let _Foo;
new (_temp = class extends babelHelpers.identity {
  constructor() {
    (super(_Foo), babelHelpers.defineProperty(this, "accessor", _init_accessor(this)), babelHelpers.defineProperty(this, "property", (_init_extra_accessor(this), _init_property(this)))), (() => {
      _init_extra_property(this);
    })(), _initClass();
  }
}, (_Foo2 => {
  class Foo {
    static get getter() {}
    static set setter(_) {}
    static method() {}
  }
  _Foo2 = Foo;
  (() => {
    ({
      e: [_init_accessor, _init_extra_accessor, _init_property, _init_extra_property, _initStatic],
      c: [_Foo, _initClass]
    } = babelHelpers.applyDecs2311(_Foo2, [[_getterDecs, 11, "getter"], [_setterDecs, 12, "setter"], [_methodDecs, 10, "method"], [_accessorDecs, 8, "accessor"], [_propertyDecs, 8, "property"]], [dec]));
    _initStatic(_Foo2);
  })();
})(), _temp)();