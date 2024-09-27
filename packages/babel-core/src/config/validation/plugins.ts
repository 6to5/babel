import {
  assertString,
  assertFunction,
  assertObject,
  msg,
} from "./option-assertions.ts";

import type {
  ValidatorSet,
  Validator,
  OptionPath,
  RootPath,
} from "./option-assertions.ts";
import type { ParserOptions } from "@babel/parser";
import type { Visitor } from "@babel/traverse";
import type { ValidatedOptions } from "./options.ts";
import type { File, PluginAPI, PluginPass } from "../../index.ts";

// Note: The casts here are just meant to be static assertions to make sure
// that the assertion functions actually assert that the value's type matches
// the declared types.
const VALIDATORS: ValidatorSet = {
  name: assertString as Validator<PluginObject["name"]>,
  manipulateOptions: assertFunction as Validator<
    PluginObject["manipulateOptions"]
  >,
  pre: assertFunction as Validator<PluginObject["pre"]>,
  post: assertFunction as Validator<PluginObject["post"]>,
  inherits: assertFunction as Validator<PluginObject["inherits"]>,
  visitor: assertVisitorMap as Validator<PluginObject["visitor"]>,

  parserOverride: assertFunction as Validator<PluginObject["parserOverride"]>,
  generatorOverride: assertFunction as Validator<
    PluginObject["generatorOverride"]
  >,

  orderData: assertOrderData as Validator<PluginObject["orderData"]>,
};

function assertOrderData(loc: OptionPath, value: unknown) {
  const obj = assertObject(loc, value);
  if (obj) {
    if (typeof obj.id !== "string") {
      throw new Error(
        `${msg(loc)} must have an "id" property that is a string`,
      );
    }
    if (typeof obj.version !== "number") {
      throw new Error(
        `${msg(loc)} must have a "version" property that is a number`,
      );
    }
  }
  return value as PluginObject["orderData"];
}

function assertVisitorMap(loc: OptionPath, value: unknown): Visitor {
  const obj = assertObject(loc, value);
  if (obj) {
    Object.keys(obj).forEach(prop => {
      if (prop !== "_exploded" && prop !== "_verified") {
        assertVisitorHandler(prop, obj[prop]);
      }
    });

    if (obj.enter || obj.exit) {
      throw new Error(
        `${msg(
          loc,
        )} cannot contain catch-all "enter" or "exit" handlers. Please target individual nodes.`,
      );
    }
  }
  return obj as Visitor;
}

function assertVisitorHandler(
  key: string,
  value: unknown,
): asserts value is VisitorHandler {
  if (value && typeof value === "object") {
    Object.keys(value).forEach((handler: string) => {
      if (handler !== "enter" && handler !== "exit") {
        throw new Error(
          `.visitor["${key}"] may only have .enter and/or .exit handlers.`,
        );
      }
    });
  } else if (typeof value !== "function") {
    throw new Error(`.visitor["${key}"] must be a function`);
  }
}

type VisitorHandler =
  | Function
  | {
      enter?: Function;
      exit?: Function;
    };

export type PluginObject<S extends PluginPass = PluginPass> = {
  name?: string;
  manipulateOptions?: (
    options: ValidatedOptions,
    parserOpts: ParserOptions,
  ) => void;
  pre?: (this: S, file: File) => void;
  post?: (this: S, file: File) => void;
  inherits?: (
    api: PluginAPI,
    options: unknown,
    dirname: string,
  ) => PluginObject;
  visitor?: Visitor<S>;
  parserOverride?: Function;
  generatorOverride?: Function;
  orderData?: {
    id: string;
    version: number;
    data: () => {
      type: "list";
      before?: string;
      list: string[];
    };
  };
};

export function validatePluginObject(obj: {
  [key: string]: unknown;
}): PluginObject {
  const rootPath: RootPath = {
    type: "root",
    source: "plugin",
  };
  Object.keys(obj).forEach((key: string) => {
    const validator = VALIDATORS[key];

    if (validator) {
      const optLoc: OptionPath = {
        type: "option",
        name: key,
        parent: rootPath,
      };
      validator(optLoc, obj[key]);
    } else {
      const invalidPluginPropertyError = new Error(
        `.${key} is not a valid Plugin property`,
      );
      // @ts-expect-error todo(flow->ts) consider adding BabelConfigError with code field
      invalidPluginPropertyError.code = "BABEL_UNKNOWN_PLUGIN_PROPERTY";
      throw invalidPluginPropertyError;
    }
  });

  return obj as any;
}
