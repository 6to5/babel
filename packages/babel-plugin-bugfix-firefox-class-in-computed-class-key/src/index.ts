import type { NodePath, Visitor } from "@babel/traverse";
import type { types as t } from "@babel/core";
import { declare } from "@babel/helper-plugin-utils";
import environmentVisitor from "@babel/helper-environment-visitor";

export default declare(({ types: t, traverse, assertVersion }) => {
  assertVersion(REQUIRED_VERSION(7));

  const containsClassExpressionVisitor: Visitor<{ found: boolean }> = {
    ClassExpression(path, state) {
      state.found = true;
      path.stop();
    },
    Function(path) {
      path.skip();
    },
  };

  const containsYieldOrAwaitVisitor = traverse.visitors.merge([
    {
      YieldExpression(path, state) {
        state.yield = true;
        if (state.await) path.stop();
      },
      AwaitExpression(path, state) {
        state.await = true;
        if (state.yield) path.stop();
      },
    } satisfies Visitor<{ yield: boolean; await: boolean }>,
    environmentVisitor,
  ]);

  function containsClassExpression(path: NodePath<t.Node>) {
    if (t.isClassExpression(path.node)) return true;
    if (t.isFunction(path.node)) return false;
    const state = { found: false };
    path.traverse(containsClassExpressionVisitor, state);
    return state.found;
  }

  function wrap(path: NodePath<t.Expression>) {
    const context = {
      yield: t.isYieldExpression(path.node),
      await: t.isAwaitExpression(path.node),
    };
    path.traverse(containsYieldOrAwaitVisitor, context);

    let replacement;

    if (context.yield) {
      const fn = t.functionExpression(
        null,
        [],
        t.blockStatement([t.returnStatement(path.node)]),
        /* generator */ true,
        /* async */ context.await,
      );

      replacement = t.yieldExpression(
        t.callExpression(t.memberExpression(fn, t.identifier("call")), [
          t.thisExpression(),
          // NOTE: In some context arguments is invalid (it might not be defined
          // in the top-level scope, or it's a syntax error in static class blocks).
          // However, `yield` is also invalid in those contexts, so we can safely
          // inject a reference to arguments.
          t.identifier("arguments"),
        ]),
        true,
      );
    } else {
      const fn = t.arrowFunctionExpression([], path.node, context.await);

      if (context.await) {
        replacement = t.awaitExpression(t.callExpression(fn, []));
      } else {
        replacement = t.callExpression(
          // We need to use fn.call() instead of just fn() because
          // terser transforms (() => class {})() to class {}, effectively
          // undoing the wrapping introduced by this plugin.
          // https://github.com/terser/terser/issues/1514
          // TODO(Babel 8): Remove .call if Terser stops inlining this case.
          t.memberExpression(fn, t.identifier("call")),
          [],
        );
      }
    }

    path.replaceWith(replacement);
  }

  return {
    name: "bugfix-firefox-class-in-computed-class-key",

    visitor: {
      Class(path) {
        const hasPrivateElement = path.node.body.body.some(node =>
          t.isPrivate(node),
        );
        if (!hasPrivateElement) return;

        for (const elem of path.get("body.body")) {
          if (
            "computed" in elem.node &&
            elem.node.computed &&
            containsClassExpression(elem.get("key"))
          ) {
            wrap(elem.get("key"));
          }
        }
      },
    },
  };
});
