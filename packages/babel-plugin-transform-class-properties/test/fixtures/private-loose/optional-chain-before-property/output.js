var _Foo;
var _x = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("x");
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
    o === null || o === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(o.Foo, _x);
    o === null || o === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(o.Foo, _x).toString;
    o === null || o === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(o.Foo, _x).toString();
    (_deep$very$o = deep?.very.o) === null || _deep$very$o === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(_deep$very$o.Foo, _x);
    (_deep$very$o2 = deep?.very.o) === null || _deep$very$o2 === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(_deep$very$o2.Foo, _x).toString;
    (_deep$very$o3 = deep?.very.o) === null || _deep$very$o3 === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(_deep$very$o3.Foo, _x).toString();
    o === null || o === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(babelHelpers.classPrivateFieldLoose(o.Foo, _self), _x);
    o === null || o === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(babelHelpers.classPrivateFieldLoose(o.Foo, _self).self, _x);
    (_ref = o === null || o === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(o.Foo, _self)) === null || _ref === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(_ref.self, _x);
    (_ref2 = o === null || o === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(o.Foo, _self).self) === null || _ref2 === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(_ref2.self, _x);
    (_self2 = (o === null || o === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(o.Foo, _self))?.self) === null || _self2 === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(_self2.self, _x);
    o === null || o === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(babelHelpers.classPrivateFieldLoose(o.Foo, _self).getSelf(), _x);
    (_ref3 = o === null || o === void 0 ? void 0 : (_babelHelpers$classPr = babelHelpers.classPrivateFieldLoose(o.Foo, _self)).getSelf) === null || _ref3 === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(_ref3.call(_babelHelpers$classPr), _x);
    (_ref4 = o === null || o === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(o.Foo, _self)) === null || _ref4 === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(_ref4.getSelf(), _x);
    (_getSelf = (_ref5 = o === null || o === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(o.Foo, _self))?.getSelf) === null || _getSelf === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(_getSelf.call(_ref5), _x);
    (_ref6 = o === null || o === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(o.Foo, _self).getSelf()) === null || _ref6 === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(_ref6.self, _x);
    (_call = (o === null || o === void 0 ? void 0 : (_babelHelpers$classPr2 = babelHelpers.classPrivateFieldLoose(o.Foo, _self)).getSelf)?.call(_babelHelpers$classPr2)) === null || _call === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(_call.self, _x);
    (_getSelf2 = (o === null || o === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(o.Foo, _self))?.getSelf()) === null || _getSelf2 === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(_getSelf2.self, _x);
    (_getSelf3 = (o === null || o === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(o.Foo, _self))?.getSelf?.()) === null || _getSelf3 === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(_getSelf3.self, _x);
    fn === null || fn === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(fn().Foo, _x);
    fn === null || fn === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(fn().Foo, _x).toString;
    fn === null || fn === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(fn().Foo, _x).toString();
    (_fnDeep$very$o = fnDeep?.().very.o) === null || _fnDeep$very$o === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(_fnDeep$very$o.Foo, _x);
    (_fnDeep$very$o2 = fnDeep?.().very.o) === null || _fnDeep$very$o2 === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(_fnDeep$very$o2.Foo, _x).toString;
    (_fnDeep$very$o3 = fnDeep?.().very.o) === null || _fnDeep$very$o3 === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(_fnDeep$very$o3.Foo, _x).toString();
    fn === null || fn === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(babelHelpers.classPrivateFieldLoose(fn().Foo, _self), _x);
    fn === null || fn === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(babelHelpers.classPrivateFieldLoose(fn().Foo, _self).self, _x);
    (_ref7 = fn === null || fn === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(fn().Foo, _self)) === null || _ref7 === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(_ref7.self, _x);
    (_ref8 = fn === null || fn === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(fn().Foo, _self).self) === null || _ref8 === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(_ref8.self, _x);
    (_self3 = (fn === null || fn === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(fn().Foo, _self))?.self) === null || _self3 === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(_self3.self, _x);
    fn === null || fn === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(babelHelpers.classPrivateFieldLoose(fn().Foo, _self).getSelf(), _x);
    (_ref9 = fn === null || fn === void 0 ? void 0 : (_babelHelpers$classPr3 = babelHelpers.classPrivateFieldLoose(fn().Foo, _self)).getSelf) === null || _ref9 === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(_ref9.call(_babelHelpers$classPr3), _x);
    (_ref10 = fn === null || fn === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(fn().Foo, _self)) === null || _ref10 === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(_ref10.getSelf(), _x);
    (_getSelf4 = (_ref11 = fn === null || fn === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(fn().Foo, _self))?.getSelf) === null || _getSelf4 === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(_getSelf4.call(_ref11), _x);
    (_ref12 = fn === null || fn === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(fn().Foo, _self).getSelf()) === null || _ref12 === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(_ref12.self, _x);
    (_call2 = (fn === null || fn === void 0 ? void 0 : (_babelHelpers$classPr4 = babelHelpers.classPrivateFieldLoose(fn().Foo, _self)).getSelf)?.call(_babelHelpers$classPr4)) === null || _call2 === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(_call2.self, _x);
    (_getSelf5 = (fn === null || fn === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(fn().Foo, _self))?.getSelf()) === null || _getSelf5 === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(_getSelf5.self, _x);
    (_getSelf6 = (fn === null || fn === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(fn().Foo, _self))?.getSelf?.()) === null || _getSelf6 === void 0 ? void 0 : babelHelpers.classPrivateFieldLoose(_getSelf6.self, _x);
  }
}
_Foo = Foo;
Object.defineProperty(Foo, _x, {
  writable: true,
  value: 1
});
Object.defineProperty(Foo, _self, {
  writable: true,
  value: _Foo
});
Foo.self = _Foo;
Foo.test();
