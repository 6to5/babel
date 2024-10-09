import { declare } from "@babel/helper-plugin-utils";
import type { types as t, Scope } from "@babel/core";

export default declare(api => {
  api.assertVersion(REQUIRED_VERSION(7));

  const { types: t } = api;

  function build(left: t.Expression, right: t.Expression) {
    return t.callExpression(
      t.memberExpression(t.identifier("Math"), t.identifier("pow")),
      [left, right],
    );
  }

  function maybeMemoize<T extends t.Expression | t.Super>(
    node: T,
    scope: Scope,
  ) {
    if (scope.isPure(node) || t.isSuper(node)) {
      return { assign: node, ref: t.cloneNode(node) };
    }

    const id = scope.generateUidIdentifierBasedOnNode(node);
    scope.push({ id });
    return {
      assign: t.assignmentExpression("=", t.cloneNode(id), node),
      ref: t.cloneNode(id),
    };
  }

  return {
    name: "transform-exponentiation-operator",

    visitor: {
      AssignmentExpression(path) {
        const { node, scope } = path;
        if (node.operator !== "**=") return;

        if (t.isMemberExpression(node.left)) {
          let member1: t.Expression;
          let member2: t.Expression;

          const object = maybeMemoize(node.left.object, scope);
          const { property, computed } = node.left;

          if (computed) {
            const prop = maybeMemoize(property as t.Expression, scope);
            member1 = t.memberExpression(object.assign, prop.assign, true);
            member2 = t.memberExpression(object.ref, prop.ref, true);
          } else {
            member1 = t.memberExpression(object.assign, property, false);
            member2 = t.memberExpression(
              object.ref,
              t.cloneNode(property),
              false,
            );
          }

          path.replaceWith(
            t.assignmentExpression("=", member1, build(member2, node.right)),
          );
        } else {
          path.replaceWith(
            t.assignmentExpression(
              "=",
              node.left,
              build(
                // todo: it could be a t.AsExpression
                t.cloneNode(node.left) as t.Identifier,
                node.right,
              ),
            ),
          );
        }
      },

      BinaryExpression(path) {
        const { node } = path;
        if (node.operator === "**") {
          path.replaceWith(
            build(
              // left can be PrivateName only if operator is `"in"`
              node.left as t.Expression,
              node.right,
            ),
          );
        }
      },
    },
  };
});
