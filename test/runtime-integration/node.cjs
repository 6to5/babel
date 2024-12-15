const cp = require("child_process");
const path = require("path");
const fs = require("fs");

const [major, minor] = process.versions.node.split(".").map(n => +n);

if (
  major > 13 ||
  (major === 12 && minor >= 17) ||
  (major === 13 && minor >= 2)
) {
  const expectedEsm =
    major === 13 && minor <= 3
      ? "expected-esm-13.2.txt"
      : major < 16 || (major === 16 && minor <= 5)
        ? "expected-esm-16.0.txt"
        : major < 22 || (major === 22 && minor <= 11)
          ? "expected-esm-22.11.txt"
          : "expected-esm.txt";

  test("ESM", "./src/main-esm.mjs", expectedEsm);
  // TODO: This never worked in any Babel version
  // test("ESM - absoluteRuntime", "--experimental-modules ./src/absolute/main-esm.mjs", "expected-esm-absolute.txt");
}

const expectedCjs =
  major === 10 || (major === 12 && minor < 12.17)
    ? "expected-cjs-10.txt"
    : major === 13 && minor <= 1
      ? "expected-cjs-13.0.txt"
      : major === 13 && minor <= 3
        ? "expected-cjs-13.2.txt"
        : major < 16 || (major === 16 && minor <= 5)
          ? "expected-cjs-16.0.txt"
          : major < 22 || (major === 22 && minor <= 11)
            ? "expected-cjs-22.11.txt"
            : "expected-cjs.txt";

test("CJS", "./src/main-cjs.cjs", expectedCjs);

const expectedCjsAbsolute =
  major === 10 || (major === 12 && minor < 12.17)
    ? "expected-cjs-absolute-10.txt"
    : major === 13 && minor <= 1
      ? "expected-cjs-absolute-13.0.txt"
      : major === 13 && minor <= 3
        ? "expected-cjs-absolute-13.2.txt"
        : major < 16 || (major === 16 && minor <= 5)
          ? "expected-cjs-absolute-16.0.txt"
          : major < 22 || (major === 22 && minor <= 11)
            ? "expected-cjs-absolute-22.11.txt"
            : "expected-cjs-absolute.txt";

test(
  "CJS - absoluteRuntime",
  "./src/absolute/main-cjs.cjs",
  expectedCjsAbsolute
);

function test(title, command, expectedName) {
  const expectedPath = path.join(__dirname, expectedName);
  const expected = fs.readFileSync(expectedPath, "utf8");

  console.log(`Testing with Node.js ${process.version} - ${title}`);
  const out = normalize(
    cp.execSync(
      `node ${
        major > 22 || (major === 22 && minor >= 12)
          ? "--disable-warning=ExperimentalWarning "
          : ""
      }${command}`,
      {
        cwd: __dirname,
        encoding: "utf8",
      }
    )
  );

  if (expected === out) {
    console.log("OK");
  } else if (process.env.OVERWRITE) {
    fs.writeFileSync(expectedPath, out);
    console.log("UPDATED");
  } else {
    console.error("FAILED\n\n");
    console.error(out);
    process.exitCode = 1;
  }
  console.log("\n");
}

function normalize(output) {
  const root = path.resolve(__dirname, "../..");
  let next;
  while ((next = output.replace(root, "<ROOT>")) !== output) {
    output = next;
  }
  return output;
}
