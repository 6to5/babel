/* @minVersion 7.20.5 */

export default function _callSkipFirstGeneratorNext(
  fn: Function,
  self: any,
  args: any[],
) {
  var it = fn.apply(self, args);
  it.next();
  return it;
}
