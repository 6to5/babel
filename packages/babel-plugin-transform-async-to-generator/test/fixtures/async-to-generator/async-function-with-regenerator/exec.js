async function foo(x) {
    this;
    arguments;
    return arguments[0];
}

return async () => {
  expect(await foo(1)).toBe(1);
  expect(await foo(2)).toBe(2);
};
