var a = 5;
var b = 0;
a + b++, babelHelpers.readOnlyError("a");
var c = 32;
var d = 1;
c >>> ++d, babelHelpers.readOnlyError("c");
var e = 0;
var f = 1;
e ||= (++f, babelHelpers.readOnlyError("e"));
