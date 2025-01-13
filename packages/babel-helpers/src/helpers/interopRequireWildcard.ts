/* @minVersion 7.14.0 */

export default function _interopRequireWildcard(
  obj: any,
  nodeInterop: boolean,
) {
  if (typeof WeakMap === "function") {
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
  }

  // @ts-expect-error: assign to function
  return (_interopRequireWildcard = function (obj: any, nodeInterop: boolean) {
    if (!nodeInterop && obj && obj.__esModule) {
      return obj;
    }
    // Temporary variable for output size
    var _;
    var newObj: { [key: string]: any } = { __proto__: null, default: obj };
    var desc: PropertyDescriptor | undefined;

    if (
      obj === null ||
      (typeof obj !== "object" && typeof obj !== "function")
    ) {
      return newObj;
    }

    _ = nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    if (_) {
      if (_.has(obj)) return _.get(obj);
      _.set(obj, newObj);
    }

    for (const key in obj) {
      if (key !== "default" && {}.hasOwnProperty.call(obj, key)) {
        desc =
          (_ = Object.defineProperty) &&
          Object.getOwnPropertyDescriptor(obj, key);
        if (desc && (desc.get || desc.set)) {
          _(newObj, key, desc);
        } else {
          newObj[key] = obj[key];
        }
      }
    }
    return newObj;
  })(obj, nodeInterop);
}
