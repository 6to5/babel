import path from "path";
import type { ResolvedConfig } from "../config/index.ts";

export default function normalizeOptions(config: ResolvedConfig): {} {
  // TODO: Everything in this function is basically typed as `any`. Improve it.

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
      sourceFileName,
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
