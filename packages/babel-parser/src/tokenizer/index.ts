/*:: declare var invariant; */

import { OptionFlags, type Options } from "../options.ts";
import {
  Position,
  SourceLocation,
  createPositionWithColumnOffset,
} from "../util/location.ts";
import CommentsParser, { type CommentWhitespace } from "../parser/comments.ts";
import type * as N from "../types.ts";
import * as charCodes from "charcodes";
import { isIdentifierStart, isIdentifierChar } from "../util/identifier.ts";
import {
  tokenIsKeyword,
  tokenLabelName,
  tt,
  keywords as keywordTypes,
  type TokenType,
} from "./types.ts";
import type { TokContext } from "./context.ts";
import {
  Errors,
  type ParseError,
  type ParseErrorConstructor,
} from "../parse-error.ts";
import {
  lineBreakG,
  isNewLine,
  isWhitespace,
  skipWhiteSpace,
  skipWhiteSpaceInLine,
} from "../util/whitespace.ts";
import State from "./state.ts";
import type { LookaheadState, DeferredStrictError } from "./state.ts";
import type { Undone } from "../parser/node.ts";
import type { Node } from "../types.ts";

import {
  readInt,
  readCodePoint,
  readStringContents,
  type IntErrorHandlers,
  type CodePointErrorHandlers,
  type StringContentsErrorHandlers,
} from "@babel/helper-string-parser";

import type { Plugin } from "../typings.ts";

function buildPosition(pos: number, lineStart: number, curLine: number) {
  return new Position(curLine, pos - lineStart, pos);
}

const VALID_REGEX_FLAGS = new Set([
  charCodes.lowercaseG,
  charCodes.lowercaseM,
  charCodes.lowercaseS,
  charCodes.lowercaseI,
  charCodes.lowercaseY,
  charCodes.lowercaseU,
  charCodes.lowercaseD,
  charCodes.lowercaseV,
]);

// Object type used to represent tokens. Note that normally, tokens
// simply exist as properties on the parser object. This is only
// used for the onToken callback and the external tokenizer.

export class Token {
  constructor(state: State) {
    const startIndex = state.startIndex || 0;
    this.type = state.type;
    this.value = state.value;
    this.start = startIndex + state.start;
    this.end = startIndex + state.end;
    this.loc = new SourceLocation(state.startLoc, state.endLoc);
  }

  declare type: TokenType;
  declare value: any;
  declare start: number;
  declare end: number;
  declare loc: SourceLocation;
}

// ## Tokenizer

export default abstract class Tokenizer extends CommentsParser {
  isLookahead: boolean;

  // Token store.
  tokens: Array<Token | N.Comment> = [];

  constructor(options: Options, input: string) {
    super();
    this.state = new State();
    this.state.init(options);
    this.input = input;
    this.length = input.length;
    this.comments = [];
    this.isLookahead = false;
  }

  pushToken(token: Token | N.Comment) {
    // Pop out invalid tokens trapped by try-catch parsing.
    // Those parsing branches are mainly created by typescript and flow plugins.
    this.tokens.length = this.state.tokensLength;
    this.tokens.push(token);
    ++this.state.tokensLength;
  }

  // Move to the next token

  next(): void {
    this.checkKeywordEscapes();
    if (this.optionFlags & OptionFlags.Tokens) {
      this.pushToken(new Token(this.state));
    }

    this.state.lastTokEndLoc = this.state.endLoc;
    this.state.lastTokStartLoc = this.state.startLoc;
    this.nextToken();
  }

  eat(type: TokenType): boolean {
    if (this.match(type)) {
      this.next();
      return true;
    } else {
      return false;
    }
  }

  /**
   * Whether current token matches given type
   */
  match(type: TokenType): boolean {
    return this.state.type === type;
  }

  /**
   * Create a LookaheadState from current parser state
   */
  createLookaheadState(state: State): LookaheadState {
    return {
      pos: state.pos,
      value: null,
      type: state.type,
      start: state.start,
      end: state.end,
      context: [this.curContext()],
      inType: state.inType,
      startLoc: state.startLoc,
      lastTokEndLoc: state.lastTokEndLoc,
      curLine: state.curLine,
      lineStart: state.lineStart,
      curPosition: state.curPosition,
    };
  }

  /**
   * lookahead peeks the next token, skipping changes to token context and
   * comment stack. For performance it returns a limited LookaheadState
   * instead of full parser state.
   *
   * The { column, line } Loc info is not included in lookahead since such usage
   * is rare. Although it may return other location properties e.g. `curLine` and
   * `lineStart`, these properties are not listed in the LookaheadState interface
   * and thus the returned value is _NOT_ reliable.
   *
   * The tokenizer should make best efforts to avoid using any parser state
   * other than those defined in LookaheadState
   */
  lookahead(): LookaheadState {
    const old = this.state;
    // @ts-expect-error For performance we use a simplified tokenizer state structure
    this.state = this.createLookaheadState(old);

    this.isLookahead = true;
    this.nextToken();
    this.isLookahead = false;

    const curr = this.state;
    this.state = old;
    return curr;
  }

  nextTokenStart(): number {
    return this.nextTokenStartSince(this.state.pos);
  }

  nextTokenStartSince(pos: number): number {
    skipWhiteSpace.lastIndex = pos;
    return skipWhiteSpace.test(this.input) ? skipWhiteSpace.lastIndex : pos;
  }

  lookaheadCharCode(): number {
    return this.input.charCodeAt(this.nextTokenStart());
  }

  /**
   * Similar to nextToken, but it will stop at line break when it is seen before the next token
   *
   * @returns {number} position of the next token start or line break, whichever is seen first.
   * @memberof Tokenizer
   */
  nextTokenInLineStart(): number {
    return this.nextTokenInLineStartSince(this.state.pos);
  }

  nextTokenInLineStartSince(pos: number): number {
    skipWhiteSpaceInLine.lastIndex = pos;
    return skipWhiteSpaceInLine.test(this.input)
      ? skipWhiteSpaceInLine.lastIndex
      : pos;
  }

  /**
   * Similar to lookaheadCharCode, but it will return the char code of line break if it is
   * seen before the next token
   *
   * @returns {number} char code of the next token start or line break, whichever is seen first.
   * @memberof Tokenizer
   */
  lookaheadInLineCharCode(): number {
    return this.input.charCodeAt(this.nextTokenInLineStart());
  }

  codePointAtPos(pos: number): number {
    // The implementation is based on
    // https://source.chromium.org/chromium/chromium/src/+/master:v8/src/builtins/builtins-string-gen.cc;l=1455;drc=221e331b49dfefadbc6fa40b0c68e6f97606d0b3;bpv=0;bpt=1
    // We reimplement `codePointAt` because `codePointAt` is a V8 builtin which is not inlined by TurboFan (as of M91)
    // since `input` is mostly ASCII, an inlined `charCodeAt` wins here
    let cp = this.input.charCodeAt(pos);
    if ((cp & 0xfc00) === 0xd800 && ++pos < this.input.length) {
      const trail = this.input.charCodeAt(pos);
      if ((trail & 0xfc00) === 0xdc00) {
        cp = 0x10000 + ((cp & 0x3ff) << 10) + (trail & 0x3ff);
      }
    }
    return cp;
  }

  // Toggle strict mode. Re-reads the next number or string to please
  // pedantic tests (`"use strict"; 010;` should fail).

  setStrict(strict: boolean): void {
    this.state.strict = strict;
    if (strict) {
      // Throw an error for any string decimal escape found before/immediately
      // after a "use strict" directive. Strict mode will be set at parse
      // time for any literals that occur after the next node of the strict
      // directive.
      this.state.strictErrors.forEach(([toParseError, at]) =>
        this.raise(toParseError, at),
      );
      this.state.strictErrors.clear();
    }
  }

  curContext(): TokContext {
    return this.state.context[this.state.context.length - 1];
  }

  // Read a single token, updating the parser object's token-related properties.
  nextToken(): void {
    this.skipSpace();
    this.state.start = this.state.pos;
    if (!this.isLookahead) this.state.startLoc = this.state.curPosition();
    if (this.state.pos >= this.length) {
      this.finishToken(tt.eof);
      return;
    }

    this.getTokenFromCode(this.codePointAtPos(this.state.pos));
  }

  // Skips a block comment, whose end is marked by commentEnd.
  // *-/ is used by the Flow plugin, when parsing block comments nested
  // inside Flow comments.
  skipBlockComment(commentEnd: "*/" | "*-/"): N.CommentBlock | undefined {
    let startLoc;
    if (!this.isLookahead) startLoc = this.state.curPosition();
    const start = this.state.pos;
    const end = this.input.indexOf(commentEnd, start + 2);
    if (end === -1) {
      // We have to call this again here because startLoc may not be set...
      // This seems to be for performance reasons:
      // https://github.com/babel/babel/commit/acf2a10899f696a8aaf34df78bf9725b5ea7f2da
      throw this.raise(Errors.UnterminatedComment, this.state.curPosition());
    }

    this.state.pos = end + commentEnd.length;
    lineBreakG.lastIndex = start + 2;
    while (lineBreakG.test(this.input) && lineBreakG.lastIndex <= end) {
      ++this.state.curLine;
      this.state.lineStart = lineBreakG.lastIndex;
    }

    // If we are doing a lookahead right now we need to advance the position (above code)
    // but we do not want to push the comment to the state.
    if (this.isLookahead) return;
    /*:: invariant(startLoc) */

    const comment: N.CommentBlock = {
      type: "CommentBlock",
      value: this.input.slice(start + 2, end),
      start: this.sourceToOffsetPos(start),
      end: this.sourceToOffsetPos(end + commentEnd.length),
      loc: new SourceLocation(startLoc, this.state.curPosition()),
    };
    if (this.optionFlags & OptionFlags.Tokens) this.pushToken(comment);
    return comment;
  }

  skipLineComment(startSkip: number): N.CommentLine | undefined {
    const start = this.state.pos;
    let startLoc;
    if (!this.isLookahead) startLoc = this.state.curPosition();
    let ch = this.input.charCodeAt((this.state.pos += startSkip));
    if (this.state.pos < this.length) {
      while (!isNewLine(ch) && ++this.state.pos < this.length) {
        ch = this.input.charCodeAt(this.state.pos);
      }
    }

    // If we are doing a lookahead right now we need to advance the position (above code)
    // but we do not want to push the comment to the state.
    if (this.isLookahead) return;

    const end = this.state.pos;
    const value = this.input.slice(start + startSkip, end);

    const comment: N.CommentLine = {
      type: "CommentLine",
      value,
      start: this.sourceToOffsetPos(start),
      end: this.sourceToOffsetPos(end),
      loc: new SourceLocation(startLoc, this.state.curPosition()),
    };
    if (this.optionFlags & OptionFlags.Tokens) this.pushToken(comment);
    return comment;
  }

  // Called at the start of the parse and after every token. Skips
  // whitespace and comments, and.

  skipSpace(): void {
    const spaceStart = this.state.pos;
    const comments: N.Comment[] =
      this.optionFlags & OptionFlags.AttachComment ? [] : null;
    loop: while (this.state.pos < this.length) {
      const ch = this.input.charCodeAt(this.state.pos);
      switch (ch) {
        case charCodes.space:
        case charCodes.nonBreakingSpace:
        case charCodes.tab:
          ++this.state.pos;
          break;
        case charCodes.carriageReturn:
          if (
            this.input.charCodeAt(this.state.pos + 1) === charCodes.lineFeed
          ) {
            ++this.state.pos;
          }
        // fall through
        case charCodes.lineFeed:
        case charCodes.lineSeparator:
        case charCodes.paragraphSeparator:
          ++this.state.pos;
          ++this.state.curLine;
          this.state.lineStart = this.state.pos;
          break;

        case charCodes.slash:
          switch (this.input.charCodeAt(this.state.pos + 1)) {
            case charCodes.asterisk: {
              const comment = this.skipBlockComment("*/");
              if (comment !== undefined) {
                this.addComment(comment);
                comments?.push(comment);
              }
              break;
            }

            case charCodes.slash: {
              const comment = this.skipLineComment(2);
              if (comment !== undefined) {
                this.addComment(comment);
                comments?.push(comment);
              }
              break;
            }

            default:
              break loop;
          }
          break;

        default:
          if (isWhitespace(ch)) {
            ++this.state.pos;
          } else if (
            ch === charCodes.dash &&
            !this.inModule &&
            this.optionFlags & OptionFlags.AnnexB
          ) {
            const pos = this.state.pos;
            if (
              this.input.charCodeAt(pos + 1) === charCodes.dash &&
              this.input.charCodeAt(pos + 2) === charCodes.greaterThan &&
              (spaceStart === 0 || this.state.lineStart > spaceStart)
            ) {
              // A `-->` line comment
              const comment = this.skipLineComment(3);
              if (comment !== undefined) {
                this.addComment(comment);
                comments?.push(comment);
              }
            } else {
              break loop;
            }
          } else if (
            ch === charCodes.lessThan &&
            !this.inModule &&
            this.optionFlags & OptionFlags.AnnexB
          ) {
            const pos = this.state.pos;
            if (
              this.input.charCodeAt(pos + 1) === charCodes.exclamationMark &&
              this.input.charCodeAt(pos + 2) === charCodes.dash &&
              this.input.charCodeAt(pos + 3) === charCodes.dash
            ) {
              // `<!--`, an XML-style comment that should be interpreted as a line comment
              const comment = this.skipLineComment(4);
              if (comment !== undefined) {
                this.addComment(comment);
                comments?.push(comment);
              }
            } else {
              break loop;
            }
          } else {
            break loop;
          }
      }
    }

    if (comments?.length > 0) {
      const end = this.state.pos;
      const commentWhitespace: CommentWhitespace = {
        start: this.sourceToOffsetPos(spaceStart),
        end: this.sourceToOffsetPos(end),
        comments,
        leadingNode: null,
        trailingNode: null,
        containingNode: null,
      };
      this.state.commentStack.push(commentWhitespace);
    }
  }

  // Called at the end of every token. Sets `end`, `val`, and
  // maintains `context` and `canStartJSXElement`, and skips the space after
  // the token, so that the next one's `start` will point at the
  // right position.

  finishToken(type: TokenType, val?: any): void {
    this.state.end = this.state.pos;
    this.state.endLoc = this.state.curPosition();
    const prevType = this.state.type;
    this.state.type = type;
    this.state.value = val;

    if (!this.isLookahead) {
      this.updateContext(prevType);
    }
  }

  replaceToken(type: TokenType): void {
    this.state.type = type;
    // @ts-expect-error the prevType of updateContext is required
    // only when the new type is tt.slash/tt.jsxTagEnd
    this.updateContext();
  }

  // ### Token reading

  // This is the function that is called to fetch the next token. It
  // is somewhat obscure, because it works in character codes rather
  // than characters, and because operator parsing has been inlined
  // into it.
  //
  // All in the name of speed.

  // number sign is "#"
  readToken_numberSign(): void {
    if (this.state.pos === 0 && this.readToken_interpreter()) {
      return;
    }

    const nextPos = this.state.pos + 1;
    const next = this.codePointAtPos(nextPos);
    if (next >= charCodes.digit0 && next <= charCodes.digit9) {
      throw this.raise(
        Errors.UnexpectedDigitAfterHash,
        this.state.curPosition(),
      );
    }

    if (
      next === charCodes.leftCurlyBrace ||
      (next === charCodes.leftSquareBracket && this.hasPlugin("recordAndTuple"))
    ) {
      // When we see `#{`, it is likely to be a hash record.
      // However we don't yell at `#[` since users may intend to use "computed private fields",
      // which is not allowed in the spec. Throwing expecting recordAndTuple is
      // misleading
      this.expectPlugin("recordAndTuple");
      if (
        !process.env.BABEL_8_BREAKING &&
        this.getPluginOption("recordAndTuple", "syntaxType") === "bar"
      ) {
        throw this.raise(
          next === charCodes.leftCurlyBrace
            ? Errors.RecordExpressionHashIncorrectStartSyntaxType
            : Errors.TupleExpressionHashIncorrectStartSyntaxType,
          this.state.curPosition(),
        );
      }

      this.state.pos += 2;
      if (next === charCodes.leftCurlyBrace) {
        // #{
        this.finishToken(tt.braceHashL);
      } else {
        // #[
        this.finishToken(tt.bracketHashL);
      }
    } else if (isIdentifierStart(next)) {
      ++this.state.pos;
      this.finishToken(tt.privateName, this.readWord1(next));
    } else if (next === charCodes.backslash) {
      ++this.state.pos;
      this.finishToken(tt.privateName, this.readWord1());
    } else {
      this.finishOp(tt.hash, 1);
    }
  }

  readToken_dot(): void {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (next >= charCodes.digit0 && next <= charCodes.digit9) {
      this.readNumber(true);
      return;
    }

    if (
      next === charCodes.dot &&
      this.input.charCodeAt(this.state.pos + 2) === charCodes.dot
    ) {
      this.state.pos += 3;
      this.finishToken(tt.ellipsis);
    } else {
      ++this.state.pos;
      this.finishToken(tt.dot);
    }
  }

  readToken_slash(): void {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (next === charCodes.equalsTo) {
      this.finishOp(tt.slashAssign, 2);
    } else {
      this.finishOp(tt.slash, 1);
    }
  }

  readToken_interpreter(): boolean {
    if (this.state.pos !== 0 || this.length < 2) return false;

    let ch = this.input.charCodeAt(this.state.pos + 1);
    if (ch !== charCodes.exclamationMark) return false;

    const start = this.state.pos;
    this.state.pos += 1;

    while (!isNewLine(ch) && ++this.state.pos < this.length) {
      ch = this.input.charCodeAt(this.state.pos);
    }

    const value = this.input.slice(start + 2, this.state.pos);

    this.finishToken(tt.interpreterDirective, value);

    return true;
  }

  readToken_mult_modulo(code: number): void {
    // '%' or '*'
    let type = code === charCodes.asterisk ? tt.star : tt.modulo;
    let width = 1;
    let next = this.input.charCodeAt(this.state.pos + 1);

    // Exponentiation operator '**'
    if (code === charCodes.asterisk && next === charCodes.asterisk) {
      width++;
      next = this.input.charCodeAt(this.state.pos + 2);
      type = tt.exponent;
    }

    // '%=' or '*='
    if (next === charCodes.equalsTo && !this.state.inType) {
      width++;
      // `tt.moduloAssign` is only needed to support % as a Hack-pipe topic token.
      // If the proposal ends up choosing a different token,
      // it can be merged with tt.assign.
      type = code === charCodes.percentSign ? tt.moduloAssign : tt.assign;
    }

    this.finishOp(type, width);
  }

  readToken_pipe_amp(code: number): void {
    // '||' '&&' '||=' '&&='
    const next = this.input.charCodeAt(this.state.pos + 1);

    if (next === code) {
      if (this.input.charCodeAt(this.state.pos + 2) === charCodes.equalsTo) {
        this.finishOp(tt.assign, 3);
      } else {
        this.finishOp(
          code === charCodes.verticalBar ? tt.logicalOR : tt.logicalAND,
          2,
        );
      }
      return;
    }

    if (code === charCodes.verticalBar) {
      // '|>'
      if (next === charCodes.greaterThan) {
        this.finishOp(tt.pipeline, 2);
        return;
      }
      // '|}'
      if (
        !process.env.BABEL_8_BREAKING &&
        this.hasPlugin("recordAndTuple") &&
        next === charCodes.rightCurlyBrace
      ) {
        if (this.getPluginOption("recordAndTuple", "syntaxType") !== "bar") {
          throw this.raise(
            Errors.RecordExpressionBarIncorrectEndSyntaxType,
            this.state.curPosition(),
          );
        }
        this.state.pos += 2;
        this.finishToken(tt.braceBarR);
        return;
      }

      // '|]'
      if (
        !process.env.BABEL_8_BREAKING &&
        this.hasPlugin("recordAndTuple") &&
        next === charCodes.rightSquareBracket
      ) {
        if (this.getPluginOption("recordAndTuple", "syntaxType") !== "bar") {
          throw this.raise(
            Errors.TupleExpressionBarIncorrectEndSyntaxType,
            this.state.curPosition(),
          );
        }
        this.state.pos += 2;
        this.finishToken(tt.bracketBarR);
        return;
      }
    }

    if (next === charCodes.equalsTo) {
      this.finishOp(tt.assign, 2);
      return;
    }

    this.finishOp(
      code === charCodes.verticalBar ? tt.bitwiseOR : tt.bitwiseAND,
      1,
    );
  }

  readToken_caret(): void {
    const next = this.input.charCodeAt(this.state.pos + 1);

    // '^='
    if (next === charCodes.equalsTo && !this.state.inType) {
      // `tt.xorAssign` is only needed to support ^ as a Hack-pipe topic token.
      // If the proposal ends up choosing a different token,
      // it can be merged with tt.assign.
      this.finishOp(tt.xorAssign, 2);
    }
    // '^^'
    else if (
      next === charCodes.caret &&
      // If the ^^ token is not enabled, we don't throw but parse two single ^s
      // because it could be a ^ hack token followed by a ^ binary operator.
      this.hasPlugin([
        "pipelineOperator",
        { proposal: "hack", topicToken: "^^" },
      ])
    ) {
      this.finishOp(tt.doubleCaret, 2);

      // `^^^` is forbidden and must be separated by a space.
      const lookaheadCh = this.input.codePointAt(this.state.pos);
      if (lookaheadCh === charCodes.caret) {
        this.unexpected();
      }
    }
    // '^'
    else {
      this.finishOp(tt.bitwiseXOR, 1);
    }
  }

  readToken_atSign(): void {
    const next = this.input.charCodeAt(this.state.pos + 1);

    // '@@'
    if (
      next === charCodes.atSign &&
      this.hasPlugin([
        "pipelineOperator",
        { proposal: "hack", topicToken: "@@" },
      ])
    ) {
      this.finishOp(tt.doubleAt, 2);
    }
    // '@'
    else {
      this.finishOp(tt.at, 1);
    }
  }

  readToken_plus_min(code: number): void {
    // '+-'
    const next = this.input.charCodeAt(this.state.pos + 1);

    if (next === code) {
      this.finishOp(tt.incDec, 2);
      return;
    }

    if (next === charCodes.equalsTo) {
      this.finishOp(tt.assign, 2);
    } else {
      this.finishOp(tt.plusMin, 1);
    }
  }

  readToken_lt(): void {
    // '<'
    const { pos } = this.state;
    const next = this.input.charCodeAt(pos + 1);

    if (next === charCodes.lessThan) {
      if (this.input.charCodeAt(pos + 2) === charCodes.equalsTo) {
        this.finishOp(tt.assign, 3);
        return;
      }
      this.finishOp(tt.bitShiftL, 2);
      return;
    }

    if (next === charCodes.equalsTo) {
      // <=
      this.finishOp(tt.relational, 2);
      return;
    }

    this.finishOp(tt.lt, 1);
  }

  readToken_gt(): void {
    // '>'
    const { pos } = this.state;
    const next = this.input.charCodeAt(pos + 1);

    if (next === charCodes.greaterThan) {
      const size =
        this.input.charCodeAt(pos + 2) === charCodes.greaterThan ? 3 : 2;
      if (this.input.charCodeAt(pos + size) === charCodes.equalsTo) {
        this.finishOp(tt.assign, size + 1);
        return;
      }
      this.finishOp(tt.bitShiftR, size);
      return;
    }

    if (next === charCodes.equalsTo) {
      // <= | >=
      this.finishOp(tt.relational, 2);
      return;
    }

    this.finishOp(tt.gt, 1);
  }

  readToken_eq_excl(code: number): void {
    // '=!'
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (next === charCodes.equalsTo) {
      this.finishOp(
        tt.equality,
        this.input.charCodeAt(this.state.pos + 2) === charCodes.equalsTo
          ? 3
          : 2,
      );
      return;
    }
    if (code === charCodes.equalsTo && next === charCodes.greaterThan) {
      // '=>'
      this.state.pos += 2;
      this.finishToken(tt.arrow);
      return;
    }
    this.finishOp(code === charCodes.equalsTo ? tt.eq : tt.bang, 1);
  }

  readToken_question(): void {
    // '?'
    const next = this.input.charCodeAt(this.state.pos + 1);
    const next2 = this.input.charCodeAt(this.state.pos + 2);
    if (next === charCodes.questionMark) {
      if (next2 === charCodes.equalsTo) {
        // '??='
        this.finishOp(tt.assign, 3);
      } else {
        // '??'
        this.finishOp(tt.nullishCoalescing, 2);
      }
    } else if (
      next === charCodes.dot &&
      !(next2 >= charCodes.digit0 && next2 <= charCodes.digit9)
    ) {
      // '.' not followed by a number
      this.state.pos += 2;
      this.finishToken(tt.questionDot);
    } else {
      ++this.state.pos;
      this.finishToken(tt.question);
    }
  }

  getTokenFromCode(code: number): void {
    switch (code) {
      // The interpretation of a dot depends on whether it is followed
      // by a digit or another two dots.

      case charCodes.dot:
        this.readToken_dot();
        return;
      // Punctuation tokens.
      case charCodes.leftParenthesis:
        ++this.state.pos;
        this.finishToken(tt.parenL);
        return;
      case charCodes.rightParenthesis:
        ++this.state.pos;
        this.finishToken(tt.parenR);
        return;
      case charCodes.semicolon:
        ++this.state.pos;
        this.finishToken(tt.semi);
        return;
      case charCodes.comma:
        ++this.state.pos;
        this.finishToken(tt.comma);
        return;
      case charCodes.leftSquareBracket:
        if (
          !process.env.BABEL_8_BREAKING &&
          this.hasPlugin("recordAndTuple") &&
          this.input.charCodeAt(this.state.pos + 1) === charCodes.verticalBar
        ) {
          if (this.getPluginOption("recordAndTuple", "syntaxType") !== "bar") {
            throw this.raise(
              Errors.TupleExpressionBarIncorrectStartSyntaxType,
              this.state.curPosition(),
            );
          }

          // [|
          this.state.pos += 2;
          this.finishToken(tt.bracketBarL);
        } else {
          ++this.state.pos;
          this.finishToken(tt.bracketL);
        }
        return;
      case charCodes.rightSquareBracket:
        ++this.state.pos;
        this.finishToken(tt.bracketR);
        return;
      case charCodes.leftCurlyBrace:
        if (
          !process.env.BABEL_8_BREAKING &&
          this.hasPlugin("recordAndTuple") &&
          this.input.charCodeAt(this.state.pos + 1) === charCodes.verticalBar
        ) {
          if (this.getPluginOption("recordAndTuple", "syntaxType") !== "bar") {
            throw this.raise(
              Errors.RecordExpressionBarIncorrectStartSyntaxType,
              this.state.curPosition(),
            );
          }

          // {|
          this.state.pos += 2;
          this.finishToken(tt.braceBarL);
        } else {
          ++this.state.pos;
          this.finishToken(tt.braceL);
        }
        return;
      case charCodes.rightCurlyBrace:
        ++this.state.pos;
        this.finishToken(tt.braceR);
        return;

      case charCodes.colon:
        if (
          this.hasPlugin("functionBind") &&
          this.input.charCodeAt(this.state.pos + 1) === charCodes.colon
        ) {
          this.finishOp(tt.doubleColon, 2);
        } else {
          ++this.state.pos;
          this.finishToken(tt.colon);
        }
        return;

      case charCodes.questionMark:
        this.readToken_question();
        return;

      case charCodes.graveAccent:
        this.readTemplateToken();
        return;

      case charCodes.digit0: {
        const next = this.input.charCodeAt(this.state.pos + 1);
        // '0x', '0X' - hex number
        if (next === charCodes.lowercaseX || next === charCodes.uppercaseX) {
          this.readRadixNumber(16);
          return;
        }
        // '0o', '0O' - octal number
        if (next === charCodes.lowercaseO || next === charCodes.uppercaseO) {
          this.readRadixNumber(8);
          return;
        }
        // '0b', '0B' - binary number
        if (next === charCodes.lowercaseB || next === charCodes.uppercaseB) {
          this.readRadixNumber(2);
          return;
        }
      }
      // Anything else beginning with a digit is an integer, octal
      // number, or float. (fall through)
      case charCodes.digit1:
      case charCodes.digit2:
      case charCodes.digit3:
      case charCodes.digit4:
      case charCodes.digit5:
      case charCodes.digit6:
      case charCodes.digit7:
      case charCodes.digit8:
      case charCodes.digit9:
        this.readNumber(false);
        return;

      // Quotes produce strings.
      case charCodes.quotationMark:
      case charCodes.apostrophe:
        this.readString(code);
        return;

      // Operators are parsed inline in tiny state machines. '=' (charCodes.equalsTo) is
      // often referred to. `finishOp` simply skips the amount of
      // characters it is given as second argument, and returns a token
      // of the type given by its first argument.

      case charCodes.slash:
        this.readToken_slash();
        return;

      case charCodes.percentSign:
      case charCodes.asterisk:
        this.readToken_mult_modulo(code);
        return;

      case charCodes.verticalBar:
      case charCodes.ampersand:
        this.readToken_pipe_amp(code);
        return;

      case charCodes.caret:
        this.readToken_caret();
        return;

      case charCodes.plusSign:
      case charCodes.dash:
        this.readToken_plus_min(code);
        return;

      case charCodes.lessThan:
        this.readToken_lt();
        return;

      case charCodes.greaterThan:
        this.readToken_gt();
        return;

      case charCodes.equalsTo:
      case charCodes.exclamationMark:
        this.readToken_eq_excl(code);
        return;

      case charCodes.tilde:
        this.finishOp(tt.tilde, 1);
        return;

      case charCodes.atSign:
        this.readToken_atSign();
        return;

      case charCodes.numberSign:
        this.readToken_numberSign();
        return;

      case charCodes.backslash:
        this.readWord();
        return;

      default:
        if (isIdentifierStart(code)) {
          this.readWord(code);
          return;
        }
    }

    throw this.raise(
      Errors.InvalidOrUnexpectedToken,
      this.state.curPosition(),
      {
        unexpected: String.fromCodePoint(code),
      },
    );
  }

  finishOp(type: TokenType, size: number): void {
    const str = this.input.slice(this.state.pos, this.state.pos + size);
    this.state.pos += size;
    this.finishToken(type, str);
  }

  readRegexp(): void {
    const startLoc = this.state.startLoc;
    const start = this.state.start + 1;
    let escaped, inClass;
    let { pos } = this.state;
    for (; ; ++pos) {
      if (pos >= this.length) {
        // FIXME: explain
        throw this.raise(
          Errors.UnterminatedRegExp,
          createPositionWithColumnOffset(startLoc, 1),
        );
      }
      const ch = this.input.charCodeAt(pos);
      if (isNewLine(ch)) {
        throw this.raise(
          Errors.UnterminatedRegExp,
          createPositionWithColumnOffset(startLoc, 1),
        );
      }
      if (escaped) {
        escaped = false;
      } else {
        if (ch === charCodes.leftSquareBracket) {
          inClass = true;
        } else if (ch === charCodes.rightSquareBracket && inClass) {
          inClass = false;
        } else if (ch === charCodes.slash && !inClass) {
          break;
        }
        escaped = ch === charCodes.backslash;
      }
    }
    const content = this.input.slice(start, pos);
    ++pos;

    let mods = "";

    const nextPos = () =>
      // (pos + 1) + 1 - start
      createPositionWithColumnOffset(startLoc, pos + 2 - start);

    while (pos < this.length) {
      const cp = this.codePointAtPos(pos);
      // It doesn't matter if cp > 0xffff, the loop will either throw or break because we check on cp
      const char = String.fromCharCode(cp);

      // @ts-expect-error VALID_REGEX_FLAGS.has should accept expanded type: number
      if (VALID_REGEX_FLAGS.has(cp)) {
        if (cp === charCodes.lowercaseV) {
          if (mods.includes("u")) {
            this.raise(Errors.IncompatibleRegExpUVFlags, nextPos());
          }
        } else if (cp === charCodes.lowercaseU) {
          if (mods.includes("v")) {
            this.raise(Errors.IncompatibleRegExpUVFlags, nextPos());
          }
        }
        if (mods.includes(char)) {
          this.raise(Errors.DuplicateRegExpFlags, nextPos());
        }
      } else if (isIdentifierChar(cp) || cp === charCodes.backslash) {
        this.raise(Errors.MalformedRegExpFlags, nextPos());
      } else {
        break;
      }

      ++pos;
      mods += char;
    }
    this.state.pos = pos;

    this.finishToken(tt.regexp, {
      pattern: content,
      flags: mods,
    });
  }

  // Read an integer in the given radix. Return null if zero digits
  // were read, the integer value otherwise. When `len` is given, this
  // will return `null` unless the integer has exactly `len` digits.
  // When `forceLen` is `true`, it means that we already know that in case
  // of a malformed number we have to skip `len` characters anyway, instead
  // of bailing out early. For example, in "\u{123Z}" we want to read up to }
  // anyway, while in "\u00Z" we will stop at Z instead of consuming four
  // characters (and thus the closing quote).

  readInt(
    radix: number,
    len?: number,
    forceLen: boolean = false,
    allowNumSeparator: boolean | "bail" = true,
  ): number | null {
    const { n, pos } = readInt(
      this.input,
      this.state.pos,
      this.state.lineStart,
      this.state.curLine,
      radix,
      len,
      forceLen,
      allowNumSeparator,
      this.errorHandlers_readInt,
      /* bailOnError */ false,
    );
    this.state.pos = pos;
    return n;
  }

  readRadixNumber(radix: number): void {
    const start = this.state.pos;
    const startLoc = this.state.curPosition();
    let isBigInt = false;

    this.state.pos += 2; // 0x
    const val = this.readInt(radix);
    if (val == null) {
      this.raise(
        Errors.InvalidDigit,
        // Numeric literals can't have newlines, so this is safe to do.
        createPositionWithColumnOffset(startLoc, 2),
        {
          radix,
        },
      );
    }
    const next = this.input.charCodeAt(this.state.pos);

    if (next === charCodes.lowercaseN) {
      ++this.state.pos;
      isBigInt = true;
    } else if (next === charCodes.lowercaseM) {
      throw this.raise(Errors.InvalidDecimal, startLoc);
    }

    if (isIdentifierStart(this.codePointAtPos(this.state.pos))) {
      throw this.raise(Errors.NumberIdentifier, this.state.curPosition());
    }

    if (isBigInt) {
      const str = this.input.slice(start, this.state.pos).replace(/[_n]/g, "");
      this.finishToken(tt.bigint, str);
      return;
    }

    this.finishToken(tt.num, val);
  }

  // Read an integer, octal integer, or floating-point number.

  readNumber(startsWithDot: boolean): void {
    const start = this.state.pos;
    const startLoc = this.state.curPosition();
    let isFloat = false;
    let isBigInt = false;
    let hasExponent = false;
    let isOctal = false;

    if (!startsWithDot && this.readInt(10) === null) {
      this.raise(Errors.InvalidNumber, this.state.curPosition());
    }
    const hasLeadingZero =
      this.state.pos - start >= 2 &&
      this.input.charCodeAt(start) === charCodes.digit0;

    if (hasLeadingZero) {
      const integer = this.input.slice(start, this.state.pos);
      this.recordStrictModeErrors(Errors.StrictOctalLiteral, startLoc);
      if (!this.state.strict) {
        // disallow numeric separators in non octal decimals and legacy octal likes
        const underscorePos = integer.indexOf("_");
        if (underscorePos > 0) {
          // Numeric literals can't have newlines, so this is safe to do.
          this.raise(
            Errors.ZeroDigitNumericSeparator,
            createPositionWithColumnOffset(startLoc, underscorePos),
          );
        }
      }
      isOctal = hasLeadingZero && !/[89]/.test(integer);
    }

    let next = this.input.charCodeAt(this.state.pos);
    if (next === charCodes.dot && !isOctal) {
      ++this.state.pos;
      this.readInt(10);
      isFloat = true;
      next = this.input.charCodeAt(this.state.pos);
    }

    if (
      (next === charCodes.uppercaseE || next === charCodes.lowercaseE) &&
      !isOctal
    ) {
      next = this.input.charCodeAt(++this.state.pos);
      if (next === charCodes.plusSign || next === charCodes.dash) {
        ++this.state.pos;
      }
      if (this.readInt(10) === null) {
        this.raise(Errors.InvalidOrMissingExponent, startLoc);
      }
      isFloat = true;
      hasExponent = true;
      next = this.input.charCodeAt(this.state.pos);
    }

    if (next === charCodes.lowercaseN) {
      // disallow floats, legacy octal syntax and non octal decimals
      // new style octal ("0o") is handled in this.readRadixNumber
      if (isFloat || hasLeadingZero) {
        this.raise(Errors.InvalidBigIntLiteral, startLoc);
      }
      ++this.state.pos;
      isBigInt = true;
    }

    if (!process.env.BABEL_8_BREAKING && next === charCodes.lowercaseM) {
      this.expectPlugin("decimal", this.state.curPosition());
      if (hasExponent || hasLeadingZero) {
        this.raise(Errors.InvalidDecimal, startLoc);
      }
      ++this.state.pos;
      // eslint-disable-next-line no-var
      var isDecimal = true;
    }

    if (isIdentifierStart(this.codePointAtPos(this.state.pos))) {
      throw this.raise(Errors.NumberIdentifier, this.state.curPosition());
    }

    // remove "_" for numeric literal separator, and trailing `m` or `n`
    const str = this.input.slice(start, this.state.pos).replace(/[_mn]/g, "");

    if (isBigInt) {
      this.finishToken(tt.bigint, str);
      return;
    }

    if (!process.env.BABEL_8_BREAKING && isDecimal) {
      this.finishToken(tt.decimal, str);
      return;
    }

    const val = isOctal ? parseInt(str, 8) : parseFloat(str);
    this.finishToken(tt.num, val);
  }

  // Read a string value, interpreting backslash-escapes.

  readCodePoint(throwOnInvalid: boolean): number | null {
    const { code, pos } = readCodePoint(
      this.input,
      this.state.pos,
      this.state.lineStart,
      this.state.curLine,
      throwOnInvalid,
      this.errorHandlers_readCodePoint,
    );
    this.state.pos = pos;
    return code;
  }

  readString(quote: number): void {
    const { str, pos, curLine, lineStart } = readStringContents(
      quote === charCodes.quotationMark ? "double" : "single",
      this.input,
      this.state.pos + 1, // skip the quote
      this.state.lineStart,
      this.state.curLine,
      this.errorHandlers_readStringContents_string,
    );
    this.state.pos = pos + 1; // skip the quote
    this.state.lineStart = lineStart;
    this.state.curLine = curLine;
    this.finishToken(tt.string, str);
  }

  // Reads template continuation `}...`
  readTemplateContinuation(): void {
    if (!this.match(tt.braceR)) {
      this.unexpected(null, tt.braceR);
    }
    // rewind pos to `}`
    this.state.pos--;
    this.readTemplateToken();
  }

  // Reads template string tokens.
  readTemplateToken(): void {
    const opening = this.input[this.state.pos];
    const { str, firstInvalidLoc, pos, curLine, lineStart } =
      readStringContents(
        "template",
        this.input,
        this.state.pos + 1, // skip '`' or `}`
        this.state.lineStart,
        this.state.curLine,
        this.errorHandlers_readStringContents_template,
      );
    this.state.pos = pos + 1; // skip '`' or `$`
    this.state.lineStart = lineStart;
    this.state.curLine = curLine;

    if (firstInvalidLoc) {
      this.state.firstInvalidTemplateEscapePos = new Position(
        firstInvalidLoc.curLine,
        firstInvalidLoc.pos - firstInvalidLoc.lineStart,
        this.sourceToOffsetPos(firstInvalidLoc.pos),
      );
    }

    if (this.input.codePointAt(pos) === charCodes.graveAccent) {
      this.finishToken(
        tt.templateTail,
        firstInvalidLoc ? null : opening + str + "`",
      );
    } else {
      this.state.pos++; // skip '{'
      this.finishToken(
        tt.templateNonTail,
        firstInvalidLoc ? null : opening + str + "${",
      );
    }
  }

  recordStrictModeErrors(toParseError: DeferredStrictError, at: Position) {
    const index = at.index;

    if (this.state.strict && !this.state.strictErrors.has(index)) {
      this.raise(toParseError, at);
    } else {
      this.state.strictErrors.set(index, [toParseError, at]);
    }
  }

  // Read an identifier, and return it as a string. Sets `this.state.containsEsc`
  // to whether the word contained a '\u' escape.
  //
  // Incrementally adds only escaped chars, adding other chunks as-is
  // as a micro-optimization.
  //
  // When `firstCode` is given, it assumes it is always an identifier start and
  // will skip reading start position again

  readWord1(firstCode?: number): string {
    this.state.containsEsc = false;
    let word = "";
    const start = this.state.pos;
    let chunkStart = this.state.pos;
    if (firstCode !== undefined) {
      this.state.pos += firstCode <= 0xffff ? 1 : 2;
    }

    while (this.state.pos < this.length) {
      const ch = this.codePointAtPos(this.state.pos);
      if (isIdentifierChar(ch)) {
        this.state.pos += ch <= 0xffff ? 1 : 2;
      } else if (ch === charCodes.backslash) {
        this.state.containsEsc = true;

        word += this.input.slice(chunkStart, this.state.pos);
        const escStart = this.state.curPosition();
        const identifierCheck =
          this.state.pos === start ? isIdentifierStart : isIdentifierChar;

        if (this.input.charCodeAt(++this.state.pos) !== charCodes.lowercaseU) {
          this.raise(Errors.MissingUnicodeEscape, this.state.curPosition());
          chunkStart = this.state.pos - 1;
          continue;
        }

        ++this.state.pos;
        const esc = this.readCodePoint(true);
        if (esc !== null) {
          if (!identifierCheck(esc)) {
            this.raise(Errors.EscapedCharNotAnIdentifier, escStart);
          }

          word += String.fromCodePoint(esc);
        }
        chunkStart = this.state.pos;
      } else {
        break;
      }
    }
    return word + this.input.slice(chunkStart, this.state.pos);
  }

  // Read an identifier or keyword token. Will check for reserved
  // words when necessary.

  readWord(firstCode?: number): void {
    const word = this.readWord1(firstCode);
    const type = keywordTypes.get(word);
    if (type !== undefined) {
      // We don't use word as state.value here because word is a dynamic string
      // while token label is a shared constant string
      this.finishToken(type, tokenLabelName(type));
    } else {
      this.finishToken(tt.name, word);
    }
  }

  checkKeywordEscapes(): void {
    const { type } = this.state;
    if (tokenIsKeyword(type) && this.state.containsEsc) {
      this.raise(Errors.InvalidEscapedReservedWord, this.state.startLoc, {
        reservedWord: tokenLabelName(type),
      });
    }
  }

  /**
   * Raise a `ParseError` given the appropriate properties. If passed a
   * `Position` for the `at` property, raises the `ParseError` at that location.
   * Otherwise, if passed a `Node`, raises the `ParseError` at the start
   * location of that `Node`.
   *
   * If `errorRecovery` is `true`, the error is pushed to the errors array and
   * returned. If `errorRecovery` is `false`, the error is instead thrown.
   *
   * The return type is marked as `never` for simplicity, as error recovery
   * will create types in an invalid AST shape.
   */
  raise<ErrorDetails = object>(
    toParseError: ParseErrorConstructor<ErrorDetails>,
    at: Position | Undone<Node>,
    details: ErrorDetails = {} as ErrorDetails,
  ): ParseError<ErrorDetails> {
    const loc = at instanceof Position ? at : at.loc.start;
    const error = toParseError(loc, details);

    if (!(this.optionFlags & OptionFlags.ErrorRecovery)) throw error;
    if (!this.isLookahead) this.state.errors.push(error);

    return error;
  }

  /**
   * If `errorRecovery` is `false`, this method behaves identically to `raise`.
   * If `errorRecovery` is `true`, this method will first see if there is
   * already an error stored at the same `Position`, and replaces it with the
   * one generated here.
   */
  raiseOverwrite<ErrorDetails>(
    toParseError: ParseErrorConstructor<ErrorDetails>,
    at: Position | Undone<Node>,
    details: ErrorDetails = {} as ErrorDetails,
  ): ParseError<ErrorDetails> | never {
    const loc = at instanceof Position ? at : at.loc.start;
    const pos = loc.index;
    const errors = this.state.errors;

    for (let i = errors.length - 1; i >= 0; i--) {
      const error = errors[i];
      if (error.loc.index === pos) {
        return (errors[i] = toParseError(loc, details));
      }
      if (error.loc.index < pos) break;
    }

    return this.raise(toParseError, at, details);
  }

  // updateContext is used by the jsx plugin
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateContext(prevType: TokenType): void {}

  // Raise an unexpected token error. Can take the expected token type.
  unexpected(loc?: Position | null, type?: TokenType): void {
    throw this.raise(
      Errors.UnexpectedToken,
      loc != null ? loc : this.state.startLoc,
      {
        expected: type ? tokenLabelName(type) : null,
      },
    );
  }

  expectPlugin(pluginName: Plugin, loc?: Position): true {
    if (this.hasPlugin(pluginName)) {
      return true;
    }

    throw this.raise(
      Errors.MissingPlugin,
      loc != null ? loc : this.state.startLoc,
      {
        missingPlugin: [pluginName],
      },
    );
  }

  expectOnePlugin(pluginNames: Plugin[]): void {
    if (!pluginNames.some(name => this.hasPlugin(name))) {
      throw this.raise(Errors.MissingOneOfPlugins, this.state.startLoc, {
        missingPlugin: pluginNames,
      });
    }
  }

  errorBuilder(error: ParseErrorConstructor<object>) {
    return (pos: number, lineStart: number, curLine: number) => {
      this.raise(error, buildPosition(pos, lineStart, curLine));
    };
  }

  errorHandlers_readInt: IntErrorHandlers = {
    invalidDigit: (pos, lineStart, curLine, radix) => {
      if (!(this.optionFlags & OptionFlags.ErrorRecovery)) return false;

      this.raise(Errors.InvalidDigit, buildPosition(pos, lineStart, curLine), {
        radix,
      });
      // Continue parsing the number as if there was no invalid digit.
      return true;
    },
    numericSeparatorInEscapeSequence: this.errorBuilder(
      Errors.NumericSeparatorInEscapeSequence,
    ),
    unexpectedNumericSeparator: this.errorBuilder(
      Errors.UnexpectedNumericSeparator,
    ),
  };

  errorHandlers_readCodePoint: CodePointErrorHandlers = {
    ...this.errorHandlers_readInt,
    invalidEscapeSequence: this.errorBuilder(Errors.InvalidEscapeSequence),
    invalidCodePoint: this.errorBuilder(Errors.InvalidCodePoint),
  };

  errorHandlers_readStringContents_string: StringContentsErrorHandlers = {
    ...this.errorHandlers_readCodePoint,
    strictNumericEscape: (pos, lineStart, curLine) => {
      this.recordStrictModeErrors(
        Errors.StrictNumericEscape,
        buildPosition(pos, lineStart, curLine),
      );
    },
    unterminated: (pos, lineStart, curLine) => {
      throw this.raise(
        Errors.UnterminatedString, // Report the error at the string quote
        buildPosition(pos - 1, lineStart, curLine),
      );
    },
  };

  errorHandlers_readStringContents_template: StringContentsErrorHandlers = {
    ...this.errorHandlers_readCodePoint,
    strictNumericEscape: this.errorBuilder(Errors.StrictNumericEscape),
    unterminated: (pos, lineStart, curLine) => {
      throw this.raise(
        Errors.UnterminatedTemplate,
        buildPosition(pos, lineStart, curLine),
      );
    },
  };
}
