class Foo {
  async foo(x) {
    this;
    arguments;
    return arguments[0];
  }
}

return async () => {
  const foo = new Foo();
  expect(await foo.foo(1)).toBe(1);
  expect(await foo.foo(2)).toBe(2);
};
