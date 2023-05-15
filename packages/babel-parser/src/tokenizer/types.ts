import { types as tc, type TokContext } from "./context";
// ## Token types

// The assignment of fine-grained, information-carrying type objects
// allows the tokenizer to store the information it has about a
// token in a way that is very cheap for the parser to look up.

// All token type variables start with an underscore, to make them
// easy to recognize.

// The `beforeExpr` property is used to disambiguate between 1) binary
// expression (<) and JSX Tag start (<name>); 2) object literal and JSX
// texts. It is set on the `updateContext` function in the JSX plugin.

// The `startsExpr` property is used to determine whether an expression
// may be the “argument” subexpression of a `yield` expression or
// `yield` statement. It is set on all token types that may be at the
// start of a subexpression.

// `isLoop` marks a keyword as starting a loop, which is important
// to know when parsing a label, in order to allow or disallow
// continue jumps to that label.

const beforeExpr = true;
const startsExpr = true;
const isLoop = true;
const isAssign = true;
const prefix = true;
const postfix = true;

type TokenOptions = {
  keyword?: string;
  beforeExpr?: boolean;
  startsExpr?: boolean;
  rightAssociative?: boolean;
  isLoop?: boolean;
  isAssign?: boolean;
  prefix?: boolean;
  postfix?: boolean;
  binop?: number | null;
};

// Internally the tokenizer stores token as a number
export type TokenType = number;

// The `ExportedTokenType` is exported via `tokTypes` and accessible
// when `tokens: true` is enabled. Unlike internal token type, it provides
// metadata of the tokens.
export class ExportedTokenType {
  label: string;
  keyword: string | undefined | null;
  beforeExpr: boolean;
  startsExpr: boolean;
  rightAssociative: boolean;
  isLoop: boolean;
  isAssign: boolean;
  prefix: boolean;
  postfix: boolean;
  binop: number | undefined | null;
  // todo(Babel 8): remove updateContext from exposed token layout
  declare updateContext:
    | ((context: Array<TokContext>) => void)
    | undefined
    | null;

  constructor(label: string, conf: TokenOptions = {}) {
    this.label = label;
    this.keyword = conf.keyword;
    this.beforeExpr = !!conf.beforeExpr;
    this.startsExpr = !!conf.startsExpr;
    this.rightAssociative = !!conf.rightAssociative;
    this.isLoop = !!conf.isLoop;
    this.isAssign = !!conf.isAssign;
    this.prefix = !!conf.prefix;
    this.postfix = !!conf.postfix;
    this.binop = conf.binop != null ? conf.binop : null;
    if (!process.env.BABEL_8_BREAKING) {
      this.updateContext = null;
    }
  }
}

// A map from keyword/keyword-like string value to the token type
export const keywords = new Map<string, TokenType>();

function createKeyword(name: string, options: TokenOptions = {}): TokenType {
  options.keyword = name;
  const token = createToken(name, options);
  keywords.set(name, token);
  return token;
}

function createBinop(name: string, binop: number) {
  return createToken(name, { beforeExpr, binop });
}

let tokenTypeCounter = -1;
export const tokenTypes: ExportedTokenType[] = [];
const tokenLabels: string[] = [];
const tokenBinops: number[] = [];
const tokenBeforeExprs: boolean[] = [];
const tokenStartsExprs: boolean[] = [];
const tokenPrefixes: boolean[] = [];

function createToken(name: string, options: TokenOptions = {}): TokenType {
  ++tokenTypeCounter;
  tokenLabels.push(name);
  tokenBinops.push(options.binop ?? -1);
  tokenBeforeExprs.push(options.beforeExpr ?? false);
  tokenStartsExprs.push(options.startsExpr ?? false);
  tokenPrefixes.push(options.prefix ?? false);
  tokenTypes.push(new ExportedTokenType(name, options));

  return tokenTypeCounter;
}

function createKeywordLike(
  name: string,
  options: TokenOptions = {},
): TokenType {
  ++tokenTypeCounter;
  keywords.set(name, tokenTypeCounter);
  tokenLabels.push(name);
  tokenBinops.push(options.binop ?? -1);
  tokenBeforeExprs.push(options.beforeExpr ?? false);
  tokenStartsExprs.push(options.startsExpr ?? false);
  tokenPrefixes.push(options.prefix ?? false);
  // In the exported token type, we set the label as "name" for backward compatibility with Babel 7
  tokenTypes.push(new ExportedTokenType("name", options));

  return tokenTypeCounter;
}

// For performance the token type helpers depend on the following declarations order.
// When adding new token types, please also check if the token helpers need update.

export type InternalTokenTypes = typeof tt;

export const tt = {
  // Punctuation token types.
  bracketL: createToken("[", { beforeExpr, startsExpr }),
  bracketHashL: createToken("#[", { beforeExpr, startsExpr }),
  bracketBarL: createToken("[|", { beforeExpr, startsExpr }),
  bracketR: createToken("]"),
  bracketBarR: createToken("|]"),
  braceL: createToken("{", { beforeExpr, startsExpr }),
  braceBarL: createToken("{|", { beforeExpr, startsExpr }),
  braceHashL: createToken("#{", { beforeExpr, startsExpr }),
  braceR: createToken("}"),
  braceBarR: createToken("|}"),
  parenL: createToken("(", { beforeExpr, startsExpr }),
  parenR: createToken(")"),
  comma: createToken(",", { beforeExpr }),
  semi: createToken(";", { beforeExpr }),
  colon: createToken(":", { beforeExpr }),
  doubleColon: createToken("::", { beforeExpr }),
  dot: createToken("."),
  question: createToken("?", { beforeExpr }),
  questionDot: createToken("?."),
  arrow: createToken("=>", { beforeExpr }),
  template: createToken("template"),
  ellipsis: createToken("...", { beforeExpr }),
  backQuote: createToken("`", { startsExpr }),
  dollarBraceL: createToken("${", { beforeExpr, startsExpr }),
  // start: isTemplate
  templateTail: createToken("...`", { startsExpr }),
  templateNonTail: createToken("...${", { beforeExpr, startsExpr }),
  // end: isTemplate
  at: createToken("@"),
  hash: createToken("#", { startsExpr }),

  // Special hashbang token.
  interpreterDirective: createToken("#!..."),

  // Operators. These carry several kinds of properties to help the
  // parser use them properly (the presence of these properties is
  // what categorizes them as operators).
  //
  // `binop`, when present, specifies that this operator is a binary
  // operator, and will refer to its precedence.
  //
  // `prefix` and `postfix` mark the operator as a prefix or postfix
  // unary operator.
  //
  // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
  // binary operators with a very low precedence, that should result
  // in AssignmentExpression nodes.

  // start: isAssign
  eq: createToken("=", { beforeExpr, isAssign }),
  assign: createToken("_=", { beforeExpr, isAssign }),
  slashAssign: createToken("_=", { beforeExpr, isAssign }),
  // These are only needed to support % and ^ as a Hack-pipe topic token.
  // When the proposal settles on a token, the others can be merged with
  // tt.assign.
  xorAssign: createToken("_=", { beforeExpr, isAssign }),
  moduloAssign: createToken("_=", { beforeExpr, isAssign }),
  // end: isAssign

  incDec: createToken("++/--", { prefix, postfix, startsExpr }),
  bang: createToken("!", { beforeExpr, prefix, startsExpr }),
  tilde: createToken("~", { beforeExpr, prefix, startsExpr }),

  // More possible topic tokens.
  // When the proposal settles on a token, at least one of these may be removed.
  doubleCaret: createToken("^^", { startsExpr }),
  doubleAt: createToken("@@", { startsExpr }),

  // start: isBinop
  pipeline: createBinop("|>", 0),
  nullishCoalescing: createBinop("??", 1),
  logicalOR: createBinop("||", 1),
  logicalAND: createBinop("&&", 2),
  bitwiseOR: createBinop("|", 3),
  bitwiseXOR: createBinop("^", 4),
  bitwiseAND: createBinop("&", 5),
  equality: createBinop("==/!=/===/!==", 6),
  lt: createBinop("</>/<=/>=", 7),
  gt: createBinop("</>/<=/>=", 7),
  relational: createBinop("</>/<=/>=", 7),
  bitShift: createBinop("<</>>/>>>", 8),
  bitShiftL: createBinop("<</>>/>>>", 8),
  bitShiftR: createBinop("<</>>/>>>", 8),
  plusMin: createToken("+/-", { beforeExpr, binop: 9, prefix, startsExpr }),
  // startsExpr: required by v8intrinsic plugin
  modulo: createToken("%", { binop: 10, startsExpr }),
  // unset `beforeExpr` as it can be `function *`
  star: createToken("*", { binop: 10 }),
  slash: createBinop("/", 10),
  exponent: createToken("**", {
    beforeExpr,
    binop: 11,
    rightAssociative: true,
  }),

  // Keywords
  // Don't forget to update packages/babel-helper-validator-identifier/src/keyword.js
  // when new keywords are added
  // start: isLiteralPropertyName
  // start: isKeyword
  _in: createKeyword("in", { beforeExpr, binop: 7 }),
  _instanceof: createKeyword("instanceof", { beforeExpr, binop: 7 }),
  // end: isBinop
  _break: createKeyword("break"),
  _case: createKeyword("case", { beforeExpr }),
  _catch: createKeyword("catch"),
  _continue: createKeyword("continue"),
  _debugger: createKeyword("debugger"),
  _default: createKeyword("default", { beforeExpr }),
  _else: createKeyword("else", { beforeExpr }),
  _finally: createKeyword("finally"),
  _function: createKeyword("function", { startsExpr }),
  _if: createKeyword("if"),
  _return: createKeyword("return", { beforeExpr }),
  _switch: createKeyword("switch"),
  _throw: createKeyword("throw", { beforeExpr, prefix, startsExpr }),
  _try: createKeyword("try"),
  _var: createKeyword("var"),
  _const: createKeyword("const"),
  _with: createKeyword("with"),
  _new: createKeyword("new", { beforeExpr, startsExpr }),
  _this: createKeyword("this", { startsExpr }),
  _super: createKeyword("super", { startsExpr }),
  _class: createKeyword("class", { startsExpr }),
  _extends: createKeyword("extends", { beforeExpr }),
  _export: createKeyword("export"),
  _import: createKeyword("import", { startsExpr }),
  _null: createKeyword("null", { startsExpr }),
  _true: createKeyword("true", { startsExpr }),
  _false: createKeyword("false", { startsExpr }),
  _typeof: createKeyword("typeof", { beforeExpr, prefix, startsExpr }),
  _void: createKeyword("void", { beforeExpr, prefix, startsExpr }),
  _delete: createKeyword("delete", { beforeExpr, prefix, startsExpr }),
  // start: isLoop
  _do: createKeyword("do", { isLoop, beforeExpr }),
  _for: createKeyword("for", { isLoop }),
  _while: createKeyword("while", { isLoop }),
  // end: isLoop
  // end: isKeyword

  // Primary literals
  // start: isIdentifier
  _as: createKeywordLike("as", { startsExpr }),
  _assert: createKeywordLike("assert", { startsExpr }),
  _async: createKeywordLike("async", { startsExpr }),
  _await: createKeywordLike("await", { startsExpr }),
  _from: createKeywordLike("from", { startsExpr }),
  _get: createKeywordLike("get", { startsExpr }),
  _let: createKeywordLike("let", { startsExpr }),
  _meta: createKeywordLike("meta", { startsExpr }),
  _of: createKeywordLike("of", { startsExpr }),
  _sent: createKeywordLike("sent", { startsExpr }),
  _set: createKeywordLike("set", { startsExpr }),
  _static: createKeywordLike("static", { startsExpr }),
  _using: createKeywordLike("using", { startsExpr }),
  _yield: createKeywordLike("yield", { startsExpr }),
  // start: isAwaitOperation
  _all: createKeywordLike("all", { startsExpr }),
  _allSettled: createKeywordLike("allSettled", { startsExpr }),
  _any: createKeywordLike("any", { startsExpr }),
  _race: createKeywordLike("race", { startsExpr }),
  // end: isAwaitOperation

  // Flow and TypeScript Keywordlike
  _asserts: createKeywordLike("asserts", { startsExpr }),
  _checks: createKeywordLike("checks", { startsExpr }),
  _exports: createKeywordLike("exports", { startsExpr }),
  _global: createKeywordLike("global", { startsExpr }),
  _implements: createKeywordLike("implements", { startsExpr }),
  _intrinsic: createKeywordLike("intrinsic", { startsExpr }),
  _infer: createKeywordLike("infer", { startsExpr }),
  _is: createKeywordLike("is", { startsExpr }),
  _mixins: createKeywordLike("mixins", { startsExpr }),
  _proto: createKeywordLike("proto", { startsExpr }),
  _require: createKeywordLike("require", { startsExpr }),
  _satisfies: createKeywordLike("satisfies", { startsExpr }),
  // start: isTSTypeOperator
  _keyof: createKeywordLike("keyof", { startsExpr }),
  _readonly: createKeywordLike("readonly", { startsExpr }),
  _unique: createKeywordLike("unique", { startsExpr }),
  // end: isTSTypeOperator
  // start: isTSDeclarationStart
  _abstract: createKeywordLike("abstract", { startsExpr }),
  _declare: createKeywordLike("declare", { startsExpr }),
  _enum: createKeywordLike("enum", { startsExpr }),
  _module: createKeywordLike("module", { startsExpr }),
  _namespace: createKeywordLike("namespace", { startsExpr }),
  // start: isFlowInterfaceOrTypeOrOpaque
  _interface: createKeywordLike("interface", { startsExpr }),
  _type: createKeywordLike("type", { startsExpr }),
  // end: isTSDeclarationStart
  _opaque: createKeywordLike("opaque", { startsExpr }),
  // end: isFlowInterfaceOrTypeOrOpaque
  name: createToken("name", { startsExpr }),
  // end: isIdentifier

  string: createToken("string", { startsExpr }),
  num: createToken("num", { startsExpr }),
  bigint: createToken("bigint", { startsExpr }),
  decimal: createToken("decimal", { startsExpr }),
  // end: isLiteralPropertyName
  regexp: createToken("regexp", { startsExpr }),
  privateName: createToken("#name", { startsExpr }),
  eof: createToken("eof"),

  // jsx plugin
  jsxName: createToken("jsxName"),
  jsxText: createToken("jsxText", { beforeExpr: true }),
  jsxTagStart: createToken("jsxTagStart", { startsExpr: true }),
  jsxTagEnd: createToken("jsxTagEnd"),

  // placeholder plugin
  placeholder: createToken("%%", { startsExpr: true }),
} as const;

export function tokenIsIdentifier(token: TokenType): boolean {
  return token >= tt._as && token <= tt.name;
}

export function tokenIsAwaitOperation(token: TokenType): boolean {
  return token >= tt._all && token <= tt._race;
}

export function tokenKeywordOrIdentifierIsKeyword(token: TokenType): boolean {
  // we can remove the token >= tt._in check when we
  // know a token is either keyword or identifier
  return token <= tt._while;
}

export function tokenIsKeywordOrIdentifier(token: TokenType): boolean {
  return token >= tt._in && token <= tt.name;
}

export function tokenIsLiteralPropertyName(token: TokenType): boolean {
  return token >= tt._in && token <= tt.decimal;
}

export function tokenComesBeforeExpression(token: TokenType): boolean {
  return tokenBeforeExprs[token];
}

export function tokenCanStartExpression(token: TokenType): boolean {
  return tokenStartsExprs[token];
}

export function tokenIsAssignment(token: TokenType): boolean {
  return token >= tt.eq && token <= tt.moduloAssign;
}

export function tokenIsFlowInterfaceOrTypeOrOpaque(token: TokenType): boolean {
  return token >= tt._interface && token <= tt._opaque;
}

export function tokenIsLoop(token: TokenType): boolean {
  return token >= tt._do && token <= tt._while;
}

export function tokenIsKeyword(token: TokenType): boolean {
  return token >= tt._in && token <= tt._while;
}

export function tokenIsOperator(token: TokenType): boolean {
  return token >= tt.pipeline && token <= tt._instanceof;
}

export function tokenIsPostfix(token: TokenType): boolean {
  return token === tt.incDec;
}

export function tokenIsPrefix(token: TokenType): boolean {
  return tokenPrefixes[token];
}

export function tokenIsTSTypeOperator(token: TokenType): boolean {
  return token >= tt._keyof && token <= tt._unique;
}

export function tokenIsTSDeclarationStart(token: TokenType): boolean {
  return token >= tt._abstract && token <= tt._type;
}

export function tokenLabelName(token: TokenType): string {
  return tokenLabels[token];
}

export function tokenOperatorPrecedence(token: TokenType): number {
  return tokenBinops[token];
}

export function tokenIsBinaryOperator(token: TokenType): boolean {
  return tokenBinops[token] !== -1;
}

export function tokenIsRightAssociative(token: TokenType): boolean {
  return token === tt.exponent;
}

export function tokenIsTemplate(token: TokenType): boolean {
  return token >= tt.templateTail && token <= tt.templateNonTail;
}

export function getExportedToken(token: TokenType): ExportedTokenType {
  return tokenTypes[token];
}

export function isTokenType(obj: any): boolean {
  return typeof obj === "number";
}

if (!process.env.BABEL_8_BREAKING) {
  tokenTypes[tt.braceR].updateContext = context => {
    context.pop();
  };

  tokenTypes[tt.braceL].updateContext =
    tokenTypes[tt.braceHashL].updateContext =
    tokenTypes[tt.dollarBraceL].updateContext =
      context => {
        context.push(tc.brace);
      };

  tokenTypes[tt.backQuote].updateContext = context => {
    if (context[context.length - 1] === tc.template) {
      context.pop();
    } else {
      context.push(tc.template);
    }
  };

  tokenTypes[tt.jsxTagStart].updateContext = context => {
    context.push(tc.j_expr, tc.j_oTag);
  };
}
