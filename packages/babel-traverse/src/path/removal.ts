// This file contains methods responsible for removing a node.

import { hooks } from "./lib/removal-hooks.ts";
import { getCachedPaths } from "../cache.ts";
import { _replaceWith } from "./replacement.ts";
import type NodePath from "./index.ts";
import { REMOVED, SHOULD_SKIP } from "./index.ts";
import { getBindingIdentifiers } from "@babel/types";

export function removeInternal(this: NodePath, noScope?: boolean) {
  _assertUnremoved.call(this);

  this.resync();
  if (!noScope && !this.opts?.noScope) {
    _removeFromScope.call(this);
  }

  if (_callRemovalHooks.call(this)) {
    _markRemoved.call(this);
    return;
  }

  this.shareCommentsWithSiblings();
  _remove.call(this);
  _markRemoved.call(this);
}

export function remove(this: NodePath) {
  removeInternal.call(this);
}

export function _removeFromScope(this: NodePath) {
  const bindings = getBindingIdentifiers(this.node, false, false, true);
  Object.keys(bindings).forEach(name => this.scope.removeBinding(name));
}

export function _callRemovalHooks(this: NodePath) {
  if (this.parentPath) {
    for (const fn of hooks) {
      if (fn(this, this.parentPath)) return true;
    }
  }
}

export function _remove(this: NodePath) {
  if (Array.isArray(this.container)) {
    this.container.splice(this.key as number, 1);
    this.updateSiblingKeys(this.key as number, -1);
  } else {
    _replaceWith.call(this, null);
  }
}

export function _markRemoved(this: NodePath) {
  // this.shouldSkip = true; this.removed = true;
  this._traverseFlags |= SHOULD_SKIP | REMOVED;
  if (this.parent) {
    getCachedPaths(this.hub, this.parent).delete(this.node);
  }
  this.node = null;
}

export function _assertUnremoved(this: NodePath) {
  if (this.removed) {
    throw this.buildCodeFrameError(
      "NodePath has been removed so is read-only.",
    );
  }
}
