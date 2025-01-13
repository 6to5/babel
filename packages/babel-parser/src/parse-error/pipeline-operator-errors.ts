import type { ParseErrorTemplates } from "../parse-error.ts";
import toNodeDescription from "./to-node-description.ts";

export const UnparenthesizedPipeBodyDescriptions = new Set([
  "ArrowFunctionExpression",
  "AssignmentExpression",
  "ConditionalExpression",
  "YieldExpression",
] as const);

type GetSetMemberType<T extends Set<any>> =
  T extends Set<infer M> ? M : unknown;

export type UnparenthesizedPipeBodyTypes = GetSetMemberType<
  typeof UnparenthesizedPipeBodyDescriptions
>;

export default {
  // This error is only used by the smart-mix proposal
  PipeBodyIsTighter:
    "Unexpected yield after pipeline body; any yield expression acting as Hack-style pipe body must be parenthesized due to its loose operator precedence.",
  PipeTopicRequiresHackPipes: process.env.BABEL_8_BREAKING
    ? 'Topic references are only supported when using the `"proposal": "hack"` version of the pipeline proposal.'
    : 'Topic reference is used, but the pipelineOperator plugin was not passed a "proposal": "hack" or "smart" option.',
  PipeTopicUnbound:
    "Topic reference is unbound; it must be inside a pipe body.",
  PipeTopicUnconfiguredToken: ({ token }: { token: string }) =>
    `Invalid topic token ${token}. In order to use ${token} as a topic reference, the pipelineOperator plugin must be configured with { "proposal": "hack", "topicToken": "${token}" }.`,
  PipeTopicUnused:
    "Hack-style pipe body does not contain a topic reference; Hack-style pipes must use topic at least once.",
  PipeUnparenthesizedBody: ({ type }: { type: UnparenthesizedPipeBodyTypes }) =>
    `Hack-style pipe body cannot be an unparenthesized ${toNodeDescription({
      type,
    })}; please wrap it in parentheses.`,

  ...(process.env.BABEL_8_BREAKING
    ? {}
    : {
        // Messages whose codes start with “Pipeline” or “PrimaryTopic”
        // are retained for backwards compatibility
        // with the deprecated smart-mix pipe operator proposal plugin.
        // They are subject to removal in a future major version.
        PipelineBodyNoArrow:
          'Unexpected arrow "=>" after pipeline body; arrow function in pipeline body must be parenthesized.',
        PipelineBodySequenceExpression:
          "Pipeline body may not be a comma-separated sequence expression.",
        PipelineHeadSequenceExpression:
          "Pipeline head should not be a comma-separated sequence expression.",
        PipelineTopicUnused:
          "Pipeline is in topic style but does not use topic reference.",
        PrimaryTopicNotAllowed:
          "Topic reference was used in a lexical context without topic binding.",
        PrimaryTopicRequiresSmartPipeline:
          'Topic reference is used, but the pipelineOperator plugin was not passed a "proposal": "hack" or "smart" option.',
      }),
} satisfies ParseErrorTemplates;
