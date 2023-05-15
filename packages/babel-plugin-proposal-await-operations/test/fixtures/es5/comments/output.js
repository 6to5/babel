require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
/*#__PURE__*/babelHelpers.asyncToGenerator( /*#__PURE__*/babelHelpers.regeneratorRuntime().mark(function _callee() {
  var promises;
  return babelHelpers.regeneratorRuntime().wrap(function _callee$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        promises = [Promise.resolve()];
        _context.next = 3;
        return Promise.
        // 2
        all // 3
        (promises);
      case 3:
      case "end":
        return _context.stop();
    }
  }, _callee);
}));
