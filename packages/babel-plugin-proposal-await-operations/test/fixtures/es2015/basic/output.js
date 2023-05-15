/*#__PURE__*/babelHelpers.asyncToGenerator(function* () {
  const promises = [Promise.resolve()];
  yield Promise.all(promises);
  yield Promise.allSettled(promises);
  yield Promise.any(promises);
  yield Promise.race(promises);
});
