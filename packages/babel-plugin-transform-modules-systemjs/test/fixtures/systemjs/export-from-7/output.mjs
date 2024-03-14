System.register(["./traverse/x", "./traverse/traverse"], function (_export, _context) {
  "use strict";

  return {
    setters: [function (_traverseX) {
      var _exportObj = {};
      for (var _key in _traverseX) {
        if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _traverseX[_key];
      }
      _export(_exportObj);
    }, function (_traverseTraverse) {
      var _exportObj2 = {};
      for (var _key2 in _traverseTraverse) {
        if (_key2 !== "default" && _key2 !== "__esModule") _exportObj2[_key2] = _traverseTraverse[_key2];
      }
      _exportObj2.traverse = _traverseTraverse.default;
      _export(_exportObj2);
    }],
    execute: function () {}
  };
});
