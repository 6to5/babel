import path from "path";
import type { ResolvedConfig } from "../config/index.ts";

export default function normalizeOptions(config: ResolvedConfig): {} {
  // TODO: Everything in this function is basically typed as `any`. Improve it.

  // TODO(@nicolo-ribaudo): Currently, soure map's `sources` is generated taking
  // into account both the options passed to the parser and the options passed
  // to the generator. If they disagree, both are included. Clean this up, so
  // that there is a single source of thruth.

  const {
    filename,
    cwd,
    filenameRelative = typeof filename === "string"
      ? path.relative(cwd, filename)
      : "unknown",
    sourceType = "module",
    inputSourceMap,
    sourceMaps = !!inputSourceMap,
    sourceRoot = process.env.BABEL_8_BREAKING
      ? undefined
      : config.options.moduleRoot,

    sourceFileName = filenameRelative === "unknown"
      ? undefined
      : filenameRelative,

    comments = true,
    compact = "auto",
  } = config.options;

  const opts = config.options;

  const options = {
    ...opts,

    parserOpts: {
      sourceType:
        path.extname(filenameRelative) === ".mjs" ? "module" : sourceType,

      // TODO: @babel/parser uses sourceFilename, while @babel/generator and
      // @babel/core use sourceFileName. Eventualy align them.
      // https://github.com/babel/babel/pull/13518
      sourceFilename: sourceFileName,
      plugins: [],
      ...opts.parserOpts,
    },

    generatorOpts: {
      // General generator flags.
      filename,

      auxiliaryCommentBefore: opts.auxiliaryCommentBefore,
      auxiliaryCommentAfter: opts.auxiliaryCommentAfter,
      retainLines: opts.retainLines,
      comments,
      shouldPrintComment: opts.shouldPrintComment,
      compact,
      minified: opts.minified,

      // Source-map generation flags.
      sourceMaps,

      sourceRoot,
      sourceFileName:
        // If there is no filename, we use `"unknown"` in the source map
        // `sources` array as a fallback. Due to how @babel/generator works,
        // if we passed `undefined` there would be no generated mappings.
        // Additionally, `undefined` isn't JSON-serializable.
        sourceFileName == null
          ? "unknown"
          : sourceRoot == null
          ? sourceFileName
          : // @babel/generator will prepend sourceFileName with sourceRoot,
            // so we need to remove it here.
            path.relative(sourceRoot, sourceFileName),
      ...opts.generatorOpts,
    },
  };

  for (const plugins of config.passes) {
    for (const plugin of plugins) {
      if (plugin.manipulateOptions) {
        plugin.manipulateOptions(options, options.parserOpts);
      }
    }
  }

  return options;
}
