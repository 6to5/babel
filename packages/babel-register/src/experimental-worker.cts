// TODO: Move this file to index.js in Babel 8
import type { IClient, Options } from "./types.cts";

const [major, minor] = process.versions.node.split(".").map(Number);

if (major < 12 || (major === 12 && minor < 3)) {
  throw new Error(
    "@babel/register/experimental-worker requires Node.js >= 12.3.0",
  );
}

import hook = require("./hook.cjs");
import workerClient = require("./worker-client.cjs");

let client: IClient;
function register(opts?: Options) {
  client ||= new workerClient.WorkerClient();
  hook.register(client, opts);
}

export = Object.assign(register, {
  revert: hook.revert,
  default: register,
  __esModule: true,
});

if (!require("./is-in-register-worker.cjs").isInRegisterWorker) {
  register();
}
