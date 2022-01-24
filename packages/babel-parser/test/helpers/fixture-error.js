import { inspect } from "util";
import "./polyfill.js";

const { defineProperty, entries, fromEntries } = Object;

const named = (name, object) => defineProperty(object, "name", { value: name });
const mapEntries = (object, f) => fromEntries(entries(object).map(f));

export default class FixtureError extends Error {
  constructor(message, difference) {
    super(message);
    this.difference = difference;
  }

  static fromDifference(difference, actual) {
    return difference.path[0] !== "threw"
      ? new FixtureError.DifferentAST(difference)
      : !difference.expected
      ? new FixtureError.UnexpectedError(difference, actual.threw)
      : difference.actual
      ? new FixtureError.DifferentError(difference, actual.threw)
      : actual.ast && actual.ast.errors
      ? new FixtureError.UnexpectedRecovery(difference, actual.ast.errors)
      : new FixtureError.UnexpectedSuccess(difference);
  }
}

Object.assign(
  FixtureError,
  mapEntries(
    {
      DifferentError: ({ expected }) =>
        `Expected unrecoverable error:    \n\n${expected}\n\n` +
        `But instead encountered different unrecoverable error.\n`,

      DifferentAST: ({ message }) => message,

      UnexpectedError: () => `Encountered unexpected unrecoverable error.\n`,

      UnexpectedSuccess: ({ expected }) =>
        `Expected unrecoverable error:\n\n    ${expected}\n\n` +
        `But parsing succeeded without errors.`,

      UnexpectedRecovery: ({ expected }, errors) =>
        `Expected unrecoverable error:\n\n    ${expected}\n\n` +
        `But instead parsing recovered from errors:\n\n${JSON.stringify(
          errors,
          null,
          2,
        )}`,
    },
    ([name, toMessage]) => [
      name,
      named(
        name,
        class extends FixtureError {
          constructor(difference, cause) {
            super(toMessage(difference, cause), difference);

            if (cause) this.cause = cause.context || cause;
          }

          // Don't show the stack of FixtureErrors, it's irrelevant.
          // Instead, show the cause, if present.
          [inspect.custom](depth, options) {
            return `${this.message.replace(/\.\n$/, ":\n")}${
              this.cause
                ? `\n${inspect(this.cause, options)}`.replace(/\n/g, "\n    ")
                : ""
            }`;
          }
        },
      ),
    ],
  ),
);
