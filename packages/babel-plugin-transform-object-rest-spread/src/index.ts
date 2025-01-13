import { declare } from "@babel/helper-plugin-utils";
import { types as t } from "@babel/core";
import type { PluginPass, NodePath, Scope } from "@babel/core";
import { convertFunctionParams } from "@babel/plugin-transform-parameters";
import { isRequired } from "@babel/helper-compilation-targets";
import shouldStoreRHSInTemporaryVariable from "./shouldStoreRHSInTemporaryVariable.ts";
import compatData from "./compat-data.ts";

const { isAssignmentPattern, isObjectProperty } = t;
// @babel/types <=7.3.3 counts FOO as referenced in var { x: FOO }.
// We need to detect this bug to know if "unused" means 0 or 1 references.
if (!process.env.BABEL_8_BREAKING) {
  const node = t.identifier("a");
  const property = t.objectProperty(t.identifier("key"), node);
  const pattern = t.objectPattern([property]);

  // eslint-disable-next-line no-var
  var ZERO_REFS = t.isReferenced(node, property, pattern) ? 1 : 0;
}

type Param = NodePath<t.Function["params"][number]>;
export interface Options {
  useBuiltIns?: boolean;
  loose?: boolean;
}

export default declare((api, opts: Options) => {
  api.assertVersion(REQUIRED_VERSION(7));

  const targets = api.targets();
  const supportsObjectAssign = !isRequired("Object.assign", targets, {
    compatData,
  });

  const { useBuiltIns = supportsObjectAssign, loose = false } = opts;

  if (typeof loose !== "boolean") {
    throw new Error(".loose must be a boolean, or undefined");
  }

  const ignoreFunctionLength = api.assumption("ignoreFunctionLength") ?? loose;
  const objectRestNoSymbols = api.assumption("objectRestNoSymbols") ?? loose;
  const pureGetters = api.assumption("pureGetters") ?? loose;
  const setSpreadProperties = api.assumption("setSpreadProperties") ?? loose;

  function getExtendsHelper(
    file: PluginPass,
  ): t.MemberExpression | t.Identifier {
    return useBuiltIns
      ? t.memberExpression(t.identifier("Object"), t.identifier("assign"))
      : file.addHelper("extends");
  }

  function hasRestElement(path: Param) {
    let foundRestElement = false;
    visitRestElements(path, restElement => {
      foundRestElement = true;
      restElement.stop();
    });
    return foundRestElement;
  }

  function hasObjectPatternRestElement(path: NodePath): boolean {
    let foundRestElement = false;
    visitRestElements(path, restElement => {
      if (restElement.parentPath.isObjectPattern()) {
        foundRestElement = true;
        restElement.stop();
      }
    });
    return foundRestElement;
  }

  function visitRestElements(
    path: NodePath,
    visitor: (path: NodePath<t.RestElement>) => any,
  ) {
    path.traverse({
      Expression(path) {
        const { parent, key } = path;
        if (
          (isAssignmentPattern(parent) && key === "right") ||
          (isObjectProperty(parent) && parent.computed && key === "key")
        ) {
          path.skip();
        }
      },
      RestElement: visitor,
    });
  }

  function hasSpread(node: t.ObjectExpression): boolean {
    for (const prop of node.properties) {
      if (t.isSpreadElement(prop)) {
        return true;
      }
    }
    return false;
  }

  // returns an array of all keys of an object, and a status flag indicating if all extracted keys
  // were converted to stringLiterals or not
  // e.g. extracts {keys: ["a", "b", "3", ++x], allPrimitives: false }
  // from ast of {a: "foo", b, 3: "bar", [++x]: "baz"}
  // `allPrimitives: false` doesn't necessarily mean that there is a non-primitive, but just
  // that we are not sure.
  function extractNormalizedKeys(node: t.ObjectPattern) {
    // RestElement has been removed in createObjectRest
    const props = node.properties as t.ObjectProperty[];
    const keys: t.Expression[] = [];
    let allPrimitives = true;
    let hasTemplateLiteral = false;

    for (const prop of props) {
      const { key } = prop;
      if (t.isIdentifier(key) && !prop.computed) {
        // since a key {a: 3} is equivalent to {"a": 3}, use the latter
        keys.push(t.stringLiteral(key.name));
      } else if (t.isTemplateLiteral(key)) {
        keys.push(t.cloneNode(key));
        hasTemplateLiteral = true;
      } else if (t.isLiteral(key)) {
        keys.push(
          t.stringLiteral(
            String(
              // @ts-expect-error prop.key can not be a NullLiteral
              key.value,
            ),
          ),
        );
      } else {
        // @ts-expect-error private name has been handled by destructuring-private
        keys.push(t.cloneNode(key));

        if (
          (t.isMemberExpression(key, { computed: false }) &&
            t.isIdentifier(key.object, { name: "Symbol" })) ||
          (t.isCallExpression(key) &&
            t.matchesPattern(key.callee, "Symbol.for"))
        ) {
          // there all return a primitive
        } else {
          allPrimitives = false;
        }
      }
    }

    return { keys, allPrimitives, hasTemplateLiteral };
  }

  // replaces impure computed keys with new identifiers
  // and returns variable declarators of these new identifiers
  function replaceImpureComputedKeys(
    properties: NodePath<t.ObjectProperty>[],
    scope: Scope,
  ) {
    const impureComputedPropertyDeclarators: t.VariableDeclarator[] = [];
    for (const propPath of properties) {
      // PrivateName is handled in destructuring-private plugin
      const key = propPath.get("key") as NodePath<t.Expression>;
      if (propPath.node.computed && !key.isPure()) {
        const name = scope.generateUidBasedOnNode(key.node);
        const declarator = t.variableDeclarator(t.identifier(name), key.node);
        impureComputedPropertyDeclarators.push(declarator);
        key.replaceWith(t.identifier(name));
      }
    }
    return impureComputedPropertyDeclarators;
  }

  function removeUnusedExcludedKeys(path: NodePath<t.ObjectPattern>): void {
    const bindings = path.getOuterBindingIdentifierPaths();

    Object.keys(bindings).forEach(bindingName => {
      const bindingParentPath = bindings[bindingName].parentPath;
      if (
        path.scope.getBinding(bindingName).references >
          (process.env.BABEL_8_BREAKING ? 0 : ZERO_REFS) ||
        !bindingParentPath.isObjectProperty()
      ) {
        return;
      }
      bindingParentPath.remove();
    });
  }

  //expects path to an object pattern
  function createObjectRest(
    path: NodePath<t.ObjectPattern>,
    file: PluginPass,
    objRef: t.Identifier | t.MemberExpression,
  ): [
    t.VariableDeclarator[],
    t.AssignmentExpression["left"],
    t.CallExpression,
  ] {
    const props = path.get("properties");
    const last = props[props.length - 1];
    t.assertRestElement(last.node);
    const restElement = t.cloneNode(last.node);
    last.remove();

    const impureComputedPropertyDeclarators = replaceImpureComputedKeys(
      path.get("properties") as NodePath<t.ObjectProperty>[],
      path.scope,
    );
    const { keys, allPrimitives, hasTemplateLiteral } = extractNormalizedKeys(
      path.node,
    );

    if (keys.length === 0) {
      return [
        impureComputedPropertyDeclarators,
        restElement.argument,
        t.callExpression(getExtendsHelper(file), [
          t.objectExpression([]),
          t.sequenceExpression([
            t.callExpression(file.addHelper("objectDestructuringEmpty"), [
              t.cloneNode(objRef),
            ]),
            t.cloneNode(objRef),
          ]),
        ]),
      ];
    }

    let keyExpression;
    if (!allPrimitives) {
      // map to toPropertyKey to handle the possible non-string values
      keyExpression = t.callExpression(
        t.memberExpression(t.arrayExpression(keys), t.identifier("map")),
        [file.addHelper("toPropertyKey")],
      );
    } else {
      keyExpression = t.arrayExpression(keys);

      if (!hasTemplateLiteral && !t.isProgram(path.scope.block)) {
        // Hoist definition of excluded keys, so that it's not created each time.
        const program = path.findParent(path => path.isProgram());
        const id = path.scope.generateUidIdentifier("excluded");

        program.scope.push({
          id,
          init: keyExpression,
          kind: "const",
        });

        keyExpression = t.cloneNode(id);
      }
    }

    return [
      impureComputedPropertyDeclarators,
      restElement.argument,
      t.callExpression(
        file.addHelper(
          `objectWithoutProperties${objectRestNoSymbols ? "Loose" : ""}`,
        ),
        [t.cloneNode(objRef), keyExpression],
      ),
    ];
  }

  function replaceRestElement(
    parentPath: NodePath<t.Function | t.CatchClause>,
    paramPath: NodePath<
      t.Function["params"][number] | t.AssignmentPattern["left"]
    >,
    container?: t.VariableDeclaration[],
  ): void {
    if (paramPath.isAssignmentPattern()) {
      replaceRestElement(parentPath, paramPath.get("left"), container);
      return;
    }

    if (paramPath.isArrayPattern() && hasRestElement(paramPath)) {
      const elements = paramPath.get("elements");

      for (let i = 0; i < elements.length; i++) {
        replaceRestElement(parentPath, elements[i], container);
      }
    }

    if (paramPath.isObjectPattern() && hasRestElement(paramPath)) {
      const uid = parentPath.scope.generateUidIdentifier("ref");

      const declar = t.variableDeclaration("let", [
        t.variableDeclarator(paramPath.node, uid),
      ]);

      if (container) {
        container.push(declar);
      } else {
        parentPath.ensureBlock();
        (parentPath.get("body") as NodePath<t.BlockStatement>).unshiftContainer(
          "body",
          declar,
        );
      }
      paramPath.replaceWith(t.cloneNode(uid));
    }
  }

  function isEvaluationValueIgnored(path: NodePath) {
    const last = <T>(arr: T[]) => arr[arr.length - 1];

    return (
      (t.isExpressionStatement(path.parent) && !path.isCompletionRecord()) ||
      (t.isSequenceExpression(path.parent) &&
        last(path.parent.expressions) !== path.node)
    );
  }

  return {
    name: "transform-object-rest-spread",
    manipulateOptions: process.env.BABEL_8_BREAKING
      ? undefined
      : (_, parser) => parser.plugins.push("objectRestSpread"),

    visitor: {
      // function a({ b, ...c }) {}
      Function(path) {
        const params = path.get("params");
        const paramsWithRestElement = new Set<number>();
        const idsInRestParams = new Set();
        for (let i = 0; i < params.length; ++i) {
          const param = params[i];
          if (hasRestElement(param)) {
            paramsWithRestElement.add(i);
            for (const name of Object.keys(param.getBindingIdentifiers())) {
              idsInRestParams.add(name);
            }
          }
        }

        // if true, a parameter exists that has an id in its initializer
        // that is also an id bound in a rest parameter
        // example: f({...R}, a = R)
        let idInRest = false;

        const IdentifierHandler = function (
          path: NodePath<t.Identifier>,
          functionScope: Scope,
        ) {
          const name = path.node.name;
          if (
            path.scope.getBinding(name) === functionScope.getBinding(name) &&
            idsInRestParams.has(name)
          ) {
            idInRest = true;
            path.stop();
          }
        };

        let i: number;
        for (i = 0; i < params.length && !idInRest; ++i) {
          const param = params[i];
          if (!paramsWithRestElement.has(i)) {
            if (param.isReferencedIdentifier() || param.isBindingIdentifier()) {
              IdentifierHandler(param, path.scope);
            } else {
              param.traverse(
                {
                  "Scope|TypeAnnotation|TSTypeAnnotation": path => path.skip(),
                  "ReferencedIdentifier|BindingIdentifier": IdentifierHandler,
                },
                path.scope,
              );
            }
          }
        }

        if (!idInRest) {
          for (let i = 0; i < params.length; ++i) {
            const param = params[i];
            if (paramsWithRestElement.has(i)) {
              replaceRestElement(path, param);
            }
          }
        } else {
          const shouldTransformParam = (idx: number) =>
            idx >= i - 1 || paramsWithRestElement.has(idx);
          convertFunctionParams(
            path,
            ignoreFunctionLength,
            shouldTransformParam,
            replaceRestElement,
          );
        }
      },

      // adapted from transform-destructuring/src/index.js#pushObjectRest
      // const { a, ...b } = c;
      VariableDeclarator(path, file) {
        if (!path.get("id").isObjectPattern()) {
          return;
        }

        let insertionPath = path;
        const originalPath = path;

        visitRestElements(path.get("id"), path => {
          if (!path.parentPath.isObjectPattern()) {
            // Return early if the parent is not an ObjectPattern, but
            // (for example) an ArrayPattern or Function, because that
            // means this RestElement is an not an object property.
            return;
          }

          if (
            // skip single-property case, e.g.
            // const { ...x } = foo();
            // since the RHS will not be duplicated
            shouldStoreRHSInTemporaryVariable(originalPath.node.id) &&
            !t.isIdentifier(originalPath.node.init)
          ) {
            // const { a, ...b } = foo();
            // to avoid calling foo() twice, as a first step convert it to:
            // const _foo = foo(),
            //       { a, ...b } = _foo;
            const initRef = path.scope.generateUidIdentifierBasedOnNode(
              originalPath.node.init,
              "ref",
            );
            // insert _foo = foo()
            originalPath.insertBefore(
              t.variableDeclarator(initRef, originalPath.node.init),
            );
            // replace foo() with _foo
            originalPath.replaceWith(
              t.variableDeclarator(originalPath.node.id, t.cloneNode(initRef)),
            );

            return;
          }

          let ref = originalPath.node.init;
          const refPropertyPath: NodePath<t.ObjectProperty>[] = [];
          let kind;

          path.findParent((path: NodePath): boolean => {
            if (path.isObjectProperty()) {
              refPropertyPath.unshift(path);
            } else if (path.isVariableDeclarator()) {
              kind = path.parentPath.node.kind;
              return true;
            }
          });

          const impureObjRefComputedDeclarators = replaceImpureComputedKeys(
            refPropertyPath,
            path.scope,
          );
          refPropertyPath.forEach(prop => {
            const { node } = prop;
            ref = t.memberExpression(
              ref,
              t.cloneNode(node.key),
              node.computed || t.isLiteral(node.key),
            );
          });

          //@ts-expect-error: findParent can not apply assertions on result shape
          const objectPatternPath: NodePath<t.ObjectPattern> = path.findParent(
            path => path.isObjectPattern(),
          );

          const [impureComputedPropertyDeclarators, argument, callExpression] =
            createObjectRest(
              objectPatternPath,
              file,
              ref as t.MemberExpression,
            );

          if (pureGetters) {
            removeUnusedExcludedKeys(objectPatternPath);
          }

          t.assertIdentifier(argument);

          insertionPath.insertBefore(impureComputedPropertyDeclarators);

          insertionPath.insertBefore(impureObjRefComputedDeclarators);

          insertionPath = insertionPath.insertAfter(
            t.variableDeclarator(argument, callExpression),
          )[0] as NodePath<t.VariableDeclarator>;

          path.scope.registerBinding(kind, insertionPath);

          if (objectPatternPath.node.properties.length === 0) {
            objectPatternPath
              .findParent(
                path => path.isObjectProperty() || path.isVariableDeclarator(),
              )
              .remove();
          }
        });
      },

      // taken from transform-destructuring/src/index.js#visitor
      // export var { a, ...b } = c;
      ExportNamedDeclaration(path) {
        const declaration = path.get("declaration");
        if (!declaration.isVariableDeclaration()) return;

        const hasRest = declaration
          .get("declarations")
          .some(path => hasObjectPatternRestElement(path.get("id")));
        if (!hasRest) return;

        const specifiers = [];

        for (const name of Object.keys(path.getOuterBindingIdentifiers(true))) {
          specifiers.push(
            t.exportSpecifier(t.identifier(name), t.identifier(name)),
          );
        }

        // Split the declaration and export list into two declarations so that the variable
        // declaration can be split up later without needing to worry about not being a
        // top-level statement.
        path.replaceWith(declaration.node);
        path.insertAfter(t.exportNamedDeclaration(null, specifiers));
      },

      // try {} catch ({a, ...b}) {}
      CatchClause(path) {
        const paramPath = path.get("param");
        replaceRestElement(path, paramPath);
      },

      // ({a, ...b} = c);
      AssignmentExpression(path, file) {
        const leftPath = path.get("left");
        if (leftPath.isObjectPattern() && hasRestElement(leftPath)) {
          const nodes = [];

          const { right } = path.node;

          let refName;
          if (t.isIdentifier(right) && path.scope.hasBinding(right.name)) {
            refName = right.name;
          } else {
            refName = path.scope.generateUidBasedOnNode(path.node.right, "ref");
            path.scope.push({
              id: t.identifier(refName),
            });
            nodes.push(
              t.assignmentExpression(
                "=",
                t.identifier(refName),
                path.node.right,
              ),
            );
          }

          const [impureComputedPropertyDeclarators, argument, callExpression] =
            createObjectRest(leftPath, file, t.identifier(refName));

          if (impureComputedPropertyDeclarators.length > 0) {
            impureComputedPropertyDeclarators.forEach(declarator => {
              path.scope.push({ id: declarator.id as t.Identifier });
              nodes.push(
                t.assignmentExpression(
                  "=",
                  t.cloneNode(declarator.id),
                  declarator.init,
                ),
              );
            });
          }

          const nodeWithoutSpread = t.cloneNode(path.node);
          nodeWithoutSpread.right = t.identifier(refName);
          nodes.push(nodeWithoutSpread);
          nodes.push(t.assignmentExpression("=", argument, callExpression));

          if (!isEvaluationValueIgnored(path)) {
            nodes.push(t.identifier(refName));
          }

          path.replaceWith(t.sequenceExpression(nodes));
        }
      },

      // taken from transform-destructuring/src/index.js#visitor
      ForXStatement(path: NodePath<t.ForXStatement>) {
        const { node, scope } = path;
        const leftPath = path.get("left");
        const left = node.left;

        if (!hasObjectPatternRestElement(leftPath)) {
          return;
        }

        if (!t.isVariableDeclaration(left)) {
          // for ({a, ...b} of []) {}
          const temp = scope.generateUidIdentifier("ref");

          node.left = t.variableDeclaration("var", [
            t.variableDeclarator(temp),
          ]);

          path.ensureBlock();
          const body = path.node.body as t.BlockStatement;

          if (body.body.length === 0 && path.isCompletionRecord()) {
            body.body.unshift(
              t.expressionStatement(scope.buildUndefinedNode()),
            );
          }

          body.body.unshift(
            t.expressionStatement(
              t.assignmentExpression("=", left, t.cloneNode(temp)),
            ),
          );
        } else {
          // for (var {a, ...b} of []) {}
          const pattern = left.declarations[0].id;

          const key = scope.generateUidIdentifier("ref");
          node.left = t.variableDeclaration(left.kind, [
            t.variableDeclarator(key, null),
          ]);

          path.ensureBlock();
          const body = node.body as t.BlockStatement;

          body.body.unshift(
            t.variableDeclaration(node.left.kind, [
              t.variableDeclarator(pattern, t.cloneNode(key)),
            ]),
          );
        }
      },

      // [{a, ...b}] = c;
      ArrayPattern(path) {
        const objectPatterns: t.VariableDeclarator[] = [];

        visitRestElements(path, path => {
          if (!path.parentPath.isObjectPattern()) {
            // Return early if the parent is not an ObjectPattern, but
            // (for example) an ArrayPattern or Function, because that
            // means this RestElement is an not an object property.
            return;
          }

          const objectPattern = path.parentPath;

          const uid = path.scope.generateUidIdentifier("ref");
          objectPatterns.push(t.variableDeclarator(objectPattern.node, uid));

          objectPattern.replaceWith(t.cloneNode(uid));
          path.skip();
        });

        if (objectPatterns.length > 0) {
          const statementPath = path.getStatementParent();
          const statementNode = statementPath.node;
          const kind =
            statementNode.type === "VariableDeclaration"
              ? statementNode.kind
              : "var";
          statementPath.insertAfter(
            t.variableDeclaration(kind, objectPatterns),
          );
        }
      },

      // var a = { ...b, ...c }
      ObjectExpression(path, file) {
        if (!hasSpread(path.node)) return;

        let helper: t.Identifier | t.MemberExpression;
        if (setSpreadProperties) {
          helper = getExtendsHelper(file);
        } else {
          if (process.env.BABEL_8_BREAKING) {
            helper = file.addHelper("objectSpread2");
          } else {
            try {
              helper = file.addHelper("objectSpread2");
            } catch {
              // TODO: This is needed to workaround https://github.com/babel/babel/issues/10187
              // and https://github.com/babel/babel/issues/10179 for older @babel/core versions
              // where #10187 isn't fixed.
              this.file.declarations["objectSpread2"] = null;

              // objectSpread2 has been introduced in v7.5.0
              // We have to maintain backward compatibility.
              helper = file.addHelper("objectSpread");
            }
          }
        }

        let exp: t.CallExpression = null;
        let props: t.ObjectMember[] = [];

        function make() {
          const hadProps = props.length > 0;
          const obj = t.objectExpression(props);
          props = [];

          if (!exp) {
            exp = t.callExpression(helper, [obj]);
            return;
          }

          // When we can assume that getters are pure and don't depend on
          // the order of evaluation, we can avoid making multiple calls.
          if (pureGetters) {
            if (hadProps) {
              exp.arguments.push(obj);
            }
            return;
          }

          exp = t.callExpression(t.cloneNode(helper), [
            exp,
            // If we have static props, we need to insert an empty object
            // because the odd arguments are copied with [[Get]], not
            // [[GetOwnProperty]]
            ...(hadProps ? [t.objectExpression([]), obj] : []),
          ]);
        }

        for (const prop of path.node.properties) {
          if (t.isSpreadElement(prop)) {
            make();
            exp.arguments.push(prop.argument);
          } else {
            props.push(prop);
          }
        }

        if (props.length) make();

        path.replaceWith(exp);
      },
    },
  };
});
