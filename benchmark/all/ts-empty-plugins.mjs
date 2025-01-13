import {
  loadFixtures,
  generateCaseName,
  baselineCore,
  currentCore,
  addBenchCase,
  baselineParser,
  currentParser,
  baselineTraverse,
  currentTraverse,
  currentGenerator,
  baselineGenerator,
} from "../util.mjs";

const opts = {
  filename: "file.ts",
  configFile: false,
  babelrc: false,
  browserslistConfigFile: false,
  parserOpts: {
    sourceType: "module",
    plugins: ["typescript"],
  },
  generatorOpts: {
    compact: false,
  },
};

const fixtures = loadFixtures("ts");

fixtures.forEach(({ name, content }) => {
  if (name.includes("ts-checker.ts")) return;

  addBenchCase(
    `${generateCaseName(import.meta.url)} transformSync ${name}`,
    baselineCore.transformSync,
    currentCore.transformSync,
    [content, opts]
  );

  addBenchCase(
    `${generateCaseName(import.meta.url)} parser+traverse+generate ${name}`,
    () => {
      const ast = baselineParser.parse(content, opts.parserOpts);
      baselineTraverse(ast);
      baselineGenerator(ast, opts.generatorOpts);
    },
    () => {
      const ast = currentParser.parse(content, opts.parserOpts);
      currentTraverse(ast);
      currentGenerator(ast, opts.generatorOpts);
    }
  );
});
