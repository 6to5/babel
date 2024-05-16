/* eslint-disable import/no-extraneous-dependencies */
import fs from "fs";
import { join } from "path";
import { URL, fileURLToPath } from "url";
import { minify } from "terser";
import { babel, presetTypescript } from "$repo-utils/babel-top-level";
import { gzipSync } from "zlib";
import { IS_BABEL_8 } from "$repo-utils";

const HELPERS_FOLDER = new URL("../src/helpers", import.meta.url);
const IGNORED_FILES = new Set(["package.json", "tsconfig.json"]);

export default async function generateHelpers() {
  let output = `/*
 * This file is auto-generated! Do not modify it directly.
 * To re-generate run 'yarn gulp generate-runtime-helpers'
 */

import template from "@babel/template";
import type * as t from "@babel/types";

interface Helper {
  minVersion: string;
  ast: () => t.Program;
}

function helper(minVersion: string, source: string): Helper {
  return Object.freeze({
    minVersion,
    ast: () => template.program.ast(source, { preserveComments: true }),
  })
}

export { helpers as default };
const helpers: Record<string, Helper> = {
  __proto__: null,
`;

  let babel7extraOutput = "";

  for (const file of (await fs.promises.readdir(HELPERS_FOLDER)).sort()) {
    if (IGNORED_FILES.has(file)) continue;
    if (file.startsWith(".")) continue; // ignore e.g. vim swap files

    const [helperName] = file.split(".");

    const isTs = file.endsWith(".ts");

    const filePath = join(fileURLToPath(HELPERS_FOLDER), file);
    if (!file.endsWith(".js") && !isTs) {
      console.error("ignoring", filePath);
      continue;
    }

    let code = await fs.promises.readFile(filePath, "utf8");
    const minVersionMatch = code.match(
      /^\s*\/\*\s*@minVersion\s+(?<minVersion>\S+)\s*\*\/\s*$/m
    );
    if (!minVersionMatch) {
      throw new Error(`@minVersion number missing in ${filePath}`);
    }
    const { minVersion } = minVersionMatch.groups;

    const onlyBabel7 = code.includes("@onlyBabel7");
    const mangleFns = code.includes("@mangleFns");
    const noMangleFns = [];

    code = babel.transformSync(code, {
      configFile: false,
      babelrc: false,
      filename: filePath,
      presets: [
        [
          presetTypescript,
          {
            onlyRemoveTypeImports: true,
            optimizeConstEnums: true,
          },
        ],
      ],
      plugins: [
        /**
         * @type {import("@babel/core").PluginObj}
         */
        {
          visitor: {
            ImportDeclaration(path) {
              const source = path.node.source;
              source.value = source.value
                .replace(/\.ts$/, "")
                .replace(/^\.\//, "");
            },
            FunctionDeclaration(path) {
              if (
                mangleFns &&
                path.node.leadingComments?.find(c =>
                  c.value.includes("@no-mangle")
                )
              ) {
                const name = path.node.id.name;
                if (name) noMangleFns.push(name);
              }
            },
          },
        },
      ],
    }).code;
    code = (
      await minify(code, {
        ecma: 5,
        mangle: {
          keep_fnames: mangleFns ? new RegExp(noMangleFns.join("|")) : true,
        },
        // The _typeof helper has a custom directive that we must keep
        compress: {
          directives: false,
          passes: 10,
          unsafe: true,
          unsafe_proto: true,
        },
      })
    ).code;

    const helperStr = `\
  // size: ${code.length}, gzip size: ${gzipSync(code).length}
  ${JSON.stringify(helperName)}: helper(
    ${JSON.stringify(minVersion)},
    ${JSON.stringify(code)},
  ),
`;

    if (onlyBabel7) {
      if (!IS_BABEL_8()) babel7extraOutput += helperStr;
    } else {
      output += helperStr;
    }
  }

  output += "};";

  if (babel7extraOutput) {
    output += `

if (!process.env.BABEL_8_BREAKING) {
  Object.assign(helpers, {
    ${babel7extraOutput}
  });
}
`;
  }

  return output;
}
