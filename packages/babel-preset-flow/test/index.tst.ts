import type { Options } from "@babel/preset-flow";
import { expect } from "tstyche";

expect<Options>().type.not.toBe<undefined>();
