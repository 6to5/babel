import {
  isBrowsersQueryValid,
  TargetNames,
} from "@babel/helper-compilation-targets";

import type {
  ConfigFileSearch,
  BabelrcSearch,
  IgnoreList,
  IgnoreItem,
  PluginList,
  PluginItem,
  PluginTarget,
  ConfigApplicableTest,
  SourceMapsOption,
  SourceTypeOption,
  CompactOption,
  RootInputSourceMapOption,
  NestingPath,
  CallerMetadata,
  RootMode,
  TargetsListOrObject,
  AssumptionName,
} from "./options.ts";

import { assumptionsNames } from "./options.ts";

export type { RootPath } from "./options.ts";

export type ValidatorSet = {
  [name: string]: Validator<any>;
};

export type Validator<T> = (loc: OptionPath, value: unknown) => T;

export function msg(loc: NestingPath | GeneralPath): string {
  switch (loc.type) {
    case "root":
      return ``;
    case "env":
      return `${msg(loc.parent)}.env["${loc.name}"]`;
    case "overrides":
      return `${msg(loc.parent)}.overrides[${loc.index}]`;
    case "option":
      return `${msg(loc.parent)}.${loc.name}`;
    case "access":
      return `${msg(loc.parent)}[${JSON.stringify(loc.name)}]`;
    default:
      // @ts-expect-error should not happen when code is type checked
      throw new Error(`Assertion failure: Unknown type ${loc.type}`);
  }
}

export function access(loc: GeneralPath, name: string | number): AccessPath {
  return {
    type: "access",
    name,
    parent: loc,
  };
}

export type OptionPath = Readonly<{
  type: "option";
  name: string;
  parent: NestingPath;
}>;
type AccessPath = Readonly<{
  type: "access";
  name: string | number;
  parent: GeneralPath;
}>;
type GeneralPath = OptionPath | AccessPath;

export function assertRootMode(
  loc: OptionPath,
  value: unknown,
): RootMode | void {
  if (
    value !== undefined &&
    value !== "root" &&
    value !== "upward" &&
    value !== "upward-optional"
  ) {
    throw new Error(
      `${msg(loc)} must be a "root", "upward", "upward-optional" or undefined`,
    );
  }
  // @ts-expect-error: TS can only narrow down the type when "strictNullCheck" is true
  return value;
}

export function assertSourceMaps(
  loc: OptionPath,
  value: unknown,
): SourceMapsOption | void {
  if (
    value !== undefined &&
    typeof value !== "boolean" &&
    value !== "inline" &&
    value !== "both"
  ) {
    throw new Error(
      `${msg(loc)} must be a boolean, "inline", "both", or undefined`,
    );
  }
  // @ts-expect-error: TS can only narrow down the type when "strictNullCheck" is true
  return value;
}

export function assertCompact(
  loc: OptionPath,
  value: unknown,
): CompactOption | void {
  if (value !== undefined && typeof value !== "boolean" && value !== "auto") {
    throw new Error(`${msg(loc)} must be a boolean, "auto", or undefined`);
  }
  // @ts-expect-error: TS can only narrow down the type when "strictNullCheck" is true
  return value;
}

export function assertSourceType(
  loc: OptionPath,
  value: unknown,
): SourceTypeOption | void {
  if (
    value !== undefined &&
    value !== "module" &&
    value !== "script" &&
    value !== "unambiguous"
  ) {
    throw new Error(
      `${msg(loc)} must be "module", "script", "unambiguous", or undefined`,
    );
  }
  // @ts-expect-error: TS can only narrow down the type when "strictNullCheck" is true
  return value;
}

export function assertCallerMetadata(
  loc: OptionPath,
  value: unknown,
): CallerMetadata | undefined {
  const obj = assertObject(loc, value);
  if (obj) {
    if (typeof obj.name !== "string") {
      throw new Error(
        `${msg(loc)} set but does not contain "name" property string`,
      );
    }

    for (const prop of Object.keys(obj)) {
      const propLoc = access(loc, prop);
      const value = obj[prop];
      if (
        value != null &&
        typeof value !== "boolean" &&
        typeof value !== "string" &&
        typeof value !== "number"
      ) {
        // NOTE(logan): I'm limiting the type here so that we can guarantee that
        // the "caller" value will serialize to JSON nicely. We can always
        // allow more complex structures later though.
        throw new Error(
          `${msg(
            propLoc,
          )} must be null, undefined, a boolean, a string, or a number.`,
        );
      }
    }
  }
  // @ts-expect-error todo(flow->ts)
  return value;
}

export function assertInputSourceMap(
  loc: OptionPath,
  value: unknown,
): RootInputSourceMapOption {
  if (
    value !== undefined &&
    typeof value !== "boolean" &&
    (typeof value !== "object" || !value)
  ) {
    throw new Error(`${msg(loc)} must be a boolean, object, or undefined`);
  }
  return value as RootInputSourceMapOption;
}

export function assertString(loc: GeneralPath, value: unknown): string | void {
  if (value !== undefined && typeof value !== "string") {
    throw new Error(`${msg(loc)} must be a string, or undefined`);
  }
  // @ts-expect-error: TS can only narrow down the type when "strictNullCheck" is true
  return value;
}

export function assertFunction(
  loc: GeneralPath,
  value: unknown,
): Function | void {
  if (value !== undefined && typeof value !== "function") {
    throw new Error(`${msg(loc)} must be a function, or undefined`);
  }
  // @ts-expect-error: TS can only narrow down the type when "strictNullCheck" is true
  return value;
}

export function assertBoolean(
  loc: GeneralPath,
  value: unknown,
): boolean | void {
  if (value !== undefined && typeof value !== "boolean") {
    throw new Error(`${msg(loc)} must be a boolean, or undefined`);
  }
  // @ts-expect-error: TS can only narrow down the type when "strictNullCheck" is true
  return value;
}

export function assertObject(
  loc: GeneralPath,
  value: unknown,
): { readonly [key: string]: unknown } | undefined {
  if (
    value !== undefined &&
    (typeof value !== "object" || Array.isArray(value) || !value)
  ) {
    throw new Error(`${msg(loc)} must be an object, or undefined`);
  }
  // @ts-expect-error todo(flow->ts) value is still typed as unknown, also assert function typically should not return a value
  return value;
}

export function assertArray<T>(
  loc: GeneralPath,
  value: Array<T> | undefined | null,
): ReadonlyArray<T> | undefined | null {
  if (value != null && !Array.isArray(value)) {
    throw new Error(`${msg(loc)} must be an array, or undefined`);
  }
  return value;
}

export function assertIgnoreList(
  loc: OptionPath,
  value: unknown[] | undefined,
): IgnoreList | void {
  const arr = assertArray(loc, value);
  arr?.forEach((item, i) => assertIgnoreItem(access(loc, i), item));
  // @ts-expect-error todo(flow->ts)
  return arr;
}
function assertIgnoreItem(loc: GeneralPath, value: unknown): IgnoreItem {
  if (
    typeof value !== "string" &&
    typeof value !== "function" &&
    !(value instanceof RegExp)
  ) {
    throw new Error(
      `${msg(
        loc,
      )} must be an array of string/Function/RegExp values, or undefined`,
    );
  }
  return value as IgnoreItem;
}

export function assertConfigApplicableTest(
  loc: OptionPath,
  value: unknown,
): ConfigApplicableTest | void {
  if (value === undefined) {
    // @ts-expect-error: TS can only narrow down the type when "strictNullCheck" is true
    return value;
  }

  if (Array.isArray(value)) {
    value.forEach((item, i) => {
      if (!checkValidTest(item)) {
        throw new Error(
          `${msg(access(loc, i))} must be a string/Function/RegExp.`,
        );
      }
    });
  } else if (!checkValidTest(value)) {
    throw new Error(
      `${msg(loc)} must be a string/Function/RegExp, or an array of those`,
    );
  }
  return value as ConfigApplicableTest;
}

function checkValidTest(value: unknown): value is string | Function | RegExp {
  return (
    typeof value === "string" ||
    typeof value === "function" ||
    value instanceof RegExp
  );
}

export function assertConfigFileSearch(
  loc: OptionPath,
  value: unknown,
): ConfigFileSearch | void {
  if (
    value !== undefined &&
    typeof value !== "boolean" &&
    typeof value !== "string"
  ) {
    throw new Error(
      `${msg(loc)} must be a undefined, a boolean, a string, ` +
        `got ${JSON.stringify(value)}`,
    );
  }
  // @ts-expect-error: TS can only narrow down the type when "strictNullCheck" is true
  return value;
}

export function assertBabelrcSearch(
  loc: OptionPath,
  value: unknown,
): BabelrcSearch | void {
  if (value === undefined || typeof value === "boolean") {
    // @ts-expect-error: TS can only narrow down the type when "strictNullCheck" is true
    return value;
  }

  if (Array.isArray(value)) {
    value.forEach((item, i) => {
      if (!checkValidTest(item)) {
        throw new Error(
          `${msg(access(loc, i))} must be a string/Function/RegExp.`,
        );
      }
    });
  } else if (!checkValidTest(value)) {
    throw new Error(
      `${msg(loc)} must be a undefined, a boolean, a string/Function/RegExp ` +
        `or an array of those, got ${JSON.stringify(value as any)}`,
    );
  }
  return value as BabelrcSearch;
}

export function assertPluginList(
  loc: OptionPath,
  value: unknown[] | null | undefined,
): PluginList | void {
  const arr = assertArray(loc, value);
  if (arr) {
    // Loop instead of using `.map` in order to preserve object identity
    // for plugin array for use during config chain processing.
    arr.forEach((item, i) => assertPluginItem(access(loc, i), item));
  }
  return arr as any;
}
function assertPluginItem(loc: GeneralPath, value: unknown): PluginItem {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      throw new Error(`${msg(loc)} must include an object`);
    }

    if (value.length > 3) {
      throw new Error(`${msg(loc)} may only be a two-tuple or three-tuple`);
    }

    assertPluginTarget(access(loc, 0), value[0]);

    if (value.length > 1) {
      const opts = value[1];
      if (
        opts !== undefined &&
        opts !== false &&
        (typeof opts !== "object" || Array.isArray(opts) || opts === null)
      ) {
        throw new Error(
          `${msg(access(loc, 1))} must be an object, false, or undefined`,
        );
      }
    }
    if (value.length === 3) {
      const name = value[2];
      if (name !== undefined && typeof name !== "string") {
        throw new Error(
          `${msg(access(loc, 2))} must be a string, or undefined`,
        );
      }
    }
  } else {
    assertPluginTarget(loc, value);
  }

  // @ts-expect-error todo(flow->ts)
  return value;
}
function assertPluginTarget(loc: GeneralPath, value: unknown): PluginTarget {
  if (
    (typeof value !== "object" || !value) &&
    typeof value !== "string" &&
    typeof value !== "function"
  ) {
    throw new Error(`${msg(loc)} must be a string, object, function`);
  }
  return value;
}

export function assertTargets(
  loc: GeneralPath,
  value: any,
): TargetsListOrObject {
  if (isBrowsersQueryValid(value)) return value;

  if (typeof value !== "object" || !value || Array.isArray(value)) {
    throw new Error(
      `${msg(loc)} must be a string, an array of strings or an object`,
    );
  }

  const browsersLoc = access(loc, "browsers");
  const esmodulesLoc = access(loc, "esmodules");

  assertBrowsersList(browsersLoc, value.browsers);
  assertBoolean(esmodulesLoc, value.esmodules);

  for (const key of Object.keys(value)) {
    const val = value[key];
    const subLoc = access(loc, key);

    if (key === "esmodules") assertBoolean(subLoc, val);
    else if (key === "browsers") assertBrowsersList(subLoc, val);
    else if (!Object.hasOwn(TargetNames, key)) {
      const validTargets = Object.keys(TargetNames).join(", ");
      throw new Error(
        `${msg(
          subLoc,
        )} is not a valid target. Supported targets are ${validTargets}`,
      );
    } else assertBrowserVersion(subLoc, val);
  }

  return value;
}

function assertBrowsersList(loc: GeneralPath, value: unknown) {
  if (value !== undefined && !isBrowsersQueryValid(value)) {
    throw new Error(
      `${msg(loc)} must be undefined, a string or an array of strings`,
    );
  }
}

function assertBrowserVersion(loc: GeneralPath, value: unknown) {
  if (typeof value === "number" && Math.round(value) === value) return;
  if (typeof value === "string") return;

  throw new Error(`${msg(loc)} must be a string or an integer number`);
}

export function assertAssumptions(
  loc: GeneralPath,
  value: { [key: string]: unknown },
): { [name: string]: boolean } | void {
  if (value === undefined) return;

  if (typeof value !== "object" || value === null) {
    throw new Error(`${msg(loc)} must be an object or undefined.`);
  }

  // todo(flow->ts): remove any
  let root: any = loc;
  do {
    root = root.parent;
  } while (root.type !== "root");
  const inPreset = root.source === "preset";

  for (const name of Object.keys(value)) {
    const subLoc = access(loc, name);
    if (!assumptionsNames.has(name as AssumptionName)) {
      throw new Error(`${msg(subLoc)} is not a supported assumption.`);
    }
    if (typeof value[name] !== "boolean") {
      throw new Error(`${msg(subLoc)} must be a boolean.`);
    }
    if (inPreset && value[name] === false) {
      throw new Error(
        `${msg(subLoc)} cannot be set to 'false' inside presets.`,
      );
    }
  }

  // @ts-expect-error todo(flow->ts)
  return value;
}
