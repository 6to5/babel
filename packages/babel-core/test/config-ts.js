import { loadPartialConfigSync } from "../lib/index.js";
import path from "path";
import semver from "semver";
import { USE_ESM, commonJS, itLt } from "$repo-utils";

const { __dirname, require } = commonJS(import.meta.url);

// We skip older versions of node testing for two reasons.
// 1. ts-node and ts don't support the old version of node.
// 2. In the old version of node, jest has been registered in `require.extensions`, which will cause babel to disable the transforming as expected.
// TODO: Make it work with USE_ESM.
const shouldSkip = semver.lt(process.version, "14.0.0") || USE_ESM;

// Node.js 23.6 unflags --experimental-strip-types
const nodeLt23_6 = itLt("23.6.0");

(shouldSkip ? describe : describe.skip)(
  "@babel/core config with ts [dummy]",
  () => {
    it("dummy", () => {
      expect(1).toBe(1);
    });
  },
);

(shouldSkip ? describe.skip : describe)("@babel/core config with ts", () => {
  it("should work with simple .cts", () => {
    const config = loadPartialConfigSync({
      configFile: path.join(
        __dirname,
        "fixtures/config-ts/simple-cts/babel.config.cts",
      ),
    });

    expect(config.options.targets).toMatchInlineSnapshot(`
      Object {
        "node": "12.0.0",
      }
    `);

    expect(config.options.sourceRoot).toMatchInlineSnapshot(`"/a/b"`);
  });

  // Node.js >=23.6 has builtin .ts register, so this test can be removed
  // when we dropped Node.js 23 support in the future
  nodeLt23_6("should throw with invalid .ts register", () => {
    require.extensions[".ts"] = () => {
      throw new Error("Not support .ts.");
    };
    try {
      expect(() => {
        loadPartialConfigSync({
          configFile: path.join(
            __dirname,
            "fixtures/config-ts/invalid-cts-register/babel.config.cts",
          ),
        });
      }).toThrow(/Unexpected identifier.*/);
    } finally {
      delete require.extensions[".ts"];
    }
  });

  it("should work with ts-node", async () => {
    const service = require("ts-node").register({
      experimentalResolver: true,
      compilerOptions: {
        module: "CommonJS",
      },
    });
    service.enabled(true);

    try {
      require(
        path.join(
          __dirname,
          "fixtures/config-ts/simple-cts-with-ts-node/babel.config.cts",
        ),
      );

      const config = loadPartialConfigSync({
        configFile: path.join(
          __dirname,
          "fixtures/config-ts/simple-cts-with-ts-node/babel.config.cts",
        ),
      });

      expect(config.options.targets).toMatchInlineSnapshot(`
        Object {
          "node": "12.0.0",
        }
      `);

      expect(config.options.sourceRoot).toMatchInlineSnapshot(`"/a/b"`);
    } finally {
      service.enabled(false);
    }
  });
});
