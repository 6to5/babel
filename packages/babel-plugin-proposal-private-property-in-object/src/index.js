/* eslint-disable @babel/development/plugin-name */

import { declare } from "@babel/helper-plugin-utils";
import {
  createClassFeaturePlugin,
  FEATURES,
} from "@babel/helper-create-class-features-plugin";
import { isRequired } from "@babel/helper-compilation-targets";

import pluginPrivateIn from "./native-private-fields";

export default declare((api, options) => {
  api.assertVersion(7);

  const {
    loose,
    nativePrivateFields = !isRequired(
      "proposal-private-methods",
      api.targets(),
    ),
  } = options;

  if (nativePrivateFields) return pluginPrivateIn(api);

  return createClassFeaturePlugin({
    name: "proposal-class-properties",

    api,
    feature: FEATURES.privateIn,
    loose,

    manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push("privateIn");
    },
  });
});
