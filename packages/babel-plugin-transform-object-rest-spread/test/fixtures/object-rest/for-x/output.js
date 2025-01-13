const _excluded = ["a"],
  _excluded2 = ["a"],
  _excluded3 = ["a"];
// ForXStatement
for (var _ref of []) {
  var {
      a
    } = _ref,
    b = babelHelpers.objectWithoutProperties(_ref, _excluded);
}
for (var _ref2 of []) {
  ({
    a
  } = _ref2), b = babelHelpers.objectWithoutProperties(_ref2, _excluded2);
}
async function a() {
  for await (var _ref3 of []) {
    ({
      a
    } = _ref3), b = babelHelpers.objectWithoutProperties(_ref3, _excluded3);
  }
}

// skip
for ({
  a
} in {}) {}
for ({
  a
} of []) {}
async function a() {
  for await ({
    a
  } of []) {}
}
for (a in {}) {}
for (a of []) {}
async function a() {
  for await (a of []) {}
}
