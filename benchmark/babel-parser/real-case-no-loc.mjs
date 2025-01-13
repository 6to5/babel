import {
  loadFixtures,
  addBenchCase,
  baselineParser,
  currentParser,
  generateCaseName,
} from "../util.mjs";

const fixtures = loadFixtures();

fixtures.forEach(({ name, content }) => {
  addBenchCase(
    `${generateCaseName(import.meta.url)} ${name}`,
    baselineParser.parse,
    currentParser.parse,
    [
      content,
      {
        sourceType: "module",
        locations: false,
        plugins: name.endsWith(".ts") ? ["typescript"] : [],
      },
    ]
  );
});
