import { inspect } from "util";
import Difference from "./difference.js";
import "./polyfill.js";

const { isArray } = Array;
const { defineProperty, entries, fromEntries } = Object;

const named = (name, object) => defineProperty(object, "name", { value: name });
const mapEntries = (object, f) => fromEntries(entries(object).map(f));
const toContextError = error =>
  isArray(error) ? error.map(toContextError) : error.context || error;

export default class FixtureError extends Error {
  constructor(difference, { cause } = {}) {
    super();

    // Sigh, still have to manually set the name unfortunately...
    named(this.constructor.name, this);

    this.difference = difference;

    // Set cause ourselves, since node < 17 has a bug where it won't show it
    // otherwise. Technically, we display it ourselves, but best to be defensive
    // in case we modify this implementation later.
    if (cause) this.cause = cause;
  }

  static toMessage() {
    return this.constructor.name;
  }

  get message() {
    return this.constructor.toMessage(this.difference, this.cause);
  }

  // Don't show the stack of FixtureErrors, it's irrelevant.
  // Instead, show the cause, if present.
  [inspect.custom](depth, options) {
    return this.cause
      ? `${this.message.replace(/(?<=error(s?))\.$/, ":\n")}\n${inspect(
          toContextError(this.cause),
          options,
        )}`.replace(/\n/g, "\n    ")
      : this.message;
  }

  static fromDifference(difference, actual) {
    return difference === Difference.None
      ? false
      : difference.path[0] !== "threw"
        ? new FixtureError.DifferentAST(difference)
        : !difference.expected
          ? new FixtureError.UnexpectedError(difference, {
              cause: actual.threw,
            })
          : difference.actual
            ? new FixtureError.DifferentError(difference, {
                cause: actual.threw,
              })
            : actual.ast && actual.ast.errors
              ? new FixtureError.UnexpectedRecovery(difference, {
                  cause: actual.ast.errors,
                })
              : new FixtureError.UnexpectedSuccess(difference);
  }
}

Object.assign(
  FixtureError,
  mapEntries(
    {
      DifferentError: ({ expected }) =>
        `Expected unrecoverable error:    \n\n${expected}\n\n` +
        `But instead encountered different unrecoverable error.`,

      DifferentAST: ({ message }) => message,

      UnexpectedError: ({ message }) =>
        `Encountered unexpected unrecoverable error:    \n\n${message}\n\n`,

      UnexpectedSuccess: ({ expected }) =>
        `Expected unrecoverable error:\n\n    ${expected}\n\n` +
        `But parsing succeeded without errors.`,

      UnexpectedRecovery: ({ expected }, errors) =>
        `Expected unrecoverable error:\n\n    ${expected}\n\n` +
        `But instead parsing recovered from ${errors.length} errors.`,
    },
    ([name, toMessage]) => [
      name,
      named(
        `FixtureError.${name}`,
        class extends FixtureError {
          static toMessage = toMessage;
        },
      ),
    ],
  ),
);
