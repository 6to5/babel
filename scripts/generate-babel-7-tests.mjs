/**
 * Usage:
 * # Update AST/output.js for Babel 8
 * OVERWRITE=1 BABEL_8_BREAKING=1 yarn jest
 * # Run this script to create all Babel 7 tests required for the Babel 8 AST changes
 * node ./scripts/generate-babel-7-tests.mjs
 * # Update AST/output.js for Babel 7
 * OVERWRITE=1 yarn jest
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, cpSync } from "node:fs";
import { dirname, join, basename } from "node:path";

function getUnstagedModifiedOutputJSON() {
  try {
    // Get the status and filter for unstaged files
    const output = execSync(
      "git status --porcelain=v1 -z -- './packages/*/test/fixtures/**/output.*'",
      { encoding: "utf-8" }
    );

    const files = [];
    // Filter for unstaged changes
    for (const line of output.split("\0")) {
      if (line[1] === "M") {
        files.push(line.slice(3));
      }
    }
    return files;
  } catch (error) {
    console.error("Error getting git status:", error.message);
    return [];
  }
}

function assignJSONFile(jsonFile, inputProperties) {
  let options = inputProperties;
  const jsonFileExists = existsSync(jsonFile);
  if (jsonFileExists) {
    try {
      options = {
        ...JSON.parse(readFileSync(jsonFile, "utf-8")),
        ...inputProperties,
      };
    } catch (error) {
      console.error(`Error reading ${jsonFile}:`, error.message);
    }
  }
  try {
    writeFileSync(jsonFile, JSON.stringify(options, null, 2) + "\n", {
      recursive: true,
    });
    console.log(`${jsonFileExists ? "Updated" : "Created"} ${jsonFile}`);
  } catch (error) {
    console.error(`Error writing ${jsonFile}:`, error.message);
  }
}

function updateBabel8BreakingTrue(files) {
  for (const file of files) {
    const dirPath = dirname(file);
    const optionsPath = join(dirPath, "options.json");
    assignJSONFile(optionsPath, { BABEL_8_BREAKING: true });
  }
}

function createBabel7Tests(files) {
  for (const file of files) {
    const dirPath = dirname(file);
    const parentDir = dirname(dirPath);
    const folderName = basename(dirPath);
    const babel7Dir = join(parentDir, `${folderName}-babel-7`);
    const optionsPath = join(babel7Dir, "options.json");

    try {
      if (!existsSync(babel7Dir)) {
        cpSync(dirPath, babel7Dir, { recursive: true });
        console.log(`Created Babel 7 copy at ${babel7Dir}`);
      }
      assignJSONFile(optionsPath, { BABEL_8_BREAKING: false });
    } catch (error) {
      console.error(`Error processing ${dirPath}:`, error.message);
    }
  }
}

function main() {
  const changedFiles = getUnstagedModifiedOutputJSON();
  updateBabel8BreakingTrue(changedFiles);
  createBabel7Tests(changedFiles);
}

main();
