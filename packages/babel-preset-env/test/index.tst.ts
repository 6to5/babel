import type { Options } from "@babel/preset-env";
import { expect } from "tstyche";

expect<Options>().type.not.toBe<undefined>();
