require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.promise.all-settled.js");
require("core-js/modules/es.aggregate-error.js");
require("core-js/modules/es.promise.any.js");
/*#__PURE__*/babelHelpers.asyncToGenerator( /*#__PURE__*/babelHelpers.regeneratorRuntime().mark(function _callee() {
  var promises;
  return babelHelpers.regeneratorRuntime().wrap(function _callee$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        promises = [Promise.resolve()];
        _context.next = 3;
        return Promise.all(promises);
      case 3:
        _context.next = 5;
        return Promise.allSettled(promises);
      case 5:
        _context.next = 7;
        return Promise.any(promises);
      case 7:
        _context.next = 9;
        return Promise.race(promises);
      case 9:
      case "end":
        return _context.stop();
    }
  }, _callee);
}));
