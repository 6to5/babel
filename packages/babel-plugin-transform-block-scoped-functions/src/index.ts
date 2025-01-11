import { declare } from "@babel/helper-plugin-utils";
import { types as t, type NodePath } from "@babel/core";

export default declare(api => {
  api.assertVersion(REQUIRED_VERSION(7));

  function transformStatementList(
    parentPath: NodePath,
    paths: NodePath<t.Statement>[],
  ) {
    if (process.env.BABEL_8_BREAKING) {
      // eslint-disable-next-line no-var
      var isInStrictMode = parentPath.isInStrictMode();
    }

    for (const path of paths) {
      if (!path.isFunctionDeclaration()) continue;

      if (
        process.env.BABEL_8_BREAKING &&
        !isInStrictMode &&
        !(
          path.node.async ||
          path.node.generator ||
          path.getData(
            "@babel/plugin-transform-async-generator-functions/async_generator_function",
          )
        )
      ) {
        continue;
      }

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
        const { node, parent } = path;
        if (
          t.isFunction(parent, { body: node }) ||
          t.isExportDeclaration(parent)
        ) {
          return;
        }

        transformStatementList(path, path.get("body"));
      },

      SwitchCase(path) {
        transformStatementList(path, path.get("consequent"));
      },
    },
  };
});
