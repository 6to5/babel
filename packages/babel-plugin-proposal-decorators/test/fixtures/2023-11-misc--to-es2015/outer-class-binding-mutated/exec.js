{
  "class binding in plain class, decorated field, and computed keys"
  const errs = [];
  const fns = [];
  const capture = function (fn) {
    fns.push(fn);
    return () => {}
  }
  const assertUninitialized = function (fn) {
    try {
      fn();
    } catch (err) {
      errs.push(err);
    } finally {
      return () => {}
    }
  }

  capture(() => K);
  assertUninitialized(() => K);

  class K {
    @capture(() => K) @assertUninitialized(() => K) [(capture(() => K), assertUninitialized(() => K))]
  }

  const E = ReferenceError;
  expect(errs.map(e => e.constructor)).toEqual([E, E, E]);

  const C = K;
  expect(fns.map(fn => fn())).toEqual([C, C, C]);

  K = null;

  // expect(fns.map(fn => fn())).toEqual([null, C, C]);
  // todo: remove these three and enable the assertions above when we properly handle class tdz
  expect(fns[0]()).toEqual(null);
  expect(fns[1]()).toEqual(null);
  expect(fns[2]()).toEqual(null);
}

{
  "class binding in decorated class, decorated field, and computed keys"
  const errs = [];
  const fns = [];
  const capture = function (fn) {
    fns.push(fn);
    return () => {}
  }
  const assertUninitialized = function (fn) {
    try {
      fn();
    } catch (err) {
      errs.push(err);
    } finally {
      return () => {}
    }
  }

  @capture(() => K)
  @assertUninitialized(() => K)
  class K {
    //todo: add the assertUninitialized decorator when we properly implement class tdz
    @capture(() => K) [capture(() => K)]
  }

  const E = ReferenceError;
  expect(errs.map(e => e.constructor)).toEqual([E]);

  const C = K;
  expect(fns.map(fn => fn())).toEqual([C, C, C]);

  [K = null] = [];

  expect(fns.map(fn => fn())).toEqual([null, C, C]);
}

{
  "class binding in decorated class, decorated static field, and computed keys"
  const errs = [];
  const fns = [];
  const capture = function (fn) {
    fns.push(fn);
    return () => {}
  }
  const assertUninitialized = function (fn) {
    try {
      fn();
    } catch (err) {
      errs.push(err);
    } finally {
      return () => {}
    }
  }

  @capture(() => K)
  @assertUninitialized(() => K)
  class K {
    //todo: add the assertUninitialized decorator when we properly implement class tdz
    @capture(() => K) static [capture(() => K)]
  }

  const E = ReferenceError;
  expect(errs.map(e => e.constructor)).toEqual([E]);

  const C = K;
  expect(fns.map(fn => fn())).toEqual([C, C, C]);

  ({ K = null } = {});

  expect(fns.map(fn => fn())).toEqual([null, C, C]);
}

{
  "class binding in decorated class, decorated static method, and computed keys with await";
  (async () => {
    const errs = [];
    const fns = [];
    const capture = function (fn) {
      fns.push(fn);
      return () => {}
    }
    const assertUninitialized = function (fn) {
      try {
        fn();
      } catch (err) {
        errs.push(err);
      } finally {
        return () => {}
      }
    }

    @capture(await (() => K))
    @assertUninitialized(await (() => K))
    class K {
      //todo: add the assertUninitialized decorator when we properly implement class tdz
      @capture(await (() => K)) static [capture(await (() => K))]() {}
    }

    const E = ReferenceError;
    expect(errs.map(e => e.constructor)).toEqual([E]);

    const C = K;
    expect(fns.map(fn => fn())).toEqual([C, C, C]);

    [K] = [null];

    expect(fns.map(fn => fn())).toEqual([null, C, C]);
  })()
}
