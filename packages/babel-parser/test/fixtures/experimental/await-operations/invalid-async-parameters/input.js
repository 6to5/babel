async () => {
  async (x = await.all [p]) => {}
  (x = await.all [p]) => {}
  async function f(x = await.all [p]) {}
  class C { async f(x = await.all [p]) {} }
  ({ async f(x = await.all [p]) {} });
}
