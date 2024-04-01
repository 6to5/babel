import { declare } from "@babel/helper-plugin-utils";
import { types as t, type NodePath } from "@babel/core";

export default declare(api => {
  api.assertVersion(REQUIRED_VERSION(7));

  function transformStatementList(paths: NodePath<t.Statement>[]) {
    for (const path of paths) {
      if (!path.isFunctionDeclaration()) continue;
      // Annex B.3.3 only applies to plain functions.
      if (path.node.async || path.node.generator) continue;

      const func = path.node;
      const declar = t.variableDeclaration("let", [
        t.variableDeclarator(func.id, t.toExpression(func)),
      ]);

      // hoist it up above everything else
      // @ts-expect-error todo(flow->ts): avoid mutations
      declar._blockHoist = 2;

      // todo: name this
      func.id = null;

      path.replaceWith(declar);
    }
  }

  return {
    name: "transform-block-scoped-functions",

    visitor: {
      BlockStatement(path) {
        if (!path.isInStrictMode()) return;

        const { node, parent } = path;
        if (
          t.isFunction(parent, { body: node }) ||
          t.isExportDeclaration(parent)
        ) {
          return;
        }

        transformStatementList(path.get("body"));
      },

      SwitchCase(path) {
        if (!path.isInStrictMode()) return;

        transformStatementList(path.get("consequent"));
      },
    },
  };
});
