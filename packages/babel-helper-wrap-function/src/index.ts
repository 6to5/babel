import type { NodePath } from "@babel/traverse";
import template from "@babel/template";
import {
  blockStatement,
  callExpression,
  functionExpression,
  isAssignmentPattern,
  isFunctionDeclaration,
  isRestElement,
  returnStatement,
  isCallExpression,
  cloneNode,
  toExpression,
  identifier,
  assignmentExpression,
  logicalExpression,
} from "@babel/types";
import type * as t from "@babel/types";

type ExpressionWrapperBuilder<ExtraBody extends t.Node[]> = (
  replacements?: Parameters<ReturnType<typeof template.expression>>[0],
) => t.CallExpression & {
  callee: t.FunctionExpression & {
    body: {
      body: [
        t.VariableDeclaration & {
          declarations: [
            { init: t.FunctionExpression | t.ArrowFunctionExpression },
          ];
        },
        ...ExtraBody,
      ];
    };
  };
};

const buildAnonymousExpressionWrapper = template.expression(`
  (function () {
    var REF = FUNCTION;
    return function NAME(PARAMS) {
      return REF.apply(this, arguments);
    };
  })()
`) as ExpressionWrapperBuilder<
  [t.ReturnStatement & { argument: t.FunctionExpression }]
>;

const buildNamedExpressionWrapper = template.expression(`
  (function () {
    var REF = FUNCTION;
    function NAME(PARAMS) {
      return REF.apply(this, arguments);
    }
    return NAME;
  })()
`) as ExpressionWrapperBuilder<
  [t.FunctionDeclaration, t.ReturnStatement & { argument: t.Identifier }]
>;

const buildDeclarationWrapper = template.statements(`
  function NAME(PARAMS) { return REF.apply(this, arguments); }
  function REF() {
    REF = FUNCTION;
    return REF.apply(this, arguments);
  }
`);

const buildWrapper = template.statement(`
  function NAME(PARAMS) {
    return CALL;
  }
`) as (
  replacements: Parameters<ReturnType<typeof template.expression>>[0],
) => t.FunctionDeclaration;

const wrappedFns = new WeakMap<t.CallExpression, t.Function>();

function markCallWrapped(path: NodePath<t.Function>) {
  wrappedFns.set(
    (path.get("body.body.0.argument") as NodePath<t.CallExpression>).node,
    (path.get("body.body.0.argument.callee") as NodePath<t.Function>).node,
  );
}

function classOrObjectMethod(
  path: NodePath<t.ClassMethod | t.ClassPrivateMethod | t.ObjectMethod>,
  callId: t.Expression,
) {
  const node = path.node;
  const body = node.body;

  const container = functionExpression(
    null,
    [],
    blockStatement(body.body),
    true,
  );
  body.body = [
    returnStatement(callExpression(callExpression(callId, [container]), [])),
  ];

  // Regardless of whether or not the wrapped function is a an async method
  // or generator the outer function should not be
  node.async = false;
  node.generator = false;

  // Unwrap the wrapper IIFE's environment so super and this and such still work.
  (
    path.get("body.body.0.argument.callee.arguments.0") as NodePath
  ).unwrapFunctionEnvironment();
}

function plainFunction(
  inPath: NodePath<Exclude<t.Function, t.Method>>,
  callId: t.Expression,
  noNewArrows: boolean,
  ignoreFunctionLength: boolean,
  hadName: boolean,
) {
  let path: NodePath<
    | t.FunctionDeclaration
    | t.FunctionExpression
    | t.CallExpression
    | t.ArrowFunctionExpression
  > = inPath;
  let node;
  let functionId = null;
  const nodeParams = inPath.node.params;

  if (path.isArrowFunctionExpression()) {
    if (process.env.BABEL_8_BREAKING) {
      path = path.arrowFunctionToExpression({ noNewArrows });
    } else {
      // arrowFunctionToExpression returns undefined in @babel/traverse < 7.18.10
      path = path.arrowFunctionToExpression({ noNewArrows }) ?? path;
    }
    node = path.node as
      | t.FunctionDeclaration
      | t.FunctionExpression
      | t.CallExpression;
  } else {
    node = path.node;
  }

  const isDeclaration = isFunctionDeclaration(node);

  let built = node;
  if (!isCallExpression(node)) {
    functionId = node.id;
    node.id = null;
    node.type = "FunctionExpression";
    built = callExpression(callId, [node as t.FunctionExpression]);
  }

  const params: t.Identifier[] = [];
  for (const param of nodeParams) {
    if (isAssignmentPattern(param) || isRestElement(param)) {
      break;
    }
    params.push(path.scope.generateUidIdentifier("x"));
  }

  const wrapperArgs = {
    NAME: functionId || null,
    // TODO: Use `functionId` rather than `hadName` for the condition
    REF: path.scope.generateUidIdentifier(hadName ? functionId.name : "ref"),
    FUNCTION: built,
    PARAMS: params,
  };

  if (isDeclaration) {
    const container = buildDeclarationWrapper(wrapperArgs);
    path.replaceWith(container[0]);
    path.insertAfter(container[1]);
  } else {
    let container;

    if (hadName) {
      container = buildNamedExpressionWrapper(wrapperArgs);
    } else {
      container = buildAnonymousExpressionWrapper(wrapperArgs);
    }

    if (functionId || (!ignoreFunctionLength && params.length)) {
      path.replaceWith(container);
    } else {
      // we can omit this wrapper as the conditions it protects for do not apply
      path.replaceWith(built);
    }
  }
}

export default function wrapFunction(
  path: NodePath<t.Function>,
  callId: t.Expression | (() => t.Expression),
  // TODO(Babel 8): Consider defaulting to false for spec compliance
  noNewArrows: boolean = true,
  ignoreFunctionLength: boolean = false,
  callAsync?: () => t.Expression,
) {
  if (callAsync) {
    if (path.isMethod()) {
      const node = path.node;
      const body = node.body;

      const container = functionExpression(
        null,
        [],
        blockStatement(body.body),
        true,
      );
      body.body = [returnStatement(callExpression(callAsync(), [container]))];

      // Regardless of whether or not the wrapped function is an async method
      // or generator the outer function should not be
      node.async = false;
      node.generator = false;

      // Unwrap the wrapper IIFE's environment so super and this and such still work.
      (
        path.get("body.body.0.argument.arguments.0") as NodePath
      ).unwrapFunctionEnvironment();
    } else {
      let node;
      let functionId = null;
      const nodeParams = path.node.params;

      if (path.isArrowFunctionExpression()) {
        let path2 = path.arrowFunctionToExpression({ noNewArrows });
        if (!process.env.BABEL_8_BREAKING) {
          // arrowFunctionToExpression returns undefined in @babel/traverse < 7.18.10
          path2 ??= path as unknown as NodePath<
            t.FunctionDeclaration | t.FunctionExpression | t.CallExpression
          >;
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        node = path2.node as
          | t.FunctionDeclaration
          | t.FunctionExpression
          | t.CallExpression;
      } else {
        node = path.node;
      }
      const isDeclaration = path.isFunctionDeclaration();

      let built = node;
      if (!isCallExpression(node)) {
        if (!isDeclaration) {
          if (!process.env.BABEL_8_BREAKING && !USE_ESM && !IS_STANDALONE) {
            // polyfill when being run by an older Babel version
            path.ensureFunctionName ??=
              // eslint-disable-next-line no-restricted-globals
              require("@babel/traverse").NodePath.prototype.ensureFunctionName;
          }

          if (!path.isCallExpression()) {
            // @ts-expect-error !isDeclaration check above
            path.ensureFunctionName(false);
          }
        }

        functionId = node.id;
        built = callExpression(callAsync(), [
          functionExpression(null, node.params, node.body, node.generator),
          identifier("this"),
          identifier("arguments"),
        ]);
      }

      const params: t.Identifier[] = [];
      for (const param of nodeParams) {
        if (isAssignmentPattern(param) || isRestElement(param)) {
          break;
        }
        params.push(path.scope.generateUidIdentifier("x"));
      }

      let wrapper: t.Function = buildWrapper({
        NAME: functionId,
        CALL: built,
        PARAMS: params,
      });

      if (!isDeclaration) {
        wrapper = toExpression(wrapper);
      }

      if (
        isDeclaration ||
        wrapper.id ||
        (!ignoreFunctionLength && params.length)
      ) {
        path.replaceWith(wrapper);
        markCallWrapped(path);
      } else {
        // we can omit this wrapper as the conditions it protects for do not apply
        path.replaceWith(
          callExpression((callId as () => t.Expression)(), [
            node as t.FunctionExpression,
          ]),
        );
      }
    }
    return;
  }

  if (path.isMethod()) {
    classOrObjectMethod(path, callId as t.Expression);
  } else {
    const hadName = "id" in path.node && !!path.node.id;
    if (!process.env.BABEL_8_BREAKING && !USE_ESM && !IS_STANDALONE) {
      // polyfill when being run by an older Babel version
      path.ensureFunctionName ??=
        // eslint-disable-next-line no-restricted-globals
        require("@babel/traverse").NodePath.prototype.ensureFunctionName;
    }
    // @ts-expect-error It is invalid to call this on an arrow expression,
    // but we'll convert it to a function expression anyway.
    path = path.ensureFunctionName(false);
    plainFunction(
      path as NodePath<Exclude<t.Function, t.Method>>,
      callId as t.Expression,
      noNewArrows,
      ignoreFunctionLength,
      hadName,
    );
  }
}

export function buildOnCallExpression(helperName: string) {
  return {
    CallExpression: {
      exit(path: NodePath<t.CallExpression>, state: any) {
        if (!state.availableHelper(helperName)) {
          return;
        }
        if (isCallExpression(path.parent)) {
          const wrappedFn = wrappedFns.get(path.parent);

          if (!wrappedFn || wrappedFn === path.node.callee) return;

          const fnPath = path.findParent(p => p.isFunction());

          if (
            fnPath
              .findParent(p => p.isLoop() || p.isFunction() || p.isClass())
              ?.isLoop() !== true
          ) {
            const ref = path.scope.generateUidIdentifier("ref");
            fnPath.parentPath.scope.push({
              id: ref,
            });
            const oldNode = path.node;
            const comments = path.node.leadingComments;
            if (comments) path.node.leadingComments = undefined;
            path.replaceWith(
              assignmentExpression(
                "=",
                cloneNode(ref),
                logicalExpression("||", cloneNode(ref), oldNode),
              ),
            );
            if (comments) oldNode.leadingComments = comments;
          }
        }
      },
    },
  };
}
