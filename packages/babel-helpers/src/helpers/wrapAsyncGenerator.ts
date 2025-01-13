/* @minVersion 7.0.0-beta.0 */

import OverloadYield from "./OverloadYield.ts";

export default function _wrapAsyncGenerator(fn: GeneratorFunction) {
  return function (this: any) {
    // Use "arguments" here for better compatibility and smaller bundle size
    return new AsyncGenerator(fn.apply(this, arguments as any));
  };
}

/* == The implementation of the AsyncGenerator class == */

type AsyncIteratorMethod = "next" | "throw" | "return";

declare class AsyncGenerator<T = unknown, TReturn = any, TNext = unknown>
  implements globalThis.AsyncGenerator<T, TReturn, TNext>
{
  _invoke: (
    key: AsyncIteratorMethod,
    arg: IteratorResult<T>,
  ) => Promise<IteratorResult<T, TReturn>>;

  constructor(gen: Generator<T, TReturn, TNext>);

  next(...args: [] | [TNext]): Promise<IteratorResult<T, TReturn>>;
  return(
    value: TReturn | PromiseLike<TReturn>,
  ): Promise<IteratorResult<T, TReturn>>;
  throw(e: any): Promise<IteratorResult<T, TReturn>>;
  [Symbol.asyncIterator](): AsyncGenerator<T, TReturn, TNext>;
  [Symbol.asyncDispose](): Promise<void>;
}

interface AsyncGeneratorRequest<T = unknown, TReturn = any, TNext = unknown> {
  key: AsyncIteratorMethod;
  arg: IteratorResult<T>;
  resolve: (value: IteratorResult<T, TReturn>) => void;
  reject: (error: any) => void;
  next: AsyncGeneratorRequest<T, TReturn, TNext> | null;
}

function AsyncGenerator<T = unknown, TReturn = any, TNext = unknown>(
  this: AsyncGenerator<T, TReturn, TNext>,
  gen: Generator<T, TReturn, TNext>,
) {
  var front: AsyncGeneratorRequest<T, TReturn, TNext> | null,
    back: AsyncGeneratorRequest<T, TReturn, TNext> | null;

  function send(key: AsyncIteratorMethod, arg: IteratorResult<T>) {
    return new Promise<IteratorResult<T, TReturn>>(function (resolve, reject) {
      var request: AsyncGeneratorRequest<T, TReturn, TNext> = {
        key: key,
        arg: arg,
        resolve: resolve,
        reject: reject,
        next: null,
      };

      if (back) {
        back = back.next = request;
      } else {
        front = back = request;
        resume(key, arg);
      }
    });
  }

  function resume(key: AsyncIteratorMethod, arg: IteratorResult<T, TReturn>) {
    try {
      var result = gen[key](arg);
      var value = result.value;
      var overloaded = value instanceof OverloadYield;

      Promise.resolve(
        overloaded ? (value as OverloadYield<T | TReturn>).v : value,
      ).then(
        function (arg: any) {
          if (overloaded) {
            // Overloaded yield requires calling into the generator twice:
            //  - first we get the iterator result wrapped in a promise
            //    (the gen[key](arg) call above)
            //  - then we await it (the Promise.resolve call above)
            //  - then we give the result back to the iterator, so that it can:
            //    * if it was an await, use its result
            //    * if it was a yield*, possibly return the `done: true` signal
            //      so that yield* knows that the iterator is finished.
            //      This needs to happen in the second call, because in the
            //      first one `done: true` was hidden in the promise and thus
            //      not visible to the (sync) yield*.
            //      The other part of this implementation is in asyncGeneratorDelegate.
            var nextKey: "return" | "next" =
              key === "return" ? "return" : "next";
            if (
              !(value as OverloadYield<IteratorReturnResult<T>>).k ||
              arg.done
            ) {
              // await or end of yield*
              // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression -- smaller bundle size
              return resume(nextKey, arg);
            } else {
              // yield*, not done
              arg = gen[nextKey](arg).value;
            }
          }

          settle(result.done ? "return" : "normal", arg);
        },
        function (err) {
          resume("throw", err);
        },
      );
    } catch (err) {
      settle("throw", err);
    }
  }

  function settle(type: AsyncIteratorMethod | "normal", value: any) {
    switch (type) {
      case "return":
        front!.resolve({ value: value, done: true });
        break;
      case "throw":
        front!.reject(value);
        break;
      default:
        front!.resolve({ value: value, done: false });
        break;
    }

    front = front!.next;
    if (front) {
      resume(front.key, front.arg);
    } else {
      back = null;
    }
  }

  this._invoke = send;

  // Hide "return" method if generator return is not supported
  if (typeof gen.return !== "function") {
    // @ts-expect-error -- intentionally remove "return" when not supported
    this.return = undefined;
  }
}

// AsyncIteratorPrototype should be third in the prototype chain of an async
// generator objects returned from async generator function calls.
// This aligns the prototype chain of transpiled generators to that of
// native runtime implementations and simplifies the discovery of the
// Async Iterator Prototype object for the purpose of Async Iterator Helper
// polyfills and AsyncIterator constructor injection via core-js or other
// libraries.
//
// The prototype chain here is still one step away from the fullest possible
// alignment with native implementations.
// Without async generator function marking like what regenerator does, the
// following behavior will still be out of spec: given `async function* foo() {}`,
// `foo() instanceof foo` will return false instead of true.
var AsyncIteratorPrototype: any = {};
var AsyncGeneratorPrototype: any = Object.create(AsyncIteratorPrototype);
var AsyncGeneratorInstanceProrotype: any = Object.create(
  AsyncGeneratorPrototype,
);
AsyncGenerator.prototype = AsyncGeneratorInstanceProrotype;
AsyncGeneratorPrototype.constructor = AsyncGenerator;

AsyncIteratorPrototype[
  ((typeof Symbol === "function" && Symbol.asyncIterator) ||
    "@@asyncIterator") as typeof Symbol.asyncIterator
] = function () {
  return this;
};

AsyncGenerator.prototype.next = function (arg: IteratorResult<any>) {
  return this._invoke("next", arg);
};
AsyncGenerator.prototype.throw = function (arg: IteratorResult<any>) {
  return this._invoke("throw", arg);
};
AsyncGenerator.prototype.return = function (arg: IteratorResult<any>) {
  return this._invoke("return", arg);
};
