import { declare } from "@babel/helper-plugin-utils";
import syntaxAwaitOps from "@babel/plugin-syntax-await-operations";

export default declare(api => {
  api.assertVersion(7);
  const { types: t } = api;

  return {
    name: "proposal-await-operations",
    inherits: syntaxAwaitOps,
    visitor: {
      AwaitExpression({ node }) {
        if (node.operation != null) {
          node.argument = t.callExpression(
            t.memberExpression(
              t.identifier("Promise"),
              node.operation,
              false,
              false,
            ),
            [node.argument],
          );
          node.operation = null;
        }
      },
    },
  };
});
