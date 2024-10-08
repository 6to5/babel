import _Promise from "core-js-pure/features/promise/index.js";
import _bindInstanceProperty from "core-js-pure/features/instance/bind.js";
function _callAsync(n, e, r) {
  return new _Promise(function (t, a) {
    var o = n.apply(e, r),
      c = _bindInstanceProperty(asyncGeneratorStep).call(asyncGeneratorStep, null, 1),
      l = _bindInstanceProperty(asyncGeneratorStep).call(asyncGeneratorStep, null, 0);
    function asyncGeneratorStep(n, e) {
      try {
        var r = n ? o.next(e) : o["throw"](e),
          u = r.value;
      } catch (n) {
        return void a(n);
      }
      r.done ? t(u) : _Promise.resolve(u).then(c, l);
    }
    c();
  });
}
export { _callAsync as default };