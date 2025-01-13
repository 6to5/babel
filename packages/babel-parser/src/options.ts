import type { PluginList } from "./plugin-utils.ts";

// A second optional argument can be given to further configure
// the parser process. These options are recognized:

export type SourceType = "script" | "module" | "unambiguous";

export interface Options {
  sourceType?: SourceType;
  sourceFilename?: string;
  startIndex?: number;
  startColumn?: number;
  startLine?: number;
  allowAwaitOutsideFunction?: boolean;
  allowReturnOutsideFunction?: boolean;
  allowNewTargetOutsideFunction?: boolean;
  allowImportExportEverywhere?: boolean;
  allowSuperOutsideMethod?: boolean;
  allowUndeclaredExports?: boolean;
  plugins?: PluginList;
  strictMode?: boolean | undefined | null;
  ranges?: boolean;
  locations?: boolean;
  tokens?: boolean;
  createImportExpressions?: boolean;
  createParenthesizedExpressions?: boolean;
  errorRecovery?: boolean;
  attachComment?: boolean;
  annexB?: boolean;
}

export const enum OptionFlags {
  AllowAwaitOutsideFunction = 1 << 0,
  AllowReturnOutsideFunction = 1 << 1,
  AllowNewTargetOutsideFunction = 1 << 2,
  AllowImportExportEverywhere = 1 << 3,
  AllowSuperOutsideMethod = 1 << 4,
  AllowUndeclaredExports = 1 << 5,
  Ranges = 1 << 6,
  Locations = 1 << 7,
  Tokens = 1 << 8,
  CreateImportExpressions = 1 << 9,
  CreateParenthesizedExpressions = 1 << 10,
  ErrorRecovery = 1 << 11,
  AttachComment = 1 << 12,
  AnnexB = 1 << 13,
}

type OptionsWithDefaults = { [P in keyof Options]-?: Options[P] };

function createDefaultOptions(): OptionsWithDefaults {
  return {
    // Source type ("script" or "module") for different semantics
    sourceType: "script",
    // Source filename.
    sourceFilename: undefined,
    // Index (0-based) from which to start counting source. Useful for
    // integration with other tools.
    startIndex: 0,
    // Column (0-based) from which to start counting source. Useful for
    // integration with other tools.
    startColumn: 0,
    // Line (1-based) from which to start counting source. Useful for
    // integration with other tools.
    startLine: 1,
    // When enabled, await at the top level is not considered an
    // error.
    allowAwaitOutsideFunction: false,
    // When enabled, a return at the top level is not considered an
    // error.
    allowReturnOutsideFunction: false,
    // When enabled, new.target outside a function or class is not
    // considered an error.
    allowNewTargetOutsideFunction: false,
    // When enabled, import/export statements are not constrained to
    // appearing at the top of the program.
    allowImportExportEverywhere: false,
    // TODO
    allowSuperOutsideMethod: false,
    // When enabled, export statements can reference undeclared variables.
    allowUndeclaredExports: false,
    // An array of plugins to enable
    plugins: [],
    // TODO
    strictMode: null,
    // Nodes have their start and end characters offsets recorded in
    // `start` and `end` properties (directly on the node, rather than
    // the `loc` object, which holds line/column data. To also add a
    // [semi-standardized][range] `range` property holding a `[start,
    // end]` array with the same numbers, set the `ranges` option to
    // `true`.
    //
    // [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
    ranges: false,
    // Nodes have their start and end line/columns recorded in `loc` property.
    locations: true,
    // Adds all parsed tokens to a `tokens` property on the `File` node
    tokens: false,
    // Whether to create ImportExpression AST nodes (if false
    // `import(foo)` will be parsed as CallExpression(Import, [Identifier(foo)])
    createImportExpressions: process.env.BABEL_8_BREAKING ? true : false,
    // Whether to create ParenthesizedExpression AST nodes (if false
    // the parser sets extra.parenthesized on the expression nodes instead).
    createParenthesizedExpressions: false,
    // When enabled, errors are attached to the AST instead of being directly thrown.
    // Some errors will still throw, because @babel/parser can't always recover.
    errorRecovery: false,
    // When enabled, comments will be attached to adjacent AST nodes as one of
    // `leadingComments`, `trailingComments` and `innerComments`. The comment attachment
    // is vital to preserve comments after transform. If you don't print AST back,
    // consider set this option to `false` for performance
    attachComment: true,
    // When enabled, the parser will support Annex B syntax.
    // https://tc39.es/ecma262/#sec-additional-ecmascript-features-for-web-browsers
    annexB: true,
  };
}

// Interpret and default an options object

export function getOptions(opts?: Options | null): OptionsWithDefaults {
  // https://github.com/babel/babel/pull/16918
  // `options` is accessed frequently, please make sure it is a fast object.
  // `%ToFastProperties` can make it a fast object, but the performance is the same as the slow object.
  const options: any = createDefaultOptions();

  if (opts == null) {
    return options;
  }
  if (opts.annexB != null && opts.annexB !== false) {
    throw new Error("The `annexB` option can only be set to `false`.");
  }

  for (const key of Object.keys(options) as (keyof Options)[]) {
    if (opts[key] != null) options[key] = opts[key];
  }

  if (options.startLine === 1) {
    if (opts.startIndex == null && options.startColumn > 0) {
      options.startIndex = options.startColumn;
    } else if (opts.startColumn == null && options.startIndex > 0) {
      options.startColumn = options.startIndex;
    }
  } else if (opts.startColumn == null || opts.startIndex == null) {
    if (opts.startIndex != null || process.env.BABEL_8_BREAKING) {
      throw new Error(
        "With a `startLine > 1` you must also specify `startIndex` and `startColumn`.",
      );
    }
  }

  return options;
}
