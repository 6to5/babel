import {
  loadFixtures,
  addBenchCase,
  baselineParser,
  baselineGenerator,
  currentGenerator,
  generateCaseName,
} from "../util.mjs";

const fixtures = loadFixtures();

fixtures.forEach(({ name, content }) => {
  const ast = baselineParser.parse(content, {
    sourceType: "module",
    plugins: name.endsWith(".ts") ? ["typescript"] : [],
  });

  addBenchCase(
    `${generateCaseName(import.meta.url)} ${name}`,
    baselineGenerator,
    currentGenerator,
    [ast]
  );
});
