class Foo {
  foo(x) {
    var _arguments = arguments,
      _this = this;
    return babelHelpers.asyncToGenerator(/*#__PURE__*/babelHelpers.regeneratorRuntime().mark(function _callee() {
      return babelHelpers.regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _this;
            _arguments;
            return _context.abrupt("return", _arguments[0]);
          case 3:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }))();
  }
}
