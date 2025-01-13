import {
  isIdentifier,
  isMemberExpression,
  isStringLiteral,
  isThisExpression,
} from "./generated/index.ts";
import type * as t from "../index.ts";

/**
 * Determines whether or not the input node `member` matches the
 * input `match`.
 *
 * For example, given the match `React.createClass` it would match the
 * parsed nodes of `React.createClass` and `React["createClass"]`.
 */
export default function matchesPattern(
  member: t.Node | null | undefined,
  match: string | string[],
  allowPartial?: boolean,
): boolean {
  // not a member expression
  if (!isMemberExpression(member)) return false;

  const parts = Array.isArray(match) ? match : match.split(".");
  const nodes = [member.property];

  let node: t.Node = member.object;
  for (; isMemberExpression(node); node = node.object) {
    nodes.push(node.property);
  }
  nodes.push(node);

  if (nodes.length < parts.length) return false;
  if (!allowPartial && nodes.length > parts.length) return false;

  for (let i = 0, j = nodes.length - 1; i < parts.length; i++, j--) {
    const node = nodes[j];
    let value;
    if (isIdentifier(node)) {
      value = node.name;
    } else if (isStringLiteral(node)) {
      value = node.value;
    } else if (isThisExpression(node)) {
      value = "this";
    } else {
      return false;
    }

    if (parts[i] !== value) return false;
  }

  return true;
}
