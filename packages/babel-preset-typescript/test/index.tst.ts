import type { Options } from "@babel/preset-typescript";
import { expect } from "tstyche";

expect<Options>().type.not.toBe<undefined>();
