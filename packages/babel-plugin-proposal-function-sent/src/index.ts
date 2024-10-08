import { declare } from "@babel/helper-plugin-utils";
import syntaxFunctionSent from "@babel/plugin-syntax-function-sent";
import * as wrapFunction from "@babel/helper-wrap-function";
import { types as t, type Visitor } from "@babel/core";

export default declare(api => {
  api.assertVersion(REQUIRED_VERSION(7));

  const isFunctionSent = (node: t.MetaProperty) =>
    t.isIdentifier(node.meta, { name: "function" }) &&
    t.isIdentifier(node.property, { name: "sent" });

  const hasBeenReplaced = (
    node: t.Node,
    sentId: string,
  ): node is t.AssignmentExpression =>
    t.isAssignmentExpression(node) &&
    t.isIdentifier(node.left, { name: sentId });

  const yieldVisitor: Visitor<{ sentId: string }> = {
    Function(path) {
      path.skip();
    },

    YieldExpression(path) {
      if (!hasBeenReplaced(path.parent, this.sentId)) {
        path.replaceWith(
          t.assignmentExpression("=", t.identifier(this.sentId), path.node),
        );
      }
    },

    MetaProperty(path) {
      if (isFunctionSent(path.node)) {
        path.replaceWith(t.identifier(this.sentId));
      }
    },
  };

  return {
    name: "proposal-function-sent",
    inherits: syntaxFunctionSent,

    visitor: api.traverse.visitors.merge([
      wrapFunction.buildOnCallExpression("callSkipFirstGeneratorNext"),
      {
        MetaProperty(path, state) {
          if (!isFunctionSent(path.node)) return;

          const fnPath = path.getFunctionParent();

          if (!fnPath.node.generator) {
            throw new Error("Parent generator function not found");
          }

          const sentId = path.scope.generateUid("function.sent");

          fnPath.traverse(yieldVisitor, { sentId });
          // @ts-expect-error A generator must not be an arrow function
          fnPath.node.body.body.unshift(
            t.variableDeclaration("let", [
              t.variableDeclarator(t.identifier(sentId), t.yieldExpression()),
            ]),
          );

          if (state.availableHelper("callSkipFirstGeneratorNext")) {
            wrapFunction.default(
              fnPath,
              () => state.addHelper("skipFirstGeneratorNext"),
              undefined,
              undefined,
              () => state.addHelper("callSkipFirstGeneratorNext"),
            );
          } else {
            wrapFunction.default(
              fnPath,
              state.addHelper("skipFirstGeneratorNext"),
            );
          }
        },
      },
    ]),
  };
});
