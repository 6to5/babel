import traverse from "@babel/traverse";
import type * as t from "@babel/types";
import type { GeneratorResult } from "@babel/generator";

import type { Handler } from "gensync";

import type { ResolvedConfig, Plugin, PluginPasses } from "../config/index.ts";

import PluginPass from "./plugin-pass.ts";
import loadBlockHoistPlugin from "./block-hoist-plugin.ts";
import normalizeOptions from "./normalize-opts.ts";
import normalizeFile from "./normalize-file.ts";

import generateCode from "./file/generate.ts";
import type File from "./file/file.ts";

import { flattenToSet } from "../config/helpers/deep-array.ts";
import { isThenable } from "../gensync-utils/async.ts";

export type FileResultCallback = {
  (err: Error, file: null): void;
  (err: null, file: FileResult | null): void;
};

export type FileResult = {
  metadata: { [key: string]: any };
  options: { [key: string]: any };
  ast: t.File | null;
  code: string | null;
  map: GeneratorResult["map"] | null;
  sourceType: "script" | "module";
  externalDependencies: Set<string>;
};

export function* run(
  config: ResolvedConfig,
  code: string,
  ast?: t.File | t.Program | null,
): Handler<FileResult> {
  const file = yield* normalizeFile(
    config.passes,
    normalizeOptions(config),
    code,
    ast,
  );

  const opts = file.opts;
  try {
    yield* transformFile(file, config.passes);
  } catch (e) {
    e.message = `${opts.filename ?? "unknown file"}: ${e.message}`;
    if (!e.code) {
      e.code = "BABEL_TRANSFORM_ERROR";
    }
    throw e;
  }

  let outputCode, outputMap;
  try {
    if (opts.code !== false) {
      ({ outputCode, outputMap } = generateCode(config.passes, file));
    }
  } catch (e) {
    e.message = `${opts.filename ?? "unknown file"}: ${e.message}`;
    if (!e.code) {
      e.code = "BABEL_GENERATE_ERROR";
    }
    throw e;
  }

  return {
    metadata: file.metadata,
    options: opts,
    ast: opts.ast === true ? file.ast : null,
    code: outputCode === undefined ? null : outputCode,
    map: outputMap === undefined ? null : outputMap,
    sourceType: file.ast.program.sourceType,
    externalDependencies: flattenToSet(config.externalDependencies),
  };
}

function* transformFile(file: File, pluginPasses: PluginPasses): Handler<void> {
  for (const pluginPairs of pluginPasses) {
    const passPairs: [Plugin, PluginPass][] = [];
    const passes = [];
    const visitors = [];

    for (const plugin of pluginPairs.concat([loadBlockHoistPlugin()])) {
      const pass = new PluginPass(file, plugin.key, plugin.options);

      passPairs.push([plugin, pass]);
      passes.push(pass);
      visitors.push(plugin.visitor);
    }

    for (const [plugin, pass] of passPairs) {
      const fn = plugin.pre;
      if (fn) {
        // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
        const result = fn.call(pass, file);

        // If we want to support async .pre
        yield* [];

        if (isThenable(result)) {
          throw new Error(
            `You appear to be using an plugin with an async .pre, ` +
              `which your current version of Babel does not support. ` +
              `If you're using a published plugin, you may need to upgrade ` +
              `your @babel/core version.`,
          );
        }
      }
    }

    // merge all plugin visitors into a single visitor
    const visitor = traverse.visitors.merge(
      visitors,
      passes,
      file.opts.wrapPluginVisitorMethod,
    );
    if (process.env.BABEL_8_BREAKING) {
      traverse(file.ast.program, visitor, file.scope, null, file.path, true);
    } else {
      traverse(file.ast, visitor, file.scope);
    }

    for (const [plugin, pass] of passPairs) {
      const fn = plugin.post;
      if (fn) {
        // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
        const result = fn.call(pass, file);

        // If we want to support async .post
        yield* [];

        if (isThenable(result)) {
          throw new Error(
            `You appear to be using an plugin with an async .post, ` +
              `which your current version of Babel does not support. ` +
              `If you're using a published plugin, you may need to upgrade ` +
              `your @babel/core version.`,
          );
        }
      }
    }
  }
}
