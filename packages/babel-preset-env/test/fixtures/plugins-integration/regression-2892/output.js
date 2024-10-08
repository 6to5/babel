"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ref3;
var Foo = exports["default"] = /*#__PURE__*/function (_ref) {
  function Foo() {
    babelHelpers.classCallCheck(this, Foo);
  }
  return babelHelpers.createClass(Foo, [{
    key: "bar",
    value: function bar() {
      return babelHelpers.callAsync(_ref = _ref || /*#__PURE__*/babelHelpers.regeneratorRuntime().mark(function _callee() {
        var baz;
        return babelHelpers.regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              baz = 0;
            case 1:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }), this, arguments);
    }
  }]);
}();
function foo() {
  return babelHelpers.callAsync(_ref3 = _ref3 || /*#__PURE__*/babelHelpers.regeneratorRuntime().mark(function _callee3() {
    var _ref2;
    var bar;
    return babelHelpers.regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          bar = function _bar() {
            return babelHelpers.callAsync(_ref2 = _ref2 || /*#__PURE__*/babelHelpers.regeneratorRuntime().mark(function _callee2() {
              var baz;
              return babelHelpers.regeneratorRuntime().wrap(function _callee2$(_context2) {
                while (1) switch (_context2.prev = _context2.next) {
                  case 0:
                    baz = {};
                  case 1:
                  case "end":
                    return _context2.stop();
                }
              }, _callee2);
            }), this, arguments);
          };
        case 1:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }), this, arguments);
}
