import { VISITOR_KEYS } from "@babel/types";
import type * as t from "@babel/types";
import type { HubInterface, Visitor } from "../index.ts";
import { NodePath } from "../index.ts";
import { explode } from "../visitors.ts";
import { _forceSetScope } from "../path/context.ts";

export default function traverseForScope(
  path: NodePath,
  visitors: Visitor,
  state: any,
) {
  const exploded = explode(visitors);

  if (exploded.enter || exploded.exit) {
    throw new Error("Should not be used with enter/exit visitors.");
  }

  _traverse(
    path.parentPath,
    path.parent,
    path.node,
    path.container,
    path.key,
    path.listKey,
    path.hub,
    path,
  );

  function _traverse(
    parentPath: NodePath,
    parent: t.Node,
    node: t.Node,
    container: t.Node | t.Node[],
    key: string | number,
    listKey: string,
    hub?: HubInterface,
    inPath?: NodePath,
  ) {
    if (!node) {
      return;
    }

    const path =
      inPath ||
      NodePath.get({
        hub,
        parentPath,
        parent,
        container,
        listKey,
        key,
      });

    _forceSetScope(path);

    const visitor = exploded[node.type];
    if (visitor) {
      if (visitor.enter) {
        for (const visit of visitor.enter) {
          visit.call(state, path, state);
        }
      }
      if (visitor.exit) {
        for (const visit of visitor.exit) {
          visit.call(state, path, state);
        }
      }
    }
    if (path.shouldSkip) {
      return;
    }

    const keys = VISITOR_KEYS[node.type];
    if (!keys?.length) {
      return;
    }

    for (const key of keys) {
      // @ts-expect-error key must present in node
      const prop = node[key];
      if (!prop) continue;
      if (Array.isArray(prop)) {
        for (let i = 0; i < prop.length; i++) {
          const value = prop[i];
          _traverse(path, node, value, prop, i, key);
        }
      } else {
        _traverse(path, node, prop, node, key, null);
      }
    }
  }
}
