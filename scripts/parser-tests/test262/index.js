import path from "path";
import { fileURLToPath } from "url";
import fs from "node:fs";
import TestStream from "test262-stream";
import TestRunner from "../utils/parser-test-runner.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const ignoredFeaturesJsonPath = new URL(
  "./ignored-features.json",
  import.meta.url
);
const ignoredFeatures = (
  await import(ignoredFeaturesJsonPath, {
    with: { type: "json" },
  })
).default;

const ignoredFeaturesSet = new Set(ignoredFeatures);

function featureShouldIgnore(feature) {
  return (
    ignoredFeaturesSet.has(feature) ||
    // All prototype method must not introduce new language syntax
    feature.includes(".prototype.") ||
    // Ignore Intl features
    feature.startsWith("Intl.")
  );
}

const ignoredTests = ["built-ins/RegExp/", "language/literals/regexp/"];

const featuresToPlugins = new Map([
  ["import-assertions", "importAssertions"],
  ["import-attributes", "importAttributes"],
  ["import-defer", "deferredImportEvaluation"],
  [
    "decorators",
    [
      ["decorators", { version: "2022-03", decoratorsBeforeExport: false }],
      "decoratorAutoAccessors",
    ],
  ],
  ["explicit-resource-management", "explicitResourceManagement"],
  ["source-phase-imports", "sourcePhaseImports"],
  ["source-phase-imports-module-source", "sourcePhaseImports"],
]);

const unmappedFeatures = new Set();

function* getPlugins(features) {
  if (!features) return;

  for (const f of features) {
    if (featuresToPlugins.has(f)) {
      yield featuresToPlugins.get(f);
    } else if (!featureShouldIgnore(f)) {
      unmappedFeatures.add(f);
    }
  }
}

function updateIgnoredFeatures(unmappedFeatures) {
  ignoredFeatures.push(...unmappedFeatures);
  ignoredFeatures.sort();
  fs.writeFileSync(
    ignoredFeaturesJsonPath,
    // editorconfig enables insert_final_newline
    JSON.stringify(ignoredFeatures, undefined, 2) + "\n"
  );
}

const shouldUpdate = process.argv.includes("--update-allowlist");

const runner = new TestRunner({
  testDir: path.join(dirname, "../../../build/test262").replace(/\\/g, "/"),
  allowlist: path.join(dirname, "allowlist.txt"),
  logInterval: 500,
  shouldUpdate: shouldUpdate,

  async *getTests() {
    const stream = new TestStream(this.testDir, {
      omitRuntime: true,
    });

    for await (const test of stream) {
      // strip test/
      const fileName = test.file.slice(5).replace(/\\/g, "/");

      if (ignoredTests.some(start => fileName.startsWith(start))) continue;
      if (fileName.endsWith(".md")) continue;

      yield {
        contents: test.contents,
        fileName,
        id: `${fileName}(${test.scenario})`,
        sourceType: test.attrs.flags.module ? "module" : "script",
        createImportExpressions: true,
        plugins: Array.from(getPlugins(test.attrs.features)).flat(),
        expectedError:
          !!test.attrs.negative &&
          (test.attrs.negative.phase === "parse" ||
            test.attrs.negative.phase === "early"),
      };
    }
  },
});

runner
  .run()
  .then(() => {
    if (unmappedFeatures.size) {
      console.warn("");
      console.warn(
        "The following Features are not currently mapped or ignored:"
      );
      console.warn(
        Array.from(unmappedFeatures).join("\n").replace(/^/gm, "   ")
      );

      if (shouldUpdate) {
        updateIgnoredFeatures(unmappedFeatures);
      } else {
        process.exitCode = 1;
      }
    }
  })
  .catch(err => {
    console.error(err);
    process.exitCode = 1;
  });
