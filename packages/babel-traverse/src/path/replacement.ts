// This file contains methods responsible for replacing a node with another.

import { codeFrameColumns } from "@babel/code-frame";
import traverse from "../index.ts";
import NodePath from "./index.ts";
import { getCachedPaths } from "../cache.ts";
import { _verifyNodeList, _containerInsertAfter } from "./modification.ts";
import { parse } from "@babel/parser";
import {
  FUNCTION_TYPES,
  arrowFunctionExpression,
  assignmentExpression,
  awaitExpression,
  blockStatement,
  buildUndefinedNode,
  callExpression,
  cloneNode,
  conditionalExpression,
  expressionStatement,
  getBindingIdentifiers,
  identifier,
  inheritLeadingComments,
  inheritTrailingComments,
  inheritsComments,
  isBlockStatement,
  isEmptyStatement,
  isExpression,
  isExpressionStatement,
  isIfStatement,
  isProgram,
  isStatement,
  isVariableDeclaration,
  removeComments,
  returnStatement,
  sequenceExpression,
  validate,
  yieldExpression,
} from "@babel/types";
import type * as t from "@babel/types";
import { resync, setScope } from "./context.ts";

/**
 * Replace a node with an array of multiple. This method performs the following steps:
 *
 *  - Inherit the comments of first provided node with that of the current node.
 *  - Insert the provided nodes after the current node.
 *  - Remove the current node.
 */

export function replaceWithMultiple(
  this: NodePath,
  nodes: t.Node | t.Node[],
): NodePath[] {
  resync.call(this);

  nodes = _verifyNodeList.call(this, nodes);
  inheritLeadingComments(nodes[0], this.node);
  inheritTrailingComments(nodes[nodes.length - 1], this.node);
  getCachedPaths(this)?.delete(this.node);
  this.node =
    // @ts-expect-error this.key must present in this.container
    this.container[this.key] = null;
  const paths = this.insertAfter(nodes);

  if (this.node) {
    this.requeue();
  } else {
    this.remove();
  }
  return paths;
}

/**
 * Parse a string as an expression and replace the current node with the result.
 *
 * NOTE: This is typically not a good idea to use. Building source strings when
 * transforming ASTs is an antipattern and SHOULD NOT be encouraged. Even if it's
 * easier to use, your transforms will be extremely brittle.
 */

export function replaceWithSourceString(this: NodePath, replacement: string) {
  resync.call(this);
  let ast: t.File;

  try {
    replacement = `(${replacement})`;
    // @ts-expect-error todo: use babel-types ast typings in Babel parser
    ast = parse(replacement);
  } catch (err) {
    const loc = err.loc;
    if (loc) {
      err.message +=
        " - make sure this is an expression.\n" +
        codeFrameColumns(replacement, {
          start: {
            line: loc.line,
            column: loc.column + 1,
          },
        });
      err.code = "BABEL_REPLACE_SOURCE_ERROR";
    }
    throw err;
  }

  const expressionAST = (ast.program.body[0] as t.ExpressionStatement)
    .expression;
  traverse.removeProperties(expressionAST);
  return this.replaceWith(expressionAST);
}

/**
 * Replace the current node with another.
 */
export function replaceWith<R extends t.Node>(
  this: NodePath,
  replacementPath: R,
): [NodePath<R>];
export function replaceWith<R extends NodePath>(
  this: NodePath,
  replacementPath: R,
): [R];
export function replaceWith(
  this: NodePath,
  replacementPath: t.Node | NodePath,
): [NodePath] {
  resync.call(this);

  if (this.removed) {
    throw new Error("You can't replace this node, we've already removed it");
  }

  let replacement: t.Node =
    replacementPath instanceof NodePath
      ? replacementPath.node
      : replacementPath;

  if (!replacement) {
    throw new Error(
      "You passed `path.replaceWith()` a falsy node, use `path.remove()` instead",
    );
  }

  if (this.node === replacement) {
    return [this];
  }

  if (this.isProgram() && !isProgram(replacement)) {
    throw new Error(
      "You can only replace a Program root node with another Program node",
    );
  }

  if (Array.isArray(replacement)) {
    throw new Error(
      "Don't use `path.replaceWith()` with an array of nodes, use `path.replaceWithMultiple()`",
    );
  }

  if (typeof replacement === "string") {
    throw new Error(
      "Don't use `path.replaceWith()` with a source string, use `path.replaceWithSourceString()`",
    );
  }

  let nodePath = "";

  if (this.isNodeType("Statement") && isExpression(replacement)) {
    if (
      !this.canHaveVariableDeclarationOrExpression() &&
      !this.canSwapBetweenExpressionAndStatement(replacement) &&
      !this.parentPath.isExportDefaultDeclaration()
    ) {
      // replacing a statement with an expression so wrap it in an expression statement
      replacement = expressionStatement(replacement);
      nodePath = "expression";
    }
  }

  if (this.isNodeType("Expression") && isStatement(replacement)) {
    if (
      !this.canHaveVariableDeclarationOrExpression() &&
      !this.canSwapBetweenExpressionAndStatement(replacement)
    ) {
      // replacing an expression with a statement so let's explode it
      return this.replaceExpressionWithStatements([replacement]) as [NodePath];
    }
  }

  const oldNode = this.node;
  if (oldNode) {
    inheritsComments(replacement, oldNode);
    removeComments(oldNode);
  }

  // replace the node
  _replaceWith.call(this, replacement);
  this.type = replacement.type;

  // potentially create new scope
  setScope.call(this);

  // requeue for visiting
  this.requeue();

  return [nodePath ? this.get(nodePath) : this];
}

export function _replaceWith(this: NodePath, node: t.Node) {
  if (!this.container) {
    throw new ReferenceError("Container is falsy");
  }

  if (this.inList) {
    // @ts-expect-error todo(flow->ts): check if validate accepts a numeric key
    validate(this.parent, this.key, [node]);
  } else {
    validate(this.parent, this.key as string, node);
  }

  this.debug(`Replace with ${node?.type}`);
  getCachedPaths(this)?.set(node, this).delete(this.node);

  this.node =
    // @ts-expect-error this.key must present in this.container
    this.container[this.key] = node;
}

/**
 * This method takes an array of statements nodes and then explodes it
 * into expressions. This method retains completion records which is
 * extremely important to retain original semantics.
 */

export function replaceExpressionWithStatements(
  this: NodePath,
  nodes: Array<t.Statement>,
) {
  resync.call(this);

  const declars: t.Identifier[] = [];
  const nodesAsSingleExpression = gatherSequenceExpressions(nodes, declars);
  if (nodesAsSingleExpression) {
    for (const id of declars) this.scope.push({ id });
    return this.replaceWith(nodesAsSingleExpression)[0].get("expressions");
  }

  const functionParent = this.getFunctionParent();
  const isParentAsync = functionParent?.node.async;
  const isParentGenerator = functionParent?.node.generator;

  const container = arrowFunctionExpression([], blockStatement(nodes));

  this.replaceWith(callExpression(container, []));
  // replaceWith changes the type of "this", but it isn't trackable by TS
  type ThisType = NodePath<
    t.CallExpression & {
      callee: t.ArrowFunctionExpression & { body: t.BlockStatement };
    }
  >;

  // hoist variable declaration in do block
  // `(do { var x = 1; x;})` -> `var x; (() => { x = 1; return x; })()`
  const callee = (this as ThisType).get("callee");
  callee.get("body").scope.hoistVariables(id => this.scope.push({ id }));

  // add implicit returns to all ending expression statements
  const completionRecords: Array<NodePath> = callee.getCompletionRecords();
  for (const path of completionRecords) {
    if (!path.isExpressionStatement()) continue;

    const loop = path.findParent(path => path.isLoop());
    if (loop) {
      let uid = loop.getData("expressionReplacementReturnUid");

      if (!uid) {
        uid = callee.scope.generateDeclaredUidIdentifier("ret");
        callee
          .get("body")
          .pushContainer("body", returnStatement(cloneNode(uid)));
        loop.setData("expressionReplacementReturnUid", uid);
      } else {
        uid = identifier(uid.name);
      }

      path
        .get("expression")
        .replaceWith(
          assignmentExpression("=", cloneNode(uid), path.node.expression),
        );
    } else {
      path.replaceWith(returnStatement(path.node.expression));
    }
  }

  // This is an IIFE, so we don't need to worry about the noNewArrows assumption
  callee.arrowFunctionToExpression();
  // Fixme: we can not `assert this is NodePath<t.FunctionExpression>` in `arrowFunctionToExpression`
  // because it is not a class method known at compile time.
  const newCallee = callee as unknown as NodePath<t.FunctionExpression>;

  // (() => await xxx)() -> await (async () => await xxx)();
  const needToAwaitFunction =
    isParentAsync &&
    traverse.hasType(
      (this.get("callee.body") as NodePath<t.BlockStatement>).node,
      "AwaitExpression",
      FUNCTION_TYPES,
    );
  const needToYieldFunction =
    isParentGenerator &&
    traverse.hasType(
      (this.get("callee.body") as NodePath<t.BlockStatement>).node,
      "YieldExpression",
      FUNCTION_TYPES,
    );
  if (needToAwaitFunction) {
    newCallee.set("async", true);
    // yield* will await the generator return result
    if (!needToYieldFunction) {
      this.replaceWith(awaitExpression((this as ThisType).node));
    }
  }
  if (needToYieldFunction) {
    newCallee.set("generator", true);
    this.replaceWith(yieldExpression((this as ThisType).node, true));
  }

  return newCallee.get("body.body");
}

function gatherSequenceExpressions(
  nodes: ReadonlyArray<t.Node>,
  declars: Array<t.Identifier>,
) {
  const exprs: t.Expression[] = [];
  let ensureLastUndefined = true;

  for (const node of nodes) {
    // if we encounter emptyStatement before a non-emptyStatement
    // we want to disregard that
    if (!isEmptyStatement(node)) {
      ensureLastUndefined = false;
    }

    if (isExpression(node)) {
      exprs.push(node);
    } else if (isExpressionStatement(node)) {
      exprs.push(node.expression);
    } else if (isVariableDeclaration(node)) {
      if (node.kind !== "var") return; // bailed

      for (const declar of node.declarations) {
        const bindings = getBindingIdentifiers(declar);
        for (const key of Object.keys(bindings)) {
          declars.push(cloneNode(bindings[key]));
        }

        if (declar.init) {
          exprs.push(assignmentExpression("=", declar.id, declar.init));
        }
      }

      ensureLastUndefined = true;
    } else if (isIfStatement(node)) {
      const consequent = node.consequent
        ? gatherSequenceExpressions([node.consequent], declars)
        : buildUndefinedNode();
      const alternate = node.alternate
        ? gatherSequenceExpressions([node.alternate], declars)
        : buildUndefinedNode();
      if (!consequent || !alternate) return; // bailed

      exprs.push(conditionalExpression(node.test, consequent, alternate));
    } else if (isBlockStatement(node)) {
      const body = gatherSequenceExpressions(node.body, declars);
      if (!body) return; // bailed

      exprs.push(body);
    } else if (isEmptyStatement(node)) {
      // empty statement so ensure the last item is undefined if we're last
      // checks if emptyStatement is first
      if (nodes.indexOf(node) === 0) {
        ensureLastUndefined = true;
      }
    } else {
      // bailed, we can't turn this statement into an expression
      return;
    }
  }

  if (ensureLastUndefined) exprs.push(buildUndefinedNode());

  if (exprs.length === 1) {
    return exprs[0];
  } else {
    return sequenceExpression(exprs);
  }
}

export function replaceInline(this: NodePath, nodes: t.Node | Array<t.Node>) {
  resync.call(this);

  if (Array.isArray(nodes)) {
    if (Array.isArray(this.container)) {
      nodes = _verifyNodeList.call(this, nodes);
      const paths = _containerInsertAfter.call(this, nodes);
      this.remove();
      return paths;
    } else {
      return this.replaceWithMultiple(nodes);
    }
  } else {
    return this.replaceWith(nodes);
  }
}
