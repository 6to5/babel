var _loop = function (result) {
  result = otherValue;
  fn(() => {
    result;
  });
};
for (var _iterator = babelHelpers.createForOfIteratorHelperLoose(results), _step; !(_step = _iterator()).done;) {
  var result = _step.value;
  _loop(result);
}
