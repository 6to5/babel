var _ref2;
babelHelpers.asyncToGenerator(/*#__PURE__*/babelHelpers.regeneratorRuntime().mark(function _callee2() {
  var items, _loop, _i, _items;
  return babelHelpers.regeneratorRuntime().wrap(function _callee2$(_context3) {
    while (1) switch (_context3.prev = _context3.next) {
      case 0:
        items = [1, 2, 3, 4];
        _loop = /*#__PURE__*/babelHelpers.regeneratorRuntime().mark(function _loop() {
          var _ref;
          var item;
          return babelHelpers.regeneratorRuntime().wrap(function _loop$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                item = _items[_i];
                _context2.next = 3;
                return f(function (_x) {
                  return babelHelpers.callAsync(_ref = _ref || /*#__PURE__*/babelHelpers.regeneratorRuntime().mark(function _callee(x) {
                    return babelHelpers.regeneratorRuntime().wrap(function _callee$(_context) {
                      while (1) switch (_context.prev = _context.next) {
                        case 0:
                          console.log(item);
                        case 1:
                        case "end":
                          return _context.stop();
                      }
                    }, _callee);
                  }), this, arguments);
                });
              case 3:
              case "end":
                return _context2.stop();
            }
          }, _loop);
        });
        _i = 0, _items = items;
      case 3:
        if (!(_i < _items.length)) {
          _context3.next = 8;
          break;
        }
        return _context3.delegateYield(_loop(), "t0", 5);
      case 5:
        _i++;
        _context3.next = 3;
        break;
      case 8:
      case "end":
        return _context3.stop();
    }
  }, _callee2);
}))();
function f(_x2) {
  return babelHelpers.callAsync(_ref2 = _ref2 || /*#__PURE__*/babelHelpers.regeneratorRuntime().mark(function _callee3(lambda) {
    return babelHelpers.regeneratorRuntime().wrap(function _callee3$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return lambda();
        case 2:
        case "end":
          return _context4.stop();
      }
    }, _callee3);
  }), this, arguments);
}
