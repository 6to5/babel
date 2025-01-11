import Buffer, { type Pos } from "./buffer.ts";
import type { Loc } from "./buffer.ts";
import * as n from "./node/index.ts";
import type * as t from "@babel/types";
import {
  isExpression,
  isFunction,
  isStatement,
  isClassBody,
  isTSInterfaceBody,
  isTSEnumMember,
} from "@babel/types";
import type { Opts as jsescOptions } from "jsesc";

import { TokenMap } from "./token-map.ts";
import type { GeneratorOptions } from "./index.ts";
import * as generatorFunctions from "./generators/index.ts";
import {
  addDeprecatedGenerators,
  type DeprecatedBabel7ASTTypes,
} from "./generators/deprecated.ts";
import type SourceMap from "./source-map.ts";
import type { TraceMap } from "@jridgewell/trace-mapping";
import type { Token } from "@babel/parser";

// We inline this package
// eslint-disable-next-line import/no-extraneous-dependencies
import * as charCodes from "charcodes";

const SCIENTIFIC_NOTATION = /e/i;
const ZERO_DECIMAL_INTEGER = /\.0+$/;
const HAS_NEWLINE = /[\n\r\u2028\u2029]/;
const HAS_NEWLINE_OR_BlOCK_COMMENT_END = /[\n\r\u2028\u2029]|\*\//;

function commentIsNewline(c: t.Comment) {
  return c.type === "CommentLine" || HAS_NEWLINE.test(c.value);
}

const { needsParens } = n;

const enum COMMENT_TYPE {
  LEADING,
  INNER,
  TRAILING,
}

const enum COMMENT_SKIP_NEWLINE {
  DEFAULT,
  ALL,
  LEADING,
  TRAILING,
}

const enum PRINT_COMMENT_HINT {
  SKIP,
  ALLOW,
  DEFER,
}

export type Format = {
  shouldPrintComment: (comment: string) => boolean;
  preserveFormat: boolean;
  retainLines: boolean;
  retainFunctionParens: boolean;
  comments: boolean;
  auxiliaryCommentBefore: string;
  auxiliaryCommentAfter: string;
  compact: boolean | "auto";
  minified: boolean;
  concise: boolean;
  indent: {
    adjustMultilineComment: boolean;
    style: string;
  };
  /**
   * @deprecated Removed in Babel 8, syntax type is always 'hash'
   */
  recordAndTupleSyntaxType?: GeneratorOptions["recordAndTupleSyntaxType"];
  jsescOption: jsescOptions;
  /**
   * @deprecated Removed in Babel 8, use `jsescOption` instead
   */
  jsonCompatibleStrings?: boolean;
  /**
   * For use with the Hack-style pipe operator.
   * Changes what token is used for pipe bodies’ topic references.
   */
  topicToken?: GeneratorOptions["topicToken"];
  /**
   * @deprecated Removed in Babel 8
   */
  decoratorsBeforeExport?: boolean;
  /**
   * The import attributes syntax style:
   * - "with"        : `import { a } from "b" with { type: "json" };`
   * - "assert"      : `import { a } from "b" assert { type: "json" };`
   * - "with-legacy" : `import { a } from "b" with type: "json";`
   */
  importAttributesKeyword?: "with" | "assert" | "with-legacy";
};

interface AddNewlinesOptions {
  addNewlines(leading: boolean, node: t.Node): number;
  nextNodeStartLine: number;
}

interface PrintSequenceOptions extends Partial<AddNewlinesOptions> {
  statement?: boolean;
  indent?: boolean;
  trailingCommentsLineOffset?: number;
}

interface PrintListOptions {
  separator?: (this: Printer, occurrenceCount: number, last: boolean) => void;
  iterator?: (node: t.Node, index: number) => void;
  statement?: boolean;
  indent?: boolean;
  printTrailingSeparator?: boolean;
}

export type PrintJoinOptions = PrintListOptions & PrintSequenceOptions;
class Printer {
  constructor(
    format: Format,
    map: SourceMap,
    tokens?: Token[],
    originalCode?: string,
  ) {
    this.format = format;

    this._tokens = tokens;
    this._originalCode = originalCode;

    this._indentRepeat = format.indent.style.length;

    this._inputMap = map?._inputMap;

    this._buf = new Buffer(map, format.indent.style[0]);
  }
  declare _inputMap: TraceMap;

  declare format: Format;

  inForStatementInit: boolean = false;
  enterForStatementInit() {
    if (this.inForStatementInit) return () => {};
    this.inForStatementInit = true;
    return () => {
      this.inForStatementInit = false;
    };
  }

  enterDelimited() {
    const oldInForStatementInit = this.inForStatementInit;
    const oldNoLineTerminatorAfterNode = this._noLineTerminatorAfterNode;
    if (
      oldInForStatementInit === false &&
      oldNoLineTerminatorAfterNode === null
    ) {
      return () => {};
    }
    this.inForStatementInit = false;
    this._noLineTerminatorAfterNode = null;
    return () => {
      this.inForStatementInit = oldInForStatementInit;
      this._noLineTerminatorAfterNode = oldNoLineTerminatorAfterNode;
    };
  }

  tokenContext: number = 0;

  _tokens: Token[] = null;
  _originalCode: string | null = null;

  declare _buf: Buffer;
  _currentNode: t.Node = null;
  _indent: number = 0;
  _indentRepeat: number = 0;
  _insideAux: boolean = false;
  _noLineTerminator: boolean = false;
  _noLineTerminatorAfterNode: t.Node | null = null;
  _printAuxAfterOnNextUserNode: boolean = false;
  _printedComments = new Set<t.Comment>();
  _endsWithInteger = false;
  _endsWithWord = false;
  _endsWithDiv = false;
  _lastCommentLine = 0;
  _endsWithInnerRaw: boolean = false;
  _indentInnerComments: boolean = true;
  tokenMap: TokenMap = null;

  _boundGetRawIdentifier = this._getRawIdentifier.bind(this);

  generate(ast: t.Node) {
    if (this.format.preserveFormat) {
      this.tokenMap = new TokenMap(ast, this._tokens, this._originalCode);
    }
    this.print(ast);
    this._maybeAddAuxComment();

    return this._buf.get();
  }

  /**
   * Increment indent size.
   */

  indent(): void {
    const { format } = this;
    if (format.preserveFormat || format.compact || format.concise) {
      return;
    }

    this._indent++;
  }

  /**
   * Decrement indent size.
   */

  dedent(): void {
    const { format } = this;
    if (format.preserveFormat || format.compact || format.concise) {
      return;
    }

    this._indent--;
  }

  /**
   * If the next token is on the same line, we must first print a semicolon.
   * This option is only used in `preserveFormat` node, for semicolons that
   * might have omitted due to them being absent in the original code (thanks
   * to ASI).
   *
   * We need both *NextToken and *NextNode because we only want to insert the
   * semicolon when the next token starts a new node, and not in cases like
   * foo} (where } is not starting a new node). So we first set *NextNode, and
   * then the print() method will move it to *NextToken.
   */
  _printSemicolonBeforeNextNode: number = -1;
  _printSemicolonBeforeNextToken: number = -1;

  /**
   * Add a semicolon to the buffer.
   */
  semicolon(force: boolean = false): void {
    this._maybeAddAuxComment();
    if (force) {
      this._appendChar(charCodes.semicolon);
      this._noLineTerminator = false;
      return;
    }
    if (this.tokenMap) {
      const node = this._currentNode;
      if (node.start != null && node.end != null) {
        if (!this.tokenMap.endMatches(node, ";")) {
          // no semicolon
          this._printSemicolonBeforeNextNode = this._buf.getCurrentLine();
          return;
        }
        const indexes = this.tokenMap.getIndexes(this._currentNode);
        this._catchUpTo(this._tokens[indexes[indexes.length - 1]].loc.start);
      }
    }
    this._queue(charCodes.semicolon);
    this._noLineTerminator = false;
  }

  /**
   * Add a right brace to the buffer.
   */

  rightBrace(node: t.Node): void {
    if (this.format.minified) {
      this._buf.removeLastSemicolon();
    }
    this.sourceWithOffset("end", node.loc, -1);
    this.token("}");
  }

  rightParens(node: t.Node): void {
    this.sourceWithOffset("end", node.loc, -1);
    this.token(")");
  }

  /**
   * Add a space to the buffer unless it is compact.
   */

  space(force: boolean = false): void {
    const { format } = this;
    if (format.compact || format.preserveFormat) return;

    if (force) {
      this._space();
    } else if (this._buf.hasContent()) {
      const lastCp = this.getLastChar();
      if (lastCp !== charCodes.space && lastCp !== charCodes.lineFeed) {
        this._space();
      }
    }
  }

  /**
   * Writes a token that can't be safely parsed without taking whitespace into account.
   */

  word(str: string, noLineTerminatorAfter: boolean = false): void {
    this.tokenContext = 0;

    this._maybePrintInnerComments(str);

    this._maybeAddAuxComment();

    if (this.tokenMap) this._catchUpToCurrentToken(str);

    // prevent concatenating words and creating // comment out of division and regex
    if (
      this._endsWithWord ||
      (this._endsWithDiv && str.charCodeAt(0) === charCodes.slash)
    ) {
      this._space();
    }
    this._append(str, false);

    this._endsWithWord = true;
    this._noLineTerminator = noLineTerminatorAfter;
  }

  /**
   * Writes a number token so that we can validate if it is an integer.
   */

  number(str: string, number?: number): void {
    // const NON_DECIMAL_LITERAL = /^0[box]/;
    function isNonDecimalLiteral(str: string) {
      if (str.length > 2 && str.charCodeAt(0) === charCodes.digit0) {
        const secondChar = str.charCodeAt(1);
        return (
          secondChar === charCodes.lowercaseB ||
          secondChar === charCodes.lowercaseO ||
          secondChar === charCodes.lowercaseX
        );
      }
      return false;
    }
    this.word(str);

    // Integer tokens need special handling because they cannot have '.'s inserted
    // immediately after them.
    this._endsWithInteger =
      Number.isInteger(number) &&
      !isNonDecimalLiteral(str) &&
      !SCIENTIFIC_NOTATION.test(str) &&
      !ZERO_DECIMAL_INTEGER.test(str) &&
      str.charCodeAt(str.length - 1) !== charCodes.dot;
  }

  /**
   * Writes a simple token.
   *
   * @param {string} str The string to append.
   * @param {boolean} [maybeNewline=false] Wether `str` might potentially
   *    contain a line terminator or not.
   * @param {number} [occurrenceCount=0] The occurrence count of this token in
   *    the current node. This is used when printing in `preserveFormat` mode,
   *    to know which token we should map to (for example, to disambiguate the
   *    commas in an array literal).
   */
  token(str: string, maybeNewline = false, occurrenceCount = 0): void {
    this.tokenContext = 0;

    this._maybePrintInnerComments(str, occurrenceCount);

    this._maybeAddAuxComment();

    if (this.tokenMap) this._catchUpToCurrentToken(str, occurrenceCount);

    const lastChar = this.getLastChar();
    const strFirst = str.charCodeAt(0);
    if (
      (lastChar === charCodes.exclamationMark &&
        // space is mandatory to avoid outputting <!--
        // http://javascript.spec.whatwg.org/#comment-syntax
        (str === "--" ||
          // Needs spaces to avoid changing a! == 0 to a!== 0
          strFirst === charCodes.equalsTo)) ||
      // Need spaces for operators of the same kind to avoid: `a+++b`
      (strFirst === charCodes.plusSign && lastChar === charCodes.plusSign) ||
      (strFirst === charCodes.dash && lastChar === charCodes.dash) ||
      // Needs spaces to avoid changing '34' to '34.', which would still be a valid number.
      (strFirst === charCodes.dot && this._endsWithInteger)
    ) {
      this._space();
    }
    this._append(str, maybeNewline);
    this._noLineTerminator = false;
  }

  tokenChar(char: number): void {
    this.tokenContext = 0;

    const str = String.fromCharCode(char);
    this._maybePrintInnerComments(str);

    this._maybeAddAuxComment();

    if (this.tokenMap) this._catchUpToCurrentToken(str);

    const lastChar = this.getLastChar();
    if (
      // Need spaces for operators of the same kind to avoid: `a+++b`
      (char === charCodes.plusSign && lastChar === charCodes.plusSign) ||
      (char === charCodes.dash && lastChar === charCodes.dash) ||
      // Needs spaces to avoid changing '34' to '34.', which would still be a valid number.
      (char === charCodes.dot && this._endsWithInteger)
    ) {
      this._space();
    }
    this._appendChar(char);
    this._noLineTerminator = false;
  }

  /**
   * Add a newline (or many newlines), maintaining formatting.
   * This function checks the number of newlines in the queue and subtracts them.
   * It currently has some limitations.
   * @see {Buffer#getNewlineCount}
   */
  newline(i: number = 1, force?: boolean): void {
    if (i <= 0) return;

    if (!force) {
      if (this.format.retainLines || this.format.compact) return;

      if (this.format.concise) {
        this.space();
        return;
      }
    }

    if (i > 2) i = 2; // Max two lines

    i -= this._buf.getNewlineCount();

    for (let j = 0; j < i; j++) {
      this._newline();
    }

    return;
  }

  endsWith(char: number): boolean {
    return this.getLastChar() === char;
  }

  getLastChar(): number {
    return this._buf.getLastChar();
  }

  endsWithCharAndNewline(): number {
    return this._buf.endsWithCharAndNewline();
  }

  removeTrailingNewline(): void {
    this._buf.removeTrailingNewline();
  }

  exactSource(loc: Loc | undefined, cb: () => void) {
    if (!loc) {
      cb();
      return;
    }

    this._catchUp("start", loc);

    this._buf.exactSource(loc, cb);
  }

  source(prop: "start" | "end", loc: Loc | undefined): void {
    if (!loc) return;

    this._catchUp(prop, loc);

    this._buf.source(prop, loc);
  }

  sourceWithOffset(
    prop: "start" | "end",
    loc: Loc | undefined,
    columnOffset: number,
  ): void {
    if (!loc || this.format.preserveFormat) return;

    this._catchUp(prop, loc);

    this._buf.sourceWithOffset(prop, loc, columnOffset);
  }

  sourceIdentifierName(identifierName: string, pos?: Pos): void {
    if (!this._buf._canMarkIdName) return;

    const sourcePosition = this._buf._sourcePosition;
    sourcePosition.identifierNamePos = pos;
    sourcePosition.identifierName = identifierName;
  }

  _space(): void {
    this._queue(charCodes.space);
  }

  _newline(): void {
    this._queue(charCodes.lineFeed);
  }

  _catchUpToCurrentToken(str: string, occurrenceCount: number = 0): void {
    // Assert: this.tokenMap

    const token = this.tokenMap.findMatching(
      this._currentNode,
      str,
      occurrenceCount,
    );
    if (token) this._catchUpTo(token.loc.start);

    if (
      this._printSemicolonBeforeNextToken !== -1 &&
      this._printSemicolonBeforeNextToken === this._buf.getCurrentLine()
    ) {
      this._buf.appendChar(charCodes.semicolon);
      this._endsWithWord = false;
      this._endsWithInteger = false;
      this._endsWithDiv = false;
    }
    this._printSemicolonBeforeNextToken = -1;
    this._printSemicolonBeforeNextNode = -1;
  }

  _append(str: string, maybeNewline: boolean): void {
    this._maybeIndent(str.charCodeAt(0));

    this._buf.append(str, maybeNewline);

    // callers are expected to then set these to `true` when needed
    this._endsWithWord = false;
    this._endsWithInteger = false;
    this._endsWithDiv = false;
  }

  _appendChar(char: number): void {
    this._maybeIndent(char);

    this._buf.appendChar(char);

    // callers are expected to then set these to `true` when needed
    this._endsWithWord = false;
    this._endsWithInteger = false;
    this._endsWithDiv = false;
  }

  _queue(char: number) {
    this._maybeIndent(char);

    this._buf.queue(char);

    this._endsWithWord = false;
    this._endsWithInteger = false;
  }

  _maybeIndent(firstChar: number): void {
    // we've got a newline before us so prepend on the indentation
    if (
      this._indent &&
      firstChar !== charCodes.lineFeed &&
      this.endsWith(charCodes.lineFeed)
    ) {
      this._buf.queueIndentation(this._getIndent());
    }
  }

  _shouldIndent(firstChar: number) {
    // we've got a newline before us so prepend on the indentation
    if (
      this._indent &&
      firstChar !== charCodes.lineFeed &&
      this.endsWith(charCodes.lineFeed)
    ) {
      return true;
    }
  }

  catchUp(line: number) {
    if (!this.format.retainLines) return;

    // catch up to this nodes newline if we're behind
    const count = line - this._buf.getCurrentLine();

    for (let i = 0; i < count; i++) {
      this._newline();
    }
  }

  _catchUp(prop: "start" | "end", loc?: Loc) {
    const { format } = this;
    if (!format.preserveFormat) {
      if (format.retainLines && loc?.[prop]) {
        this.catchUp(loc[prop].line);
      }
      return;
    }

    // catch up to this nodes newline if we're behind
    const pos = loc?.[prop];
    if (pos != null) this._catchUpTo(pos);
  }

  _catchUpTo({ line, column, index }: Pos) {
    const count = line - this._buf.getCurrentLine();
    if (count > 0 && this._noLineTerminator) {
      // We cannot inject new lines when _noLineTemrinator is set
      // to `true`, or we would generate invalid code.
      return;
    }

    for (let i = 0; i < count; i++) {
      this._newline();
    }

    const spacesCount =
      count > 0 ? column : column - this._buf.getCurrentColumn();
    if (spacesCount > 0) {
      const spaces = this._originalCode
        ? this._originalCode
            .slice(index - spacesCount, index)
            // https://tc39.es/ecma262/#sec-white-space
            .replace(/[^\t\v\f\uFEFF\p{Space_Separator}]/gu, " ")
        : " ".repeat(spacesCount);
      this._append(spaces, false);
    }
  }

  /**
   * Get the current indent.
   */

  _getIndent(): number {
    return this._indentRepeat * this._indent;
  }

  printTerminatorless(node: t.Node) {
    /**
     * Set some state that will be modified if a newline has been inserted before any
     * non-space characters.
     *
     * This is to prevent breaking semantics for terminatorless separator nodes. eg:
     *
     *   return foo;
     *
     * returns `foo`. But if we do:
     *
     *   return
     *   foo;
     *
     *  `undefined` will be returned and not `foo` due to the terminator.
     */
    this._noLineTerminator = true;
    this.print(node);
  }

  print(
    node: t.Node | null,
    noLineTerminatorAfter?: boolean,
    // trailingCommentsLineOffset also used to check if called from printJoin
    // it will be ignored if `noLineTerminatorAfter||this._noLineTerminator`
    trailingCommentsLineOffset?: number,
  ) {
    if (!node) return;

    this._endsWithInnerRaw = false;

    const nodeType = node.type;
    const format = this.format;

    const oldConcise = format.concise;
    if (
      // @ts-expect-error document _compact AST properties
      node._compact
    ) {
      format.concise = true;
    }

    const printMethod =
      this[
        nodeType as Exclude<
          t.Node["type"],
          | DeprecatedBabel7ASTTypes
          // renamed
          | t.DeprecatedAliases["type"]
        >
      ];
    if (printMethod === undefined) {
      throw new ReferenceError(
        `unknown node of type ${JSON.stringify(
          nodeType,
        )} with constructor ${JSON.stringify(node.constructor.name)}`,
      );
    }

    const parent = this._currentNode;
    this._currentNode = node;

    if (this.tokenMap) {
      this._printSemicolonBeforeNextToken = this._printSemicolonBeforeNextNode;
    }

    const oldInAux = this._insideAux;
    this._insideAux = node.loc == null;
    this._maybeAddAuxComment(this._insideAux && !oldInAux);

    const parenthesized = node.extra?.parenthesized as boolean | undefined;
    let shouldPrintParens =
      (parenthesized && format.preserveFormat) ||
      (parenthesized &&
        format.retainFunctionParens &&
        nodeType === "FunctionExpression") ||
      needsParens(
        node,
        parent,
        this.tokenContext,
        this.inForStatementInit,
        format.preserveFormat ? this._boundGetRawIdentifier : undefined,
      );

    if (
      !shouldPrintParens &&
      parenthesized &&
      node.leadingComments?.length &&
      node.leadingComments[0].type === "CommentBlock"
    ) {
      const parentType = parent?.type;
      switch (parentType) {
        case "ExpressionStatement":
        case "VariableDeclarator":
        case "AssignmentExpression":
        case "ReturnStatement":
          break;
        case "CallExpression":
        case "OptionalCallExpression":
        case "NewExpression":
          if (parent.callee !== node) break;
        // falls through
        default:
          shouldPrintParens = true;
      }
    }

    let indentParenthesized = false;
    if (
      !shouldPrintParens &&
      this._noLineTerminator &&
      (node.leadingComments?.some(commentIsNewline) ||
        (this.format.retainLines &&
          node.loc &&
          node.loc.start.line > this._buf.getCurrentLine()))
    ) {
      shouldPrintParens = true;
      indentParenthesized = true;
    }

    let oldNoLineTerminatorAfterNode;
    let oldInForStatementInitWasTrue;
    if (!shouldPrintParens) {
      noLineTerminatorAfter ||=
        parent &&
        this._noLineTerminatorAfterNode === parent &&
        n.isLastChild(parent, node);
      if (noLineTerminatorAfter) {
        if (node.trailingComments?.some(commentIsNewline)) {
          if (isExpression(node)) shouldPrintParens = true;
        } else {
          oldNoLineTerminatorAfterNode = this._noLineTerminatorAfterNode;
          this._noLineTerminatorAfterNode = node;
        }
      }
    }

    if (shouldPrintParens) {
      this.token("(");
      if (indentParenthesized) this.indent();
      this._endsWithInnerRaw = false;
      if (this.inForStatementInit) {
        oldInForStatementInitWasTrue = true;
        this.inForStatementInit = false;
      }
      oldNoLineTerminatorAfterNode = this._noLineTerminatorAfterNode;
      this._noLineTerminatorAfterNode = null;
    }

    this._lastCommentLine = 0;

    this._printLeadingComments(node, parent);

    const loc = nodeType === "Program" || nodeType === "File" ? null : node.loc;

    this.exactSource(
      loc,
      // @ts-expect-error Expected 1 arguments, but got 3.
      printMethod.bind(this, node, parent),
    );

    if (shouldPrintParens) {
      this._printTrailingComments(node, parent);
      if (indentParenthesized) {
        this.dedent();
        this.newline();
      }
      this.token(")");
      this._noLineTerminator = noLineTerminatorAfter;
      if (oldInForStatementInitWasTrue) this.inForStatementInit = true;
    } else if (noLineTerminatorAfter && !this._noLineTerminator) {
      this._noLineTerminator = true;
      this._printTrailingComments(node, parent);
    } else {
      this._printTrailingComments(node, parent, trailingCommentsLineOffset);
    }

    // end
    this._currentNode = parent;
    format.concise = oldConcise;
    this._insideAux = oldInAux;

    if (oldNoLineTerminatorAfterNode !== undefined) {
      this._noLineTerminatorAfterNode = oldNoLineTerminatorAfterNode;
    }

    this._endsWithInnerRaw = false;
  }

  _maybeAddAuxComment(enteredPositionlessNode?: boolean) {
    if (enteredPositionlessNode) this._printAuxBeforeComment();
    if (!this._insideAux) this._printAuxAfterComment();
  }

  _printAuxBeforeComment() {
    if (this._printAuxAfterOnNextUserNode) return;
    this._printAuxAfterOnNextUserNode = true;

    const comment = this.format.auxiliaryCommentBefore;
    if (comment) {
      this._printComment(
        {
          type: "CommentBlock",
          value: comment,
        },
        COMMENT_SKIP_NEWLINE.DEFAULT,
      );
    }
  }

  _printAuxAfterComment() {
    if (!this._printAuxAfterOnNextUserNode) return;
    this._printAuxAfterOnNextUserNode = false;

    const comment = this.format.auxiliaryCommentAfter;
    if (comment) {
      this._printComment(
        {
          type: "CommentBlock",
          value: comment,
        },
        COMMENT_SKIP_NEWLINE.DEFAULT,
      );
    }
  }

  getPossibleRaw(
    node:
      | t.StringLiteral
      | t.NumericLiteral
      | t.BigIntLiteral
      | t.DirectiveLiteral
      | t.JSXText,
  ): string | undefined {
    const extra = node.extra;
    if (
      extra?.raw != null &&
      extra.rawValue != null &&
      node.value === extra.rawValue
    ) {
      // @ts-expect-error: The extra.raw of these AST node types must be a string
      return extra.raw;
    }
  }

  printJoin(
    nodes: Array<t.Node> | undefined | null,
    statement?: boolean,
    indent?: boolean,
    separator?: PrintJoinOptions["separator"],
    printTrailingSeparator?: boolean,
    addNewlines?: PrintJoinOptions["addNewlines"],
    iterator?: PrintJoinOptions["iterator"],
    trailingCommentsLineOffset?: number,
  ) {
    if (!nodes?.length) return;

    if (indent == null && this.format.retainLines) {
      const startLine = nodes[0].loc?.start.line;
      if (startLine != null && startLine !== this._buf.getCurrentLine()) {
        indent = true;
      }
    }

    if (indent) this.indent();

    const newlineOpts: AddNewlinesOptions = {
      addNewlines: addNewlines,
      nextNodeStartLine: 0,
    };

    const boundSeparator = separator?.bind(this);

    const len = nodes.length;
    for (let i = 0; i < len; i++) {
      const node = nodes[i];
      if (!node) continue;

      if (statement) this._printNewline(i === 0, newlineOpts);

      this.print(node, undefined, trailingCommentsLineOffset || 0);

      iterator?.(node, i);

      if (boundSeparator != null) {
        if (i < len - 1) boundSeparator(i, false);
        else if (printTrailingSeparator) boundSeparator(i, true);
      }

      if (statement) {
        if (!node.trailingComments?.length) {
          this._lastCommentLine = 0;
        }

        if (i + 1 === len) {
          this.newline(1);
        } else {
          const nextNode = nodes[i + 1];
          newlineOpts.nextNodeStartLine = nextNode.loc?.start.line || 0;

          this._printNewline(true, newlineOpts);
        }
      }
    }

    if (indent) this.dedent();
  }

  printAndIndentOnComments(node: t.Node) {
    const indent = node.leadingComments && node.leadingComments.length > 0;
    if (indent) this.indent();
    this.print(node);
    if (indent) this.dedent();
  }

  printBlock(parent: Extract<t.Node, { body: t.Statement }>) {
    const node = parent.body;

    if (node.type !== "EmptyStatement") {
      this.space();
    }

    this.print(node);
  }

  _printTrailingComments(node: t.Node, parent?: t.Node, lineOffset?: number) {
    const { innerComments, trailingComments } = node;
    // We print inner comments here, so that if for some reason they couldn't
    // be printed in earlier locations they are still printed *somewhere*,
    // even if at the end of the node.
    if (innerComments?.length) {
      this._printComments(
        COMMENT_TYPE.TRAILING,
        innerComments,
        node,
        parent,
        lineOffset,
      );
    }
    if (trailingComments?.length) {
      this._printComments(
        COMMENT_TYPE.TRAILING,
        trailingComments,
        node,
        parent,
        lineOffset,
      );
    }
  }

  _printLeadingComments(node: t.Node, parent: t.Node) {
    const comments = node.leadingComments;
    if (!comments?.length) return;
    this._printComments(COMMENT_TYPE.LEADING, comments, node, parent);
  }

  _maybePrintInnerComments(
    nextTokenStr: string,
    nextTokenOccurrenceCount?: number,
  ) {
    if (this._endsWithInnerRaw) {
      this.printInnerComments(
        this.tokenMap?.findMatching(
          this._currentNode,
          nextTokenStr,
          nextTokenOccurrenceCount,
        ),
      );
    }
    this._endsWithInnerRaw = true;
    this._indentInnerComments = true;
  }

  printInnerComments(nextToken?: Token) {
    const node = this._currentNode;
    const comments = node.innerComments;
    if (!comments?.length) return;

    const hasSpace = this.endsWith(charCodes.space);
    const indent = this._indentInnerComments;
    const printedCommentsCount = this._printedComments.size;
    if (indent) this.indent();
    this._printComments(
      COMMENT_TYPE.INNER,
      comments,
      node,
      undefined,
      undefined,
      nextToken,
    );
    if (hasSpace && printedCommentsCount !== this._printedComments.size) {
      this.space();
    }
    if (indent) this.dedent();
  }

  noIndentInnerCommentsHere() {
    this._indentInnerComments = false;
  }

  printSequence(
    nodes: t.Node[],
    indent?: boolean,
    trailingCommentsLineOffset?: number,
    addNewlines?: PrintSequenceOptions["addNewlines"],
  ) {
    this.printJoin(
      nodes,
      true,
      indent ?? false,
      undefined,
      undefined,
      addNewlines,
      undefined,
      trailingCommentsLineOffset,
    );
  }

  printList(
    items: t.Node[],
    printTrailingSeparator?: boolean,
    statement?: boolean,
    indent?: boolean,
    separator?: PrintListOptions["separator"],
    iterator?: PrintListOptions["iterator"],
  ) {
    this.printJoin(
      items,
      statement,
      indent,
      separator ?? commaSeparator,
      printTrailingSeparator,
      undefined,
      iterator,
    );
  }

  shouldPrintTrailingComma(listEnd: string): boolean | null {
    if (!this.tokenMap) return null;

    const listEndIndex = this.tokenMap.findLastIndex(this._currentNode, token =>
      this.tokenMap.matchesOriginal(token, listEnd),
    );
    if (listEndIndex <= 0) return null;
    return this.tokenMap.matchesOriginal(this._tokens[listEndIndex - 1], ",");
  }

  _printNewline(newLine: boolean, opts: AddNewlinesOptions) {
    const format = this.format;

    // Fast path since 'this.newline' does nothing when not tracking lines.
    if (format.retainLines || format.compact) return;

    // Fast path for concise since 'this.newline' just inserts a space when
    // concise formatting is in use.
    if (format.concise) {
      this.space();
      return;
    }

    if (!newLine) {
      return;
    }

    const startLine = opts.nextNodeStartLine;
    const lastCommentLine = this._lastCommentLine;
    if (startLine > 0 && lastCommentLine > 0) {
      const offset = startLine - lastCommentLine;
      if (offset >= 0) {
        this.newline(offset || 1);
        return;
      }
    }

    // don't add newlines at the beginning of the file
    if (this._buf.hasContent()) {
      // Here is the logic of the original line wrapping according to the node layout, we are not using it now.
      // We currently add at most one newline to each node in the list, ignoring `opts.addNewlines`.

      // let lines = 0;
      // if (!leading) lines++; // always include at least a single line after
      // if (opts.addNewlines) lines += opts.addNewlines(leading, node) || 0;

      // const needs = leading ? needsWhitespaceBefore : needsWhitespaceAfter;
      // if (needs(node, parent)) lines++;

      // this.newline(Math.min(2, lines));

      this.newline(1);
    }
  }

  // Returns `PRINT_COMMENT_HINT.DEFER` if the comment cannot be printed in this position due to
  // line terminators, signaling that the print comments loop can stop and
  // resume printing comments at the next possible position. This happens when
  // printing inner comments, since if we have an inner comment with a multiline
  // there is at least one inner position where line terminators are allowed.
  _shouldPrintComment(
    comment: t.Comment,
    nextToken?: Token,
  ): PRINT_COMMENT_HINT {
    // Some plugins (such as flow-strip-types) use this to mark comments as removed using the AST-root 'comments' property,
    // where they can't manually mutate the AST node comment lists.
    if (comment.ignore) return PRINT_COMMENT_HINT.SKIP;

    if (this._printedComments.has(comment)) return PRINT_COMMENT_HINT.SKIP;

    if (
      this._noLineTerminator &&
      HAS_NEWLINE_OR_BlOCK_COMMENT_END.test(comment.value)
    ) {
      return PRINT_COMMENT_HINT.DEFER;
    }

    if (nextToken && this.tokenMap) {
      const commentTok = this.tokenMap.find(
        this._currentNode,
        token => token.value === comment.value,
      );
      if (commentTok && commentTok.start > nextToken.start) {
        return PRINT_COMMENT_HINT.DEFER;
      }
    }

    this._printedComments.add(comment);

    if (!this.format.shouldPrintComment(comment.value)) {
      return PRINT_COMMENT_HINT.SKIP;
    }

    return PRINT_COMMENT_HINT.ALLOW;
  }

  _printComment(comment: t.Comment, skipNewLines: COMMENT_SKIP_NEWLINE) {
    const noLineTerminator = this._noLineTerminator;
    const isBlockComment = comment.type === "CommentBlock";

    // Add a newline before and after a block comment, unless explicitly
    // disallowed
    const printNewLines =
      isBlockComment &&
      skipNewLines !== COMMENT_SKIP_NEWLINE.ALL &&
      !this._noLineTerminator;

    if (
      printNewLines &&
      this._buf.hasContent() &&
      skipNewLines !== COMMENT_SKIP_NEWLINE.LEADING
    ) {
      this.newline(1);
    }

    const lastCharCode = this.getLastChar();
    if (
      lastCharCode !== charCodes.leftSquareBracket &&
      lastCharCode !== charCodes.leftCurlyBrace &&
      lastCharCode !== charCodes.leftParenthesis
    ) {
      this.space();
    }

    let val;
    if (isBlockComment) {
      val = `/*${comment.value}*/`;
      if (this.format.indent.adjustMultilineComment) {
        const offset = comment.loc?.start.column;
        if (offset) {
          const newlineRegex = new RegExp("\\n\\s{1," + offset + "}", "g");
          val = val.replace(newlineRegex, "\n");
        }
        if (this.format.concise) {
          val = val.replace(/\n(?!$)/g, `\n`);
        } else {
          let indentSize = this.format.retainLines
            ? 0
            : this._buf.getCurrentColumn();

          if (this._shouldIndent(charCodes.slash) || this.format.retainLines) {
            indentSize += this._getIndent();
          }

          val = val.replace(/\n(?!$)/g, `\n${" ".repeat(indentSize)}`);
        }
      }
    } else if (!noLineTerminator) {
      val = `//${comment.value}`;
    } else {
      // It was a single-line comment, so it's guaranteed to not
      // contain newlines and it can be safely printed as a block
      // comment.
      val = `/*${comment.value}*/`;
    }

    // Avoid converting a / operator into a line comment by appending /* to it
    if (this._endsWithDiv) this._space();

    if (this.tokenMap) {
      const { _printSemicolonBeforeNextToken, _printSemicolonBeforeNextNode } =
        this;
      this._printSemicolonBeforeNextToken = -1;
      this._printSemicolonBeforeNextNode = -1;
      this.source("start", comment.loc);
      this._append(val, isBlockComment);
      this._printSemicolonBeforeNextNode = _printSemicolonBeforeNextNode;
      this._printSemicolonBeforeNextToken = _printSemicolonBeforeNextToken;
    } else {
      this.source("start", comment.loc);
      this._append(val, isBlockComment);
    }

    if (!isBlockComment && !noLineTerminator) {
      this.newline(1, true);
    }

    if (printNewLines && skipNewLines !== COMMENT_SKIP_NEWLINE.TRAILING) {
      this.newline(1);
    }
  }

  _printComments(
    type: COMMENT_TYPE,
    comments: readonly t.Comment[],
    node: t.Node,
    parent?: t.Node,
    lineOffset: number = 0,
    nextToken?: Token,
  ) {
    const nodeLoc = node.loc;
    const len = comments.length;
    let hasLoc = !!nodeLoc;
    const nodeStartLine = hasLoc ? nodeLoc.start.line : 0;
    const nodeEndLine = hasLoc ? nodeLoc.end.line : 0;
    let lastLine = 0;
    let leadingCommentNewline = 0;

    const maybeNewline = this._noLineTerminator
      ? function () {}
      : this.newline.bind(this);

    for (let i = 0; i < len; i++) {
      const comment = comments[i];

      const shouldPrint = this._shouldPrintComment(comment, nextToken);
      if (shouldPrint === PRINT_COMMENT_HINT.DEFER) {
        hasLoc = false;
        break;
      }
      if (hasLoc && comment.loc && shouldPrint === PRINT_COMMENT_HINT.ALLOW) {
        const commentStartLine = comment.loc.start.line;
        const commentEndLine = comment.loc.end.line;
        if (type === COMMENT_TYPE.LEADING) {
          let offset = 0;
          if (i === 0) {
            // Because currently we cannot handle blank lines before leading comments,
            // we always wrap before and after multi-line comments.
            if (
              this._buf.hasContent() &&
              (comment.type === "CommentLine" ||
                commentStartLine !== commentEndLine)
            ) {
              offset = leadingCommentNewline = 1;
            }
          } else {
            offset = commentStartLine - lastLine;
          }
          lastLine = commentEndLine;

          maybeNewline(offset);
          this._printComment(comment, COMMENT_SKIP_NEWLINE.ALL);

          if (i + 1 === len) {
            maybeNewline(
              Math.max(nodeStartLine - lastLine, leadingCommentNewline),
            );
            lastLine = nodeStartLine;
          }
        } else if (type === COMMENT_TYPE.INNER) {
          const offset =
            commentStartLine - (i === 0 ? nodeStartLine : lastLine);
          lastLine = commentEndLine;

          maybeNewline(offset);
          this._printComment(comment, COMMENT_SKIP_NEWLINE.ALL);

          if (i + 1 === len) {
            maybeNewline(Math.min(1, nodeEndLine - lastLine)); // TODO: Improve here when inner comments processing is stronger
            lastLine = nodeEndLine;
          }
        } else {
          const offset =
            commentStartLine - (i === 0 ? nodeEndLine - lineOffset : lastLine);
          lastLine = commentEndLine;

          maybeNewline(offset);
          this._printComment(comment, COMMENT_SKIP_NEWLINE.ALL);
        }
      } else {
        hasLoc = false;
        if (shouldPrint !== PRINT_COMMENT_HINT.ALLOW) {
          continue;
        }

        if (len === 1) {
          const singleLine = comment.loc
            ? comment.loc.start.line === comment.loc.end.line
            : !HAS_NEWLINE.test(comment.value);

          const shouldSkipNewline =
            singleLine &&
            !isStatement(node) &&
            !isClassBody(parent) &&
            !isTSInterfaceBody(parent) &&
            !isTSEnumMember(node);

          if (type === COMMENT_TYPE.LEADING) {
            this._printComment(
              comment,
              (shouldSkipNewline && node.type !== "ObjectExpression") ||
                (singleLine && isFunction(parent, { body: node }))
                ? COMMENT_SKIP_NEWLINE.ALL
                : COMMENT_SKIP_NEWLINE.DEFAULT,
            );
          } else if (shouldSkipNewline && type === COMMENT_TYPE.TRAILING) {
            this._printComment(comment, COMMENT_SKIP_NEWLINE.ALL);
          } else {
            this._printComment(comment, COMMENT_SKIP_NEWLINE.DEFAULT);
          }
        } else if (
          type === COMMENT_TYPE.INNER &&
          !(node.type === "ObjectExpression" && node.properties.length > 1) &&
          node.type !== "ClassBody" &&
          node.type !== "TSInterfaceBody"
        ) {
          // class X {
          //   /*:: a: number*/
          //   /*:: b: ?string*/
          // }

          this._printComment(
            comment,
            i === 0
              ? COMMENT_SKIP_NEWLINE.LEADING
              : i === len - 1
                ? COMMENT_SKIP_NEWLINE.TRAILING
                : COMMENT_SKIP_NEWLINE.DEFAULT,
          );
        } else {
          this._printComment(comment, COMMENT_SKIP_NEWLINE.DEFAULT);
        }
      }
    }

    if (type === COMMENT_TYPE.TRAILING && hasLoc && lastLine) {
      this._lastCommentLine = lastLine;
    }
  }
}

// Expose the node type functions and helpers on the prototype for easy usage.
Object.assign(Printer.prototype, generatorFunctions);

if (!process.env.BABEL_8_BREAKING) {
  addDeprecatedGenerators(Printer);
}

type GeneratorFunctions = typeof generatorFunctions;
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Printer extends GeneratorFunctions {}
export default Printer;

function commaSeparator(this: Printer, occurrenceCount: number, last: boolean) {
  this.token(",", false, occurrenceCount);
  if (!last) this.space();
}
