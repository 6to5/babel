import babel = require("./babel-core.cts");
import ESLINT_VERSION = require("../utils/eslint-version.cts");
import type { InputOptions } from "@babel/core";
import type { Options } from "../types.cts";
import type { PartialConfig } from "../../../../packages/babel-core/src/config";

/**
 * Merge user supplied estree plugin options to default estree plugin options
 *
 * @returns {Array} Merged parser plugin descriptors
 */
function getParserPlugins(
  babelOptions: InputOptions,
): InputOptions["parserOpts"]["plugins"] {
  const babelParserPlugins = babelOptions.parserOpts?.plugins ?? [];
  const estreeOptions = { classFeatures: ESLINT_VERSION >= 8 };
  for (const plugin of babelParserPlugins) {
    if (Array.isArray(plugin) && plugin[0] === "estree") {
      Object.assign(estreeOptions, plugin[1]);
      break;
    }
  }
  // estree must be the first parser plugin to work with other parser plugins
  return [["estree", estreeOptions], ...babelParserPlugins];
}

function normalizeParserOptions(options: Options): InputOptions & {
  showIgnoredFiles?: boolean;
} {
  return {
    // https://github.com/eslint/js/issues/519
    sourceType: options.sourceType as "module" | "script",
    filename: options.filePath,
    ...options.babelOptions,
    parserOpts: {
      ...(process.env.BABEL_8_BREAKING
        ? {}
        : {
            allowImportExportEverywhere:
              options.allowImportExportEverywhere ?? false,
            allowSuperOutsideMethod: true,
          }),
      allowReturnOutsideFunction:
        options.ecmaFeatures?.globalReturn ??
        (process.env.BABEL_8_BREAKING ? false : true),
      ...options.babelOptions.parserOpts,
      plugins: getParserPlugins(options.babelOptions),
      // skip comment attaching for parsing performance
      attachComment: false,
      ranges: true,
      tokens: true,
    },
    caller: {
      name: "@babel/eslint-parser",
      ...options.babelOptions.caller,
    },
  };
}

function validateResolvedConfig(
  config: PartialConfig,
  options: Options,
  parseOptions: InputOptions,
) {
  if (config !== null) {
    if (options.requireConfigFile !== false) {
      if (!config.hasFilesystemConfig()) {
        let error = `No Babel config file detected for ${config.options.filename}. Either disable config file checking with requireConfigFile: false, or configure Babel so that it can find the config files.`;

        if (config.options.filename.includes("node_modules")) {
          error += `\nIf you have a .babelrc.js file or use package.json#babel, keep in mind that it's not used when parsing dependencies. If you want your config to be applied to your whole app, consider using babel.config.js or babel.config.json instead.`;
        }

        throw new Error(error);
      }
    }
  }

  if (process.env.BABEL_8_BREAKING) {
    const configOptions: InputOptions = {
      plugins: [],
      babelrc: false,
      ...(config?.options || parseOptions),
      configFile: false,
      ignore: null,
      only: null,
      browserslistConfigFile: false,
    };

    return configOptions;
  } else {
    return (
      config?.options || {
        plugins: [],
        ...parseOptions,
        babelrc: false,
        configFile: false,
        browserslistConfigFile: false,
        ignore: null,
        only: null,
      }
    );
  }
}

export async function normalizeBabelParseConfig(
  options: Options,
): Promise<InputOptions> {
  const parseOptions = normalizeParserOptions(options);
  const config = await babel.loadPartialConfigAsync(parseOptions);
  return validateResolvedConfig(config, options, parseOptions);
}

export function normalizeBabelParseConfigSync(options: Options): InputOptions {
  const parseOptions = normalizeParserOptions(options);
  const config = babel.loadPartialConfigSync(parseOptions);
  return validateResolvedConfig(config, options, parseOptions);
}
