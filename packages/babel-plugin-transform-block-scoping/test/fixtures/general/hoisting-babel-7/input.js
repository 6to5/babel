for (let i of nums) {
  var x = 5;
  var { f } = { f: 2 };
  fns.push(function () {
    return i * x;
  });
}
