"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.traverse = void 0;
__exportStar(require("./traverse/x"));
_interop = 1;
var _traverse = __exportStar(require("./traverse/traverse"));
_export("traverse", _traverse, "default");
var _interop;
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var a, i = t ? n : r, o = { __proto__: null, default: e }; if (null == e || Object(e) !== e) return o; if (i) { if (i.has(e)) return i.get(e); i.set(e, o); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((a = Object.create && Object.getOwnPropertyDescriptor(e, t)) && (a.get || a.set) ? Object.defineProperty(o, t, a) : o[t] = e[t]); return o; })(e, t); }
function __exportStar(mod) {
  mod = _interop == 1 ? _interopRequireWildcard(mod) : mod;
  Object.keys(mod).forEach(function (k) {
    if (["default", "__esModule", "traverse"].indexOf(k) < 0 && !(k in exports && exports[k] === mod[k])) {
      Object.defineProperty(exports, k, {
        get: function () {
          return mod[k];
        },
        enumerable: true
      });
    }
  });
  return mod;
}
function _export(name, mod, name2) {
  Object.defineProperty(exports, name, {
    enumerable: true,
    get: function () {
      return mod[name2 == null ? name : name2];
    }
  });
}
