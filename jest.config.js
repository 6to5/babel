const semver = require("semver");
const shell = require("shelljs");

const nodeVersion = process.versions.node;
const supportsESMAndJestLightRunner = semver.satisfies(
  nodeVersion,
  // ^12.22 || >=14.17 : Node will throw "t.isIdentifier is not a function" when test is running in worker threads.
  // ^13.7: `resolve.exports` specifies conditional exports in package.json
  "^12.22 || ^13.7 || >=14.17"
);
const isPublishBundle = process.env.IS_PUBLISH;

if (!supportsESMAndJestLightRunner) {
  //Avoid source maps from breaking stack tests.
  shell.rm("-rf", "packages/babel-core/lib/**/*.js.map");
}

module.exports = {
  runner: supportsESMAndJestLightRunner ? "jest-light-runner" : "jest-runner",

  snapshotFormat: { escapeString: true, printBasicPrototype: true },
  coverageProvider: "v8",
  collectCoverageFrom: [
    "packages/*/lib/**/*.{js,cjs,mjs,ts}",
    "codemods/*/lib/**/*.{js,cjs,mjs,ts}",
    "eslint/*/lib/**/*.{js,cjs,mjs,ts}",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/packages/babel-standalone/",
    "/test/(fixtures|tmp|__data__)/",
    ".*\\.d\\.ts",
    "<rootDir>/packages/babel-standalone/.*",
    "<rootDir>/packages/babel-types/.*/generated/.*",
    "<rootDir>/packages/babel-helpers/.*/helpers/.*",
    "<rootDir>/packages/babel-core/.*/vendor/.*",

    // For v8 coverage provider
    "<rootDir>/packages/babel-helpers/.*/helpers/.*",
  ],

  // The eslint/* packages is tested against ESLint v8, which has dropped support for Node v10.
  // TODO: Remove this process.version check in Babel 8.
  testRegex: `./(packages|codemods${
    semver.satisfies(nodeVersion, "<12") ? "" : "|eslint"
  })/[^/]+/test/.+\\.m?js$`,
  testPathIgnorePatterns: [
    "/node_modules/",
    "/test/fixtures/",
    "/test/debug-fixtures/",
    "/babel-parser/test/expressions/",
    "/test/tmp/",
    "/test/__data__/",
    "/test/helpers/",
    "<rootDir>/test/warning\\.js",
    "<rootDir>/build/",
    "<rootDir>/.history/", // local directory for VSCode Extension - https://marketplace.visualstudio.com/items?itemName=xyz.local-history
    "_browser\\.js",
    // Some tests require internal files of bundled packages, which are not available
    // in production builds. They are marked using the .skip-bundled.js extension.
    ...(isPublishBundle ? ["\\.skip-bundled\\.js$"] : []),
    // Ignore @babel/standalone test in coverage testing because it is not built
    ...(process.env.BABEL_COVERAGE === "true"
      ? ["<rootDir>/packages/babel-standalone/"]
      : []),
  ],
  testEnvironment: "node",
  transformIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/packages/babel-standalone/babel(\\.min)?\\.js",
    "/test/(fixtures|tmp|__data__)/",
    "<rootDir>/(packages|codemods|eslint)/[^/]+/lib/",
  ],
  modulePathIgnorePatterns: [
    "/test/fixtures/",
    "/test/tmp/",
    "/test/__data__/",
    "<rootDir>/build/",
  ],
  // We don't need module name mappers here as depedencies of workspace
  // package should be declared explicitly in the package.json
  // Yarn will generate correct file links so that Jest can resolve correctly
  moduleNameMapper: null,
};
