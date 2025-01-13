import fs from "fs";
import path from "path";
import buildDebug from "debug";
import type { Handler } from "gensync";
import { file, traverseFast } from "@babel/types";
import type * as t from "@babel/types";
import type { PluginPasses } from "../config/index.ts";
import convertSourceMap from "convert-source-map";
import type { SourceMapConverter as Converter } from "convert-source-map";
import File from "./file/file.ts";
import parser from "../parser/index.ts";
import cloneDeep from "./util/clone-deep.ts";

const debug = buildDebug("babel:transform:file");

// These regexps are copied from the convert-source-map package,
// but without // or /* at the beginning of the comment.

const SOURCEMAP_REGEX = /^[@#]\s+sourceMappingURL=.*$/;
const INLINE_SOURCEMAP_REGEX =
  /^[@#]\s+sourceMappingURL=data:(?:application|text)\/json;(?:charset[:=]\S+?;)?base64,.*$/;
const EXTERNAL_SOURCEMAP_REGEX =
  /^[@#][ \t]+sourceMappingURL=([^\s'"`]+)[ \t]*$/;

export type NormalizedFile = {
  code: string;
  ast: t.File;
  inputMap: Converter | null;
};

export default function* normalizeFile(
  pluginPasses: PluginPasses,
  options: { [key: string]: any },
  code: string,
  ast?: t.File | t.Program | null,
): Handler<File> {
  code = `${code || ""}`;

  const fromAst = !!ast;

  if (ast) {
    if (ast.type === "Program") {
      ast = file(ast, [], []);
    } else if (ast.type !== "File") {
      throw new Error("AST root must be a Program or File node");
    }

    if (options.cloneInputAst) {
      ast = cloneDeep(ast);
    }
  } else {
    // @ts-expect-error todo: use babel-types ast typings in Babel parser
    ast = yield* parser(pluginPasses, options, code);
  }

  let inputMap = null;
  if (options.inputSourceMap !== false) {
    // If an explicit object is passed in, it overrides the processing of
    // source maps that may be in the file itself.
    if (typeof options.inputSourceMap === "object") {
      inputMap = convertSourceMap.fromObject(options.inputSourceMap);
    }

    if (!inputMap) {
      if (process.env.BABEL_8_BREAKING || !fromAst) {
        const comments = (ast as t.File).comments;
        for (let i = comments.length - 1; i >= 0; i--) {
          const comment = comments[i];
          if (INLINE_SOURCEMAP_REGEX.test(comment.value)) {
            try {
              inputMap = convertSourceMap.fromComment("//" + comment.value);
            } catch (err) {
              if (process.env.BABEL_8_BREAKING) {
                console.warn(
                  "discarding unknown inline input sourcemap",
                  options.filename,
                  err,
                );
              } else {
                debug("discarding unknown inline input sourcemap");
              }
            }
            break;
          }
        }

        if (!inputMap) {
          for (let i = comments.length - 1; i >= 0; i--) {
            const comment = comments[i];
            if (EXTERNAL_SOURCEMAP_REGEX.test(comment.value)) {
              if (typeof options.filename === "string") {
                try {
                  // when `lastComment` is non-null, EXTERNAL_SOURCEMAP_REGEX must have matches
                  const match: [string, string] = EXTERNAL_SOURCEMAP_REGEX.exec(
                    comment.value,
                  ) as any;
                  const inputMapContent = fs.readFileSync(
                    path.resolve(path.dirname(options.filename), match[1]),
                    "utf8",
                  );
                  inputMap = convertSourceMap.fromJSON(inputMapContent);
                } catch (err) {
                  debug("discarding unknown file input sourcemap", err);
                }
              } else {
                debug("discarding un-loadable file input sourcemap");
              }
              break;
            }
          }
        }
        if (inputMap) {
          function removeComment(comments: t.Comment[]) {
            for (let i = comments.length - 1; i >= 0; i--)
              if (SOURCEMAP_REGEX.test(comments[i].value)) {
                comments.splice(i, 1);
              }
          }

          traverseFast(ast, node => {
            if (node.leadingComments) removeComment(node.leadingComments);
            if (node.innerComments) removeComment(node.innerComments);
            if (node.trailingComments) removeComment(node.trailingComments);
          });
        }
      } else {
        const lastComment = extractComments(INLINE_SOURCEMAP_REGEX, ast);
        if (lastComment) {
          try {
            inputMap = convertSourceMap.fromComment("//" + lastComment);
          } catch (err) {
            if (process.env.BABEL_8_BREAKING) {
              console.warn(
                "discarding unknown inline input sourcemap",
                options.filename,
                err,
              );
            } else {
              debug("discarding unknown inline input sourcemap");
            }
          }
        }

        if (!inputMap) {
          const lastComment = extractComments(EXTERNAL_SOURCEMAP_REGEX, ast);
          if (typeof options.filename === "string" && lastComment) {
            try {
              // when `lastComment` is non-null, EXTERNAL_SOURCEMAP_REGEX must have matches
              const match: [string, string] = EXTERNAL_SOURCEMAP_REGEX.exec(
                lastComment,
              ) as any;
              const inputMapContent = fs.readFileSync(
                path.resolve(path.dirname(options.filename), match[1]),
                "utf8",
              );
              inputMap = convertSourceMap.fromJSON(inputMapContent);
            } catch (err) {
              debug("discarding unknown file input sourcemap", err);
            }
          } else if (lastComment) {
            debug("discarding un-loadable file input sourcemap");
          }
        }
      }
    }
  }

  return new File(options, {
    code,
    ast: ast as t.File,
    inputMap,
  });
}

function extractCommentsFromList(
  regex: RegExp,
  comments: t.Comment[],
  lastComment: string | null,
): [t.Comment[], string | null] {
  if (comments) {
    comments = comments.filter(({ value }) => {
      if (regex.test(value)) {
        lastComment = value;
        return false;
      }
      return true;
    });
  }
  return [comments, lastComment];
}

function extractComments(regex: RegExp, ast: t.Node) {
  let lastComment: string = null;
  traverseFast(ast, node => {
    [node.leadingComments, lastComment] = extractCommentsFromList(
      regex,
      node.leadingComments,
      lastComment,
    );
    [node.innerComments, lastComment] = extractCommentsFromList(
      regex,
      node.innerComments,
      lastComment,
    );
    [node.trailingComments, lastComment] = extractCommentsFromList(
      regex,
      node.trailingComments,
      lastComment,
    );
  });
  return lastComment;
}
