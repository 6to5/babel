function g() {
  return babelHelpers.newAsyncGenerator(function* () {
    var _iteratorAbruptCompletion = false;
    var _didIteratorError = false;
    var _iteratorError;
    try {
      for (var _iterator = babelHelpers.asyncIterator(y), _step; _iteratorAbruptCompletion = !(_step = yield babelHelpers.awaitAsyncGenerator(_iterator.next())).done; _iteratorAbruptCompletion = false) {
        let x = _step.value;
        {
          f(x);
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (_iteratorAbruptCompletion && _iterator.return != null) {
          yield babelHelpers.awaitAsyncGenerator(_iterator.return());
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }, this, arguments);
}
