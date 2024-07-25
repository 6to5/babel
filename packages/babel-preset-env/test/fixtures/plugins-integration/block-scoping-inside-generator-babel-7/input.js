async function test() {
  const obj = {};
  for (const ch of ["good", "bad"]) {
    obj[ch] = () => ch;
  }
}
