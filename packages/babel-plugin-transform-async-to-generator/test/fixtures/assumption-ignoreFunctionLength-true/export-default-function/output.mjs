export default function (_x) {
  return babelHelpers.callAsync(function* (x) {}, this, arguments);
}
