import { declare } from "@babel/helper-plugin-utils";

const PIPELINE_PROPOSALS = process.env.BABEL_8_BREAKING
  ? (["fsharp", "hack"] as const)
  : (["minimal", "fsharp", "hack", "smart"] as const);
const TOPIC_TOKENS = ["^^", "@@", "^", "%", "#"] as const;
const documentationURL =
  "https://babeljs.io/docs/en/babel-plugin-proposal-pipeline-operator";

export interface Options {
  proposal: (typeof PIPELINE_PROPOSALS)[number];
  topicToken?: (typeof TOPIC_TOKENS)[number];
}

export default declare((api, { proposal, topicToken }: Options) => {
  api.assertVersion(REQUIRED_VERSION(7));

  if (
    typeof proposal !== "string" ||
    // @ts-ignore(Babel 7 vs Babel 8) due to the different contents of PIPELINE_PROPOSALS
    !PIPELINE_PROPOSALS.includes(proposal)
  ) {
    const proposalList = PIPELINE_PROPOSALS.map(p => `"${p}"`).join(", ");
    throw new Error(
      `The pipeline plugin requires a "proposal" option. "proposal" must be one of: ${proposalList}. See <${documentationURL}>.`,
    );
  }

  if (proposal === "hack" && !TOPIC_TOKENS.includes(topicToken)) {
    const topicTokenList = TOPIC_TOKENS.map(t => `"${t}"`).join(", ");
    throw new Error(
      `The pipeline plugin in "proposal": "hack" mode also requires a "topicToken" option. "topicToken" must be one of: ${topicTokenList}. See <${documentationURL}>.`,
    );
  }

  return {
    name: "syntax-pipeline-operator",

    manipulateOptions(opts, parserOpts) {
      // Add parser options.
      // @ts-expect-error Babel 7 compatibility
      parserOpts.plugins.push(["pipelineOperator", { proposal, topicToken }]);

      // Add generator options.
      opts.generatorOpts.topicToken = topicToken;
    },
  };
});
