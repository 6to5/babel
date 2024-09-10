import { expect, test } from "tstyche";
import traverse, { NodePath, Visitor } from "@babel/traverse";
import * as t from "@babel/types";

test("Visitor", () => {
  const visitor: Visitor = {
    VariableDeclarator(path) {
      expect(path).type.toBe<NodePath<t.VariableDeclarator>>();
      expect(path.parent).type.toBe<t.VariableDeclaration>();
      expect(path.parentPath).type.toBe<NodePath<t.VariableDeclaration>>();

      const left = path.get("id");
      if (left.isIdentifier()) {
        expect(left).type.toBe<NodePath<t.Identifier>>();
      }
    },
    "UnaryExpression|BinaryExpression"(path) {
      expect
        .skip(path)
        .type.toBe<
          NodePath<t.UnaryExpression> | NodePath<t.BinaryExpression>
        >();
    },
  };
});

test("traverse", () => {
  traverse(null, {
    AssignmentExpression(path) {
      path.traverse({
        Identifier(path) {},
        // @ts-expect-error Discuss whether to support this type
        noScope: true,
      });
    },
    noScope: true,
  });
});
