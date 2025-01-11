var x = 10;
var Foo = /*#__PURE__*/function (Foo) {
  Foo[Foo["a"] = 10] = "a";
  Foo[Foo["b"] = 10] = "b";
  Foo[Foo["c"] = 20] = "c";
  return Foo;
}(Foo || {});
var Bar = function (Bar) {
  Bar[Bar["D"] = 10] = "D";
  Bar[Bar["E"] = 10] = "E";
  Bar[Bar["F"] = Math.E] = "F";
  Bar[Bar["G"] = 30] = "G";
  return Bar;
}(Bar || {});
var Baz = function (Baz) {
  Baz[Baz["a"] = 0] = "a";
  Baz[Baz["b"] = 1] = "b";
  // @ts-ignore
  Baz[Baz["x"] = Baz.a.toString()] = "x";
  return Baz;
}(Baz || {});
var A = function (A) {
  A[A["a"] = 0] = "a";
  A[A["b"] = (() => {
    let a = 1;
    return a + 1;
  })()] = "b";
  // a is shadowed
  A[A["c"] = (() => {
    return A.a + 2;
  })()] = "c"; // a refers to A.a
  return A;
}(A || {});
