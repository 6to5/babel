import _WeakMap from "core-js-pure/features/weak-map/index.js";
import _Object$create from "core-js-pure/features/object/create.js";
import _Object$getOwnPropertyDescriptor from "core-js-pure/features/object/get-own-property-descriptor.js";
import _Object$defineProperty from "core-js-pure/features/object/define-property.js";
export default function _interopRequireWildcard(e, t) {
  if ("function" == typeof _WeakMap) var r = new _WeakMap(),
    n = new _WeakMap();
  return (_interopRequireWildcard = function _interopRequireWildcard(e, t) {
    if (!t && e && e.__esModule) return e;
    var a,
      i = t ? n : r,
      o = {
        __proto__: null,
        "default": e
      };
    if (null == e || Object(e) !== e) return o;
    if (i) {
      if (i.has(e)) return i.get(e);
      i.set(e, o);
    }
    for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((a = _Object$create && _Object$getOwnPropertyDescriptor(e, _t)) && (a.get || a.set) ? _Object$defineProperty(o, _t, a) : o[_t] = e[_t]);
    return o;
  })(e, t);
}