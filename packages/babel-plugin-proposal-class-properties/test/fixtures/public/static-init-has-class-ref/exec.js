const X = class B {
  static a = 0;
  static b = B.a;
}

expect(X.b).toBe(0);
