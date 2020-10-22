// @flow

import browserslist from "browserslist";
import { findSuggestion } from "@babel/helper-validator-option";
import browserModulesData from "@babel/compat-data/native-modules";

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
import { name as packageName } from "../package.json";
import type { Targets, InputTargets, Browsers, TargetsTuple } from "./types";

export type { Targets, InputTargets };

export { prettifyTargets } from "./pretty";
export { getInclusionReasons } from "./debug";
export { default as filterItems, isRequired } from "./filter-items";
export { unreleasedLabels } from "./targets";

const ESM_SUPPORT = browserModulesData["es6.module"];

const v = new OptionValidator(packageName);

const validBrowserslistTargets = [
  ...Object.keys(browserslist.data),
  ...Object.keys(browserslist.aliases),
];

function objectToBrowserslist(object: Targets): Array<string> {
  return Object.keys(object).reduce((list, targetName) => {
    if (validBrowserslistTargets.indexOf(targetName) >= 0) {
      const targetVersion = object[targetName];
      return list.concat(`${targetName} ${targetVersion}`);
    }
    return list;
  }, []);
}

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

  return (targets: any);
}

export function isBrowsersQueryValid(browsers: Browsers | Targets): boolean {
  return typeof browsers === "string" || Array.isArray(browsers);
}

function validateBrowsers(browsers: Browsers | void) {
  v.invariant(
    browsers === undefined || isBrowsersQueryValid(browsers),
    `'${String(browsers)}' is not a valid browserslist query`,
  );

  return browsers;
}

function getLowestVersions(browsers: Array<string>): Targets {
  return browsers.reduce((all: Object, browser: string): Object => {
    const [browserName, browserVersion] = browser.split(" ");
    const normalizedBrowserName = browserNameMap[browserName];

    if (!normalizedBrowserName) {
      return all;
    }

    try {
      // Browser version can return as "10.0-10.2"
      const splitVersion = browserVersion.split("-")[0].toLowerCase();
      const isSplitUnreleased = isUnreleasedVersion(splitVersion, browserName);

      if (!all[normalizedBrowserName]) {
        all[normalizedBrowserName] = isSplitUnreleased
          ? splitVersion
          : semverify(splitVersion);
        return all;
      }

      const version = all[normalizedBrowserName];
      const isUnreleased = isUnreleasedVersion(version, browserName);

      if (isUnreleased && isSplitUnreleased) {
        all[normalizedBrowserName] = getLowestUnreleased(
          version,
          splitVersion,
          browserName,
        );
      } else if (isUnreleased) {
        all[normalizedBrowserName] = semverify(splitVersion);
      } else if (!isUnreleased && !isSplitUnreleased) {
        const parsedBrowserVersion = semverify(splitVersion);

        all[normalizedBrowserName] = semverMin(version, parsedBrowserVersion);
      }
    } catch (e) {}

    return all;
  }, {});
}

function outputDecimalWarning(
  decimalTargets: Array<{| target: string, value: string |}>,
): void {
  if (!decimalTargets.length) {
    return;
  }

  console.log("Warning, the following targets are using a decimal version:");
  console.log("");
  decimalTargets.forEach(({ target, value }) =>
    console.log(`  ${target}: ${value}`),
  );
  console.log("");
  console.log(
    "We recommend using a string for minor/patch versions to avoid numbers like 6.10",
  );
  console.log("getting parsed as 6.1, which can lead to unexpected behavior.");
  console.log("");
}

function semverifyTarget(target, value) {
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

const targetParserMap = {
  __default(target, value) {
    const version = isUnreleasedVersion(value, target)
      ? value.toLowerCase()
      : semverifyTarget(target, value);
    return [target, version];
  },

  // Parse `node: true` and `node: "current"` to version
  node(target, value) {
    const parsed =
      value === true || value === "current"
        ? process.versions.node
        : semverifyTarget(target, value);
    return [target, parsed];
  },
};

function generateTargets(inputTargets: InputTargets): Targets {
  const input = { ...inputTargets };
  delete input.esmodules;
  delete input.browsers;
  return ((input: any): Targets);
}

function resolveTargets(queries: Browsers): Targets {
  const resolved = browserslist(queries, { mobileToDesktop: true });
  return getLowestVersions(resolved);
}

export default function getTargets(
  inputTargets: InputTargets = {},
  options: Object = {},
): Targets {
  let { browsers, esmodules } = inputTargets;

  validateBrowsers(browsers);

  const input = generateTargets(inputTargets);
  let targets: TargetsTuple = validateTargetNames(input);

  const shouldParseBrowsers = !!browsers;
  const hasTargets = shouldParseBrowsers || Object.keys(targets).length > 0;
  const shouldSearchForConfig =
    !options.ignoreBrowserslistConfig && !hasTargets;

  if (!browsers && shouldSearchForConfig) {
    browsers =
      browserslist.loadConfig({
        path: options.configPath,
        env: options.browserslistEnv,
      }) ??
      // If no targets are passed, we need to overwrite browserslist's defaults
      // so that we enable all transforms (acting like the now deprecated
      // preset-latest).
      objectToBrowserslist(targets);
  }

  // `esmodules` as a target indicates the specific set of browsers supporting ES Modules.
  // These values OVERRIDE the `browsers` field.
  if (esmodules && (esmodules !== "intersect" || !browsers)) {
    browsers = Object.keys(ESM_SUPPORT)
      .map(browser => `${browser} >= ${ESM_SUPPORT[browser]}`)
      .join(", ");
    esmodules = false;
  }

  if (browsers) {
    const queryBrowsers = resolveTargets(browsers);

    if (esmodules === "intersect") {
      for (const browser of Object.keys(queryBrowsers)) {
        const version = queryBrowsers[browser];

        if (ESM_SUPPORT[browser]) {
          queryBrowsers[browser] = getHighestUnreleased(
            version,
            semverify(ESM_SUPPORT[browser]),
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
  for (const target of Object.keys(targets).sort()) {
    const value = targets[target];

    // Warn when specifying minor/patch as a decimal
    if (typeof value === "number" && value % 1 !== 0) {
      decimalWarnings.push({ target, value });
    }

    // Check if we have a target parser?
    // $FlowIgnore - Flow doesn't like that some targetParserMap[target] might be missing
    const parser = targetParserMap[target] ?? targetParserMap.__default;
    const [parsedTarget, parsedValue] = parser(target, value);

    if (parsedValue) {
      // Merge (lowest wins)
      result[parsedTarget] = parsedValue;
    }
  }

  outputDecimalWarning(decimalWarnings);

  return result;
}
