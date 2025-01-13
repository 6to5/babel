const _excluded = ["excluded", "excluded2", "used", "used2"],
  _excluded2 = ["unused"];
var _c;
// should not remove when destructuring into existing bindings
_c = c2, {
  a2
} = _c, b2 = babelHelpers.objectWithoutProperties(_c, ["a2"]);
function render() {
  const _this$props = this.props,
    {
      used,
      used2: usedRenamed
    } = _this$props,
    props = babelHelpers.objectWithoutProperties(_this$props, _excluded);
  console.log(used, usedRenamed);
  return React.createElement("input", props);
}
function smth(_ref) {
  let rest = babelHelpers.objectWithoutProperties(_ref, _excluded2);
  call(rest);
}
