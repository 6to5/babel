const _excluded = ["0"];
let result;

class C {
  static #x;
  static {
    var [..._p] = [C],
        _m = _p[0],
        _m2 = _m.#x,
        x = _m2 === void 0 ? 1 : _m2,
        z = babelHelpers.objectWithoutProperties(_p, _excluded);
    result = {
      x,
      z
    };
  }
}
