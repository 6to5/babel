import path from "path";
import type { Handler } from "gensync";
import Plugin from "./plugin.ts";
import { mergeOptions } from "./util.ts";
import { createItemFromDescriptor } from "./item.ts";
import { buildRootChain } from "./config-chain.ts";
import type { ConfigContext, FileHandling } from "./config-chain.ts";
import { getEnv } from "./helpers/environment.ts";
import { validate } from "./validation/options.ts";

import type {
  ValidatedOptions,
  NormalizedOptions,
  RootMode,
} from "./validation/options.ts";

import {
  findConfigUpwards,
  resolveShowConfigPath,
  ROOT_CONFIG_FILENAMES,
} from "./files/index.ts";
import type { ConfigFile, IgnoreFile } from "./files/index.ts";
import { resolveTargets } from "./resolve-targets.ts";

function resolveRootMode(rootDir: string, rootMode: RootMode): string {
  switch (rootMode) {
    case "root":
      return rootDir;

    case "upward-optional": {
      const upwardRootDir = findConfigUpwards(rootDir);
      return upwardRootDir === null ? rootDir : upwardRootDir;
    }

    case "upward": {
      const upwardRootDir = findConfigUpwards(rootDir);
      if (upwardRootDir !== null) return upwardRootDir;

      throw Object.assign(
        new Error(
          `Babel was run with rootMode:"upward" but a root could not ` +
            `be found when searching upward from "${rootDir}".\n` +
            `One of the following config files must be in the directory tree: ` +
            `"${ROOT_CONFIG_FILENAMES.join(", ")}".`,
        ) as any,
        {
          code: "BABEL_ROOT_NOT_FOUND",
          dirname: rootDir,
        },
      );
    }
    default:
      throw new Error(`Assertion failure - unknown rootMode value.`);
  }
}

type PrivPartialConfig = {
  options: NormalizedOptions;
  context: ConfigContext;
  fileHandling: FileHandling;
  ignore: IgnoreFile | void;
  babelrc: ConfigFile | void;
  config: ConfigFile | void;
  files: Set<string>;
};

export default function* loadPrivatePartialConfig(
  inputOpts: unknown,
): Handler<PrivPartialConfig | null> {
  if (
    inputOpts != null &&
    (typeof inputOpts !== "object" || Array.isArray(inputOpts))
  ) {
    throw new Error("Babel options must be an object, null, or undefined");
  }

  const args = inputOpts ? validate("arguments", inputOpts) : {};

  const {
    envName = getEnv(),
    cwd = ".",
    root: rootDir = ".",
    rootMode = "root",
    caller,
    cloneInputAst = true,
  } = args;
  const absoluteCwd = path.resolve(cwd);
  const absoluteRootDir = resolveRootMode(
    path.resolve(absoluteCwd, rootDir),
    rootMode,
  );

  const filename =
    typeof args.filename === "string"
      ? path.resolve(cwd, args.filename)
      : undefined;

  const showConfigPath = yield* resolveShowConfigPath(absoluteCwd);

  const context: ConfigContext = {
    filename,
    cwd: absoluteCwd,
    root: absoluteRootDir,
    envName,
    caller,
    showConfig: showConfigPath === filename,
  };

  const configChain = yield* buildRootChain(args, context);
  if (!configChain) return null;

  const merged: ValidatedOptions = {
    assumptions: {},
  };

  if (process.env.BABEL_8_BREAKING) merged.sortPlugins = true;

  configChain.options.forEach(opts => {
    mergeOptions(merged as any, opts);
  });

  const options: NormalizedOptions = {
    ...merged,
    targets: resolveTargets(merged, absoluteRootDir),

    // Tack the passes onto the object itself so that, if this object is
    // passed back to Babel a second time, it will be in the right structure
    // to not change behavior.
    cloneInputAst,
    babelrc: false,
    configFile: false,
    browserslistConfigFile: false,
    passPerPreset: false,
    envName: context.envName,
    cwd: context.cwd,
    root: context.root,
    rootMode: "root",
    filename:
      typeof context.filename === "string" ? context.filename : undefined,

    plugins: configChain.plugins.map(descriptor =>
      createItemFromDescriptor(descriptor),
    ),
    presets: configChain.presets.map(descriptor =>
      createItemFromDescriptor(descriptor),
    ),
  };

  return {
    options,
    context,
    fileHandling: configChain.fileHandling,
    ignore: configChain.ignore,
    babelrc: configChain.babelrc,
    config: configChain.config,
    files: configChain.files,
  };
}

type LoadPartialConfigOpts = {
  showIgnoredFiles?: boolean;
};

export function* loadPartialConfig(
  opts?: LoadPartialConfigOpts,
): Handler<PartialConfig | null> {
  let showIgnoredFiles = false;
  // We only extract showIgnoredFiles if opts is an object, so that
  // loadPrivatePartialConfig can throw the appropriate error if it's not.
  if (typeof opts === "object" && opts !== null && !Array.isArray(opts)) {
    ({ showIgnoredFiles, ...opts } = opts);
  }

  const result: PrivPartialConfig | undefined | null =
    yield* loadPrivatePartialConfig(opts);
  if (!result) return null;

  const { options, babelrc, ignore, config, fileHandling, files } = result;

  if (fileHandling === "ignored" && !showIgnoredFiles) {
    return null;
  }

  (options.plugins || []).forEach(item => {
    // @ts-expect-error todo(flow->ts): better type annotation for `item.value`
    if (item.value instanceof Plugin) {
      throw new Error(
        "Passing cached plugin instances is not supported in " +
          "babel.loadPartialConfig()",
      );
    }
  });

  return new PartialConfig(
    options,
    babelrc ? babelrc.filepath : undefined,
    ignore ? ignore.filepath : undefined,
    config ? config.filepath : undefined,
    fileHandling,
    files,
  );
}

export type { PartialConfig };

class PartialConfig {
  /**
   * These properties are public, so any changes to them should be considered
   * a breaking change to Babel's API.
   */
  options: NormalizedOptions;
  babelrc: string | void;
  babelignore: string | void;
  config: string | void;
  fileHandling: FileHandling;
  files: Set<string>;

  constructor(
    options: NormalizedOptions,
    babelrc: string | void,
    ignore: string | void,
    config: string | void,
    fileHandling: FileHandling,
    files: Set<string>,
  ) {
    this.options = options;
    this.babelignore = ignore;
    this.babelrc = babelrc;
    this.config = config;
    this.fileHandling = fileHandling;
    this.files = files;

    // Freeze since this is a public API and it should be extremely obvious that
    // reassigning properties on here does nothing.
    Object.freeze(this);
  }

  /**
   * Returns true if there is a config file in the filesystem for this config.
   */
  hasFilesystemConfig(): boolean {
    return this.babelrc !== undefined || this.config !== undefined;
  }
}
Object.freeze(PartialConfig.prototype);
