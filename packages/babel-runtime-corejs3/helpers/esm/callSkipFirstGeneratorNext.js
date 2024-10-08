function _callSkipFirstGeneratorNext(t, e, r) {
  var a = t.apply(e, r);
  return a.next(), a;
}
export { _callSkipFirstGeneratorNext as default };