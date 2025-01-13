import TraversalContext from "./context.ts";
import type { ExplodedTraverseOptions } from "./index.ts";
import NodePath from "./path/index.ts";
import type Scope from "./scope/index.ts";
import type * as t from "@babel/types";
import { VISITOR_KEYS } from "@babel/types";
import { _call, popContext, pushContext, resync } from "./path/context.ts";

function _visitPaths(ctx: TraversalContext, paths: NodePath[]): boolean {
  // set queue
  ctx.queue = paths;
  ctx.priorityQueue = [];

  const visited = new Set();
  let stop = false;
  let visitIndex = 0;

  for (; visitIndex < paths.length; ) {
    const path = paths[visitIndex];
    visitIndex++;

    resync.call(path);

    if (
      path.contexts.length === 0 ||
      path.contexts[path.contexts.length - 1] !== ctx
    ) {
      // The context might already have been pushed when this path was inserted and queued.
      // If we always re-pushed here, we could get duplicates and risk leaving contexts
      // on the stack after the traversal has completed, which could break things.
      pushContext.call(path, ctx);
    }

    // this path no longer belongs to the tree
    if (path.key === null) continue;

    // ensure we don't visit the same node twice
    const { node } = path;
    if (visited.has(node)) continue;
    if (node) visited.add(node);

    if (_visit(ctx, path)) {
      stop = true;
      break;
    }

    if (ctx.priorityQueue.length) {
      stop = _visitPaths(ctx, ctx.priorityQueue);
      ctx.priorityQueue = [];
      ctx.queue = paths;
      if (stop) break;
    }
  }

  // pop contexts
  for (let i = 0; i < visitIndex; i++) {
    popContext.call(paths[i]);
  }

  // clear queue
  ctx.queue = null;

  return stop;
}

function _visit(ctx: TraversalContext, path: NodePath) {
  const node = path.node;
  if (!node) {
    return false;
  }
  const opts = ctx.opts;

  // @ts-expect-error TODO(Babel 8): Remove blacklist
  const denylist = opts.denylist ?? opts.blacklist;
  if (denylist?.includes(node.type)) {
    return false;
  }

  if (opts.shouldSkip?.(path)) {
    return false;
  }

  // Note: We need to check "this.shouldSkip" first because
  // another visitor can set it to true. Usually .shouldSkip is false
  // before calling the enter visitor, but it can be true in case of
  // a requeued node (e.g. by .replaceWith()) that is then marked
  // with .skip().
  if (path.shouldSkip) return path.shouldStop;

  if (_call.call(path, opts.enter)) return path.shouldStop;
  if (path.node) {
    if (_call.call(path, opts[node.type]?.enter)) return path.shouldStop;
  }

  path.shouldStop = traverse(
    path.node,
    opts,
    path.scope,
    ctx.state,
    path,
    path.skipKeys,
  );

  if (path.node) {
    if (_call.call(path, opts.exit)) return true;
  }
  if (path.node) {
    _call.call(path, opts[node.type]?.exit);
  }

  return path.shouldStop;
}

function traverse<S>(
  node: t.Node,
  opts: ExplodedTraverseOptions<S>,
  scope?: Scope,
  state?: S,
  path?: NodePath,
  skipKeys?: Record<string, boolean>,
  visitSelf?: boolean,
) {
  const keys = VISITOR_KEYS[node.type];
  if (!keys?.length) return false;

  const ctx = new TraversalContext(scope, opts, state, path);
  if (visitSelf) {
    if (skipKeys?.[path.parentKey]) return false;
    return _visitPaths(ctx, [path]);
  }

  for (const key of keys) {
    if (skipKeys?.[key]) continue;
    // @ts-expect-error key must present in node
    const prop = node[key];
    if (!prop) continue;

    if (Array.isArray(prop)) {
      if (!prop.length) continue;
      const paths = [];
      for (let i = 0; i < prop.length; i++) {
        const childPath = NodePath.get({
          parentPath: path,
          parent: node,
          container: prop,
          key: i,
          listKey: key,
        });
        paths.push(childPath);
      }
      if (_visitPaths(ctx, paths)) return true;
    } else {
      if (
        _visitPaths(ctx, [
          NodePath.get({
            parentPath: path,
            parent: node,
            container: node,
            key,
            listKey: null,
          }),
        ])
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Traverse the children of given node
 * @param {Node} node
 * @param {TraverseOptions} opts The traverse options used to create a new traversal context
 * @param {scope} scope A traversal scope used to create a new traversal context. When opts.noScope is true, scope should not be provided
 * @param {any} state A user data storage provided as the second callback argument for traversal visitors
 * @param {NodePath} path A NodePath of given node
 * @param {Record<string, boolean>} skipKeys A map from key names to whether that should be skipped during traversal. The skipKeys are applied to every descendants
 * @returns {boolean} Whether the traversal stops early

 * @note This function does not visit the given `node`.
 */
export function traverseNode<S = unknown>(
  node: t.Node,
  opts: ExplodedTraverseOptions<S>,
  scope?: Scope,
  state?: S,
  path?: NodePath,
  skipKeys?: Record<string, boolean>,
  visitSelf?: boolean,
): boolean {
  return traverse(node, opts, scope, state, path, skipKeys, visitSelf);
}
