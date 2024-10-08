return (async function () {
  let items = [1, 2, 3, 4];
  let output = [];
  for (const item of items) {
    await f(async (x) => {
      output.push(item);
    });
  }
  expect(output).toStrictEqual([1, 2, 3, 4]);
})();

async function f(lambda) {
  await lambda();
}
