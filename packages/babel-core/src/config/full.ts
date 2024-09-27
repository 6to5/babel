import gensync, { type Handler } from "gensync";
import {
  forwardAsync,
  maybeAsync,
  isThenable,
} from "../gensync-utils/async.ts";

import { mergeOptions } from "./util.ts";
import * as context from "../index.ts";
import Plugin from "./plugin.ts";
import { getItemDescriptor } from "./item.ts";
import { buildPresetChain } from "./config-chain.ts";
import { finalize as freezeDeepArray } from "./helpers/deep-array.ts";
import type { DeepArray, ReadonlyDeepArray } from "./helpers/deep-array.ts";
import type {
  ConfigContext,
  ConfigChain,
  PresetInstance,
} from "./config-chain.ts";
import type { UnloadedDescriptor } from "./config-descriptors.ts";
import traverse from "@babel/traverse";
import { makeWeakCache, makeWeakCacheSync } from "./caching.ts";
import type { CacheConfigurator } from "./caching.ts";
import {
  validate,
  checkNoUnwrappedItemOptionPairs,
} from "./validation/options.ts";
import type { PluginItem } from "./validation/options.ts";
import {
  type PluginObject,
  validatePluginObject,
} from "./validation/plugins.ts";
import { makePluginAPI, makePresetAPI } from "./helpers/config-api.ts";
import type { PluginAPI, PresetAPI } from "./helpers/config-api.ts";

import loadPrivatePartialConfig from "./partial.ts";
import type { ValidatedOptions } from "./validation/options.ts";

import type * as Context from "./cache-contexts.ts";
import ConfigError from "../errors/config-error.ts";

type LoadedDescriptor = {
  value: any;
  options: object;
  dirname: string;
  alias: string;
  externalDependencies: ReadonlyDeepArray<string>;
};

export type { InputOptions } from "./validation/options.ts";

export type ResolvedConfig = {
  options: any;
  passes: PluginPasses;
  externalDependencies: ReadonlyDeepArray<string>;
};

export type { Plugin };
export type PluginPassList = Array<Plugin>;
export type PluginPasses = Array<PluginPassList>;

function sortPlugins(plugins: Plugin[]) {
  function stableSort(plugins: Plugin[], orderMap: Map<string, number>) {
    const buckets = Object.create(null);

    // By collecting into buckets, we can guarantee a stable sort.
    for (let i = 0; i < plugins.length; i++) {
      const n = plugins[i];
      const p = 1000 - orderMap.get(n.key);

      // In case some plugin is setting an unexpected priority.
      const bucket = buckets[p] || (buckets[p] = []);
      bucket.push(n);
    }

    // Sort our keys in descending order. Keys are unique, so we don't have to
    // worry about stability.
    const keys = Object.keys(buckets)
      .map(k => +k)
      .sort((a, b) => b - a);

    let index = 0;
    for (const key of keys) {
      const bucket = buckets[key];
      for (const n of bucket) {
        plugins[index++] = n;
      }
    }
  }

  type OrderData = {
    version: number;
    getData: PluginObject["orderData"]["data"];
    list?: string[];
    before?: string;
    plugins: Plugin[];
  };
  const orderDataMap: Map<string, OrderData> = new Map();

  const pluginsWithPadding: (Plugin | string)[] = [];

  for (let i = plugins.length - 1; i >= 0; i--) {
    const plugin = plugins[i];
    const { orderData } = plugin;
    if (orderData) {
      let orderData2 = orderDataMap.get(orderData.id);
      if ((orderData2?.version || 0) < orderData.version) {
        if (orderData2 == null) {
          pluginsWithPadding.unshift(orderData.id);
        }
        orderDataMap.set(
          orderData.id,
          (orderData2 = {
            version: orderData.version,
            getData: () => orderData.data(),
            plugins: [],
          }),
        );
      }
      orderData2.plugins.unshift(plugin);
    } else {
      pluginsWithPadding.unshift(plugin);
    }
  }

  orderDataMap.forEach(v => {
    const data = v.getData();
    v.list = data.list;
    v.before = data.before;
    stableSort(v.plugins, new Map(data.list.map((key, i) => [key, i])));
  });

  // Detect cycles
  const seen = new Set<string>();

  function visit(k: string) {
    const v = orderDataMap.get(k);
    if (!v) return;

    if (seen.has(k)) {
      throw new Error(
        `Plugin/preset order list cycles with '${Array.from(seen.keys()).join(" -> ")}'`,
      );
    }
    seen.add(k);

    if (v.before) {
      visit(v.before);
    }
  }

  for (const k of orderDataMap.keys()) {
    visit(k);
    seen.clear();
  }

  // Sort

  // eslint-disable-next-line no-constant-condition
  while (true) {
    let changed = false;

    for (let i = 0; i < pluginsWithPadding.length; i++) {
      const plugin = pluginsWithPadding[i];
      if (typeof plugin !== "string" || !orderDataMap.has(plugin)) {
        continue;
      }

      const orderData = orderDataMap.get(plugin);
      const { before } = orderData;
      if (!before) {
        continue;
      }
      const index = pluginsWithPadding.indexOf(before);
      if (index === -1) {
        continue;
      }
      if (index < i) {
        changed = true;
        pluginsWithPadding.splice(i, 1);
        pluginsWithPadding.splice(index, 0, plugin);
      }
    }

    if (!changed) {
      break;
    }
  }

  const newPlugins: Plugin[] = [];

  for (const value of pluginsWithPadding) {
    if (typeof value === "string") {
      newPlugins.push(...orderDataMap.get(value).plugins);
    } else {
      newPlugins.push(value);
    }
  }

  return newPlugins;
}

export default gensync(function* loadFullConfig(
  inputOpts: unknown,
): Handler<ResolvedConfig | null> {
  const result = yield* loadPrivatePartialConfig(inputOpts);
  if (!result) {
    return null;
  }
  const { options, context, fileHandling } = result;

  if (fileHandling === "ignored") {
    return null;
  }

  const optionDefaults = {};

  const { plugins, presets } = options;

  if (!plugins || !presets) {
    throw new Error("Assertion failure - plugins and presets exist");
  }

  const presetContext: Context.FullPreset = {
    ...context,
    targets: options.targets,
  };

  const toDescriptor = (item: PluginItem) => {
    const desc = getItemDescriptor(item);
    if (!desc) {
      throw new Error("Assertion failure - must be config item");
    }

    return desc;
  };

  const presetsDescriptors = presets.map(toDescriptor);
  const initialPluginsDescriptors = plugins.map(toDescriptor);
  const pluginDescriptorsByPass: Array<Array<UnloadedDescriptor<PluginAPI>>> = [
    [],
  ];
  const passes: Array<Array<Plugin>> = [];

  const externalDependencies: DeepArray<string> = [];

  const ignored = yield* enhanceError(
    context,
    function* recursePresetDescriptors(
      rawPresets: Array<UnloadedDescriptor<PresetAPI>>,
      pluginDescriptorsPass: Array<UnloadedDescriptor<PluginAPI>>,
    ): Handler<true | void> {
      const presets: Array<{
        preset: ConfigChain | null;
        pass: Array<UnloadedDescriptor<PluginAPI>>;
      }> = [];

      for (let i = 0; i < rawPresets.length; i++) {
        const descriptor = rawPresets[i];
        if (descriptor.options !== false) {
          try {
            // eslint-disable-next-line no-var
            var preset = yield* loadPresetDescriptor(descriptor, presetContext);
          } catch (e) {
            if (e.code === "BABEL_UNKNOWN_OPTION") {
              checkNoUnwrappedItemOptionPairs(rawPresets, i, "preset", e);
            }
            throw e;
          }

          externalDependencies.push(preset.externalDependencies);

          // Presets normally run in reverse order, but if they
          // have their own pass they run after the presets
          // in the previous pass.
          if (descriptor.ownPass) {
            presets.push({ preset: preset.chain, pass: [] });
          } else {
            presets.unshift({
              preset: preset.chain,
              pass: pluginDescriptorsPass,
            });
          }
        }
      }

      // resolve presets
      if (presets.length > 0) {
        // The passes are created in the same order as the preset list, but are inserted before any
        // existing additional passes.
        pluginDescriptorsByPass.splice(
          1,
          0,
          ...presets.map(o => o.pass).filter(p => p !== pluginDescriptorsPass),
        );

        for (const { preset, pass } of presets) {
          if (!preset) return true;

          pass.push(...preset.plugins);

          const ignored = yield* recursePresetDescriptors(preset.presets, pass);
          if (ignored) return true;

          preset.options.forEach(opts => {
            mergeOptions(optionDefaults, opts);
          });
        }
      }
    },
  )(presetsDescriptors, pluginDescriptorsByPass[0]);

  if (ignored) return null;

  const opts: ValidatedOptions = optionDefaults;
  mergeOptions(opts, options);

  const pluginContext: Context.FullPlugin = {
    ...presetContext,
    assumptions: opts.assumptions ?? {},
  };

  yield* enhanceError(context, function* loadPluginDescriptors() {
    pluginDescriptorsByPass[0].unshift(...initialPluginsDescriptors);

    for (const descs of pluginDescriptorsByPass) {
      const pass: Plugin[] = [];
      passes.push(pass);

      for (let i = 0; i < descs.length; i++) {
        const descriptor = descs[i];
        if (descriptor.options !== false) {
          try {
            // eslint-disable-next-line no-var
            var plugin = yield* loadPluginDescriptor(descriptor, pluginContext);
          } catch (e) {
            if (e.code === "BABEL_UNKNOWN_PLUGIN_PROPERTY") {
              // print special message for `plugins: ["@babel/foo", { foo: "option" }]`
              checkNoUnwrappedItemOptionPairs(descs, i, "plugin", e);
            }
            throw e;
          }
          pass.push(plugin);

          externalDependencies.push(plugin.externalDependencies);
        }
      }
    }
  })();

  opts.plugins = passes[0];
  opts.presets = passes
    .slice(1)
    .filter(plugins => plugins.length > 0)
    .map(plugins => ({ plugins }));
  opts.passPerPreset = opts.presets.length > 0;

  if (opts.sortPlugins && !opts.passPerPreset) {
    opts.plugins = passes[0] = sortPlugins(opts.plugins as Plugin[]);
  }

  if (!process.env.IS_PUBLISH && process.env.TEST_THROW_PLUGINS) {
    throw Object.assign(new Error("TEST_THROW_PLUGINS"), {
      plugins: opts.plugins,
    });
  }

  return {
    options: opts,
    passes: passes,
    externalDependencies: freezeDeepArray(externalDependencies),
  };
});

function enhanceError<T extends Function>(context: ConfigContext, fn: T): T {
  return function* (arg1: unknown, arg2: unknown) {
    try {
      return yield* fn(arg1, arg2);
    } catch (e) {
      // There are a few case where thrown errors will try to annotate themselves multiple times, so
      // to keep things simple we just bail out if re-wrapping the message.
      if (!/^\[BABEL\]/.test(e.message)) {
        e.message = `[BABEL] ${context.filename ?? "unknown file"}: ${
          e.message
        }`;
      }

      throw e;
    }
  } as any;
}

/**
 * Load a generic plugin/preset from the given descriptor loaded from the config object.
 */
const makeDescriptorLoader = <Context, API>(
  apiFactory: (
    cache: CacheConfigurator<Context>,
    externalDependencies: Array<string>,
  ) => API,
) =>
  makeWeakCache(function* (
    { value, options, dirname, alias }: UnloadedDescriptor<API>,
    cache: CacheConfigurator<Context>,
  ): Handler<LoadedDescriptor> {
    // Disabled presets should already have been filtered out
    if (options === false) throw new Error("Assertion failure");

    options = options || {};

    const externalDependencies: Array<string> = [];

    let item: unknown = value;
    if (typeof value === "function") {
      const factory = maybeAsync(
        value as (api: API, options: object, dirname: string) => unknown,
        `You appear to be using an async plugin/preset, but Babel has been called synchronously`,
      );

      const api = {
        ...context,
        ...apiFactory(cache, externalDependencies),
      };
      try {
        item = yield* factory(api, options, dirname);
      } catch (e) {
        if (alias) {
          e.message += ` (While processing: ${JSON.stringify(alias)})`;
        }
        throw e;
      }
    }

    if (!item || typeof item !== "object") {
      throw new Error("Plugin/Preset did not return an object.");
    }

    if (isThenable(item)) {
      // if we want to support async plugins
      yield* [];

      throw new Error(
        `You appear to be using a promise as a plugin, ` +
          `which your current version of Babel does not support. ` +
          `If you're using a published plugin, ` +
          `you may need to upgrade your @babel/core version. ` +
          `As an alternative, you can prefix the promise with "await". ` +
          `(While processing: ${JSON.stringify(alias)})`,
      );
    }

    if (
      externalDependencies.length > 0 &&
      (!cache.configured() || cache.mode() === "forever")
    ) {
      let error =
        `A plugin/preset has external untracked dependencies ` +
        `(${externalDependencies[0]}), but the cache `;
      if (!cache.configured()) {
        error += `has not been configured to be invalidated when the external dependencies change. `;
      } else {
        error += ` has been configured to never be invalidated. `;
      }
      error +=
        `Plugins/presets should configure their cache to be invalidated when the external ` +
        `dependencies change, for example using \`api.cache.invalidate(() => ` +
        `statSync(filepath).mtimeMs)\` or \`api.cache.never()\`\n` +
        `(While processing: ${JSON.stringify(alias)})`;

      throw new Error(error);
    }

    return {
      value: item,
      options,
      dirname,
      alias,
      externalDependencies: freezeDeepArray(externalDependencies),
    };
  });

const pluginDescriptorLoader = makeDescriptorLoader<
  Context.SimplePlugin,
  PluginAPI
>(makePluginAPI);
const presetDescriptorLoader = makeDescriptorLoader<
  Context.SimplePreset,
  PresetAPI
>(makePresetAPI);

const instantiatePlugin = makeWeakCache(function* (
  { value, options, dirname, alias, externalDependencies }: LoadedDescriptor,
  cache: CacheConfigurator<Context.SimplePlugin>,
): Handler<Plugin> {
  const pluginObj = validatePluginObject(value);

  const plugin = {
    ...pluginObj,
  };
  if (plugin.visitor) {
    plugin.visitor = traverse.explode({
      ...plugin.visitor,
    });
  }

  if (plugin.inherits) {
    const inheritsDescriptor: UnloadedDescriptor<PluginAPI> = {
      name: undefined,
      alias: `${alias}$inherits`,
      value: plugin.inherits,
      options,
      dirname,
    };

    const inherits = yield* forwardAsync(loadPluginDescriptor, run => {
      // If the inherited plugin changes, reinstantiate this plugin.
      return cache.invalidate(data => run(inheritsDescriptor, data));
    });

    plugin.pre = chain(inherits.pre, plugin.pre);
    plugin.post = chain(inherits.post, plugin.post);
    plugin.manipulateOptions = chain(
      inherits.manipulateOptions,
      plugin.manipulateOptions,
    );
    plugin.visitor = traverse.visitors.merge([
      inherits.visitor || {},
      plugin.visitor || {},
    ]);

    if (inherits.externalDependencies.length > 0) {
      if (externalDependencies.length === 0) {
        externalDependencies = inherits.externalDependencies;
      } else {
        externalDependencies = freezeDeepArray([
          externalDependencies,
          inherits.externalDependencies,
        ]);
      }
    }
  }

  return new Plugin(plugin, options, alias, externalDependencies);
});

/**
 * Instantiate a plugin for the given descriptor, returning the plugin/options pair.
 */
function* loadPluginDescriptor(
  descriptor: UnloadedDescriptor<PluginAPI>,
  context: Context.SimplePlugin,
): Handler<Plugin> {
  if (descriptor.value instanceof Plugin) {
    if (descriptor.options) {
      throw new Error(
        "Passed options to an existing Plugin instance will not work.",
      );
    }

    return descriptor.value;
  }

  return yield* instantiatePlugin(
    yield* pluginDescriptorLoader(descriptor, context),
    context,
  );
}

const needsFilename = (val: unknown) => val && typeof val !== "function";

const validateIfOptionNeedsFilename = (
  options: ValidatedOptions,
  descriptor: UnloadedDescriptor<PresetAPI>,
): void => {
  if (
    needsFilename(options.test) ||
    needsFilename(options.include) ||
    needsFilename(options.exclude)
  ) {
    const formattedPresetName = descriptor.name
      ? `"${descriptor.name}"`
      : "/* your preset */";
    throw new ConfigError(
      [
        `Preset ${formattedPresetName} requires a filename to be set when babel is called directly,`,
        `\`\`\``,
        `babel.transformSync(code, { filename: 'file.ts', presets: [${formattedPresetName}] });`,
        `\`\`\``,
        `See https://babeljs.io/docs/en/options#filename for more information.`,
      ].join("\n"),
    );
  }
};

const validatePreset = (
  preset: PresetInstance,
  context: ConfigContext,
  descriptor: UnloadedDescriptor<PresetAPI>,
): void => {
  if (!context.filename) {
    const { options } = preset;
    validateIfOptionNeedsFilename(options, descriptor);
    options.overrides?.forEach(overrideOptions =>
      validateIfOptionNeedsFilename(overrideOptions, descriptor),
    );
  }
};

const instantiatePreset = makeWeakCacheSync(
  ({
    value,
    dirname,
    alias,
    externalDependencies,
  }: LoadedDescriptor): PresetInstance => {
    return {
      options: validate("preset", value),
      alias,
      dirname,
      externalDependencies,
    };
  },
);

/**
 * Generate a config object that will act as the root of a new nested config.
 */
function* loadPresetDescriptor(
  descriptor: UnloadedDescriptor<PresetAPI>,
  context: Context.FullPreset,
): Handler<{
  chain: ConfigChain | null;
  externalDependencies: ReadonlyDeepArray<string>;
}> {
  const preset = instantiatePreset(
    yield* presetDescriptorLoader(descriptor, context),
  );
  validatePreset(preset, context, descriptor);
  return {
    chain: yield* buildPresetChain(preset, context),
    externalDependencies: preset.externalDependencies,
  };
}

function chain<Args extends any[]>(
  a: undefined | ((...args: Args) => void),
  b: undefined | ((...args: Args) => void),
) {
  const fns = [a, b].filter(Boolean);
  if (fns.length <= 1) return fns[0];

  return function (this: unknown, ...args: unknown[]) {
    for (const fn of fns) {
      fn.apply(this, args);
    }
  };
}
