import { declarePreset } from "@babel/helper-plugin-utils";
import transformFlowStripTypes from "@babel/plugin-transform-flow-strip-types";
import normalizeOptions from "./normalize-options.ts";

export type { Options } from "./normalize-options.ts";

export default declarePreset((api, opts) => {
  api.assertVersion(REQUIRED_VERSION(7));
  const {
    all,
    allowDeclareFields,
    ignoreExtensions = process.env.BABEL_8_BREAKING ? false : true,
    experimental_useHermesParser: useHermesParser = false,
  } = normalizeOptions(opts);

  const plugins: any[] = [
    [transformFlowStripTypes, { all, allowDeclareFields }],
  ];

  if (useHermesParser) {
    if (Number.parseInt(process.versions.node, 10) < 12) {
      throw new Error(
        "The Hermes parser is only supported in Node 12 and later.",
      );
    }
    if (IS_STANDALONE) {
      throw new Error(
        "The Hermes parser is not supported in the @babel/standalone.",
      );
    }
    plugins.unshift("babel-plugin-syntax-hermes-parser");
  }

  if (ignoreExtensions) {
    return { plugins };
  }

  return {
    overrides: [
      {
        test: filename => filename == null || !/\.tsx?$/.test(filename),
        plugins,
      },
    ],
  };
});
