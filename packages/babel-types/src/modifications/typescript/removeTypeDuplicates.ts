import {
  isIdentifier,
  isThisExpression,
  isTSAnyKeyword,
  isTSTypeReference,
  isTSUnionType,
  isTSBaseType,
} from "../../validators/generated/index.ts";
import type * as t from "../../index.ts";

function getQualifiedName(node: t.TSTypeReference["typeName"]): string {
  return isIdentifier(node)
    ? node.name
    : isThisExpression(node)
      ? "this"
      : `${node.right.name}.${getQualifiedName(node.left)}`;
}

/**
 * Dedupe type annotations.
 */
export default function removeTypeDuplicates(
  nodesIn: ReadonlyArray<t.TSType>,
): Array<t.TSType> {
  const nodes = Array.from(nodesIn);

  const generics = new Map<string, t.TSTypeReference>();
  const bases = new Map<t.TSBaseType["type"], t.TSBaseType>();

  // store union type groups to circular references
  const typeGroups = new Set<t.TSType[]>();

  const types: t.TSType[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (!node) continue;

    // detect duplicates
    if (types.includes(node)) {
      continue;
    }

    // this type matches anything
    if (isTSAnyKeyword(node)) {
      return [node];
    }

    // Analogue of FlowBaseAnnotation
    if (isTSBaseType(node)) {
      bases.set(node.type, node);
      continue;
    }

    if (isTSUnionType(node)) {
      if (!typeGroups.has(node.types)) {
        nodes.push(...node.types);
        typeGroups.add(node.types);
      }
      continue;
    }

    // todo: support merging tuples: number[]
    const typeArgumentsKey = process.env.BABEL_8_BREAKING
      ? "typeArguments"
      : "typeParameters";
    // @ts-ignore(Babel 7 vs Babel 8) Babel 8 AST
    if (isTSTypeReference(node) && node[typeArgumentsKey]) {
      // @ts-ignore(Babel 7 vs Babel 8) Babel 8 AST
      const typeArguments = node[typeArgumentsKey];
      const name = getQualifiedName(node.typeName);

      if (generics.has(name)) {
        let existing: t.TypeScript = generics.get(name);
        // @ts-ignore(Babel 7 vs Babel 8) Babel 8 AST
        const existingTypeArguments = existing[typeArgumentsKey];
        if (existingTypeArguments) {
          existingTypeArguments.params.push(...typeArguments.params);
          existingTypeArguments.params = removeTypeDuplicates(
            existingTypeArguments.params,
          );
        } else {
          existing = typeArguments;
        }
      } else {
        generics.set(name, node);
      }

      continue;
    }

    types.push(node);
  }

  // add back in bases
  for (const [, baseType] of bases) {
    types.push(baseType);
  }

  // add back in generics
  for (const [, genericName] of generics) {
    types.push(genericName);
  }

  return types;
}
