import {
  loadFixtures,
  generateCaseName,
  baselineCore,
  baselinePresetEnv,
  currentPresetEnv,
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
  targets: "node 6",
};

const fixtures = loadFixtures("js");

fixtures.forEach(({ name, content }) => {
  addBenchCase(
    `${generateCaseName(import.meta.url)} ${name}`,
    () => {
      baselineCore.transformSync(content, {
        presets: [baselinePresetEnv],
        ...opts,
      });
    },
    () => {
      currentCore.transformSync(content, {
        presets: [currentPresetEnv],
        ...opts,
      });
    }
  );
});
