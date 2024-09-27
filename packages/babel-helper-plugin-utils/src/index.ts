import type {
  PluginAPI,
  PluginObject,
  PluginPass,
  PresetAPI,
  PresetObject,
} from "@babel/core";

type APIPolyfillFactory<T extends keyof PluginAPI> = (
  api: PluginAPI,
) => PluginAPI[T];

type APIPolyfills = {
  assertVersion: APIPolyfillFactory<"assertVersion">;
};

const apiPolyfills: APIPolyfills = {
  // Not supported by Babel 7 and early versions of Babel 7 beta.
  // It's important that this is polyfilled for older Babel versions
  // since it's needed to report the version mismatch.
  assertVersion: (api: PluginAPI) => (range: number | string) => {
    throwVersionError(range, api.version);
  },
};
if (!process.env.BABEL_8_BREAKING) {
  Object.assign(apiPolyfills, {
    // This is supported starting from Babel 7.13
    targets: () => () => {
      return {};
    },
    // This is supported starting from Babel 7.13
    assumption: () => () => {
      return undefined;
    },
    // This is supported starting from Babel 7.17
    addExternalDependency: () => () => {},
  });
}

export function declare<State = object, Option = object>(
  builder: (
    api: PluginAPI,
    options: Option,
    dirname: string,
  ) => PluginObject<State & PluginPass>,
): (
  api: PluginAPI,
  options: Option,
  dirname: string,
) => PluginObject<State & PluginPass> {
  return (api, options: Option, dirname: string) => {
    let clonedApi: PluginAPI;

    for (const name of Object.keys(
      apiPolyfills,
    ) as (keyof typeof apiPolyfills)[]) {
      if (api[name]) continue;

      clonedApi ??= copyApiObject(api);
      clonedApi[name] = apiPolyfills[name](clonedApi);
    }

    const pluginObject = builder(
      clonedApi ?? api,
      options || ({} as Option),
      dirname,
    );

    function definePluginOrderData(
      pluginObject: PluginObject,
      id: string,
      list: string[],
      before?: string,
    ) {
      if (list.includes(pluginObject.name)) {
        pluginObject.orderData = {
          id: id,
          version: 1,
          data: () => ({
            type: "list",
            list,
            before,
          }),
        };
      }
    }

    const modulePlugins = [
      "transform-modules-commonjs",
      "transform-modules-amd",
      "transform-modules-systemjs",
      "transform-modules-umd",
    ];

    const languagePlugins = ["transform-typescript", "transform-flow"];

    const featurePlugins = [
      "proposal-async-do-expressions",
      "proposal-decorators",
      "proposal-destructuring-private",
      "proposal-do-expressions",
      "proposal-duplicate-named-capturing-groups-regex",
      "proposal-explicit-resource-management",
      "proposal-export-default-from",
      "proposal-function-bind",
      "proposal-function-sent",
      "proposal-import-attributes-to-assertions",
      "proposal-import-defer",
      "proposal-import-wasm-source",
      "proposal-json-modules",
      "proposal-optional-chaining-assign",
      "proposal-partial-application",
      "proposal-pipeline-operator",
      "proposal-record-and-tuple",
      "proposal-regexp-modifiers",
      "proposal-throw-expressions",

      "transform-unicode-sets-regex",
      "bugfix/transform-v8-static-class-fields-redefine-readonly",
      "bugfix/transform-firefox-class-in-computed-class-key",
      "transform-class-static-block",
      "transform-private-property-in-object",
      "transform-class-properties",
      "transform-private-methods",
      "transform-numeric-separator",
      "transform-logical-assignment-operators",
      "transform-nullish-coalescing-operator",
      "transform-optional-chaining",
      "transform-json-strings",
      "transform-optional-catch-binding",
      "transform-parameters",
      "transform-async-generator-functions",
      "transform-object-rest-spread",
      "transform-dotall-regex",
      "transform-unicode-property-regex",
      "transform-named-capturing-groups-regex",
      "transform-async-to-generator",
      "transform-exponentiation-operator",
      "transform-template-literals",
      "transform-literals",
      "transform-function-name",
      "transform-arrow-functions",
      "transform-block-scoped-functions",
      "transform-classes",
      "transform-object-super",
      "transform-shorthand-properties",
      "transform-duplicate-keys",
      "transform-computed-properties",
      "transform-for-of",
      "transform-sticky-regex",
      "transform-unicode-escapes",
      "transform-unicode-regex",
      "transform-spread",
      "transform-destructuring",
      "transform-block-scoping",
      "transform-typeof-symbol",
      "transform-new-target",
      "transform-regenerator",
      "transform-member-expression-literals",
      "transform-property-literals",
      "transform-reserved-words",
      "transform-export-namespace-from",
      "bugfix/transform-async-arrows-in-class",
      "bugfix/transform-edge-default-parameters",
      "bugfix/transform-edge-function-name",
      "bugfix/transform-safari-block-shadowing",
      "bugfix/transform-safari-for-shadowing",
      "bugfix/transform-safari-id-destructuring-collision-in-function-expression",
      "bugfix/transform-tagged-template-caching",
      "bugfix/transform-v8-spread-parameters-in-optional-chaining",
    ];

    if (process.env.BABEL_8_BREAKING) {
      definePluginOrderData(
        pluginObject,
        "@babel/helper-plugin-order-data#module",
        modulePlugins,
        "@babel/helper-plugin-order-data#language",
      );

      definePluginOrderData(
        pluginObject,
        "@babel/helper-plugin-order-data#language",
        languagePlugins,
        "@babel/helper-plugin-order-data#feature",
      );

      definePluginOrderData(
        pluginObject,
        "@babel/helper-plugin-order-data#feature",
        featurePlugins,
      );
    }

    return pluginObject;
  };
}

export const declarePreset = declare as <Option = object>(
  builder: (api: PresetAPI, options: Option, dirname: string) => PresetObject,
) => (api: PresetAPI, options: Option, dirname: string) => PresetObject;

function copyApiObject(api: PluginAPI): PluginAPI {
  // Babel >= 7 <= beta.41 passed the API as a new object that had
  // babel/core as the prototype. While slightly faster, it also
  // means that the Object.assign copy below fails. Rather than
  // keep complexity, the Babel 6 behavior has been reverted and this
  // normalizes all that for Babel 7.
  let proto = null;
  if (typeof api.version === "string" && /^7\./.test(api.version)) {
    proto = Object.getPrototypeOf(api);
    if (
      proto &&
      (!Object.hasOwn(proto, "version") ||
        !Object.hasOwn(proto, "transform") ||
        !Object.hasOwn(proto, "template") ||
        !Object.hasOwn(proto, "types"))
    ) {
      proto = null;
    }
  }

  return {
    ...proto,
    ...api,
  };
}

function throwVersionError(range: string | number, version: string) {
  if (typeof range === "number") {
    if (!Number.isInteger(range)) {
      throw new Error("Expected string or integer value.");
    }
    range = `^${range}.0.0-0`;
  }
  if (typeof range !== "string") {
    throw new Error("Expected string or integer value.");
  }

  const limit = Error.stackTraceLimit;

  if (typeof limit === "number" && limit < 25) {
    // Bump up the limit if needed so that users are more likely
    // to be able to see what is calling Babel.
    Error.stackTraceLimit = 25;
  }

  let err;
  if (version.slice(0, 2) === "7.") {
    err = new Error(
      `Requires Babel "^7.0.0-beta.41", but was loaded with "${version}". ` +
        `You'll need to update your @babel/core version.`,
    );
  } else {
    err = new Error(
      `Requires Babel "${range}", but was loaded with "${version}". ` +
        `If you are sure you have a compatible version of @babel/core, ` +
        `it is likely that something in your build process is loading the ` +
        `wrong version. Inspect the stack trace of this error to look for ` +
        `the first entry that doesn't mention "@babel/core" or "babel-core" ` +
        `to see what is calling Babel.`,
    );
  }

  if (typeof limit === "number") {
    Error.stackTraceLimit = limit;
  }

  throw Object.assign(err, {
    code: "BABEL_VERSION_UNSUPPORTED",
    version,
    range,
  } as any);
}
