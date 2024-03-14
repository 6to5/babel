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
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (!nodeInterop && obj && obj.__esModule) {
      return obj;
    }

    var cache = nodeInterop ? cacheNodeInterop : cacheBabelInterop,
      newObj: any = { __proto__: null, default: obj },
      desc: PropertyDescriptor;

    if (obj == null || Object(obj) !== obj) {
      return newObj;
    }

    if (cache) {
      if (cache.has(obj)) return cache.get(obj);
      cache.set(obj, newObj);
    }

    for (const key in obj) {
      if (key !== "default" && {}.hasOwnProperty.call(obj, key)) {
        // Object.create and Object.defineProperty and Object.getOwnPropertyDescriptor
        // must all be defined or undefined together.
        desc = Object.create && Object.getOwnPropertyDescriptor(obj, key);
        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key, desc);
        } else {
          newObj[key] = obj[key];
        }
      }
    }
    return newObj;
  })(obj, nodeInterop);
}
