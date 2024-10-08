function s(_x) {
  return babelHelpers.callAsync(function* (x) {
    var _arguments = arguments,
      _this = this;
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    let t = function t(_x2, _x3) {
      return babelHelpers.callAsync(function* (y, a) {
        let r = function r(_x4, _x5) {
          return babelHelpers.callAsync(function* (z, b) {
            yield z;
            for (var _len2 = arguments.length, innerArgs = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
              innerArgs[_key2 - 2] = arguments[_key2];
            }
            console.log(_this, innerArgs, _arguments);
            return _this.x;
          }, this, arguments);
        };
        yield r();
        console.log(_this, args, _arguments);
        return _this.g(r);
      }, this, arguments);
    };
    yield t();
    return this.h(t);
  }, this, arguments);
}
