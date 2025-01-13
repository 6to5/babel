import { parse } from "@babel/parser";
import * as t from "@babel/types";

import _traverse from "../lib/index.js";
import _generate from "@babel/generator";
const traverse = _traverse.default || _traverse;
const generate = _generate.default || _generate;

function getPath(code, parserOpts) {
  const ast = parse(code, parserOpts);
  let path;
  traverse(ast, {
    Program: function (_path) {
      path = _path.get("body.0");
      _path.stop();
    },
  });

  return path;
}

function generateCode(path) {
  return generate(path.parentPath.node).code;
}

describe("modification", function () {
  describe("pushContainer", function () {
    it("pushes identifier into params", function () {
      const rootPath = getPath("function test(a) {}");
      rootPath.pushContainer("params", t.identifier("b"));

      expect(generateCode(rootPath)).toBe("function test(a, b) {}");
    });

    it("pushes identifier into block", function () {
      const rootPath = getPath("function test(a) {}");
      const path = rootPath.get("body");
      path.pushContainer("body", t.expressionStatement(t.identifier("b")));

      expect(generateCode(rootPath)).toBe("function test(a) {\n  b;\n}");
    });

    it("properly handles more than one arguments", function () {
      const code = "foo(a, b);";
      const ast = parse(code);
      traverse(ast, {
        CallExpression: function (path) {
          path.pushContainer("arguments", t.identifier("d"));
          expect(generateCode(path)).toBe("foo(a, b, d);");
          path.pushContainer("arguments", t.stringLiteral("s"));
          expect(generateCode(path)).toBe(`foo(a, b, d, "s");`);
        },
      });
    });

    it("should set the correct path.context", function () {
      expect.assertions(2);

      const ast = parse("[b];");
      traverse(ast, {
        skipKeys: ["consequent"],
        ExpressionStatement(path) {
          path.traverse({ Identifier() {}, skipKeys: [] });

          const arr = path.get("expression");
          const x = arr.pushContainer("elements", [
            { type: "Identifier", name: "x" },
          ])[0];

          expect(x.node.name).toBe("x");
          expect(x.opts.skipKeys).toEqual(["consequent"]);
        },
      });
    });
  });
  describe("unshiftContainer", function () {
    it("unshifts identifier into params", function () {
      const rootPath = getPath("function test(a) {}");
      rootPath.unshiftContainer("params", t.identifier("b"));

      expect(generateCode(rootPath)).toBe("function test(b, a) {}");
    });

    it("unshifts identifier into block", function () {
      const rootPath = getPath("function test(a) {}");
      const path = rootPath.get("body");
      path.unshiftContainer("body", t.expressionStatement(t.identifier("b")));

      expect(generateCode(rootPath)).toBe("function test(a) {\n  b;\n}");
    });

    it("properly handles more than one arguments", function () {
      const code = "foo(a, b);";
      const ast = parse(code);
      traverse(ast, {
        CallExpression: function (path) {
          path.unshiftContainer("arguments", t.identifier("d"));
          expect(generateCode(path)).toBe("foo(d, a, b);");
          path.unshiftContainer("arguments", t.stringLiteral("s"));
          expect(generateCode(path)).toBe(`foo("s", d, a, b);`);
        },
      });
    });

    it("should set the correct path.context", function () {
      expect.assertions(2);

      const ast = parse("[b];");
      traverse(ast, {
        skipKeys: ["consequent"],
        ExpressionStatement(path) {
          path.traverse({ Identifier() {}, skipKeys: [] });

          const arr = path.get("expression");
          const x = arr.unshiftContainer("elements", [
            { type: "Identifier", name: "x" },
          ])[0];

          expect(x.node.name).toBe("x");
          expect(x.opts.skipKeys).toEqual(["consequent"]);
        },
      });
    });
  });

  describe("insertBefore", function () {
    it("returns inserted path with BlockStatement", function () {
      const rootPath = getPath("if (x) { y; }");
      const path = rootPath.get("consequent.body.0");
      const result = path.insertBefore(t.identifier("b"));

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result[0].node).toEqual(t.identifier("b"));
      expect(generateCode(rootPath)).toBe("if (x) {\n  b\n  y;\n}");
    });

    it("returns inserted path without BlockStatement", function () {
      const rootPath = getPath("if (x) y;");
      const path = rootPath.get("consequent");
      const result = path.insertBefore(t.identifier("b"));

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result[0].node).toEqual(t.identifier("b"));
      expect(generateCode(rootPath)).toBe("if (x) {\n  b\n  y;\n}");
    });

    it("returns inserted path without BlockStatement without ExpressionStatement", function () {
      const rootPath = getPath("if (x) for (var i = 0; i < 0; i++) {}");
      const path = rootPath.get("consequent");
      const result = path.insertBefore(t.identifier("b"));

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result[result.length - 1].node).toEqual(t.identifier("b"));
      expect(generateCode(rootPath)).toBe(
        "if (x) {\n  b\n  for (var i = 0; i < 0; i++) {}\n}",
      );
    });

    it("returns inserted path with BlockStatement without ExpressionStatement", function () {
      const rootPath = getPath("if (x) { for (var i = 0; i < 0; i++) {} }");
      const path = rootPath.get("consequent.body.0");
      const result = path.insertBefore(t.identifier("b"));

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result[result.length - 1].node).toEqual(t.identifier("b"));
      expect(generateCode(rootPath)).toBe(
        "if (x) {\n  b\n  for (var i = 0; i < 0; i++) {}\n}",
      );
    });

    it("returns inserted path with nested JSXElement", function () {
      const ast = parse("<div><span>foo</span></div>", {
        plugins: ["jsx"],
      });
      let path;
      traverse(ast, {
        Program: function (_path) {
          path = _path.get("body.0");
        },
        JSXElement: function (path) {
          const tagName = path.node.openingElement.name.name;
          if (tagName !== "span") return;
          path.insertBefore(
            t.jsxElement(
              t.jsxOpeningElement(t.jsxIdentifier("div"), [], false),
              t.jsxClosingElement(t.jsxIdentifier("div")),
              [],
            ),
          );
        },
      });
      expect(generateCode(path)).toBe(
        "<div><div></div><span>foo</span></div>;",
      );
    });

    describe("when the parent is an export declaration inserts the node before", function () {
      it("the ExportNamedDeclaration", function () {
        const bodyPath = getPath("export function a() {}", {
          sourceType: "module",
        }).parentPath;
        const fnPath = bodyPath.get("body.0.declaration");
        fnPath.insertBefore(t.identifier("x"));

        expect(bodyPath.get("body")).toHaveLength(2);
        expect(bodyPath.get("body.0").node).toEqual(t.identifier("x"));
      });

      it("the ExportDefaultDeclaration, if a declaration is exported", function () {
        const bodyPath = getPath("export default function () {}", {
          sourceType: "module",
        }).parentPath;
        const fnPath = bodyPath.get("body.0.declaration");
        fnPath.insertBefore(t.identifier("x"));

        expect(bodyPath.get("body")).toHaveLength(2);
        expect(bodyPath.get("body.0").node).toEqual(t.identifier("x"));
      });

      it("the exported expression", function () {
        const declPath = getPath("export default fn();", {
          sourceType: "module",
        });
        const path = declPath.get("declaration");
        path.insertBefore(t.identifier("x"));

        expect(generateCode(declPath)).toBe("export default (x, fn());");
      });
    });
  });

  describe("insertAfter", function () {
    it("returns inserted path with BlockStatement with ExpressionStatement", function () {
      const rootPath = getPath("if (x) { y; }");
      const path = rootPath.get("consequent.body.0");
      const result = path.insertAfter(t.identifier("b"));

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result[result.length - 1].node).toEqual(t.identifier("b"));
      expect(generateCode(rootPath)).toBe("if (x) {\n  y;\n  b\n}");
    });

    it("returns inserted path without BlockStatement with ExpressionStatement", function () {
      const rootPath = getPath("if (x) y;");
      const path = rootPath.get("consequent");
      const result = path.insertAfter(t.identifier("b"));

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result[result.length - 1].node).toEqual(t.identifier("b"));
      expect(generateCode(rootPath)).toBe("if (x) {\n  y;\n  b\n}");
    });

    it("returns inserted path without BlockStatement without ExpressionStatement", function () {
      const rootPath = getPath("if (x) for (var i = 0; i < 0; i++) {}");
      const path = rootPath.get("consequent");
      const result = path.insertAfter(t.identifier("b"));

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result[result.length - 1].node).toEqual(t.identifier("b"));
      expect(generateCode(rootPath)).toBe(
        "if (x) {\n  for (var i = 0; i < 0; i++) {}\n  b\n}",
      );
    });

    it("returns inserted path with BlockStatement without ExpressionStatement", function () {
      const rootPath = getPath("if (x) { for (var i = 0; i < 0; i++) {} }");
      const path = rootPath.get("consequent.body.0");
      const result = path.insertAfter(t.identifier("b"));

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result[result.length - 1].node).toEqual(t.identifier("b"));
      expect(generateCode(rootPath)).toBe(
        "if (x) {\n  for (var i = 0; i < 0; i++) {}\n  b\n}",
      );
    });

    it("returns inserted path with nested JSXElement", function () {
      const ast = parse("<div><span>foo</span></div>", {
        plugins: ["jsx"],
      });
      let path;
      traverse(ast, {
        Program: function (_path) {
          path = _path.get("body.0");
        },
        JSXElement: function (path) {
          const tagName = path.node.openingElement.name.name;
          if (tagName !== "span") return;
          path.insertAfter(
            t.jsxElement(
              t.jsxOpeningElement(t.jsxIdentifier("div"), [], false),
              t.jsxClosingElement(t.jsxIdentifier("div")),
              [],
            ),
          );
        },
      });
      expect(generateCode(path)).toBe(
        "<div><span>foo</span><div></div></div>;",
      );
    });

    describe("when the parent is an export declaration inserts the node after", function () {
      it("the ExportNamedDeclaration", function () {
        const bodyPath = getPath("export function a() {}", {
          sourceType: "module",
        }).parentPath;
        const fnPath = bodyPath.get("body.0.declaration");
        fnPath.insertAfter(t.identifier("x"));

        expect(bodyPath.get("body")).toHaveLength(2);
        expect(bodyPath.get("body.1").node).toEqual(
          t.expressionStatement(t.identifier("x")),
        );
      });

      it("the ExportDefaultDeclaration, if a declaration is exported", function () {
        const bodyPath = getPath("export default function () {}", {
          sourceType: "module",
        }).parentPath;
        const fnPath = bodyPath.get("body.0.declaration");
        fnPath.insertAfter(t.identifier("x"));

        expect(bodyPath.get("body")).toHaveLength(2);
        expect(bodyPath.get("body.1").node).toEqual(
          t.expressionStatement(t.identifier("x")),
        );
      });

      it("the exported expression", function () {
        const bodyPath = getPath("export default fn();", {
          sourceType: "module",
        }).parentPath;
        const path = bodyPath.get("body.0.declaration");
        path.insertAfter(t.identifier("x"));

        expect(generateCode({ parentPath: bodyPath })).toBe(
          "var _temp;\nexport default (_temp = fn(), x, _temp);",
        );
      });

      it("edge case for babel-plugin-jest-hoist", function () {
        let varsHoistPoint;
        let i = 0;
        const logs = [[], []];
        traverse(parse(`{a;}`), {
          BlockStatement(path) {
            [varsHoistPoint] = path.unshiftContainer(
              "body",
              t.emptyStatement(),
            );
            path.traverse({
              Identifier(path) {
                if (i++ >= 5) {
                  return;
                }
                logs[0].push(path.node.name);
                varsHoistPoint.insertBefore(t.identifier("b"));
              },
            });
          },
        });
        i = 0;
        traverse(parse(`{a;}`), {
          BlockStatement(path) {
            [varsHoistPoint] = path.unshiftContainer(
              "body",
              t.emptyStatement(),
            );
            path.traverse({
              enter() {},
              Identifier(path) {
                if (i++ >= 5) {
                  return;
                }
                logs[1].push(path.node.name);
                varsHoistPoint.insertBefore(t.identifier("b"));
              },
            });
          },
        });

        expect(logs).toMatchInlineSnapshot(`
          Array [
            Array [
              "a",
              "b",
              "b",
              "b",
              "b",
            ],
            Array [
              "a",
              "b",
              "b",
              "b",
              "b",
            ],
          ]
        `);
      });
    });
  });
});
