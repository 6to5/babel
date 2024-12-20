import type Printer from "../printer.ts";
import type * as t from "@babel/types";

export function TSTypeAnnotation(
  this: Printer,
  node: t.TSTypeAnnotation,
  parent: t.Node,
) {
  // TODO(@nicolo-ribaudo): investigate not including => in the range
  // of the return type of an arrow function type
  this.token(
    (parent.type === "TSFunctionType" || parent.type === "TSConstructorType") &&
      (process.env.BABEL_8_BREAKING
        ? // @ts-ignore(Babel 7 vs Babel 8) Babel 8 AST shape
          parent.returnType
        : // @ts-ignore(Babel 7 vs Babel 8) Babel 7 AST shape
          parent.typeAnnotation) === node
      ? "=>"
      : ":",
  );
  this.space();
  // @ts-expect-error todo(flow->ts) can this be removed? `.optional` looks to be not existing property
  if (node.optional) this.token("?");
  this.print(node.typeAnnotation);
}

export function TSTypeParameterInstantiation(
  this: Printer,
  node: t.TSTypeParameterInstantiation,
  parent: t.Node,
): void {
  this.token("<");

  let printTrailingSeparator =
    parent.type === "ArrowFunctionExpression" && node.params.length === 1;
  if (this.tokenMap && node.start != null && node.end != null) {
    // Only force the trailing comma for pre-existing nodes if they
    // already had a comma (either because they were multi-param, or
    // because they had a trailing comma)
    printTrailingSeparator &&= !!this.tokenMap.find(node, t =>
      this.tokenMap.matchesOriginal(t, ","),
    );
    // Preseve the trailing comma if it was there before
    printTrailingSeparator ||= this.shouldPrintTrailingComma(">");
  }

  this.printList(node.params, printTrailingSeparator);
  this.token(">");
}

export { TSTypeParameterInstantiation as TSTypeParameterDeclaration };

export function TSTypeParameter(this: Printer, node: t.TSTypeParameter) {
  if (node.in) {
    this.word("in");
    this.space();
  }

  if (node.out) {
    this.word("out");
    this.space();
  }

  this.word(
    !process.env.BABEL_8_BREAKING
      ? (node.name as unknown as string)
      : (node.name as unknown as t.Identifier).name,
  );

  if (node.constraint) {
    this.space();
    this.word("extends");
    this.space();
    this.print(node.constraint);
  }

  if (node.default) {
    this.space();
    this.token("=");
    this.space();
    this.print(node.default);
  }
}

export function TSParameterProperty(
  this: Printer,
  node: t.TSParameterProperty,
) {
  if (node.accessibility) {
    this.word(node.accessibility);
    this.space();
  }

  if (node.readonly) {
    this.word("readonly");
    this.space();
  }

  this._param(node.parameter);
}

export function TSDeclareFunction(
  this: Printer,
  node: t.TSDeclareFunction,
  parent: t.ParentMaps["TSDeclareFunction"],
) {
  if (node.declare) {
    this.word("declare");
    this.space();
  }
  this._functionHead(node, parent);
  this.semicolon();
}

export function TSDeclareMethod(this: Printer, node: t.TSDeclareMethod) {
  this._classMethodHead(node);
  this.semicolon();
}

export function TSQualifiedName(this: Printer, node: t.TSQualifiedName) {
  this.print(node.left);
  this.token(".");
  this.print(node.right);
}

export function TSCallSignatureDeclaration(
  this: Printer,
  node: t.TSCallSignatureDeclaration,
) {
  this.tsPrintSignatureDeclarationBase(node);
  maybePrintTrailingCommaOrSemicolon(this, node);
}

function maybePrintTrailingCommaOrSemicolon(printer: Printer, node: t.Node) {
  if (!printer.tokenMap || !node.start || !node.end) {
    printer.semicolon();
    return;
  }

  if (printer.tokenMap.endMatches(node, ",")) {
    printer.token(",");
  } else if (printer.tokenMap.endMatches(node, ";")) {
    printer.semicolon();
  }
}

export function TSConstructSignatureDeclaration(
  this: Printer,
  node: t.TSConstructSignatureDeclaration,
) {
  this.word("new");
  this.space();
  this.tsPrintSignatureDeclarationBase(node);
  maybePrintTrailingCommaOrSemicolon(this, node);
}

export function TSPropertySignature(
  this: Printer,
  node: t.TSPropertySignature,
) {
  const { readonly } = node;
  if (readonly) {
    this.word("readonly");
    this.space();
  }
  this.tsPrintPropertyOrMethodName(node);
  this.print(node.typeAnnotation);
  maybePrintTrailingCommaOrSemicolon(this, node);
}

export function tsPrintPropertyOrMethodName(
  this: Printer,
  node: t.TSPropertySignature | t.TSMethodSignature,
) {
  if (node.computed) {
    this.token("[");
  }
  this.print(node.key);
  if (node.computed) {
    this.token("]");
  }
  if (node.optional) {
    this.token("?");
  }
}

export function TSMethodSignature(this: Printer, node: t.TSMethodSignature) {
  const { kind } = node;
  if (kind === "set" || kind === "get") {
    this.word(kind);
    this.space();
  }
  this.tsPrintPropertyOrMethodName(node);
  this.tsPrintSignatureDeclarationBase(node);
  maybePrintTrailingCommaOrSemicolon(this, node);
}

export function TSIndexSignature(this: Printer, node: t.TSIndexSignature) {
  const { readonly, static: isStatic } = node;
  if (isStatic) {
    this.word("static");
    this.space();
  }
  if (readonly) {
    this.word("readonly");
    this.space();
  }
  this.token("[");
  this._parameters(node.parameters, "]");
  this.print(node.typeAnnotation);
  maybePrintTrailingCommaOrSemicolon(this, node);
}

export function TSAnyKeyword(this: Printer) {
  this.word("any");
}
export function TSBigIntKeyword(this: Printer) {
  this.word("bigint");
}
export function TSUnknownKeyword(this: Printer) {
  this.word("unknown");
}
export function TSNumberKeyword(this: Printer) {
  this.word("number");
}
export function TSObjectKeyword(this: Printer) {
  this.word("object");
}
export function TSBooleanKeyword(this: Printer) {
  this.word("boolean");
}
export function TSStringKeyword(this: Printer) {
  this.word("string");
}
export function TSSymbolKeyword(this: Printer) {
  this.word("symbol");
}
export function TSVoidKeyword(this: Printer) {
  this.word("void");
}
export function TSUndefinedKeyword(this: Printer) {
  this.word("undefined");
}
export function TSNullKeyword(this: Printer) {
  this.word("null");
}
export function TSNeverKeyword(this: Printer) {
  this.word("never");
}
export function TSIntrinsicKeyword(this: Printer) {
  this.word("intrinsic");
}

export function TSThisType(this: Printer) {
  this.word("this");
}

export function TSFunctionType(this: Printer, node: t.TSFunctionType) {
  this.tsPrintFunctionOrConstructorType(node);
}

export function TSConstructorType(this: Printer, node: t.TSConstructorType) {
  if (node.abstract) {
    this.word("abstract");
    this.space();
  }
  this.word("new");
  this.space();
  this.tsPrintFunctionOrConstructorType(node);
}

export function tsPrintFunctionOrConstructorType(
  this: Printer,
  node: t.TSFunctionType | t.TSConstructorType,
) {
  const { typeParameters } = node;
  const parameters = process.env.BABEL_8_BREAKING
    ? // @ts-ignore(Babel 7 vs Babel 8) Babel 8 AST shape
      node.params
    : // @ts-ignore(Babel 7 vs Babel 8) Babel 7 AST shape
      node.parameters;
  this.print(typeParameters);
  this.token("(");
  this._parameters(parameters, ")");
  this.space();
  const returnType = process.env.BABEL_8_BREAKING
    ? // @ts-ignore(Babel 7 vs Babel 8) Babel 8 AST shape
      node.returnType
    : // @ts-ignore(Babel 7 vs Babel 8) Babel 7 AST shape
      node.typeAnnotation;
  this.print(returnType);
}

export function TSTypeReference(this: Printer, node: t.TSTypeReference) {
  const typeArguments = process.env.BABEL_8_BREAKING
    ? // @ts-ignore(Babel 7 vs Babel 8) Babel 8 AST shape
      node.typeArguments
    : // @ts-ignore(Babel 7 vs Babel 8) Babel 7 AST shape
      node.typeParameters;
  this.print(node.typeName, !!typeArguments);
  this.print(typeArguments);
}

export function TSTypePredicate(this: Printer, node: t.TSTypePredicate) {
  if (node.asserts) {
    this.word("asserts");
    this.space();
  }
  this.print(node.parameterName);
  if (node.typeAnnotation) {
    this.space();
    this.word("is");
    this.space();
    this.print(node.typeAnnotation.typeAnnotation);
  }
}

export function TSTypeQuery(this: Printer, node: t.TSTypeQuery) {
  this.word("typeof");
  this.space();
  this.print(node.exprName);

  const typeArguments = process.env.BABEL_8_BREAKING
    ? //@ts-ignore(Babel 7 vs Babel 8) Babel 8 AST
      node.typeArguments
    : //@ts-ignore(Babel 7 vs Babel 8) Babel 7 AST
      node.typeParameters;
  if (typeArguments) {
    this.print(typeArguments);
  }
}

export function TSTypeLiteral(this: Printer, node: t.TSTypeLiteral) {
  printBraced(this, node, () => this.printJoin(node.members, true, true));
}

export function TSArrayType(this: Printer, node: t.TSArrayType) {
  this.print(node.elementType, true);

  this.token("[");
  this.token("]");
}

export function TSTupleType(this: Printer, node: t.TSTupleType) {
  this.token("[");
  this.printList(node.elementTypes, this.shouldPrintTrailingComma("]"));
  this.token("]");
}

export function TSOptionalType(this: Printer, node: t.TSOptionalType) {
  this.print(node.typeAnnotation);
  this.token("?");
}

export function TSRestType(this: Printer, node: t.TSRestType) {
  this.token("...");
  this.print(node.typeAnnotation);
}

export function TSNamedTupleMember(this: Printer, node: t.TSNamedTupleMember) {
  this.print(node.label);
  if (node.optional) this.token("?");
  this.token(":");
  this.space();
  this.print(node.elementType);
}

export function TSUnionType(this: Printer, node: t.TSUnionType) {
  tsPrintUnionOrIntersectionType(this, node, "|");
}

export function TSIntersectionType(this: Printer, node: t.TSIntersectionType) {
  tsPrintUnionOrIntersectionType(this, node, "&");
}

function tsPrintUnionOrIntersectionType(
  printer: Printer,
  node: t.TSUnionType | t.TSIntersectionType,
  sep: "|" | "&",
) {
  let hasLeadingToken = 0;
  if (printer.tokenMap?.startMatches(node, sep)) {
    hasLeadingToken = 1;
    printer.token(sep);
  }

  printer.printJoin(node.types, undefined, undefined, function (i) {
    this.space();
    this.token(sep, null, i + hasLeadingToken);
    this.space();
  });
}

export function TSConditionalType(this: Printer, node: t.TSConditionalType) {
  this.print(node.checkType);
  this.space();
  this.word("extends");
  this.space();
  this.print(node.extendsType);
  this.space();
  this.token("?");
  this.space();
  this.print(node.trueType);
  this.space();
  this.token(":");
  this.space();
  this.print(node.falseType);
}

export function TSInferType(this: Printer, node: t.TSInferType) {
  this.word("infer");
  this.print(node.typeParameter);
}

export function TSParenthesizedType(
  this: Printer,
  node: t.TSParenthesizedType,
) {
  this.token("(");
  this.print(node.typeAnnotation);
  this.token(")");
}

export function TSTypeOperator(this: Printer, node: t.TSTypeOperator) {
  this.word(node.operator);
  this.space();
  this.print(node.typeAnnotation);
}

export function TSIndexedAccessType(
  this: Printer,
  node: t.TSIndexedAccessType,
) {
  this.print(node.objectType, true);
  this.token("[");
  this.print(node.indexType);
  this.token("]");
}

export function TSMappedType(this: Printer, node: t.TSMappedType) {
  const { nameType, optional, readonly, typeAnnotation } = node;
  this.token("{");
  const exit = this.enterDelimited();
  this.space();
  if (readonly) {
    tokenIfPlusMinus(this, readonly);
    this.word("readonly");
    this.space();
  }

  this.token("[");
  if (process.env.BABEL_8_BREAKING) {
    // @ts-ignore(Babel 7 vs Babel 8) Babel 8 AST shape
    this.word(node.key.name);
  } else {
    // @ts-ignore(Babel 7 vs Babel 8) Babel 7 AST shape
    this.word(node.typeParameter.name);
  }

  this.space();
  this.word("in");
  this.space();
  if (process.env.BABEL_8_BREAKING) {
    // @ts-ignore(Babel 7 vs Babel 8) Babel 8 AST shape
    this.print(node.constraint);
  } else {
    // @ts-ignore(Babel 7 vs Babel 8) Babel 7 AST shape
    this.print(node.typeParameter.constraint);
  }

  if (nameType) {
    this.space();
    this.word("as");
    this.space();
    this.print(nameType);
  }

  this.token("]");

  if (optional) {
    tokenIfPlusMinus(this, optional);
    this.token("?");
  }

  if (typeAnnotation) {
    this.token(":");
    this.space();
    this.print(typeAnnotation);
  }
  this.space();
  exit();
  this.token("}");
}

function tokenIfPlusMinus(self: Printer, tok: true | "+" | "-") {
  if (tok !== true) {
    self.token(tok);
  }
}

export function TSLiteralType(this: Printer, node: t.TSLiteralType) {
  this.print(node.literal);
}

export function TSClassImplements(
  this: Printer,
  // TODO(Babel 8): Just use t.TSClassImplements
  node: t.Node & {
    expression: t.TSEntityName;
    typeArguments?: t.TSTypeParameterInstantiation;
  },
) {
  this.print(node.expression);
  this.print(node.typeArguments);
}

export { TSClassImplements as TSInterfaceHeritage };

export function TSInterfaceDeclaration(
  this: Printer,
  node: t.TSInterfaceDeclaration,
) {
  const { declare, id, typeParameters, extends: extendz, body } = node;
  if (declare) {
    this.word("declare");
    this.space();
  }
  this.word("interface");
  this.space();
  this.print(id);
  this.print(typeParameters);
  if (extendz?.length) {
    this.space();
    this.word("extends");
    this.space();
    this.printList(extendz);
  }
  this.space();
  this.print(body);
}

export function TSInterfaceBody(this: Printer, node: t.TSInterfaceBody) {
  printBraced(this, node, () => this.printJoin(node.body, true, true));
}

export function TSTypeAliasDeclaration(
  this: Printer,
  node: t.TSTypeAliasDeclaration,
) {
  const { declare, id, typeParameters, typeAnnotation } = node;
  if (declare) {
    this.word("declare");
    this.space();
  }
  this.word("type");
  this.space();
  this.print(id);
  this.print(typeParameters);
  this.space();
  this.token("=");
  this.space();
  this.print(typeAnnotation);
  this.semicolon();
}

function TSTypeExpression(
  this: Printer,
  node: t.TSAsExpression | t.TSSatisfiesExpression,
) {
  const { type, expression, typeAnnotation } = node;
  this.print(expression, true);
  this.space();
  this.word(type === "TSAsExpression" ? "as" : "satisfies");
  this.space();
  this.print(typeAnnotation);
}

export {
  TSTypeExpression as TSAsExpression,
  TSTypeExpression as TSSatisfiesExpression,
};

export function TSTypeAssertion(this: Printer, node: t.TSTypeAssertion) {
  const { typeAnnotation, expression } = node;
  this.token("<");
  this.print(typeAnnotation);
  this.token(">");
  this.space();
  this.print(expression);
}

export function TSInstantiationExpression(
  this: Printer,
  node: t.TSInstantiationExpression,
) {
  this.print(node.expression);
  if (process.env.BABEL_8_BREAKING) {
    // @ts-ignore(Babel 7 vs Babel 8) Babel 8 AST
    this.print(node.typeArguments);
  } else {
    // @ts-ignore(Babel 7 vs Babel 8) Removed in Babel 8
    this.print(node.typeParameters);
  }
}

export function TSEnumDeclaration(this: Printer, node: t.TSEnumDeclaration) {
  const { declare, const: isConst, id, members } = node;
  if (declare) {
    this.word("declare");
    this.space();
  }
  if (isConst) {
    this.word("const");
    this.space();
  }
  this.word("enum");
  this.space();
  this.print(id);
  this.space();

  printBraced(this, node, () =>
    this.printList(
      members,
      // TODO: Default to false for consistency with everything else
      this.shouldPrintTrailingComma("}") ?? true,
      true,
      true,
    ),
  );
}

export function TSEnumMember(this: Printer, node: t.TSEnumMember) {
  const { id, initializer } = node;
  this.print(id);
  if (initializer) {
    this.space();
    this.token("=");
    this.space();
    this.print(initializer);
  }
}

export function TSModuleDeclaration(
  this: Printer,
  node: t.TSModuleDeclaration,
) {
  const { declare, id, kind } = node;

  if (declare) {
    this.word("declare");
    this.space();
  }

  if (process.env.BABEL_8_BREAKING) {
    if (kind !== "global") {
      this.word(kind);
      this.space();
    }

    this.print(node.id);
    if (!node.body) {
      this.semicolon();
      return;
    }
    this.space();
    this.print(node.body);
  } else {
    // @ts-ignore(Babel 7 vs Babel 8) Babel 7 AST shape
    if (!node.global) {
      this.word(kind ?? (id.type === "Identifier" ? "namespace" : "module"));
      this.space();
    }

    this.print(id);

    if (!node.body) {
      this.semicolon();
      return;
    }

    let body = node.body;
    // @ts-ignore(Babel 7 vs Babel 8) Babel 7 AST shape
    while (body.type === "TSModuleDeclaration") {
      this.token(".");
      // @ts-ignore(Babel 7 vs Babel 8) Babel 7 AST shape
      this.print(body.id);
      // @ts-ignore(Babel 7 vs Babel 8) Babel 7 AST shape
      body = body.body;
    }

    this.space();
    this.print(body);
  }
}

export function TSModuleBlock(this: Printer, node: t.TSModuleBlock) {
  printBraced(this, node, () => this.printSequence(node.body, true));
}

export function TSImportType(this: Printer, node: t.TSImportType) {
  const { argument, qualifier, typeParameters, options } = node;
  this.word("import");
  this.token("(");
  this.print(argument);
  if (options) {
    this.token(",");
    this.print(options);
  }
  this.token(")");
  if (qualifier) {
    this.token(".");
    this.print(qualifier);
  }
  if (typeParameters) {
    this.print(typeParameters);
  }
}

export function TSImportEqualsDeclaration(
  this: Printer,
  node: t.TSImportEqualsDeclaration,
) {
  const { isExport, id, moduleReference } = node;
  if (isExport) {
    this.word("export");
    this.space();
  }
  this.word("import");
  this.space();
  this.print(id);
  this.space();
  this.token("=");
  this.space();
  this.print(moduleReference);
  this.semicolon();
}

export function TSExternalModuleReference(
  this: Printer,
  node: t.TSExternalModuleReference,
) {
  this.token("require(");
  this.print(node.expression);
  this.token(")");
}

export function TSNonNullExpression(
  this: Printer,
  node: t.TSNonNullExpression,
) {
  this.print(node.expression);
  this.token("!");
}

export function TSExportAssignment(this: Printer, node: t.TSExportAssignment) {
  this.word("export");
  this.space();
  this.token("=");
  this.space();
  this.print(node.expression);
  this.semicolon();
}

export function TSNamespaceExportDeclaration(
  this: Printer,
  node: t.TSNamespaceExportDeclaration,
) {
  this.word("export");
  this.space();
  this.word("as");
  this.space();
  this.word("namespace");
  this.space();
  this.print(node.id);
  this.semicolon();
}

export function tsPrintSignatureDeclarationBase(this: Printer, node: any) {
  const { typeParameters } = node;
  const parameters = process.env.BABEL_8_BREAKING
    ? node.params
    : node.parameters;
  this.print(typeParameters);
  this.token("(");
  this._parameters(parameters, ")");
  const returnType = process.env.BABEL_8_BREAKING
    ? node.returnType
    : node.typeAnnotation;
  this.print(returnType);
}

export function tsPrintClassMemberModifiers(
  this: Printer,
  node:
    | t.ClassProperty
    | t.ClassAccessorProperty
    | t.ClassMethod
    | t.ClassPrivateMethod
    | t.TSDeclareMethod,
) {
  const isField =
    node.type === "ClassAccessorProperty" || node.type === "ClassProperty";
  printModifiersList(this, node, [
    isField && node.declare && "declare",
    node.accessibility,
  ]);
  if (node.static) {
    this.word("static");
    this.space();
  }
  printModifiersList(this, node, [
    node.override && "override",
    node.abstract && "abstract",
    isField && node.readonly && "readonly",
  ]);
}

function printBraced(printer: Printer, node: t.Node, cb: () => void) {
  printer.token("{");
  const exit = printer.enterDelimited();
  cb();
  exit();
  printer.rightBrace(node);
}

function printModifiersList(
  printer: Printer,
  node: t.Node,
  modifiers: (string | false | null)[],
) {
  const modifiersSet = new Set<string>();
  for (const modifier of modifiers) {
    if (modifier) modifiersSet.add(modifier);
  }

  printer.tokenMap?.find(node, tok => {
    if (modifiersSet.has(tok.value)) {
      printer.token(tok.value);
      printer.space();
      modifiersSet.delete(tok.value);
      return modifiersSet.size === 0;
    }
  });

  for (const modifier of modifiersSet) {
    printer.word(modifier);
    printer.space();
  }
}
