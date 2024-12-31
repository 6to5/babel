import { declare } from "@babel/helper-plugin-utils";
import { types as t, template } from "@babel/core";

export interface Options {
  loose?: boolean;
}

export default declare((api, { loose = false }: Options) => {
  api.assertVersion(REQUIRED_VERSION(7));
  const noDocumentAll = api.assumption("noDocumentAll") ?? loose;
  const pureGetters = api.assumption("pureGetters") ?? false;

  return {
    name: "transform-nullish-coalescing-operator",
    manipulateOptions: process.env.BABEL_8_BREAKING
      ? undefined
      : (_, parser) => parser.plugins.push("nullishCoalescingOperator"),

    visitor: {
      LogicalExpression(path) {
        const { node, scope } = path;
        if (node.operator !== "??") {
          return;
        }

        let ref;
        let assignment;
        // skip creating extra reference when `left` is pure
        if (
          (pureGetters &&
            scope.path.isPattern() &&
            t.isMemberExpression(node.left) &&
            !node.left.computed &&
            t.isIdentifier(node.left.object) &&
            t.isIdentifier(node.left.property)) ||
          (t.isIdentifier(node.left) &&
            (pureGetters ||
              // globalThis
              scope.hasBinding(node.left.name))) ||
          scope.isPure(node.left)
        ) {
          ref = node.left;
          assignment = t.cloneNode(node.left);
        } else if (scope.path.isPattern()) {
          // Replace `function (a, x = a.b ?? c) {}` to `function (a, x = (() => a.b ?? c)() ){}`
          // so the temporary variable can be injected in correct scope
          path.replaceWith(template.statement.ast`(() => ${path.node})()`);
          // The injected nullish expression will be queued and eventually transformed when visited
          return;
        } else {
          ref = scope.generateUidIdentifierBasedOnNode(node.left);
          scope.push({ id: t.cloneNode(ref) });
          assignment = t.assignmentExpression("=", ref, node.left);
        }

        path.replaceWith(
          t.conditionalExpression(
            // We cannot use `!= null` in spec mode because
            // `document.all == null` and `document.all` is not "nullish".
            noDocumentAll
              ? t.binaryExpression("!=", assignment, t.nullLiteral())
              : t.logicalExpression(
                  "&&",
                  t.binaryExpression("!==", assignment, t.nullLiteral()),
                  t.binaryExpression(
                    "!==",
                    t.cloneNode(ref),
                    scope.buildUndefinedNode(),
                  ),
                ),
            t.cloneNode(ref),
            node.right,
          ),
        );
      },
    },
  };
});
