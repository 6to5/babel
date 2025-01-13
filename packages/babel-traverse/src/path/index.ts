import type { HubInterface } from "../hub.ts";
import type TraversalContext from "../context.ts";
import type { ExplodedTraverseOptions } from "../index.ts";
import * as virtualTypes from "./lib/virtual-types.ts";
import buildDebug from "debug";
import traverse from "../index.ts";
import type { Visitor } from "../types.ts";
import Scope from "../scope/index.ts";
import { validate } from "@babel/types";
import * as t from "@babel/types";
import * as cache from "../cache.ts";
import generator from "@babel/generator";

// NodePath is split across many files.
import * as NodePath_ancestry from "./ancestry.ts";
import * as NodePath_inference from "./inference/index.ts";
import * as NodePath_replacement from "./replacement.ts";
import * as NodePath_evaluation from "./evaluation.ts";
import * as NodePath_conversion from "./conversion.ts";
import * as NodePath_introspection from "./introspection.ts";
import * as NodePath_context from "./context.ts";
import * as NodePath_removal from "./removal.ts";
import * as NodePath_modification from "./modification.ts";
import * as NodePath_family from "./family.ts";
import * as NodePath_comments from "./comments.ts";
import * as NodePath_virtual_types_validator from "./lib/virtual-types-validator.ts";
import type { NodePathAssertions } from "./generated/asserts.ts";
import type { NodePathValidators } from "./generated/validators.ts";
import { setup } from "./context.ts";

const debug = buildDebug("babel");

export const REMOVED = 1 << 0;
export const SHOULD_STOP = 1 << 1;
export const SHOULD_SKIP = 1 << 2;

declare const bit: import("../../../../scripts/babel-plugin-bit-decorator/types.d.ts").BitDecorator<any>;

const NodePath_Final = class NodePath {
  constructor(hub: HubInterface, parent: t.Node | null) {
    this.parent = parent;
    this.hub = hub;
    this.data = null;

    this.context = null;
    this.scope = null;
  }

  declare parent: t.Node;
  declare hub: HubInterface;
  declare data: Record<string | symbol, unknown>;
  // TraversalContext is configured by setContext
  declare context: TraversalContext;
  declare scope: Scope;

  contexts: Array<TraversalContext> = [];
  state: any = null;
  opts: ExplodedTraverseOptions | null = null;

  @bit.storage _traverseFlags: number;
  @bit(REMOVED) accessor removed = false;
  @bit(SHOULD_STOP) accessor shouldStop = false;
  @bit(SHOULD_SKIP) accessor shouldSkip = false;

  skipKeys: Record<string, boolean> | null = null;
  parentPath: NodePath_Final | null = null;
  container: t.Node | Array<t.Node> | null = null;
  listKey: string | null = null;
  key: string | number | null = null;
  node: t.Node | null = null;
  type: t.Node["type"] | null = null;
  _store: Map<t.Node, NodePath_Final> | null = null;

  static get({
    hub,
    parentPath,
    parent,
    container,
    listKey,
    key,
  }: {
    hub?: HubInterface;
    parentPath: NodePath_Final | null;
    parent: t.Node;
    container: t.Node | t.Node[];
    listKey?: string;
    key: string | number;
  }): NodePath_Final {
    if (!hub && parentPath) {
      hub = parentPath.hub;
    }

    if (!parent) {
      throw new Error("To get a node path the parent needs to exist");
    }

    const targetNode =
      // @ts-expect-error key must present in container
      container[key];

    const paths = cache.getOrCreateCachedPaths(parent, parentPath);

    let path = paths.get(targetNode);
    if (!path) {
      path = new NodePath(hub, parent) as NodePath_Final;
      if (targetNode) paths.set(targetNode, path);
    }

    setup.call(path, parentPath, container, listKey, key);

    return path;
  }

  getScope(this: NodePath_Final, scope: Scope): Scope {
    return this.isScope() ? new Scope(this) : scope;
  }

  setData(key: string | symbol, val: any): any {
    if (this.data == null) {
      this.data = Object.create(null);
    }
    return (this.data[key] = val);
  }

  getData(key: string | symbol, def?: any): any {
    if (this.data == null) {
      this.data = Object.create(null);
    }
    let val = this.data[key];
    if (val === undefined && def !== undefined) val = this.data[key] = def;
    return val;
  }

  hasNode(): boolean {
    return this.node != null;
  }

  buildCodeFrameError(
    msg: string,
    Error: new () => Error = SyntaxError,
  ): Error {
    return this.hub.buildError(this.node, msg, Error);
  }

  traverse<T>(this: NodePath_Final, visitor: Visitor<T>, state: T): void;
  traverse(this: NodePath_Final, visitor: Visitor): void;
  traverse(this: NodePath_Final, visitor: any, state?: any) {
    traverse(this.node, visitor, this.scope, state, this);
  }

  set(key: string, node: any) {
    validate(this.node, key, node);
    // @ts-expect-error key must present in this.node
    this.node[key] = node;
  }

  getPathLocation(this: NodePath_Final): string {
    const parts = [];
    let path: NodePath_Final = this;
    do {
      let key = path.key;
      if (path.inList) key = `${path.listKey}[${key}]`;
      parts.unshift(key);
    } while ((path = path.parentPath));
    return parts.join(".");
  }

  debug(this: NodePath_Final, message: string) {
    if (!debug.enabled) return;
    debug(`${this.getPathLocation()} ${this.type}: ${message}`);
  }

  toString() {
    return generator(this.node).code;
  }

  get inList() {
    return !!this.listKey;
  }

  set inList(inList) {
    if (!inList) {
      this.listKey = null;
    }
    // ignore inList = true as it should depend on `listKey`
  }

  get parentKey(): string {
    return (this.listKey || this.key) as string;
  }
};

const methods = {
  // NodePath_ancestry
  findParent: NodePath_ancestry.findParent,
  find: NodePath_ancestry.find,
  getFunctionParent: NodePath_ancestry.getFunctionParent,
  getStatementParent: NodePath_ancestry.getStatementParent,
  getEarliestCommonAncestorFrom:
    NodePath_ancestry.getEarliestCommonAncestorFrom,
  getDeepestCommonAncestorFrom: NodePath_ancestry.getDeepestCommonAncestorFrom,
  getAncestry: NodePath_ancestry.getAncestry,
  isAncestor: NodePath_ancestry.isAncestor,
  isDescendant: NodePath_ancestry.isDescendant,
  inType: NodePath_ancestry.inType,

  // NodePath_inference
  getTypeAnnotation: NodePath_inference.getTypeAnnotation,
  isBaseType: NodePath_inference.isBaseType,
  couldBeBaseType: NodePath_inference.couldBeBaseType,
  baseTypeStrictlyMatches: NodePath_inference.baseTypeStrictlyMatches,
  isGenericType: NodePath_inference.isGenericType,

  // NodePath_replacement
  replaceWithMultiple: NodePath_replacement.replaceWithMultiple,
  replaceWithSourceString: NodePath_replacement.replaceWithSourceString,
  replaceWith: NodePath_replacement.replaceWith,
  replaceExpressionWithStatements:
    NodePath_replacement.replaceExpressionWithStatements,
  replaceInline: NodePath_replacement.replaceInline,

  // NodePath_evaluation
  evaluateTruthy: NodePath_evaluation.evaluateTruthy,
  evaluate: NodePath_evaluation.evaluate,

  // NodePath_conversion
  toComputedKey: NodePath_conversion.toComputedKey,
  ensureBlock: NodePath_conversion.ensureBlock,
  unwrapFunctionEnvironment: NodePath_conversion.unwrapFunctionEnvironment,
  arrowFunctionToExpression: NodePath_conversion.arrowFunctionToExpression,
  splitExportDeclaration: NodePath_conversion.splitExportDeclaration,
  ensureFunctionName: NodePath_conversion.ensureFunctionName,

  // NodePath_introspection
  matchesPattern: NodePath_introspection.matchesPattern,
  isStatic: NodePath_introspection.isStatic,
  isNodeType: NodePath_introspection.isNodeType,
  canHaveVariableDeclarationOrExpression:
    NodePath_introspection.canHaveVariableDeclarationOrExpression,
  canSwapBetweenExpressionAndStatement:
    NodePath_introspection.canSwapBetweenExpressionAndStatement,
  isCompletionRecord: NodePath_introspection.isCompletionRecord,
  isStatementOrBlock: NodePath_introspection.isStatementOrBlock,
  referencesImport: NodePath_introspection.referencesImport,
  getSource: NodePath_introspection.getSource,
  willIMaybeExecuteBefore: NodePath_introspection.willIMaybeExecuteBefore,
  _guessExecutionStatusRelativeTo:
    NodePath_introspection._guessExecutionStatusRelativeTo,
  resolve: NodePath_introspection.resolve,
  isConstantExpression: NodePath_introspection.isConstantExpression,
  isInStrictMode: NodePath_introspection.isInStrictMode,

  // NodePath_context
  isDenylisted: NodePath_context.isDenylisted,
  visit: NodePath_context.visit,
  skip: NodePath_context.skip,
  skipKey: NodePath_context.skipKey,
  stop: NodePath_context.stop,
  setContext: NodePath_context.setContext,
  requeue: NodePath_context.requeue,
  requeueComputedKeyAndDecorators:
    NodePath_context.requeueComputedKeyAndDecorators,

  // NodePath_removal
  remove: NodePath_removal.remove,

  // NodePath_modification
  insertBefore: NodePath_modification.insertBefore,
  insertAfter: NodePath_modification.insertAfter,
  unshiftContainer: NodePath_modification.unshiftContainer,
  pushContainer: NodePath_modification.pushContainer,

  // NodePath_family
  getOpposite: NodePath_family.getOpposite,
  getCompletionRecords: NodePath_family.getCompletionRecords,
  getSibling: NodePath_family.getSibling,
  getPrevSibling: NodePath_family.getPrevSibling,
  getNextSibling: NodePath_family.getNextSibling,
  getAllNextSiblings: NodePath_family.getAllNextSiblings,
  getAllPrevSiblings: NodePath_family.getAllPrevSiblings,
  get: NodePath_family.get,
  getAssignmentIdentifiers: NodePath_family.getAssignmentIdentifiers,
  getBindingIdentifiers: NodePath_family.getBindingIdentifiers,
  getOuterBindingIdentifiers: NodePath_family.getOuterBindingIdentifiers,
  getBindingIdentifierPaths: NodePath_family.getBindingIdentifierPaths,
  getOuterBindingIdentifierPaths:
    NodePath_family.getOuterBindingIdentifierPaths,

  // NodePath_comments
  shareCommentsWithSiblings: NodePath_comments.shareCommentsWithSiblings,
  addComment: NodePath_comments.addComment,
  addComments: NodePath_comments.addComments,
};

Object.assign(NodePath_Final.prototype, methods);

if (!process.env.BABEL_8_BREAKING && !USE_ESM) {
  // String(x) is workaround for rollup

  // @ts-expect-error babel 7 only
  NodePath_Final.prototype.arrowFunctionToShadowed =
    // @ts-expect-error babel 7 only
    NodePath_conversion[String("arrowFunctionToShadowed")];

  Object.assign(NodePath_Final.prototype, {
    // @ts-expect-error Babel 7 only
    has: NodePath_introspection[String("has")],
    // @ts-expect-error Babel 7 only
    is: NodePath_introspection[String("is")],
    // @ts-expect-error Babel 7 only
    isnt: NodePath_introspection[String("isnt")],
    // @ts-expect-error Babel 7 only
    equals: NodePath_introspection[String("equals")],
    // @ts-expect-error Babel 7 only
    hoist: NodePath_modification[String("hoist")],
    updateSiblingKeys: NodePath_modification.updateSiblingKeys,
    call: NodePath_context.call,
    // @ts-expect-error Babel 7 only
    isBlacklisted: NodePath_context[String("isBlacklisted")],
    setScope: NodePath_context.setScope,
    resync: NodePath_context.resync,
    popContext: NodePath_context.popContext,
    pushContext: NodePath_context.pushContext,
    setup: NodePath_context.setup,
    setKey: NodePath_context.setKey,
  });
}

if (!process.env.BABEL_8_BREAKING) {
  // @ts-expect-error The original _guessExecutionStatusRelativeToDifferentFunctions only worked for paths in
  // different functions, but _guessExecutionStatusRelativeTo works as a replacement in those cases.
  NodePath_Final.prototype._guessExecutionStatusRelativeToDifferentFunctions =
    NodePath_introspection._guessExecutionStatusRelativeTo;

  // @ts-expect-error The original _guessExecutionStatusRelativeToDifferentFunctions only worked for paths in
  // different functions, but _guessExecutionStatusRelativeTo works as a replacement in those cases.
  NodePath_Final.prototype._guessExecutionStatusRelativeToDifferentFunctions =
    NodePath_introspection._guessExecutionStatusRelativeTo;

  Object.assign(NodePath_Final.prototype, {
    // NodePath_inference
    _getTypeAnnotation: NodePath_inference._getTypeAnnotation,

    // NodePath_replacement
    _replaceWith: NodePath_replacement._replaceWith,

    // NodePath_introspection
    _resolve: NodePath_introspection._resolve,

    // NodePath_context
    _call: NodePath_context._call,
    _resyncParent: NodePath_context._resyncParent,
    _resyncKey: NodePath_context._resyncKey,
    _resyncList: NodePath_context._resyncList,
    _resyncRemoved: NodePath_context._resyncRemoved,
    _getQueueContexts: NodePath_context._getQueueContexts,

    // NodePath_removal
    _removeFromScope: NodePath_removal._removeFromScope,
    _callRemovalHooks: NodePath_removal._callRemovalHooks,
    _remove: NodePath_removal._remove,
    _markRemoved: NodePath_removal._markRemoved,
    _assertUnremoved: NodePath_removal._assertUnremoved,

    // NodePath_modification
    _containerInsert: NodePath_modification._containerInsert,
    _containerInsertBefore: NodePath_modification._containerInsertBefore,
    _containerInsertAfter: NodePath_modification._containerInsertAfter,
    _verifyNodeList: NodePath_modification._verifyNodeList,

    // NodePath_family
    _getKey: NodePath_family._getKey,
    _getPattern: NodePath_family._getPattern,
  });
}

// we can not use `import { TYPES } from "@babel/types"` here
// because the transformNamedBabelTypesImportToDestructuring plugin in babel.config.js
// does not offer live bindings for `TYPES`
// we can change to `import { TYPES }` when we are publishing ES modules only
for (const type of t.TYPES) {
  const typeKey = `is${type}`;
  // @ts-expect-error typeKey must present in t
  const fn = t[typeKey];
  // @ts-expect-error augmenting NodePath prototype
  NodePath_Final.prototype[typeKey] = function (opts: any) {
    return fn(this.node, opts);
  };

  // @ts-expect-error augmenting NodePath prototype
  NodePath_Final.prototype[`assert${type}`] = function (opts: any) {
    if (!fn(this.node, opts)) {
      throw new TypeError(`Expected node path of type ${type}`);
    }
  };
}

// Register virtual types validators after base types validators
Object.assign(NodePath_Final.prototype, NodePath_virtual_types_validator);

for (const type of Object.keys(virtualTypes) as (keyof typeof virtualTypes)[]) {
  if (type[0] === "_") continue;
  if (!t.TYPES.includes(type)) t.TYPES.push(type);
}

interface NodePathOverwrites {
  // We need to re-define these predicate and assertion
  // methods here, because we cannot refine `this` in
  // a function declaration.
  // See https://github.com/microsoft/TypeScript/issues/38150

  /**
   * NOTE: This assertion doesn't narrow the type on unions of
   * NodePaths, due to https://github.com/microsoft/TypeScript/issues/44212
   *
   * @see ./conversion.ts for implementation.
   */
  ensureBlock(
    this: NodePath_Final,
  ): asserts this is NodePath_Final<
    (
      | t.Loop
      | t.WithStatement
      | t.Function
      | t.LabeledStatement
      | t.CatchClause
    ) & { body: t.BlockStatement }
  >;
  /**
   * @see ./introspection.ts for implementation.
   */
  isStatementOrBlock(
    this: NodePath_Final,
  ): this is NodePath_Final<t.Statement | t.Block>;
}

type NodePathMixins = Omit<typeof methods, keyof NodePathOverwrites>;

interface NodePath<T extends t.Node>
  extends InstanceType<typeof NodePath_Final>,
    NodePathAssertions,
    NodePathValidators,
    NodePathMixins,
    NodePathOverwrites {
  type: T["type"] | null;
  node: T;
  parent: t.ParentMaps[T["type"]];
  parentPath: t.ParentMaps[T["type"]] extends null
    ? null
    : NodePath_Final<t.ParentMaps[T["type"]]> | null;
}

// This trick is necessary so that
// NodePath_Final<A | B> is the same as NodePath_Final<A> | NodePath_Final<B>
type NodePath_Final<T extends t.Node = t.Node> = T extends any
  ? NodePath<T>
  : never;

export { NodePath_Final as default, type NodePath as NodePath_Internal };
