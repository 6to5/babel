async () => {
  () => await.all [p];
  function f () { await.all [p] }
  class C {
    x = await.all [p];
  }
  function f (x = await.all [p]) {}
  function *f (x = await.all [p]) {}
}

(x = await.all [p]) => {}
