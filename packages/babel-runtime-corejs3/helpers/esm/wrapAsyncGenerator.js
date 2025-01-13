import _Promise from "core-js-pure/features/promise/index.js";
import _Object$create from "core-js-pure/features/object/create.js";
import _Symbol from "core-js-pure/features/symbol/index.js";
import _Symbol$asyncIterator from "core-js-pure/features/symbol/async-iterator.js";
import OverloadYield from "./OverloadYield.js";
function _wrapAsyncGenerator(e) {
  return function () {
    return new AsyncGenerator(e.apply(this, arguments));
  };
}
function AsyncGenerator(e) {
  var r, t;
  function resume(r, t) {
    try {
      var n = e[r](t),
        o = n.value,
        a = o instanceof OverloadYield;
      _Promise.resolve(a ? o.v : o).then(function (t) {
        if (a) {
          var c = "return" === r ? "return" : "next";
          if (!o.k || t.done) return resume(c, t);
          t = e[c](t).value;
        }
        settle(n.done ? "return" : "normal", t);
      }, function (e) {
        resume("throw", e);
      });
    } catch (e) {
      settle("throw", e);
    }
  }
  function settle(e, n) {
    switch (e) {
      case "return":
        r.resolve({
          value: n,
          done: !0
        });
        break;
      case "throw":
        r.reject(n);
        break;
      default:
        r.resolve({
          value: n,
          done: !1
        });
    }
    (r = r.next) ? resume(r.key, r.arg) : t = null;
  }
  this._invoke = function (e, n) {
    return new _Promise(function (o, a) {
      var c = {
        key: e,
        arg: n,
        resolve: o,
        reject: a,
        next: null
      };
      t ? t = t.next = c : (r = t = c, resume(e, n));
    });
  }, "function" != typeof e["return"] && (this["return"] = void 0);
}
var AsyncIteratorPrototype = {},
  AsyncGeneratorPrototype = _Object$create(AsyncIteratorPrototype),
  AsyncGeneratorInstanceProrotype = _Object$create(AsyncGeneratorPrototype);
AsyncGenerator.prototype = AsyncGeneratorInstanceProrotype, AsyncGeneratorPrototype.constructor = AsyncGenerator, AsyncIteratorPrototype["function" == typeof _Symbol && _Symbol$asyncIterator || "@@asyncIterator"] = function () {
  return this;
}, AsyncGenerator.prototype.next = function (e) {
  return this._invoke("next", e);
}, AsyncGenerator.prototype["throw"] = function (e) {
  return this._invoke("throw", e);
}, AsyncGenerator.prototype["return"] = function (e) {
  return this._invoke("return", e);
};
export { _wrapAsyncGenerator as default };