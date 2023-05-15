import presetStage2 from "./preset-stage-2";
import * as babelPlugins from "./generated/plugins";

export default (_: any, opts: any = {}) => {
  const {
    loose = false,
    useBuiltIns = false,
    decoratorsLegacy,
    decoratorsVersion,
    decoratorsBeforeExport,
    pipelineProposal,
    pipelineTopicToken,
    recordAndTupleSyntax,
  } = opts;

  return {
    presets: [
      [
        presetStage2,
        {
          loose,
          useBuiltIns,
          decoratorsLegacy,
          decoratorsVersion,
          decoratorsBeforeExport,
          pipelineProposal,
          pipelineTopicToken,
          recordAndTupleSyntax,
        },
      ],
    ],
    plugins: [
      babelPlugins.syntaxDecimal,
      babelPlugins.proposalExportDefaultFrom,
      babelPlugins.proposalDoExpressions,
      babelPlugins.proposalAwaitOperations,
    ],
  };
};
