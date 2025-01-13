import type Parser from "./parser/index.ts";
import type { PluginConfig } from "./typings.ts";

export type Plugin = PluginConfig;

export type PluginList = PluginConfig[];

export type MixinPlugin = (
  superClass: new (...args: any) => Parser,
) => new (...args: any) => Parser;

const PIPELINE_PROPOSALS = process.env.BABEL_8_BREAKING
  ? ["fsharp", "hack"]
  : ["minimal", "fsharp", "hack", "smart"];
const TOPIC_TOKENS = ["^^", "@@", "^", "%", "#"];

export function validatePlugins(pluginsMap: Map<string, any>) {
  if (pluginsMap.has("decorators")) {
    if (pluginsMap.has("decorators-legacy")) {
      throw new Error(
        "Cannot use the decorators and decorators-legacy plugin together",
      );
    }

    const decoratorsBeforeExport =
      pluginsMap.get("decorators").decoratorsBeforeExport;
    if (
      decoratorsBeforeExport != null &&
      typeof decoratorsBeforeExport !== "boolean"
    ) {
      throw new Error(
        "'decoratorsBeforeExport' must be a boolean, if specified.",
      );
    }

    const allowCallParenthesized =
      pluginsMap.get("decorators").allowCallParenthesized;
    if (
      allowCallParenthesized != null &&
      typeof allowCallParenthesized !== "boolean"
    ) {
      throw new Error("'allowCallParenthesized' must be a boolean.");
    }
  }

  if (pluginsMap.has("flow") && pluginsMap.has("typescript")) {
    throw new Error("Cannot combine flow and typescript plugins.");
  }

  if (pluginsMap.has("placeholders") && pluginsMap.has("v8intrinsic")) {
    throw new Error("Cannot combine placeholders and v8intrinsic plugins.");
  }

  if (pluginsMap.has("pipelineOperator")) {
    const proposal = pluginsMap.get("pipelineOperator").proposal;

    if (!PIPELINE_PROPOSALS.includes(proposal)) {
      const proposalList = PIPELINE_PROPOSALS.map(p => `"${p}"`).join(", ");
      throw new Error(
        `"pipelineOperator" requires "proposal" option whose value must be one of: ${proposalList}.`,
      );
    }

    const tupleSyntaxIsHash = process.env.BABEL_8_BREAKING
      ? pluginsMap.has("recordAndTuple")
      : pluginsMap.get("recordAndTuple")?.syntaxType === "hash";

    if (proposal === "hack") {
      if (pluginsMap.has("placeholders")) {
        throw new Error(
          "Cannot combine placeholders plugin and Hack-style pipes.",
        );
      }

      if (pluginsMap.has("v8intrinsic")) {
        throw new Error(
          "Cannot combine v8intrinsic plugin and Hack-style pipes.",
        );
      }

      const topicToken = pluginsMap.get("pipelineOperator").topicToken;

      if (!TOPIC_TOKENS.includes(topicToken)) {
        const tokenList = TOPIC_TOKENS.map(t => `"${t}"`).join(", ");

        throw new Error(
          `"pipelineOperator" in "proposal": "hack" mode also requires a "topicToken" option whose value must be one of: ${tokenList}.`,
        );
      }

      if (topicToken === "#" && tupleSyntaxIsHash) {
        throw new Error(
          `Plugin conflict between \`["pipelineOperator", { proposal: "hack", topicToken: "#" }]\` and \`${JSON.stringify(["recordAndTuple", pluginsMap.get("recordAndTuple")])}\`.`,
        );
      }
    } else if (
      !process.env.BABEL_8_BREAKING &&
      proposal === "smart" &&
      tupleSyntaxIsHash
    ) {
      throw new Error(
        `Plugin conflict between \`["pipelineOperator", { proposal: "smart" }]\` and \`${JSON.stringify(["recordAndTuple", pluginsMap.get("recordAndTuple")])}\`.`,
      );
    }
  }

  if (pluginsMap.has("moduleAttributes")) {
    if (process.env.BABEL_8_BREAKING) {
      throw new Error(
        "`moduleAttributes` has been removed in Babel 8, please migrate to import attributes instead.",
      );
    } else {
      if (
        pluginsMap.has("deprecatedImportAssert") ||
        pluginsMap.has("importAssertions")
      ) {
        throw new Error(
          "Cannot combine importAssertions, deprecatedImportAssert and moduleAttributes plugins.",
        );
      }
      const moduleAttributesVersionPluginOption =
        pluginsMap.get("moduleAttributes").version;
      if (moduleAttributesVersionPluginOption !== "may-2020") {
        throw new Error(
          "The 'moduleAttributes' plugin requires a 'version' option," +
            " representing the last proposal update. Currently, the" +
            " only supported value is 'may-2020'.",
        );
      }
    }
  }
  if (pluginsMap.has("importAssertions")) {
    if (process.env.BABEL_8_BREAKING) {
      throw new Error(
        "`importAssertions` has been removed in Babel 8, please use import attributes instead." +
          " To use the non-standard `assert` syntax you can enable the `deprecatedImportAssert` parser plugin.",
      );
    } else if (pluginsMap.has("deprecatedImportAssert")) {
      throw new Error(
        "Cannot combine importAssertions and deprecatedImportAssert plugins.",
      );
    }
  }
  if (
    !pluginsMap.has("deprecatedImportAssert") &&
    pluginsMap.has("importAttributes") &&
    pluginsMap.get("importAttributes").deprecatedAssertSyntax
  ) {
    if (process.env.BABEL_8_BREAKING) {
      throw new Error(
        "The 'importAttributes' plugin has been removed in Babel 8. If you need to enable support " +
          "for the deprecated `assert` syntax, you can enable the `deprecatedImportAssert` parser plugin.",
      );
    } else {
      pluginsMap.set("deprecatedImportAssert", {});
    }
  }

  if (pluginsMap.has("recordAndTuple")) {
    const syntaxType = pluginsMap.get("recordAndTuple").syntaxType;
    if (syntaxType != null) {
      if (process.env.BABEL_8_BREAKING) {
        if (syntaxType === "hash") {
          throw new Error(
            'The syntaxType option is no longer required in Babel 8. You can safely remove { syntaxType: "hash" } from the recordAndTuple config.',
          );
        } else {
          throw new Error(
            'The syntaxType option is no longer required in Babel 8. Please remove { syntaxType: "bar" } from the recordAndTuple config and migrate to the hash syntax #{} and #[].',
          );
        }
      } else {
        const RECORD_AND_TUPLE_SYNTAX_TYPES = ["hash", "bar"];
        if (!RECORD_AND_TUPLE_SYNTAX_TYPES.includes(syntaxType)) {
          throw new Error(
            "The 'syntaxType' option of the 'recordAndTuple' plugin must be one of: " +
              RECORD_AND_TUPLE_SYNTAX_TYPES.map(p => `'${p}'`).join(", "),
          );
        }
      }
    }
  }

  if (
    pluginsMap.has("asyncDoExpressions") &&
    !pluginsMap.has("doExpressions")
  ) {
    const error = new Error(
      "'asyncDoExpressions' requires 'doExpressions', please add 'doExpressions' to parser plugins.",
    );
    // @ts-expect-error so @babel/core can provide better error message
    error.missingPlugins = "doExpressions";
    throw error;
  }

  if (
    pluginsMap.has("optionalChainingAssign") &&
    pluginsMap.get("optionalChainingAssign").version !== "2023-07"
  ) {
    throw new Error(
      "The 'optionalChainingAssign' plugin requires a 'version' option," +
        " representing the last proposal update. Currently, the" +
        " only supported value is '2023-07'.",
    );
  }

  if (process.env.BABEL_8_BREAKING) {
    if (pluginsMap.has("decimal")) {
      throw new Error(
        "The 'decimal' plugin has been removed in Babel 8. Please remove it from your configuration.",
      );
    }
    if (pluginsMap.has("importReflection")) {
      throw new Error(
        "The 'importReflection' plugin has been removed in Babel 8. Use 'sourcePhaseImports' instead, and " +
          "replace 'import module' with 'import source' in your code.",
      );
    }
  }
}

// These plugins are defined using a mixin which extends the parser class.

import estree from "./plugins/estree.ts";
import flow from "./plugins/flow/index.ts";
import jsx from "./plugins/jsx/index.ts";
import typescript from "./plugins/typescript/index.ts";
import placeholders from "./plugins/placeholders.ts";
import v8intrinsic from "./plugins/v8intrinsic.ts";

// NOTE: order is important. estree must come first; placeholders must come last.
export const mixinPlugins = {
  estree,
  jsx,
  flow,
  typescript,
  v8intrinsic,
  placeholders,
};

export const mixinPluginNames = Object.keys(mixinPlugins) as ReadonlyArray<
  "estree" | "jsx" | "flow" | "typescript" | "v8intrinsic" | "placeholders"
>;
