/* @minVersion 7.23.9 */

type Stack =
  | {
      v: Disposable | AsyncDisposable;
      d: null | undefined | DisposeLike;
      a: boolean;
    }
  | {
      d: null | undefined;
      a: true;
    };

type DisposeLike = () => void | PromiseLike<void>;

interface UsingCtxReturn {
  e: object;
  u: (value: Disposable | null | undefined) => Disposable | null | undefined;
  a: (
    value: AsyncDisposable | Disposable | null | undefined,
  ) => AsyncDisposable | Disposable | null | undefined;
  d: DisposeLike;
}

const enum StateFlag {
  NONE = 0,
  NEEDS_AWAIT = 1,
  HAS_AWAITED = 2,
}

export default function _usingCtx(): UsingCtxReturn {
  var _disposeSuppressedError =
      typeof SuppressedError === "function"
        ? SuppressedError
        : (function (error: Error, suppressed: Error) {
            var err = new Error() as SuppressedError;
            err.name = "SuppressedError";
            err.error = error;
            err.suppressed = suppressed;
            return err;
          } as SuppressedErrorConstructor),
    empty = {},
    stack: Stack[] = [];
  function using(
    isAwait: true,
    value: AsyncDisposable | Disposable | null | undefined,
  ): AsyncDisposable | Disposable | null | undefined;
  function using(
    isAwait: false,
    value: Disposable | null | undefined,
  ): Disposable | null | undefined;
  function using(
    isAwait: boolean,
    value: AsyncDisposable | Disposable | null | undefined,
  ): AsyncDisposable | Disposable | null | undefined {
    if (value != null) {
      if (Object(value) !== value) {
        throw new TypeError(
          "using declarations can only be used with objects, functions, null, or undefined.",
        );
      }
      // core-js-pure uses Symbol.for for polyfilling well-known symbols
      if (isAwait) {
        // value can either be an AsyncDisposable or a Disposable
        // Try AsyncDisposable first
        var dispose: DisposeLike | null | undefined = (
          value as AsyncDisposable
        )[Symbol.asyncDispose || Symbol.for("Symbol.asyncDispose")];
      }
      if (dispose === undefined) {
        dispose = (value as Disposable)[
          Symbol.dispose || Symbol.for("Symbol.dispose")
        ];
        if (isAwait) {
          var inner = dispose;
        }
      }
      if (typeof dispose !== "function") {
        throw new TypeError("Object is not disposable.");
      }
      // @ts-expect-error use before assignment
      if (inner) {
        dispose = function () {
          try {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            inner.call(value);
          } catch (e) {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            return Promise.reject(e);
          }
        };
      }
      stack.push({ v: value, d: dispose, a: isAwait });
    } else if (isAwait) {
      // provide the nullish `value` as `d` for minification gain
      stack.push({ d: value, a: isAwait });
    }
    return value;
  }
  return {
    // error
    e: empty,
    // using
    u: using.bind(null, false),
    // await using
    // full generic signature to avoid type widening
    a: using.bind<
      null,
      [true],
      [AsyncDisposable | Disposable | null | undefined],
      AsyncDisposable | Disposable | null | undefined
    >(null, true),
    // dispose
    d: function () {
      var error = this.e,
        state: StateFlag = StateFlag.NONE,
        resource;

      function next(): Promise<void> | void {
        while ((resource = stack.pop())) {
          try {
            if (!resource.a && state === StateFlag.NEEDS_AWAIT) {
              state = StateFlag.NONE;
              stack.push(resource);
              return Promise.resolve().then(next);
            }
            if (resource.d) {
              var disposalResult = resource.d.call(resource.v);
              if (resource.a) {
                state |= StateFlag.HAS_AWAITED;
                return Promise.resolve(disposalResult).then(next, err);
              }
            } else {
              state |= StateFlag.NEEDS_AWAIT;
            }
          } catch (e) {
            return err(e as Error);
          }
        }
        if (state === StateFlag.NEEDS_AWAIT) {
          if (error !== empty) {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            return Promise.reject(error);
          } else {
            return Promise.resolve();
          }
        }

        // eslint-disable-next-line @typescript-eslint/only-throw-error
        if (error !== empty) throw error;
      }

      function err(e: Error): Promise<void> | void {
        error = error !== empty ? new _disposeSuppressedError(e, error) : e;

        return next();
      }

      return next();
    },
  } satisfies UsingCtxReturn;
}
