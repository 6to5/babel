import path from "path";
type config = any;

import.meta;

export default {
  targets: "node 12.0.0",
  sourceRoot: path.posix.join("/a", "b"),
} as config;
