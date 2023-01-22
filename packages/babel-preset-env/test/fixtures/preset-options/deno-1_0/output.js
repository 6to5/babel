"use strict";

// These syntaxes should be transpiled:
// static {} / ??= / #self in / C?.#self
// The class declaration and the static private property should not be transpiled
var _selfBrandCheck = /*#__PURE__*/new WeakSet();
class C {
  static #self = (_selfBrandCheck.add(this), C);
  static #_ = C.#self ?? (C.#self = _selfBrandCheck.has(babelHelpers.checkInRHS(C?.#self)));
}
