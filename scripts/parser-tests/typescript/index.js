import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import TestRunner from "../utils/parser-test-runner.js";
import ErrorCodes from "./error-codes.js";

const getEncoding = path =>
  ({ fffe: "utf-16le", feff: "utf-16be" })[
    fs.readFileSync(path).slice(0, 2).toString("hex")
  ] || "utf-8";

const ErrorCodeRegExp = new RegExp(ErrorCodes.join("|"));

const dirname = path.dirname(fileURLToPath(import.meta.url));

function* loadTests(dir) {
  const names = fs.readdirSync(dir).map(name => [name, path.join(dir, name)]);

  for (const [name, filename] of names) {
    const encoding = getEncoding(filename);
    if (encoding === "utf-16be" || encoding === "binary") continue;
    yield {
      name,
      contents: fs.readFileSync(filename, encoding),
    };
  }
}

const TSTestsPath = path.join(dirname, "../../../build/typescript/tests");

// Check if the baseline errors contain the codes that should also be thrown from babel-parser
function baselineContainsParserErrorCodes(testName) {
  try {
    return ErrorCodeRegExp.test(
      fs.readFileSync(
        path.join(
          TSTestsPath,
          "baselines/reference",
          testName.replace(/\.tsx?$/, ".errors.txt")
        ),
        "utf8"
      )
    );
  } catch (e) {
    if (e.code !== "ENOENT") {
      throw e;
    }
    return false;
  }
}

const IgnoreRegExp = /@noTypesAndSymbols|ts-ignore|\n#!/;
const AlwaysStrictRegExp = /^\/\/\s*@alwaysStrict:\s*true/m;

const runner = new TestRunner({
  testDir: path.join(TSTestsPath, "./cases/compiler"),
  allowlist: path.join(dirname, "allowlist.txt"),
  logInterval: 50,
  shouldUpdate: process.argv.includes("--update-allowlist"),

  *getTests() {
    for (const test of loadTests(this.testDir)) {
      if (IgnoreRegExp.test(test.contents)) {
        yield { id: test.name, expectedError: false, contents: "" };
        continue;
      }

      const strictMode = AlwaysStrictRegExp.test(test.contents) || void 0;
      const files = toFiles(strictMode, test.contents, test.name);
      const expectedError =
        files.length > 0 && baselineContainsParserErrorCodes(test.name);

      yield { id: test.name, expectedError, contents: files };
    }
  },
});

function toFiles(strictMode, contents, name) {
  return splitTwoslashCodeInfoFiles(contents, "default", `${name}/`)
    .map(([filename, lines]) => [
      filename.replace(/\/default$/, ""),
      lines.join("\n"),
    ])
    .filter(
      ([sourceFilename, contents]) =>
        !/\.(?:css|js|json|md)$/.test(sourceFilename) &&
        contents.split("\n").some(line => !/^\s*$|^\/\/[^\n]*$/.test(line))
    )
    .map(([sourceFilename, contents]) => ({
      contents,
      sourceFilename,
      sourceType: "unambiguous",
      strictMode,
      plugins: [
        ["typescript", { dts: sourceFilename.endsWith(".d.ts") }],
        "decorators-legacy",
        "importAssertions",
        /\.[tj]sx$/.test(sourceFilename) && "jsx",
      ].filter(plugin => !!plugin),
    }));
}

const BracketedFileRegExp = /\/\/\/\/\s*\[([^\]]+)\][^\n]*(\n|$)/;
const AtFileRegExp = /(?:^|\n)\/\/\s*@filename:\s*(\S+)\s*(?:\n|$)/i;

// Modified from: https://github.com/microsoft/TypeScript-Website/blob/v2/packages/ts-twoslasher/src/index.ts
function splitTwoslashCodeInfoFiles(code, defaultFileName, root = "") {
  const lines = code.split(/\r\n?|\n/g);

  let nameForFile = code.includes(`@filename: ${defaultFileName}`)
    ? "global.ts"
    : defaultFileName;
  let currentFileContent = [];
  const fileMap = [];

  for (const line of lines) {
    const newFileName = BracketedFileRegExp.test(line)
      ? line.match(BracketedFileRegExp)[1]
      : (line.match(AtFileRegExp)?.[1] ?? false);
    if (newFileName) {
      fileMap.push([root + nameForFile, currentFileContent]);
      nameForFile = newFileName;
      currentFileContent = [];
    } else {
      currentFileContent.push(line);
    }
  }
  fileMap.push([root + nameForFile, currentFileContent]);

  // Basically, strip these:
  // ["index.ts", []]
  // ["index.ts", [""]]
  const nameContent = fileMap.filter(
    n =>
      n[1].length > 2 ||
      (n[1].length === 1 && n[1][0] !== "") ||
      (n[1].length === 2 && n[1][0] !== "content not parsed" && n[1][0] !== "")
  );
  return nameContent;
}

runner.run().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
