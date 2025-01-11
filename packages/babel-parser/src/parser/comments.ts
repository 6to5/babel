/*:: declare var invariant; */

import BaseParser from "./base.ts";
import type { Comment, Node, Identifier } from "../types.ts";
import * as charCodes from "charcodes";
import type { Undone } from "./node.ts";

/**
 * A whitespace token containing comments
 */
export type CommentWhitespace = {
  /**
   * the start of the whitespace token.
   */
  start: number;
  /**
   * the end of the whitespace token.
   */
  end: number;
  /**
   * the containing comments
   */
  comments: Array<Comment>;
  /**
   * the immediately preceding AST node of the whitespace token
   */
  leadingNode: Node | null;
  /**
   * the immediately following AST node of the whitespace token
   */
  trailingNode: Node | null;
  /**
   * the innermost AST node containing the whitespace with minimal size (|end - start|)
   */
  containingNode: Node | null;
};

/**
 * Merge comments with node's trailingComments or assign comments to be
 * trailingComments. New comments will be placed before old comments
 * because the commentStack is enumerated reversely.
 */
function setTrailingComments(node: Undone<Node>, comments: Array<Comment>) {
  if (node.trailingComments === undefined) {
    node.trailingComments = comments;
  } else {
    node.trailingComments.unshift(...comments);
  }
}

/**
 * Merge comments with node's leadingComments or assign comments to be
 * leadingComments. New comments will be placed before old comments
 * because the commentStack is enumerated reversely.
 */
function setLeadingComments(node: Undone<Node>, comments: Array<Comment>) {
  if (node.leadingComments === undefined) {
    node.leadingComments = comments;
  } else {
    node.leadingComments.unshift(...comments);
  }
}

/**
 * Merge comments with node's innerComments or assign comments to be
 * innerComments. New comments will be placed before old comments
 * because the commentStack is enumerated reversely.
 */
export function setInnerComments(
  node: Undone<Node>,
  comments?: Array<Comment>,
) {
  if (node.innerComments === undefined) {
    node.innerComments = comments;
  } else {
    node.innerComments.unshift(...comments);
  }
}

/**
 * Given node and elements array, if elements has non-null element,
 * merge comments to its trailingComments, otherwise merge comments
 * to node's innerComments
 */
function adjustInnerComments(
  node: Undone<Node>,
  elements: Array<Node>,
  commentWS: CommentWhitespace,
) {
  let lastElement = null;
  let i = elements.length;
  while (lastElement === null && i > 0) {
    lastElement = elements[--i];
  }
  if (lastElement === null || lastElement.start > commentWS.start) {
    setInnerComments(node, commentWS.comments);
  } else {
    setTrailingComments(lastElement, commentWS.comments);
  }
}

export default class CommentsParser extends BaseParser {
  addComment(comment: Comment): void {
    if (this.filename) comment.loc.filename = this.filename;
    const { commentsLen } = this.state;
    if (this.comments.length !== commentsLen) {
      this.comments.length = commentsLen;
    }
    this.comments.push(comment);
    this.state.commentsLen++;
  }

  /**
   * Given a newly created AST node _n_, attach _n_ to a comment whitespace _w_ if applicable
   * {@see {@link CommentWhitespace}}
   */
  processComment(node: Node): void {
    const { commentStack } = this.state;
    const commentStackLength = commentStack.length;
    if (commentStackLength === 0) return;
    let i = commentStackLength - 1;
    const lastCommentWS = commentStack[i];

    if (lastCommentWS.start === node.end) {
      lastCommentWS.leadingNode = node;
      i--;
    }

    const { start: nodeStart } = node;
    // invariant: for all 0 <= j <= i, let c = commentStack[j], c must satisfy c.end < node.end
    for (; i >= 0; i--) {
      const commentWS = commentStack[i];
      const commentEnd = commentWS.end;
      if (commentEnd > nodeStart) {
        // by definition of commentWhiteSpace, this implies commentWS.start > nodeStart
        // so node can be a containingNode candidate. At this time we can finalize the comment
        // whitespace, because
        // 1) its leadingNode or trailingNode, if exists, will not change
        // 2) its containingNode have been assigned and will not change because it is the
        //    innermost minimal-sized AST node
        commentWS.containingNode = node;
        this.finalizeComment(commentWS);
        commentStack.splice(i, 1);
      } else {
        if (commentEnd === nodeStart) {
          commentWS.trailingNode = node;
        }
        // stop the loop when commentEnd <= nodeStart
        break;
      }
    }
  }

  /**
   * Assign the comments of comment whitespaces to related AST nodes.
   * Also adjust innerComments following trailing comma.
   */
  finalizeComment(commentWS: CommentWhitespace) {
    const { comments } = commentWS;
    if (commentWS.leadingNode !== null || commentWS.trailingNode !== null) {
      if (commentWS.leadingNode !== null) {
        setTrailingComments(commentWS.leadingNode, comments);
      }
      if (commentWS.trailingNode !== null) {
        setLeadingComments(commentWS.trailingNode, comments);
      }
    } else {
      /*:: invariant(commentWS.containingNode !== null) */
      const { containingNode: node, start: commentStart } = commentWS;
      if (
        this.input.charCodeAt(this.offsetToSourcePos(commentStart) - 1) ===
        charCodes.comma
      ) {
        // If a commentWhitespace follows a comma and the containingNode allows
        // list structures with trailing comma, merge it to the trailingComment
        // of the last non-null list element
        switch (node.type) {
          case "ObjectExpression":
          case "ObjectPattern":
          case "RecordExpression":
            adjustInnerComments(node, node.properties, commentWS);
            break;
          case "CallExpression":
          case "OptionalCallExpression":
            adjustInnerComments(node, node.arguments, commentWS);
            break;
          case "FunctionDeclaration":
          case "FunctionExpression":
          case "ArrowFunctionExpression":
          case "ObjectMethod":
          case "ClassMethod":
          case "ClassPrivateMethod":
            adjustInnerComments(node, node.params, commentWS);
            break;
          case "ArrayExpression":
          case "ArrayPattern":
          case "TupleExpression":
            adjustInnerComments(node, node.elements, commentWS);
            break;
          case "ExportNamedDeclaration":
          case "ImportDeclaration":
            adjustInnerComments(node, node.specifiers, commentWS);
            break;
          case "TSEnumDeclaration":
            if (!process.env.BABEL_8_BREAKING) {
              adjustInnerComments(node, node.members, commentWS);
            } else {
              setInnerComments(node, comments);
            }
            break;
          case "TSEnumBody":
            adjustInnerComments(node, node.members, commentWS);
            break;
          default: {
            setInnerComments(node, comments);
          }
        }
      } else {
        setInnerComments(node, comments);
      }
    }
  }

  /**
   * Drains remaining commentStack and applies finalizeComment
   * to each comment whitespace. Used only in parseExpression
   * where the top level AST node is _not_ Program
   * {@see {@link CommentsParser#finalizeComment}}
   */
  finalizeRemainingComments() {
    const { commentStack } = this.state;
    for (let i = commentStack.length - 1; i >= 0; i--) {
      this.finalizeComment(commentStack[i]);
    }
    this.state.commentStack = [];
  }

  /* eslint-disable no-irregular-whitespace */
  /**
   * Reset previous node trailing comments. Used in object / class
   * property parsing. We parse `async`, `static`, `set` and `get`
   * as an identifier but may reinterpret it into an async/static/accessor
   * method later. In this case the identifier is not part of the AST and we
   * should sync the knowledge to commentStacks
   *
   * For example, when parsing
   * ```
   * async /* 1 *​/ function f() {}
   * ```
   * the comment whitespace `/* 1 *​/` has leading node Identifier(async). When
   * we see the function token, we create a Function node and mark `/* 1 *​/` as
   * inner comments. So `/* 1 *​/` should be detached from the Identifier node.
   *
   * @param node the last finished AST node _before_ current token
   */
  /* eslint-enable no-irregular-whitespace */
  resetPreviousNodeTrailingComments(node: Node) {
    const { commentStack } = this.state;
    const { length } = commentStack;
    if (length === 0) return;
    const commentWS = commentStack[length - 1];
    if (commentWS.leadingNode === node) {
      commentWS.leadingNode = null;
    }
  }

  /* eslint-disable no-irregular-whitespace */
  /**
   * Reset previous node leading comments, assuming that `node` is a
   * single-token node. Used in import phase modifiers parsing. We parse
   * `module` in `import module foo from ...` as an identifier but may
   * reinterpret it into a phase modifier later. In this case the identifier is
   * not part of the AST and we should sync the knowledge to commentStacks
   *
   * For example, when parsing
   * ```
   * import /* 1 *​/ module a from "a";
   * ```
   * the comment whitespace `/* 1 *​/` has trailing node Identifier(module). When
   * we see that `module` is not a default import binding, we mark `/* 1 *​/` as
   * inner comments of the ImportDeclaration. So `/* 1 *​/` should be detached from
   * the Identifier node.
   *
   * @param node the last finished AST node _before_ current token
   */
  /* eslint-enable no-irregular-whitespace */
  resetPreviousIdentifierLeadingComments(node: Identifier) {
    const { commentStack } = this.state;
    const { length } = commentStack;
    if (length === 0) return;

    if (commentStack[length - 1].trailingNode === node) {
      commentStack[length - 1].trailingNode = null;
    } else if (length >= 2 && commentStack[length - 2].trailingNode === node) {
      commentStack[length - 2].trailingNode = null;
    }
  }

  /**
   * Attach a node to the comment whitespaces right before/after
   * the given range.
   *
   * This is used to properly attach comments around parenthesized
   * expressions as leading/trailing comments of the inner expression.
   */
  takeSurroundingComments(node: Node, start: number, end: number) {
    const { commentStack } = this.state;
    const commentStackLength = commentStack.length;
    if (commentStackLength === 0) return;
    let i = commentStackLength - 1;

    for (; i >= 0; i--) {
      const commentWS = commentStack[i];
      const commentEnd = commentWS.end;
      const commentStart = commentWS.start;

      if (commentStart === end) {
        commentWS.leadingNode = node;
      } else if (commentEnd === start) {
        commentWS.trailingNode = node;
      } else if (commentEnd < start) {
        break;
      }
    }
  }
}
