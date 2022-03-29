import type * as t from "@babel/types";
import type { Scope } from "@babel/traverse";
import { types } from "@babel/core";
import type { File } from "@babel/core";
import { buildObjectExcludingKeys } from "@babel/plugin-transform-destructuring";
import { assignmentExpression, ObjectProperty } from "@babel/types";
const {
  binaryExpression,
  conditionalExpression,
  cloneNode,
  isObjectProperty,
  isPrivateName,
  memberExpression,
  numericLiteral,
  objectPattern,
  restElement,
  variableDeclarator,
  variableDeclaration,
  unaryExpression,
} = types;

function buildUndefinedNode() {
  return unaryExpression("void", numericLiteral(0));
}

function transformAssignmentPattern(
  initializer: t.Expression,
  tempId: t.Identifier,
) {
  return conditionalExpression(
    binaryExpression("===", cloneNode(tempId), buildUndefinedNode()),
    initializer,
    cloneNode(tempId),
  );
}

function initRestExcludingKeys(pattern: t.LVal): ExcludingKey[] | null {
  if (pattern.type === "ObjectPattern") {
    const { properties } = pattern;
    if (properties[properties.length - 1].type === "RestElement") {
      return [];
    }
  }
  return null;
}

/**
 * grow `excludingKeys` from given properties. This routine mutates properties by
 * memoising the computed non-static keys.
 *
 * @param {ExcludingKey[]} excludingKeys
 * @param {ObjectProperty[]} properties An array of object properties that should be excluded by rest element transform
 * @param {Scope} scope Where should we register the memoised id
 */
function growRestExcludingKeys(
  excludingKeys: ExcludingKey[],
  properties: ObjectProperty[],
  scope: Scope,
) {
  if (excludingKeys === null) return;
  for (const property of properties) {
    const propertyKey = property.key;
    if (property.computed && !scope.isStatic(propertyKey)) {
      const tempId = scope.generateDeclaredUidIdentifier("m");
      // @ts-expect-error A computed property key must not be a private name
      property.key = assignmentExpression("=", tempId, propertyKey);
      excludingKeys.push({ key: tempId, computed: true });
    } else if (propertyKey.type !== "PrivateName") {
      excludingKeys.push(property);
    }
  }
}

/**
 * Prepare var declarations for params. Only param initializers
 * will be transformed to undefined coalescing, other features are preserved.
 * This function does NOT mutate given AST structures.
 *
 * @export
 * @param {Function["params"]} params An array of function params
 * @param {Scope} scope A scope used to generate uid for function params
 * @returns {{ params: Identifier[]; variableDeclaration: VariableDeclaration }} An array of new id for params
 * and variable declaration to be prepended to the function body
 */
export function buildVariableDeclarationFromParams(
  params: t.Function["params"],
  scope: Scope,
): {
  params: (t.Identifier | t.RestElement)[];
  variableDeclaration: t.VariableDeclaration;
} {
  const { elements, transformed } = buildAssignmentsFromPatternList(
    params,
    scope,
    /* isAssignment */ false,
  );
  return {
    params: elements,
    variableDeclaration: variableDeclaration(
      "var",
      transformed.map(({ left, right }) => variableDeclarator(left, right)),
    ),
  };
}

interface Transformed {
  left: t.Identifier | t.Pattern | t.MemberExpression;
  right: t.Expression;
}

function buildAssignmentsFromPatternList(
  elements: (t.LVal | null)[],
  scope: Scope,
  isAssignment: boolean,
): {
  elements: (t.Identifier | t.RestElement | null)[];
  transformed: Transformed[];
} {
  const newElements: (t.Identifier | t.RestElement)[] = [],
    transformed = [];
  for (let element of elements) {
    if (element === null) {
      newElements.push(null);
      transformed.push(null);
      continue;
    }
    const tempId = scope.generateUidIdentifier("p");
    if (isAssignment) {
      scope.push({ id: cloneNode(tempId) });
    }
    if (element.type === "RestElement") {
      newElements.push(restElement(tempId));
      // The argument of a RestElement within a BindingPattern must be either Identifier or BindingPattern
      element = element.argument as t.Identifier | t.Pattern;
    } else {
      newElements.push(tempId);
    }
    if (element.type === "AssignmentPattern") {
      transformed.push({
        left: element.left,
        right: transformAssignmentPattern(element.right, tempId),
      });
    } else {
      transformed.push({
        left: element,
        right: cloneNode(tempId),
      });
    }
  }
  return { elements: newElements, transformed };
}

/**
 * A DFS simplified pattern traverser. It skips computed property keys and assignment pattern
 * initializers. The following-type path will be delegate to the visitor:
 * - ArrayPattern
 * - ArrayPattern elements
 * - AssignmentPattern
 * - ObjectPattern
 * - ObjectProperty
 * - RestElement
 * @param root
 * @param visitor
 */
export function* traversePattern(
  root: t.LVal,
  visitor: (
    node: t.LVal | t.ObjectProperty,
    index: number,
    depth: number,
  ) => Generator<any, void, any>,
) {
  const stack = [];
  stack.push({ node: root, index: 0, depth: 0 });
  let item: {
    node: t.LVal | t.ObjectProperty | null;
    index: number;
    depth: number;
  };
  while ((item = stack.pop()) !== undefined) {
    const { node, index } = item;
    if (node === null) continue;
    yield* visitor(node, index, item.depth);
    const depth = item.depth + 1;
    switch (node.type) {
      case "AssignmentPattern":
        stack.push({ node: node.left, index: 0, depth });
        break;
      case "ObjectProperty":
        // inherit the depth and index as an object property can not be an LHS without object pattern
        stack.push({ node: node.value, index, depth: item.depth });
        break;
      case "RestElement":
        stack.push({ node: node.argument, index: 0, depth });
        break;
      case "ObjectPattern":
        for (let list = node.properties, i = list.length - 1; i >= 0; i--) {
          stack.push({ node: list[i], index: i, depth });
        }
        break;
      case "ArrayPattern":
        for (let list = node.elements, i = list.length - 1; i >= 0; i--) {
          stack.push({ node: list[i], index: i, depth });
        }
        break;
      case "TSParameterProperty":
        throw new Error(
          `TypeScript parameter properties must first be transformed by ` +
            `@babel/plugin-transform-typescript.\n` +
            `If you have already enabled that plugin (or '@babel/preset-typescript'), make sure ` +
            `that it runs before @babel/plugin-proposal-destructuring-private.`,
        );
      default:
        break;
    }
  }
}

export function hasPrivateKeys(pattern: t.LVal) {
  return (
    traversePattern(pattern, function* (node) {
      if (isObjectProperty(node) && isPrivateName(node.key)) {
        yield;
      }
    }).next().done === false
  );
}

export function hasPrivateClassElement(node: t.ClassBody): boolean {
  return node.body.some(element =>
    isPrivateName(
      // @ts-expect-error: for those class element without `key`, they must
      // not be a private element
      element.key,
    ),
  );
}

/**
 * Traverse the given pattern and report the private key path.
 * A private key path is analagous to an array of `key` from the pattern NodePath
 * to the private key NodePath. See also test/util.skip-bundled.js for an example output
 *
 * @export
 * @param {t.LVal} pattern
 */
export function* privateKeyPathIterator(pattern: t.LVal) {
  const indexPath = [];
  yield* traversePattern(pattern, function* (node, index, depth) {
    indexPath[depth] = index;
    if (isObjectProperty(node)) {
      const propertyKey = node.key;
      if (isPrivateName(propertyKey)) {
        yield indexPath.slice(1, depth + 1);
      }
    }
  });
}

type LHS =
  | t.Identifier
  | t.MemberExpression
  | t.ArrayPattern
  | t.ObjectPattern
  | t.AssignmentPattern;

type ExcludingKey = {
  key: t.ObjectProperty["key"];
  computed: t.ObjectProperty["computed"];
};
type Item = {
  left: LHS;
  right: t.Expression;
  restExcludingKeys?: ExcludingKey[] | null;
};

function rightWillBeReferencedOnce(left: LHS) {
  switch (left.type) {
    // Skip memoising the right when left is an identifier or
    // an array pattern
    case "Identifier":
    case "ArrayPattern":
      return true;
    default:
      return false;
  }
}
/**
 * Transform private destructuring. It returns a generator
 * which yields a pair of transformed LHS and RHS, which can form VariableDeclaration or
 * AssignmentExpression later.
 *
 * @export
 * @param {LHS} left The root pattern
 * @param {t.Expression} right The initializer or the RHS of pattern
 * @param {Scope} scope The scope where memoized id should be registered
 * @param {boolean} isAssignment Whether we are transforming from an AssignmengExpression of VariableDeclaration
 * @returns {Generator<Transformed, void, void>}
 */
export function* transformPrivateKeyDestructuring(
  left: LHS,
  right: t.Expression,
  scope: Scope,
  isAssignment: boolean,
  addHelper: File["addHelper"],
  objectRestNoSymbols: boolean,
  useBuiltIns: boolean,
): Generator<Transformed, void, void> {
  const stack: Item[] = [];
  // The stack holds patterns that we don't known whether they contain private key
  stack.push({
    left,
    right,
    restExcludingKeys: initRestExcludingKeys(left),
  });
  let item: Item;
  while ((item = stack.pop()) !== undefined) {
    const { restExcludingKeys } = item;
    let { left, right } = item;
    const searchPrivateKey = privateKeyPathIterator(left).next();
    if (searchPrivateKey.done) {
      if (restExcludingKeys?.length > 0) {
        // optimize out the rest element because `objectWithoutProperties`
        // always return a new object
        // `{ ...z } = babelHelpers.objectWithoutProperties(m, ["x"])`
        // to
        // `z = babelHelpers.objectWithoutProperties(m, ["x"])`
        const { properties } = left as t.ObjectPattern;
        if (properties.length === 1) {
          // The argument of an object rest element must be an Identifier
          left = (properties[0] as t.RestElement).argument as t.Identifier;
        }
        yield {
          left: left as t.ObjectPattern,
          right: buildObjectExcludingKeys(
            restExcludingKeys,
            right,
            scope,
            addHelper,
            objectRestNoSymbols,
            useBuiltIns,
          ),
        };
      } else {
        yield { left, right };
      }
    } else {
      // now we need to split according to the indexPath;
      const indexPath = searchPrivateKey.value;
      let index;
      let isFirst = true;
      while (
        (index = indexPath.shift()) !== undefined ||
        left.type === "AssignmentPattern"
      ) {
        if (!rightWillBeReferencedOnce(left) && !scope.isStatic(right)) {
          const tempId = scope.generateUidIdentifier("m");
          if (isAssignment) {
            scope.push({ id: cloneNode(tempId) });
          }
          yield { left: tempId, right };
          right = cloneNode(tempId);
        }
        // invariant: at this point right must be a static identifier;
        switch (left.type) {
          case "ObjectPattern": {
            const { properties } = left;
            if (index > 0) {
              // properties[0, index) must not contain private keys
              const propertiesSlice = properties.slice(0, index);
              yield {
                left: objectPattern(propertiesSlice),
                right: cloneNode(right),
              };
            }
            if (index < properties.length - 1) {
              // for properties after `index`, push them to stack so we can process them later
              // inherit the restExcludingKeys on the stack if we are at
              // the first level, otherwise initialize a new restExcludingKeys
              const nextRestExcludingKeys = isFirst
                ? restExcludingKeys
                : initRestExcludingKeys(left);
              growRestExcludingKeys(
                nextRestExcludingKeys,
                // @ts-expect-error properties[0, index] must not contain rest element
                // because properties[index] contains a private key
                properties.slice(0, index + 1),
                scope,
              );
              stack.push({
                left: objectPattern(properties.slice(index + 1)),
                right: cloneNode(right),
                restExcludingKeys: nextRestExcludingKeys,
              });
            }
            // An object rest element must not contain a private key
            const property = properties[index] as t.ObjectProperty;
            // The value of ObjectProperty under ObjectPattern must be an LHS
            left = property.value as LHS;
            const { key } = property;
            const computed =
              property.computed ||
              // `{ 0: x } = RHS` is transformed to a computed member expression `x = RHS[0]`
              (key.type !== "Identifier" && key.type !== "PrivateName");
            right = memberExpression(right, key, computed);
            break;
          }
          case "AssignmentPattern": {
            right = transformAssignmentPattern(
              left.right,
              right as t.Identifier,
            );
            left = left.left;
            break;
          }
          case "ArrayPattern": {
            // todo: the transform here assumes that any expression within
            // the array pattern, when evluated, do not interfere with the iterable
            // in RHS. Otherwise we have to pause the iterable and interleave
            // the expressions.
            // See also https://gist.github.com/nicolo-ribaudo/f8ac7916f89450f2ead77d99855b2098
            const leftElements = left.elements;
            const leftElementsAfterIndex = leftElements.splice(index);
            const { elements, transformed } = buildAssignmentsFromPatternList(
              leftElementsAfterIndex,
              scope,
              isAssignment,
            );
            leftElements.push(...elements);
            yield { left, right: cloneNode(right) };
            // for elements after `index`, push them to stack so we can process them later
            for (let i = transformed.length - 1; i > 0; i--) {
              // skipping array holes
              if (transformed[i] !== null) {
                stack.push(transformed[i]);
              }
            }
            ({ left, right } = transformed[0]);
            break;
          }
          default:
            break;
        }
        isFirst = false;
      }
      stack.push({
        left,
        right,
        restExcludingKeys: initRestExcludingKeys(left),
      });
    }
  }
}
