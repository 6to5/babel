import * as babel from "../lib/index.js";
import { describeBabel8, commonJS } from "$repo-utils";

const { __dirname } = commonJS(import.meta.url);
const cwd = __dirname;

function getTransformingPluginList(code, opts) {
  process.env.TEST_THROW_PLUGINS = "true";
  try {
    return babel.transformSync(code, {
      cwd,
      configFile: false,
      babelrc: false,
      ...opts,
    });
  } catch (error) {
    if (error.message === "TEST_THROW_PLUGINS") {
      return error.plugins.map(plugin => plugin.key);
    }
    throw error;
  } finally {
    delete process.env.TEST_THROW_PLUGINS;
  }
}

let orderDataId = 0;
function buildOrderData(list, before, id) {
  return {
    id: id || orderDataId++ + "",
    version: 1,
    data: () => {
      return {
        type: "list",
        before,
        list,
      };
    },
  };
}

describeBabel8("sortPlugins", function () {
  it("should sort plugins 1", function () {
    const orderData = buildOrderData(["plugin1", "plugin2", "plugin3"]);
    const plugins = [
      { name: "plugin3", orderData },
      { name: "plugin1", orderData },
      { name: "plugin2", orderData },
    ];
    const result = getTransformingPluginList("", {
      plugins,
    });
    expect(result).toMatchInlineSnapshot(`
      Array [
        "plugin1",
        "plugin2",
        "plugin3",
      ]
    `);
  });

  it("should sort plugins 2", function () {
    const orderData = buildOrderData(["plugin3", "plugin4"]);
    const plugins = [
      { name: "plugin1" },
      { name: "plugin4", orderData },
      { name: "plugin2" },
      { name: "plugin3", orderData },
      { name: "plugin5" },
    ];
    const result = getTransformingPluginList("", {
      plugins,
    });
    expect(result).toMatchInlineSnapshot(`
      Array [
        "plugin1",
        "plugin2",
        "plugin3",
        "plugin4",
        "plugin5",
      ]
    `);
  });

  it("should sort plugins with before", function () {
    const orderData = buildOrderData(["plugin1", "plugin2"], "b", "a");
    const orderData2 = buildOrderData(["plugin3", "plugin4"], undefined, "b");
    const plugins = [
      { name: "pluginA" },
      { name: "plugin4", orderData: orderData2 },
      { name: "plugin3", orderData: orderData2 },
      { name: "pluginB" },
      { name: "plugin1", orderData },
      { name: "plugin2", orderData },
      { name: "pluginC" },
    ];
    const result = getTransformingPluginList("", {
      plugins,
    });
    expect(result).toMatchInlineSnapshot(`
      Array [
        "pluginA",
        "plugin1",
        "plugin2",
        "plugin3",
        "plugin4",
        "pluginB",
        "pluginC",
      ]
    `);
  });

  it("should throw when cycles", function () {
    const orderData = buildOrderData(["plugin1", "plugin2"], "b", "a");
    const orderData2 = buildOrderData(["plugin3", "plugin4"], "c", "b");
    const orderData3 = buildOrderData(["plugin5", "plugin6"], "a", "c");

    const plugins = [
      { name: "plugin1", orderData: orderData },
      { name: "plugin2", orderData: orderData },
      { name: "plugin3", orderData: orderData2 },
      { name: "plugin4", orderData: orderData2 },
      { name: "plugin5", orderData: orderData3 },
      { name: "plugin6", orderData: orderData3 },
    ];
    expect(() => {
      getTransformingPluginList("", {
        plugins,
      });
    }).toThrow("Plugin/preset order list cycles with 'c -> a -> b'");
  });
});
