for (const {foo, ...bar} of {}) {
  () => foo;
  const [qux] = bar;
  try {} catch (e) {
    const quux = qux;
  }
}
