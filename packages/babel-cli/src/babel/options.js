// @flow

import fs from "fs";
import path from "path";

import commander from "commander";
import { version } from "@babel/core";
import uniq from "lodash/uniq";
import glob from "glob";

import pkg from "../../package.json";

// Standard Babel input configs.
commander.option(
  "-f, --filename [filename]",
  "filename to use when reading from stdin - this will be used in source-maps, errors etc",
);
commander.option(
  "--presets [list]",
  "comma-separated list of preset names",
  collect,
);
commander.option(
  "--plugins [list]",
  "comma-separated list of plugin names",
  collect,
);
commander.option("--config-file [path]", "Path to a .babelrc file to use");
commander.option(
  "--env-name [name]",
  "The name of the 'env' to use when loading configs and plugins. " +
    "Defaults to the value of BABEL_ENV, or else NODE_ENV, or else 'development'.",
);
commander.option(
  "--root-mode [mode]",
  "The project-root resolution mode. " +
    "One of 'root' (the default), 'upward', or 'upward-optional'.",
);

// Basic file input configuration.
commander.option("--source-type [script|module]", "");
commander.option(
  "--no-babelrc",
  "Whether or not to look up .babelrc and .babelignore files",
);
commander.option(
  "--ignore [list]",
  "list of glob paths to **not** compile",
  collect,
);
commander.option(
  "--only [list]",
  "list of glob paths to **only** compile",
  collect,
);

// Misc babel config.
commander.option(
  "--no-highlight-code",
  "enable/disable ANSI syntax highlighting of code frames (on by default)",
);

// General output formatting.
commander.option(
  "--no-comments",
  "write comments to generated output (true by default)",
);
commander.option(
  "--retain-lines",
  "retain line numbers - will result in really ugly code",
);
commander.option(
  "--compact [true|false|auto]",
  "do not include superfluous whitespace characters and line terminators",
  booleanify,
);
commander.option("--minified", "save as much bytes when printing [true|false]");
commander.option(
  "--auxiliary-comment-before [string]",
  "print a comment before any injected non-user code",
);
commander.option(
  "--auxiliary-comment-after [string]",
  "print a comment after any injected non-user code",
);

// General source map formatting.
commander.option("-s, --source-maps [true|false|inline|both]", "", booleanify);
commander.option(
  "--source-map-target [string]",
  "set `file` on returned source map",
);
commander.option(
  "--source-file-name [string]",
  "set `sources[0]` on returned source map",
);
commander.option(
  "--source-root [filename]",
  "the root from which all sources are relative",
);

// Config params for certain module output formats.
commander.option(
  "--module-root [filename]",
  "optional prefix for the AMD module formatter that will be prepend to the filename on module definitions",
);
commander.option("-M, --module-ids", "insert an explicit id for modules");
commander.option(
  "--module-id [string]",
  "specify a custom name for module ids",
);

// "babel" command specific arguments that are not passed to @babel/core.
commander.option(
  "-x, --extensions [extensions]",
  "List of extensions to compile when a directory has been input [.es6,.js,.es,.jsx,.mjs]",
  collect,
);
commander.option(
  "--keep-file-extension",
  "Preserve the file extensions of the input files",
);
commander.option("-w, --watch", "Recompile files on changes");
commander.option(
  "--skip-initial-build",
  "Do not compile files before watching",
);
commander.option(
  "-o, --out-file [out]",
  "Compile all input files into a single file",
);
commander.option(
  "-d, --out-dir [out]",
  "Compile an input directory of modules into an output directory",
  getOutDir(),
);
commander.option(
  "--relative",
  "Compile into an output directory relative to input directory or file. Requires --out-dir [out]",
);
commander.option(
  "-D, --copy-files",
  "When compiling a directory copy over non-compilable files",
);
commander.option(
  "--include-dotfiles",
  "Include dotfiles when compiling and copying non-compilable files",
);
commander.option(
  "--verbose",
  "Log everything. This option conflicts with --quiet",
);
commander.option(
  "--quiet",
  "Don't log anything. This option conflicts with --verbose",
);
commander.option(
  "--delete-dir-on-start",
  "Delete the out directory before compilation",
);

commander.version(pkg.version + " (@babel/core " + version + ")");
commander.usage("[options] <files ...>");

export type CmdOptions = {
  babelOptions: Object,
  cliOptions: Object,
};

export default function parseArgv(args: Array<string>): CmdOptions | null {
  //
  commander.parse(args);

  const errors = [];

  if (commander.args.length === 0) {
    commander.args.push("src");
  }

  let filenames = commander.args.reduce(function(globbed, input) {
    let files = glob.sync(input);
    if (!files.length) files = [input];
    return globbed.concat(files);
  }, []);

  filenames = uniq(filenames);

  filenames.forEach(function(filename) {
    if (!fs.existsSync(filename)) {
      errors.push(filename + " does not exist");
    }
  });

  if (commander.outDir && !filenames.length) {
    errors.push("--out-dir requires filenames");
  }

  if (commander.outFile && commander.outDir) {
    errors.push("--out-file and --out-dir cannot be used together");
  }

  if (commander.relative && !commander.outDir) {
    errors.push("--relative requires --out-dir usage");
  }

  if (commander.watch) {
    if (!commander.outFile && !commander.outDir) {
      errors.push("--watch requires --out-file or --out-dir");
    }

    if (!filenames.length) {
      errors.push("--watch requires filenames");
    }
  }

  if (commander.skipInitialBuild && !commander.watch) {
    errors.push("--skip-initial-build requires --watch");
  }
  if (commander.deleteDirOnStart && !commander.outDir) {
    errors.push("--delete-dir-on-start requires --out-dir");
  }

  if (commander.verbose && commander.quiet) {
    errors.push("--verbose and --quiet cannot be used together");
  }

  if (
    !commander.outDir &&
    filenames.length === 0 &&
    typeof commander.filename !== "string" &&
    commander.babelrc !== false
  ) {
    errors.push(
      "stdin compilation requires either -f/--filename [filename] or --no-babelrc",
    );
  }

  if (errors.length) {
    console.error("babel:");
    errors.forEach(function(e) {
      console.error("  " + e);
    });
    return null;
  }

  const opts = commander.opts();

  const babelOptions = {
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
    moduleRoot: opts.moduleRoot,
    moduleIds: opts.moduleIds,
    moduleId: opts.moduleId,

    // Commander will default the "--no-" arguments to true, but we want to
    // leave them undefined so that @babel/core can handle the
    // default-assignment logic on its own.
    babelrc: opts.babelrc === true ? undefined : opts.babelrc,
    highlightCode: opts.highlightCode === true ? undefined : opts.highlightCode,
    comments: opts.comments === true ? undefined : opts.comments,
  };

  // If the @babel/cli version is newer than the @babel/core version, and we have added
  // new options for @babel/core, we'll potentially get option validation errors from
  // @babel/core. To avoid that, we delete undefined options, so @babel/core will only
  // give the error if users actually pass an unsupported CLI option.
  for (const key of Object.keys(babelOptions)) {
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
      watch: opts.watch,
      skipInitialBuild: opts.skipInitialBuild,
      outFile: opts.outFile,
      outDir: opts.outDir,
      relative: opts.relative,
      copyFiles: opts.copyFiles,
      includeDotfiles: opts.includeDotfiles,
      verbose: opts.verbose,
      quiet: opts.quiet,
      deleteDirOnStart: opts.deleteDirOnStart,
      sourceMapTarget: opts.sourceMapTarget,
    },
  };
}

function booleanify(val: any): boolean | any {
  if (val === "true" || val == 1) {
    return true;
  }

  if (val === "false" || val == 0 || !val) {
    return false;
  }

  return val;
}

function collect(value, previousValue): Array<string> {
  // If the user passed the option with no value, like "babel file.js --presets", do nothing.
  if (typeof value !== "string") return previousValue;

  const values = value.split(",");

  return previousValue ? previousValue.concat(values) : values;
}

function getOutDir(): string {
  const outDirOptions = ["lib", "dist"];

  // check package.json main field if it exists
  if (fs.existsSync("package.json")) {
    const packageJson = JSON.parse(fs.readFileSync("package.json"));

    if (packageJson && packageJson.main) {
      return path.dirname(packageJson.main);
    }
  }

  outDirOptions.some(function(outDir) {
    if (fs.existsSync(outDir)) {
      return outDir;
    }
  });

  return "lib";
}
