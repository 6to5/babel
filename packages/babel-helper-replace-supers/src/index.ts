import type { File, NodePath, Scope } from "@babel/core";
import memberExpressionToFunctions from "@babel/helper-member-expression-to-functions";
import type { HandlerState } from "@babel/helper-member-expression-to-functions";
import optimiseCall from "@babel/helper-optimise-call-expression";
import { template, types as t } from "@babel/core";
import { visitors } from "@babel/traverse";
const {
  assignmentExpression,
  callExpression,
  cloneNode,
  identifier,
  memberExpression,
  sequenceExpression,
  stringLiteral,
  thisExpression,
} = t;

if (!process.env.BABEL_8_BREAKING && !USE_ESM && !IS_STANDALONE) {
  // eslint-disable-next-line no-restricted-globals
  exports.environmentVisitor = visitors.environmentVisitor({});
  // eslint-disable-next-line no-restricted-globals
  exports.skipAllButComputedKey = function skipAllButComputedKey(
    path: NodePath<t.Method | t.ClassProperty>,
  ) {
    path.skip();
    if (path.node.computed) {
      path.context.maybeQueue(path.get("key"));
    }
  };
}

const visitor = visitors.environmentVisitor<
  HandlerState<ReplaceState> & ReplaceState
>({
  Super(path, state) {
    const { node, parentPath } = path;
    if (!parentPath.isMemberExpression({ object: node })) return;
    state.handle(parentPath);
  },
});

const unshadowSuperBindingVisitor = visitors.environmentVisitor<{
  refName: string;
}>({
  Scopable(path, { refName }) {
    // https://github.com/Zzzen/babel/pull/1#pullrequestreview-564833183
    const binding = path.scope.getOwnBinding(refName);
    if (binding && binding.identifier.name === refName) {
      path.scope.rename(refName);
    }
  },
});

type SharedState = {
  file: File;
  scope: Scope;
  isDerivedConstructor: boolean;
  isStatic: boolean;
  isPrivateMethod: boolean;
  getObjectRef: () => t.Identifier;
  getSuperRef: () => t.Identifier;
  // we dont need boundGet here, but memberExpressionToFunctions handler needs it.
  boundGet: HandlerState["get"];
};

type Handler = HandlerState<SharedState> & SharedState;
type SuperMember = NodePath<
  t.MemberExpression & {
    object: t.Super;
    property: Exclude<t.MemberExpression["property"], t.PrivateName>;
  }
>;

const enum Flags {
  Prototype = 0b1,
  Call = 0b10,
}

interface SpecHandler
  extends Pick<
    Handler,
    | "memoise"
    | "get"
    | "set"
    | "destructureSet"
    | "call"
    | "optionalCall"
    | "delete"
  > {
  _get?(
    this: Handler & SpecHandler,
    superMember: SuperMember,
  ): t.CallExpression;
  _call?(
    this: Handler & SpecHandler,
    superMember: SuperMember,
    args: t.CallExpression["arguments"],
    optional: boolean,
  ): t.CallExpression | t.OptionalCallExpression;
  _getPrototypeOfExpression(this: Handler & SpecHandler): t.CallExpression;
  prop(this: Handler & SpecHandler, superMember: SuperMember): t.Expression;
}

const specHandlers: SpecHandler = {
  memoise(
    this: Handler & SpecHandler,
    superMember: SuperMember,
    count: number,
  ) {
    const { scope, node } = superMember;
    const { computed, property } = node;
    if (!computed) {
      return;
    }

    const memo = scope.maybeGenerateMemoised(property);
    if (!memo) {
      return;
    }

    this.memoiser.set(property, memo, count);
  },

  prop(this: Handler & SpecHandler, superMember: SuperMember) {
    const { computed, property } = superMember.node;
    if (this.memoiser.has(property)) {
      return cloneNode(this.memoiser.get(property));
    }

    if (computed) {
      return cloneNode(property);
    }

    return stringLiteral((property as t.Identifier).name);
  },

  /**
   * Creates an expression which result is the proto of objectRef.
   *
   * @example <caption>isStatic === true</caption>
   *
   *   helpers.getPrototypeOf(CLASS)
   *
   * @example <caption>isStatic === false</caption>
   *
   *   helpers.getPrototypeOf(CLASS.prototype)
   */
  _getPrototypeOfExpression(this: Handler & SpecHandler) {
    const objectRef = cloneNode(this.getObjectRef());
    const targetRef =
      this.isStatic || this.isPrivateMethod
        ? objectRef
        : memberExpression(objectRef, identifier("prototype"));

    return callExpression(this.file.addHelper("getPrototypeOf"), [targetRef]);
  },

  get(this: Handler & SpecHandler, superMember: SuperMember) {
    const objectRef = cloneNode(this.getObjectRef());
    return callExpression(this.file.addHelper("superPropGet"), [
      this.isDerivedConstructor
        ? sequenceExpression([thisExpression(), objectRef])
        : objectRef,
      this.prop(superMember),
      thisExpression(),
      ...(this.isStatic || this.isPrivateMethod
        ? []
        : [t.numericLiteral(Flags.Prototype)]),
    ]);
  },

  _call(
    this: Handler & SpecHandler,
    superMember: SuperMember,
    args: t.CallExpression["arguments"],
    optional: boolean,
  ): t.CallExpression | t.OptionalCallExpression {
    const objectRef = cloneNode(this.getObjectRef());
    let argsNode: t.ArrayExpression | t.Identifier;
    if (
      args.length === 1 &&
      t.isSpreadElement(args[0]) &&
      (t.isIdentifier(args[0].argument) ||
        t.isArrayExpression(args[0].argument))
    ) {
      argsNode = args[0].argument;
    } else {
      argsNode = t.arrayExpression(args as t.Expression[]);
    }

    const call = t.callExpression(this.file.addHelper("superPropGet"), [
      this.isDerivedConstructor
        ? sequenceExpression([thisExpression(), objectRef])
        : objectRef,
      this.prop(superMember),
      thisExpression(),
      t.numericLiteral(
        Flags.Call |
          (this.isStatic || this.isPrivateMethod ? 0 : Flags.Prototype),
      ),
    ]);
    if (optional) {
      return t.optionalCallExpression(call, [argsNode], true);
    }
    return callExpression(call, [argsNode]);
  },

  set(
    this: Handler & SpecHandler,
    superMember: SuperMember,
    value: t.Expression,
  ) {
    const objectRef = cloneNode(this.getObjectRef());

    return callExpression(this.file.addHelper("superPropSet"), [
      this.isDerivedConstructor
        ? sequenceExpression([thisExpression(), objectRef])
        : objectRef,
      this.prop(superMember),
      value,
      thisExpression(),
      t.numericLiteral(superMember.isInStrictMode() ? 1 : 0),
      ...(this.isStatic || this.isPrivateMethod ? [] : [t.numericLiteral(1)]),
    ]);
  },

  destructureSet(this: Handler & SpecHandler, superMember: SuperMember) {
    throw superMember.buildCodeFrameError(
      `Destructuring to a super field is not supported yet.`,
    );
  },

  call(
    this: Handler & SpecHandler,
    superMember: SuperMember,
    args: t.CallExpression["arguments"],
  ) {
    return this._call(superMember, args, false);
  },

  optionalCall(
    this: Handler & SpecHandler,
    superMember: SuperMember,
    args: t.CallExpression["arguments"],
  ) {
    return this._call(superMember, args, true);
  },

  delete(this: Handler & SpecHandler, superMember: SuperMember) {
    if (superMember.node.computed) {
      return sequenceExpression([
        callExpression(this.file.addHelper("toPropertyKey"), [
          cloneNode(superMember.node.property),
        ]),
        template.expression.ast`
          function () { throw new ReferenceError("'delete super[expr]' is invalid"); }()
        `,
      ]);
    } else {
      return template.expression.ast`
        function () { throw new ReferenceError("'delete super.prop' is invalid"); }()
      `;
    }
  },
};

const specHandlers_old: SpecHandler = {
  memoise(
    this: Handler & SpecHandler,
    superMember: SuperMember,
    count: number,
  ) {
    const { scope, node } = superMember;
    const { computed, property } = node;
    if (!computed) {
      return;
    }

    const memo = scope.maybeGenerateMemoised(property);
    if (!memo) {
      return;
    }

    this.memoiser.set(property, memo, count);
  },

  prop(this: Handler & SpecHandler, superMember: SuperMember) {
    const { computed, property } = superMember.node;
    if (this.memoiser.has(property)) {
      return cloneNode(this.memoiser.get(property));
    }

    if (computed) {
      return cloneNode(property);
    }

    return stringLiteral((property as t.Identifier).name);
  },

  /**
   * Creates an expression which result is the proto of objectRef.
   *
   * @example <caption>isStatic === true</caption>
   *
   *   helpers.getPrototypeOf(CLASS)
   *
   * @example <caption>isStatic === false</caption>
   *
   *   helpers.getPrototypeOf(CLASS.prototype)
   */
  _getPrototypeOfExpression(this: Handler & SpecHandler) {
    const objectRef = cloneNode(this.getObjectRef());
    const targetRef =
      this.isStatic || this.isPrivateMethod
        ? objectRef
        : memberExpression(objectRef, identifier("prototype"));

    return callExpression(this.file.addHelper("getPrototypeOf"), [targetRef]);
  },

  get(this: Handler & SpecHandler, superMember: SuperMember) {
    return this._get(superMember);
  },

  _get(this: Handler & SpecHandler, superMember: SuperMember) {
    const proto = this._getPrototypeOfExpression();
    return callExpression(this.file.addHelper("get"), [
      this.isDerivedConstructor
        ? sequenceExpression([thisExpression(), proto])
        : proto,
      this.prop(superMember),
      thisExpression(),
    ]);
  },

  set(
    this: Handler & SpecHandler,
    superMember: SuperMember,
    value: t.Expression,
  ) {
    const proto = this._getPrototypeOfExpression();

    return callExpression(this.file.addHelper("set"), [
      this.isDerivedConstructor
        ? sequenceExpression([thisExpression(), proto])
        : proto,
      this.prop(superMember),
      value,
      thisExpression(),
      t.booleanLiteral(superMember.isInStrictMode()),
    ]);
  },

  destructureSet(this: Handler & SpecHandler, superMember: SuperMember) {
    throw superMember.buildCodeFrameError(
      `Destructuring to a super field is not supported yet.`,
    );
  },

  call(
    this: Handler & SpecHandler,
    superMember: SuperMember,
    args: t.CallExpression["arguments"],
  ) {
    return optimiseCall(this._get(superMember), thisExpression(), args, false);
  },

  optionalCall(
    this: Handler & SpecHandler,
    superMember: SuperMember,
    args: t.CallExpression["arguments"],
  ) {
    return optimiseCall(
      this._get(superMember),
      cloneNode(thisExpression()),
      args,
      true,
    );
  },

  delete(this: Handler & SpecHandler, superMember: SuperMember) {
    if (superMember.node.computed) {
      return sequenceExpression([
        callExpression(this.file.addHelper("toPropertyKey"), [
          cloneNode(superMember.node.property),
        ]),
        template.expression.ast`
          function () { throw new ReferenceError("'delete super[expr]' is invalid"); }()
        `,
      ]);
    } else {
      return template.expression.ast`
        function () { throw new ReferenceError("'delete super.prop' is invalid"); }()
      `;
    }
  },
};

const looseHandlers = {
  ...specHandlers,

  prop(this: Handler & typeof specHandlers, superMember: SuperMember) {
    const { property } = superMember.node;
    if (this.memoiser.has(property)) {
      return cloneNode(this.memoiser.get(property));
    }

    return cloneNode(property);
  },

  get(this: Handler & typeof specHandlers, superMember: SuperMember) {
    const { isStatic, getSuperRef } = this;
    const { computed } = superMember.node;
    const prop = this.prop(superMember);

    let object;
    if (isStatic) {
      object =
        getSuperRef() ??
        memberExpression(identifier("Function"), identifier("prototype"));
    } else {
      object = memberExpression(
        getSuperRef() ?? identifier("Object"),
        identifier("prototype"),
      );
    }

    return memberExpression(object, prop, computed);
  },

  set(
    this: Handler & typeof specHandlers,
    superMember: SuperMember,
    value: t.Expression,
  ) {
    const { computed } = superMember.node;
    const prop = this.prop(superMember);

    return assignmentExpression(
      "=",
      memberExpression(thisExpression(), prop, computed),
      value,
    );
  },

  destructureSet(
    this: Handler & typeof specHandlers,
    superMember: SuperMember,
  ) {
    const { computed } = superMember.node;
    const prop = this.prop(superMember);

    return memberExpression(thisExpression(), prop, computed);
  },

  call(
    this: Handler & typeof specHandlers,
    superMember: SuperMember,
    args: t.CallExpression["arguments"],
  ) {
    return optimiseCall(this.get(superMember), thisExpression(), args, false);
  },

  optionalCall(
    this: Handler & typeof specHandlers,
    superMember: SuperMember,
    args: t.CallExpression["arguments"],
  ) {
    return optimiseCall(this.get(superMember), thisExpression(), args, true);
  },
};

type ReplaceSupersOptionsBase = {
  methodPath: NodePath<
    | t.ClassMethod
    | t.ClassProperty
    | t.ObjectMethod
    | t.ClassPrivateMethod
    | t.ClassPrivateProperty
    | t.StaticBlock
  >;
  constantSuper?: boolean;
  file: File;
  // objectRef might have been shadowed in child scopes,
  // in that case, we need to rename related variables.
  refToPreserve?: t.Identifier;
};

type ReplaceSupersOptions = ReplaceSupersOptionsBase &
  (
    | { objectRef?: undefined; getObjectRef: () => t.Node }
    | { objectRef: t.Node; getObjectRef?: undefined }
  ) &
  (
    | { superRef?: undefined; getSuperRef: () => t.Node }
    | { superRef: t.Node; getSuperRef?: undefined }
  );

interface ReplaceState {
  file: File;
  scope: Scope;
  isDerivedConstructor: boolean;
  isStatic: boolean;
  isPrivateMethod: boolean;
  getObjectRef: ReplaceSupers["getObjectRef"];
  getSuperRef: ReplaceSupers["getSuperRef"];
}

export default class ReplaceSupers {
  constructor(opts: ReplaceSupersOptions) {
    const path = opts.methodPath;

    this.methodPath = path;
    this.isDerivedConstructor =
      path.isClassMethod({ kind: "constructor" }) && !!opts.superRef;
    this.isStatic =
      path.isObjectMethod() ||
      // @ts-expect-error static is not in ClassPrivateMethod
      path.node.static ||
      path.isStaticBlock?.();
    this.isPrivateMethod = path.isPrivate() && path.isMethod();

    this.file = opts.file;
    this.constantSuper = process.env.BABEL_8_BREAKING
      ? opts.constantSuper
      : // Fallback to isLoose for backward compatibility
        (opts.constantSuper ?? (opts as any).isLoose);
    this.opts = opts;
  }

  declare file: File;
  declare isDerivedConstructor: boolean;
  declare constantSuper: boolean;
  declare isPrivateMethod: boolean;
  declare isStatic: boolean;
  declare methodPath: NodePath;
  declare opts: ReplaceSupersOptions;

  getObjectRef() {
    return cloneNode(this.opts.objectRef || this.opts.getObjectRef());
  }

  getSuperRef() {
    if (this.opts.superRef) return cloneNode(this.opts.superRef);
    if (this.opts.getSuperRef) {
      return cloneNode(this.opts.getSuperRef());
    }
  }

  replace() {
    const { methodPath } = this;
    // https://github.com/babel/babel/issues/11994
    if (this.opts.refToPreserve) {
      methodPath.traverse(unshadowSuperBindingVisitor, {
        refName: this.opts.refToPreserve.name,
      });
    }

    const handler = this.constantSuper
      ? looseHandlers
      : process.env.BABEL_8_BREAKING ||
          this.file.availableHelper("superPropSet")
        ? specHandlers
        : specHandlers_old;

    // todo: this should have been handled by the environmentVisitor,
    // consider add visitSelf support for the path.traverse
    // @ts-expect-error: Refine typings in packages/babel-traverse/src/types.ts
    // shouldSkip is accepted in traverseNode
    visitor.shouldSkip = (path: NodePath) => {
      if (path.parentPath === methodPath) {
        if (path.parentKey === "decorators" || path.parentKey === "key") {
          return true;
        }
      }
    };

    memberExpressionToFunctions<ReplaceState>(methodPath, visitor, {
      file: this.file,
      scope: this.methodPath.scope,
      isDerivedConstructor: this.isDerivedConstructor,
      isStatic: this.isStatic,
      isPrivateMethod: this.isPrivateMethod,
      getObjectRef: this.getObjectRef.bind(this),
      getSuperRef: this.getSuperRef.bind(this),
      // we dont need boundGet here, but memberExpressionToFunctions handler needs it.
      boundGet: handler.get,
      ...handler,
    });
  }
}
