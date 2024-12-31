import browserslist from "browserslist";
import { findSuggestion } from "@babel/helper-validator-option";
import browserModulesData from "@babel/compat-data/native-modules";
import LruCache from "lru-cache";

import {
  semverify,
  semverMin,
  isUnreleasedVersion,
  getLowestUnreleased,
  getHighestUnreleased,
} from "./utils.ts";
import { OptionValidator } from "@babel/helper-validator-option";
import { browserNameMap } from "./targets.ts";
import { TargetNames } from "./options.ts";
import type {
  Target,
  Targets,
  InputTargets,
  Browsers,
  BrowserslistBrowserName,
  TargetsTuple,
} from "./types.ts";

export type { Target, Targets, InputTargets };

export { prettifyTargets } from "./pretty.ts";
export { getInclusionReasons } from "./debug.ts";
export { default as filterItems, isRequired } from "./filter-items.ts";
export { unreleasedLabels } from "./targets.ts";
export { TargetNames };

const ESM_SUPPORT = browserModulesData["es6.module"];

const v = new OptionValidator(PACKAGE_JSON.name);

function validateTargetNames(targets: Targets): TargetsTuple {
  const validTargets = Object.keys(TargetNames);
  for (const target of Object.keys(targets)) {
    if (!(target in TargetNames)) {
      throw new Error(
        v.formatMessage(`'${target}' is not a valid target
- Did you mean '${findSuggestion(target, validTargets)}'?`),
      );
    }
  }

  return targets;
}

export function isBrowsersQueryValid(browsers: unknown): boolean {
  return (
    typeof browsers === "string" ||
    (Array.isArray(browsers) && browsers.every(b => typeof b === "string"))
  );
}

function validateBrowsers(browsers: Browsers | undefined) {
  v.invariant(
    browsers === undefined || isBrowsersQueryValid(browsers),
    `'${String(browsers)}' is not a valid browserslist query`,
  );

  return browsers;
}

function getLowestVersions(browsers: Array<string>): Targets {
  return browsers.reduce(
    (all, browser) => {
      const [browserName, browserVersion] = browser.split(" ") as [
        BrowserslistBrowserName,
        string,
      ];
      const target = browserNameMap[browserName];

      if (!target) {
        return all;
      }

      try {
        // Browser version can return as "10.0-10.2"
        const splitVersion = browserVersion.split("-")[0].toLowerCase();
        const isSplitUnreleased = isUnreleasedVersion(splitVersion, target);

        if (!all[target]) {
          all[target] = isSplitUnreleased
            ? splitVersion
            : semverify(splitVersion);
          return all;
        }

        const version = all[target];
        const isUnreleased = isUnreleasedVersion(version, target);

        if (isUnreleased && isSplitUnreleased) {
          all[target] = getLowestUnreleased(version, splitVersion, target);
        } else if (isUnreleased) {
          all[target] = semverify(splitVersion);
        } else if (!isUnreleased && !isSplitUnreleased) {
          const parsedBrowserVersion = semverify(splitVersion);

          all[target] = semverMin(version, parsedBrowserVersion);
        }
      } catch (_) {}

      return all;
    },
    {} as Record<Target, string>,
  );
}

function outputDecimalWarning(
  decimalTargets: Array<{ target: string; value: number }>,
) {
  if (!decimalTargets.length) {
    return;
  }

  console.warn("Warning, the following targets are using a decimal version:\n");
  decimalTargets.forEach(({ target, value }) =>
    console.warn(`  ${target}: ${value}`),
  );
  console.warn(`
We recommend using a string for minor/patch versions to avoid numbers like 6.10
getting parsed as 6.1, which can lead to unexpected behavior.
`);
}

function semverifyTarget(target: Target, value: string) {
  try {
    return semverify(value);
  } catch (_) {
    throw new Error(
      v.formatMessage(
        `'${value}' is not a valid value for 'targets.${target}'.`,
      ),
    );
  }
}

// Parse `node: true` and `node: "current"` to version
function nodeTargetParser(value: true | string) {
  const parsed =
    value === true || value === "current"
      ? // Align with `browserslist` and strip prerelease tag.
        process.versions.node.split("-")[0]
      : semverifyTarget("node", value);
  return ["node", parsed] as const;
}

function defaultTargetParser(
  target: Exclude<Target, "node">,
  value: string,
): readonly [Exclude<Target, "node">, string] {
  const version = isUnreleasedVersion(value, target)
    ? value.toLowerCase()
    : semverifyTarget(target, value);
  return [target, version] as const;
}

function generateTargets(inputTargets: InputTargets): Targets {
  const input = { ...inputTargets };
  delete input.esmodules;
  delete input.browsers;
  return input;
}

function resolveTargets(queries: Browsers, env?: string): Targets {
  const resolved = browserslist(queries, {
    mobileToDesktop: true,
    env,
  });
  return getLowestVersions(resolved);
}

const targetsCache = new LruCache({ max: 64 });

function resolveTargetsCached(queries: Browsers, env?: string): Targets {
  const cacheKey = typeof queries === "string" ? queries : queries.join() + env;
  let cached = targetsCache.get(cacheKey) as Targets | undefined;
  if (!cached) {
    cached = resolveTargets(queries, env);
    targetsCache.set(cacheKey, cached);
  }
  return { ...cached };
}

type GetTargetsOption = {
  // This is not the path of the config file, but the path where start searching it from
  configPath?: string;
  // The path of the config file
  configFile?: string;
  // The env to pass to browserslist
  browserslistEnv?: string;
  // true to disable config loading
  ignoreBrowserslistConfig?: boolean;
  // custom hook when browserslist config is found
  onBrowserslistConfigFound?: (configFile: string) => void;
};

export default function getTargets(
  inputTargets: InputTargets = {},
  options: GetTargetsOption = {},
): Targets {
  let { browsers, esmodules } = inputTargets;
  const { configPath = ".", onBrowserslistConfigFound } = options;

  validateBrowsers(browsers);

  const input = generateTargets(inputTargets);
  let targets = validateTargetNames(input);

  const shouldParseBrowsers = !!browsers;
  const hasTargets = shouldParseBrowsers || Object.keys(targets).length > 0;
  const shouldSearchForConfig =
    !options.ignoreBrowserslistConfig && !hasTargets;

  if (!browsers && shouldSearchForConfig) {
    // https://github.com/browserslist/browserslist/blob/8ae85caa905d130f4ca86f7a998a5b63abbbe582/node.js#L243
    browsers = process.env.BROWSERSLIST;
    if (!browsers) {
      const configFile =
        options.configFile ||
        process.env.BROWSERSLIST_CONFIG ||
        browserslist.findConfigFile(configPath);
      if (configFile != null) {
        onBrowserslistConfigFound?.(configFile);
        browsers = browserslist.loadConfig({
          config: configFile,
          env: options.browserslistEnv,
        });
      }
    }

    if (browsers == null) {
      if (process.env.BABEL_8_BREAKING) {
        // In Babel 8, if no targets are passed, we use browserslist's defaults.
        browsers = ["defaults"];
      } else {
        // If no targets are passed, we need to overwrite browserslist's defaults
        // so that we enable all transforms (acting like the now deprecated
        // preset-latest).
        browsers = [];
      }
    }
  }

  // `esmodules` as a target indicates the specific set of browsers supporting ES Modules.
  // These values OVERRIDE the `browsers` field.
  if (esmodules && (esmodules !== "intersect" || !browsers?.length)) {
    browsers = Object.keys(ESM_SUPPORT)
      .map(
        (browser: keyof typeof ESM_SUPPORT) =>
          `${browser} >= ${ESM_SUPPORT[browser]}`,
      )
      .join(", ");
    esmodules = false;
  }

  // If current value of `browsers` is undefined (`ignoreBrowserslistConfig` should be `false`)
  // or an empty array (without any user config, use default config),
  // we don't need to call `resolveTargets` to execute the related methods of `browserslist` library.
  if (browsers?.length) {
    const queryBrowsers = resolveTargetsCached(
      browsers,
      options.browserslistEnv,
    );

    if (esmodules === "intersect") {
      for (const browser of Object.keys(queryBrowsers) as Target[]) {
        if (browser !== "deno" && browser !== "ie") {
          const esmSupportVersion =
            ESM_SUPPORT[browser === "opera_mobile" ? "op_mob" : browser];

          if (esmSupportVersion) {
            const version = queryBrowsers[browser];
            queryBrowsers[browser] = getHighestUnreleased(
              version,
              semverify(esmSupportVersion),
              browser,
            );
          } else {
            delete queryBrowsers[browser];
          }
        } else {
          delete queryBrowsers[browser];
        }
      }
    }

    targets = Object.assign(queryBrowsers, targets);
  }

  // Parse remaining targets
  const result: Targets = {};
  const decimalWarnings = [];
  for (const target of Object.keys(targets).sort() as Target[]) {
    const value = targets[target];

    // Warn when specifying minor/patch as a decimal
    if (typeof value === "number" && value % 1 !== 0) {
      decimalWarnings.push({ target, value });
    }

    const [parsedTarget, parsedValue] =
      target === "node"
        ? nodeTargetParser(value)
        : defaultTargetParser(target, value as string);

    if (parsedValue) {
      // Merge (lowest wins)
      result[parsedTarget] = parsedValue;
    }
  }

  outputDecimalWarning(decimalWarnings);

  return result;
}
