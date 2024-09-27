"use strict";

const results = [0, 1, 2];
const fns = [];

for (let result of results) {
  result = result * 2;
  fns.push(() => {
    return result;
  });
}

expect(fns[0]()).toBe(0);
expect(fns[1]()).toBe(2);
expect(fns[2]()).toBe(4);
