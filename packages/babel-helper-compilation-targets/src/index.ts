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
} from "./utils";
import { OptionValidator } from "@babel/helper-validator-option";
import { browserNameMap } from "./targets";
import { TargetNames } from "./options";
import type {
  Target,
  Targets,
  InputTargets,
  Browsers,
  BrowserslistBrowserName,
  TargetsTuple,
} from "./types";

export type { Target, Targets, InputTargets };

export { prettifyTargets } from "./pretty";
export { getInclusionReasons } from "./debug";
export { default as filterItems, isRequired } from "./filter-items";
export { unreleasedLabels } from "./targets";
export { TargetNames };

const ESM_SUPPORT = browserModulesData["es6.module"];

declare const PACKAGE_JSON: { name: string; version: string };
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

  return targets as any;
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
  return browsers.reduce((all, browser) => {
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
    } catch (e) {}

    return all;
  }, {} as Record<Target, string>);
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
  } catch (error) {
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
      ? process.versions.node
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

const targetsCache = new LruCache(64);

function resolveTargetsCached(queries: Browsers, env?: string): Targets {
  const cacheKey = JSON.stringify(queries) + env;
  let cached = targetsCache.get(cacheKey);
  if (!cached) {
    cached = resolveTargets(queries, env);
    targetsCache.set(cacheKey, cached);
  }
  return cached;
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
};

export default function getTargets(
  inputTargets: InputTargets = {},
  options: GetTargetsOption = {},
): Targets {
  let { browsers, esmodules } = inputTargets;
  const { configPath = "." } = options;

  validateBrowsers(browsers);

  const input = generateTargets(inputTargets);
  let targets = validateTargetNames(input);

  const shouldParseBrowsers = !!browsers;
  const hasTargets = shouldParseBrowsers || Object.keys(targets).length > 0;
  const shouldSearchForConfig =
    !options.ignoreBrowserslistConfig && !hasTargets;

  if (!browsers && shouldSearchForConfig) {
    browsers = browserslist.loadConfig({
      config: options.configFile,
      path: configPath,
      env: options.browserslistEnv,
    });
    if (browsers == null) {
      if (process.env.BABEL_8_BREAKING) {
        // In Babel 8, if no targets are passed, we use browserslist's defaults
        // and exclude IE 11.
        browsers = ["defaults, not ie 11"];
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
        const version = queryBrowsers[browser];
        const esmSupportVersion =
          // @ts-expect-error ie is not in ESM_SUPPORT
          ESM_SUPPORT[browser];

        if (esmSupportVersion) {
          queryBrowsers[browser] = getHighestUnreleased(
            version,
            semverify(esmSupportVersion),
            browser,
          );
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
