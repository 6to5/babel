"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _bar() {
  _bar = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function bar() {
    var baz;
    return regeneratorRuntime.wrap(function bar$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            baz = 0;

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, bar, this);
  }));
  return _bar.apply(this, arguments);
}

var Foo =
/*#__PURE__*/
function () {
  function Foo() {
    _classCallCheck(this, Foo);
  }

  _createClass(Foo, [{
    key: "bar",
    value: function bar() {
      return _bar.apply(this, arguments);
    }
  }]);

  return Foo;
}();

exports.default = Foo;

function _bar2() {
  _bar2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function bar() {
    var baz;
    return regeneratorRuntime.wrap(function bar$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            baz = {};

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, bar, this);
  }));
  return _bar2.apply(this, arguments);
}

function _foo() {
  _foo = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function foo() {
    var bar;
    return regeneratorRuntime.wrap(function foo$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            bar = function _ref() {
              return _bar2.apply(this, arguments);
            };

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, foo, this);
  }));
  return _foo.apply(this, arguments);
}

function foo() {
  return _foo.apply(this, arguments);
}
