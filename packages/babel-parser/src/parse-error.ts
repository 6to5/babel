import { Position } from "./util/location";
import type { Undone } from "./parser/node";
import type { Node } from "./types";

type SyntaxPlugin =
  | "flow"
  | "typescript"
  | "jsx"
  | "pipelineOperator"
  | "placeholders";

type ParseErrorCode =
  | "BABEL_PARSER_SYNTAX_ERROR"
  | "BABEL_PARSER_SOURCETYPE_MODULE_REQUIRED";

// Babel uses "normal" SyntaxErrors for it's errors, but adds some extra
// functionality. This functionality is defined in the
// `ParseErrorSpecification` interface below. We may choose to change to someday
// give our errors their own full-blown class, but until then this allow us to
// keep all the desirable properties of SyntaxErrors (like their name in stack
// traces, etc.), and also allows us to punt on any publicly facing
// class-hierarchy decisions until Babel 8.
interface ParseErrorSpecification<ErrorDetails> {
  // Look, these *could* be readonly, but then Flow complains when we initially
  // set them. We could do a whole dance and make a special interface that's not
  // readonly for when we create the error, then cast it to the readonly
  // interface for public use, but the previous implementation didn't have them
  // as readonly, so let's just not worry about it for now.
  code: ParseErrorCode;
  reasonCode: string;
  syntaxPlugin?: SyntaxPlugin;
  missingPlugin?: string | string[];
  loc: Position;
  details: ErrorDetails;

  // We should consider removing this as it now just contains the same
  // information as `loc.index`.
  // pos: number;
}

export type ParseError<ErrorDetails> = SyntaxError &
  ParseErrorSpecification<ErrorDetails>;

// By `ParseErrorConstructor`, we mean something like the new-less style
// `ErrorConstructor`[1], since `ParseError`'s are not themselves actually
// separate classes from `SyntaxError`'s.
//
// 1. https://github.com/microsoft/TypeScript/blob/v4.5.5/lib/lib.es5.d.ts#L1027
export type ParseErrorConstructor<ErrorDetails> = (a: {
  loc: Position;
  filename: string | undefined;
  details: ErrorDetails;
}) => ParseError<ErrorDetails>;

type ToMessage<ErrorDetails> = (self: ErrorDetails) => string;

type ParseErrorCredentials<ErrorDetails> = {
  code: string;
  reasonCode: string;
  syntaxPlugin?: SyntaxPlugin;
  toMessage: ToMessage<ErrorDetails>;
};

function defineHidden(obj: object, key: string, value: unknown) {
  Object.defineProperty(obj, key, {
    enumerable: false,
    configurable: true,
    value,
  });
}

function toParseErrorConstructor<ErrorDetails extends object>({
  toMessage,
  ...properties
}: ParseErrorCredentials<ErrorDetails>): ParseErrorConstructor<ErrorDetails> {
  return function constructor({ loc, filename, details }) {
    const error = new SyntaxError();
    Object.assign(error, properties, { loc, pos: loc.index });
    if ("missingPlugin" in details) {
      Object.assign(error, { missingPlugin: details.missingPlugin });
    }

    type Overrides = {
      loc?: Position;
      details?: ErrorDetails;
    };
    defineHidden(error, "clone", function clone(overrides: Overrides = {}) {
      const { line, column, index } = overrides.loc ?? loc;
      return constructor({
        loc: new Position(line, column, index),
        filename,
        details: { ...details, ...overrides.details },
      });
    });

    defineHidden(error, "details", details);

    Object.defineProperty(error, "message", {
      configurable: true,
      get(this: ParseError<ErrorDetails>): string {
        let pos = `${this.loc.line}:${this.loc.column}`;
        if (process.env.BABEL_8_BREAKING) {
          if (filename) pos = `${filename}:${pos}`;
        }
        const message = `${toMessage(this.details)} (${pos})`;
        this.message = message;
        return message;
      },
      set(value: string) {
        Object.defineProperty(this, "message", { value, writable: true });
      },
    });

    return error as ParseError<ErrorDetails>;
  };
}

type ParseErrorTemplate =
  | string
  | ToMessage<any>
  | { message: string | ToMessage<any>; code?: ParseErrorCode };

export type ParseErrorTemplates = { [reasonCode: string]: ParseErrorTemplate };

// This is the templated form of `ParseErrorEnum`.
//
// Note: We could factor out the return type calculation into something like
// `ParseErrorConstructor<T extends ParseErrorTemplates>`, and then we could
// reuse it in the non-templated form of `ParseErrorEnum`, but TypeScript
// doesn't seem to drill down that far when showing you the computed type of
// an object in an editor, so we'll leave it inlined for now.
export function ParseErrorEnum(a: TemplateStringsArray): <
  T extends ParseErrorTemplates,
>(
  parseErrorTemplates: T,
) => {
  [K in keyof T]: ParseErrorConstructor<
    T[K] extends { message: string | ToMessage<any> }
      ? T[K]["message"] extends ToMessage<any>
        ? Parameters<T[K]["message"]>[0]
        : {}
      : T[K] extends ToMessage<any>
      ? Parameters<T[K]>[0]
      : {}
  >;
};

export function ParseErrorEnum<T extends ParseErrorTemplates>(
  parseErrorTemplates: T,
  syntaxPlugin?: SyntaxPlugin,
): {
  [K in keyof T]: ParseErrorConstructor<
    T[K] extends { message: string | ToMessage<any> }
      ? T[K]["message"] extends ToMessage<any>
        ? Parameters<T[K]["message"]>[0]
        : {}
      : T[K] extends ToMessage<any>
      ? Parameters<T[K]>[0]
      : {}
  >;
};

// You call `ParseErrorEnum` with a mapping from `ReasonCode`'s to either:
//
// 1. a static error message,
// 2. `toMessage` functions that define additional necessary `details` needed by
//    the `ParseError`, or
// 3. Objects that contain a `message` of one of the above and overridden `code`
//    and/or `reasonCode`:
//
// ParseErrorEnum `optionalSyntaxPlugin` ({
//   ErrorWithStaticMessage: "message",
//   ErrorWithDynamicMessage: ({ type } : { type: string }) => `${type}`),
//   ErrorWithOverriddenCodeAndOrReasonCode: {
//     message: ({ type }: { type: string }) => `${type}`),
//     code: "AN_ERROR_CODE",
//     ...(BABEL_8_BREAKING ? { } : { reasonCode: "CustomErrorReasonCode" })
//   }
// });
//
export function ParseErrorEnum(
  argument: TemplateStringsArray | ParseErrorTemplates,
  syntaxPlugin?: SyntaxPlugin,
) {
  // If the first parameter is an array, that means we were called with a tagged
  // template literal. Extract the syntaxPlugin from this, and call again in
  // the "normalized" form.
  if (Array.isArray(argument)) {
    return (parseErrorTemplates: ParseErrorTemplates) =>
      ParseErrorEnum(parseErrorTemplates, argument[0]);
  }

  const ParseErrorConstructors = {} as Record<
    string,
    ParseErrorConstructor<unknown>
  >;

  for (const reasonCode of Object.keys(argument)) {
    const template = (argument as ParseErrorTemplates)[reasonCode];
    const { message, ...rest } =
      typeof template === "string"
        ? { message: () => template }
        : typeof template === "function"
        ? { message: template }
        : template;
    const toMessage = typeof message === "string" ? () => message : message;

    ParseErrorConstructors[reasonCode] = toParseErrorConstructor({
      code: "BABEL_PARSER_SYNTAX_ERROR",
      reasonCode,
      toMessage,
      ...(syntaxPlugin ? { syntaxPlugin } : {}),
      ...rest,
    });
  }

  return ParseErrorConstructors;
}

export type RaiseProperties<ErrorDetails> = {
  at: Position | Undone<Node>;
} & ErrorDetails;

import ModuleErrors from "./parse-error/module-errors";
import StandardErrors from "./parse-error/standard-errors";
import StrictModeErrors from "./parse-error/strict-mode-errors";
import PipelineOperatorErrors from "./parse-error/pipeline-operator-errors";

export const Errors = {
  ...ParseErrorEnum(ModuleErrors),
  ...ParseErrorEnum(StandardErrors),
  ...ParseErrorEnum(StrictModeErrors),
  ...ParseErrorEnum`pipelineOperator`(PipelineOperatorErrors),
};

export type { LValAncestor } from "./parse-error/standard-errors";
