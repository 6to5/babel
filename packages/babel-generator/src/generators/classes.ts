import type Printer from "../printer.ts";
import {
  isExportDefaultDeclaration,
  isExportNamedDeclaration,
} from "@babel/types";
import type * as t from "@babel/types";

// We inline this package
// eslint-disable-next-line import/no-extraneous-dependencies
import * as charCodes from "charcodes";

export function ClassDeclaration(
  this: Printer,
  node: t.ClassDeclaration,
  parent: t.Node,
) {
  const inExport =
    isExportDefaultDeclaration(parent) || isExportNamedDeclaration(parent);

  if (
    !inExport ||
    !this._shouldPrintDecoratorsBeforeExport(
      parent as t.ExportDeclaration & { declaration: t.ClassDeclaration },
    )
  ) {
    this.printJoin(node.decorators);
  }

  if (node.declare) {
    // TS
    this.word("declare");
    this.space();
  }

  if (node.abstract) {
    // TS
    this.word("abstract");
    this.space();
  }

  this.word("class");

  if (node.id) {
    this.space();
    this.print(node.id);
  }

  this.print(node.typeParameters);

  if (node.superClass) {
    this.space();
    this.word("extends");
    this.space();
    this.print(node.superClass);
    this.print(
      process.env.BABEL_8_BREAKING
        ? // @ts-ignore(Babel 7 vs Babel 8) Renamed
          node.superTypeArguments
        : // @ts-ignore(Babel 7 vs Babel 8) Renamed
          node.superTypeParameters,
    );
  }

  if (node.implements) {
    this.space();
    this.word("implements");
    this.space();
    this.printList(node.implements);
  }

  this.space();
  this.print(node.body);
}

export { ClassDeclaration as ClassExpression };

export function ClassBody(this: Printer, node: t.ClassBody) {
  this.token("{");
  if (node.body.length === 0) {
    this.token("}");
  } else {
    this.newline();

    const separator = classBodyEmptySemicolonsPrinter(this, node);
    separator?.(-1); // print leading semicolons in preserveFormat mode

    const exit = this.enterDelimited();
    this.printJoin(node.body, true, true, separator, true);
    exit();

    if (!this.endsWith(charCodes.lineFeed)) this.newline();

    this.rightBrace(node);
  }
}

function classBodyEmptySemicolonsPrinter(printer: Printer, node: t.ClassBody) {
  if (!printer.tokenMap || node.start == null || node.end == null) {
    return null;
  }

  // "empty statements" in class bodies are not represented in the AST.
  // Print them by checking if there are any ; tokens between the current AST
  // member and the next one.

  const indexes = printer.tokenMap.getIndexes(node);
  if (!indexes) return null;

  let k = 1; // start from 1 to skip '{'

  let occurrenceCount = 0;

  let nextLocIndex = 0;
  const advanceNextLocIndex = () => {
    while (
      nextLocIndex < node.body.length &&
      node.body[nextLocIndex].start == null
    ) {
      nextLocIndex++;
    }
  };
  advanceNextLocIndex();

  return (i: number) => {
    if (nextLocIndex <= i) {
      nextLocIndex = i + 1;
      advanceNextLocIndex();
    }

    const end =
      nextLocIndex === node.body.length
        ? node.end
        : node.body[nextLocIndex].start;

    let tok;
    while (
      k < indexes.length &&
      printer.tokenMap.matchesOriginal(
        (tok = printer._tokens[indexes[k]]),
        ";",
      ) &&
      tok.start < end
    ) {
      printer.token(";", undefined, occurrenceCount++);
      k++;
    }
  };
}

export function ClassProperty(this: Printer, node: t.ClassProperty) {
  this.printJoin(node.decorators);

  if (!node.static && !this.format.preserveFormat) {
    // catch up to property key, avoid line break
    // between member TS modifiers and the property key.
    const endLine = node.key.loc?.end?.line;
    if (endLine) this.catchUp(endLine);
  }

  this.tsPrintClassMemberModifiers(node);

  if (node.computed) {
    this.token("[");
    this.print(node.key);
    this.token("]");
  } else {
    this._variance(node);
    this.print(node.key);
  }

  // TS
  if (node.optional) {
    this.token("?");
  }
  if (node.definite) {
    this.token("!");
  }

  this.print(node.typeAnnotation);
  if (node.value) {
    this.space();
    this.token("=");
    this.space();
    this.print(node.value);
  }
  this.semicolon();
}

export function ClassAccessorProperty(
  this: Printer,
  node: t.ClassAccessorProperty,
) {
  this.printJoin(node.decorators);

  // catch up to property key, avoid line break
  // between member modifiers and the property key.
  const endLine = node.key.loc?.end?.line;
  if (endLine) this.catchUp(endLine);

  // TS does not support class accessor property yet
  this.tsPrintClassMemberModifiers(node);

  this.word("accessor", true);
  this.space();

  if (node.computed) {
    this.token("[");
    this.print(node.key);
    this.token("]");
  } else {
    // Todo: Flow does not support class accessor property yet.
    this._variance(node);
    this.print(node.key);
  }

  // TS
  if (node.optional) {
    this.token("?");
  }
  if (node.definite) {
    this.token("!");
  }

  this.print(node.typeAnnotation);
  if (node.value) {
    this.space();
    this.token("=");
    this.space();
    this.print(node.value);
  }
  this.semicolon();
}

export function ClassPrivateProperty(
  this: Printer,
  node: t.ClassPrivateProperty,
) {
  this.printJoin(node.decorators);
  if (node.static) {
    this.word("static");
    this.space();
  }
  this.print(node.key);
  this.print(node.typeAnnotation);
  if (node.value) {
    this.space();
    this.token("=");
    this.space();
    this.print(node.value);
  }
  this.semicolon();
}

export function ClassMethod(this: Printer, node: t.ClassMethod) {
  this._classMethodHead(node);
  this.space();
  this.print(node.body);
}

export function ClassPrivateMethod(this: Printer, node: t.ClassPrivateMethod) {
  this._classMethodHead(node);
  this.space();
  this.print(node.body);
}

export function _classMethodHead(
  this: Printer,
  node: t.ClassMethod | t.ClassPrivateMethod | t.TSDeclareMethod,
) {
  this.printJoin(node.decorators);

  if (!this.format.preserveFormat) {
    // catch up to method key, avoid line break
    // between member modifiers/method heads and the method key.
    const endLine = node.key.loc?.end?.line;
    if (endLine) this.catchUp(endLine);
  }

  this.tsPrintClassMemberModifiers(node);
  this._methodHead(node);
}

export function StaticBlock(this: Printer, node: t.StaticBlock) {
  this.word("static");
  this.space();
  this.token("{");
  if (node.body.length === 0) {
    this.token("}");
  } else {
    this.newline();
    this.printSequence(node.body, true);
    this.rightBrace(node);
  }
}
