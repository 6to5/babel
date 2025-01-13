import { parse } from "@babel/parser";
import * as t from "@babel/types";

import _traverse from "../lib/index.js";
import _generate from "@babel/generator";
const traverse = _traverse.default || _traverse;
const generate = _generate.default || _generate;

function getPath(code) {
  const ast = parse(code);
  let path;
  traverse(ast, {
    Program: function (_path) {
      path = _path.get("body.0");
      _path.stop();
    },
  });

  return path;
}

describe("path/replacement", function () {
  describe("replaceWith", function () {
    it("replaces declaration in ExportDefaultDeclaration node", function () {
      const ast = parse("export default function() {};", {
        sourceType: "module",
      });
      traverse(ast, {
        FunctionDeclaration(path) {
          path.replaceWith(
            t.arrayExpression([
              t.functionExpression(
                path.node.id,
                path.node.params,
                path.node.body,
                path.node.generator,
                path.node.async,
              ),
            ]),
          );
        },
      });

      expect(ast.program.body[0].declaration.type).toBe("ArrayExpression");
    });

    it("throws error when trying to replace Program with a non-Program node", function () {
      const ast = parse("var x = 3;");
      expect(function () {
        traverse(ast, {
          Program(path) {
            path.replaceWith(t.identifier("a"));
          },
        });
      }).toThrow(
        /You can only replace a Program root node with another Program node/,
      );
    });

    it("throws error when used with an array of nodes", function () {
      const ast = parse("function abc() {}; var test = 17;");
      expect(function () {
        traverse(ast, {
          NumericLiteral(path) {
            path.replaceWith([
              t.identifier("should"),
              t.identifier("never"),
              t.identifier("happen"),
            ]);
          },
        });
      }).toThrow(
        /Don't use `path\.replaceWith\(\)` with an array of nodes, use `path\.replaceWithMultiple\(\)`/,
      );
    });

    it("throws error when used with source string", function () {
      const ast = parse(
        "(function() { var x = 3; var y = 17; var c = x + y; })();",
      );
      expect(function () {
        traverse(ast, {
          BinaryExpression(path) {
            path.replaceWith("17 + 23");
          },
        });
      }).toThrow(
        /Don't use `path\.replaceWith\(\)` with a source string, use `path\.replaceWithSourceString\(\)`/,
      );
    });

    it("throws error when trying to replace removed node", function () {
      const ast = parse("var z = 'abc';");
      expect(function () {
        traverse(ast, {
          StringLiteral(path) {
            path.remove();
            path.replaceWith(t.identifier("p"));
          },
        });
      }).toThrow(/You can't replace this node, we've already removed it/);
    });

    it("throws error when passed a falsy value", function () {
      const ast = parse("var z = 'abc';");
      expect(function () {
        traverse(ast, {
          StringLiteral(path) {
            path.replaceWith();
          },
        });
      }).toThrow(
        /You passed `path\.replaceWith\(\)` a falsy node, use `path\.remove\(\)` instead/,
      );
    });

    it("does not revisit the replaced node if it is the node being replaced", () => {
      const ast = parse(`var x;`);
      let visitCounter = 0;
      traverse(ast, {
        VariableDeclaration(path) {
          visitCounter++;
          if (visitCounter > 1) {
            return true;
          }
          path.replaceWith(path.node);
        },
      });
      expect(visitCounter).toBe(1);
    });

    // https://github.com/babel/babel/issues/12386
    it("updates pathCache with the replaced node", () => {
      const ast = parse(`() => (a?.b)?.c`, {
        createParenthesizedExpressions: true,
      });
      traverse(ast, {
        OptionalMemberExpression(path) {
          path.node.type = "MemberExpression";
          // force `replaceWith` to replace `path.node`
          path.replaceWith(t.cloneNode(path.node));
          path.parentPath.ensureBlock();

          const aQuestionDotBNode = path.node.object.expression;
          // avoid traversing to a?.b
          aQuestionDotBNode.type = "MemberExpression";
        },
        ParenthesizedExpression(path) {
          path.replaceWith(path.node.expression);
        },
      });
      expect(generate(ast).code).toMatchInlineSnapshot(`
        "() => {
          return a.b.c;
        };"
      `);
    });
  });
  describe("replaceWithMultiple", () => {
    it("does not add extra parentheses for a JSXElement with a JSXElement parent", () => {
      const ast = parse(`<div><span><p></p><h></h></span></div>`, {
        plugins: ["jsx"],
      });
      traverse(ast, {
        JSXElement: path => {
          if (path.node.openingElement.name.name === "span") {
            path.replaceWithMultiple(path.node.children.filter(t.isJSXElement));
          }
        },
      });
      expect(generate(ast).code).toBe("<div><p></p><h></h></div>;");
    });
    it("does not revisit one of new nodes if it is the node being replaced and is the head of nodes", () => {
      // packages/babel-plugin-transform-block-scoping/src/index.js relies on this behaviour
      const ast = parse(`var x;`);
      let visitCounter = 0;
      traverse(ast, {
        VariableDeclaration(path) {
          visitCounter++;
          if (visitCounter > 1) {
            path.stop();
            return;
          }
          path.replaceWithMultiple([path.node, t.emptyStatement()]);
        },
      });
      expect(visitCounter).toBe(1);
    });
    it("does not revisit one of new nodes if it is the node being replaced and is the tail of nodes", () => {
      // packages/babel-plugin-transform-block-scoping/src/index.js relies on this behaviour
      const ast = parse(`var x;`);
      let visitCounter = 0;
      traverse(ast, {
        VariableDeclaration(path) {
          visitCounter++;
          if (visitCounter > 1) {
            path.stop();
            return;
          }
          path.replaceWithMultiple([t.emptyStatement(), path.node]);
        },
      });
      expect(visitCounter).toBe(1);
    });
  });
  describe("replaceExpressionWithStatements", function () {
    const undefinedNode = t.expressionStatement(t.identifier("undefined"));

    const getExprPath = () => getPath("X;").get("expression");
    const parseStmt = code =>
      parse(code, { allowReturnOutsideFunction: true }).program.body[0];

    it("gathers nodes into sequence", function () {
      const path = getExprPath();
      const node = t.identifier("a");
      path.replaceExpressionWithStatements([undefinedNode, node]);
      t.assertSequenceExpression(path.node);
      expect(path.node.expressions[0]).toBe(undefinedNode.expression);
      expect(path.node.expressions[1]).toBe(node);
    });
    it("avoids sequence for single node", function () {
      const path = getExprPath();

      const node = t.identifier("a");
      path.replaceExpressionWithStatements([node]);
      expect(path.node).toBe(node);

      const block = t.blockStatement([t.expressionStatement(node)]);
      path.replaceExpressionWithStatements([block]);
      expect(path.node).toBe(node);
    });
    it("gathers expression", function () {
      const path = getExprPath();
      const node = t.identifier("a");
      path.replaceExpressionWithStatements([undefinedNode, node]);
      expect(path.node.expressions[1]).toBe(node);
    });
    it("gathers expression statement", function () {
      const path = getExprPath();
      const node = t.expressionStatement(t.identifier("a"));
      path.replaceExpressionWithStatements([undefinedNode, node]);
      expect(path.node.expressions[1]).toBe(node.expression);
    });
    it("gathers var declarations", function () {
      const path = getExprPath();
      const node = parseStmt("var a, b = 1;");
      path.replaceExpressionWithStatements([undefinedNode, node]);
      expect(path.scope.hasOwnBinding("a")).toBe(true);
      expect(path.scope.hasOwnBinding("b")).toBe(true);
      expect(path.get("expressions.0").toString()).toBe("undefined");
      expect(path.get("expressions.1").toString()).toBe("b = 1");
      expect(path.get("expressions.2").toString()).toBe("void 0");
    });
    it("skips undefined if expression after var declaration", function () {
      const path = getExprPath();
      const node = parseStmt("{ var a, b = 1; true }");
      path.replaceExpressionWithStatements([undefinedNode, node]);
      expect(path.get("expressions.1").toString()).toBe("b = 1, true");
    });
    it("bails on let and const declarations", function () {
      let path = getExprPath();

      let node = parseStmt("let a, b = 1;");
      path.replaceExpressionWithStatements([undefinedNode, node]);
      t.assertCallExpression(path.node);
      t.assertFunction(path.node.callee);

      path = getExprPath();
      node = parseStmt("const b = 1;");
      path.replaceExpressionWithStatements([undefinedNode, node]);
      t.assertCallExpression(path.node);
      t.assertFunction(path.node.callee);
    });
    it("gathers if statements", function () {
      let path = getExprPath();
      let node = parseStmt("if (c) { true }");
      path.replaceExpressionWithStatements([undefinedNode, node]);
      expect(path.get("expressions.1").toString()).toBe("c ? true : void 0");

      path = getExprPath();
      node = parseStmt("if (c) { true } else { b }");
      path.replaceExpressionWithStatements([undefinedNode, node]);
      expect(path.get("expressions.1").toString()).toBe("c ? true : b");
    });
    it("gathers block statements", function () {
      let path = getExprPath();
      let node = parseStmt("{ a }");
      path.replaceExpressionWithStatements([undefinedNode, node]);
      expect(path.get("expressions.1").toString()).toBe("a");

      path = getExprPath();
      node = parseStmt("{ a; b; }");
      path.replaceExpressionWithStatements([undefinedNode, node]);
      expect(path.get("expressions.1").toString()).toBe("a, b");
    });
    it("gathers empty statements if first element", function () {
      const path = getExprPath();
      const node = parseStmt(";");
      path.replaceExpressionWithStatements([undefinedNode, node]);
      expect(path.toString()).toBe("undefined");
    });
    it("skips empty statement if expression afterwards", function () {
      const path = getExprPath();
      const node = parseStmt("{ ; true }");
      path.replaceExpressionWithStatements([undefinedNode, node]);
      expect(path.get("expressions.1").toString()).toBe("true");
    });
    describe("return", function () {
      // TODO: These tests veryfy wrong behavior. It's not possible to
      // replace an expression with `return`, as wrapping it in a IIFE changes
      // semantics.
      // They are here because it's how @babel/traverse currently behaves, but
      // it should be eventually be made to throw an error.

      it("bails in if statements if recurse bails", function () {
        let path = getExprPath();
        let node = parseStmt("if (true) { return }");
        path.replaceExpressionWithStatements([undefinedNode, node]);
        expect(path.toString()).toMatchInlineSnapshot(`
          "function () {
            undefined;
            if (true) {
              return;
            }
          }()"
        `);

        path = getExprPath();
        node = parseStmt("if (true) { true } else { return }");
        path.replaceExpressionWithStatements([undefinedNode, node]);
        expect(path.toString()).toMatchInlineSnapshot(`
          "function () {
            undefined;
            if (true) {
              return true;
            } else {
              return;
            }
          }()"
        `);
      });
      it("bails in block statements if recurse bails", function () {
        const path = getExprPath();
        const node = parseStmt("{ return }");
        path.replaceExpressionWithStatements([undefinedNode, node]);
        expect(path.toString()).toMatchInlineSnapshot(`
          "function () {
            undefined;
            {
              return;
            }
          }()"
        `);
      });
    });
  });
});
