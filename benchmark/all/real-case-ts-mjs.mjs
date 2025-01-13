import {
  loadFixtures,
  generateCaseName,
  baselineCore,
  baselinePresetTypescript,
  currentPresetTypescript,
  currentCore,
  addBenchCase,
} from "../util.mjs";

const opts = {
  filename: "file.ts",
  configFile: false,
  babelrc: false,
  browserslistConfigFile: false,
  generatorOpts: {
    compact: false,
  },
};

const fixtures = loadFixtures("ts");

fixtures.forEach(({ name, content }) => {
  if (name.includes("ts-checker.ts")) return;

  addBenchCase(
    `${generateCaseName(import.meta.url)} ${name}`,
    () => {
      baselineCore.transformSync(content, {
        presets: [baselinePresetTypescript],
        ...opts,
      });
    },
    () => {
      currentCore.transformSync(content, {
        presets: [currentPresetTypescript],
        ...opts,
      });
    }
  );
});
