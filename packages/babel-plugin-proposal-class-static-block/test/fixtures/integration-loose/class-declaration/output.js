class Foo {}

Foo.bar = 42;
Foo.foo = Foo.bar;
expect(Foo.foo).toBe(42);
