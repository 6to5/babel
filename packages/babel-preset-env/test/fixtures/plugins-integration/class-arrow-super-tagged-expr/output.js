// This should print "true true true"
function test() {
  return babelHelpers.callAsync(function* () {
    class Foo {
      foo() {
        return this;
      }
    }
    class Bar extends Foo {
      constructor(...args) {
        var _superprop_getFoo = () => super.foo,
          _this,
          _superprop_get = _prop => super[_prop];
        super(...args);
        _this = this;
        babelHelpers.defineProperty(this, "a", /*#__PURE__*/babelHelpers.asyncToGenerator(function* () {
          return _superprop_getFoo().bind(_this)``;
        }));
        babelHelpers.defineProperty(this, "b", /*#__PURE__*/babelHelpers.asyncToGenerator(function* () {
          return _superprop_get('foo').bind(_this)``;
        }));
        babelHelpers.defineProperty(this, "c", function (_x) {
          return babelHelpers.callAsync(function* (foo) {
            return _superprop_get(foo).bind(_this)``;
          }, this, arguments);
        });
      }
    }
    const bar = new Bar();
    console.log((yield bar.a()) === bar, (yield bar.b()) === bar, (yield bar.c('foo')) === bar);
  }, this, arguments);
}
test();
