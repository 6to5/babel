import { declare } from "@babel/helper-plugin-utils";
import syntaxFlow from "@babel/plugin-syntax-flow";
import { types as t, type NodePath } from "@babel/core";

export interface Options {
  requireDirective?: boolean;
  allowDeclareFields?: boolean;
}

export default declare((api, opts: Options) => {
  api.assertVersion(REQUIRED_VERSION(7));

  const FLOW_DIRECTIVE = /@flow(?:\s+(?:strict(?:-local)?|weak))?|@noflow/;

  let skipStrip = false;

  const { requireDirective = false } = opts;

  if (!process.env.BABEL_8_BREAKING) {
    // eslint-disable-next-line no-var
    var { allowDeclareFields = false } = opts;
  }

  return {
    name: "transform-flow-strip-types",
    inherits: syntaxFlow,

    visitor: {
      Program(
        path,
        {
          file: {
            ast: { comments },
          },
        },
      ) {
        skipStrip = false;
        let directiveFound = false;

        if (comments) {
          for (const comment of comments) {
            if (FLOW_DIRECTIVE.test(comment.value)) {
              directiveFound = true;

              // remove flow directive
              comment.value = comment.value.replace(FLOW_DIRECTIVE, "");

              // remove the comment completely if it only consists of whitespace and/or stars
              if (!comment.value.replace(/\*/g, "").trim()) {
                comment.ignore = true;
              }
            }
          }
        }

        if (!directiveFound && requireDirective) {
          skipStrip = true;
        }
      },
      ImportDeclaration(path) {
        if (skipStrip) return;
        if (!path.node.specifiers.length) return;

        let typeCount = 0;

        // @ts-expect-error importKind is only in importSpecifier
        path.node.specifiers.forEach(({ importKind }) => {
          if (importKind === "type" || importKind === "typeof") {
            typeCount++;
          }
        });

        if (typeCount === path.node.specifiers.length) {
          path.remove();
        }
      },

      Flow(
        path: NodePath<
          t.Flow | t.ImportDeclaration | t.ExportDeclaration | t.ImportSpecifier
        >,
      ) {
        if (skipStrip) {
          throw path.buildCodeFrameError(
            "A @flow directive is required when using Flow annotations with " +
              "the `requireDirective` option.",
          );
        }

        path.remove();
      },

      ClassPrivateProperty(path) {
        if (skipStrip) return;
        path.node.typeAnnotation = null;
      },

      Class(path) {
        if (skipStrip) return;
        path.node.implements = null;

        // We do this here instead of in a `ClassProperty` visitor because the class transform
        // would transform the class before we reached the class property.
        path.get("body.body").forEach(child => {
          if (child.isClassProperty()) {
            const { node } = child;

            if (!process.env.BABEL_8_BREAKING) {
              if (!allowDeclareFields && node.declare) {
                throw child.buildCodeFrameError(
                  `The 'declare' modifier is only allowed when the ` +
                    `'allowDeclareFields' option of ` +
                    `@babel/plugin-transform-flow-strip-types or ` +
                    `@babel/preset-flow is enabled.`,
                );
              }
            }

            if (node.declare) {
              child.remove();
            } else {
              if (!process.env.BABEL_8_BREAKING) {
                if (!allowDeclareFields && !node.value && !node.decorators) {
                  child.remove();
                  return;
                }
              }

              node.variance = null;
              node.typeAnnotation = null;
            }
          }
        });
      },

      AssignmentPattern({ node }) {
        if (skipStrip) return;
        // @ts-expect-error optional is not in TSAsExpression
        if (node.left.optional) {
          // @ts-expect-error optional is not in TSAsExpression
          node.left.optional = false;
        }
      },

      Function({ node }) {
        if (skipStrip) return;
        if (
          node.params.length > 0 &&
          node.params[0].type === "Identifier" &&
          node.params[0].name === "this"
        ) {
          node.params.shift();
        }
        for (let i = 0; i < node.params.length; i++) {
          let param = node.params[i];
          if (param.type === "AssignmentPattern") {
            // @ts-expect-error: refine AST types, the left of an assignment pattern as a binding
            // must not be a MemberExpression
            param = param.left;
          }
          // @ts-expect-error optional is not in TSAsExpression
          if (param.optional) {
            // @ts-expect-error optional is not in TSAsExpression
            param.optional = false;
          }
        }

        if (!t.isMethod(node)) {
          node.predicate = null;
        }
      },

      TypeCastExpression(path) {
        if (skipStrip) return;
        let { node } = path;
        do {
          // @ts-expect-error node is a search pointer
          node = node.expression;
        } while (t.isTypeCastExpression(node));
        path.replaceWith(node);
      },

      CallExpression({ node }) {
        if (skipStrip) return;
        node.typeArguments = null;
      },

      JSXOpeningElement({ node }) {
        if (skipStrip) return;
        node.typeArguments = null;
      },

      OptionalCallExpression({ node }) {
        if (skipStrip) return;
        node.typeArguments = null;
      },

      NewExpression({ node }) {
        if (skipStrip) return;
        node.typeArguments = null;
      },
    },
  };
});
