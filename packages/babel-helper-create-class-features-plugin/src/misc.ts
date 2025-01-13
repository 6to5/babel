import { template, types as t } from "@babel/core";
import type { File, NodePath, Scope, Visitor } from "@babel/core";
import { visitors } from "@babel/traverse";

const findBareSupers = visitors.environmentVisitor<
  NodePath<t.CallExpression>[]
>({
  Super(path) {
    const { node, parentPath } = path;
    if (parentPath.isCallExpression({ callee: node })) {
      this.push(parentPath);
    }
  },
});

const referenceVisitor: Visitor<{ scope: Scope }> = {
  "TSTypeAnnotation|TypeAnnotation"(
    path: NodePath<t.TSTypeAnnotation | t.TypeAnnotation>,
  ) {
    path.skip();
  },

  ReferencedIdentifier(path: NodePath<t.Identifier>, { scope }) {
    if (scope.hasOwnBinding(path.node.name)) {
      scope.rename(path.node.name);
      path.skip();
    }
  },
};

type HandleClassTDZState = {
  classBinding: Scope.Binding;
  file: File;
};

function handleClassTDZ(
  path: NodePath<t.Identifier>,
  state: HandleClassTDZState,
) {
  if (
    state.classBinding &&
    state.classBinding === path.scope.getBinding(path.node.name)
  ) {
    const classNameTDZError = state.file.addHelper("classNameTDZError");
    const throwNode = t.callExpression(classNameTDZError, [
      t.stringLiteral(path.node.name),
    ]);

    path.replaceWith(t.sequenceExpression([throwNode, path.node]));
    path.skip();
  }
}

const classFieldDefinitionEvaluationTDZVisitor: Visitor<HandleClassTDZState> = {
  ReferencedIdentifier: handleClassTDZ,
  "TSTypeReference|TSExpressionWithTypeArguments|TSTypeQuery|TSQualifiedName"(
    path,
  ) {
    path.skip();
  },
};

interface RenamerState {
  scope: Scope;
}

export function injectInitialization(
  path: NodePath<t.Class>,
  constructor: NodePath<t.ClassMethod> | undefined,
  nodes: t.ExpressionStatement[],
  renamer?: (visitor: Visitor<RenamerState>, state: RenamerState) => void,
  lastReturnsThis?: boolean,
) {
  if (!nodes.length) return;

  const isDerived = !!path.node.superClass;

  if (!constructor) {
    const newConstructor = t.classMethod(
      "constructor",
      t.identifier("constructor"),
      [],
      t.blockStatement([]),
    );

    if (isDerived) {
      newConstructor.params = [t.restElement(t.identifier("args"))];
      newConstructor.body.body.push(template.statement.ast`super(...args)`);
    }

    [constructor] = path
      .get("body")
      .unshiftContainer("body", newConstructor) as NodePath<t.ClassMethod>[];
  }

  if (renamer) {
    renamer(referenceVisitor, { scope: constructor.scope });
  }

  if (isDerived) {
    const bareSupers: NodePath<t.CallExpression>[] = [];
    constructor.traverse(findBareSupers, bareSupers);
    let isFirst = true;
    for (const bareSuper of bareSupers) {
      if (isFirst) {
        isFirst = false;
      } else {
        nodes = nodes.map(n => t.cloneNode(n));
      }
      if (!bareSuper.parentPath.isExpressionStatement()) {
        const allNodes: t.Expression[] = [
          bareSuper.node,
          ...nodes.map(n => t.toExpression(n)),
        ];
        if (!lastReturnsThis) allNodes.push(t.thisExpression());
        bareSuper.replaceWith(t.sequenceExpression(allNodes));
      } else {
        bareSuper.insertAfter(nodes);
      }
    }
  } else {
    constructor.get("body").unshiftContainer("body", nodes);
  }
}

type ComputedKeyAssignmentExpression = t.AssignmentExpression & {
  left: t.Identifier;
};

/**
 * Try to memoise a computed key.
 * It returns undefined when the computed key is an uid reference, otherwise
 * an assignment expression `memoiserId = computed key`
 * @export
 * @param {t.Expression} keyNode Computed key
 * @param {Scope} scope The scope where memoiser id should be registered
 * @param {string} hint The memoiser id hint
 * @returns {(ComputedKeyAssignmentExpression | undefined)}
 */
export function memoiseComputedKey(
  keyNode: t.Expression,
  scope: Scope,
  hint: string,
): ComputedKeyAssignmentExpression | undefined {
  const isUidReference = t.isIdentifier(keyNode) && scope.hasUid(keyNode.name);
  if (isUidReference) {
    return;
  }
  const isMemoiseAssignment =
    t.isAssignmentExpression(keyNode, { operator: "=" }) &&
    t.isIdentifier(keyNode.left) &&
    scope.hasUid(keyNode.left.name);
  if (isMemoiseAssignment) {
    return t.cloneNode(keyNode as ComputedKeyAssignmentExpression);
  } else {
    const ident = t.identifier(hint);
    // Declaring in the same block scope
    // Ref: https://github.com/babel/babel/pull/10029/files#diff-fbbdd83e7a9c998721c1484529c2ce92
    scope.push({
      id: ident,
      kind: "let",
    });
    return t.assignmentExpression(
      "=",
      t.cloneNode(ident),
      keyNode,
    ) as ComputedKeyAssignmentExpression;
  }
}

export function extractComputedKeys(
  path: NodePath<t.Class>,
  computedPaths: NodePath<t.ClassProperty | t.ClassMethod>[],
  file: File,
) {
  const { scope } = path;
  const declarations: t.ExpressionStatement[] = [];
  const state = {
    classBinding: path.node.id && scope.getBinding(path.node.id.name),
    file,
  };
  for (const computedPath of computedPaths) {
    const computedKey = computedPath.get("key");
    if (computedKey.isReferencedIdentifier()) {
      handleClassTDZ(computedKey, state);
    } else {
      computedKey.traverse(classFieldDefinitionEvaluationTDZVisitor, state);
    }

    const computedNode = computedPath.node;
    // Make sure computed property names are only evaluated once (upon class definition)
    // and in the right order in combination with static properties
    if (!computedKey.isConstantExpression()) {
      const assignment = memoiseComputedKey(
        computedKey.node,
        scope,
        scope.generateUidBasedOnNode(computedKey.node),
      );
      if (assignment) {
        declarations.push(t.expressionStatement(assignment));
        computedNode.key = t.cloneNode(assignment.left);
      }
    }
  }

  return declarations;
}
