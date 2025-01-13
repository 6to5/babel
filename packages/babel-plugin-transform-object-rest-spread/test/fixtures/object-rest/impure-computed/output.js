var _$z;
var key, x, y, z;
// impure
key = 1;
var _$a = {
    1: 1,
    a: 1
  },
  _key = key++,
  {
    [_key]: y
  } = _$a,
  x = babelHelpers.objectWithoutProperties(_$a, [_key].map(babelHelpers.toPropertyKey));
expect(x).toEqual({
  a: 1
});
expect(key).toBe(2);
expect(y).toBe(1);

// takes care of the order

key = 1;
var _$ = {
    2: 2,
    3: 3
  },
  _key2 = ++key,
  _key3 = ++key,
  {
    [_key2]: y,
    [_key3]: z
  } = _$,
  rest = babelHelpers.objectWithoutProperties(_$, [_key2, _key3].map(babelHelpers.toPropertyKey));
expect(y).toBe(2);
expect(z).toBe(3);

// pure, computed property should remain as-is
key = 2;
_$z = {
  2: "two",
  z: "zee"
}, {
  [key]: y,
  z
} = _$z, x = babelHelpers.objectWithoutProperties(_$z, [key, "z"].map(babelHelpers.toPropertyKey));
expect(y).toBe("two");
expect(x).toEqual({});
expect(z).toBe("zee");
