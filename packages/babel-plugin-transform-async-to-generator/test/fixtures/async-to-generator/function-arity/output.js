function one(_x) {
  return babelHelpers.callAsync(function* (a, b = 1) {}, this, arguments);
}
function two(_x2, _x3) {
  return babelHelpers.callAsync(function* (a, b, ...c) {}, this, arguments);
}
function three(_x4) {
  return babelHelpers.callAsync(function* (a, b = 1, c, d = 3) {}, this, arguments);
}
function four(_x5) {
  return babelHelpers.callAsync(function* (a, b = 1, c, ...d) {}, this, arguments);
}
function five(_x6, _x7) {
  return babelHelpers.callAsync(function* (a, {
    b
  }) {}, this, arguments);
}
function six(_x8) {
  return babelHelpers.callAsync(function* (a, {
    b
  } = {}) {}, this, arguments);
}
