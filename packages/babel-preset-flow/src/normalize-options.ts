import { OptionValidator } from "@babel/helper-validator-option";
const v = new OptionValidator("@babel/preset-flow");

export type Options = {
  all?: boolean;
  ignoreExtensions?: boolean;
  experimental_useHermesParser?: boolean;
};

export default function normalizeOptions(options: Options = {}) {
  let { all, ignoreExtensions, experimental_useHermesParser } = options;
  // @ts-expect-error Babel 7 only
  const { allowDeclareFields } = options;

  if (process.env.BABEL_8_BREAKING) {
    v.invariant(
      !("allowDeclareFields" in options),
      `Since Babel 8, \`declare property: A\` is always supported, and the "allowDeclareFields" option is no longer available. Please remove it from your config.`,
    );
    const TopLevelOptions = {
      all: "all",
      ignoreExtensions: "ignoreExtensions",
      experimental_useHermesParser: "experimental_useHermesParser",
    };
    v.validateTopLevelOptions(options, TopLevelOptions);
    all = v.validateBooleanOption(TopLevelOptions.all, all);
    ignoreExtensions = v.validateBooleanOption(
      TopLevelOptions.ignoreExtensions,
      ignoreExtensions,
    );
    experimental_useHermesParser = v.validateBooleanOption(
      TopLevelOptions.experimental_useHermesParser,
      experimental_useHermesParser,
    );
    return {
      all,
      ignoreExtensions,
      experimental_useHermesParser,
    };
  } else {
    return {
      all,
      allowDeclareFields,
      ignoreExtensions,
      experimental_useHermesParser,
    };
  }
}
