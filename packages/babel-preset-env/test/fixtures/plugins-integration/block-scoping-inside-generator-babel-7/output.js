function test() {
  return _test.apply(this, arguments);
}
function _test() {
  _test = babelHelpers.asyncToGenerator( /*#__PURE__*/babelHelpers.regeneratorRuntime().mark(function _callee() {
    var obj, _loop, _i, _arr;
    return babelHelpers.regeneratorRuntime().wrap(function _callee$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          obj = {};
          _loop = /*#__PURE__*/babelHelpers.regeneratorRuntime().mark(function _loop() {
            var ch;
            return babelHelpers.regeneratorRuntime().wrap(function _loop$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  ch = _arr[_i];
                  obj[ch] = () => ch;
                case 2:
                case "end":
                  return _context.stop();
              }
            }, _loop);
          });
          _i = 0, _arr = ["good", "bad"];
        case 3:
          if (!(_i < _arr.length)) {
            _context2.next = 8;
            break;
          }
          return _context2.delegateYield(_loop(), "t0", 5);
        case 5:
          _i++;
          _context2.next = 3;
          break;
        case 8:
        case "end":
          return _context2.stop();
      }
    }, _callee);
  }));
  return _test.apply(this, arguments);
}
