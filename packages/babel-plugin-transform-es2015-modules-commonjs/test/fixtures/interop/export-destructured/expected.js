"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.f1 = f1;
exports.f2 = f2;
exports.f3 = f3;
let x = exports.x = 0;
let y = exports.y = 0;

function f1() {
  ({
    x
  } = {
    x: 1
  });
  exports.x = x;
}

function f2() {
  ({
    x,
    y
  } = {
    x: 2,
    y: 3
  });
  exports.y = y;
  exports.x = x;
}

function f3() {
  [x, y, z] = [3, 4, 5];
  exports.y = y;
  exports.x = x;
}
