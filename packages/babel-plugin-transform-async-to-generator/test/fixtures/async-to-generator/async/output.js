class Foo {
  foo() {
    return babelHelpers.callAsync(function* () {
      var wat = yield bar();
    });
  }
}
