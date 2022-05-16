import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import archivedSyntaxPkgs from "./archived-syntax-pkgs.json" assert { type: "json" };

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../"
);

function getTsPkgs(subRoot) {
  return fs
    .readdirSync(path.join(root, subRoot))
    .filter(name => name.startsWith("babel-"))
    .map(name => ({
      name: name.replace(/^babel-/, "@babel/"),
      dir: path.resolve(root, subRoot, name),
      relative: `./${subRoot}/${name}`,
    }))
    .filter(
      ({ dir }) =>
        // babel-register is special-cased because its entry point is a js file
        dir.includes("babel-register") ||
        fs.existsSync(path.join(dir, "src", "index.ts"))
    );
}

const tsPkgs = [
  ...getTsPkgs("packages"),
  ...getTsPkgs("eslint"),
  ...getTsPkgs("codemods"),
];

fs.writeFileSync(
  path.resolve(root, `tsconfig.json`),
  "/* This file is automatically generated by scripts/generators/tsconfig.js */\n" +
    JSON.stringify(
      {
        extends: "./tsconfig.base.json",
        include: tsPkgs.map(({ relative }) => `${relative}/src/**/*.ts`),
        compilerOptions: {
          paths: Object.fromEntries([
            ...tsPkgs.map(({ name, relative }) => [name, [`${relative}/src`]]),
            ...archivedSyntaxPkgs.map(name => [
              name,
              ["./lib/archived-libs.d.ts"],
            ]),
          ]),
        },
      },
      null,
      2
    )
);
