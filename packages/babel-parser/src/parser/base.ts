import type { OptionFlags, Options } from "../options.ts";
import type State from "../tokenizer/state.ts";
import type { PluginsMap } from "./index.ts";
import type ScopeHandler from "../util/scope.ts";
import type ExpressionScopeHandler from "../util/expression-scope.ts";
import type ClassScopeHandler from "../util/class-scope.ts";
import type ProductionParameterHandler from "../util/production-parameter.ts";
import type {
  ParserPluginWithOptions,
  PluginConfig,
  PluginOptions,
} from "../typings.ts";
import type * as N from "../types.ts";

export default class BaseParser {
  // Properties set by constructor in index.js
  declare options: Options;
  declare optionFlags: OptionFlags;
  declare inModule: boolean;
  declare scope: ScopeHandler<any>;
  declare classScope: ClassScopeHandler;
  declare prodParam: ProductionParameterHandler;
  declare expressionScope: ExpressionScopeHandler;
  declare plugins: PluginsMap;
  declare filename: string | undefined | null;
  declare startIndex: number;
  // Names of exports store. `default` is stored as a name for both
  // `export default foo;` and `export { foo as default };`.
  declare exportedIdentifiers: Set<string>;
  sawUnambiguousESM: boolean = false;
  ambiguousScriptDifferentAst: boolean = false;

  // Initialized by Tokenizer
  declare state: State;
  // input and length are not in state as they are constant and we do
  // not want to ever copy them, which happens if state gets cloned
  declare input: string;
  declare length: number;
  // Comment store for Program.comments
  declare comments: Array<N.Comment>;

  sourceToOffsetPos(sourcePos: number) {
    return sourcePos + this.startIndex;
  }

  offsetToSourcePos(offsetPos: number) {
    return offsetPos - this.startIndex;
  }

  // This method accepts either a string (plugin name) or an array pair
  // (plugin name and options object). If an options object is given,
  // then each value is non-recursively checked for identity with that
  // plugin’s actual option value.
  hasPlugin(pluginConfig: PluginConfig): boolean {
    if (typeof pluginConfig === "string") {
      return this.plugins.has(pluginConfig);
    } else {
      const [pluginName, pluginOptions] = pluginConfig;
      if (!this.hasPlugin(pluginName)) {
        return false;
      }
      const actualOptions = this.plugins.get(pluginName);
      for (const key of Object.keys(
        pluginOptions,
      ) as (keyof typeof pluginOptions)[]) {
        if (actualOptions?.[key] !== pluginOptions[key]) {
          return false;
        }
      }
      return true;
    }
  }

  getPluginOption<
    PluginName extends ParserPluginWithOptions[0],
    OptionName extends keyof PluginOptions<PluginName>,
  >(plugin: PluginName, name: OptionName) {
    return (this.plugins.get(plugin) as null | PluginOptions<PluginName>)?.[
      name
    ];
  }
}
