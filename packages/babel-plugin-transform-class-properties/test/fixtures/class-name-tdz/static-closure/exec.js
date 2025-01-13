let foo;
class A {
  static x = 42;
  static [foo = () => A.x];
}
expect(foo()).toBe(42);
