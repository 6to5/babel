import { PLACEHOLDERS_ALIAS } from "../definitions/index.ts";

/**
 * Test if a `placeholderType` is a `targetType` or if `targetType` is an alias of `placeholderType`.
 */
export default function isPlaceholderType(
  placeholderType: string,
  targetType: string,
): boolean {
  if (placeholderType === targetType) return true;

  const aliases: Array<string> | undefined =
    PLACEHOLDERS_ALIAS[placeholderType];
  if (aliases?.includes(targetType)) return true;

  return false;
}
