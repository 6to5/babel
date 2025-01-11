import type Printer from "../printer.ts";
import { isAssignmentPattern, isIdentifier } from "@babel/types";
import type * as t from "@babel/types";
import jsesc from "jsesc";

let lastRawIdentNode: t.Identifier | null = null;
let lastRawIdentResult: string = "";
export function _getRawIdentifier(this: Printer, node: t.Identifier) {
  if (node === lastRawIdentNode) return lastRawIdentResult;
  lastRawIdentNode = node;

  const { name } = node;
  const token = this.tokenMap.find(node, tok => tok.value === name);
  if (token) {
    lastRawIdentResult = this._originalCode.slice(token.start, token.end);
    return lastRawIdentResult;
  }
  return (lastRawIdentResult = node.name);
}

export function Identifier(this: Printer, node: t.Identifier) {
  this.sourceIdentifierName(node.loc?.identifierName || node.name);

  this.word(this.tokenMap ? this._getRawIdentifier(node) : node.name);
}

export function ArgumentPlaceholder(this: Printer) {
  this.token("?");
}

export function RestElement(this: Printer, node: t.RestElement) {
  this.token("...");
  this.print(node.argument);
}

export { RestElement as SpreadElement };

export function ObjectExpression(this: Printer, node: t.ObjectExpression) {
  const props = node.properties;

  this.token("{");

  if (props.length) {
    const exit = this.enterDelimited();
    this.space();
    this.printList(props, this.shouldPrintTrailingComma("}"), true, true);
    this.space();
    exit();
  }

  this.sourceWithOffset("end", node.loc, -1);

  this.token("}");
}

export { ObjectExpression as ObjectPattern };

export function ObjectMethod(this: Printer, node: t.ObjectMethod) {
  this.printJoin(node.decorators);
  this._methodHead(node);
  this.space();
  this.print(node.body);
}

export function ObjectProperty(this: Printer, node: t.ObjectProperty) {
  this.printJoin(node.decorators);

  if (node.computed) {
    this.token("[");
    this.print(node.key);
    this.token("]");
  } else {
    // print `({ foo: foo = 5 } = {})` as `({ foo = 5 } = {});`
    if (
      isAssignmentPattern(node.value) &&
      isIdentifier(node.key) &&
      // @ts-expect-error todo(flow->ts) `.name` does not exist on some types in union
      node.key.name === node.value.left.name
    ) {
      this.print(node.value);
      return;
    }

    this.print(node.key);

    // shorthand!
    if (
      node.shorthand &&
      isIdentifier(node.key) &&
      isIdentifier(node.value) &&
      node.key.name === node.value.name
    ) {
      return;
    }
  }

  this.token(":");
  this.space();
  this.print(node.value);
}

export function ArrayExpression(this: Printer, node: t.ArrayExpression) {
  const elems = node.elements;
  const len = elems.length;

  this.token("[");

  const exit = this.enterDelimited();

  for (let i = 0; i < elems.length; i++) {
    const elem = elems[i];
    if (elem) {
      if (i > 0) this.space();
      this.print(elem);
      if (i < len - 1 || this.shouldPrintTrailingComma("]")) {
        this.token(",", false, i);
      }
    } else {
      // If the array expression ends with a hole, that hole
      // will be ignored by the interpreter, but if it ends with
      // two (or more) holes, we need to write out two (or more)
      // commas so that the resulting code is interpreted with
      // both (all) of the holes.
      this.token(",", false, i);
    }
  }

  exit();

  this.token("]");
}

export { ArrayExpression as ArrayPattern };

export function RecordExpression(this: Printer, node: t.RecordExpression) {
  const props = node.properties;

  let startToken;
  let endToken;
  if (process.env.BABEL_8_BREAKING) {
    startToken = "#{";
    endToken = "}";
  } else {
    if (this.format.recordAndTupleSyntaxType === "bar") {
      startToken = "{|";
      endToken = "|}";
    } else if (
      this.format.recordAndTupleSyntaxType !== "hash" &&
      this.format.recordAndTupleSyntaxType != null
    ) {
      throw new Error(
        `The "recordAndTupleSyntaxType" generator option must be "bar" or "hash" (${JSON.stringify(
          this.format.recordAndTupleSyntaxType,
        )} received).`,
      );
    } else {
      startToken = "#{";
      endToken = "}";
    }
  }

  this.token(startToken);

  if (props.length) {
    this.space();
    this.printList(props, this.shouldPrintTrailingComma(endToken), true, true);
    this.space();
  }
  this.token(endToken);
}

export function TupleExpression(this: Printer, node: t.TupleExpression) {
  const elems = node.elements;
  const len = elems.length;

  let startToken;
  let endToken;
  if (process.env.BABEL_8_BREAKING) {
    startToken = "#[";
    endToken = "]";
  } else {
    if (this.format.recordAndTupleSyntaxType === "bar") {
      startToken = "[|";
      endToken = "|]";
    } else if (this.format.recordAndTupleSyntaxType === "hash") {
      startToken = "#[";
      endToken = "]";
    } else {
      throw new Error(
        `${this.format.recordAndTupleSyntaxType} is not a valid recordAndTuple syntax type`,
      );
    }
  }

  this.token(startToken);

  for (let i = 0; i < elems.length; i++) {
    const elem = elems[i];
    if (elem) {
      if (i > 0) this.space();
      this.print(elem);
      if (i < len - 1 || this.shouldPrintTrailingComma(endToken)) {
        this.token(",", false, i);
      }
    }
  }

  this.token(endToken);
}

export function RegExpLiteral(this: Printer, node: t.RegExpLiteral) {
  this.word(`/${node.pattern}/${node.flags}`);
}

export function BooleanLiteral(this: Printer, node: t.BooleanLiteral) {
  this.word(node.value ? "true" : "false");
}

export function NullLiteral(this: Printer) {
  this.word("null");
}

export function NumericLiteral(this: Printer, node: t.NumericLiteral) {
  const raw = this.getPossibleRaw(node);
  const opts = this.format.jsescOption;
  const value = node.value;
  const str = value + "";
  if (opts.numbers) {
    this.number(jsesc(value, opts), value);
  } else if (raw == null) {
    this.number(str, value); // normalize
  } else if (this.format.minified) {
    this.number(raw.length < str.length ? raw : str, value);
  } else {
    this.number(raw, value);
  }
}

export function StringLiteral(this: Printer, node: t.StringLiteral) {
  const raw = this.getPossibleRaw(node);
  if (!this.format.minified && raw !== undefined) {
    this.token(raw);
    return;
  }

  const val = jsesc(node.value, this.format.jsescOption);

  this.token(val);
}

export function BigIntLiteral(this: Printer, node: t.BigIntLiteral) {
  const raw = this.getPossibleRaw(node);
  if (!this.format.minified && raw !== undefined) {
    this.word(raw);
    return;
  }
  this.word(node.value + "n");
}

// Hack pipe operator
const validTopicTokenSet = new Set(["^^", "@@", "^", "%", "#"]);
export function TopicReference(this: Printer) {
  const { topicToken } = this.format;

  if (validTopicTokenSet.has(topicToken)) {
    this.token(topicToken);
  } else {
    const givenTopicTokenJSON = JSON.stringify(topicToken);
    const validTopics = Array.from(validTopicTokenSet, v => JSON.stringify(v));
    throw new Error(
      `The "topicToken" generator option must be one of ` +
        `${validTopics.join(", ")} (${givenTopicTokenJSON} received instead).`,
    );
  }
}

// Smart-mix pipe operator
export function PipelineTopicExpression(
  this: Printer,
  node: t.PipelineTopicExpression,
) {
  this.print(node.expression);
}

export function PipelineBareFunction(
  this: Printer,
  node: t.PipelineBareFunction,
) {
  this.print(node.callee);
}

export function PipelinePrimaryTopicReference(this: Printer) {
  this.token("#");
}
