class C {
  static #x;
  static {
    var { a = 1, #x: x = 2, b = 3 } = C;
  }
}
