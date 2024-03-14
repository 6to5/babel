import runner from "@babel/helper-plugin-test-runner";
import {
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "fs";
import path from "path";
import { commonJS, describeGte } from "$repo-utils";
import { transformFileSync } from "@babel/core";
import transformModulesCommonjs from "../lib/index.js";

const { __dirname, require } = commonJS(import.meta.url);

runner(import.meta.url);

describeGte("10.0.0")("compat", () => {
  it("should work with cjs-module-lexer", async () => {
    const lexer = require("cjs-module-lexer");

    const code = readFileSync(
      path.join(__dirname, "./fixtures/real-world/babel-types-index/output.js"),
      "utf8",
    );

    const exports = lexer.parse(code);
    expect(exports).toMatchInlineSnapshot(`
      Object {
        "exports": Array [
          "__esModule",
          "valueToNode",
          "validate",
          "traverseFast",
          "traverse",
          "toStatement",
          "toKeyAlias",
          "toIdentifier",
          "toExpression",
          "toComputedKey",
          "toBlock",
          "toBindingIdentifierName",
          "shallowEqual",
          "removeTypeDuplicates",
          "removePropertiesDeep",
          "removeProperties",
          "removeComments",
          "react",
          "prependToMemberExpression",
          "matchesPattern",
          "isVar",
          "isValidIdentifier",
          "isValidES3Identifier",
          "isType",
          "isSpecifierDefault",
          "isScope",
          "isReferenced",
          "isPlaceholderType",
          "isNodesEquivalent",
          "isNode",
          "isLet",
          "isImmutable",
          "isBlockScoped",
          "isBinding",
          "is",
          "inheritsComments",
          "inherits",
          "inheritTrailingComments",
          "inheritLeadingComments",
          "inheritInnerComments",
          "getOuterBindingIdentifiers",
          "getBindingIdentifiers",
          "ensureBlock",
          "createUnionTypeAnnotation",
          "createTypeAnnotationBasedOnTypeof",
          "createTSUnionType",
          "createFlowUnionType",
          "cloneWithoutLoc",
          "cloneNode",
          "cloneDeepWithoutLoc",
          "cloneDeep",
          "clone",
          "buildMatchMemberExpression",
          "assertNode",
          "appendToMemberExpression",
          "addComments",
          "addComment",
          "__internal__deprecationWarning",
        ],
        "reexports": Array [
          "./asserts/generated/index.js",
          "./builders/generated/index.js",
          "./builders/generated/uppercase.js",
          "./builders/productions.js",
          "./constants/generated/index.js",
          "./constants/index.js",
          "./definitions/index.js",
          "./traverse/traverse.js",
          "./validators/generated/index.js",
        ],
      }
    `);
  });
});

const execFixtures = path.join(__dirname, "./fixtures/.exec/");
readdirSync(execFixtures).forEach(testName => {
  if (testName.includes(".")) return;
  const inputDir = path.join(execFixtures, testName, "input");
  const outputPath = path.join(execFixtures, testName, "output");
  try {
    rmSync(outputPath, { recursive: true });
  } catch (error) {}
  mkdirSync(outputPath);

  readdirSync(inputDir).forEach(file => {
    const result = transformFileSync(path.join(inputDir, file), {
      plugins: [transformModulesCommonjs],
      configFile: false,
      babelrc: false,
    });
    writeFileSync(path.join(outputPath, file), result.code);
  });
  require(path.join(outputPath, "index.js"));
});
