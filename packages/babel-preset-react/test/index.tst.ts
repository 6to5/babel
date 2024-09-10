import type { Options } from "@babel/preset-react";
import { expect } from "tstyche";

expect<Options>().type.not.toBe<undefined>();
