/* @minVersion 7.22.0 */

export default function _toSetter(fn: Function, args: any[], thisArg: any) {
  var l = args.length++;
  return Object.defineProperty({}, "_", {
    set: function (v) {
      args[l] = v;
      fn.apply(thisArg, args);
    },
  });
}
