import {
  loadFixtures,
  generateCaseName,
  baselineCore,
  currentCore,
  baselinePluginCommonjs,
  currentPluginCommonjs,
  addBenchCase,
} from "../util.mjs";

const opts = {
  filename: "file.mjs",
  configFile: false,
  babelrc: false,
  browserslistConfigFile: false,
  generatorOpts: {
    compact: false,
  },
};

const fixtures = loadFixtures("mjs");

fixtures.forEach(({ name, content }) => {
  addBenchCase(
    `${generateCaseName(import.meta.url)} ${name}`,
    () => {
      baselineCore.transformSync(content, {
        plugins: [baselinePluginCommonjs],
        ...opts,
      });
    },
    () => {
      currentCore.transformSync(content, {
        plugins: [currentPluginCommonjs],
        ...opts,
      });
    }
  );
});
