import fs from "fs";

import { Command } from "commander";
import { version, DEFAULT_EXTENSIONS } from "@babel/core";
import glob from "glob";

import type { InputOptions } from "@babel/core";

const command = new Command();

// Standard Babel input configs.
command.option(
  "-f, --filename [filename]",
  "The filename to use when reading from stdin. This will be used in source-maps, errors etc.",
);
command.option(
  "--presets [list]",
  "A comma-separated list of preset names.",
  collect,
);
command.option(
  "--plugins [list]",
  "A comma-separated list of plugin names.",
  collect,
);
command.option("--config-file [path]", "Path to a .babelrc file to use.");
command.option(
  "--env-name [name]",
  "The name of the 'env' to use when loading configs and plugins. " +
    "Defaults to the value of BABEL_ENV, or else NODE_ENV, or else 'development'.",
);
command.option(
  "--root-mode [mode]",
  "The project-root resolution mode. " +
    "One of 'root' (the default), 'upward', or 'upward-optional'.",
);

// Basic file input configuration.
command.option("--source-type [script|module]", "");
command.option(
  "--no-babelrc",
  "Whether or not to look up .babelrc and .babelignore files.",
);
command.option(
  "--ignore [list]",
  "List of glob paths to **not** compile.",
  collect,
);
command.option(
  "--only [list]",
  "List of glob paths to **only** compile.",
  collect,
);

// Misc babel config.
command.option(
  "--no-highlight-code",
  "Enable or disable ANSI syntax highlighting of code frames. (on by default)",
);

// General output formatting.
command.option(
  "--no-comments",
  "Write comments to generated output. (true by default)",
);
command.option(
  "--retain-lines",
  "Retain line numbers. This will result in really ugly code.",
);
command.option(
  "--compact [true|false|auto]",
  "Do not include superfluous whitespace characters and line terminators.",
  booleanify,
);
command.option(
  "--minified",
  "Save as many bytes when printing. (false by default)",
);
command.option(
  "--auxiliary-comment-before [string]",
  "Print a comment before any injected non-user code.",
);
command.option(
  "--auxiliary-comment-after [string]",
  "Print a comment after any injected non-user code.",
);

// General source map formatting.
command.option(
  "-s, --source-maps [true|false|inline|both]",
  "",
  booleanify,
  undefined,
);
command.option(
  "--source-map-target [string]",
  "Set `file` on returned source map.",
);
command.option(
  "--source-file-name [string]",
  "Set `sources[0]` on returned source map.",
);
command.option(
  "--source-root [filename]",
  "The root from which all sources are relative.",
);

if (!process.env.BABEL_8_BREAKING) {
  // Config params for certain module output formats.
  command.option(
    "--module-root [filename]",
    // eslint-disable-next-line max-len
    "Optional prefix for the AMD module formatter that will be prepended to the filename on module definitions.",
  );
  command.option("-M, --module-ids", "Insert an explicit id for modules.");
  command.option(
    "--module-id [string]",
    "Specify a custom name for module ids.",
  );
}

// "babel" command specific arguments that are not passed to @babel/core.
command.option(
  "-x, --extensions [extensions]",
  "List of extensions to compile when a directory has been the input. [" +
    DEFAULT_EXTENSIONS.join() +
    "]",
  collect,
);
command.option(
  "--keep-file-extension",
  "Preserve the file extensions of the input files.",
);
command.option("-w, --watch", "Recompile files on changes.");
command.option("--skip-initial-build", "Do not compile files before watching.");
command.option(
  "-o, --out-file [out]",
  "Compile all input files into a single file.",
);
command.option(
  "-d, --out-dir [out]",
  "Compile an input directory of modules into an output directory.",
);
command.option(
  "--relative",
  "Compile into an output directory relative to input directory or file. Requires --out-dir [out]",
);

command.option(
  "-D, --copy-files",
  "When compiling a directory copy over non-compilable files.",
);
command.option(
  "--include-dotfiles",
  "Include dotfiles when compiling and copying non-compilable files.",
);
command.option(
  "--no-copy-ignored",
  "Exclude ignored files when copying non-compilable files.",
);

command.option(
  "--verbose",
  "Log everything. This option conflicts with --quiet",
);
command.option(
  "--quiet",
  "Don't log anything. This option conflicts with --verbose",
);
command.option(
  "--delete-dir-on-start",
  "Delete the out directory before compilation.",
);
command.option(
  "--out-file-extension [string]",
  "Use a specific extension for the output files",
);

declare const PACKAGE_JSON: { name: string; version: string };
command.version(PACKAGE_JSON.version + " (@babel/core " + version + ")");
command.usage("[options] <files ...>");
// register an empty action handler so that commander.js can throw on
// unknown options _after_ args
// see https://github.com/tj/commander.js/issues/561#issuecomment-522209408
command.action(() => {});

export type CmdOptions = {
  babelOptions: InputOptions;
  cliOptions: {
    filename: string;
    filenames: string[];
    extensions: string[];
    keepFileExtension: boolean;
    outFileExtension: string;
    watch: boolean;
    skipInitialBuild: boolean;
    outFile: string;
    outDir: string;
    relative: boolean;
    copyFiles: boolean;
    copyIgnored: boolean;
    includeDotfiles: boolean;
    verbose: boolean;
    quiet: boolean;
    deleteDirOnStart: boolean;
    sourceMapTarget: string;
  };
};

export default function parseArgv(args: Array<string>): CmdOptions | null {
  command.parse(args);

  const errors: string[] = [];

  let filenames = command.args.reduce(function (globbed: string[], input) {
    let files = glob.sync(input);
    if (!files.length) files = [input];
    globbed.push(...files);
    return globbed;
  }, []);

  filenames = Array.from(new Set(filenames));

  filenames.forEach(function (filename) {
    if (!fs.existsSync(filename)) {
      errors.push(filename + " does not exist");
    }
  });

  const opts = command.opts();

  if (opts.outDir && !filenames.length) {
    errors.push("--out-dir requires filenames");
  }

  if (opts.outFile && opts.outDir) {
    errors.push("--out-file and --out-dir cannot be used together");
  }

  if (opts.relative && !opts.outDir) {
    errors.push("--relative requires --out-dir usage");
  }

  if (opts.watch) {
    if (!opts.outFile && !opts.outDir) {
      errors.push("--watch requires --out-file or --out-dir");
    }

    if (!filenames.length) {
      errors.push("--watch requires filenames");
    }
  }

  if (opts.skipInitialBuild && !opts.watch) {
    errors.push("--skip-initial-build requires --watch");
  }
  if (opts.deleteDirOnStart && !opts.outDir) {
    errors.push("--delete-dir-on-start requires --out-dir");
  }

  if (opts.verbose && opts.quiet) {
    errors.push("--verbose and --quiet cannot be used together");
  }

  if (
    !opts.outDir &&
    filenames.length === 0 &&
    typeof opts.filename !== "string" &&
    opts.babelrc !== false
  ) {
    errors.push(
      "stdin compilation requires either -f/--filename [filename] or --no-babelrc",
    );
  }

  if (opts.keepFileExtension && opts.outFileExtension) {
    errors.push(
      "--out-file-extension cannot be used with --keep-file-extension",
    );
  }

  if (errors.length) {
    console.error("babel:");
    errors.forEach(function (e) {
      console.error("  " + e);
    });
    return null;
  }

  const babelOptions: InputOptions = {
    presets: opts.presets,
    plugins: opts.plugins,
    rootMode: opts.rootMode,
    configFile: opts.configFile,
    envName: opts.envName,
    sourceType: opts.sourceType,
    ignore: opts.ignore,
    only: opts.only,
    retainLines: opts.retainLines,
    compact: opts.compact,
    minified: opts.minified,
    auxiliaryCommentBefore: opts.auxiliaryCommentBefore,
    auxiliaryCommentAfter: opts.auxiliaryCommentAfter,
    sourceMaps: opts.sourceMaps,
    sourceFileName: opts.sourceFileName,
    sourceRoot: opts.sourceRoot,

    // Commander will default the "--no-" arguments to true, but we want to
    // leave them undefined so that @babel/core can handle the
    // default-assignment logic on its own.
    babelrc: opts.babelrc === true ? undefined : opts.babelrc,
    highlightCode: opts.highlightCode === true ? undefined : opts.highlightCode,
    comments: opts.comments === true ? undefined : opts.comments,
  };

  if (!process.env.BABEL_8_BREAKING) {
    Object.assign(babelOptions, {
      moduleRoot: opts.moduleRoot,
      moduleIds: opts.moduleIds,
      moduleId: opts.moduleId,
    });
  }

  // If the @babel/cli version is newer than the @babel/core version, and we have added
  // new options for @babel/core, we'll potentially get option validation errors from
  // @babel/core. To avoid that, we delete undefined options, so @babel/core will only
  // give the error if users actually pass an unsupported CLI option.
  for (const key of Object.keys(babelOptions) as Array<
    keyof typeof babelOptions
  >) {
    if (babelOptions[key] === undefined) {
      delete babelOptions[key];
    }
  }

  return {
    babelOptions,
    cliOptions: {
      filename: opts.filename,
      filenames,
      extensions: opts.extensions,
      keepFileExtension: opts.keepFileExtension,
      outFileExtension: opts.outFileExtension,
      watch: opts.watch,
      skipInitialBuild: opts.skipInitialBuild,
      outFile: opts.outFile,
      outDir: opts.outDir,
      relative: opts.relative,
      copyFiles: opts.copyFiles,
      copyIgnored: opts.copyFiles && opts.copyIgnored,
      includeDotfiles: opts.includeDotfiles,
      verbose: opts.verbose,
      quiet: opts.quiet,
      deleteDirOnStart: opts.deleteDirOnStart,
      sourceMapTarget: opts.sourceMapTarget,
    },
  };
}

function booleanify(val: any): boolean | any {
  if (val === undefined) return undefined;

  if (val === "true" || val == 1) {
    return true;
  }

  if (val === "false" || val == 0 || !val) {
    return false;
  }

  return val;
}

function collect(
  value: string | any,
  previousValue: Array<string>,
): Array<string> {
  // If the user passed the option with no value, like "babel file.js --presets", do nothing.
  if (typeof value !== "string") return previousValue;

  const values = value.split(",");

  if (previousValue) {
    previousValue.push(...values);
    return previousValue;
  }
  return values;
}
