for (let result of results) {
  result = otherValue;
  fn(() => {
    result;
  });
}
