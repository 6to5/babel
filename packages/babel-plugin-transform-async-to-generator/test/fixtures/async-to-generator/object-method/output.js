let obj = {
  a: 123,
  foo(bar) {
    return babelHelpers.callAsync(function* () {
      return yield baz(bar);
    });
  }
};
