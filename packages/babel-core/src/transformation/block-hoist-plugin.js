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
function priority(bodyNode) {
  let priority = bodyNode?._blockHoist;
  if (priority == null) priority = 1;
  if (priority === true) priority = 2;

  // Higher priorities should move toward the top.
  return priority;
}

function stableSort(body, index) {
  // By default, we use priorities of 0-4.
  const buckets = [[], [], [], [], []];

  // By collecting into buckets, we can guarantee a stable sort.
  for (let i = index; i < body.length; i++) {
    const n = body[i];
    const p = priority(n);

    // In case some plugin is setting an unexpected priority.
    (buckets[p] ??= []).push(n);
  }

  // Highest priorities go first
  for (let i = buckets.length - 1; i >= 0; i--) {
    const bucket = buckets[i];

    // In that unexpected priority caused a sparse array.
    if (!bucket) continue;

    for (const n of bucket) {
      body[index++] = n;
    }
  }
}

const blockHoistPlugin = {
  /**
   * [Please add a description.]
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
        const { body } = node;
        let i = 0;
        for (; i < body.length; i++) {
          const n = body[i];
          if (n?._blockHoist != null) {
            break;
          }
        }
        if (i === body.length) return;

        // My kingdom for a stable sort!
        stableSort(body, i);
      },
    },
  },
};
