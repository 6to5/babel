const foo = "foo";
var obj = Object.defineProperties({}, babelHelpers.defineProperty({}, foo, {
  get: function () {
    return 5 + 5;
  },
  set: function (value) {
    this._foo = value;
  },
  configurable: true,
  enumerable: true
}));
