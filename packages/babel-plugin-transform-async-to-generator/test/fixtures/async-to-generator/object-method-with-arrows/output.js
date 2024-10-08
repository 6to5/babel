class Class {
  method() {
    var _this = this;
    return babelHelpers.callAsync(function* () {
      _this;
      () => _this;
      () => {
        _this;
        () => _this;
        function x() {
          var _this2 = this;
          this;
          () => {
            this;
          };
          /*#__PURE__*/babelHelpers.asyncToGenerator(function* () {
            _this2;
          });
        }
      };
      function x() {
        var _this3 = this;
        this;
        () => {
          this;
        };
        /*#__PURE__*/babelHelpers.asyncToGenerator(function* () {
          _this3;
        });
      }
    });
  }
}
