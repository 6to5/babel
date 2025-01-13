var _Symbol = require("@babel/runtime-corejs2/core-js/symbol");
var _Symbol$iterator = require("@babel/runtime-corejs2/core-js/symbol/iterator");
var _Symbol$toPrimitive = require("@babel/runtime-corejs2/core-js/symbol/to-primitive");
var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), _Object$defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), _Object$defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" !== _typeof(t) || !t) return t; var e = t[_Symbol$toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" !== _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof _Symbol && "symbol" == typeof _Symbol$iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof _Symbol && o.constructor === _Symbol && o !== _Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
let Foo = /*#__PURE__*/_createClass(function Foo() {
  "use strict";

  _classCallCheck(this, Foo);
});
