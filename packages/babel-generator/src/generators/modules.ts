import type Printer from "../printer.ts";
import {
  isClassDeclaration,
  isExportDefaultSpecifier,
  isExportNamespaceSpecifier,
  isImportDefaultSpecifier,
  isImportNamespaceSpecifier,
  isStatement,
} from "@babel/types";
import type * as t from "@babel/types";
import { TokenContext } from "../node/index.ts";

export function ImportSpecifier(this: Printer, node: t.ImportSpecifier) {
  if (node.importKind === "type" || node.importKind === "typeof") {
    this.word(node.importKind);
    this.space();
  }

  this.print(node.imported);
  // @ts-expect-error todo(flow-ts) maybe check node type instead of relying on name to be undefined on t.StringLiteral
  if (node.local && node.local.name !== node.imported.name) {
    this.space();
    this.word("as");
    this.space();
    this.print(node.local);
  }
}

export function ImportDefaultSpecifier(
  this: Printer,
  node: t.ImportDefaultSpecifier,
) {
  this.print(node.local);
}

export function ExportDefaultSpecifier(
  this: Printer,
  node: t.ExportDefaultSpecifier,
) {
  this.print(node.exported);
}

export function ExportSpecifier(this: Printer, node: t.ExportSpecifier) {
  if (node.exportKind === "type") {
    this.word("type");
    this.space();
  }

  this.print(node.local);
  // @ts-expect-error todo(flow-ts) maybe check node type instead of relying on name to be undefined on t.StringLiteral
  if (node.exported && node.local.name !== node.exported.name) {
    this.space();
    this.word("as");
    this.space();
    this.print(node.exported);
  }
}

export function ExportNamespaceSpecifier(
  this: Printer,
  node: t.ExportNamespaceSpecifier,
) {
  this.token("*");
  this.space();
  this.word("as");
  this.space();
  this.print(node.exported);
}

let warningShown = false;

export function _printAttributes(
  this: Printer,
  node: Extract<t.Node, { attributes?: t.ImportAttribute[] }>,
  hasPreviousBrace: boolean,
) {
  const { importAttributesKeyword } = this.format;
  const { attributes, assertions } = node;

  if (
    !process.env.BABEL_8_BREAKING &&
    attributes &&
    !importAttributesKeyword &&
    node.extra &&
    (node.extra.deprecatedAssertSyntax ||
      node.extra.deprecatedWithLegacySyntax) &&
    // In the production build only show the warning once.
    // We want to show it per-usage locally for tests.
    (!process.env.IS_PUBLISH || !warningShown)
  ) {
    warningShown = true;
    console.warn(`\
You are using import attributes, without specifying the desired output syntax.
Please specify the "importAttributesKeyword" generator option, whose value can be one of:
 - "with"        : \`import { a } from "b" with { type: "json" };\`
 - "assert"      : \`import { a } from "b" assert { type: "json" };\`
 - "with-legacy" : \`import { a } from "b" with type: "json";\`
`);
  }

  const useAssertKeyword =
    importAttributesKeyword === "assert" ||
    (!importAttributesKeyword && assertions);

  this.word(useAssertKeyword ? "assert" : "with");
  this.space();

  if (
    !process.env.BABEL_8_BREAKING &&
    !useAssertKeyword &&
    (importAttributesKeyword === "with-legacy" ||
      (!importAttributesKeyword && node.extra?.deprecatedWithLegacySyntax))
  ) {
    // with-legacy
    this.printList(attributes || assertions);
    return;
  }

  const occurrenceCount = hasPreviousBrace ? 1 : 0;

  this.token("{", null, occurrenceCount);
  this.space();
  this.printList(attributes || assertions, this.shouldPrintTrailingComma("}"));
  this.space();
  this.token("}", null, occurrenceCount);
}

export function ExportAllDeclaration(
  this: Printer,
  node: t.ExportAllDeclaration | t.DeclareExportAllDeclaration,
) {
  this.word("export");
  this.space();
  if (node.exportKind === "type") {
    this.word("type");
    this.space();
  }
  this.token("*");
  this.space();
  this.word("from");
  this.space();
  if (node.attributes?.length || node.assertions?.length) {
    this.print(node.source, true);
    this.space();
    this._printAttributes(node, false);
  } else {
    this.print(node.source);
  }

  this.semicolon();
}

function maybePrintDecoratorsBeforeExport(
  printer: Printer,
  node: t.ExportNamedDeclaration | t.ExportDefaultDeclaration,
) {
  if (
    isClassDeclaration(node.declaration) &&
    printer._shouldPrintDecoratorsBeforeExport(
      node as t.ExportNamedDeclaration & { declaration: t.ClassDeclaration },
    )
  ) {
    printer.printJoin(node.declaration.decorators);
  }
}

export function ExportNamedDeclaration(
  this: Printer,
  node: t.ExportNamedDeclaration,
) {
  maybePrintDecoratorsBeforeExport(this, node);

  this.word("export");
  this.space();
  if (node.declaration) {
    const declar = node.declaration;
    this.print(declar);
    if (!isStatement(declar)) this.semicolon();
  } else {
    if (node.exportKind === "type") {
      this.word("type");
      this.space();
    }

    const specifiers = node.specifiers.slice(0);

    // print "special" specifiers first
    let hasSpecial = false;
    for (;;) {
      const first = specifiers[0];
      if (
        isExportDefaultSpecifier(first) ||
        isExportNamespaceSpecifier(first)
      ) {
        hasSpecial = true;
        this.print(specifiers.shift());
        if (specifiers.length) {
          this.token(",");
          this.space();
        }
      } else {
        break;
      }
    }

    let hasBrace = false;
    if (specifiers.length || (!specifiers.length && !hasSpecial)) {
      hasBrace = true;
      this.token("{");
      if (specifiers.length) {
        this.space();
        this.printList(specifiers, this.shouldPrintTrailingComma("}"));
        this.space();
      }
      this.token("}");
    }

    if (node.source) {
      this.space();
      this.word("from");
      this.space();
      if (node.attributes?.length || node.assertions?.length) {
        this.print(node.source, true);
        this.space();
        this._printAttributes(node, hasBrace);
      } else {
        this.print(node.source);
      }
    }

    this.semicolon();
  }
}

export function ExportDefaultDeclaration(
  this: Printer,
  node: t.ExportDefaultDeclaration,
) {
  maybePrintDecoratorsBeforeExport(this, node);

  this.word("export");
  this.noIndentInnerCommentsHere();
  this.space();
  this.word("default");
  this.space();
  this.tokenContext |= TokenContext.exportDefault;
  const declar = node.declaration;
  this.print(declar);
  if (!isStatement(declar)) this.semicolon();
}

export function ImportDeclaration(this: Printer, node: t.ImportDeclaration) {
  this.word("import");
  this.space();

  const isTypeKind = node.importKind === "type" || node.importKind === "typeof";
  if (isTypeKind) {
    this.noIndentInnerCommentsHere();
    this.word(node.importKind);
    this.space();
  } else if (node.module) {
    this.noIndentInnerCommentsHere();
    this.word("module");
    this.space();
  } else if (node.phase) {
    this.noIndentInnerCommentsHere();
    this.word(node.phase);
    this.space();
  }

  const specifiers = node.specifiers.slice(0);
  const hasSpecifiers = !!specifiers.length;
  // print "special" specifiers first. The loop condition is constant,
  // but there is a "break" in the body.
  while (hasSpecifiers) {
    const first = specifiers[0];
    if (isImportDefaultSpecifier(first) || isImportNamespaceSpecifier(first)) {
      this.print(specifiers.shift());
      if (specifiers.length) {
        this.token(",");
        this.space();
      }
    } else {
      break;
    }
  }

  let hasBrace = false;
  if (specifiers.length) {
    hasBrace = true;
    this.token("{");
    this.space();
    this.printList(specifiers, this.shouldPrintTrailingComma("}"));
    this.space();
    this.token("}");
  } else if (isTypeKind && !hasSpecifiers) {
    hasBrace = true;
    this.token("{");
    this.token("}");
  }

  if (hasSpecifiers || isTypeKind) {
    this.space();
    this.word("from");
    this.space();
  }

  if (node.attributes?.length || node.assertions?.length) {
    this.print(node.source, true);
    this.space();
    this._printAttributes(node, hasBrace);
  } else {
    this.print(node.source);
  }

  this.semicolon();
}

export function ImportAttribute(this: Printer, node: t.ImportAttribute) {
  this.print(node.key);
  this.token(":");
  this.space();
  this.print(node.value);
}

export function ImportNamespaceSpecifier(
  this: Printer,
  node: t.ImportNamespaceSpecifier,
) {
  this.token("*");
  this.space();
  this.word("as");
  this.space();
  this.print(node.local);
}

export function ImportExpression(this: Printer, node: t.ImportExpression) {
  this.word("import");
  if (node.phase) {
    this.token(".");
    this.word(node.phase);
  }
  this.token("(");
  this.print(node.source);
  if (node.options != null) {
    this.token(",");
    this.space();
    this.print(node.options);
  }
  this.token(")");
}
