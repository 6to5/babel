var _ref, _ref2;
function _callAsync(n, e, r) { return new Promise(function (t, a) { var o = n.apply(e, r), c = asyncGeneratorStep.bind(null, 1), l = asyncGeneratorStep.bind(null, 0); function asyncGeneratorStep(n, e) { try { var r = n ? o.next(e) : o["throw"](e), u = r.value; } catch (n) { return void a(n); } r.done ? t(u) : Promise.resolve(u).then(c, l); } c(); }); }
function test() {
  return _callAsync(_ref = _ref || /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
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
  return _callAsync(_ref2 = _ref2 || /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
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
