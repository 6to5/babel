function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

class Foo {
  static test() {
    var _o, _ref, _o2, _ref2, _o3, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _o4, _ref10, _o5, _ref11, _o6, _ref12, _ref13, _ref14, _o7, _ref15, _ref16, _ref17, _o8, _ref18, _ref19, _ref20;

    const o = {
      Foo: Foo
    };
    const deep = {
      very: {
        o
      }
    };
    (_ref = (_o = o)?.Foo, _o === void 0 || _o === null) ? void 0 : _classPrivateFieldLooseBase(_ref, _x)[_x];
    (_ref2 = (_o2 = o)?.Foo, _o2 === void 0 || _o2 === null) ? void 0 : _classPrivateFieldLooseBase(_ref2, _x)[_x].toString;
    (_ref3 = (_o3 = o)?.Foo, _o3 === void 0 || _o3 === null) ? void 0 : _classPrivateFieldLooseBase(_ref3, _x)[_x].toString();
    (_ref5 = (_ref4 = deep?.very.o)?.Foo, _ref4 === void 0 || _ref4 === null) ? void 0 : _classPrivateFieldLooseBase(_ref5, _x)[_x];
    (_ref7 = (_ref6 = deep?.very.o)?.Foo, _ref6 === void 0 || _ref6 === null) ? void 0 : _classPrivateFieldLooseBase(_ref7, _x)[_x].toString;
    (_ref9 = (_ref8 = deep?.very.o)?.Foo, _ref8 === void 0 || _ref8 === null) ? void 0 : _classPrivateFieldLooseBase(_ref9, _x)[_x].toString();
    (_ref10 = (_o4 = o)?.Foo, _o4 === void 0 || _o4 === null) ? void 0 : _classPrivateFieldLooseBase(_classPrivateFieldLooseBase(_ref10, _self)[_self], _x)[_x];
    (_ref11 = (_o5 = o)?.Foo, _o5 === void 0 || _o5 === null) ? void 0 : _classPrivateFieldLooseBase(_classPrivateFieldLooseBase(_ref11, _self)[_self].self, _x)[_x];
    (_ref14 = (_ref13 = (_ref12 = (_o6 = o)?.Foo, _o6 === void 0 || _o6 === null) ? void 0 : _classPrivateFieldLooseBase(_ref12, _self)[_self])?.self, _ref13 === void 0 || _ref13 === null) ? void 0 : _classPrivateFieldLooseBase(_ref14, _x)[_x];
    (_ref17 = (_ref16 = (_ref15 = (_o7 = o)?.Foo, _o7 === void 0 || _o7 === null) ? void 0 : _classPrivateFieldLooseBase(_ref15, _self)[_self].self)?.self, _ref16 === void 0 || _ref16 === null) ? void 0 : _classPrivateFieldLooseBase(_ref17, _x)[_x];
    (_ref20 = (_ref19 = ((_ref18 = (_o8 = o)?.Foo, _o8 === void 0 || _o8 === null) ? void 0 : _classPrivateFieldLooseBase(_ref18, _self)[_self])?.self)?.self, _ref19 === void 0 || _ref19 === null) ? void 0 : _classPrivateFieldLooseBase(_ref20, _x)[_x];
  }

}

var _x = _classPrivateFieldLooseKey("x");

var _self = _classPrivateFieldLooseKey("self");

Object.defineProperty(Foo, _x, {
  writable: true,
  value: 1
});
Object.defineProperty(Foo, _self, {
  writable: true,
  value: Foo
});
Foo.self = Foo;
Foo.test();
