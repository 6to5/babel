var A = 'hello';
var Foo = function (Foo) {
  Foo[Foo["A"] = Math.random()] = "A";
  Foo[Foo["B"] = Foo.A] = "B";
  Foo[Foo["C"] = (() => Foo.A)()] = "C";
  Foo[Foo["D"] = (() => {
    const A = 1;
    return (() => A)();
  })()] = "D";
  return Foo;
}(Foo || {});
