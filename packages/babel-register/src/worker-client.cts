import type { IClient, Options } from "./types.cts";

import path = require("path");
import types = require("./types.cts");

import ACTIONS = types.ACTIONS;

class Client implements IClient {
  #send;

  constructor(send: (action: ACTIONS, payload: any) => any) {
    this.#send = send;
  }

  #eCache: string[];
  getDefaultExtensions(): string[] {
    return (this.#eCache ??= this.#send(
      ACTIONS.GET_DEFAULT_EXTENSIONS,
      undefined,
    ));
  }

  setOptions(options: Options): void {
    return this.#send(ACTIONS.SET_OPTIONS, options);
  }

  transform(
    code: string,
    filename: string,
  ): { code: string; map: object } | null {
    return this.#send(ACTIONS.TRANSFORM, { code, filename });
  }
}

// We need to run Babel in a worker because require hooks must
// run synchronously, but many steps of Babel's config loading
// (which is done for each file) can be asynchronous
class WorkerClient extends Client {
  // These two require() calls are in deferred so that they are not imported in
  // older Node.js versions (which don't support workers).
  // TODO: Hoist them in Babel 8.

  static get #worker_threads() {
    return require("worker_threads") as typeof import("worker_threads");
  }

  static get #markInRegisterWorker() {
    return require("./is-in-register-worker.cjs").markInRegisterWorker;
  }

  #worker = new WorkerClient.#worker_threads.Worker(
    path.resolve(__dirname, "./worker/index.cjs"),
    { env: WorkerClient.#markInRegisterWorker(process.env) },
  );

  #signal = new Int32Array(new SharedArrayBuffer(4));

  constructor() {
    super((action, payload) => {
      this.#signal[0] = 0;
      const subChannel = new WorkerClient.#worker_threads.MessageChannel();

      this.#worker.postMessage(
        { signal: this.#signal, port: subChannel.port1, action, payload },
        [subChannel.port1],
      );

      Atomics.wait(this.#signal, 0, 0);
      const { message } = WorkerClient.#worker_threads.receiveMessageOnPort(
        subChannel.port2,
      );

      if (message.error) throw Object.assign(message.error, message.errorData);
      else return message.result;
    });

    // The worker will never exit by itself. Prevent it from keeping
    // the main process alive.
    this.#worker.unref();
  }
}

export = { WorkerClient };

if (!process.env.BABEL_8_BREAKING) {
  module.exports.LocalClient = class LocalClient extends Client {
    isLocalClient = true;

    static #handleMessage: (action: ACTIONS, payload: any) => any;

    constructor() {
      LocalClient.#handleMessage ??= require("./worker/handle-message.cjs");

      super((action, payload) => {
        return LocalClient.#handleMessage(
          action === ACTIONS.TRANSFORM ? ACTIONS.TRANSFORM_SYNC : action,
          payload,
        );
      });
    }
  };
}
