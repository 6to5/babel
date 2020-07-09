// @flow
import loadConfig, { type Plugin } from "../config";

let LOADED_PLUGIN: Plugin | void;

export default function loadBlockHoistPlugin(): Plugin {
  if (!LOADED_PLUGIN) {
    // Lazy-init the internal plugin to remove the init-time circular
    // dependency between plugins being passed @babel/core's export object,
    // which loads this file, and this 'loadConfig' loading plugins.
    const config = loadConfig.sync({
      babelrc: false,
      configFile: false,
      plugins: [blockHoistPlugin],
    });
    LOADED_PLUGIN = config ? config.passes[0][0] : undefined;
    if (!LOADED_PLUGIN) throw new Error("Assertion failure");
  }

  return LOADED_PLUGIN;
}

const blockHoistPlugin = {
  /**
   * When hoisted blocks are present, return node elements in sorted order
   * (highest priority first)
   *
   * Priority:
   *
   *  - 0 We want this to be at the **very** bottom
   *  - 1 Default node position
   *  - 2 Priority over normal nodes
   *  - 3 We want this to be at the **very** top
   *  - 4 Reserved for the helpers used to implement module imports.
   */

  name: "internal.blockHoist",

  visitor: {
    Block: {
      exit({ node }) {
        if (node.body.every(node => node?._blockHoist == null)) return;
        node.body
          .filter(node => node?._blockHoist == null)
          .forEach(node => (node.priority = 1));
        node.body
          .filter(node => node?._blockHoist === true)
          .forEach(node => (node.priority = 2));
        node.body.sort((a, b) => b.priority - a.priority);
      },
    },
  },
};
