// ts 5.0 feature

const BaseValue = 10;
const Prefix = "/data";
var Values = /*#__PURE__*/function (Values) {
  Values[Values["First"] = 10] = "First";
  // 10
  Values[Values["Second"] = 11] = "Second";
  // 11
  Values[Values["Third"] = 12] = "Third"; // 12
  return Values;
}(Values || {});
const xxx = 100 + Values.First;
const yyy = xxx;
var Routes = /*#__PURE__*/function (Routes) {
  Routes["Parts"] = "/data/parts";
  // "/data/parts"
  Routes["Invoices"] = "/data/invoices";
  // "/data/invoices"
  Routes["x"] = "10/x";
  Routes["y"] = "110/y";
  return Routes;
}(Routes || {});
