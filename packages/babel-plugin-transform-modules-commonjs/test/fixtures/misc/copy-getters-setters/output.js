"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.baz = exports.Foo = void 0;
var _moduleWithGetter = _interopRequireWildcard(require("./moduleWithGetter"));
_export("Foo", _moduleWithGetter, "default");
_export("baz", _moduleWithGetter);
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var a, i = t ? n : r, o = { __proto__: null, default: e }; if (null == e || Object(e) !== e) return o; if (i) { if (i.has(e)) return i.get(e); i.set(e, o); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((a = Object.create && Object.getOwnPropertyDescriptor(e, t)) && (a.get || a.set) ? Object.defineProperty(o, t, a) : o[t] = e[t]); return o; })(e, t); }
function _export(name, mod, name2) {
  Object.defineProperty(exports, name, {
    enumerable: true,
    get: function () {
      return mod[name2 == null ? name : name2];
    }
  });
}
