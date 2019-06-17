let a = "outside";

function f(g = () => a) {
  let a = "inside";
  return g();
}

function h(a, g = () => a) {
  return g();
}

function j(g = a) {
  let a = "inside";
  return g;
}

function k([{
  g = a
}]) {
  let a = "inside";
  return g;
}

function l([{
  [a]: g
}]) {
  let a = "inside";
  return g;
}

function m(g = {
  [(({
    [a]: x
  }) => x)()]: "outside"
}) {
  let a = "inside";
  return g;
}

function n(g = (a = a) => {}) {
  let a = "inside";
}

function o(g = (a = a) => a) {
  let a = "inside";
}

function q(a, g = (b = a) => b) {
  g(a);
}

function r(a, g = (a, b = a) => a) {
  g(a);
}
