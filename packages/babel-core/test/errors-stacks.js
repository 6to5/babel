import * as babel from "../lib/index.js";

import { fileURLToPath } from "url";
import path from "path";

const replaceAll = "".replaceAll
  ? Function.call.bind("".replaceAll)
  : (str, find, replace) => str.split(find).join(replace);

function expectError(run) {
  try {
    run();
  } catch (e) {
    let { stack } = e;
    // Normalize windows paths
    stack = stack.replace(/\\/g, "/");
    // Remove absolute URLs
    stack = replaceAll(stack, process.cwd().replace(/\\/g, "/"), "<CWD>");
    stack = stack.replace(/file:\/\/\/?<CWD>/g, "<CWD>");
    // Remove jest-related stack frames.
    // The `at async Promise.all` frame comes from inside jest-light-runner and is only
    // visible when using --run-in-band, comes from inside jest but doesn't have an
    // associated file path.
    stack = stack.replace(
      /(?:\n\s*at [^\n]+?node_modules\/(?:@?jest|piscina)[^\n]+|\n\s*at async Promise.all[^\n]+)+/g,
      "\n    at ... internal jest frames ...",
    );
    // Remove node internal frames, since they change by version
    stack = stack.replace(
      /(?:\n\s*at ((?:async )?[\w.]+)? ?\((?:node:)?internal\/[^\n]+)+/g,
      "\n    at $1 (... internal node frames ...)",
    );
    // Replace line/column numbers, since they are affected by how
    // the code is compiled. The first optional ?\d+ is added by Jest.
    stack = stack.replace(/(?:\?\d+)?:\d+:\d+(\)?)$/gm, ":_:_$1");

    // This is only needed because Node.js < 16 (and old Jest) stack traces
    // are quite different from newer stack traces.
    // TODO(Babel 8): Delete this code
    {
      // Node.js <= 10
      stack = replaceAll(stack, "Object.parseSync", "Module.parseSync");
      stack = stack.replace(
        /(?:run|Object\.<anonymous>) \((<CWD>[^)]+)\)/g,
        "$1",
      );
      stack = replaceAll(
        stack,
        "at ... internal jest frames ...\n    at Module.parseSync",
        "at require (... internal node frames ...)\n    at Module.parseSync",
      );
      stack = replaceAll(
        stack,
        "\n    at ... internal jest frames ...\n    at new Promise (<anonymous>)",
        "",
      );
      // Node.js 8
      stack = stack.replace(/\n\s*at <anonymous>$/g, "");
      // Node.js 6
      stack = stack.replace(
        /(at (\w+) \([^)]+\)\n\s*at) next \(native\)/g,
        "$1 $2.next (<anonymous>)",
      );
    }

    // expectError is a customized expect wrapper
    // eslint-disable-next-line jest/valid-expect
    return expect(stack);
  }
  throw new Error("It should have thrown an error.");
}

const fixture = name =>
  path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "fixtures/errors",
    name,
  );

describe("@babel/core errors", function () {
  it("error inside config function", function () {
    expectError(() => {
      babel.parseSync("foo;", {
        root: fixture("error-config-function"),
      });
    }).toMatchInlineSnapshot(`
      "Error: Error inside config!
          at myConfig (<CWD>/packages/babel-core/test/fixtures/errors/error-config-function/babel.config.js:_:_)
          at Module.parseSync (<CWD>/packages/babel-core/lib/parse.js:_:_)
          at <CWD>/packages/babel-core/test/errors-stacks.js:_:_
          at expectError (<CWD>/packages/babel-core/test/errors-stacks.js:_:_)
          at <CWD>/packages/babel-core/test/errors-stacks.js:_:_
          at ... internal jest frames ..."
    `);
  });

  it("error inside config function with more frames", function () {
    expectError(() => {
      babel.parseSync("foo;", {
        root: fixture("error-config-function-more-frames"),
      });
    }).toMatchInlineSnapshot(`
      "Error: Error inside config!
          at f (<CWD>/packages/babel-core/test/fixtures/errors/error-config-function-more-frames/babel.config.js:_:_)
          at g (<CWD>/packages/babel-core/test/fixtures/errors/error-config-function-more-frames/babel.config.js:_:_)
          at myConfig (<CWD>/packages/babel-core/test/fixtures/errors/error-config-function-more-frames/babel.config.js:_:_)
          at Module.parseSync (<CWD>/packages/babel-core/lib/parse.js:_:_)
          at <CWD>/packages/babel-core/test/errors-stacks.js:_:_
          at expectError (<CWD>/packages/babel-core/test/errors-stacks.js:_:_)
          at <CWD>/packages/babel-core/test/errors-stacks.js:_:_
          at ... internal jest frames ..."
    `);
  });

  it("error inside config file", function () {
    expectError(() => {
      babel.parseSync("foo;", {
        root: fixture("error-config-file"),
      });
    }).toMatchInlineSnapshot(`
      "Error: Error inside config!
          at <CWD>/packages/babel-core/test/fixtures/errors/error-config-file/babel.config.js:_:_
          at require (... internal node frames ...)
          at Module.parseSync (<CWD>/packages/babel-core/lib/parse.js:_:_)
          at <CWD>/packages/babel-core/test/errors-stacks.js:_:_
          at expectError (<CWD>/packages/babel-core/test/errors-stacks.js:_:_)
          at <CWD>/packages/babel-core/test/errors-stacks.js:_:_
          at ... internal jest frames ..."
    `);
  });

  it("error inside config file with more frames", function () {
    expectError(() => {
      babel.parseSync("foo;", {
        root: fixture("error-config-file-more-frames"),
      });
    }).toMatchInlineSnapshot(`
      "Error: Error inside config!
          at f (<CWD>/packages/babel-core/test/fixtures/errors/error-config-file-more-frames/babel.config.js:_:_)
          at g (<CWD>/packages/babel-core/test/fixtures/errors/error-config-file-more-frames/babel.config.js:_:_)
          at <CWD>/packages/babel-core/test/fixtures/errors/error-config-file-more-frames/babel.config.js:_:_
          at require (... internal node frames ...)
          at Module.parseSync (<CWD>/packages/babel-core/lib/parse.js:_:_)
          at <CWD>/packages/babel-core/test/errors-stacks.js:_:_
          at expectError (<CWD>/packages/babel-core/test/errors-stacks.js:_:_)
          at <CWD>/packages/babel-core/test/errors-stacks.js:_:_
          at ... internal jest frames ..."
    `);
  });

  it("invalid JSON config file", function () {
    expectError(() => {
      babel.parseSync("foo;", {
        root: fixture("invalid-json"),
      });
    }).toMatchInlineSnapshot(`
      "Error: Error while parsing config - JSON5: invalid character '}' at 3:1
          at <CWD>/packages/babel-core/test/fixtures/errors/invalid-json/babel.config.json
          at Module.parseSync (<CWD>/packages/babel-core/lib/parse.js:_:_)
          at <CWD>/packages/babel-core/test/errors-stacks.js:_:_
          at expectError (<CWD>/packages/babel-core/test/errors-stacks.js:_:_)
          at <CWD>/packages/babel-core/test/errors-stacks.js:_:_
          at ... internal jest frames ..."
    `);
  });

  it("use 'exclude' without filename", function () {
    expectError(() => {
      babel.parseSync("foo;", {
        root: fixture("use-exclude"),
      });
    }).toMatchInlineSnapshot(`
      "Error: Configuration contains string/RegExp pattern, but no filename was passed to Babel
          at <CWD>/packages/babel-core/test/fixtures/errors/use-exclude/babel.config.js
          at Module.parseSync (<CWD>/packages/babel-core/lib/parse.js:_:_)
          at <CWD>/packages/babel-core/test/errors-stacks.js:_:_
          at expectError (<CWD>/packages/babel-core/test/errors-stacks.js:_:_)
          at <CWD>/packages/babel-core/test/errors-stacks.js:_:_
          at ... internal jest frames ..."
    `);
  });

  it("use 'exclude' without filename in programmatic options", function () {
    expectError(() => {
      babel.parseSync("foo;", {
        configFile: false,
        exclude: /node_modules/,
      });
    }).toMatchInlineSnapshot(`
      "Error: Configuration contains string/RegExp pattern, but no filename was passed to Babel
          at Module.parseSync (<CWD>/packages/babel-core/lib/parse.js:_:_)
          at <CWD>/packages/babel-core/test/errors-stacks.js:_:_
          at expectError (<CWD>/packages/babel-core/test/errors-stacks.js:_:_)
          at <CWD>/packages/babel-core/test/errors-stacks.js:_:_
          at ... internal jest frames ..."
    `);
  });

  it("use 'exclude' without filename in preset", function () {
    expectError(() => {
      babel.parseSync("foo;", {
        root: fixture("use-exclude-in-preset"),
      });
    }).toMatchInlineSnapshot(`
      "Error: [BABEL] unknown file: Preset /* your preset */ requires a filename to be set when babel is called directly,
      \`\`\`
      babel.transformSync(code, { filename: 'file.ts', presets: [/* your preset */] });
      \`\`\`
      See https://babeljs.io/docs/en/options#filename for more information.
          at Module.parseSync (<CWD>/packages/babel-core/lib/parse.js:_:_)
          at <CWD>/packages/babel-core/test/errors-stacks.js:_:_
          at expectError (<CWD>/packages/babel-core/test/errors-stacks.js:_:_)
          at <CWD>/packages/babel-core/test/errors-stacks.js:_:_
          at ... internal jest frames ..."
    `);
  });

  it("invalid option", function () {
    expectError(() => {
      babel.parseSync("foo;", {
        root: fixture("invalid-option"),
      });
    }).toMatchInlineSnapshot(`
      "Error: .sourceType must be \\"module\\", \\"script\\", \\"unambiguous\\", or undefined
          at <CWD>/packages/babel-core/test/fixtures/errors/invalid-option/babel.config.json
          at Module.parseSync (<CWD>/packages/babel-core/lib/parse.js:_:_)
          at <CWD>/packages/babel-core/test/errors-stacks.js:_:_
          at expectError (<CWD>/packages/babel-core/test/errors-stacks.js:_:_)
          at <CWD>/packages/babel-core/test/errors-stacks.js:_:_
          at ... internal jest frames ..."
    `);
  });

  it("invalid option in programmatic options", function () {
    expectError(() =>
      babel.parseSync("foo;", {
        root: fixture("valid"),
        sourceType: "foo",
      }),
    ).toMatchInlineSnapshot(`
      "Error: .sourceType must be \\"module\\", \\"script\\", \\"unambiguous\\", or undefined
          at Module.parseSync (<CWD>/packages/babel-core/lib/parse.js:_:_)
          at <CWD>/packages/babel-core/test/errors-stacks.js:_:_
          at expectError (<CWD>/packages/babel-core/test/errors-stacks.js:_:_)
          at <CWD>/packages/babel-core/test/errors-stacks.js:_:_
          at ... internal jest frames ..."
    `);
  });

  it("internal errors have the full stack trace", function () {
    expectError(() => {
      const { map } = Array.prototype;
      try {
        Array.prototype.map = () => {
          throw new Error("Internal error! This is a fake bug :)");
        };
        babel.parseSync("foo;", {
          root: fixture("valid"),
        });
      } finally {
        Array.prototype.map = map;
      }
    }).toMatchInlineSnapshot(`
      "Error: Internal error! This is a fake bug :)
          at Array.map (<CWD>/packages/babel-core/test/errors-stacks.js:_:_)
          at loadOneConfig (<CWD>/packages/babel-core/lib/config/files/configuration.js:_:_)
          at loadOneConfig.next (<anonymous>)
          at buildRootChain (<CWD>/packages/babel-core/lib/config/config-chain.js:_:_)
          at buildRootChain.next (<anonymous>)
          at loadPrivatePartialConfig (<CWD>/packages/babel-core/lib/config/partial.js:_:_)
          at loadPrivatePartialConfig.next (<anonymous>)
          at loadFullConfig (<CWD>/packages/babel-core/lib/config/full.js:_:_)
          at loadFullConfig.next (<anonymous>)
          at parse (<CWD>/packages/babel-core/lib/parse.js:_:_)
          at parse.next (<anonymous>)
          at evaluateSync (<CWD>/node_modules/gensync/index.js:_:_)
          at sync (<CWD>/node_modules/gensync/index.js:_:_)
          at stopHiding - secret - don't use this - v1 (<CWD>/packages/babel-core/lib/errors/rewrite-stack-trace.js:_:_)
          at Module.parseSync (<CWD>/packages/babel-core/lib/parse.js:_:_)
          at <CWD>/packages/babel-core/test/errors-stacks.js:_:_
          at expectError (<CWD>/packages/babel-core/test/errors-stacks.js:_:_)
          at <CWD>/packages/babel-core/test/errors-stacks.js:_:_
          at ... internal jest frames ..."
    `);
  });
});
