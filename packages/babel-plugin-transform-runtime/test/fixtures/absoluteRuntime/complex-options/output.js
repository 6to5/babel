var _regeneratorRuntime = require("<CWD>/packages/babel-runtime/helpers/regeneratorRuntime.js")["default"];
var _callAsync = require("<CWD>/packages/babel-runtime/helpers/callAsync.js")["default"];
var _ref, _ref2;
function test() {
  return _callAsync(_ref = _ref || /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          console.log('test');
        case 1:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }), this, arguments);
}
function main() {
  return _callAsync(_ref2 = _ref2 || /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.t0 = console;
          _context2.next = 3;
          return test();
        case 3:
          _context2.t1 = _context2.sent;
          _context2.t0.log.call(_context2.t0, _context2.t1);
        case 5:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }), this, arguments);
}
main();
