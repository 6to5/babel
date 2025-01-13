import path = require("path");
type config = any;

export = {
  targets: "node 12.0.0",
  sourceRoot: path.posix.join("/a", "b"),
} as config;
