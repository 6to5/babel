import * as babel from "@babel/core";
import vm from "vm";
import { fileURLToPath } from "url";
import path from "path";

test("Re-export doesn't overwrite __esModule flag", function () {
  let code = 'export * from "./dep";';
  const depStub = {
    __esModule: false,
  };

  const context = {
    module: {
      exports: {},
    },
    require: function (id) {
      if (id === "./dep") return depStub;
      return require(id);
    },
  };
  context.exports = context.module.exports;

  code = babel.transform(code, {
    cwd: path.dirname(fileURLToPath(import.meta.url)),
    plugins: [[require("../"), { loose: true }]],
    ast: false,
  }).code;

  vm.runInNewContext(code, context);

  // exports.__esModule shouldn't be overwritten.
  expect(context.exports.__esModule).toBe(true);
});
