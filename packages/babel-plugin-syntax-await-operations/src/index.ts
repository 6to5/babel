import { declare } from "@babel/helper-plugin-utils";

export default declare(api => {
  api.assertVersion(7);

  return {
    name: "syntax-await-operations",

    manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push("awaitOperations");
    },
  };
});
