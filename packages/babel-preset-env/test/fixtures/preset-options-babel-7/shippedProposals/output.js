var _ref;
var _x$y$a$b = {
    x: 1,
    y: 2,
    a: 3,
    b: 4
  },
  x = _x$y$a$b.x,
  y = _x$y$a$b.y,
  z = babelHelpers.objectWithoutProperties(_x$y$a$b, ["x", "y"]);
var n = babelHelpers.objectSpread2({
  x: x,
  y: y
}, z);
function agf() {
  return babelHelpers.newAsyncGenerator(_ref = _ref || /*#__PURE__*/babelHelpers.regeneratorRuntime().mark(function _callee() {
    return babelHelpers.regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return babelHelpers.awaitAsyncGenerator(1);
        case 2:
          _context.next = 4;
          return 2;
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }), this, arguments);
}
