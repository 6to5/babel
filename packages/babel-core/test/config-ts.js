import { loadPartialConfigSync, loadPartialConfigAsync } from "../lib/index.js";
import path from "path";
import semver from "semver";
import { commonJS, itGte, itLt, USE_ESM } from "$repo-utils";

const { __dirname, require } = commonJS(import.meta.url);

// We skip older versions of node testing for two reasons.
// 1. ts-node and ts don't support the old version of node.
// 2. In the old version of node, jest has been registered in `require.extensions`, which will cause babel to disable the transforming as expected.
const shouldSkip = semver.lt(process.version, "14.0.0");

// Node.js 23.6 unflags --experimental-strip-types
const nodeLt23_6 = itLt("23.6.0");
const nodeGte23_6 = itGte("23.6.0");

const nodeLt23_6_andRequireBabelPackages =
  semver.lt(process.version, "23.6.0") &&
  (!USE_ESM || semver.gt(process.version, "22.12.0"))
    ? it
    : it.skip;

(shouldSkip ? describe : describe.skip)(
  "@babel/core config with ts [dummy]",
  () => {
    it("dummy", () => {
      expect(1).toBe(1);
    });
  },
);

(shouldSkip ? describe.skip : describe)("@babel/core config with ts", () => {
  nodeLt23_6_andRequireBabelPackages(
    "should transpile .cts when needed",
    () => {
      const config = loadPartialConfigSync({
        configFile: path.join(
          __dirname,
          "fixtures/config-ts/simple-cts-modules/babel.config.cts",
        ),
      });

      // eslint-disable-next-line jest/no-standalone-expect
      expect(config.options.targets).toMatchInlineSnapshot(`
        Object {
          "node": "12.0.0",
        }
      `);

      // eslint-disable-next-line jest/no-standalone-expect
      expect(config.options.sourceRoot).toMatchInlineSnapshot(`"/a/b"`);
    },
  );

  // Node.js >=23.6 has builtin .ts register, so this test can be removed
  // when we dropped Node.js 23 support in the future
  nodeLt23_6("should throw with invalid .cts register", () => {
    const oldHook = require.extensions[".cts"];
    require.extensions[".cts"] = () => {
      throw new Error("Scary!");
    };
    try {
      expect(() => {
        loadPartialConfigSync({
          configFile: path.join(
            __dirname,
            "fixtures/config-ts/invalid-cts-register/babel.config.cts",
          ),
        });
      }).toThrow(/Scary!/);
    } finally {
      require.extensions[".cts"] = oldHook;
    }
  });

  // This isn't by design, but reflects the status quo when running in Node.js
  // versions that don't have native support for .ts files.
  // It can be changed if needed.
  nodeLt23_6("show not support .ts config file", () => {
    expect(() => {
      loadPartialConfigSync({
        configFile: path.join(
          __dirname,
          "fixtures/config-ts/simple-ts-cjs/babel.config.ts",
        ),
      });
    }).toThrow(
      /You are using a .ts config file, but Babel only supports transpiling .cts configs/,
    );
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

  nodeGte23_6("should support .cts when available natively", () => {
    const config = loadPartialConfigSync({
      configFile: path.join(
        __dirname,
        "fixtures/config-ts/simple-cts-no-modules/babel.config.cts",
      ),
    });

    expect(config.options.targets).toMatchInlineSnapshot(`
      Object {
        "node": "12.0.0",
      }
    `);

    expect(config.options.sourceRoot).toMatchInlineSnapshot(`"/a/b"`);
  });

  nodeGte23_6("should use native TS support for .cts when available", () => {
    expect(() => {
      loadPartialConfigSync({
        configFile: path.join(
          __dirname,
          "fixtures/config-ts/simple-cts-modules/babel.config.cts",
        ),
      });
    }).toThrow(/import equals declaration is not supported in strip-only mode/);
  });

  nodeGte23_6(
    "should use native TS support for .ts (cjs) when available",
    () => {
      const config = loadPartialConfigSync({
        configFile: path.join(
          __dirname,
          "fixtures/config-ts/simple-ts-cjs/babel.config.ts",
        ),
      });

      expect(config.options.targets).toMatchInlineSnapshot(`
        Object {
          "node": "12.0.0",
        }
      `);

      expect(config.options.sourceRoot).toMatchInlineSnapshot(`"/a/b"`);
    },
  );

  nodeGte23_6(
    "should use native TS support for .ts (esm) when available",
    async () => {
      const config = await loadPartialConfigAsync({
        configFile: path.join(
          __dirname,
          "fixtures/config-ts/simple-ts-esm/babel.config.ts",
        ),
      });

      expect(config.options.targets).toMatchInlineSnapshot(`
        Object {
          "node": "12.0.0",
        }
      `);

      expect(config.options.sourceRoot).toMatchInlineSnapshot(`"/a/b"`);
    },
  );
});
