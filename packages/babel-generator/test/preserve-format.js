import { parse } from "@babel/parser";
import path from "path";
import fixtures from "@babel/helper-fixtures";
import * as babel from "@babel/core";
import pluginTransformTypeScript from "@babel/plugin-transform-typescript";
import { commonJS } from "$repo-utils";
import { cloneNode } from "@babel/types";

import _generate from "../lib/index.js";
const generate = _generate.default || _generate;

const { __dirname } = commonJS(import.meta.url);

const suites = (fixtures.default || fixtures)(path.join(__dirname, "fixtures"));

const FAILURES = [
  // These tests are either explicitly about re-formatting the decorators position,
  // or about an old decorators version
  "comments/decorators-after-export-to-before/input.js",
  "comments/decorators-before-export-to-after/input.js",
  "decorators/decorator-call-expression/input.js",
  "decorators/decorator-parenthesized-expression/input.js",
  "decorators/decorator-parenthesized-expression-createParenthesizedExpression/input.js",
  "decoratorsBeforeExport/false-to-true/input.js",
  "decoratorsBeforeExport/true-to-false/input.js",

  // The 'experimental_preserveFormat' option does not fully support Flow
  "flow/array-types/input.js",
  "flow/arrow-functions/input.js",
  "flow/call-properties/input.js",
  "flow/declare-module/input.js",
  "flow/declare-exports/input.js",
  "flow/declare-statements/input.js",
  "flow/indexed-access-types/input.js",
  "flow/interfaces-module-and-script/input.js",
  "flow/iterator-inside-declare/input.js",
  "flow/iterator-inside-interface/input.js",
  "flow/iterator-inside-types/input.js",
  "flow/object-literal-types/input.js",
  "flow/opaque-type-alias/input.js",
  "flow/parantheses/input.js",
  "flow/predicates/input.js",
  "flow/this-param/input.js",
  "flow/tuples/input.js",
  "flow/type-alias/input.js",
  "flow/type-annotations/input.js",
  "flow/type-union-intersection/input.js",
  "flow/typecasts/input.js",
  "flowUsesCommas/ObjectExpression/input.js",

  // These tests are explicitly about changing the output
  "importAttributesKeyword/assertions-assert-to-with/input.js",
  "importAttributesKeyword/assertions-assert-to-with-legacy/input.js",
  "importAttributesKeyword/assertions-with-to-assert/input.js",
  "importAttributesKeyword/assertions-with-to-with-legacy/input.js",
  "importAttributesKeyword/attributes-assert-to-default/input.js",
  "importAttributesKeyword/attributes-assert-to-default-babel-7/input.js",
  "importAttributesKeyword/attributes-assert-to-with/input.js",
  "importAttributesKeyword/attributes-assert-to-with-legacy/input.js",
  "importAttributesKeyword/attributes-with-to-assert/input.js",
  "importAttributesKeyword/attributes-with-to-with-legacy/input.js",
  "importAttributesKeyword/legacy-module-attributes-to-assert/input.js",
  "importAttributesKeyword/legacy-module-attributes-to-with/input.js",

  // These tests are about old proposals
  "types/Decorator/input.js",
];

describe("experimental_preserveFormat", () => {
  describe("generation", () => {
    suites.forEach(testSuite => {
      describe(`${testSuite.title}`, () => {
        testSuite.tests.forEach(function (task) {
          if (task.options.throws) return;

          const testFn = task.disabled ? it.skip : it;

          const shouldFail = FAILURES.some(f =>
            task.actual.loc.replace(/\\/g, "/").endsWith(f),
          );

          const parserOpts = {
            filename: task.actual.loc,
            plugins: task.options.plugins || [],
            strictMode: task.options.strictMode === false ? false : true,
            sourceType: "module",
            ...task.options.parserOpts,
            createParenthesizedExpressions: true,
            tokens: true,
          };
          const generatorOpts = {
            sourceFileName: path.relative(__dirname, task.actual.loc),
            ...task.options,
            retainLines: true,
            experimental_preserveFormat: true,
            comments: true,
            jsescOption: null,
            minified: false,
            compact: false,
          };

          const input = task.actual.code.replace(/\r\n?/g, "\n");

          testFn(task.title, () => {
            const ast = parse(input, parserOpts);
            const ok = generate(ast, generatorOpts, input).code === input;

            if (!ok && shouldFail) {
              expect(1).toBe(1);
              return;
            }
            if (ok) {
              expect(shouldFail).toBe(false);
            }

            expect(generate(ast, generatorOpts, input).code).toBe(input);
          });

          if (!shouldFail) {
            testFn(`${task.title} without loc`, () => {
              const ast = parse(input, parserOpts);
              ast.program = cloneNode(ast.program, true, true);

              const code = generate(ast, generatorOpts, input).code;
              try {
                parse(code, parserOpts);
              } catch (error) {
                expect([code, error]).toEqual([input, null]);
              }
            });
          }
        });
      });
    });
  });

  describe("code transforms", () => {
    it("type stripping with arrow functions", () => {
      const input = `
        const a = (x: string):
                        number => 2 as const;
      `;
      const expected = `
        const a = (x        )=>
                                  2         ;
      `;

      const out = babel.transformSync(input, {
        configFile: false,
        plugins: [pluginTransformTypeScript],
        parserOpts: {
          createParenthesizedExpressions: true,
          tokens: true,
        },
        generatorOpts: {
          retainLines: true,
          experimental_preserveFormat: true,
        },
      });

      expect(out.code.trimEnd()).toBe(expected.trimEnd());
    });

    it("identifier renaming", () => {
      const input = `
        const foo = 3;
        const bar = 3;

        foo( x, y, z );
        bar( x, y, z );
      `;
      const expected = `
        const x   = 3;
        const longer=3;

        x  ( x, y, z );
        longer(x,y,z );
      `;

      const out = babel.transformSync(input, {
        configFile: false,
        plugins: [
          () => ({
            visitor: {
              Program(path) {
                path.scope.rename("foo", "x");
                path.scope.rename("bar", "longer");
              },
            },
          }),
        ],
        parserOpts: {
          createParenthesizedExpressions: true,
          tokens: true,
        },
        generatorOpts: {
          retainLines: true,
          experimental_preserveFormat: true,
        },
      });

      expect(out.code.trimEnd()).toBe(expected.trimEnd());
    });

    it("node injection", () => {
      const input = `
        const    foo
            = 3;
                  const  bar          =
            3;
        bax
      `;
      const expected = `
        const    foo
            = 3;hello;
                  const  bar          =
            3;
        bax
      `;

      const out = babel.transformSync(input, {
        configFile: false,
        plugins: [
          ({ types: t }) => ({
            visitor: {
              Program(path) {
                path
                  .get("body.0")
                  .insertAfter(t.expressionStatement(t.identifier("hello")));
              },
            },
          }),
        ],
        parserOpts: {
          createParenthesizedExpressions: true,
          tokens: true,
        },
        generatorOpts: {
          retainLines: true,
          experimental_preserveFormat: true,
        },
      });

      expect(out.code.trimEnd()).toBe(expected.trimEnd());
    });

    it("injects new semicolon when needed", () => {
      const input = `
        const foo = 3
      `;
      const expected = `
        const foo = 3;hello;
      `;

      const out = babel.transformSync(input, {
        configFile: false,
        plugins: [
          ({ types: t }) => ({
            visitor: {
              Program(path) {
                path.pushContainer(
                  "body",
                  t.expressionStatement(t.identifier("hello")),
                );
              },
            },
          }),
        ],
        parserOpts: {
          createParenthesizedExpressions: true,
          tokens: true,
        },
        generatorOpts: {
          retainLines: true,
          experimental_preserveFormat: true,
        },
      });

      expect(out.code.trimEnd()).toBe(expected.trimEnd());
    });

    it("injects new semicolon when needed, after a comment", () => {
      const input = `
        const foo = 3 /* comment */
      `;
      const expected = `
        const foo = 3 /* comment */;hello;
      `;

      const out = babel.transformSync(input, {
        configFile: false,
        plugins: [
          ({ types: t }) => ({
            visitor: {
              Program(path) {
                path.pushContainer(
                  "body",
                  t.expressionStatement(t.identifier("hello")),
                );
              },
            },
          }),
        ],
        parserOpts: {
          createParenthesizedExpressions: true,
          tokens: true,
        },
        generatorOpts: {
          retainLines: true,
          experimental_preserveFormat: true,
        },
      });

      expect(out.code.trimEnd()).toBe(expected.trimEnd());
    });
  });
});
