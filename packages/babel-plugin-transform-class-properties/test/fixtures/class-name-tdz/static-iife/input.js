expect(() => {
  class A {
    static x = 42;
    static [(() => A.x)()];
  }
}).toThrow(ReferenceError);
