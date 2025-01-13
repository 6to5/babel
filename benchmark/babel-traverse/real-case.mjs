import {
  loadFixtures,
  addBenchCase,
  generateCaseName,
  baselineParser,
  baselineTraverse,
  currentTraverse,
} from "../util.mjs";

const fixtures = loadFixtures();

fixtures.forEach(({ name, content }) => {
  if (name.includes("ts-checker.ts")) return;

  const ast = baselineParser.parse(content, {
    sourceType: "module",
    plugins: name.endsWith(".ts") ? ["typescript"] : [],
  });

  const opts = {
    Identifier() {},
  };

  addBenchCase(
    `${generateCaseName(import.meta.url)} ${name}`,
    () => {
      baselineTraverse(ast, opts);
      baselineTraverse.cache.clear();
    },
    () => {
      currentTraverse(ast, opts);
      currentTraverse.cache.clear();
    }
  );
});
