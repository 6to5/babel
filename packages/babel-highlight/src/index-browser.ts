/// <reference path="../../../lib/third-party-libs.d.ts" />

import Chalk from "chalk";

/**
 * Highlight `text`.
 */

type Options = {
  forceColor?: boolean;
};

/**
 * Code cannot be highlighted in browser, will return false.
 */
export function shouldHighlight(): boolean {
  return false;
}

/**
 * The Chalk instance that should be used given the passed options.
 */
export function getChalk(options: Options) {
  return options.forceColor
    ? new Chalk.constructor({ enabled: true, level: 1 })
    : Chalk;
}

/**
 * Highlight `code`.
 */
export default function highlight(code: string): string {
  return code;
}
