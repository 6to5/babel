import * as virtualTypes from "./path/lib/virtual-types.ts";
import * as virtualTypesValidators from "./path/lib/virtual-types-validator.ts";
import type { Node } from "@babel/types";
import {
  DEPRECATED_KEYS,
  DEPRECATED_ALIASES,
  FLIPPED_ALIAS_KEYS,
  TYPES,
  __internal__deprecationWarning as deprecationWarning,
} from "@babel/types";
import type { ExplodedVisitor, NodePath, Visitor } from "./index.ts";
import type { ExplVisitNode, VisitNodeFunction, VisitPhase } from "./types.ts";
import { requeueComputedKeyAndDecorators } from "./path/context.ts";

type VIRTUAL_TYPES = keyof typeof virtualTypes;
function isVirtualType(type: string): type is VIRTUAL_TYPES {
  return type in virtualTypes;
}
export type VisitWrapper<S = any> = (
  stateName: string | undefined,
  visitorType: VisitPhase,
  callback: VisitNodeFunction<S, Node>,
) => VisitNodeFunction<S, Node>;

export function isExplodedVisitor(
  visitor: Visitor,
): visitor is ExplodedVisitor {
  // @ts-expect-error _exploded is not defined on non-exploded Visitor
  return visitor?._exploded;
}

// We need to name this function `explode$1` because otherwise rollup-plugin-dts
// will generate a `namespace traverse { var explode: typeof explode; }` when
// bundling @babel/traverse's index.d.ts.
// TODO: Just call it `explode` once https://github.com/Swatinem/rollup-plugin-dts/issues/307
// is fixed.
export { explode$1 as explode };
/**
 * explode() will take a visitor object with all of the various shorthands
 * that we support, and validates & normalizes it into a common format, ready
 * to be used in traversal
 *
 * The various shorthands are:
 * * `Identifier() { ... }` -> `Identifier: { enter() { ... } }`
 * * `"Identifier|NumericLiteral": { ... }` -> `Identifier: { ... }, NumericLiteral: { ... }`
 * * Aliases in `@babel/types`: e.g. `Property: { ... }` -> `ObjectProperty: { ... }, ClassProperty: { ... }`
 * Other normalizations are:
 * * Visitors of virtual types are wrapped, so that they are only visited when
 *   their dynamic check passes
 * * `enter` and `exit` functions are wrapped in arrays, to ease merging of
 *   visitors
 */
function explode$1<S>(visitor: Visitor<S>): ExplodedVisitor<S> {
  if (isExplodedVisitor(visitor)) return visitor;
  // @ts-expect-error `visitor` will be cast to ExplodedVisitor by this function
  visitor._exploded = true;

  // normalise pipes
  for (const nodeType of Object.keys(visitor) as (keyof Visitor)[]) {
    if (shouldIgnoreKey(nodeType)) continue;

    const parts: Array<string> = nodeType.split("|");
    if (parts.length === 1) continue;

    const fns = visitor[nodeType];
    delete visitor[nodeType];

    for (const part of parts) {
      // @ts-expect-error part will be verified by `verify` later
      visitor[part] = fns;
    }
  }

  // verify data structure
  verify$1(visitor);

  // make sure there's no __esModule type since this is because we're using loose mode
  // and it sets __esModule to be enumerable on all modules :(
  // @ts-expect-error ESModule interop
  delete visitor.__esModule;

  // ensure visitors are objects
  ensureEntranceObjects(visitor);

  // ensure enter/exit callbacks are arrays
  ensureCallbackArrays(visitor);

  // add type wrappers
  for (const nodeType of Object.keys(visitor)) {
    if (shouldIgnoreKey(nodeType)) continue;

    if (!isVirtualType(nodeType)) continue;

    // wrap all the functions
    const fns = visitor[nodeType];
    for (const type of Object.keys(fns)) {
      // @ts-expect-error normalised as VisitNodeObject
      fns[type] = wrapCheck(nodeType, fns[type]);
    }

    // clear it from the visitor
    delete visitor[nodeType];

    const types = virtualTypes[nodeType];
    if (types !== null) {
      for (const type of types) {
        // @ts-expect-error Expression produces too complex union
        visitor[type] ??= {};
        mergePair(visitor[type], fns);
      }
    } else {
      mergePair(visitor, fns);
    }
  }

  // add aliases
  for (const nodeType of Object.keys(visitor) as (keyof Visitor)[]) {
    if (shouldIgnoreKey(nodeType)) continue;

    let aliases = FLIPPED_ALIAS_KEYS[nodeType];

    if (nodeType in DEPRECATED_KEYS) {
      const deprecatedKey = DEPRECATED_KEYS[nodeType];
      deprecationWarning(nodeType, deprecatedKey, "Visitor ");
      aliases = [deprecatedKey];
    } else if (nodeType in DEPRECATED_ALIASES) {
      const deprecatedAlias =
        DEPRECATED_ALIASES[nodeType as keyof typeof DEPRECATED_ALIASES];
      deprecationWarning(nodeType, deprecatedAlias, "Visitor ");
      aliases = FLIPPED_ALIAS_KEYS[deprecatedAlias];
    }

    if (!aliases) continue;

    const fns = visitor[nodeType];
    // clear it from the visitor
    delete visitor[nodeType];

    for (const alias of aliases) {
      const existing = visitor[alias];
      if (existing) {
        mergePair(existing, fns);
      } else {
        visitor[alias] = { ...fns };
      }
    }
  }

  for (const nodeType of Object.keys(visitor)) {
    if (shouldIgnoreKey(nodeType)) continue;

    ensureCallbackArrays(
      // @ts-expect-error nodeType must present in visitor after previous validations
      visitor[nodeType],
    );
  }

  // @ts-expect-error explosion has been performed
  return visitor as ExplodedVisitor;
}

// We need to name this function `verify$1` because otherwise rollup-plugin-dts
// will generate a `namespace traverse { var verify: typeof verify; }` when
// bundling @babel/traverse's index.d.ts.
// TODO: Just call it `verify` once https://github.com/Swatinem/rollup-plugin-dts/issues/307
// is fixed.
export { verify$1 as verify };
function verify$1(visitor: Visitor) {
  // @ts-expect-error _verified is not defined on non-verified Visitor.
  // TODO: unify _verified and _exploded.
  if (visitor._verified) return;

  if (typeof visitor === "function") {
    throw new Error(
      "You passed `traverse()` a function when it expected a visitor object, " +
        "are you sure you didn't mean `{ enter: Function }`?",
    );
  }

  for (const nodeType of Object.keys(visitor) as (keyof Visitor)[]) {
    if (nodeType === "enter" || nodeType === "exit") {
      validateVisitorMethods(nodeType, visitor[nodeType]);
    }

    if (shouldIgnoreKey(nodeType)) continue;

    if (!TYPES.includes(nodeType)) {
      throw new Error(
        `You gave us a visitor for the node type ${nodeType} but it's not a valid type in @babel/traverse ${PACKAGE_JSON.version}`,
      );
    }

    const visitors = visitor[nodeType];
    if (typeof visitors === "object") {
      for (const visitorKey of Object.keys(visitors)) {
        if (visitorKey === "enter" || visitorKey === "exit") {
          // verify that it just contains functions
          validateVisitorMethods(
            `${nodeType}.${visitorKey}`,
            visitors[visitorKey],
          );
        } else {
          throw new Error(
            "You passed `traverse()` a visitor object with the property " +
              `${nodeType} that has the invalid property ${visitorKey}`,
          );
        }
      }
    }
  }

  // @ts-expect-error _verified is not defined on non-verified Visitor.
  // TODO: unify _verified and _exploded.
  visitor._verified = true;
}

function validateVisitorMethods(
  path: string,
  val: any,
): asserts val is Function | Function[] {
  const fns = [].concat(val);
  for (const fn of fns) {
    if (typeof fn !== "function") {
      throw new TypeError(
        `Non-function found defined in ${path} with type ${typeof fn}`,
      );
    }
  }
}

export function merge<State>(
  visitors: Visitor<State>[],
): ExplodedVisitor<State>;
export function merge(
  visitors: Visitor<unknown>[],
  states?: any[],
  wrapper?: Function | null,
): ExplodedVisitor<unknown>;
export function merge(
  visitors: any[],
  states: any[] = [],
  wrapper?: VisitWrapper | null,
): ExplodedVisitor {
  const mergedVisitor: ExplodedVisitor = { _verified: true, _exploded: true };
  if (!process.env.BABEL_8_BREAKING) {
    // For compatibility with old Babel versions, we must hide _verified and _exploded.
    // Otherwise, old versions of the validator will throw sayng that `true` is not
    // a function, because it tries to validate it as a visitor.
    Object.defineProperty(mergedVisitor, "_exploded", { enumerable: false });
    Object.defineProperty(mergedVisitor, "_verified", { enumerable: false });
  }

  for (let i = 0; i < visitors.length; i++) {
    const visitor = explode$1(visitors[i]);
    const state = states[i];

    let topVisitor: ExplVisitNode<unknown, Node> = visitor;
    if (state || wrapper) {
      topVisitor = wrapWithStateOrWrapper(topVisitor, state, wrapper);
    }
    mergePair(mergedVisitor, topVisitor);

    for (const key of Object.keys(visitor) as (keyof ExplodedVisitor)[]) {
      if (shouldIgnoreKey(key)) continue;

      let typeVisitor = visitor[key];

      // if we have state or wrapper then overload the callbacks to take it
      if (state || wrapper) {
        typeVisitor = wrapWithStateOrWrapper(typeVisitor, state, wrapper);
      }

      const nodeVisitor = (mergedVisitor[key] ||= {});
      mergePair(nodeVisitor, typeVisitor);
    }
  }

  return mergedVisitor;
}

function wrapWithStateOrWrapper<State>(
  oldVisitor: ExplVisitNode<State, Node>,
  state: State | null,
  wrapper?: VisitWrapper<State> | null,
): ExplVisitNode<State, Node> {
  const newVisitor: ExplVisitNode<State, Node> = {};

  for (const phase of ["enter", "exit"] as VisitPhase[]) {
    let fns = oldVisitor[phase];

    // not an enter/exit array of callbacks
    if (!Array.isArray(fns)) continue;

    fns = fns.map(function (fn) {
      let newFn = fn;

      if (state) {
        newFn = function (path: NodePath) {
          fn.call(state, path, state);
        };
      }

      if (wrapper) {
        // @ts-expect-error Fixme: actually PluginPass.key (aka pluginAlias)?
        newFn = wrapper(state?.key, phase, newFn);
      }

      // Override toString in case this function is printed, we want to print the wrapped function, same as we do in `wrapCheck`
      if (newFn !== fn) {
        newFn.toString = () => fn.toString();
      }

      return newFn;
    });

    newVisitor[phase] = fns;
  }

  return newVisitor;
}

function ensureEntranceObjects(obj: Visitor) {
  for (const key of Object.keys(obj) as (keyof Visitor)[]) {
    if (shouldIgnoreKey(key)) continue;

    const fns = obj[key];
    if (typeof fns === "function") {
      // @ts-expect-error: Expression produces a union type that is too complex to represent.
      obj[key] = { enter: fns };
    }
  }
}

function ensureCallbackArrays(obj: Visitor) {
  if (obj.enter && !Array.isArray(obj.enter)) obj.enter = [obj.enter];
  if (obj.exit && !Array.isArray(obj.exit)) obj.exit = [obj.exit];
}

function wrapCheck(nodeType: VIRTUAL_TYPES, fn: Function) {
  const fnKey = `is${nodeType}`;
  // @ts-expect-error we know virtualTypesValidators will contain `fnKey`, but TS doesn't
  const validator = virtualTypesValidators[fnKey];
  const newFn = function (this: unknown, path: NodePath) {
    if (validator.call(path)) {
      return fn.apply(this, arguments);
    }
  };
  newFn.toString = () => fn.toString();
  return newFn;
}

function shouldIgnoreKey(key: string): key is
  | `_${string}` // ` // Comment to fix syntax highlighting in vscode
  | "enter"
  | "exit"
  | "shouldSkip"
  | "denylist"
  | "noScope"
  | "skipKeys"
  | "blacklist" {
  // internal/hidden key
  if (key[0] === "_") return true;

  // ignore function keys
  if (key === "enter" || key === "exit" || key === "shouldSkip") return true;

  // ignore other options
  if (key === "denylist" || key === "noScope" || key === "skipKeys") {
    return true;
  }

  if (!process.env.BABEL_8_BREAKING) {
    if (key === "blacklist") {
      return true;
    }
  }

  return false;
}

/*
function mergePair(
  dest: ExplVisitNode<unknown, Node>,
  src: ExplVisitNode<unknown, Node>,
);
*/
function mergePair(dest: any, src: any) {
  for (const phase of ["enter", "exit"] as VisitPhase[]) {
    if (!src[phase]) continue;
    dest[phase] = [].concat(dest[phase] || [], src[phase]);
  }
}

// environmentVisitor should be used when traversing the whole class and not for specific class elements/methods.
// For perf reasons, the environmentVisitor might be traversed with `{ noScope: true }`, which means `path.scope` is undefined.
// Avoid using `path.scope` here
const _environmentVisitor: Visitor = {
  FunctionParent(path) {
    // arrows are not skipped because they inherit the context.
    if (path.isArrowFunctionExpression()) return;

    path.skip();
    if (path.isMethod()) {
      if (
        !process.env.BABEL_8_BREAKING &&
        !path.requeueComputedKeyAndDecorators
      ) {
        // See https://github.com/babel/babel/issues/16694
        requeueComputedKeyAndDecorators.call(path);
      } else {
        path.requeueComputedKeyAndDecorators();
      }
    }
  },
  Property(path) {
    if (path.isObjectProperty()) return;
    path.skip();
    if (
      !process.env.BABEL_8_BREAKING &&
      !path.requeueComputedKeyAndDecorators
    ) {
      // See https://github.com/babel/babel/issues/16694
      requeueComputedKeyAndDecorators.call(path);
    } else {
      path.requeueComputedKeyAndDecorators();
    }
  },
};

export function environmentVisitor<S>(visitor: Visitor<S>): Visitor<S> {
  return merge([_environmentVisitor, visitor]);
}
