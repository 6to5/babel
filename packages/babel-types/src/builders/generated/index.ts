/*
 * This file is auto-generated! Do not modify it directly.
 * To re-generate run 'make build'
 */
import validateNode from "../validateNode";
import type * as t from "../..";
import deprecationWarning from "../../utils/deprecationWarning";
export function arrayExpression(
  elements: Array<null | t.Expression | t.SpreadElement> = [],
): t.ArrayExpression {
  return validateNode<t.ArrayExpression>({
    type: "ArrayExpression",
    elements,
  });
}
export function assignmentExpression(
  operator: string,
  left: t.LVal,
  right: t.Expression,
): t.AssignmentExpression {
  return validateNode<t.AssignmentExpression>({
    type: "AssignmentExpression",
    operator,
    left,
    right,
  });
}
export function binaryExpression(
  operator:
    | "+"
    | "-"
    | "/"
    | "%"
    | "*"
    | "**"
    | "&"
    | "|"
    | ">>"
    | ">>>"
    | "<<"
    | "^"
    | "=="
    | "==="
    | "!="
    | "!=="
    | "in"
    | "instanceof"
    | ">"
    | "<"
    | ">="
    | "<="
    | "|>",
  left: t.Expression | t.PrivateName,
  right: t.Expression,
): t.BinaryExpression {
  return validateNode<t.BinaryExpression>({
    type: "BinaryExpression",
    operator,
    left,
    right,
  });
}
export function interpreterDirective(value: string): t.InterpreterDirective {
  return validateNode<t.InterpreterDirective>({
    type: "InterpreterDirective",
    value,
  });
}
export function directive(value: t.DirectiveLiteral): t.Directive {
  return validateNode<t.Directive>({
    type: "Directive",
    value,
  });
}
export function directiveLiteral(value: string): t.DirectiveLiteral {
  return validateNode<t.DirectiveLiteral>({
    type: "DirectiveLiteral",
    value,
  });
}
export function blockStatement(
  body: Array<t.Statement>,
  directives: Array<t.Directive> = [],
): t.BlockStatement {
  return validateNode<t.BlockStatement>({
    type: "BlockStatement",
    body,
    directives,
  });
}
export function breakStatement(
  label: t.Identifier | null = null,
): t.BreakStatement {
  return validateNode<t.BreakStatement>({
    type: "BreakStatement",
    label,
  });
}
export function callExpression(
  callee: t.Expression | t.Super | t.V8IntrinsicIdentifier,
  _arguments: Array<
    t.Expression | t.SpreadElement | t.JSXNamespacedName | t.ArgumentPlaceholder
  >,
): t.CallExpression {
  return validateNode<t.CallExpression>({
    type: "CallExpression",
    callee,
    arguments: _arguments,
  });
}
export function catchClause(
  param:
    | t.Identifier
    | t.ArrayPattern
    | t.ObjectPattern
    | null
    | undefined = null,
  body: t.BlockStatement,
): t.CatchClause {
  return validateNode<t.CatchClause>({
    type: "CatchClause",
    param,
    body,
  });
}
export function conditionalExpression(
  test: t.Expression,
  consequent: t.Expression,
  alternate: t.Expression,
): t.ConditionalExpression {
  return validateNode<t.ConditionalExpression>({
    type: "ConditionalExpression",
    test,
    consequent,
    alternate,
  });
}
export function continueStatement(
  label: t.Identifier | null = null,
): t.ContinueStatement {
  return validateNode<t.ContinueStatement>({
    type: "ContinueStatement",
    label,
  });
}
export function debuggerStatement(): t.DebuggerStatement {
  return {
    type: "DebuggerStatement",
  };
}
export function doWhileStatement(
  test: t.Expression,
  body: t.Statement,
): t.DoWhileStatement {
  return validateNode<t.DoWhileStatement>({
    type: "DoWhileStatement",
    test,
    body,
  });
}
export function emptyStatement(): t.EmptyStatement {
  return {
    type: "EmptyStatement",
  };
}
export function expressionStatement(
  expression: t.Expression,
): t.ExpressionStatement {
  return validateNode<t.ExpressionStatement>({
    type: "ExpressionStatement",
    expression,
  });
}
export function file(
  program: t.Program,
  comments: Array<t.CommentBlock | t.CommentLine> | null = null,
  tokens: Array<any> | null = null,
): t.File {
  return validateNode<t.File>({
    type: "File",
    program,
    comments,
    tokens,
  });
}
export function forInStatement(
  left: t.VariableDeclaration | t.LVal,
  right: t.Expression,
  body: t.Statement,
): t.ForInStatement {
  return validateNode<t.ForInStatement>({
    type: "ForInStatement",
    left,
    right,
    body,
  });
}
export function forStatement(
  init: t.VariableDeclaration | t.Expression | null | undefined = null,
  test: t.Expression | null | undefined = null,
  update: t.Expression | null | undefined = null,
  body: t.Statement,
): t.ForStatement {
  return validateNode<t.ForStatement>({
    type: "ForStatement",
    init,
    test,
    update,
    body,
  });
}
export function functionDeclaration(
  id: t.Identifier | null | undefined = null,
  params: Array<t.Identifier | t.Pattern | t.RestElement>,
  body: t.BlockStatement,
  generator: boolean = false,
  async: boolean = false,
): t.FunctionDeclaration {
  return validateNode<t.FunctionDeclaration>({
    type: "FunctionDeclaration",
    id,
    params,
    body,
    generator,
    async,
  });
}
export function functionExpression(
  id: t.Identifier | null | undefined = null,
  params: Array<t.Identifier | t.Pattern | t.RestElement>,
  body: t.BlockStatement,
  generator: boolean = false,
  async: boolean = false,
): t.FunctionExpression {
  return validateNode<t.FunctionExpression>({
    type: "FunctionExpression",
    id,
    params,
    body,
    generator,
    async,
  });
}
export function identifier(name: string): t.Identifier {
  return validateNode<t.Identifier>({
    type: "Identifier",
    name,
  });
}
export function ifStatement(
  test: t.Expression,
  consequent: t.Statement,
  alternate: t.Statement | null = null,
): t.IfStatement {
  return validateNode<t.IfStatement>({
    type: "IfStatement",
    test,
    consequent,
    alternate,
  });
}
export function labeledStatement(
  label: t.Identifier,
  body: t.Statement,
): t.LabeledStatement {
  return validateNode<t.LabeledStatement>({
    type: "LabeledStatement",
    label,
    body,
  });
}
export function stringLiteral(value: string): t.StringLiteral {
  return validateNode<t.StringLiteral>({
    type: "StringLiteral",
    value,
  });
}
export function numericLiteral(value: number): t.NumericLiteral {
  return validateNode<t.NumericLiteral>({
    type: "NumericLiteral",
    value,
  });
}
export function nullLiteral(): t.NullLiteral {
  return {
    type: "NullLiteral",
  };
}
export function booleanLiteral(value: boolean): t.BooleanLiteral {
  return validateNode<t.BooleanLiteral>({
    type: "BooleanLiteral",
    value,
  });
}
export function regExpLiteral(
  pattern: string,
  flags: string = "",
): t.RegExpLiteral {
  return validateNode<t.RegExpLiteral>({
    type: "RegExpLiteral",
    pattern,
    flags,
  });
}
export function logicalExpression(
  operator: "||" | "&&" | "??",
  left: t.Expression,
  right: t.Expression,
): t.LogicalExpression {
  return validateNode<t.LogicalExpression>({
    type: "LogicalExpression",
    operator,
    left,
    right,
  });
}
export function memberExpression(
  object: t.Expression | t.Super,
  property: t.Expression | t.Identifier | t.PrivateName,
  computed: boolean = false,
  optional: true | false | null = null,
): t.MemberExpression {
  return validateNode<t.MemberExpression>({
    type: "MemberExpression",
    object,
    property,
    computed,
    optional,
  });
}
export function newExpression(
  callee: t.Expression | t.Super | t.V8IntrinsicIdentifier,
  _arguments: Array<
    t.Expression | t.SpreadElement | t.JSXNamespacedName | t.ArgumentPlaceholder
  >,
): t.NewExpression {
  return validateNode<t.NewExpression>({
    type: "NewExpression",
    callee,
    arguments: _arguments,
  });
}
export function program(
  body: Array<t.Statement>,
  directives: Array<t.Directive> = [],
  sourceType: "script" | "module" = "script",
  interpreter: t.InterpreterDirective | null = null,
): t.Program {
  return validateNode<t.Program>({
    type: "Program",
    body,
    directives,
    sourceType,
    interpreter,
    sourceFile: null,
  });
}
export function objectExpression(
  properties: Array<t.ObjectMethod | t.ObjectProperty | t.SpreadElement>,
): t.ObjectExpression {
  return validateNode<t.ObjectExpression>({
    type: "ObjectExpression",
    properties,
  });
}
export function objectMethod(
  kind: "method" | "get" | "set" | undefined = "method",
  key:
    | t.Expression
    | t.Identifier
    | t.StringLiteral
    | t.NumericLiteral
    | t.BigIntLiteral,
  params: Array<t.Identifier | t.Pattern | t.RestElement>,
  body: t.BlockStatement,
  computed: boolean = false,
  generator: boolean = false,
  async: boolean = false,
): t.ObjectMethod {
  return validateNode<t.ObjectMethod>({
    type: "ObjectMethod",
    kind,
    key,
    params,
    body,
    computed,
    generator,
    async,
  });
}
export function objectProperty(
  key:
    | t.Expression
    | t.Identifier
    | t.StringLiteral
    | t.NumericLiteral
    | t.BigIntLiteral
    | t.DecimalLiteral
    | t.PrivateName,
  value: t.Expression | t.PatternLike,
  computed: boolean = false,
  shorthand: boolean = false,
  decorators: Array<t.Decorator> | null = null,
): t.ObjectProperty {
  return validateNode<t.ObjectProperty>({
    type: "ObjectProperty",
    key,
    value,
    computed,
    shorthand,
    decorators,
  });
}
export function restElement(argument: t.LVal): t.RestElement {
  return validateNode<t.RestElement>({
    type: "RestElement",
    argument,
  });
}
export function returnStatement(
  argument: t.Expression | null = null,
): t.ReturnStatement {
  return validateNode<t.ReturnStatement>({
    type: "ReturnStatement",
    argument,
  });
}
export function sequenceExpression(
  expressions: Array<t.Expression>,
): t.SequenceExpression {
  return validateNode<t.SequenceExpression>({
    type: "SequenceExpression",
    expressions,
  });
}
export function parenthesizedExpression(
  expression: t.Expression,
): t.ParenthesizedExpression {
  return validateNode<t.ParenthesizedExpression>({
    type: "ParenthesizedExpression",
    expression,
  });
}
export function switchCase(
  test: t.Expression | null | undefined = null,
  consequent: Array<t.Statement>,
): t.SwitchCase {
  return validateNode<t.SwitchCase>({
    type: "SwitchCase",
    test,
    consequent,
  });
}
export function switchStatement(
  discriminant: t.Expression,
  cases: Array<t.SwitchCase>,
): t.SwitchStatement {
  return validateNode<t.SwitchStatement>({
    type: "SwitchStatement",
    discriminant,
    cases,
  });
}
export function thisExpression(): t.ThisExpression {
  return {
    type: "ThisExpression",
  };
}
export function throwStatement(argument: t.Expression): t.ThrowStatement {
  return validateNode<t.ThrowStatement>({
    type: "ThrowStatement",
    argument,
  });
}
export function tryStatement(
  block: t.BlockStatement,
  handler: t.CatchClause | null = null,
  finalizer: t.BlockStatement | null = null,
): t.TryStatement {
  return validateNode<t.TryStatement>({
    type: "TryStatement",
    block,
    handler,
    finalizer,
  });
}
export function unaryExpression(
  operator: "void" | "throw" | "delete" | "!" | "+" | "-" | "~" | "typeof",
  argument: t.Expression,
  prefix: boolean = true,
): t.UnaryExpression {
  return validateNode<t.UnaryExpression>({
    type: "UnaryExpression",
    operator,
    argument,
    prefix,
  });
}
export function updateExpression(
  operator: "++" | "--",
  argument: t.Expression,
  prefix: boolean = false,
): t.UpdateExpression {
  return validateNode<t.UpdateExpression>({
    type: "UpdateExpression",
    operator,
    argument,
    prefix,
  });
}
export function variableDeclaration(
  kind: "var" | "let" | "const" | "using",
  declarations: Array<t.VariableDeclarator>,
): t.VariableDeclaration {
  return validateNode<t.VariableDeclaration>({
    type: "VariableDeclaration",
    kind,
    declarations,
  });
}
export function variableDeclarator(
  id: t.LVal,
  init: t.Expression | null = null,
): t.VariableDeclarator {
  return validateNode<t.VariableDeclarator>({
    type: "VariableDeclarator",
    id,
    init,
  });
}
export function whileStatement(
  test: t.Expression,
  body: t.Statement,
): t.WhileStatement {
  return validateNode<t.WhileStatement>({
    type: "WhileStatement",
    test,
    body,
  });
}
export function withStatement(
  object: t.Expression,
  body: t.Statement,
): t.WithStatement {
  return validateNode<t.WithStatement>({
    type: "WithStatement",
    object,
    body,
  });
}
export function assignmentPattern(
  left:
    | t.Identifier
    | t.ObjectPattern
    | t.ArrayPattern
    | t.MemberExpression
    | t.TSAsExpression
    | t.TSSatisfiesExpression
    | t.TSTypeAssertion
    | t.TSNonNullExpression,
  right: t.Expression,
): t.AssignmentPattern {
  return validateNode<t.AssignmentPattern>({
    type: "AssignmentPattern",
    left,
    right,
  });
}
export function arrayPattern(
  elements: Array<null | t.PatternLike | t.LVal>,
): t.ArrayPattern {
  return validateNode<t.ArrayPattern>({
    type: "ArrayPattern",
    elements,
  });
}
export function arrowFunctionExpression(
  params: Array<t.Identifier | t.Pattern | t.RestElement>,
  body: t.BlockStatement | t.Expression,
  async: boolean = false,
): t.ArrowFunctionExpression {
  return validateNode<t.ArrowFunctionExpression>({
    type: "ArrowFunctionExpression",
    params,
    body,
    async,
    expression: null,
  });
}
export function classBody(
  body: Array<
    | t.ClassMethod
    | t.ClassPrivateMethod
    | t.ClassProperty
    | t.ClassPrivateProperty
    | t.ClassAccessorProperty
    | t.TSDeclareMethod
    | t.TSIndexSignature
    | t.StaticBlock
  >,
): t.ClassBody {
  return validateNode<t.ClassBody>({
    type: "ClassBody",
    body,
  });
}
export function classExpression(
  id: t.Identifier | null | undefined = null,
  superClass: t.Expression | null | undefined = null,
  body: t.ClassBody,
  decorators: Array<t.Decorator> | null = null,
): t.ClassExpression {
  return validateNode<t.ClassExpression>({
    type: "ClassExpression",
    id,
    superClass,
    body,
    decorators,
  });
}
export function classDeclaration(
  id: t.Identifier,
  superClass: t.Expression | null | undefined = null,
  body: t.ClassBody,
  decorators: Array<t.Decorator> | null = null,
): t.ClassDeclaration {
  return validateNode<t.ClassDeclaration>({
    type: "ClassDeclaration",
    id,
    superClass,
    body,
    decorators,
  });
}
export function exportAllDeclaration(
  source: t.StringLiteral,
): t.ExportAllDeclaration {
  return validateNode<t.ExportAllDeclaration>({
    type: "ExportAllDeclaration",
    source,
  });
}
export function exportDefaultDeclaration(
  declaration:
    | t.TSDeclareFunction
    | t.FunctionDeclaration
    | t.ClassDeclaration
    | t.Expression,
): t.ExportDefaultDeclaration {
  return validateNode<t.ExportDefaultDeclaration>({
    type: "ExportDefaultDeclaration",
    declaration,
  });
}
export function exportNamedDeclaration(
  declaration: t.Declaration | null = null,
  specifiers: Array<
    t.ExportSpecifier | t.ExportDefaultSpecifier | t.ExportNamespaceSpecifier
  > = [],
  source: t.StringLiteral | null = null,
): t.ExportNamedDeclaration {
  return validateNode<t.ExportNamedDeclaration>({
    type: "ExportNamedDeclaration",
    declaration,
    specifiers,
    source,
  });
}
export function exportSpecifier(
  local: t.Identifier,
  exported: t.Identifier | t.StringLiteral,
): t.ExportSpecifier {
  return validateNode<t.ExportSpecifier>({
    type: "ExportSpecifier",
    local,
    exported,
  });
}
export function forOfStatement(
  left: t.VariableDeclaration | t.LVal,
  right: t.Expression,
  body: t.Statement,
  _await: boolean = false,
): t.ForOfStatement {
  return validateNode<t.ForOfStatement>({
    type: "ForOfStatement",
    left,
    right,
    body,
    await: _await,
  });
}
export function importDeclaration(
  specifiers: Array<
    t.ImportSpecifier | t.ImportDefaultSpecifier | t.ImportNamespaceSpecifier
  >,
  source: t.StringLiteral,
): t.ImportDeclaration {
  return validateNode<t.ImportDeclaration>({
    type: "ImportDeclaration",
    specifiers,
    source,
  });
}
export function importDefaultSpecifier(
  local: t.Identifier,
): t.ImportDefaultSpecifier {
  return validateNode<t.ImportDefaultSpecifier>({
    type: "ImportDefaultSpecifier",
    local,
  });
}
export function importNamespaceSpecifier(
  local: t.Identifier,
): t.ImportNamespaceSpecifier {
  return validateNode<t.ImportNamespaceSpecifier>({
    type: "ImportNamespaceSpecifier",
    local,
  });
}
export function importSpecifier(
  local: t.Identifier,
  imported: t.Identifier | t.StringLiteral,
): t.ImportSpecifier {
  return validateNode<t.ImportSpecifier>({
    type: "ImportSpecifier",
    local,
    imported,
  });
}
export function metaProperty(
  meta: t.Identifier,
  property: t.Identifier,
): t.MetaProperty {
  return validateNode<t.MetaProperty>({
    type: "MetaProperty",
    meta,
    property,
  });
}
export function classMethod(
  kind: "get" | "set" | "method" | "constructor" | undefined = "method",
  key:
    | t.Identifier
    | t.StringLiteral
    | t.NumericLiteral
    | t.BigIntLiteral
    | t.Expression,
  params: Array<
    t.Identifier | t.Pattern | t.RestElement | t.TSParameterProperty
  >,
  body: t.BlockStatement,
  computed: boolean = false,
  _static: boolean = false,
  generator: boolean = false,
  async: boolean = false,
): t.ClassMethod {
  return validateNode<t.ClassMethod>({
    type: "ClassMethod",
    kind,
    key,
    params,
    body,
    computed,
    static: _static,
    generator,
    async,
  });
}
export function objectPattern(
  properties: Array<t.RestElement | t.ObjectProperty>,
): t.ObjectPattern {
  return validateNode<t.ObjectPattern>({
    type: "ObjectPattern",
    properties,
  });
}
export function spreadElement(argument: t.Expression): t.SpreadElement {
  return validateNode<t.SpreadElement>({
    type: "SpreadElement",
    argument,
  });
}
function _super(): t.Super {
  return {
    type: "Super",
  };
}
export { _super as super };
export function taggedTemplateExpression(
  tag: t.Expression,
  quasi: t.TemplateLiteral,
): t.TaggedTemplateExpression {
  return validateNode<t.TaggedTemplateExpression>({
    type: "TaggedTemplateExpression",
    tag,
    quasi,
  });
}
export function templateElement(
  value: { raw: string; cooked?: string },
  tail: boolean = false,
): t.TemplateElement {
  return validateNode<t.TemplateElement>({
    type: "TemplateElement",
    value,
    tail,
  });
}
export function templateLiteral(
  quasis: Array<t.TemplateElement>,
  expressions: Array<t.Expression | t.TSType>,
): t.TemplateLiteral {
  return validateNode<t.TemplateLiteral>({
    type: "TemplateLiteral",
    quasis,
    expressions,
  });
}
export function yieldExpression(
  argument: t.Expression | null = null,
  delegate: boolean = false,
): t.YieldExpression {
  return validateNode<t.YieldExpression>({
    type: "YieldExpression",
    argument,
    delegate,
  });
}
export function awaitExpression(
  argument: t.Expression,
  operation: t.Identifier | null = null,
): t.AwaitExpression {
  return validateNode<t.AwaitExpression>({
    type: "AwaitExpression",
    argument,
    operation,
  });
}
function _import(): t.Import {
  return {
    type: "Import",
  };
}
export { _import as import };
export function bigIntLiteral(value: string): t.BigIntLiteral {
  return validateNode<t.BigIntLiteral>({
    type: "BigIntLiteral",
    value,
  });
}
export function exportNamespaceSpecifier(
  exported: t.Identifier,
): t.ExportNamespaceSpecifier {
  return validateNode<t.ExportNamespaceSpecifier>({
    type: "ExportNamespaceSpecifier",
    exported,
  });
}
export function optionalMemberExpression(
  object: t.Expression,
  property: t.Expression | t.Identifier,
  computed: boolean | undefined = false,
  optional: boolean,
): t.OptionalMemberExpression {
  return validateNode<t.OptionalMemberExpression>({
    type: "OptionalMemberExpression",
    object,
    property,
    computed,
    optional,
  });
}
export function optionalCallExpression(
  callee: t.Expression,
  _arguments: Array<
    t.Expression | t.SpreadElement | t.JSXNamespacedName | t.ArgumentPlaceholder
  >,
  optional: boolean,
): t.OptionalCallExpression {
  return validateNode<t.OptionalCallExpression>({
    type: "OptionalCallExpression",
    callee,
    arguments: _arguments,
    optional,
  });
}
export function classProperty(
  key:
    | t.Identifier
    | t.StringLiteral
    | t.NumericLiteral
    | t.BigIntLiteral
    | t.Expression,
  value: t.Expression | null = null,
  typeAnnotation: t.TypeAnnotation | t.TSTypeAnnotation | t.Noop | null = null,
  decorators: Array<t.Decorator> | null = null,
  computed: boolean = false,
  _static: boolean = false,
): t.ClassProperty {
  return validateNode<t.ClassProperty>({
    type: "ClassProperty",
    key,
    value,
    typeAnnotation,
    decorators,
    computed,
    static: _static,
  });
}
export function classAccessorProperty(
  key:
    | t.Identifier
    | t.StringLiteral
    | t.NumericLiteral
    | t.BigIntLiteral
    | t.Expression
    | t.PrivateName,
  value: t.Expression | null = null,
  typeAnnotation: t.TypeAnnotation | t.TSTypeAnnotation | t.Noop | null = null,
  decorators: Array<t.Decorator> | null = null,
  computed: boolean = false,
  _static: boolean = false,
): t.ClassAccessorProperty {
  return validateNode<t.ClassAccessorProperty>({
    type: "ClassAccessorProperty",
    key,
    value,
    typeAnnotation,
    decorators,
    computed,
    static: _static,
  });
}
export function classPrivateProperty(
  key: t.PrivateName,
  value: t.Expression | null = null,
  decorators: Array<t.Decorator> | null = null,
  _static: boolean = false,
): t.ClassPrivateProperty {
  return validateNode<t.ClassPrivateProperty>({
    type: "ClassPrivateProperty",
    key,
    value,
    decorators,
    static: _static,
  });
}
export function classPrivateMethod(
  kind: "get" | "set" | "method" | undefined = "method",
  key: t.PrivateName,
  params: Array<
    t.Identifier | t.Pattern | t.RestElement | t.TSParameterProperty
  >,
  body: t.BlockStatement,
  _static: boolean = false,
): t.ClassPrivateMethod {
  return validateNode<t.ClassPrivateMethod>({
    type: "ClassPrivateMethod",
    kind,
    key,
    params,
    body,
    static: _static,
  });
}
export function privateName(id: t.Identifier): t.PrivateName {
  return validateNode<t.PrivateName>({
    type: "PrivateName",
    id,
  });
}
export function staticBlock(body: Array<t.Statement>): t.StaticBlock {
  return validateNode<t.StaticBlock>({
    type: "StaticBlock",
    body,
  });
}
export function anyTypeAnnotation(): t.AnyTypeAnnotation {
  return {
    type: "AnyTypeAnnotation",
  };
}
export function arrayTypeAnnotation(
  elementType: t.FlowType,
): t.ArrayTypeAnnotation {
  return validateNode<t.ArrayTypeAnnotation>({
    type: "ArrayTypeAnnotation",
    elementType,
  });
}
export function booleanTypeAnnotation(): t.BooleanTypeAnnotation {
  return {
    type: "BooleanTypeAnnotation",
  };
}
export function booleanLiteralTypeAnnotation(
  value: boolean,
): t.BooleanLiteralTypeAnnotation {
  return validateNode<t.BooleanLiteralTypeAnnotation>({
    type: "BooleanLiteralTypeAnnotation",
    value,
  });
}
export function nullLiteralTypeAnnotation(): t.NullLiteralTypeAnnotation {
  return {
    type: "NullLiteralTypeAnnotation",
  };
}
export function classImplements(
  id: t.Identifier,
  typeParameters: t.TypeParameterInstantiation | null = null,
): t.ClassImplements {
  return validateNode<t.ClassImplements>({
    type: "ClassImplements",
    id,
    typeParameters,
  });
}
export function declareClass(
  id: t.Identifier,
  typeParameters: t.TypeParameterDeclaration | null | undefined = null,
  _extends: Array<t.InterfaceExtends> | null | undefined = null,
  body: t.ObjectTypeAnnotation,
): t.DeclareClass {
  return validateNode<t.DeclareClass>({
    type: "DeclareClass",
    id,
    typeParameters,
    extends: _extends,
    body,
  });
}
export function declareFunction(id: t.Identifier): t.DeclareFunction {
  return validateNode<t.DeclareFunction>({
    type: "DeclareFunction",
    id,
  });
}
export function declareInterface(
  id: t.Identifier,
  typeParameters: t.TypeParameterDeclaration | null | undefined = null,
  _extends: Array<t.InterfaceExtends> | null | undefined = null,
  body: t.ObjectTypeAnnotation,
): t.DeclareInterface {
  return validateNode<t.DeclareInterface>({
    type: "DeclareInterface",
    id,
    typeParameters,
    extends: _extends,
    body,
  });
}
export function declareModule(
  id: t.Identifier | t.StringLiteral,
  body: t.BlockStatement,
  kind: "CommonJS" | "ES" | null = null,
): t.DeclareModule {
  return validateNode<t.DeclareModule>({
    type: "DeclareModule",
    id,
    body,
    kind,
  });
}
export function declareModuleExports(
  typeAnnotation: t.TypeAnnotation,
): t.DeclareModuleExports {
  return validateNode<t.DeclareModuleExports>({
    type: "DeclareModuleExports",
    typeAnnotation,
  });
}
export function declareTypeAlias(
  id: t.Identifier,
  typeParameters: t.TypeParameterDeclaration | null | undefined = null,
  right: t.FlowType,
): t.DeclareTypeAlias {
  return validateNode<t.DeclareTypeAlias>({
    type: "DeclareTypeAlias",
    id,
    typeParameters,
    right,
  });
}
export function declareOpaqueType(
  id: t.Identifier,
  typeParameters: t.TypeParameterDeclaration | null = null,
  supertype: t.FlowType | null = null,
): t.DeclareOpaqueType {
  return validateNode<t.DeclareOpaqueType>({
    type: "DeclareOpaqueType",
    id,
    typeParameters,
    supertype,
  });
}
export function declareVariable(id: t.Identifier): t.DeclareVariable {
  return validateNode<t.DeclareVariable>({
    type: "DeclareVariable",
    id,
  });
}
export function declareExportDeclaration(
  declaration: t.Flow | null = null,
  specifiers: Array<
    t.ExportSpecifier | t.ExportNamespaceSpecifier
  > | null = null,
  source: t.StringLiteral | null = null,
): t.DeclareExportDeclaration {
  return validateNode<t.DeclareExportDeclaration>({
    type: "DeclareExportDeclaration",
    declaration,
    specifiers,
    source,
  });
}
export function declareExportAllDeclaration(
  source: t.StringLiteral,
): t.DeclareExportAllDeclaration {
  return validateNode<t.DeclareExportAllDeclaration>({
    type: "DeclareExportAllDeclaration",
    source,
  });
}
export function declaredPredicate(value: t.Flow): t.DeclaredPredicate {
  return validateNode<t.DeclaredPredicate>({
    type: "DeclaredPredicate",
    value,
  });
}
export function existsTypeAnnotation(): t.ExistsTypeAnnotation {
  return {
    type: "ExistsTypeAnnotation",
  };
}
export function functionTypeAnnotation(
  typeParameters: t.TypeParameterDeclaration | null | undefined = null,
  params: Array<t.FunctionTypeParam>,
  rest: t.FunctionTypeParam | null | undefined = null,
  returnType: t.FlowType,
): t.FunctionTypeAnnotation {
  return validateNode<t.FunctionTypeAnnotation>({
    type: "FunctionTypeAnnotation",
    typeParameters,
    params,
    rest,
    returnType,
  });
}
export function functionTypeParam(
  name: t.Identifier | null | undefined = null,
  typeAnnotation: t.FlowType,
): t.FunctionTypeParam {
  return validateNode<t.FunctionTypeParam>({
    type: "FunctionTypeParam",
    name,
    typeAnnotation,
  });
}
export function genericTypeAnnotation(
  id: t.Identifier | t.QualifiedTypeIdentifier,
  typeParameters: t.TypeParameterInstantiation | null = null,
): t.GenericTypeAnnotation {
  return validateNode<t.GenericTypeAnnotation>({
    type: "GenericTypeAnnotation",
    id,
    typeParameters,
  });
}
export function inferredPredicate(): t.InferredPredicate {
  return {
    type: "InferredPredicate",
  };
}
export function interfaceExtends(
  id: t.Identifier | t.QualifiedTypeIdentifier,
  typeParameters: t.TypeParameterInstantiation | null = null,
): t.InterfaceExtends {
  return validateNode<t.InterfaceExtends>({
    type: "InterfaceExtends",
    id,
    typeParameters,
  });
}
export function interfaceDeclaration(
  id: t.Identifier,
  typeParameters: t.TypeParameterDeclaration | null | undefined = null,
  _extends: Array<t.InterfaceExtends> | null | undefined = null,
  body: t.ObjectTypeAnnotation,
): t.InterfaceDeclaration {
  return validateNode<t.InterfaceDeclaration>({
    type: "InterfaceDeclaration",
    id,
    typeParameters,
    extends: _extends,
    body,
  });
}
export function interfaceTypeAnnotation(
  _extends: Array<t.InterfaceExtends> | null | undefined = null,
  body: t.ObjectTypeAnnotation,
): t.InterfaceTypeAnnotation {
  return validateNode<t.InterfaceTypeAnnotation>({
    type: "InterfaceTypeAnnotation",
    extends: _extends,
    body,
  });
}
export function intersectionTypeAnnotation(
  types: Array<t.FlowType>,
): t.IntersectionTypeAnnotation {
  return validateNode<t.IntersectionTypeAnnotation>({
    type: "IntersectionTypeAnnotation",
    types,
  });
}
export function mixedTypeAnnotation(): t.MixedTypeAnnotation {
  return {
    type: "MixedTypeAnnotation",
  };
}
export function emptyTypeAnnotation(): t.EmptyTypeAnnotation {
  return {
    type: "EmptyTypeAnnotation",
  };
}
export function nullableTypeAnnotation(
  typeAnnotation: t.FlowType,
): t.NullableTypeAnnotation {
  return validateNode<t.NullableTypeAnnotation>({
    type: "NullableTypeAnnotation",
    typeAnnotation,
  });
}
export function numberLiteralTypeAnnotation(
  value: number,
): t.NumberLiteralTypeAnnotation {
  return validateNode<t.NumberLiteralTypeAnnotation>({
    type: "NumberLiteralTypeAnnotation",
    value,
  });
}
export function numberTypeAnnotation(): t.NumberTypeAnnotation {
  return {
    type: "NumberTypeAnnotation",
  };
}
export function objectTypeAnnotation(
  properties: Array<t.ObjectTypeProperty | t.ObjectTypeSpreadProperty>,
  indexers: Array<t.ObjectTypeIndexer> = [],
  callProperties: Array<t.ObjectTypeCallProperty> = [],
  internalSlots: Array<t.ObjectTypeInternalSlot> = [],
  exact: boolean = false,
): t.ObjectTypeAnnotation {
  return validateNode<t.ObjectTypeAnnotation>({
    type: "ObjectTypeAnnotation",
    properties,
    indexers,
    callProperties,
    internalSlots,
    exact,
  });
}
export function objectTypeInternalSlot(
  id: t.Identifier,
  value: t.FlowType,
  optional: boolean,
  _static: boolean,
  method: boolean,
): t.ObjectTypeInternalSlot {
  return validateNode<t.ObjectTypeInternalSlot>({
    type: "ObjectTypeInternalSlot",
    id,
    value,
    optional,
    static: _static,
    method,
  });
}
export function objectTypeCallProperty(
  value: t.FlowType,
): t.ObjectTypeCallProperty {
  return validateNode<t.ObjectTypeCallProperty>({
    type: "ObjectTypeCallProperty",
    value,
    static: null,
  });
}
export function objectTypeIndexer(
  id: t.Identifier | null | undefined = null,
  key: t.FlowType,
  value: t.FlowType,
  variance: t.Variance | null = null,
): t.ObjectTypeIndexer {
  return validateNode<t.ObjectTypeIndexer>({
    type: "ObjectTypeIndexer",
    id,
    key,
    value,
    variance,
    static: null,
  });
}
export function objectTypeProperty(
  key: t.Identifier | t.StringLiteral,
  value: t.FlowType,
  variance: t.Variance | null = null,
): t.ObjectTypeProperty {
  return validateNode<t.ObjectTypeProperty>({
    type: "ObjectTypeProperty",
    key,
    value,
    variance,
    kind: null,
    method: null,
    optional: null,
    proto: null,
    static: null,
  });
}
export function objectTypeSpreadProperty(
  argument: t.FlowType,
): t.ObjectTypeSpreadProperty {
  return validateNode<t.ObjectTypeSpreadProperty>({
    type: "ObjectTypeSpreadProperty",
    argument,
  });
}
export function opaqueType(
  id: t.Identifier,
  typeParameters: t.TypeParameterDeclaration | null | undefined = null,
  supertype: t.FlowType | null | undefined = null,
  impltype: t.FlowType,
): t.OpaqueType {
  return validateNode<t.OpaqueType>({
    type: "OpaqueType",
    id,
    typeParameters,
    supertype,
    impltype,
  });
}
export function qualifiedTypeIdentifier(
  id: t.Identifier,
  qualification: t.Identifier | t.QualifiedTypeIdentifier,
): t.QualifiedTypeIdentifier {
  return validateNode<t.QualifiedTypeIdentifier>({
    type: "QualifiedTypeIdentifier",
    id,
    qualification,
  });
}
export function stringLiteralTypeAnnotation(
  value: string,
): t.StringLiteralTypeAnnotation {
  return validateNode<t.StringLiteralTypeAnnotation>({
    type: "StringLiteralTypeAnnotation",
    value,
  });
}
export function stringTypeAnnotation(): t.StringTypeAnnotation {
  return {
    type: "StringTypeAnnotation",
  };
}
export function symbolTypeAnnotation(): t.SymbolTypeAnnotation {
  return {
    type: "SymbolTypeAnnotation",
  };
}
export function thisTypeAnnotation(): t.ThisTypeAnnotation {
  return {
    type: "ThisTypeAnnotation",
  };
}
export function tupleTypeAnnotation(
  types: Array<t.FlowType>,
): t.TupleTypeAnnotation {
  return validateNode<t.TupleTypeAnnotation>({
    type: "TupleTypeAnnotation",
    types,
  });
}
export function typeofTypeAnnotation(
  argument: t.FlowType,
): t.TypeofTypeAnnotation {
  return validateNode<t.TypeofTypeAnnotation>({
    type: "TypeofTypeAnnotation",
    argument,
  });
}
export function typeAlias(
  id: t.Identifier,
  typeParameters: t.TypeParameterDeclaration | null | undefined = null,
  right: t.FlowType,
): t.TypeAlias {
  return validateNode<t.TypeAlias>({
    type: "TypeAlias",
    id,
    typeParameters,
    right,
  });
}
export function typeAnnotation(typeAnnotation: t.FlowType): t.TypeAnnotation {
  return validateNode<t.TypeAnnotation>({
    type: "TypeAnnotation",
    typeAnnotation,
  });
}
export function typeCastExpression(
  expression: t.Expression,
  typeAnnotation: t.TypeAnnotation,
): t.TypeCastExpression {
  return validateNode<t.TypeCastExpression>({
    type: "TypeCastExpression",
    expression,
    typeAnnotation,
  });
}
export function typeParameter(
  bound: t.TypeAnnotation | null = null,
  _default: t.FlowType | null = null,
  variance: t.Variance | null = null,
): t.TypeParameter {
  return validateNode<t.TypeParameter>({
    type: "TypeParameter",
    bound,
    default: _default,
    variance,
    name: null,
  });
}
export function typeParameterDeclaration(
  params: Array<t.TypeParameter>,
): t.TypeParameterDeclaration {
  return validateNode<t.TypeParameterDeclaration>({
    type: "TypeParameterDeclaration",
    params,
  });
}
export function typeParameterInstantiation(
  params: Array<t.FlowType>,
): t.TypeParameterInstantiation {
  return validateNode<t.TypeParameterInstantiation>({
    type: "TypeParameterInstantiation",
    params,
  });
}
export function unionTypeAnnotation(
  types: Array<t.FlowType>,
): t.UnionTypeAnnotation {
  return validateNode<t.UnionTypeAnnotation>({
    type: "UnionTypeAnnotation",
    types,
  });
}
export function variance(kind: "minus" | "plus"): t.Variance {
  return validateNode<t.Variance>({
    type: "Variance",
    kind,
  });
}
export function voidTypeAnnotation(): t.VoidTypeAnnotation {
  return {
    type: "VoidTypeAnnotation",
  };
}
export function enumDeclaration(
  id: t.Identifier,
  body:
    | t.EnumBooleanBody
    | t.EnumNumberBody
    | t.EnumStringBody
    | t.EnumSymbolBody,
): t.EnumDeclaration {
  return validateNode<t.EnumDeclaration>({
    type: "EnumDeclaration",
    id,
    body,
  });
}
export function enumBooleanBody(
  members: Array<t.EnumBooleanMember>,
): t.EnumBooleanBody {
  return validateNode<t.EnumBooleanBody>({
    type: "EnumBooleanBody",
    members,
    explicitType: null,
    hasUnknownMembers: null,
  });
}
export function enumNumberBody(
  members: Array<t.EnumNumberMember>,
): t.EnumNumberBody {
  return validateNode<t.EnumNumberBody>({
    type: "EnumNumberBody",
    members,
    explicitType: null,
    hasUnknownMembers: null,
  });
}
export function enumStringBody(
  members: Array<t.EnumStringMember | t.EnumDefaultedMember>,
): t.EnumStringBody {
  return validateNode<t.EnumStringBody>({
    type: "EnumStringBody",
    members,
    explicitType: null,
    hasUnknownMembers: null,
  });
}
export function enumSymbolBody(
  members: Array<t.EnumDefaultedMember>,
): t.EnumSymbolBody {
  return validateNode<t.EnumSymbolBody>({
    type: "EnumSymbolBody",
    members,
    hasUnknownMembers: null,
  });
}
export function enumBooleanMember(id: t.Identifier): t.EnumBooleanMember {
  return validateNode<t.EnumBooleanMember>({
    type: "EnumBooleanMember",
    id,
    init: null,
  });
}
export function enumNumberMember(
  id: t.Identifier,
  init: t.NumericLiteral,
): t.EnumNumberMember {
  return validateNode<t.EnumNumberMember>({
    type: "EnumNumberMember",
    id,
    init,
  });
}
export function enumStringMember(
  id: t.Identifier,
  init: t.StringLiteral,
): t.EnumStringMember {
  return validateNode<t.EnumStringMember>({
    type: "EnumStringMember",
    id,
    init,
  });
}
export function enumDefaultedMember(id: t.Identifier): t.EnumDefaultedMember {
  return validateNode<t.EnumDefaultedMember>({
    type: "EnumDefaultedMember",
    id,
  });
}
export function indexedAccessType(
  objectType: t.FlowType,
  indexType: t.FlowType,
): t.IndexedAccessType {
  return validateNode<t.IndexedAccessType>({
    type: "IndexedAccessType",
    objectType,
    indexType,
  });
}
export function optionalIndexedAccessType(
  objectType: t.FlowType,
  indexType: t.FlowType,
): t.OptionalIndexedAccessType {
  return validateNode<t.OptionalIndexedAccessType>({
    type: "OptionalIndexedAccessType",
    objectType,
    indexType,
    optional: null,
  });
}
export function jsxAttribute(
  name: t.JSXIdentifier | t.JSXNamespacedName,
  value:
    | t.JSXElement
    | t.JSXFragment
    | t.StringLiteral
    | t.JSXExpressionContainer
    | null = null,
): t.JSXAttribute {
  return validateNode<t.JSXAttribute>({
    type: "JSXAttribute",
    name,
    value,
  });
}
export { jsxAttribute as jSXAttribute };
export function jsxClosingElement(
  name: t.JSXIdentifier | t.JSXMemberExpression | t.JSXNamespacedName,
): t.JSXClosingElement {
  return validateNode<t.JSXClosingElement>({
    type: "JSXClosingElement",
    name,
  });
}
export { jsxClosingElement as jSXClosingElement };
export function jsxElement(
  openingElement: t.JSXOpeningElement,
  closingElement: t.JSXClosingElement | null | undefined = null,
  children: Array<
    | t.JSXText
    | t.JSXExpressionContainer
    | t.JSXSpreadChild
    | t.JSXElement
    | t.JSXFragment
  >,
  selfClosing: boolean | null = null,
): t.JSXElement {
  return validateNode<t.JSXElement>({
    type: "JSXElement",
    openingElement,
    closingElement,
    children,
    selfClosing,
  });
}
export { jsxElement as jSXElement };
export function jsxEmptyExpression(): t.JSXEmptyExpression {
  return {
    type: "JSXEmptyExpression",
  };
}
export { jsxEmptyExpression as jSXEmptyExpression };
export function jsxExpressionContainer(
  expression: t.Expression | t.JSXEmptyExpression,
): t.JSXExpressionContainer {
  return validateNode<t.JSXExpressionContainer>({
    type: "JSXExpressionContainer",
    expression,
  });
}
export { jsxExpressionContainer as jSXExpressionContainer };
export function jsxSpreadChild(expression: t.Expression): t.JSXSpreadChild {
  return validateNode<t.JSXSpreadChild>({
    type: "JSXSpreadChild",
    expression,
  });
}
export { jsxSpreadChild as jSXSpreadChild };
export function jsxIdentifier(name: string): t.JSXIdentifier {
  return validateNode<t.JSXIdentifier>({
    type: "JSXIdentifier",
    name,
  });
}
export { jsxIdentifier as jSXIdentifier };
export function jsxMemberExpression(
  object: t.JSXMemberExpression | t.JSXIdentifier,
  property: t.JSXIdentifier,
): t.JSXMemberExpression {
  return validateNode<t.JSXMemberExpression>({
    type: "JSXMemberExpression",
    object,
    property,
  });
}
export { jsxMemberExpression as jSXMemberExpression };
export function jsxNamespacedName(
  namespace: t.JSXIdentifier,
  name: t.JSXIdentifier,
): t.JSXNamespacedName {
  return validateNode<t.JSXNamespacedName>({
    type: "JSXNamespacedName",
    namespace,
    name,
  });
}
export { jsxNamespacedName as jSXNamespacedName };
export function jsxOpeningElement(
  name: t.JSXIdentifier | t.JSXMemberExpression | t.JSXNamespacedName,
  attributes: Array<t.JSXAttribute | t.JSXSpreadAttribute>,
  selfClosing: boolean = false,
): t.JSXOpeningElement {
  return validateNode<t.JSXOpeningElement>({
    type: "JSXOpeningElement",
    name,
    attributes,
    selfClosing,
  });
}
export { jsxOpeningElement as jSXOpeningElement };
export function jsxSpreadAttribute(
  argument: t.Expression,
): t.JSXSpreadAttribute {
  return validateNode<t.JSXSpreadAttribute>({
    type: "JSXSpreadAttribute",
    argument,
  });
}
export { jsxSpreadAttribute as jSXSpreadAttribute };
export function jsxText(value: string): t.JSXText {
  return validateNode<t.JSXText>({
    type: "JSXText",
    value,
  });
}
export { jsxText as jSXText };
export function jsxFragment(
  openingFragment: t.JSXOpeningFragment,
  closingFragment: t.JSXClosingFragment,
  children: Array<
    | t.JSXText
    | t.JSXExpressionContainer
    | t.JSXSpreadChild
    | t.JSXElement
    | t.JSXFragment
  >,
): t.JSXFragment {
  return validateNode<t.JSXFragment>({
    type: "JSXFragment",
    openingFragment,
    closingFragment,
    children,
  });
}
export { jsxFragment as jSXFragment };
export function jsxOpeningFragment(): t.JSXOpeningFragment {
  return {
    type: "JSXOpeningFragment",
  };
}
export { jsxOpeningFragment as jSXOpeningFragment };
export function jsxClosingFragment(): t.JSXClosingFragment {
  return {
    type: "JSXClosingFragment",
  };
}
export { jsxClosingFragment as jSXClosingFragment };
export function noop(): t.Noop {
  return {
    type: "Noop",
  };
}
export function placeholder(
  expectedNode:
    | "Identifier"
    | "StringLiteral"
    | "Expression"
    | "Statement"
    | "Declaration"
    | "BlockStatement"
    | "ClassBody"
    | "Pattern",
  name: t.Identifier,
): t.Placeholder {
  return validateNode<t.Placeholder>({
    type: "Placeholder",
    expectedNode,
    name,
  });
}
export function v8IntrinsicIdentifier(name: string): t.V8IntrinsicIdentifier {
  return validateNode<t.V8IntrinsicIdentifier>({
    type: "V8IntrinsicIdentifier",
    name,
  });
}
export function argumentPlaceholder(): t.ArgumentPlaceholder {
  return {
    type: "ArgumentPlaceholder",
  };
}
export function bindExpression(
  object: t.Expression,
  callee: t.Expression,
): t.BindExpression {
  return validateNode<t.BindExpression>({
    type: "BindExpression",
    object,
    callee,
  });
}
export function importAttribute(
  key: t.Identifier | t.StringLiteral,
  value: t.StringLiteral,
): t.ImportAttribute {
  return validateNode<t.ImportAttribute>({
    type: "ImportAttribute",
    key,
    value,
  });
}
export function decorator(expression: t.Expression): t.Decorator {
  return validateNode<t.Decorator>({
    type: "Decorator",
    expression,
  });
}
export function doExpression(
  body: t.BlockStatement,
  async: boolean = false,
): t.DoExpression {
  return validateNode<t.DoExpression>({
    type: "DoExpression",
    body,
    async,
  });
}
export function exportDefaultSpecifier(
  exported: t.Identifier,
): t.ExportDefaultSpecifier {
  return validateNode<t.ExportDefaultSpecifier>({
    type: "ExportDefaultSpecifier",
    exported,
  });
}
export function recordExpression(
  properties: Array<t.ObjectProperty | t.SpreadElement>,
): t.RecordExpression {
  return validateNode<t.RecordExpression>({
    type: "RecordExpression",
    properties,
  });
}
export function tupleExpression(
  elements: Array<t.Expression | t.SpreadElement> = [],
): t.TupleExpression {
  return validateNode<t.TupleExpression>({
    type: "TupleExpression",
    elements,
  });
}
export function decimalLiteral(value: string): t.DecimalLiteral {
  return validateNode<t.DecimalLiteral>({
    type: "DecimalLiteral",
    value,
  });
}
export function moduleExpression(body: t.Program): t.ModuleExpression {
  return validateNode<t.ModuleExpression>({
    type: "ModuleExpression",
    body,
  });
}
export function topicReference(): t.TopicReference {
  return {
    type: "TopicReference",
  };
}
export function pipelineTopicExpression(
  expression: t.Expression,
): t.PipelineTopicExpression {
  return validateNode<t.PipelineTopicExpression>({
    type: "PipelineTopicExpression",
    expression,
  });
}
export function pipelineBareFunction(
  callee: t.Expression,
): t.PipelineBareFunction {
  return validateNode<t.PipelineBareFunction>({
    type: "PipelineBareFunction",
    callee,
  });
}
export function pipelinePrimaryTopicReference(): t.PipelinePrimaryTopicReference {
  return {
    type: "PipelinePrimaryTopicReference",
  };
}
export function tsParameterProperty(
  parameter: t.Identifier | t.AssignmentPattern,
): t.TSParameterProperty {
  return validateNode<t.TSParameterProperty>({
    type: "TSParameterProperty",
    parameter,
  });
}
export { tsParameterProperty as tSParameterProperty };
export function tsDeclareFunction(
  id: t.Identifier | null | undefined = null,
  typeParameters:
    | t.TSTypeParameterDeclaration
    | t.Noop
    | null
    | undefined = null,
  params: Array<t.Identifier | t.Pattern | t.RestElement>,
  returnType: t.TSTypeAnnotation | t.Noop | null = null,
): t.TSDeclareFunction {
  return validateNode<t.TSDeclareFunction>({
    type: "TSDeclareFunction",
    id,
    typeParameters,
    params,
    returnType,
  });
}
export { tsDeclareFunction as tSDeclareFunction };
export function tsDeclareMethod(
  decorators: Array<t.Decorator> | null | undefined = null,
  key:
    | t.Identifier
    | t.StringLiteral
    | t.NumericLiteral
    | t.BigIntLiteral
    | t.Expression,
  typeParameters:
    | t.TSTypeParameterDeclaration
    | t.Noop
    | null
    | undefined = null,
  params: Array<
    t.Identifier | t.Pattern | t.RestElement | t.TSParameterProperty
  >,
  returnType: t.TSTypeAnnotation | t.Noop | null = null,
): t.TSDeclareMethod {
  return validateNode<t.TSDeclareMethod>({
    type: "TSDeclareMethod",
    decorators,
    key,
    typeParameters,
    params,
    returnType,
  });
}
export { tsDeclareMethod as tSDeclareMethod };
export function tsQualifiedName(
  left: t.TSEntityName,
  right: t.Identifier,
): t.TSQualifiedName {
  return validateNode<t.TSQualifiedName>({
    type: "TSQualifiedName",
    left,
    right,
  });
}
export { tsQualifiedName as tSQualifiedName };
export function tsCallSignatureDeclaration(
  typeParameters: t.TSTypeParameterDeclaration | null | undefined = null,
  parameters: Array<t.Identifier | t.RestElement>,
  typeAnnotation: t.TSTypeAnnotation | null = null,
): t.TSCallSignatureDeclaration {
  return validateNode<t.TSCallSignatureDeclaration>({
    type: "TSCallSignatureDeclaration",
    typeParameters,
    parameters,
    typeAnnotation,
  });
}
export { tsCallSignatureDeclaration as tSCallSignatureDeclaration };
export function tsConstructSignatureDeclaration(
  typeParameters: t.TSTypeParameterDeclaration | null | undefined = null,
  parameters: Array<t.Identifier | t.RestElement>,
  typeAnnotation: t.TSTypeAnnotation | null = null,
): t.TSConstructSignatureDeclaration {
  return validateNode<t.TSConstructSignatureDeclaration>({
    type: "TSConstructSignatureDeclaration",
    typeParameters,
    parameters,
    typeAnnotation,
  });
}
export { tsConstructSignatureDeclaration as tSConstructSignatureDeclaration };
export function tsPropertySignature(
  key: t.Expression,
  typeAnnotation: t.TSTypeAnnotation | null = null,
  initializer: t.Expression | null = null,
): t.TSPropertySignature {
  return validateNode<t.TSPropertySignature>({
    type: "TSPropertySignature",
    key,
    typeAnnotation,
    initializer,
    kind: null,
  });
}
export { tsPropertySignature as tSPropertySignature };
export function tsMethodSignature(
  key: t.Expression,
  typeParameters: t.TSTypeParameterDeclaration | null | undefined = null,
  parameters: Array<t.Identifier | t.RestElement>,
  typeAnnotation: t.TSTypeAnnotation | null = null,
): t.TSMethodSignature {
  return validateNode<t.TSMethodSignature>({
    type: "TSMethodSignature",
    key,
    typeParameters,
    parameters,
    typeAnnotation,
    kind: null,
  });
}
export { tsMethodSignature as tSMethodSignature };
export function tsIndexSignature(
  parameters: Array<t.Identifier>,
  typeAnnotation: t.TSTypeAnnotation | null = null,
): t.TSIndexSignature {
  return validateNode<t.TSIndexSignature>({
    type: "TSIndexSignature",
    parameters,
    typeAnnotation,
  });
}
export { tsIndexSignature as tSIndexSignature };
export function tsAnyKeyword(): t.TSAnyKeyword {
  return {
    type: "TSAnyKeyword",
  };
}
export { tsAnyKeyword as tSAnyKeyword };
export function tsBooleanKeyword(): t.TSBooleanKeyword {
  return {
    type: "TSBooleanKeyword",
  };
}
export { tsBooleanKeyword as tSBooleanKeyword };
export function tsBigIntKeyword(): t.TSBigIntKeyword {
  return {
    type: "TSBigIntKeyword",
  };
}
export { tsBigIntKeyword as tSBigIntKeyword };
export function tsIntrinsicKeyword(): t.TSIntrinsicKeyword {
  return {
    type: "TSIntrinsicKeyword",
  };
}
export { tsIntrinsicKeyword as tSIntrinsicKeyword };
export function tsNeverKeyword(): t.TSNeverKeyword {
  return {
    type: "TSNeverKeyword",
  };
}
export { tsNeverKeyword as tSNeverKeyword };
export function tsNullKeyword(): t.TSNullKeyword {
  return {
    type: "TSNullKeyword",
  };
}
export { tsNullKeyword as tSNullKeyword };
export function tsNumberKeyword(): t.TSNumberKeyword {
  return {
    type: "TSNumberKeyword",
  };
}
export { tsNumberKeyword as tSNumberKeyword };
export function tsObjectKeyword(): t.TSObjectKeyword {
  return {
    type: "TSObjectKeyword",
  };
}
export { tsObjectKeyword as tSObjectKeyword };
export function tsStringKeyword(): t.TSStringKeyword {
  return {
    type: "TSStringKeyword",
  };
}
export { tsStringKeyword as tSStringKeyword };
export function tsSymbolKeyword(): t.TSSymbolKeyword {
  return {
    type: "TSSymbolKeyword",
  };
}
export { tsSymbolKeyword as tSSymbolKeyword };
export function tsUndefinedKeyword(): t.TSUndefinedKeyword {
  return {
    type: "TSUndefinedKeyword",
  };
}
export { tsUndefinedKeyword as tSUndefinedKeyword };
export function tsUnknownKeyword(): t.TSUnknownKeyword {
  return {
    type: "TSUnknownKeyword",
  };
}
export { tsUnknownKeyword as tSUnknownKeyword };
export function tsVoidKeyword(): t.TSVoidKeyword {
  return {
    type: "TSVoidKeyword",
  };
}
export { tsVoidKeyword as tSVoidKeyword };
export function tsThisType(): t.TSThisType {
  return {
    type: "TSThisType",
  };
}
export { tsThisType as tSThisType };
export function tsFunctionType(
  typeParameters: t.TSTypeParameterDeclaration | null | undefined = null,
  parameters: Array<t.Identifier | t.RestElement>,
  typeAnnotation: t.TSTypeAnnotation | null = null,
): t.TSFunctionType {
  return validateNode<t.TSFunctionType>({
    type: "TSFunctionType",
    typeParameters,
    parameters,
    typeAnnotation,
  });
}
export { tsFunctionType as tSFunctionType };
export function tsConstructorType(
  typeParameters: t.TSTypeParameterDeclaration | null | undefined = null,
  parameters: Array<t.Identifier | t.RestElement>,
  typeAnnotation: t.TSTypeAnnotation | null = null,
): t.TSConstructorType {
  return validateNode<t.TSConstructorType>({
    type: "TSConstructorType",
    typeParameters,
    parameters,
    typeAnnotation,
  });
}
export { tsConstructorType as tSConstructorType };
export function tsTypeReference(
  typeName: t.TSEntityName,
  typeParameters: t.TSTypeParameterInstantiation | null = null,
): t.TSTypeReference {
  return validateNode<t.TSTypeReference>({
    type: "TSTypeReference",
    typeName,
    typeParameters,
  });
}
export { tsTypeReference as tSTypeReference };
export function tsTypePredicate(
  parameterName: t.Identifier | t.TSThisType,
  typeAnnotation: t.TSTypeAnnotation | null = null,
  asserts: boolean | null = null,
): t.TSTypePredicate {
  return validateNode<t.TSTypePredicate>({
    type: "TSTypePredicate",
    parameterName,
    typeAnnotation,
    asserts,
  });
}
export { tsTypePredicate as tSTypePredicate };
export function tsTypeQuery(
  exprName: t.TSEntityName | t.TSImportType,
  typeParameters: t.TSTypeParameterInstantiation | null = null,
): t.TSTypeQuery {
  return validateNode<t.TSTypeQuery>({
    type: "TSTypeQuery",
    exprName,
    typeParameters,
  });
}
export { tsTypeQuery as tSTypeQuery };
export function tsTypeLiteral(
  members: Array<t.TSTypeElement>,
): t.TSTypeLiteral {
  return validateNode<t.TSTypeLiteral>({
    type: "TSTypeLiteral",
    members,
  });
}
export { tsTypeLiteral as tSTypeLiteral };
export function tsArrayType(elementType: t.TSType): t.TSArrayType {
  return validateNode<t.TSArrayType>({
    type: "TSArrayType",
    elementType,
  });
}
export { tsArrayType as tSArrayType };
export function tsTupleType(
  elementTypes: Array<t.TSType | t.TSNamedTupleMember>,
): t.TSTupleType {
  return validateNode<t.TSTupleType>({
    type: "TSTupleType",
    elementTypes,
  });
}
export { tsTupleType as tSTupleType };
export function tsOptionalType(typeAnnotation: t.TSType): t.TSOptionalType {
  return validateNode<t.TSOptionalType>({
    type: "TSOptionalType",
    typeAnnotation,
  });
}
export { tsOptionalType as tSOptionalType };
export function tsRestType(typeAnnotation: t.TSType): t.TSRestType {
  return validateNode<t.TSRestType>({
    type: "TSRestType",
    typeAnnotation,
  });
}
export { tsRestType as tSRestType };
export function tsNamedTupleMember(
  label: t.Identifier,
  elementType: t.TSType,
  optional: boolean = false,
): t.TSNamedTupleMember {
  return validateNode<t.TSNamedTupleMember>({
    type: "TSNamedTupleMember",
    label,
    elementType,
    optional,
  });
}
export { tsNamedTupleMember as tSNamedTupleMember };
export function tsUnionType(types: Array<t.TSType>): t.TSUnionType {
  return validateNode<t.TSUnionType>({
    type: "TSUnionType",
    types,
  });
}
export { tsUnionType as tSUnionType };
export function tsIntersectionType(
  types: Array<t.TSType>,
): t.TSIntersectionType {
  return validateNode<t.TSIntersectionType>({
    type: "TSIntersectionType",
    types,
  });
}
export { tsIntersectionType as tSIntersectionType };
export function tsConditionalType(
  checkType: t.TSType,
  extendsType: t.TSType,
  trueType: t.TSType,
  falseType: t.TSType,
): t.TSConditionalType {
  return validateNode<t.TSConditionalType>({
    type: "TSConditionalType",
    checkType,
    extendsType,
    trueType,
    falseType,
  });
}
export { tsConditionalType as tSConditionalType };
export function tsInferType(typeParameter: t.TSTypeParameter): t.TSInferType {
  return validateNode<t.TSInferType>({
    type: "TSInferType",
    typeParameter,
  });
}
export { tsInferType as tSInferType };
export function tsParenthesizedType(
  typeAnnotation: t.TSType,
): t.TSParenthesizedType {
  return validateNode<t.TSParenthesizedType>({
    type: "TSParenthesizedType",
    typeAnnotation,
  });
}
export { tsParenthesizedType as tSParenthesizedType };
export function tsTypeOperator(typeAnnotation: t.TSType): t.TSTypeOperator {
  return validateNode<t.TSTypeOperator>({
    type: "TSTypeOperator",
    typeAnnotation,
    operator: null,
  });
}
export { tsTypeOperator as tSTypeOperator };
export function tsIndexedAccessType(
  objectType: t.TSType,
  indexType: t.TSType,
): t.TSIndexedAccessType {
  return validateNode<t.TSIndexedAccessType>({
    type: "TSIndexedAccessType",
    objectType,
    indexType,
  });
}
export { tsIndexedAccessType as tSIndexedAccessType };
export function tsMappedType(
  typeParameter: t.TSTypeParameter,
  typeAnnotation: t.TSType | null = null,
  nameType: t.TSType | null = null,
): t.TSMappedType {
  return validateNode<t.TSMappedType>({
    type: "TSMappedType",
    typeParameter,
    typeAnnotation,
    nameType,
  });
}
export { tsMappedType as tSMappedType };
export function tsLiteralType(
  literal:
    | t.NumericLiteral
    | t.StringLiteral
    | t.BooleanLiteral
    | t.BigIntLiteral
    | t.TemplateLiteral
    | t.UnaryExpression,
): t.TSLiteralType {
  return validateNode<t.TSLiteralType>({
    type: "TSLiteralType",
    literal,
  });
}
export { tsLiteralType as tSLiteralType };
export function tsExpressionWithTypeArguments(
  expression: t.TSEntityName,
  typeParameters: t.TSTypeParameterInstantiation | null = null,
): t.TSExpressionWithTypeArguments {
  return validateNode<t.TSExpressionWithTypeArguments>({
    type: "TSExpressionWithTypeArguments",
    expression,
    typeParameters,
  });
}
export { tsExpressionWithTypeArguments as tSExpressionWithTypeArguments };
export function tsInterfaceDeclaration(
  id: t.Identifier,
  typeParameters: t.TSTypeParameterDeclaration | null | undefined = null,
  _extends: Array<t.TSExpressionWithTypeArguments> | null | undefined = null,
  body: t.TSInterfaceBody,
): t.TSInterfaceDeclaration {
  return validateNode<t.TSInterfaceDeclaration>({
    type: "TSInterfaceDeclaration",
    id,
    typeParameters,
    extends: _extends,
    body,
  });
}
export { tsInterfaceDeclaration as tSInterfaceDeclaration };
export function tsInterfaceBody(
  body: Array<t.TSTypeElement>,
): t.TSInterfaceBody {
  return validateNode<t.TSInterfaceBody>({
    type: "TSInterfaceBody",
    body,
  });
}
export { tsInterfaceBody as tSInterfaceBody };
export function tsTypeAliasDeclaration(
  id: t.Identifier,
  typeParameters: t.TSTypeParameterDeclaration | null | undefined = null,
  typeAnnotation: t.TSType,
): t.TSTypeAliasDeclaration {
  return validateNode<t.TSTypeAliasDeclaration>({
    type: "TSTypeAliasDeclaration",
    id,
    typeParameters,
    typeAnnotation,
  });
}
export { tsTypeAliasDeclaration as tSTypeAliasDeclaration };
export function tsInstantiationExpression(
  expression: t.Expression,
  typeParameters: t.TSTypeParameterInstantiation | null = null,
): t.TSInstantiationExpression {
  return validateNode<t.TSInstantiationExpression>({
    type: "TSInstantiationExpression",
    expression,
    typeParameters,
  });
}
export { tsInstantiationExpression as tSInstantiationExpression };
export function tsAsExpression(
  expression: t.Expression,
  typeAnnotation: t.TSType,
): t.TSAsExpression {
  return validateNode<t.TSAsExpression>({
    type: "TSAsExpression",
    expression,
    typeAnnotation,
  });
}
export { tsAsExpression as tSAsExpression };
export function tsSatisfiesExpression(
  expression: t.Expression,
  typeAnnotation: t.TSType,
): t.TSSatisfiesExpression {
  return validateNode<t.TSSatisfiesExpression>({
    type: "TSSatisfiesExpression",
    expression,
    typeAnnotation,
  });
}
export { tsSatisfiesExpression as tSSatisfiesExpression };
export function tsTypeAssertion(
  typeAnnotation: t.TSType,
  expression: t.Expression,
): t.TSTypeAssertion {
  return validateNode<t.TSTypeAssertion>({
    type: "TSTypeAssertion",
    typeAnnotation,
    expression,
  });
}
export { tsTypeAssertion as tSTypeAssertion };
export function tsEnumDeclaration(
  id: t.Identifier,
  members: Array<t.TSEnumMember>,
): t.TSEnumDeclaration {
  return validateNode<t.TSEnumDeclaration>({
    type: "TSEnumDeclaration",
    id,
    members,
  });
}
export { tsEnumDeclaration as tSEnumDeclaration };
export function tsEnumMember(
  id: t.Identifier | t.StringLiteral,
  initializer: t.Expression | null = null,
): t.TSEnumMember {
  return validateNode<t.TSEnumMember>({
    type: "TSEnumMember",
    id,
    initializer,
  });
}
export { tsEnumMember as tSEnumMember };
export function tsModuleDeclaration(
  id: t.Identifier | t.StringLiteral,
  body: t.TSModuleBlock | t.TSModuleDeclaration,
): t.TSModuleDeclaration {
  return validateNode<t.TSModuleDeclaration>({
    type: "TSModuleDeclaration",
    id,
    body,
  });
}
export { tsModuleDeclaration as tSModuleDeclaration };
export function tsModuleBlock(body: Array<t.Statement>): t.TSModuleBlock {
  return validateNode<t.TSModuleBlock>({
    type: "TSModuleBlock",
    body,
  });
}
export { tsModuleBlock as tSModuleBlock };
export function tsImportType(
  argument: t.StringLiteral,
  qualifier: t.TSEntityName | null = null,
  typeParameters: t.TSTypeParameterInstantiation | null = null,
): t.TSImportType {
  return validateNode<t.TSImportType>({
    type: "TSImportType",
    argument,
    qualifier,
    typeParameters,
  });
}
export { tsImportType as tSImportType };
export function tsImportEqualsDeclaration(
  id: t.Identifier,
  moduleReference: t.TSEntityName | t.TSExternalModuleReference,
): t.TSImportEqualsDeclaration {
  return validateNode<t.TSImportEqualsDeclaration>({
    type: "TSImportEqualsDeclaration",
    id,
    moduleReference,
    isExport: null,
  });
}
export { tsImportEqualsDeclaration as tSImportEqualsDeclaration };
export function tsExternalModuleReference(
  expression: t.StringLiteral,
): t.TSExternalModuleReference {
  return validateNode<t.TSExternalModuleReference>({
    type: "TSExternalModuleReference",
    expression,
  });
}
export { tsExternalModuleReference as tSExternalModuleReference };
export function tsNonNullExpression(
  expression: t.Expression,
): t.TSNonNullExpression {
  return validateNode<t.TSNonNullExpression>({
    type: "TSNonNullExpression",
    expression,
  });
}
export { tsNonNullExpression as tSNonNullExpression };
export function tsExportAssignment(
  expression: t.Expression,
): t.TSExportAssignment {
  return validateNode<t.TSExportAssignment>({
    type: "TSExportAssignment",
    expression,
  });
}
export { tsExportAssignment as tSExportAssignment };
export function tsNamespaceExportDeclaration(
  id: t.Identifier,
): t.TSNamespaceExportDeclaration {
  return validateNode<t.TSNamespaceExportDeclaration>({
    type: "TSNamespaceExportDeclaration",
    id,
  });
}
export { tsNamespaceExportDeclaration as tSNamespaceExportDeclaration };
export function tsTypeAnnotation(typeAnnotation: t.TSType): t.TSTypeAnnotation {
  return validateNode<t.TSTypeAnnotation>({
    type: "TSTypeAnnotation",
    typeAnnotation,
  });
}
export { tsTypeAnnotation as tSTypeAnnotation };
export function tsTypeParameterInstantiation(
  params: Array<t.TSType>,
): t.TSTypeParameterInstantiation {
  return validateNode<t.TSTypeParameterInstantiation>({
    type: "TSTypeParameterInstantiation",
    params,
  });
}
export { tsTypeParameterInstantiation as tSTypeParameterInstantiation };
export function tsTypeParameterDeclaration(
  params: Array<t.TSTypeParameter>,
): t.TSTypeParameterDeclaration {
  return validateNode<t.TSTypeParameterDeclaration>({
    type: "TSTypeParameterDeclaration",
    params,
  });
}
export { tsTypeParameterDeclaration as tSTypeParameterDeclaration };
export function tsTypeParameter(
  constraint: t.TSType | null | undefined = null,
  _default: t.TSType | null | undefined = null,
  name: string,
): t.TSTypeParameter {
  return validateNode<t.TSTypeParameter>({
    type: "TSTypeParameter",
    constraint,
    default: _default,
    name,
  });
}
export { tsTypeParameter as tSTypeParameter };
/** @deprecated */
function NumberLiteral(value: number) {
  deprecationWarning("NumberLiteral", "NumericLiteral", "The node type ");
  return numericLiteral(value);
}
export { NumberLiteral as numberLiteral };
/** @deprecated */
function RegexLiteral(pattern: string, flags: string = "") {
  deprecationWarning("RegexLiteral", "RegExpLiteral", "The node type ");
  return regExpLiteral(pattern, flags);
}
export { RegexLiteral as regexLiteral };
/** @deprecated */
function RestProperty(argument: t.LVal) {
  deprecationWarning("RestProperty", "RestElement", "The node type ");
  return restElement(argument);
}
export { RestProperty as restProperty };
/** @deprecated */
function SpreadProperty(argument: t.Expression) {
  deprecationWarning("SpreadProperty", "SpreadElement", "The node type ");
  return spreadElement(argument);
}
export { SpreadProperty as spreadProperty };
