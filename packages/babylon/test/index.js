var getFixtures = require("babel-helper-fixtures").multiple;
var parse       = require("../lib").parse;
var _           = require("lodash");
var fs          = require("fs");

var fixtures = reduceFixtures(getFixtures(__dirname + "/fixtures"));
var saveResultedJSON = true;

_.each(fixtures, function (suites, name) {
  _.each(suites, function (testSuite) {
    suite(name + "/" + testSuite.title, function () {
      _.each(testSuite.tests, function (task) {
        test(task.title, !task.disabled && function () {
          try {
            return runTest(task);
          } catch (err) {
            err.message = task.actual.loc + ": " + err.message;
            throw err;
          }
        });
      });
    });
  });
});

/*
  `TEST_ONLY=babylon make test-only` indeed runs the tests of babylon only.
  However, we may need to test specific fixture category and specific test inside.
  The function below allow us providing the following options:
  ```
  // test/fixtures/cssx/options.json
  {
    "plugins": ["cssx"],
    "only": {}
  }
  ```
  This will run only `cssx` fixture category. We may go further and use 
  ```
  {
    "plugin": ["cssx"],
    "only": { "test": "10" }
  }
  ````
  which will run `/test/fixtures/cssx/basic/10` test only.
*/
function reduceFixtures (fixturesCategories) {
  return _.reduce(fixturesCategories, function (result, value, key) {
    if (!result.onlyOne) {
      var ops = value[0].options;
      if (ops && typeof ops.only !== 'undefined') {
        result.onlyOne = true;
        result.fixtures = {};
        if (typeof ops.only.test !== 'undefined') {
          value = _.reduce(value, function (result, subCategory) {
            var test = _.find(subCategory.tests, function (t) { return t.title === ops.only.test; });
            if (typeof test !== 'undefined') {
              subCategory.tests = [test];
              result.push(subCategory);
            }
            return result;
          }, []);
        }
      }
      result.fixtures[key] = value;
    }
    return result;
  }, { onlyOne: false, fixtures: {} }).fixtures;
}

function save(test, ast) {
  delete ast.tokens;
  if (!ast.comments.length) delete ast.comments;
  fs.writeFileSync(test.expect.loc, JSON.stringify(ast, null, "  "));
}

function runTest(test) {
  var opts = test.options;
  opts.locations = true;
  opts.ranges = true;

  try {
    var ast = parse(test.actual.code, opts);
  } catch (err) {
    if (opts.throws) {
      if (err.message === opts.throws) {
        return;
      } else {
        err.message = "Expected error message: " + opts.throws + ". Got error message: " + err.message;
        throw err;
      }
    }

    throw err;
  }

  if (!test.expect.code) {
    test.expect.loc += "on";
    return save(test, ast);
  }

  if (opts.throws) {
    throw new Error("Expected error message: " + opts.throws + ". But parsing succeeded.");
  } else {
    var mis = misMatch(JSON.parse(test.expect.code), ast);
    if (mis) {
      saveResultedJSON ? fs.writeFileSync(test.expect.loc + '.result', JSON.stringify(ast, null, 2)) : null;
      //save(test, ast);
      throw new Error(mis);
    } else if (saveResultedJSON && fs.existsSync(test.expect.loc + '.result')) {
      fs.unlink(test.expect.loc + '.result');
    }
  }
}

function ppJSON(v) {
  return v instanceof RegExp ? v.toString() : JSON.stringify(v, null, 2);
}

function addPath(str, pt) {
  if (str.charAt(str.length - 1) == ")") {
    return str.slice(0, str.length - 1) + "/" + pt + ")";
  } else {
    return str + " (" + pt + ")";
  }
}

function misMatch(exp, act) {
  if (!exp || !act || (typeof exp != "object") || (typeof act != "object")) {
    if (exp !== act && typeof exp != "function")
      return ppJSON(exp) + " !== " + ppJSON(act);
  } else if (exp instanceof RegExp || act instanceof RegExp) {
    var left = ppJSON(exp), right = ppJSON(act);
    if (left !== right) return left + " !== " + right;
  } else if (exp.splice) {
    if (!act.slice) return ppJSON(exp) + " != " + ppJSON(act);
    if (act.length != exp.length) return "array length mismatch " + exp.length + " != " + act.length;
    for (var i = 0; i < act.length; ++i) {
      var mis = misMatch(exp[i], act[i]);
      if (mis) return addPath(mis, i);
    }
  } else {
    for (var prop in exp) {
      var mis = misMatch(exp[prop], act[prop]);
      if (mis) return addPath(mis, prop);
    }
  }
}
