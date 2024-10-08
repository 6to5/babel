(async function () {
  let items = [1, 2, 3, 4];
  for (const item of items) {
    await f(async (x) => {
      console.log(item);
    });
  }
})();

async function f(lambda) {
  await lambda();
}
