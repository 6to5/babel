const path = require("path");
type config = any;
module.exports = {
  targets: "node 12.0.0",
  sourceRoot: path.posix.join("/a", "b"),
} as config;
