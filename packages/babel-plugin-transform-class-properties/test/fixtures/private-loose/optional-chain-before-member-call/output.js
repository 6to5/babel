var _Foo;
var _x = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("x");
var _m = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("m");
var _self = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("self");
class Foo {
  static getSelf() {
    return this;
  }
  static test() {
    var _deep$very$o, _deep$very$o2, _deep$very$o3, _ref, _ref2, _self2, _babelHelpers$classPr, _ref3, _ref4, _getSelf, _ref5, _ref6, _babelHelpers$classPr2, _call, _getSelf2, _getSelf3, _fnDeep$very$o, _fnDeep$very$o2, _fnDeep$very$o3, _ref7, _ref8, _self3, _babelHelpers$classPr3, _ref9, _ref10, _getSelf4, _ref11, _ref12, _babelHelpers$classPr4, _call2, _getSelf5, _getSelf6;
    const o = {
      Foo: Foo
    };
    const deep = {
      very: {
        o
      }
    };
    function fn() {
      return o;
    }
    function fnDeep() {
      return deep;
    }
    o === null || o === void 0 ? void 0 : o.Foo[_m]();
    o === null || o === void 0 ? void 0 : o.Foo[_m]().toString;
    o === null || o === void 0 ? void 0 : o.Foo[_m]().toString();
    (_deep$very$o = deep?.very.o) === null || _deep$very$o === void 0 ? void 0 : _deep$very$o.Foo[_m]();
    (_deep$very$o2 = deep?.very.o) === null || _deep$very$o2 === void 0 ? void 0 : _deep$very$o2.Foo[_m]().toString;
    (_deep$very$o3 = deep?.very.o) === null || _deep$very$o3 === void 0 ? void 0 : _deep$very$o3.Foo[_m]().toString();
    o === null || o === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(o.Foo, _self)[_m]();
    o === null || o === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(o.Foo, _self).self[_m]();
    (_ref = o === null || o === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(o.Foo, _self)) === null || _ref === void 0 ? void 0 : _ref.self[_m]();
    (_ref2 = o === null || o === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(o.Foo, _self).self) === null || _ref2 === void 0 ? void 0 : _ref2.self[_m]();
    (_self2 = (o === null || o === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(o.Foo, _self))?.self) === null || _self2 === void 0 ? void 0 : _self2.self[_m]();
    o === null || o === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(o.Foo, _self).getSelf()[_m]();
    (_ref3 = o === null || o === void 0 ? void 0 : (_babelHelpers$classPr = babelHelpers.classPrivateFieldLoose(o.Foo, _self)).getSelf) === null || _ref3 === void 0 ? void 0 : (_ref3.call(_babelHelpers$classPr))[_m]();
    (_ref4 = o === null || o === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(o.Foo, _self)) === null || _ref4 === void 0 ? void 0 : (_ref4.getSelf())[_m]();
    (_getSelf = (_ref5 = o === null || o === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(o.Foo, _self))?.getSelf) === null || _getSelf === void 0 ? void 0 : _getSelf.call(_ref5)[_m]();
    (_ref6 = o === null || o === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(o.Foo, _self).getSelf()) === null || _ref6 === void 0 ? void 0 : _ref6.self[_m]();
    (_call = (o === null || o === void 0 ? void 0 : (_babelHelpers$classPr2 = babelHelpers.classPrivateFieldLoose(o.Foo, _self)).getSelf)?.call(_babelHelpers$classPr2)) === null || _call === void 0 ? void 0 : _call.self[_m]();
    (_getSelf2 = (o === null || o === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(o.Foo, _self))?.getSelf()) === null || _getSelf2 === void 0 ? void 0 : _getSelf2.self[_m]();
    (_getSelf3 = (o === null || o === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(o.Foo, _self))?.getSelf?.()) === null || _getSelf3 === void 0 ? void 0 : _getSelf3.self[_m]();
    fn === null || fn === void 0 ? void 0 : (fn().Foo)[_m]();
    fn === null || fn === void 0 ? void 0 : (fn().Foo)[_m]().toString;
    fn === null || fn === void 0 ? void 0 : (fn().Foo)[_m]().toString();
    (_fnDeep$very$o = fnDeep?.().very.o) === null || _fnDeep$very$o === void 0 ? void 0 : _fnDeep$very$o.Foo[_m]();
    (_fnDeep$very$o2 = fnDeep?.().very.o) === null || _fnDeep$very$o2 === void 0 ? void 0 : _fnDeep$very$o2.Foo[_m]().toString;
    (_fnDeep$very$o3 = fnDeep?.().very.o) === null || _fnDeep$very$o3 === void 0 ? void 0 : _fnDeep$very$o3.Foo[_m]().toString();
    fn === null || fn === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(fn().Foo, _self)[_m]();
    fn === null || fn === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(fn().Foo, _self).self[_m]();
    (_ref7 = fn === null || fn === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(fn().Foo, _self)) === null || _ref7 === void 0 ? void 0 : _ref7.self[_m]();
    (_ref8 = fn === null || fn === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(fn().Foo, _self).self) === null || _ref8 === void 0 ? void 0 : _ref8.self[_m]();
    (_self3 = (fn === null || fn === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(fn().Foo, _self))?.self) === null || _self3 === void 0 ? void 0 : _self3.self[_m]();
    fn === null || fn === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(fn().Foo, _self).getSelf()[_m]();
    (_ref9 = fn === null || fn === void 0 ? void 0 : (_babelHelpers$classPr3 = babelHelpers.classPrivateFieldLoose(fn().Foo, _self)).getSelf) === null || _ref9 === void 0 ? void 0 : (_ref9.call(_babelHelpers$classPr3))[_m]();
    (_ref10 = fn === null || fn === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(fn().Foo, _self)) === null || _ref10 === void 0 ? void 0 : (_ref10.getSelf())[_m]();
    (_getSelf4 = (_ref11 = fn === null || fn === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(fn().Foo, _self))?.getSelf) === null || _getSelf4 === void 0 ? void 0 : _getSelf4.call(_ref11)[_m]();
    (_ref12 = fn === null || fn === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(fn().Foo, _self).getSelf()) === null || _ref12 === void 0 ? void 0 : _ref12.self[_m]();
    (_call2 = (fn === null || fn === void 0 ? void 0 : (_babelHelpers$classPr4 = babelHelpers.classPrivateFieldLoose(fn().Foo, _self)).getSelf)?.call(_babelHelpers$classPr4)) === null || _call2 === void 0 ? void 0 : _call2.self[_m]();
    (_getSelf5 = (fn === null || fn === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(fn().Foo, _self))?.getSelf()) === null || _getSelf5 === void 0 ? void 0 : _getSelf5.self[_m]();
    (_getSelf6 = (fn === null || fn === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(fn().Foo, _self))?.getSelf?.()) === null || _getSelf6 === void 0 ? void 0 : _getSelf6.self[_m]();
  }
}
_Foo = Foo;
Object.defineProperty(Foo, _x, {
  writable: true,
  value: 1
});
Object.defineProperty(Foo, _m, {
  writable: true,
  value: function () {
    return babelHelpers.classPrivateFieldLoose(this, _x);
  }
});
Object.defineProperty(Foo, _self, {
  writable: true,
  value: _Foo
});
Foo.self = _Foo;
Foo.test();
