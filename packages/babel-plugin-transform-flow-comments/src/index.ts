import { declare } from "@babel/helper-plugin-utils";
import syntaxFlow from "@babel/plugin-syntax-flow";
import { types as t, type NodePath } from "@babel/core";
import generateCode from "@babel/generator";

export default declare(api => {
  api.assertVersion(REQUIRED_VERSION(7));

  function commentFromString(comment: string | t.Comment): t.Comment {
    return typeof comment === "string"
      ? { type: "CommentBlock", value: comment }
      : comment;
  }

  function attachComment({
    ofPath,
    toPath,
    where = "trailing",
    optional = false,
    comments = generateComment(ofPath, optional),
    keepType = false,
  }: {
    ofPath?: NodePath;
    toPath?: NodePath;
    where?: t.CommentTypeShorthand;
    optional?: boolean;
    comments?: string | t.Comment | (string | t.Comment)[];
    keepType?: boolean;
  }) {
    if (!toPath?.node) {
      toPath = ofPath.getPrevSibling();
      where = "trailing";
    }
    if (!toPath.node) {
      toPath = ofPath.getNextSibling();
      where = "leading";
    }
    if (!toPath.node) {
      toPath = ofPath.parentPath;
      where = "inner";
    }
    if (!Array.isArray(comments)) {
      comments = [comments];
    }
    const newComments = comments.map(commentFromString);
    if (!keepType && ofPath?.node) {
      // Removes the node at `ofPath` while conserving the comments attached
      // to it.
      const node = ofPath.node;
      const parent = ofPath.parentPath;
      const prev = ofPath.getPrevSibling();
      const next = ofPath.getNextSibling();
      const isSingleChild = !(prev.node || next.node);
      const leading = node.leadingComments;
      const trailing = node.trailingComments;

      if (isSingleChild && leading) {
        parent.addComments("inner", leading);
      }
      toPath.addComments(where, newComments);
      ofPath.remove();
      if (isSingleChild && trailing) {
        parent.addComments("inner", trailing);
      }
    } else {
      toPath.addComments(where, newComments);
    }
  }

  function wrapInFlowComment<
    N extends
      | t.ClassProperty
      | t.ExportNamedDeclaration
      | t.Flow
      | t.ImportDeclaration
      | t.ExportDeclaration
      | t.ImportSpecifier
      | t.ImportDeclaration,
  >(path: NodePath<N>) {
    attachComment({
      ofPath: path,
      // @ts-expect-error optional may not exist in path.parent
      comments: generateComment(path, path.parent.optional),
    });
  }

  function generateComment(path: NodePath, optional?: boolean | void) {
    let comment = path
      .getSource()
      .replace(/\*-\//g, "*-ESCAPED/")
      .replace(/\*\//g, "*-/");
    if (optional) comment = "?" + comment;
    if (comment[0] !== ":") comment = ":: " + comment;
    return comment;
  }

  function isTypeImport(importKind: "type" | "typeof" | "value") {
    return importKind === "type" || importKind === "typeof";
  }

  return {
    name: "transform-flow-comments",
    inherits: syntaxFlow,

    visitor: {
      TypeCastExpression(path) {
        const { node } = path;
        attachComment({
          ofPath: path.get("typeAnnotation"),
          toPath: path.get("expression"),
          keepType: true,
        });
        path.replaceWith(t.parenthesizedExpression(node.expression));
      },

      // support function a(b?) {}
      Identifier(path) {
        if (path.parentPath.isFlow()) return;
        const { node } = path;
        if (node.typeAnnotation) {
          attachComment({
            ofPath: path.get("typeAnnotation"),
            toPath: path,
            optional:
              node.optional ||
              // @ts-expect-error Fixme: optional is not in t.TypeAnnotation,
              // maybe we can remove it
              node.typeAnnotation.optional,
          });
          if (node.optional) {
            node.optional = false;
          }
        } else if (node.optional) {
          attachComment({
            toPath: path,
            comments: ":: ?",
          });
          node.optional = false;
        }
      },

      AssignmentPattern: {
        exit({ node }) {
          const { left } = node;
          // @ts-expect-error optional is not in TSAsExpression
          if (left.optional) {
            // @ts-expect-error optional is not in TSAsExpression
            left.optional = false;
          }
        },
      },

      // strip optional property from function params - facebook/fbjs#17
      Function(path) {
        if (path.isDeclareFunction()) return;
        const { node } = path;
        if (node.typeParameters) {
          attachComment({
            ofPath: path.get("typeParameters"),
            toPath: path.get("id"),
            // @ts-expect-error Fixme: optional is not in t.TypeParameterDeclaration
            optional: node.typeParameters.optional,
          });
        }
        if (node.returnType) {
          attachComment({
            ofPath: path.get("returnType"),
            toPath: path.get("body"),
            where: "leading",
            // @ts-expect-error Fixme: optional is not in t.TypeAnnotation
            optional: node.returnType.typeAnnotation.optional,
          });
        }
      },

      // support for `class X { foo: string }` - #4622
      ClassProperty(path) {
        const { node } = path;
        if (!node.value) {
          wrapInFlowComment(path);
        } else if (node.typeAnnotation) {
          attachComment({
            ofPath: path.get("typeAnnotation"),
            toPath: path.get("key"),
            // @ts-expect-error Fixme: optional is not in t.TypeAnnotation
            optional: node.typeAnnotation.optional,
          });
        }
      },

      // support `export type a = {}` - #8 Error: You passed path.replaceWith() a falsy node
      ExportNamedDeclaration(path) {
        const { node } = path;
        if (node.exportKind !== "type" && !t.isFlow(node.declaration)) {
          return;
        }
        wrapInFlowComment(path);
      },

      // support `import type A` and `import typeof A` #10
      ImportDeclaration(path) {
        const { node } = path;
        if (isTypeImport(node.importKind)) {
          wrapInFlowComment(path);
          return;
        }

        const typeSpecifiers = node.specifiers.filter(
          specifier =>
            specifier.type === "ImportSpecifier" &&
            isTypeImport(specifier.importKind),
        );

        const nonTypeSpecifiers = node.specifiers.filter(
          specifier =>
            specifier.type !== "ImportSpecifier" ||
            !isTypeImport(specifier.importKind),
        );
        node.specifiers = nonTypeSpecifiers;

        if (typeSpecifiers.length > 0) {
          const typeImportNode = t.cloneNode(node);
          typeImportNode.specifiers = typeSpecifiers;
          const comment = `:: ${generateCode(typeImportNode).code}`;

          if (nonTypeSpecifiers.length > 0) {
            attachComment({ toPath: path, comments: comment });
          } else {
            attachComment({ ofPath: path, comments: comment });
          }
        }
      },
      ObjectPattern(path) {
        const { node } = path;
        if (node.typeAnnotation) {
          attachComment({
            ofPath: path.get("typeAnnotation"),
            toPath: path,
            optional:
              node.optional ||
              // @ts-expect-error Fixme: optional is not in t.TypeAnnotation
              node.typeAnnotation.optional,
          });
        }
      },

      Flow(
        path: NodePath<
          t.Flow | t.ImportDeclaration | t.ExportDeclaration | t.ImportSpecifier
        >,
      ) {
        wrapInFlowComment(path);
      },

      Class(path) {
        const { node } = path;
        let comments: [string?, ...(string | t.Comment)[]] = [];
        if (node.typeParameters) {
          const typeParameters = path.get("typeParameters");
          comments.push(
            // @ts-expect-error optional is not in TypeParameterDeclaration
            generateComment(typeParameters, node.typeParameters.optional),
          );
          const trailingComments = node.typeParameters.trailingComments;
          if (trailingComments) {
            comments.push(...trailingComments);
          }
          typeParameters.remove();
        }

        if (node.superClass) {
          if (comments.length > 0) {
            attachComment({
              toPath: path.get("id"),
              comments: comments,
            });
            comments = [];
          }

          // superTypeParameters is for compatibility with Babel 7
          if (
            process.env.BABEL_8_BREAKING
              ? // @ts-ignore(Babel 7 vs Babel 8) Renamed
                node.superTypeArguments
              : // @ts-ignore(Babel 7 vs Babel 8) Renamed
                node.superTypeParameters
          ) {
            const superTypeArguments = path.get(
              process.env.BABEL_8_BREAKING
                ? "superTypeArguments"
                : "superTypeParameters",
            ) as NodePath<t.TypeParameterInstantiation>;
            comments.push(
              generateComment(
                superTypeArguments,
                // @ts-expect-error optional is not in TypeParameterInstantiation
                superTypeArguments.node.optional,
              ),
            );
            superTypeArguments.remove();
          }
        }

        if (node.implements) {
          const impls = path.get("implements");
          const comment =
            "implements " +
            impls
              .map(impl => generateComment(impl).replace(/^:: /, ""))
              .join(", ");
          delete node["implements"];

          if (comments.length === 1) {
            comments[0] += ` ${comment}`;
          } else {
            comments.push(`:: ${comment}`);
          }
        }

        if (comments.length > 0) {
          attachComment({
            toPath: path.get("body"),
            where: "leading",
            comments: comments,
          });
        }
      },
    },
  };
});
