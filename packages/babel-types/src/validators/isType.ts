import { FLIPPED_ALIAS_KEYS, ALIAS_KEYS } from "../definitions/index.ts";
import type * as t from "../index.ts";

export default function isType<T extends t.Node["type"]>(
  nodeType: string,
  targetType: T,
): nodeType is T;

export default function isType(
  nodeType: string | null | undefined,
  targetType: string,
): boolean;

/**
 * Test if a `nodeType` is a `targetType` or if `targetType` is an alias of `nodeType`.
 */
export default function isType(nodeType: string, targetType: string): boolean {
  if (nodeType === targetType) return true;

  // If nodeType is nullish, it can't be an alias of targetType.
  if (nodeType == null) return false;

  // This is a fast-path. If the test above failed, but an alias key is found, then the
  // targetType was a primary node type, so there's no need to check the aliases.
  // @ts-expect-error targetType may not index ALIAS_KEYS
  if (ALIAS_KEYS[targetType]) return false;

  const aliases: Array<string> | undefined = FLIPPED_ALIAS_KEYS[targetType];
  if (aliases?.includes(nodeType)) return true;

  return false;
}
