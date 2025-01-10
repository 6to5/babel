import { parse } from "@babel/parser";
import * as t from "@babel/types";
import { IS_BABEL_8 } from "$repo-utils";

import _traverse, { NodePath } from "../lib/index.js";
const traverse = _traverse.default || _traverse;

function getPath(code, options) {
  const ast =
    typeof code === "string" ? parse(code, options) : createNode(code);
  let path;
  traverse(ast, {
    Program: function (_path) {
      path = _path;
      _path.stop();
    },
  });
  return path;
}

function getIdentifierPath(code) {
  const ast = parse(code);
  let nodePath;
  traverse(ast, {
    Identifier: function (path) {
      nodePath = path;
      path.stop();
    },
  });

  return nodePath;
}

function createNode(node) {
  const ast = t.file(t.program(Array.isArray(node) ? node : [node]));

  // This puts the path into the cache internally
  // We afterwards traverse ast, as we need to start traversing
  // at the File node and not the Program node
  NodePath.get({
    hub: {
      buildError: (_, msg) => new Error(msg),
    },
    parentPath: null,
    parent: ast,
    container: ast,
    key: "program",
  }).setContext();

  return ast;
}

describe("scope", () => {
  describe("binding paths", () => {
    it("function declaration id", function () {
      expect(
        getPath("function foo() {}").scope.getBinding("foo").path.type,
      ).toBe("FunctionDeclaration");
    });

    it("function expression id", function () {
      expect(
        getPath("(function foo() {})")
          .get("body")[0]
          .get("expression")
          .scope.getBinding("foo").path.type,
      ).toBe("FunctionExpression");
    });

    it("function param", function () {
      expect(
        getPath("(function (foo) {})")
          .get("body")[0]
          .get("expression")
          .scope.getBinding("foo").path.type,
      ).toBe("Identifier");
    });

    describe("function parameter expression", function () {
      it("should not have visibility of declarations inside function body", () => {
        expect(
          getPath(
            `var a = "outside"; (function foo(b = a) { let a = "inside" })`,
          )
            .get("body.1.expression.params.0")
            .scope.getBinding("a").path.node.init.value,
        ).toBe("outside");
      });
      it("should have visibility on parameter bindings", () => {
        expect(
          getPath(`var a = "outside"; (function foo(b = a, a = "inside") {})`)
            .get("body.1.expression.params.0")
            .scope.getBinding("a").path.node.right.value,
        ).toBe("inside");
      });
    });

    describe("import declaration", () => {
      it.each([
        [
          "import default",
          "import foo from 'foo';(foo)=>{}",
          "foo",
          "ImportDefaultSpecifier",
        ],
        [
          "import named default",
          "import { default as foo } from 'foo';(foo)=>{}",
          "foo",
          "ImportSpecifier",
        ],
        [
          "import named",
          "import { foo } from 'foo';(foo)=>{}",
          "foo",
          "ImportSpecifier",
        ],
        [
          "import named aliased",
          "import { _foo as foo } from 'foo';(foo)=>{}",
          "foo",
          "ImportSpecifier",
        ],
        [
          "import namespace",
          "import * as foo from 'foo';(foo)=>{}",
          "foo",
          "ImportNamespaceSpecifier",
        ],
      ])("%s", (testTitle, source, bindingName, bindingNodeType) => {
        expect(
          getPath(source, { sourceType: "module" }).scope.getBinding(
            bindingName,
          ).path.type,
        ).toBe(bindingNodeType);
      });
    });

    describe("export declaration", () => {
      it.each([
        [
          "export default function",
          "export default function foo(foo) {}",
          "foo",
          "FunctionDeclaration",
        ],
        [
          "export default class",
          "export default class foo extends function foo () {} {}",
          "foo",
          "ClassDeclaration",
        ],
        [
          "export named default",
          "export const foo = function foo(foo) {};",
          "foo",
          "VariableDeclarator",
        ],
        [
          "export named default",
          "export const [ { foo } ] = function foo(foo) {};",
          "foo",
          "VariableDeclarator",
        ],
      ])("%s", (testTitle, source, bindingName, bindingNodeType) => {
        expect(
          getPath(source, { sourceType: "module" }).scope.getBinding(
            bindingName,
          ).path.type,
        ).toBe(bindingNodeType);
      });
    });

    describe("computed method key", () => {
      describe("should not have visibility of declarations inside method body", () => {
        it("when path is computed key", () => {
          expect(
            getPath(`var a = "outside"; ({ [a]() { let a = "inside" } })`)
              .get("body.1.expression.properties.0.key")
              .scope.getBinding("a").path.node.init.value,
          ).toBe("outside");

          expect(
            getPath(
              `var a = "outside"; class foo { [a]() { let a = "inside" } }`,
            )
              .get("body.1.body.body.0.key")
              .scope.getBinding("a").path.node.init.value,
          ).toBe("outside");
        });

        it("when path is in nested scope which is computed key", () => {
          expect(
            getPath(`var a = "outside"; ({ [() => a]() { let a = "inside" } })`)
              .get("body.1.expression.properties.0.key.body")
              .scope.getBinding("a").path.node.init.value,
          ).toBe("outside");

          expect(
            getPath(
              `var a = "outside"; class foo { [() => a]() { let a = "inside" } }`,
            )
              .get("body.1.body.body.0.key.body")
              .scope.getBinding("a").path.node.init.value,
          ).toBe("outside");
        });

        it("when path is in nested scope within computed key", () => {
          expect(
            getPath(
              `var a = "outside"; ({ [(() => a)() + ""]() { let a = "inside" } })`,
            )
              .get("body.1.expression.properties.0.key.left.callee.body")
              .scope.getBinding("a").path.node.init.value,
          ).toBe("outside");

          expect(
            getPath(
              `var a = "outside"; class foo { [(() => a)() + ""]() { let a = "inside" } }`,
            )
              .get("body.1.body.body.0.key.left.callee.body")
              .scope.getBinding("a").path.node.init.value,
          ).toBe("outside");
        });

        it("when path is in nested within another computed key", () => {
          expect(
            getPath(
              `var a = "outside"; ({ get [ { get [a]() { let a = "inside"; return a; } }.outside ]() { let a = "middle"; return a; } })`,
            )
              .get("body.1.expression.properties.0.key.object.properties.0.key")
              .scope.getBinding("a").path.node.init.value,
          ).toBe("outside");

          expect(
            getPath(
              `var a = "outside"; class foo { static get [ class { static get [a]() { let a = "inside"; return a; } }.outside ]() { let a = "middle"; return a; } }`,
            )
              .get("body.1.body.body.0.key.object.body.body.0.key")
              .scope.getBinding("a").path.node.init.value,
          ).toBe("outside");
        });
      });

      it("should not have visibility on parameter bindings", () => {
        expect(
          getPath(`var a = "outside"; ({ [a](a = "inside") {} })`)
            .get("body.1.expression.properties.0.key")
            .scope.getBinding("a").path.node.init.value,
        ).toBe("outside");

        expect(
          getPath(`var a = "outside"; class foo { [a](a = "inside") {} }`)
            .get("body.1.body.body.0.key")
            .scope.getBinding("a").path.node.init.value,
        ).toBe("outside");
      });
    });

    describe("decorator", () => {
      const parserOptions = {
        plugins: [["decorators", { decoratorsBeforeExport: true }]],
      };
      it("should not have visibility of declarations inside method body", () => {
        expect(
          getPath(
            `var a = "outside"; class foo { @(() => () => a) m() { let a = "inside"; } }`,
            parserOptions,
          )
            .get("body.1.body.body.0.decorators.0.expression.body.body")
            .scope.getBinding("a").path.node.init.value,
        ).toBe("outside");
      });
      it("should not have visibility on parameter bindings", () => {
        expect(
          getPath(
            `var a = "outside"; class foo { @(() => () => a) m(a = "inside") {} }`,
            parserOptions,
          )
            .get("body.1.body.body.0.decorators.0.expression.body.body")
            .scope.getBinding("a").path.node.init.value,
        ).toBe("outside");
      });
    });

    it("switch discriminant scope", () => {
      expect(
        getPath(`let a = "outside"; switch (a) { default: let a = "inside" }`)
          .get("body.1.discriminant")
          .scope.getBinding("a").path.node.init.value,
      ).toBe("outside");
    });

    it("variable declaration", function () {
      expect(getPath("var foo = null;").scope.getBinding("foo").path.type).toBe(
        "VariableDeclarator",
      );
      expect(
        getPath("var { foo } = null;").scope.getBinding("foo").path.type,
      ).toBe("VariableDeclarator");
      expect(
        getPath("var [ foo ] = null;").scope.getBinding("foo").path.type,
      ).toBe("VariableDeclarator");
      expect(
        getPath("var { bar: [ foo ] } = null;").scope.getBinding("foo").path
          .type,
      ).toBe("VariableDeclarator");
    });

    it("declare var", function () {
      expect(
        getPath("declare var foo;", { plugins: ["flow"] }).scope.getBinding(
          "foo",
        ).path.type,
      ).toBe("DeclareVariable");
    });

    it("declare function", function () {
      expect(
        getPath("declare function foo(): void;", {
          plugins: ["flow"],
        }).scope.getBinding("foo").path.type,
      ).toBe("DeclareFunction");
    });

    it("declare module", function () {
      expect(
        getPath("declare module foo {};", {
          plugins: ["flow"],
        }).scope.getBinding("foo").path.type,
      ).toBe("DeclareModule");
    });

    it("declare type alias", function () {
      expect(
        getPath("declare type foo = string;", {
          plugins: ["flow"],
        }).scope.getBinding("foo").path.type,
      ).toBe("DeclareTypeAlias");
    });

    it("declare opaque type", function () {
      expect(
        getPath("declare opaque type foo;", {
          plugins: ["flow"],
        }).scope.getBinding("foo").path.type,
      ).toBe("DeclareOpaqueType");
    });

    it("declare interface", function () {
      expect(
        getPath("declare interface Foo {};", {
          plugins: ["flow"],
        }).scope.getBinding("Foo").path.type,
      ).toBe("DeclareInterface");
    });

    it("type alias", function () {
      expect(
        getPath("type foo = string;", {
          plugins: ["flow"],
        }).scope.getBinding("foo").path.type,
      ).toBe("TypeAlias");
    });

    it("opaque type alias", function () {
      expect(
        getPath("opaque type foo = string;", {
          plugins: ["flow"],
        }).scope.getBinding("foo").path.type,
      ).toBe("OpaqueType");
    });

    it("interface", function () {
      expect(
        getPath("interface Foo {};", {
          plugins: ["flow"],
        }).scope.getBinding("Foo").path.type,
      ).toBe("InterfaceDeclaration");
    });

    it("import type", function () {
      expect(
        getPath("import type {Foo} from 'foo';", {
          plugins: ["flow"],
        }).scope.getBinding("Foo").path.type,
      ).toBe("ImportSpecifier");
    });

    it("enum", function () {
      expect(
        getPath("enum AnEnum { Foo }", {
          plugins: ["typescript"],
        }).scope.getBinding("AnEnum").path.type,
      ).toBe("TSEnumDeclaration");
    });

    it("import type and func with duplicate name", function () {
      expect(() => {
        getPath(
          `
            import type {Foo} from 'foo';
            import {type Foo2} from 'foo';
            function Foo(){}
            function Foo2(){}
          `,
          {
            plugins: ["typescript"],
            sourceType: "module",
          },
        );
      }).not.toThrow();
    });

    it("variable constantness", function () {
      expect(getPath("var a = 1;").scope.getBinding("a").constant).toBe(true);
      expect(getPath("var a = 1; a = 2;").scope.getBinding("a").constant).toBe(
        false,
      );
      expect(getPath("var a = 1, a = 2;").scope.getBinding("a").constant).toBe(
        false,
      );
      expect(
        getPath("var a = 1; var a = 2;").scope.getBinding("a").constant,
      ).toBe(false);
    });

    it("variable constantness in loops", () => {
      let scopePath = null;
      const isAConstant = code => {
        let path = getPath(code);
        if (scopePath) path = path.get(scopePath);
        return path.scope.getBinding("a").constant;
      };

      expect(isAConstant("for (_ of ns) { var a = 1; }")).toBe(false);
      expect(isAConstant("for (_ in ns) { var a = 1; }")).toBe(false);
      expect(isAConstant("for (;;) { var a = 1; }")).toBe(false);
      expect(isAConstant("while (1) { var a = 1; }")).toBe(false);
      expect(isAConstant("do { var a = 1; } while (1)")).toBe(false);

      expect(isAConstant("for (var a of ns) {}")).toBe(false);
      expect(isAConstant("for (var a in ns) {}")).toBe(false);
      expect(isAConstant("for (var a;;) {}")).toBe(true);

      scopePath = "body.0.body.expression";
      expect(isAConstant("for (_ of ns) () => { var a = 1; }")).toBe(true);
      expect(isAConstant("for (_ in ns) () => { var a = 1; }")).toBe(true);
      expect(isAConstant("for (;;) () => { var a = 1; }")).toBe(true);
      expect(isAConstant("while (1) () => { var a = 1; }")).toBe(true);
      expect(isAConstant("do () => { var a = 1; }; while (1)")).toBe(true);

      scopePath = "body.0.body";
      expect(isAConstant("for (_ of ns) { let a = 1; }")).toBe(true);
      expect(isAConstant("for (_ in ns) { let a = 1; }")).toBe(true);
      expect(isAConstant("for (;;) { let a = 1; }")).toBe(true);
      expect(isAConstant("while (1) { let a = 1; }")).toBe(true);
      expect(isAConstant("do { let a = 1; } while (1)")).toBe(true);

      scopePath = "body.0";
      expect(isAConstant("for (let a of ns) {}")).toBe(true);
      expect(isAConstant("for (let a in ns) {}")).toBe(true);
      expect(isAConstant("for (let a;;) {}")).toBe(true);
    });

    test("label", function () {
      expect(getPath("foo: { }").scope.getBinding("foo")).toBeUndefined();
      expect(getPath("foo: { }").scope.getLabel("foo").type).toBe(
        "LabeledStatement",
      );
      expect(getPath("foo: { }").scope.getLabel("toString")).toBeUndefined();

      expect(
        getPath(
          `
      foo: { }
    `,
        ).scope.generateUid("foo"),
      ).toBe("_foo");
    });

    test("generateUid collision check with labels", function () {
      expect(
        getPath(
          `
      _foo: { }
    `,
        ).scope.generateUid("foo"),
      ).toBe("_foo2");

      expect(
        getPath(
          `
      _foo: { }
      _foo1: { }
      _foo2: { }
    `,
        ).scope.generateUid("foo"),
      ).toBe("_foo3");
    });

    describe("reference paths", () => {
      it("param referenced in function body", function () {
        const path = getIdentifierPath("function square(n) { return n * n}");
        const referencePaths = path.context.scope.bindings.n.referencePaths;
        expect(referencePaths).toHaveLength(2);
        expect(referencePaths[0].node.loc.start).toEqual({
          line: 1,
          column: 28,
          index: 28,
        });
        expect(referencePaths[1].node.loc.start).toEqual({
          line: 1,
          column: 32,
          index: 32,
        });
      });
      it("id referenced in function body", () => {
        const path = getIdentifierPath("(function n(m) { return n })");
        const { referencePaths, identifier } = path.scope.getOwnBinding("n");
        expect(identifier.start).toMatchInlineSnapshot(`10`);
        expect(referencePaths).toHaveLength(1);
        expect(referencePaths[0].node.start).toMatchInlineSnapshot(`24`);
      });
      it("id referenced in param initializer - function expression", () => {
        const path = getIdentifierPath("(function n(m = n) {})");
        const { referencePaths, identifier } = path.scope.getOwnBinding("n");
        expect(identifier.start).toMatchInlineSnapshot(`10`);
        expect(referencePaths).toHaveLength(1);
        expect(referencePaths[0].node.start).toMatchInlineSnapshot(`16`);
      });
      it("id referenced in param initializer - function declaration", () => {
        const path = getIdentifierPath("function n(m = n) {}");
        const { referencePaths, identifier } = path.scope.getBinding("n");
        expect(identifier.start).toMatchInlineSnapshot(`9`);
        expect(referencePaths).toHaveLength(1);
        expect(referencePaths[0].node.start).toMatchInlineSnapshot(`15`);
      });
      it("param referenced in function body with id collision", () => {
        const path = getIdentifierPath("(function n(n) { return n })");
        const { referencePaths, identifier } = path.scope.getOwnBinding("n");
        expect(identifier.start).toMatchInlineSnapshot(`12`);
        expect(referencePaths).toHaveLength(1);
        expect(referencePaths[0].node.start).toMatchInlineSnapshot(`24`);
      });
      it("param referenced in param initializer with id collision", () => {
        const path = getIdentifierPath("(function n(n, m = n) {})");
        const { referencePaths, identifier } = path.scope.getOwnBinding("n");
        expect(identifier.start).toMatchInlineSnapshot(`12`);
        expect(referencePaths).toHaveLength(1);
        expect(referencePaths[0].node.start).toMatchInlineSnapshot(`19`);
      });
    });

    describe("after crawl", () => {
      it("modified function identifier available in function scope", () => {
        const path = getPath("(function f(f) {})")
          .get("body")[0]
          .get("expression");
        path.get("id").replaceWith(t.identifier("g"));
        path.scope.crawl();
        const binding = path.scope.getBinding("g");
        expect(binding.kind).toBe("local");
      });
      it("modified function param available in function scope", () => {
        const path = getPath("(function f(f) {})")
          .get("body")[0]
          .get("expression");
        path.get("params")[0].replaceWith(t.identifier("g"));
        path.scope.crawl();
        const binding = path.scope.getBinding("g");
        expect(binding.kind).toBe("param");
      });
      it("modified class identifier available in class expression scope", () => {
        const path = getPath("(class c {})").get("body")[0].get("expression");
        path.get("id").replaceWith(t.identifier("g"));
        path.scope.crawl();
        const binding = path.scope.getBinding("g");
        expect(binding.kind).toBe("local");
      });
      it("modified class identifier available in class declaration scope", () => {
        const path = getPath("class c {}").get("body")[0];
        path.get("id").replaceWith(t.identifier("g"));
        path.scope.crawl();
        const binding = path.scope.getBinding("g");
        expect(binding.kind).toBe("let");
      });
    });

    it("class identifier available in class scope after crawl", function () {
      const path = getPath("class a { build() { return new a(); } }");

      path.scope.crawl();

      let referencePaths = path.scope.bindings.a.referencePaths;
      expect(referencePaths).toHaveLength(1);

      referencePaths = path.get("body[0]").scope.bindings.a.referencePaths;
      expect(referencePaths).toHaveLength(1);

      expect(path.scope.bindings.a).toBe(path.get("body[0]").scope.bindings.a);
    });

    it("references after re-crawling", function () {
      const path = getPath("function Foo() { var _jsx; }");

      path.scope.crawl();
      path.scope.crawl();

      expect(path.scope.references._jsx).toBe(true);
    });

    test("generateUid collision check after re-crawling", function () {
      const path = getPath("function Foo() { var _jsx; }");

      path.scope.crawl();
      path.scope.crawl();

      expect(path.scope.generateUid("jsx")).toBe("_jsx2");
    });

    test("generateUid collision check after re-crawling (function expression local id)", function () {
      const path = getPath("var fn = function _name(){}");

      path.scope.crawl();
      path.scope.crawl();

      expect(path.scope.generateUid("name")).toBe("_name2");
    });

    test("generateUid collision check after re-crawling (function params)", function () {
      const path = getPath("[].map(_unicorn => [_unicorn])");

      path.scope.crawl();
      path.scope.crawl();

      expect(path.scope.generateUid("unicorn")).toBe("_unicorn2");
    });

    test("generateUid collision check after re-crawling (catch clause)", function () {
      const path = getPath("try {} catch (_err) {}");

      path.scope.crawl();
      path.scope.crawl();

      expect(path.scope.generateUid("err")).toBe("_err2");
    });

    test("generateUid collision check after re-crawling (class expression local id)", function () {
      const path = getPath("var C = class _Cls{}");

      path.scope.crawl();
      path.scope.crawl();

      expect(path.scope.generateUid("Cls")).toBe("_Cls2");
    });

    it("re-exports are not references", () => {
      const path = getPath("export { x } from 'y'", {
        sourceType: "module",
      });
      expect(path.scope.hasGlobal("x")).toBe(false);
    });
  });

  describe("duplicate bindings", () => {
    /*
     * These tests do not use the parser as the parser has
     * its own scope tracking and we want to test the scope tracking
     * of traverse here and see if it handles duplicate bindings correctly
     */
    describe("catch", () => {
      // try {} catch (e) { let e; }
      const createTryCatch = function (kind) {
        return t.tryStatement(
          t.blockStatement([]),
          t.catchClause(
            t.identifier("e"),
            t.blockStatement([
              t.variableDeclaration(kind, [
                t.variableDeclarator(t.identifier("e"), t.stringLiteral("1")),
              ]),
            ]),
          ),
        );
      };
      it("let", () => {
        const ast = createTryCatch("let");

        expect(() => getPath(ast)).toThrowErrorMatchingSnapshot();
      });

      it("const", () => {
        const ast = createTryCatch("const");

        expect(() => getPath(ast)).toThrowErrorMatchingSnapshot();
      });

      it("using", () => {
        const ast = createTryCatch("using");

        expect(() => getPath(ast)).toThrowErrorMatchingSnapshot();
      });

      it("var", () => {
        const ast = createTryCatch("var");

        expect(() => getPath(ast)).not.toThrow();
      });
    });

    ["let", "const"].forEach(name => {
      it(`${name} and function in sub scope`, () => {
        const ast = [
          t.variableDeclaration(name, [
            t.variableDeclarator(t.identifier("foo")),
          ]),
          t.blockStatement([
            t.functionDeclaration(
              t.identifier("foo"),
              [],
              t.blockStatement([]),
            ),
          ]),
        ];

        expect(() => getPath(ast)).not.toThrow();
      });
    });

    describe("duplicate declaration", () => {
      it("should not throw error on duplicate class and function declaration", () => {
        const ast = [
          t.classDeclaration(t.identifier("A"), null, t.classBody([]), []),
          t.functionDeclaration(t.identifier("A"), [], t.blockStatement([])),
        ];

        ast[0].declare = true;
        expect(() => getPath(ast)).not.toThrow();
      });
    });

    describe("global", () => {
      // node1, node2, success
      // every line will run 2 tests `node1;node2;` and `node2;node1;`
      // unless node1 === node2
      const cases = [
        ["const", "let", false],
        ["const", "const", false],
        ["const", "function", false],
        ["const", "class", false],
        ["const", "var", false],

        ["let", "let", false],
        ["let", "class", false],
        ["let", "function", false],
        ["let", "var", false],

        ["var", "class", false],
        ["var", "function", true],
        ["var", "var", true],

        ["class", "function", false],
        ["class", "class", false],

        ["function", "function", true],
      ];

      const createNode = function (kind) {
        switch (kind) {
          case "let":
          case "const":
          case "var":
            return t.variableDeclaration(kind, [
              t.variableDeclarator(t.identifier("foo")),
            ]);
          case "class":
            return t.classDeclaration(
              t.identifier("foo"),
              null,
              t.classBody([]),
            );
          case "function":
            return t.functionDeclaration(
              t.identifier("foo"),
              [],
              t.blockStatement([]),
            );
        }
      };

      const createAST = function (kind1, kind2) {
        return [createNode(kind1), createNode(kind2)];
      };

      for (const [kind1, kind2, success] of cases) {
        if (success) {
          it(`${kind1}/${kind2} should succeed`, () => {
            const ast = createAST(kind1, kind2);
            expect(() => getPath(ast)).not.toThrow();
          });
        } else {
          it(`${kind1}/${kind2} should fail`, () => {
            const ast = createAST(kind1, kind2);
            expect(() => getPath(ast)).toThrowErrorMatchingSnapshot();
          });
        }

        if (kind1 !== kind2) {
          // todo: remove the if allowed
          if (kind1 === "const" && (kind2 === "function" || kind2 === "var")) {
            continue;
          }
          if (success) {
            it(`${kind2}/${kind1} should succeed`, () => {
              const ast = createAST(kind2, kind1);
              expect(() => getPath(ast)).not.toThrow();
            });
          } else {
            it(`${kind2}/${kind1} should fail`, () => {
              const ast = createAST(kind2, kind1);
              expect(() => getPath(ast)).toThrowErrorMatchingSnapshot();
            });
          }
        }
      }
    });
  });

  describe("own bindings", () => {
    // Var declarations should be declared in the nearest FunctionParent ancestry
    describe("var declarations should be registered", () => {
      it("in program", () => {
        const program = getPath("var foo;");
        expect(program.scope.hasOwnBinding("foo")).toBe(true);
      });
      it("in function declaration", () => {
        const functionDeclaration = getPath("function f() { var foo; }").get(
          "body.0",
        );
        expect(functionDeclaration.scope.hasOwnBinding("foo")).toBe(true);
      });
      it("in function expression", () => {
        const functionExpression = getPath("(function () { var foo; })").get(
          "body.0.expression",
        );
        expect(functionExpression.scope.hasOwnBinding("foo")).toBe(true);
      });
      it("in arrow expression", () => {
        const arrowExpression =
          getPath("() => { var foo; }").get("body.0.expression");
        expect(arrowExpression.scope.hasOwnBinding("foo")).toBe(true);
      });
      it("in object method", () => {
        const objectMethod = getPath("({ method() { var foo; } })").get(
          "body.0.expression.properties.0",
        );
        expect(objectMethod.scope.hasOwnBinding("foo")).toBe(true);
      });
      it("in class method", () => {
        const classMethod = getPath("(class { method() { var foo; } })").get(
          "body.0.expression.body.body.0",
        );
        expect(classMethod.scope.hasOwnBinding("foo")).toBe(true);
      });
      it("in class private method", () => {
        const classMethod = getPath("(class { #method() { var foo; } })").get(
          "body.0.expression.body.body.0",
        );
        expect(classMethod.scope.hasOwnBinding("foo")).toBe(true);
      });
      it("in static block", () => {
        const staticBlock = getPath("(class { static { var foo; } })").get(
          "body.0.expression.body.body.0",
        );
        expect(staticBlock.scope.hasOwnBinding("foo")).toBe(true);
      });
    });
    describe("var declarations should not be registered", () => {
      it("in block statement", () => {
        const blockStatement = getPath("{ var foo; }").get("body.0");
        expect(blockStatement.scope.hasOwnBinding("foo")).toBe(false);
      });
      it("in catch clause", () => {
        const catchClause = getPath("try {} catch { var foo; }").get(
          "body.0.handler",
        );
        expect(catchClause.scope.hasOwnBinding("foo")).toBe(false);
      });
      it("in for-init statement", () => {
        const forStatement = getPath("for (var foo;;);").get("body.0");
        expect(forStatement.scope.hasOwnBinding("foo")).toBe(false);
      });
      it("in for-in statement", () => {
        const forStatement = getPath("for (var foo in x);").get("body.0");
        expect(forStatement.scope.hasOwnBinding("foo")).toBe(false);
      });
      it("in for-of statement", () => {
        const forStatement = getPath("for (var foo of x);").get("body.0");
        expect(forStatement.scope.hasOwnBinding("foo")).toBe(false);
      });
      it("in switch statement", () => {
        const switchStatement = getPath("switch (0) { case 0: var foo; }").get(
          "body.0",
        );
        expect(switchStatement.scope.hasOwnBinding("foo")).toBe(false);
      });
      it("in while statement", () => {
        const whileStatement = getPath("while (0) \n var foo;").get("body.0");
        expect(whileStatement.scope.hasOwnBinding("foo")).toBe(false);
      });
      it("in do-while statement", () => {
        const doWhileStatement = getPath("do \n var foo \n while(0);").get(
          "body.0",
        );
        expect(doWhileStatement.scope.hasOwnBinding("foo")).toBe(false);
      });
    });
    // Lexical declarations should be registered in the nearest BlockParent ancestry
    describe("let declarations should be registered", () => {
      it("in program", () => {
        const program = getPath("let foo;");
        expect(program.scope.hasOwnBinding("foo")).toBe(true);
      });
      it("in function declaration", () => {
        const functionDeclaration = getPath("function f() { let foo; }").get(
          "body.0",
        );
        expect(functionDeclaration.scope.hasOwnBinding("foo")).toBe(true);
      });
      it("in function expression", () => {
        const functionExpression = getPath("(function () { let foo; })").get(
          "body.0.expression",
        );
        expect(functionExpression.scope.hasOwnBinding("foo")).toBe(true);
      });
      it("in arrow expression", () => {
        const arrowExpression =
          getPath("() => { let foo; }").get("body.0.expression");
        expect(arrowExpression.scope.hasOwnBinding("foo")).toBe(true);
      });
      it("in object method", () => {
        const objectMethod = getPath("({ method() { let foo; } })").get(
          "body.0.expression.properties.0",
        );
        expect(objectMethod.scope.hasOwnBinding("foo")).toBe(true);
      });
      it("in class method", () => {
        const classMethod = getPath("(class { method() { let foo; } })").get(
          "body.0.expression.body.body.0",
        );
        expect(classMethod.scope.hasOwnBinding("foo")).toBe(true);
      });
      it("in class private method", () => {
        const classMethod = getPath("(class { #method() { let foo; } })").get(
          "body.0.expression.body.body.0",
        );
        expect(classMethod.scope.hasOwnBinding("foo")).toBe(true);
      });
      it("in static block", () => {
        const staticBlock = getPath("(class { static { let foo; } })").get(
          "body.0.expression.body.body.0",
        );
        expect(staticBlock.scope.hasOwnBinding("foo")).toBe(true);
      });
      it("in block statement", () => {
        const blockStatement = getPath("{ let foo; }").get("body.0");
        expect(blockStatement.scope.hasOwnBinding("foo")).toBe(true);
      });
      it("in catch clause", () => {
        const catchClause = getPath("try {} catch { let foo; }").get(
          "body.0.handler",
        );
        expect(catchClause.scope.hasOwnBinding("foo")).toBe(true);
      });
      it("in for-init statement", () => {
        const forStatement = getPath("for (let foo;;);").get("body.0");
        expect(forStatement.scope.hasOwnBinding("foo")).toBe(true);
      });
      it("in for-in statement", () => {
        const forStatement = getPath("for (let foo in x);").get("body.0");
        expect(forStatement.scope.hasOwnBinding("foo")).toBe(true);
      });
      it("in for-of statement", () => {
        const forStatement = getPath("for (let foo of x);").get("body.0");
        expect(forStatement.scope.hasOwnBinding("foo")).toBe(true);
      });
      it("in switch statement", () => {
        const switchStatement = getPath("switch (0) { case 0: let foo; }").get(
          "body.0",
        );
        expect(switchStatement.scope.hasOwnBinding("foo")).toBe(true);
      });
    });
  });

  describe(".push", () => {
    it("registers the new binding in the correct scope", () => {
      const program = getPath("class A {}");
      const classDeclaration = program.get("body.0");
      classDeclaration.scope.push({ id: t.identifier("class") });
      expect(program.toString()).toMatchInlineSnapshot(`
        "var class;
        class A {}"
      `);
      expect(program.scope.hasOwnBinding("class")).toBe(true);
    });
    it("registers the new binding outside function when the path is a param initializer", () => {
      const program = getPath("(a = f()) => {}");
      const assignmentPattern = program.get("body.0.expression.params.0");
      assignmentPattern.scope.push({ id: t.identifier("ref") });
      expect(program.toString()).toMatchInlineSnapshot(`
        "var ref;
        (a = f()) => {};"
      `);
      expect(program.scope.hasOwnBinding("ref")).toBe(true);
    });
    it("registers the new binding outside class method when the path is a param initializer", () => {
      const program = getPath("class C { m(a = f()) {} }");
      const assignmentPattern = program.get("body.0.body.body.0.params.0");
      assignmentPattern.scope.push({ id: t.identifier("ref") });
      expect(program.toString()).toMatchInlineSnapshot(`
        "var ref;
        class C {
          m(a = f()) {}
        }"
      `);
      expect(program.scope.hasOwnBinding("ref")).toBe(true);
    });
  });

  describe("rename", () => {
    it(".parentPath after renaming variable in switch", () => {
      const program = getPath(`
        switch (x) {
          case y:
            let a;
        }
      `);
      program.traverse({
        VariableDeclaration(path) {
          if (path.node.declarations[0].id.name !== "a") return;

          expect(path.parentPath.type).toBe("SwitchCase");
          path.scope.rename("a");
          expect(path.parentPath.type).toBe("SwitchCase");
        },
      });
    });

    it(".shorthand after renaming `ObjectProperty`", () => {
      const program = getPath(`
         const { a } = b;
         ({ a } = b);
         c = { a };
       `);
      program.scope.rename("a");

      const renamedPropertyMatcher = expect.objectContaining({
        type: "ObjectProperty",
        shorthand: false,
        ...(IS_BABEL_8()
          ? {}
          : {
              // eslint-disable-next-line jest/no-conditional-expect
              extra: expect.objectContaining({ shorthand: false }),
            }),
        key: expect.objectContaining({ name: "a" }),
        value: expect.objectContaining({
          name: expect.not.stringMatching(/^a$/),
        }),
      });

      const { body } = program.node;
      expect(body[0].declarations[0].id.properties[0]).toStrictEqual(
        renamedPropertyMatcher,
      );
      expect(body[1].expression.left.properties[0]).toStrictEqual(
        renamedPropertyMatcher,
      );
      expect(body[2].expression.right.properties[0]).toStrictEqual(
        renamedPropertyMatcher,
      );

      expect(String(program)).toMatchInlineSnapshot(`
        "const {
          a: _a
        } = b;
        ({
          a: _a
        } = b);
        c = {
          a: _a
        };"
      `);
    });

    it(".shorthand after renaming `ObjectProperty` - shadowed", () => {
      const program = getPath(`
         const a = 1;
         {
          const { b } = 2;
          ({ b } = 3);
          (_ = { b });
        }
       `);
      program.scope.rename("a", "b");

      const originalPropertyMatcher = expect.objectContaining({
        type: "ObjectProperty",
        shorthand: true,
        ...(IS_BABEL_8()
          ? {}
          : {
              // eslint-disable-next-line jest/no-conditional-expect
              extra: expect.objectContaining({ shorthand: true }),
            }),
        key: expect.objectContaining({ name: "b" }),
        value: expect.objectContaining({ name: "b" }),
      });

      const { body } = program.node;
      expect(body[1].body[0].declarations[0].id.properties[0]).toStrictEqual(
        originalPropertyMatcher,
      );
      expect(body[1].body[1].expression.left.properties[0]).toStrictEqual(
        originalPropertyMatcher,
      );
      expect(body[1].body[2].expression.right.properties[0]).toStrictEqual(
        originalPropertyMatcher,
      );

      expect(String(program)).toMatchInlineSnapshot(`
        "const b = 1;
        {
          const {
            b
          } = 2;
          ({
            b
          } = 3);
          _ = {
            b
          };
        }"
      `);
    });

    it(`computed key should not be renamed`, () => {
      const program = getPath(`
        let x = 1
        const foo = {
          get [x]() {
            return x
          },
        }`);
      program.traverse({
        Function(path) {
          const bodyPath = path.get("body");
          // create a declaration that shadows parent variable
          bodyPath.scope.push({
            id: t.identifier("x"),
            kind: "const",
            init: t.nullLiteral(),
          });
          // rename the new "local" declaration
          bodyPath.scope.rename("x", "y");
        },
      });
      expect(program + "").toMatchInlineSnapshot(`
        "let x = 1;
        const foo = {
          get [x]() {
            const y = null;
            return y;
          }
        };"
      `);
    });

    it(`decorators should not be renamed`, () => {
      const program = getPath(
        `
        let x;
        class Foo {
          @x
          [x]() {
            return x;
          }
          @x
          #method() {
            return x;
          }
        }`,
        {
          plugins: [["decorators"]],
        },
      );

      program.traverse({
        Function(path) {
          const bodyPath = path.get("body");
          // create a declaration that shadows parent variable
          bodyPath.scope.push({
            id: t.identifier("x"),
            kind: "const",
            init: t.nullLiteral(),
          });
          // rename the new "local" declaration
          bodyPath.scope.rename("x", "y");
        },
      });
      expect(program + "").toMatchInlineSnapshot(`
        "let x;
        class Foo {
          @x
          [x]() {
            const y = null;
            return y;
          }
          @x
          #method() {
            const y = null;
            return y;
          }
        }"
      `);
    });
  });

  describe("constantViolations", () => {
    it("var redeclarations should not be treated as constantViolations", () => {
      const program = getPath(`
        function v() { }
        function f() {
          var a = 1;
          var {
            currentPoint: a,
            centp: v,
          } = {};
        }
      `);

      const bindingV = program.scope.getBinding("v");
      expect(bindingV.constantViolations).toHaveLength(0);

      const bindingA = program.get("body.1.body").scope.getBinding("a");
      expect(bindingA.constantViolations).toHaveLength(1);
    });
  });
});
