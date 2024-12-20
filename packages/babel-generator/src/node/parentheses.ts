import {
  isArrayTypeAnnotation,
  isBinaryExpression,
  isCallExpression,
  isForOfStatement,
  isIndexedAccessType,
  isMemberExpression,
  isObjectPattern,
  isOptionalMemberExpression,
  isYieldExpression,
  isStatement,
} from "@babel/types";
import type * as t from "@babel/types";

import { TokenContext } from "./index.ts";

const PRECEDENCE = new Map([
  ["||", 0],
  ["??", 0],
  ["|>", 0],
  ["&&", 1],
  ["|", 2],
  ["^", 3],
  ["&", 4],
  ["==", 5],
  ["===", 5],
  ["!=", 5],
  ["!==", 5],
  ["<", 6],
  [">", 6],
  ["<=", 6],
  [">=", 6],
  ["in", 6],
  ["instanceof", 6],
  [">>", 7],
  ["<<", 7],
  [">>>", 7],
  ["+", 8],
  ["-", 8],
  ["*", 9],
  ["/", 9],
  ["%", 9],
  ["**", 10],
]);

function getBinaryPrecedence(
  node: t.Binary | t.TSAsExpression | t.TSSatisfiesExpression,
  nodeType: string,
): number;
function getBinaryPrecedence(
  node: t.Node,
  nodeType: string,
): number | undefined;
function getBinaryPrecedence(node: t.Node, nodeType: string) {
  if (nodeType === "BinaryExpression" || nodeType === "LogicalExpression") {
    return PRECEDENCE.get((node as t.Binary).operator);
  }
  if (nodeType === "TSAsExpression" || nodeType === "TSSatisfiesExpression") {
    return PRECEDENCE.get("in");
  }
}

function isTSTypeExpression(nodeType: string) {
  return (
    nodeType === "TSAsExpression" ||
    nodeType === "TSSatisfiesExpression" ||
    nodeType === "TSTypeAssertion"
  );
}

const isClassExtendsClause = (
  node: t.Node,
  parent: t.Node,
): parent is t.Class => {
  const parentType = parent.type;
  return (
    (parentType === "ClassDeclaration" || parentType === "ClassExpression") &&
    parent.superClass === node
  );
};

const hasPostfixPart = (node: t.Node, parent: t.Node) => {
  const parentType = parent.type;
  return (
    ((parentType === "MemberExpression" ||
      parentType === "OptionalMemberExpression") &&
      parent.object === node) ||
    ((parentType === "CallExpression" ||
      parentType === "OptionalCallExpression" ||
      parentType === "NewExpression") &&
      parent.callee === node) ||
    (parentType === "TaggedTemplateExpression" && parent.tag === node) ||
    parentType === "TSNonNullExpression"
  );
};

export function NullableTypeAnnotation(
  node: t.NullableTypeAnnotation,
  parent: t.Node,
): boolean {
  return isArrayTypeAnnotation(parent);
}

export function FunctionTypeAnnotation(
  node: t.FunctionTypeAnnotation,
  parent: t.Node,
  tokenContext: number,
): boolean {
  const parentType = parent.type;
  return (
    // (() => A) | (() => B)
    parentType === "UnionTypeAnnotation" ||
    // (() => A) & (() => B)
    parentType === "IntersectionTypeAnnotation" ||
    // (() => A)[]
    parentType === "ArrayTypeAnnotation" ||
    Boolean(tokenContext & TokenContext.arrowFlowReturnType)
  );
}

export function UpdateExpression(
  node: t.UpdateExpression,
  parent: t.Node,
): boolean {
  return hasPostfixPart(node, parent) || isClassExtendsClause(node, parent);
}

function needsParenBeforeExpressionBrace(tokenContext: number) {
  return Boolean(
    tokenContext & (TokenContext.expressionStatement | TokenContext.arrowBody),
  );
}

export function ObjectExpression(
  node: t.ObjectExpression,
  parent: t.Node,
  tokenContext: number,
): boolean {
  return needsParenBeforeExpressionBrace(tokenContext);
}

export function DoExpression(
  node: t.DoExpression,
  parent: t.Node,
  tokenContext: number,
): boolean {
  // `async do` can start an expression statement
  return (
    !node.async && Boolean(tokenContext & TokenContext.expressionStatement)
  );
}

export function Binary(
  node: t.Binary | t.TSAsExpression | t.TSSatisfiesExpression,
  parent: t.Node,
): boolean | undefined {
  const parentType = parent.type;
  if (
    node.type === "BinaryExpression" &&
    node.operator === "**" &&
    parentType === "BinaryExpression" &&
    parent.operator === "**"
  ) {
    return parent.left === node;
  }

  if (isClassExtendsClause(node, parent)) {
    return true;
  }

  if (
    hasPostfixPart(node, parent) ||
    parentType === "UnaryExpression" ||
    parentType === "SpreadElement" ||
    parentType === "AwaitExpression"
  ) {
    return true;
  }

  const parentPos = getBinaryPrecedence(parent, parentType);
  if (parentPos != null) {
    const nodePos = getBinaryPrecedence(node, node.type);
    if (
      // Logical expressions with the same precedence don't need parens.
      (parentPos === nodePos &&
        parentType === "BinaryExpression" &&
        parent.right === node) ||
      parentPos > nodePos
    ) {
      return true;
    }
  }

  return undefined;
}

export function UnionTypeAnnotation(
  node: t.UnionTypeAnnotation,
  parent: t.Node,
): boolean {
  const parentType = parent.type;
  return (
    parentType === "ArrayTypeAnnotation" ||
    parentType === "NullableTypeAnnotation" ||
    parentType === "IntersectionTypeAnnotation" ||
    parentType === "UnionTypeAnnotation"
  );
}

export { UnionTypeAnnotation as IntersectionTypeAnnotation };

export function OptionalIndexedAccessType(
  node: t.OptionalIndexedAccessType,
  parent: t.Node,
): boolean {
  return isIndexedAccessType(parent) && parent.objectType === node;
}

export function TSAsExpression(
  node: t.TSAsExpression | t.TSSatisfiesExpression,
  parent: t.Node,
): boolean {
  if (
    (parent.type === "AssignmentExpression" ||
      parent.type === "AssignmentPattern") &&
    parent.left === node
  ) {
    return true;
  }
  if (
    parent.type === "BinaryExpression" &&
    (parent.operator === "|" || parent.operator === "&") &&
    node === parent.left
  ) {
    return true;
  }
  return Binary(node, parent);
}

export { TSAsExpression as TSSatisfiesExpression };

export { UnaryLike as TSTypeAssertion };

export function TSUnionType(node: t.TSUnionType, parent: t.Node): boolean {
  const parentType = parent.type;
  return (
    parentType === "TSArrayType" ||
    parentType === "TSOptionalType" ||
    parentType === "TSIntersectionType" ||
    parentType === "TSRestType"
  );
}

export { TSUnionType as TSIntersectionType };

export function TSInferType(node: t.TSInferType, parent: t.Node): boolean {
  const parentType = parent.type;
  return parentType === "TSArrayType" || parentType === "TSOptionalType";
}

export function TSInstantiationExpression(
  node: t.TSInstantiationExpression,
  parent: t.Node,
) {
  const parentType = parent.type;
  return (
    (parentType === "CallExpression" ||
      parentType === "OptionalCallExpression" ||
      parentType === "NewExpression" ||
      parentType === "TSInstantiationExpression") &&
    !!(process.env.BABEL_8_BREAKING
      ? // @ts-ignore(Babel 7 vs Babel 8) Babel 8 AST
        parent.typeArguments
      : // @ts-ignore(Babel 7 vs Babel 8) Babel 7 AST
        parent.typeParameters)
  );
}

export function BinaryExpression(
  node: t.BinaryExpression,
  parent: t.Node,
  tokenContext: unknown,
  inForStatementInit: boolean,
): boolean {
  // for ((1 in []);;);
  // for (var x = (1 in []) in 2);
  return node.operator === "in" && inForStatementInit;
}

export function SequenceExpression(
  node: t.SequenceExpression,
  parent: t.Node,
): boolean {
  const parentType = parent.type;
  if (
    parentType === "SequenceExpression" ||
    parentType === "ParenthesizedExpression" ||
    (parentType === "MemberExpression" && parent.property === node) ||
    (parentType === "OptionalMemberExpression" && parent.property === node) ||
    parentType === "TemplateLiteral"
  ) {
    return false;
  }
  if (parentType === "ClassDeclaration") {
    return true;
  }
  if (parentType === "ForOfStatement") {
    return parent.right === node;
  }
  if (parentType === "ExportDefaultDeclaration") {
    return true;
  }

  return !isStatement(parent);
}

export function YieldExpression(
  node: t.YieldExpression,
  parent: t.Node,
): boolean {
  const parentType = parent.type;
  return (
    parentType === "BinaryExpression" ||
    parentType === "LogicalExpression" ||
    parentType === "UnaryExpression" ||
    parentType === "SpreadElement" ||
    hasPostfixPart(node, parent) ||
    (parentType === "AwaitExpression" && isYieldExpression(node)) ||
    (parentType === "ConditionalExpression" && node === parent.test) ||
    isClassExtendsClause(node, parent) ||
    isTSTypeExpression(parentType)
  );
}

export { YieldExpression as AwaitExpression };

export function ClassExpression(
  node: t.ClassExpression,
  parent: t.Node,
  tokenContext: number,
): boolean {
  return Boolean(
    tokenContext &
      (TokenContext.expressionStatement | TokenContext.exportDefault),
  );
}

export function UnaryLike(
  node:
    | t.UnaryLike
    | t.TSTypeAssertion
    | t.ArrowFunctionExpression
    | t.ConditionalExpression
    | t.AssignmentExpression,
  parent: t.Node,
): boolean {
  return (
    hasPostfixPart(node, parent) ||
    (isBinaryExpression(parent) &&
      parent.operator === "**" &&
      parent.left === node) ||
    isClassExtendsClause(node, parent)
  );
}

export function FunctionExpression(
  node: t.FunctionExpression,
  parent: t.Node,
  tokenContext: number,
): boolean {
  return Boolean(
    tokenContext &
      (TokenContext.expressionStatement | TokenContext.exportDefault),
  );
}

export function ConditionalExpression(
  node:
    | t.ConditionalExpression
    | t.ArrowFunctionExpression
    | t.AssignmentExpression,
  parent?: t.Node,
): boolean {
  const parentType = parent.type;
  if (
    parentType === "UnaryExpression" ||
    parentType === "SpreadElement" ||
    parentType === "BinaryExpression" ||
    parentType === "LogicalExpression" ||
    (parentType === "ConditionalExpression" && parent.test === node) ||
    parentType === "AwaitExpression" ||
    isTSTypeExpression(parentType)
  ) {
    return true;
  }

  return UnaryLike(node, parent);
}

export { ConditionalExpression as ArrowFunctionExpression };

export function OptionalMemberExpression(
  node: t.OptionalMemberExpression,
  parent: t.Node,
): boolean {
  return (
    (isCallExpression(parent) && parent.callee === node) ||
    (isMemberExpression(parent) && parent.object === node)
  );
}

export { OptionalMemberExpression as OptionalCallExpression };

export function AssignmentExpression(
  node: t.AssignmentExpression,
  parent: t.Node,
  tokenContext: number,
): boolean {
  if (
    needsParenBeforeExpressionBrace(tokenContext) &&
    isObjectPattern(node.left)
  ) {
    return true;
  } else {
    return ConditionalExpression(node, parent);
  }
}

export function LogicalExpression(
  node: t.LogicalExpression,
  parent: t.Node,
): boolean {
  const parentType = parent.type;
  if (isTSTypeExpression(parentType)) return true;
  if (parentType !== "LogicalExpression") return false;
  switch (node.operator) {
    case "||":
      return parent.operator === "??" || parent.operator === "&&";
    case "&&":
      return parent.operator === "??";
    case "??":
      return parent.operator !== "??";
  }
}

export function Identifier(
  node: t.Identifier,
  parent: t.Node,
  tokenContext: number,
  _inForInit: boolean,
  getRawIdentifier: (node: t.Identifier) => string,
): boolean {
  const parentType = parent.type;
  // 13.15.2 AssignmentExpression RS: Evaluation
  // (fn) = function () {};
  if (
    node.extra?.parenthesized &&
    parentType === "AssignmentExpression" &&
    parent.left === node
  ) {
    const rightType = parent.right.type;
    if (
      (rightType === "FunctionExpression" || rightType === "ClassExpression") &&
      parent.right.id == null
    ) {
      return true;
    }
  }

  if (getRawIdentifier && getRawIdentifier(node) !== node.name) {
    return false;
  }

  // Non-strict code allows the identifier `let`, but it cannot occur as-is in
  // certain contexts to avoid ambiguity with contextual keyword `let`.
  if (node.name === "let") {
    // Some contexts only forbid `let [`, so check if the next token would
    // be the left bracket of a computed member expression.
    const isFollowedByBracket =
      isMemberExpression(parent, {
        object: node,
        computed: true,
      }) ||
      isOptionalMemberExpression(parent, {
        object: node,
        computed: true,
        optional: false,
      });
    if (
      isFollowedByBracket &&
      tokenContext &
        (TokenContext.expressionStatement |
          TokenContext.forHead |
          TokenContext.forInHead)
    ) {
      return true;
    }
    return Boolean(tokenContext & TokenContext.forOfHead);
  }

  // ECMAScript specifically forbids a for-of loop from starting with the
  // token sequence `for (async of`, because it would be ambiguous with
  // `for (async of => {};;)`, so we need to add extra parentheses.
  return (
    node.name === "async" &&
    isForOfStatement(parent, { left: node, await: false })
  );
}
