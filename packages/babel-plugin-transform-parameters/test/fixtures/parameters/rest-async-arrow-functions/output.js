var concat = function concat() {
  return babelHelpers.callAsync(function* () {
    var x = arguments.length <= 0 ? undefined : arguments[0];
    var y = arguments.length <= 1 ? undefined : arguments[1];
  }, this, arguments);
};
var x = function x() {
  return babelHelpers.callAsync(function* () {
    if (noNeedToWork) return 0;
    for (var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++) {
      rest[_key] = arguments[_key];
    }
    return rest;
  }, this, arguments);
};
