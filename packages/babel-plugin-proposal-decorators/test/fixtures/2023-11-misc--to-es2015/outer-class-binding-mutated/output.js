{
  var _K;
  let _computedKeyDecs, _computedKey, _init_computedKey, _init_extra_computedKey, _ref;
  "class binding in plain class, decorated field, and computed keys";
  const errs = [];
  const fns = [];
  const capture = function (fn) {
    fns.push(fn);
    return () => {};
  };
  const assertUninitialized = function (fn) {
    try {
      fn();
    } catch (err) {
      errs.push(err);
    } finally {
      return () => {};
    }
  };
  capture(() => K);
  assertUninitialized(() => K);
  _ref = (_computedKeyDecs = [capture(() => K), assertUninitialized(() => K)], _computedKey = babelHelpers.toPropertyKey((capture(() => K), assertUninitialized(() => K))));
  class K {
    constructor() {
      babelHelpers.defineProperty(this, _ref, _init_computedKey(this));
      _init_extra_computedKey(this);
    }
  }
  _K = K;
  [_init_computedKey, _init_extra_computedKey] = babelHelpers.applyDecs2311(_K, [], [[_computedKeyDecs, 0, _computedKey]]).e;
  const E = ReferenceError;
  expect(errs.map(e => e.constructor)).toEqual([E, E, E]);
  const C = K;
  // expect(fns.map(fn => fn())).toEqual([C, C, C]);
  // todo: remove these three and enable the assertions above when we properly handle class tdz
  expect(fns[0]()).toEqual(C);
  expect(fns[1]).toThrow(E);
  expect(fns[2]).toThrow(E);
  K = null;

  // expect(fns.map(fn => fn())).toEqual([null, C, C]);
  // todo: remove these three and enable the assertions above when we properly handle class tdz
  expect(fns[0]()).toEqual(null);
  expect(fns[1]).toThrow(E);
  expect(fns[2]).toThrow(E);
}
{
  let _initClass, _classDecs, _computedKeyDecs2, _computedKey2, _init_computedKey2, _init_extra_computedKey2;
  "class binding in decorated class, decorated field, and computed keys";
  const errs = [];
  const fns = [];
  const capture = function (fn) {
    fns.push(fn);
    return () => {};
  };
  const assertUninitialized = function (fn) {
    try {
      fn();
    } catch (err) {
      errs.push(err);
    } finally {
      return () => {};
    }
  };
  _classDecs = [capture(() => _K2), assertUninitialized(() => _K2)];
  let _K2, _t_K;
  {
    var _K3;
    let _ref2;
    let _K2;
    _ref2 = (_computedKeyDecs2 = capture(() => _K2), _computedKey2 = babelHelpers.toPropertyKey(capture(() => _K2)));
    class K {
      constructor() {
        //todo: add the assertUninitialized decorator when we properly implement class tdz
        babelHelpers.defineProperty(this, _ref2, _init_computedKey2(this));
        _init_extra_computedKey2(this);
      }
    }
    _K3 = K;
    ({
      e: [_init_computedKey2, _init_extra_computedKey2],
      c: [_K2, _initClass]
    } = babelHelpers.applyDecs2311(_K3, _classDecs, [[_computedKeyDecs2, 0, _computedKey2]]));
    _initClass();
    _t_K = _K2;
  }
  _K2 = _t_K;
  const E = ReferenceError;
  expect(errs.map(e => e.constructor)).toEqual([E]);
  const C = _K2;
  expect(fns.map(fn => fn())).toEqual([C, C, C]);
  [_K2 = null] = [];
  expect(fns.map(fn => fn())).toEqual([null, C, C]);
}
{
  let _initClass2, _classDecs2, _computedKeyDecs3, _computedKey3, _init_computedKey3, _init_extra_computedKey3;
  "class binding in decorated class, decorated static field, and computed keys";
  const errs = [];
  const fns = [];
  const capture = function (fn) {
    fns.push(fn);
    return () => {};
  };
  const assertUninitialized = function (fn) {
    try {
      fn();
    } catch (err) {
      errs.push(err);
    } finally {
      return () => {};
    }
  };
  _classDecs2 = [capture(() => _K4), assertUninitialized(() => _K4)];
  let _K4, _t_K2;
  {
    var _Class, _K6;
    let _K5, _ref3;
    let _K4;
    new (_K5 = (_ref3 = (_computedKeyDecs3 = capture(() => _K4), _computedKey3 = babelHelpers.toPropertyKey(capture(() => _K4)), "_"), _K6 = class K {}, babelHelpers.defineProperty(_K6, _ref3, void 0), (() => {
      delete _K6._;
      ({
        e: [_init_computedKey3, _init_extra_computedKey3],
        c: [_K4, _initClass2]
      } = babelHelpers.applyDecs2311(_K6, _classDecs2, [[_computedKeyDecs3, 8, _computedKey3]]));
    })(), _K6), _Class = class extends babelHelpers.identity {
      constructor() {
        super(_K4), babelHelpers.defineProperty(this, _computedKey3, _init_computedKey3()), (() => {
          _init_extra_computedKey3();
        })(), _initClass2();
      }
    }, babelHelpers.defineProperty(_Class, _K5, void 0), _Class)();
    _t_K2 = _K4;
  }
  _K4 = _t_K2;
  const E = ReferenceError;
  expect(errs.map(e => e.constructor)).toEqual([E]);
  const C = _K4;
  expect(fns.map(fn => fn())).toEqual([C, C, C]);
  ({
    K: _K4 = null
  } = {});
  expect(fns.map(fn => fn())).toEqual([null, C, C]);
}
{
  "class binding in decorated class, decorated static method, and computed keys with await";
  (async (_initStatic, _initClass3, _classDecs3, _computedKeyDecs4, _computedKey5) => {
    const errs = [];
    const fns = [];
    const capture = function (fn) {
      fns.push(fn);
      return () => {};
    };
    const assertUninitialized = function (fn) {
      try {
        fn();
      } catch (err) {
        errs.push(err);
      } finally {
        return () => {};
      }
    };
    _classDecs3 = [capture(await (() => _K7)), assertUninitialized(await (() => _K7))];
    let _K7, _t_K3;
    {
      var _K8;
      let _ref4;
      let _K7;
      _ref4 = (_computedKeyDecs4 = capture(await (() => _K7)), _computedKey5 = babelHelpers.toPropertyKey(capture(await (() => _K7))));
      class K {
        //todo: add the assertUninitialized decorator when we properly implement class tdz
        static [_ref4]() {}
      }
      _K8 = K;
      (() => {
        ({
          e: [_initStatic],
          c: [_K7, _initClass3]
        } = babelHelpers.applyDecs2311(_K8, _classDecs3, [[_computedKeyDecs4, 10, _computedKey5]]));
        _initStatic(_K8);
      })();
      _initClass3();
      _t_K3 = _K7;
    }
    _K7 = _t_K3;
    const E = ReferenceError;
    expect(errs.map(e => e.constructor)).toEqual([E]);
    const C = _K7;
    expect(fns.map(fn => fn())).toEqual([C, C, C]);
    [_K7] = [null];
    expect(fns.map(fn => fn())).toEqual([null, C, C]);
  })();
}
