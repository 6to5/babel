/* @minVersion 7.24.4 */
/* @mangleFns */

export default function _callAsync<
  This,
  Args extends unknown[],
  TYield,
  TReturn,
>(
  fn: (
    this: This,
    ...args: Args
  ) => Generator<TYield, TReturn, Awaited<TYield>>,
  self: This,
  args: Args,
): Promise<TReturn> {
  return new Promise(function (resolve, reject) {
    var gen = fn.apply(self, args),
      _next = asyncGeneratorStep.bind(null, 1),
      _throw = asyncGeneratorStep.bind(null, 0);

    _next();

    function asyncGeneratorStep(happy: 0 | 1, arg?: any): void {
      try {
        var info = happy ? gen.next(arg) : gen.throw(arg);
        var value = info.value;
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        reject(error);
        return;
      }

      if (info.done) {
        // The "value" variable is defined above before the "info.done" guard
        // So TypeScript can't narrowing "value" to TReturn here
        // If we use "info.value" here the type is narrowed correctly.
        // Still requires manual casting for the smaller bundle size.
        resolve(value as TReturn);
      } else {
        // Same as above, TypeScript can't narrow "value" to TYield here
        Promise.resolve(value as TYield).then(_next, _throw);
      }
    }
  });
}
