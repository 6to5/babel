for (var i = 0; i < 3; i = (i + 1, babelHelpers.readOnlyError("i"))) {
  console.log(i);
}

for (var j = 0; j < 3; j + 1, babelHelpers.readOnlyError("j")) {
  console.log(j);
}
