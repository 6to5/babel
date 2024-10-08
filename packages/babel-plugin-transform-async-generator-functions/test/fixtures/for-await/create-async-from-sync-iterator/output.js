function fn() {
  return babelHelpers.newAsyncGenerator(function* () {
    var _iteratorAbruptCompletion = false;
    var _didIteratorError = false;
    var _iteratorError;
    try {
      for (var _iterator = babelHelpers.asyncIterator([Promise.resolve("ok")]), _step; _iteratorAbruptCompletion = !(_step = yield babelHelpers.awaitAsyncGenerator(_iterator.next())).done; _iteratorAbruptCompletion = false) {
        const result = _step.value;
        {
          return {
            result
          };
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
