var _loop = function (result) {
  result = otherValue;
  fn(() => {
    result;
  });
};
var _iterator = babelHelpers.createForOfIteratorHelper(results),
  _step;
try {
  for (_iterator.s(); !(_step = _iterator.n()).done;) {
    var result = _step.value;
    _loop(result);
  }
} catch (err) {
  _iterator.e(err);
} finally {
  _iterator.f();
}
