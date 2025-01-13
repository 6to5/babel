var A = 'hello';
enum Foo {
  A = Math.random(),
  B = A,
  C = (() => A)(),
  D = (() => {
    const A = 1;
    return (() => A)()
  })(),
}
