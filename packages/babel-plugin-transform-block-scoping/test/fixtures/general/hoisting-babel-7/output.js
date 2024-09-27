var _loop = function (i) {
    x = 5;
    ({
      f
    } = {
      f: 2
    });
    fns.push(function () {
      return i * x;
    });
  },
  x,
  f;
var _iterator = babelHelpers.createForOfIteratorHelper(nums),
  _step;
try {
  for (_iterator.s(); !(_step = _iterator.n()).done;) {
    var i = _step.value;
    _loop(i);
  }
} catch (err) {
  _iterator.e(err);
} finally {
  _iterator.f();
}
