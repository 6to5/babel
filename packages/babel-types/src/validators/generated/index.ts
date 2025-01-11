/*
 * This file is auto-generated! Do not modify it directly.
 * To re-generate run 'make build'
 */

/* eslint-disable no-fallthrough */

import shallowEqual from "../../utils/shallowEqual.ts";
import type * as t from "../../index.ts";
import deprecationWarning from "../../utils/deprecationWarning.ts";

type Opts<Obj> = Partial<{
  [Prop in keyof Obj]: Obj[Prop] extends t.Node
    ? t.Node
    : Obj[Prop] extends t.Node[]
      ? t.Node[]
      : Obj[Prop];
}>;

export function isArrayExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.ArrayExpression> | null,
): node is t.ArrayExpression {
  if (!node) return false;

  if (node.type !== "ArrayExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isAssignmentExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.AssignmentExpression> | null,
): node is t.AssignmentExpression {
  if (!node) return false;

  if (node.type !== "AssignmentExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isBinaryExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.BinaryExpression> | null,
): node is t.BinaryExpression {
  if (!node) return false;

  if (node.type !== "BinaryExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isInterpreterDirective(
  node: t.Node | null | undefined,
  opts?: Opts<t.InterpreterDirective> | null,
): node is t.InterpreterDirective {
  if (!node) return false;

  if (node.type !== "InterpreterDirective") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isDirective(
  node: t.Node | null | undefined,
  opts?: Opts<t.Directive> | null,
): node is t.Directive {
  if (!node) return false;

  if (node.type !== "Directive") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isDirectiveLiteral(
  node: t.Node | null | undefined,
  opts?: Opts<t.DirectiveLiteral> | null,
): node is t.DirectiveLiteral {
  if (!node) return false;

  if (node.type !== "DirectiveLiteral") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isBlockStatement(
  node: t.Node | null | undefined,
  opts?: Opts<t.BlockStatement> | null,
): node is t.BlockStatement {
  if (!node) return false;

  if (node.type !== "BlockStatement") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isBreakStatement(
  node: t.Node | null | undefined,
  opts?: Opts<t.BreakStatement> | null,
): node is t.BreakStatement {
  if (!node) return false;

  if (node.type !== "BreakStatement") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isCallExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.CallExpression> | null,
): node is t.CallExpression {
  if (!node) return false;

  if (node.type !== "CallExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isCatchClause(
  node: t.Node | null | undefined,
  opts?: Opts<t.CatchClause> | null,
): node is t.CatchClause {
  if (!node) return false;

  if (node.type !== "CatchClause") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isConditionalExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.ConditionalExpression> | null,
): node is t.ConditionalExpression {
  if (!node) return false;

  if (node.type !== "ConditionalExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isContinueStatement(
  node: t.Node | null | undefined,
  opts?: Opts<t.ContinueStatement> | null,
): node is t.ContinueStatement {
  if (!node) return false;

  if (node.type !== "ContinueStatement") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isDebuggerStatement(
  node: t.Node | null | undefined,
  opts?: Opts<t.DebuggerStatement> | null,
): node is t.DebuggerStatement {
  if (!node) return false;

  if (node.type !== "DebuggerStatement") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isDoWhileStatement(
  node: t.Node | null | undefined,
  opts?: Opts<t.DoWhileStatement> | null,
): node is t.DoWhileStatement {
  if (!node) return false;

  if (node.type !== "DoWhileStatement") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isEmptyStatement(
  node: t.Node | null | undefined,
  opts?: Opts<t.EmptyStatement> | null,
): node is t.EmptyStatement {
  if (!node) return false;

  if (node.type !== "EmptyStatement") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isExpressionStatement(
  node: t.Node | null | undefined,
  opts?: Opts<t.ExpressionStatement> | null,
): node is t.ExpressionStatement {
  if (!node) return false;

  if (node.type !== "ExpressionStatement") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isFile(
  node: t.Node | null | undefined,
  opts?: Opts<t.File> | null,
): node is t.File {
  if (!node) return false;

  if (node.type !== "File") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isForInStatement(
  node: t.Node | null | undefined,
  opts?: Opts<t.ForInStatement> | null,
): node is t.ForInStatement {
  if (!node) return false;

  if (node.type !== "ForInStatement") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isForStatement(
  node: t.Node | null | undefined,
  opts?: Opts<t.ForStatement> | null,
): node is t.ForStatement {
  if (!node) return false;

  if (node.type !== "ForStatement") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isFunctionDeclaration(
  node: t.Node | null | undefined,
  opts?: Opts<t.FunctionDeclaration> | null,
): node is t.FunctionDeclaration {
  if (!node) return false;

  if (node.type !== "FunctionDeclaration") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isFunctionExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.FunctionExpression> | null,
): node is t.FunctionExpression {
  if (!node) return false;

  if (node.type !== "FunctionExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isIdentifier(
  node: t.Node | null | undefined,
  opts?: Opts<t.Identifier> | null,
): node is t.Identifier {
  if (!node) return false;

  if (node.type !== "Identifier") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isIfStatement(
  node: t.Node | null | undefined,
  opts?: Opts<t.IfStatement> | null,
): node is t.IfStatement {
  if (!node) return false;

  if (node.type !== "IfStatement") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isLabeledStatement(
  node: t.Node | null | undefined,
  opts?: Opts<t.LabeledStatement> | null,
): node is t.LabeledStatement {
  if (!node) return false;

  if (node.type !== "LabeledStatement") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isStringLiteral(
  node: t.Node | null | undefined,
  opts?: Opts<t.StringLiteral> | null,
): node is t.StringLiteral {
  if (!node) return false;

  if (node.type !== "StringLiteral") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isNumericLiteral(
  node: t.Node | null | undefined,
  opts?: Opts<t.NumericLiteral> | null,
): node is t.NumericLiteral {
  if (!node) return false;

  if (node.type !== "NumericLiteral") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isNullLiteral(
  node: t.Node | null | undefined,
  opts?: Opts<t.NullLiteral> | null,
): node is t.NullLiteral {
  if (!node) return false;

  if (node.type !== "NullLiteral") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isBooleanLiteral(
  node: t.Node | null | undefined,
  opts?: Opts<t.BooleanLiteral> | null,
): node is t.BooleanLiteral {
  if (!node) return false;

  if (node.type !== "BooleanLiteral") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isRegExpLiteral(
  node: t.Node | null | undefined,
  opts?: Opts<t.RegExpLiteral> | null,
): node is t.RegExpLiteral {
  if (!node) return false;

  if (node.type !== "RegExpLiteral") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isLogicalExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.LogicalExpression> | null,
): node is t.LogicalExpression {
  if (!node) return false;

  if (node.type !== "LogicalExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isMemberExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.MemberExpression> | null,
): node is t.MemberExpression {
  if (!node) return false;

  if (node.type !== "MemberExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isNewExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.NewExpression> | null,
): node is t.NewExpression {
  if (!node) return false;

  if (node.type !== "NewExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isProgram(
  node: t.Node | null | undefined,
  opts?: Opts<t.Program> | null,
): node is t.Program {
  if (!node) return false;

  if (node.type !== "Program") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isObjectExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.ObjectExpression> | null,
): node is t.ObjectExpression {
  if (!node) return false;

  if (node.type !== "ObjectExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isObjectMethod(
  node: t.Node | null | undefined,
  opts?: Opts<t.ObjectMethod> | null,
): node is t.ObjectMethod {
  if (!node) return false;

  if (node.type !== "ObjectMethod") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isObjectProperty(
  node: t.Node | null | undefined,
  opts?: Opts<t.ObjectProperty> | null,
): node is t.ObjectProperty {
  if (!node) return false;

  if (node.type !== "ObjectProperty") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isRestElement(
  node: t.Node | null | undefined,
  opts?: Opts<t.RestElement> | null,
): node is t.RestElement {
  if (!node) return false;

  if (node.type !== "RestElement") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isReturnStatement(
  node: t.Node | null | undefined,
  opts?: Opts<t.ReturnStatement> | null,
): node is t.ReturnStatement {
  if (!node) return false;

  if (node.type !== "ReturnStatement") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isSequenceExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.SequenceExpression> | null,
): node is t.SequenceExpression {
  if (!node) return false;

  if (node.type !== "SequenceExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isParenthesizedExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.ParenthesizedExpression> | null,
): node is t.ParenthesizedExpression {
  if (!node) return false;

  if (node.type !== "ParenthesizedExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isSwitchCase(
  node: t.Node | null | undefined,
  opts?: Opts<t.SwitchCase> | null,
): node is t.SwitchCase {
  if (!node) return false;

  if (node.type !== "SwitchCase") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isSwitchStatement(
  node: t.Node | null | undefined,
  opts?: Opts<t.SwitchStatement> | null,
): node is t.SwitchStatement {
  if (!node) return false;

  if (node.type !== "SwitchStatement") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isThisExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.ThisExpression> | null,
): node is t.ThisExpression {
  if (!node) return false;

  if (node.type !== "ThisExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isThrowStatement(
  node: t.Node | null | undefined,
  opts?: Opts<t.ThrowStatement> | null,
): node is t.ThrowStatement {
  if (!node) return false;

  if (node.type !== "ThrowStatement") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTryStatement(
  node: t.Node | null | undefined,
  opts?: Opts<t.TryStatement> | null,
): node is t.TryStatement {
  if (!node) return false;

  if (node.type !== "TryStatement") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isUnaryExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.UnaryExpression> | null,
): node is t.UnaryExpression {
  if (!node) return false;

  if (node.type !== "UnaryExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isUpdateExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.UpdateExpression> | null,
): node is t.UpdateExpression {
  if (!node) return false;

  if (node.type !== "UpdateExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isVariableDeclaration(
  node: t.Node | null | undefined,
  opts?: Opts<t.VariableDeclaration> | null,
): node is t.VariableDeclaration {
  if (!node) return false;

  if (node.type !== "VariableDeclaration") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isVariableDeclarator(
  node: t.Node | null | undefined,
  opts?: Opts<t.VariableDeclarator> | null,
): node is t.VariableDeclarator {
  if (!node) return false;

  if (node.type !== "VariableDeclarator") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isWhileStatement(
  node: t.Node | null | undefined,
  opts?: Opts<t.WhileStatement> | null,
): node is t.WhileStatement {
  if (!node) return false;

  if (node.type !== "WhileStatement") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isWithStatement(
  node: t.Node | null | undefined,
  opts?: Opts<t.WithStatement> | null,
): node is t.WithStatement {
  if (!node) return false;

  if (node.type !== "WithStatement") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isAssignmentPattern(
  node: t.Node | null | undefined,
  opts?: Opts<t.AssignmentPattern> | null,
): node is t.AssignmentPattern {
  if (!node) return false;

  if (node.type !== "AssignmentPattern") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isArrayPattern(
  node: t.Node | null | undefined,
  opts?: Opts<t.ArrayPattern> | null,
): node is t.ArrayPattern {
  if (!node) return false;

  if (node.type !== "ArrayPattern") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isArrowFunctionExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.ArrowFunctionExpression> | null,
): node is t.ArrowFunctionExpression {
  if (!node) return false;

  if (node.type !== "ArrowFunctionExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isClassBody(
  node: t.Node | null | undefined,
  opts?: Opts<t.ClassBody> | null,
): node is t.ClassBody {
  if (!node) return false;

  if (node.type !== "ClassBody") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isClassExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.ClassExpression> | null,
): node is t.ClassExpression {
  if (!node) return false;

  if (node.type !== "ClassExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isClassDeclaration(
  node: t.Node | null | undefined,
  opts?: Opts<t.ClassDeclaration> | null,
): node is t.ClassDeclaration {
  if (!node) return false;

  if (node.type !== "ClassDeclaration") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isExportAllDeclaration(
  node: t.Node | null | undefined,
  opts?: Opts<t.ExportAllDeclaration> | null,
): node is t.ExportAllDeclaration {
  if (!node) return false;

  if (node.type !== "ExportAllDeclaration") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isExportDefaultDeclaration(
  node: t.Node | null | undefined,
  opts?: Opts<t.ExportDefaultDeclaration> | null,
): node is t.ExportDefaultDeclaration {
  if (!node) return false;

  if (node.type !== "ExportDefaultDeclaration") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isExportNamedDeclaration(
  node: t.Node | null | undefined,
  opts?: Opts<t.ExportNamedDeclaration> | null,
): node is t.ExportNamedDeclaration {
  if (!node) return false;

  if (node.type !== "ExportNamedDeclaration") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isExportSpecifier(
  node: t.Node | null | undefined,
  opts?: Opts<t.ExportSpecifier> | null,
): node is t.ExportSpecifier {
  if (!node) return false;

  if (node.type !== "ExportSpecifier") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isForOfStatement(
  node: t.Node | null | undefined,
  opts?: Opts<t.ForOfStatement> | null,
): node is t.ForOfStatement {
  if (!node) return false;

  if (node.type !== "ForOfStatement") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isImportDeclaration(
  node: t.Node | null | undefined,
  opts?: Opts<t.ImportDeclaration> | null,
): node is t.ImportDeclaration {
  if (!node) return false;

  if (node.type !== "ImportDeclaration") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isImportDefaultSpecifier(
  node: t.Node | null | undefined,
  opts?: Opts<t.ImportDefaultSpecifier> | null,
): node is t.ImportDefaultSpecifier {
  if (!node) return false;

  if (node.type !== "ImportDefaultSpecifier") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isImportNamespaceSpecifier(
  node: t.Node | null | undefined,
  opts?: Opts<t.ImportNamespaceSpecifier> | null,
): node is t.ImportNamespaceSpecifier {
  if (!node) return false;

  if (node.type !== "ImportNamespaceSpecifier") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isImportSpecifier(
  node: t.Node | null | undefined,
  opts?: Opts<t.ImportSpecifier> | null,
): node is t.ImportSpecifier {
  if (!node) return false;

  if (node.type !== "ImportSpecifier") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isImportExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.ImportExpression> | null,
): node is t.ImportExpression {
  if (!node) return false;

  if (node.type !== "ImportExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isMetaProperty(
  node: t.Node | null | undefined,
  opts?: Opts<t.MetaProperty> | null,
): node is t.MetaProperty {
  if (!node) return false;

  if (node.type !== "MetaProperty") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isClassMethod(
  node: t.Node | null | undefined,
  opts?: Opts<t.ClassMethod> | null,
): node is t.ClassMethod {
  if (!node) return false;

  if (node.type !== "ClassMethod") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isObjectPattern(
  node: t.Node | null | undefined,
  opts?: Opts<t.ObjectPattern> | null,
): node is t.ObjectPattern {
  if (!node) return false;

  if (node.type !== "ObjectPattern") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isSpreadElement(
  node: t.Node | null | undefined,
  opts?: Opts<t.SpreadElement> | null,
): node is t.SpreadElement {
  if (!node) return false;

  if (node.type !== "SpreadElement") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isSuper(
  node: t.Node | null | undefined,
  opts?: Opts<t.Super> | null,
): node is t.Super {
  if (!node) return false;

  if (node.type !== "Super") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTaggedTemplateExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.TaggedTemplateExpression> | null,
): node is t.TaggedTemplateExpression {
  if (!node) return false;

  if (node.type !== "TaggedTemplateExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTemplateElement(
  node: t.Node | null | undefined,
  opts?: Opts<t.TemplateElement> | null,
): node is t.TemplateElement {
  if (!node) return false;

  if (node.type !== "TemplateElement") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTemplateLiteral(
  node: t.Node | null | undefined,
  opts?: Opts<t.TemplateLiteral> | null,
): node is t.TemplateLiteral {
  if (!node) return false;

  if (node.type !== "TemplateLiteral") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isYieldExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.YieldExpression> | null,
): node is t.YieldExpression {
  if (!node) return false;

  if (node.type !== "YieldExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isAwaitExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.AwaitExpression> | null,
): node is t.AwaitExpression {
  if (!node) return false;

  if (node.type !== "AwaitExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isImport(
  node: t.Node | null | undefined,
  opts?: Opts<t.Import> | null,
): node is t.Import {
  if (!node) return false;

  if (node.type !== "Import") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isBigIntLiteral(
  node: t.Node | null | undefined,
  opts?: Opts<t.BigIntLiteral> | null,
): node is t.BigIntLiteral {
  if (!node) return false;

  if (node.type !== "BigIntLiteral") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isExportNamespaceSpecifier(
  node: t.Node | null | undefined,
  opts?: Opts<t.ExportNamespaceSpecifier> | null,
): node is t.ExportNamespaceSpecifier {
  if (!node) return false;

  if (node.type !== "ExportNamespaceSpecifier") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isOptionalMemberExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.OptionalMemberExpression> | null,
): node is t.OptionalMemberExpression {
  if (!node) return false;

  if (node.type !== "OptionalMemberExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isOptionalCallExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.OptionalCallExpression> | null,
): node is t.OptionalCallExpression {
  if (!node) return false;

  if (node.type !== "OptionalCallExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isClassProperty(
  node: t.Node | null | undefined,
  opts?: Opts<t.ClassProperty> | null,
): node is t.ClassProperty {
  if (!node) return false;

  if (node.type !== "ClassProperty") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isClassAccessorProperty(
  node: t.Node | null | undefined,
  opts?: Opts<t.ClassAccessorProperty> | null,
): node is t.ClassAccessorProperty {
  if (!node) return false;

  if (node.type !== "ClassAccessorProperty") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isClassPrivateProperty(
  node: t.Node | null | undefined,
  opts?: Opts<t.ClassPrivateProperty> | null,
): node is t.ClassPrivateProperty {
  if (!node) return false;

  if (node.type !== "ClassPrivateProperty") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isClassPrivateMethod(
  node: t.Node | null | undefined,
  opts?: Opts<t.ClassPrivateMethod> | null,
): node is t.ClassPrivateMethod {
  if (!node) return false;

  if (node.type !== "ClassPrivateMethod") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isPrivateName(
  node: t.Node | null | undefined,
  opts?: Opts<t.PrivateName> | null,
): node is t.PrivateName {
  if (!node) return false;

  if (node.type !== "PrivateName") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isStaticBlock(
  node: t.Node | null | undefined,
  opts?: Opts<t.StaticBlock> | null,
): node is t.StaticBlock {
  if (!node) return false;

  if (node.type !== "StaticBlock") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isAnyTypeAnnotation(
  node: t.Node | null | undefined,
  opts?: Opts<t.AnyTypeAnnotation> | null,
): node is t.AnyTypeAnnotation {
  if (!node) return false;

  if (node.type !== "AnyTypeAnnotation") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isArrayTypeAnnotation(
  node: t.Node | null | undefined,
  opts?: Opts<t.ArrayTypeAnnotation> | null,
): node is t.ArrayTypeAnnotation {
  if (!node) return false;

  if (node.type !== "ArrayTypeAnnotation") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isBooleanTypeAnnotation(
  node: t.Node | null | undefined,
  opts?: Opts<t.BooleanTypeAnnotation> | null,
): node is t.BooleanTypeAnnotation {
  if (!node) return false;

  if (node.type !== "BooleanTypeAnnotation") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isBooleanLiteralTypeAnnotation(
  node: t.Node | null | undefined,
  opts?: Opts<t.BooleanLiteralTypeAnnotation> | null,
): node is t.BooleanLiteralTypeAnnotation {
  if (!node) return false;

  if (node.type !== "BooleanLiteralTypeAnnotation") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isNullLiteralTypeAnnotation(
  node: t.Node | null | undefined,
  opts?: Opts<t.NullLiteralTypeAnnotation> | null,
): node is t.NullLiteralTypeAnnotation {
  if (!node) return false;

  if (node.type !== "NullLiteralTypeAnnotation") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isClassImplements(
  node: t.Node | null | undefined,
  opts?: Opts<t.ClassImplements> | null,
): node is t.ClassImplements {
  if (!node) return false;

  if (node.type !== "ClassImplements") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isDeclareClass(
  node: t.Node | null | undefined,
  opts?: Opts<t.DeclareClass> | null,
): node is t.DeclareClass {
  if (!node) return false;

  if (node.type !== "DeclareClass") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isDeclareFunction(
  node: t.Node | null | undefined,
  opts?: Opts<t.DeclareFunction> | null,
): node is t.DeclareFunction {
  if (!node) return false;

  if (node.type !== "DeclareFunction") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isDeclareInterface(
  node: t.Node | null | undefined,
  opts?: Opts<t.DeclareInterface> | null,
): node is t.DeclareInterface {
  if (!node) return false;

  if (node.type !== "DeclareInterface") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isDeclareModule(
  node: t.Node | null | undefined,
  opts?: Opts<t.DeclareModule> | null,
): node is t.DeclareModule {
  if (!node) return false;

  if (node.type !== "DeclareModule") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isDeclareModuleExports(
  node: t.Node | null | undefined,
  opts?: Opts<t.DeclareModuleExports> | null,
): node is t.DeclareModuleExports {
  if (!node) return false;

  if (node.type !== "DeclareModuleExports") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isDeclareTypeAlias(
  node: t.Node | null | undefined,
  opts?: Opts<t.DeclareTypeAlias> | null,
): node is t.DeclareTypeAlias {
  if (!node) return false;

  if (node.type !== "DeclareTypeAlias") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isDeclareOpaqueType(
  node: t.Node | null | undefined,
  opts?: Opts<t.DeclareOpaqueType> | null,
): node is t.DeclareOpaqueType {
  if (!node) return false;

  if (node.type !== "DeclareOpaqueType") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isDeclareVariable(
  node: t.Node | null | undefined,
  opts?: Opts<t.DeclareVariable> | null,
): node is t.DeclareVariable {
  if (!node) return false;

  if (node.type !== "DeclareVariable") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isDeclareExportDeclaration(
  node: t.Node | null | undefined,
  opts?: Opts<t.DeclareExportDeclaration> | null,
): node is t.DeclareExportDeclaration {
  if (!node) return false;

  if (node.type !== "DeclareExportDeclaration") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isDeclareExportAllDeclaration(
  node: t.Node | null | undefined,
  opts?: Opts<t.DeclareExportAllDeclaration> | null,
): node is t.DeclareExportAllDeclaration {
  if (!node) return false;

  if (node.type !== "DeclareExportAllDeclaration") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isDeclaredPredicate(
  node: t.Node | null | undefined,
  opts?: Opts<t.DeclaredPredicate> | null,
): node is t.DeclaredPredicate {
  if (!node) return false;

  if (node.type !== "DeclaredPredicate") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isExistsTypeAnnotation(
  node: t.Node | null | undefined,
  opts?: Opts<t.ExistsTypeAnnotation> | null,
): node is t.ExistsTypeAnnotation {
  if (!node) return false;

  if (node.type !== "ExistsTypeAnnotation") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isFunctionTypeAnnotation(
  node: t.Node | null | undefined,
  opts?: Opts<t.FunctionTypeAnnotation> | null,
): node is t.FunctionTypeAnnotation {
  if (!node) return false;

  if (node.type !== "FunctionTypeAnnotation") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isFunctionTypeParam(
  node: t.Node | null | undefined,
  opts?: Opts<t.FunctionTypeParam> | null,
): node is t.FunctionTypeParam {
  if (!node) return false;

  if (node.type !== "FunctionTypeParam") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isGenericTypeAnnotation(
  node: t.Node | null | undefined,
  opts?: Opts<t.GenericTypeAnnotation> | null,
): node is t.GenericTypeAnnotation {
  if (!node) return false;

  if (node.type !== "GenericTypeAnnotation") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isInferredPredicate(
  node: t.Node | null | undefined,
  opts?: Opts<t.InferredPredicate> | null,
): node is t.InferredPredicate {
  if (!node) return false;

  if (node.type !== "InferredPredicate") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isInterfaceExtends(
  node: t.Node | null | undefined,
  opts?: Opts<t.InterfaceExtends> | null,
): node is t.InterfaceExtends {
  if (!node) return false;

  if (node.type !== "InterfaceExtends") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isInterfaceDeclaration(
  node: t.Node | null | undefined,
  opts?: Opts<t.InterfaceDeclaration> | null,
): node is t.InterfaceDeclaration {
  if (!node) return false;

  if (node.type !== "InterfaceDeclaration") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isInterfaceTypeAnnotation(
  node: t.Node | null | undefined,
  opts?: Opts<t.InterfaceTypeAnnotation> | null,
): node is t.InterfaceTypeAnnotation {
  if (!node) return false;

  if (node.type !== "InterfaceTypeAnnotation") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isIntersectionTypeAnnotation(
  node: t.Node | null | undefined,
  opts?: Opts<t.IntersectionTypeAnnotation> | null,
): node is t.IntersectionTypeAnnotation {
  if (!node) return false;

  if (node.type !== "IntersectionTypeAnnotation") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isMixedTypeAnnotation(
  node: t.Node | null | undefined,
  opts?: Opts<t.MixedTypeAnnotation> | null,
): node is t.MixedTypeAnnotation {
  if (!node) return false;

  if (node.type !== "MixedTypeAnnotation") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isEmptyTypeAnnotation(
  node: t.Node | null | undefined,
  opts?: Opts<t.EmptyTypeAnnotation> | null,
): node is t.EmptyTypeAnnotation {
  if (!node) return false;

  if (node.type !== "EmptyTypeAnnotation") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isNullableTypeAnnotation(
  node: t.Node | null | undefined,
  opts?: Opts<t.NullableTypeAnnotation> | null,
): node is t.NullableTypeAnnotation {
  if (!node) return false;

  if (node.type !== "NullableTypeAnnotation") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isNumberLiteralTypeAnnotation(
  node: t.Node | null | undefined,
  opts?: Opts<t.NumberLiteralTypeAnnotation> | null,
): node is t.NumberLiteralTypeAnnotation {
  if (!node) return false;

  if (node.type !== "NumberLiteralTypeAnnotation") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isNumberTypeAnnotation(
  node: t.Node | null | undefined,
  opts?: Opts<t.NumberTypeAnnotation> | null,
): node is t.NumberTypeAnnotation {
  if (!node) return false;

  if (node.type !== "NumberTypeAnnotation") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isObjectTypeAnnotation(
  node: t.Node | null | undefined,
  opts?: Opts<t.ObjectTypeAnnotation> | null,
): node is t.ObjectTypeAnnotation {
  if (!node) return false;

  if (node.type !== "ObjectTypeAnnotation") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isObjectTypeInternalSlot(
  node: t.Node | null | undefined,
  opts?: Opts<t.ObjectTypeInternalSlot> | null,
): node is t.ObjectTypeInternalSlot {
  if (!node) return false;

  if (node.type !== "ObjectTypeInternalSlot") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isObjectTypeCallProperty(
  node: t.Node | null | undefined,
  opts?: Opts<t.ObjectTypeCallProperty> | null,
): node is t.ObjectTypeCallProperty {
  if (!node) return false;

  if (node.type !== "ObjectTypeCallProperty") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isObjectTypeIndexer(
  node: t.Node | null | undefined,
  opts?: Opts<t.ObjectTypeIndexer> | null,
): node is t.ObjectTypeIndexer {
  if (!node) return false;

  if (node.type !== "ObjectTypeIndexer") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isObjectTypeProperty(
  node: t.Node | null | undefined,
  opts?: Opts<t.ObjectTypeProperty> | null,
): node is t.ObjectTypeProperty {
  if (!node) return false;

  if (node.type !== "ObjectTypeProperty") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isObjectTypeSpreadProperty(
  node: t.Node | null | undefined,
  opts?: Opts<t.ObjectTypeSpreadProperty> | null,
): node is t.ObjectTypeSpreadProperty {
  if (!node) return false;

  if (node.type !== "ObjectTypeSpreadProperty") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isOpaqueType(
  node: t.Node | null | undefined,
  opts?: Opts<t.OpaqueType> | null,
): node is t.OpaqueType {
  if (!node) return false;

  if (node.type !== "OpaqueType") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isQualifiedTypeIdentifier(
  node: t.Node | null | undefined,
  opts?: Opts<t.QualifiedTypeIdentifier> | null,
): node is t.QualifiedTypeIdentifier {
  if (!node) return false;

  if (node.type !== "QualifiedTypeIdentifier") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isStringLiteralTypeAnnotation(
  node: t.Node | null | undefined,
  opts?: Opts<t.StringLiteralTypeAnnotation> | null,
): node is t.StringLiteralTypeAnnotation {
  if (!node) return false;

  if (node.type !== "StringLiteralTypeAnnotation") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isStringTypeAnnotation(
  node: t.Node | null | undefined,
  opts?: Opts<t.StringTypeAnnotation> | null,
): node is t.StringTypeAnnotation {
  if (!node) return false;

  if (node.type !== "StringTypeAnnotation") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isSymbolTypeAnnotation(
  node: t.Node | null | undefined,
  opts?: Opts<t.SymbolTypeAnnotation> | null,
): node is t.SymbolTypeAnnotation {
  if (!node) return false;

  if (node.type !== "SymbolTypeAnnotation") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isThisTypeAnnotation(
  node: t.Node | null | undefined,
  opts?: Opts<t.ThisTypeAnnotation> | null,
): node is t.ThisTypeAnnotation {
  if (!node) return false;

  if (node.type !== "ThisTypeAnnotation") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTupleTypeAnnotation(
  node: t.Node | null | undefined,
  opts?: Opts<t.TupleTypeAnnotation> | null,
): node is t.TupleTypeAnnotation {
  if (!node) return false;

  if (node.type !== "TupleTypeAnnotation") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTypeofTypeAnnotation(
  node: t.Node | null | undefined,
  opts?: Opts<t.TypeofTypeAnnotation> | null,
): node is t.TypeofTypeAnnotation {
  if (!node) return false;

  if (node.type !== "TypeofTypeAnnotation") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTypeAlias(
  node: t.Node | null | undefined,
  opts?: Opts<t.TypeAlias> | null,
): node is t.TypeAlias {
  if (!node) return false;

  if (node.type !== "TypeAlias") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTypeAnnotation(
  node: t.Node | null | undefined,
  opts?: Opts<t.TypeAnnotation> | null,
): node is t.TypeAnnotation {
  if (!node) return false;

  if (node.type !== "TypeAnnotation") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTypeCastExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.TypeCastExpression> | null,
): node is t.TypeCastExpression {
  if (!node) return false;

  if (node.type !== "TypeCastExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTypeParameter(
  node: t.Node | null | undefined,
  opts?: Opts<t.TypeParameter> | null,
): node is t.TypeParameter {
  if (!node) return false;

  if (node.type !== "TypeParameter") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTypeParameterDeclaration(
  node: t.Node | null | undefined,
  opts?: Opts<t.TypeParameterDeclaration> | null,
): node is t.TypeParameterDeclaration {
  if (!node) return false;

  if (node.type !== "TypeParameterDeclaration") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTypeParameterInstantiation(
  node: t.Node | null | undefined,
  opts?: Opts<t.TypeParameterInstantiation> | null,
): node is t.TypeParameterInstantiation {
  if (!node) return false;

  if (node.type !== "TypeParameterInstantiation") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isUnionTypeAnnotation(
  node: t.Node | null | undefined,
  opts?: Opts<t.UnionTypeAnnotation> | null,
): node is t.UnionTypeAnnotation {
  if (!node) return false;

  if (node.type !== "UnionTypeAnnotation") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isVariance(
  node: t.Node | null | undefined,
  opts?: Opts<t.Variance> | null,
): node is t.Variance {
  if (!node) return false;

  if (node.type !== "Variance") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isVoidTypeAnnotation(
  node: t.Node | null | undefined,
  opts?: Opts<t.VoidTypeAnnotation> | null,
): node is t.VoidTypeAnnotation {
  if (!node) return false;

  if (node.type !== "VoidTypeAnnotation") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isEnumDeclaration(
  node: t.Node | null | undefined,
  opts?: Opts<t.EnumDeclaration> | null,
): node is t.EnumDeclaration {
  if (!node) return false;

  if (node.type !== "EnumDeclaration") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isEnumBooleanBody(
  node: t.Node | null | undefined,
  opts?: Opts<t.EnumBooleanBody> | null,
): node is t.EnumBooleanBody {
  if (!node) return false;

  if (node.type !== "EnumBooleanBody") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isEnumNumberBody(
  node: t.Node | null | undefined,
  opts?: Opts<t.EnumNumberBody> | null,
): node is t.EnumNumberBody {
  if (!node) return false;

  if (node.type !== "EnumNumberBody") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isEnumStringBody(
  node: t.Node | null | undefined,
  opts?: Opts<t.EnumStringBody> | null,
): node is t.EnumStringBody {
  if (!node) return false;

  if (node.type !== "EnumStringBody") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isEnumSymbolBody(
  node: t.Node | null | undefined,
  opts?: Opts<t.EnumSymbolBody> | null,
): node is t.EnumSymbolBody {
  if (!node) return false;

  if (node.type !== "EnumSymbolBody") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isEnumBooleanMember(
  node: t.Node | null | undefined,
  opts?: Opts<t.EnumBooleanMember> | null,
): node is t.EnumBooleanMember {
  if (!node) return false;

  if (node.type !== "EnumBooleanMember") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isEnumNumberMember(
  node: t.Node | null | undefined,
  opts?: Opts<t.EnumNumberMember> | null,
): node is t.EnumNumberMember {
  if (!node) return false;

  if (node.type !== "EnumNumberMember") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isEnumStringMember(
  node: t.Node | null | undefined,
  opts?: Opts<t.EnumStringMember> | null,
): node is t.EnumStringMember {
  if (!node) return false;

  if (node.type !== "EnumStringMember") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isEnumDefaultedMember(
  node: t.Node | null | undefined,
  opts?: Opts<t.EnumDefaultedMember> | null,
): node is t.EnumDefaultedMember {
  if (!node) return false;

  if (node.type !== "EnumDefaultedMember") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isIndexedAccessType(
  node: t.Node | null | undefined,
  opts?: Opts<t.IndexedAccessType> | null,
): node is t.IndexedAccessType {
  if (!node) return false;

  if (node.type !== "IndexedAccessType") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isOptionalIndexedAccessType(
  node: t.Node | null | undefined,
  opts?: Opts<t.OptionalIndexedAccessType> | null,
): node is t.OptionalIndexedAccessType {
  if (!node) return false;

  if (node.type !== "OptionalIndexedAccessType") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isJSXAttribute(
  node: t.Node | null | undefined,
  opts?: Opts<t.JSXAttribute> | null,
): node is t.JSXAttribute {
  if (!node) return false;

  if (node.type !== "JSXAttribute") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isJSXClosingElement(
  node: t.Node | null | undefined,
  opts?: Opts<t.JSXClosingElement> | null,
): node is t.JSXClosingElement {
  if (!node) return false;

  if (node.type !== "JSXClosingElement") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isJSXElement(
  node: t.Node | null | undefined,
  opts?: Opts<t.JSXElement> | null,
): node is t.JSXElement {
  if (!node) return false;

  if (node.type !== "JSXElement") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isJSXEmptyExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.JSXEmptyExpression> | null,
): node is t.JSXEmptyExpression {
  if (!node) return false;

  if (node.type !== "JSXEmptyExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isJSXExpressionContainer(
  node: t.Node | null | undefined,
  opts?: Opts<t.JSXExpressionContainer> | null,
): node is t.JSXExpressionContainer {
  if (!node) return false;

  if (node.type !== "JSXExpressionContainer") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isJSXSpreadChild(
  node: t.Node | null | undefined,
  opts?: Opts<t.JSXSpreadChild> | null,
): node is t.JSXSpreadChild {
  if (!node) return false;

  if (node.type !== "JSXSpreadChild") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isJSXIdentifier(
  node: t.Node | null | undefined,
  opts?: Opts<t.JSXIdentifier> | null,
): node is t.JSXIdentifier {
  if (!node) return false;

  if (node.type !== "JSXIdentifier") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isJSXMemberExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.JSXMemberExpression> | null,
): node is t.JSXMemberExpression {
  if (!node) return false;

  if (node.type !== "JSXMemberExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isJSXNamespacedName(
  node: t.Node | null | undefined,
  opts?: Opts<t.JSXNamespacedName> | null,
): node is t.JSXNamespacedName {
  if (!node) return false;

  if (node.type !== "JSXNamespacedName") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isJSXOpeningElement(
  node: t.Node | null | undefined,
  opts?: Opts<t.JSXOpeningElement> | null,
): node is t.JSXOpeningElement {
  if (!node) return false;

  if (node.type !== "JSXOpeningElement") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isJSXSpreadAttribute(
  node: t.Node | null | undefined,
  opts?: Opts<t.JSXSpreadAttribute> | null,
): node is t.JSXSpreadAttribute {
  if (!node) return false;

  if (node.type !== "JSXSpreadAttribute") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isJSXText(
  node: t.Node | null | undefined,
  opts?: Opts<t.JSXText> | null,
): node is t.JSXText {
  if (!node) return false;

  if (node.type !== "JSXText") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isJSXFragment(
  node: t.Node | null | undefined,
  opts?: Opts<t.JSXFragment> | null,
): node is t.JSXFragment {
  if (!node) return false;

  if (node.type !== "JSXFragment") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isJSXOpeningFragment(
  node: t.Node | null | undefined,
  opts?: Opts<t.JSXOpeningFragment> | null,
): node is t.JSXOpeningFragment {
  if (!node) return false;

  if (node.type !== "JSXOpeningFragment") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isJSXClosingFragment(
  node: t.Node | null | undefined,
  opts?: Opts<t.JSXClosingFragment> | null,
): node is t.JSXClosingFragment {
  if (!node) return false;

  if (node.type !== "JSXClosingFragment") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isNoop(
  node: t.Node | null | undefined,
  opts?: Opts<t.Noop> | null,
): node is t.Noop {
  if (!node) return false;

  if (node.type !== "Noop") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isPlaceholder(
  node: t.Node | null | undefined,
  opts?: Opts<t.Placeholder> | null,
): node is t.Placeholder {
  if (!node) return false;

  if (node.type !== "Placeholder") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isV8IntrinsicIdentifier(
  node: t.Node | null | undefined,
  opts?: Opts<t.V8IntrinsicIdentifier> | null,
): node is t.V8IntrinsicIdentifier {
  if (!node) return false;

  if (node.type !== "V8IntrinsicIdentifier") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isArgumentPlaceholder(
  node: t.Node | null | undefined,
  opts?: Opts<t.ArgumentPlaceholder> | null,
): node is t.ArgumentPlaceholder {
  if (!node) return false;

  if (node.type !== "ArgumentPlaceholder") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isBindExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.BindExpression> | null,
): node is t.BindExpression {
  if (!node) return false;

  if (node.type !== "BindExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isImportAttribute(
  node: t.Node | null | undefined,
  opts?: Opts<t.ImportAttribute> | null,
): node is t.ImportAttribute {
  if (!node) return false;

  if (node.type !== "ImportAttribute") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isDecorator(
  node: t.Node | null | undefined,
  opts?: Opts<t.Decorator> | null,
): node is t.Decorator {
  if (!node) return false;

  if (node.type !== "Decorator") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isDoExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.DoExpression> | null,
): node is t.DoExpression {
  if (!node) return false;

  if (node.type !== "DoExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isExportDefaultSpecifier(
  node: t.Node | null | undefined,
  opts?: Opts<t.ExportDefaultSpecifier> | null,
): node is t.ExportDefaultSpecifier {
  if (!node) return false;

  if (node.type !== "ExportDefaultSpecifier") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isRecordExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.RecordExpression> | null,
): node is t.RecordExpression {
  if (!node) return false;

  if (node.type !== "RecordExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTupleExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.TupleExpression> | null,
): node is t.TupleExpression {
  if (!node) return false;

  if (node.type !== "TupleExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isDecimalLiteral(
  node: t.Node | null | undefined,
  opts?: Opts<t.DecimalLiteral> | null,
): node is t.DecimalLiteral {
  if (!node) return false;

  if (node.type !== "DecimalLiteral") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isModuleExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.ModuleExpression> | null,
): node is t.ModuleExpression {
  if (!node) return false;

  if (node.type !== "ModuleExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTopicReference(
  node: t.Node | null | undefined,
  opts?: Opts<t.TopicReference> | null,
): node is t.TopicReference {
  if (!node) return false;

  if (node.type !== "TopicReference") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isPipelineTopicExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.PipelineTopicExpression> | null,
): node is t.PipelineTopicExpression {
  if (!node) return false;

  if (node.type !== "PipelineTopicExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isPipelineBareFunction(
  node: t.Node | null | undefined,
  opts?: Opts<t.PipelineBareFunction> | null,
): node is t.PipelineBareFunction {
  if (!node) return false;

  if (node.type !== "PipelineBareFunction") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isPipelinePrimaryTopicReference(
  node: t.Node | null | undefined,
  opts?: Opts<t.PipelinePrimaryTopicReference> | null,
): node is t.PipelinePrimaryTopicReference {
  if (!node) return false;

  if (node.type !== "PipelinePrimaryTopicReference") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSParameterProperty(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSParameterProperty> | null,
): node is t.TSParameterProperty {
  if (!node) return false;

  if (node.type !== "TSParameterProperty") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSDeclareFunction(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSDeclareFunction> | null,
): node is t.TSDeclareFunction {
  if (!node) return false;

  if (node.type !== "TSDeclareFunction") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSDeclareMethod(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSDeclareMethod> | null,
): node is t.TSDeclareMethod {
  if (!node) return false;

  if (node.type !== "TSDeclareMethod") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSQualifiedName(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSQualifiedName> | null,
): node is t.TSQualifiedName {
  if (!node) return false;

  if (node.type !== "TSQualifiedName") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSCallSignatureDeclaration(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSCallSignatureDeclaration> | null,
): node is t.TSCallSignatureDeclaration {
  if (!node) return false;

  if (node.type !== "TSCallSignatureDeclaration") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSConstructSignatureDeclaration(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSConstructSignatureDeclaration> | null,
): node is t.TSConstructSignatureDeclaration {
  if (!node) return false;

  if (node.type !== "TSConstructSignatureDeclaration") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSPropertySignature(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSPropertySignature> | null,
): node is t.TSPropertySignature {
  if (!node) return false;

  if (node.type !== "TSPropertySignature") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSMethodSignature(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSMethodSignature> | null,
): node is t.TSMethodSignature {
  if (!node) return false;

  if (node.type !== "TSMethodSignature") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSIndexSignature(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSIndexSignature> | null,
): node is t.TSIndexSignature {
  if (!node) return false;

  if (node.type !== "TSIndexSignature") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSAnyKeyword(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSAnyKeyword> | null,
): node is t.TSAnyKeyword {
  if (!node) return false;

  if (node.type !== "TSAnyKeyword") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSBooleanKeyword(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSBooleanKeyword> | null,
): node is t.TSBooleanKeyword {
  if (!node) return false;

  if (node.type !== "TSBooleanKeyword") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSBigIntKeyword(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSBigIntKeyword> | null,
): node is t.TSBigIntKeyword {
  if (!node) return false;

  if (node.type !== "TSBigIntKeyword") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSIntrinsicKeyword(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSIntrinsicKeyword> | null,
): node is t.TSIntrinsicKeyword {
  if (!node) return false;

  if (node.type !== "TSIntrinsicKeyword") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSNeverKeyword(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSNeverKeyword> | null,
): node is t.TSNeverKeyword {
  if (!node) return false;

  if (node.type !== "TSNeverKeyword") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSNullKeyword(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSNullKeyword> | null,
): node is t.TSNullKeyword {
  if (!node) return false;

  if (node.type !== "TSNullKeyword") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSNumberKeyword(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSNumberKeyword> | null,
): node is t.TSNumberKeyword {
  if (!node) return false;

  if (node.type !== "TSNumberKeyword") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSObjectKeyword(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSObjectKeyword> | null,
): node is t.TSObjectKeyword {
  if (!node) return false;

  if (node.type !== "TSObjectKeyword") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSStringKeyword(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSStringKeyword> | null,
): node is t.TSStringKeyword {
  if (!node) return false;

  if (node.type !== "TSStringKeyword") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSSymbolKeyword(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSSymbolKeyword> | null,
): node is t.TSSymbolKeyword {
  if (!node) return false;

  if (node.type !== "TSSymbolKeyword") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSUndefinedKeyword(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSUndefinedKeyword> | null,
): node is t.TSUndefinedKeyword {
  if (!node) return false;

  if (node.type !== "TSUndefinedKeyword") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSUnknownKeyword(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSUnknownKeyword> | null,
): node is t.TSUnknownKeyword {
  if (!node) return false;

  if (node.type !== "TSUnknownKeyword") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSVoidKeyword(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSVoidKeyword> | null,
): node is t.TSVoidKeyword {
  if (!node) return false;

  if (node.type !== "TSVoidKeyword") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSThisType(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSThisType> | null,
): node is t.TSThisType {
  if (!node) return false;

  if (node.type !== "TSThisType") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSFunctionType(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSFunctionType> | null,
): node is t.TSFunctionType {
  if (!node) return false;

  if (node.type !== "TSFunctionType") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSConstructorType(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSConstructorType> | null,
): node is t.TSConstructorType {
  if (!node) return false;

  if (node.type !== "TSConstructorType") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSTypeReference(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSTypeReference> | null,
): node is t.TSTypeReference {
  if (!node) return false;

  if (node.type !== "TSTypeReference") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSTypePredicate(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSTypePredicate> | null,
): node is t.TSTypePredicate {
  if (!node) return false;

  if (node.type !== "TSTypePredicate") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSTypeQuery(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSTypeQuery> | null,
): node is t.TSTypeQuery {
  if (!node) return false;

  if (node.type !== "TSTypeQuery") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSTypeLiteral(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSTypeLiteral> | null,
): node is t.TSTypeLiteral {
  if (!node) return false;

  if (node.type !== "TSTypeLiteral") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSArrayType(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSArrayType> | null,
): node is t.TSArrayType {
  if (!node) return false;

  if (node.type !== "TSArrayType") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSTupleType(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSTupleType> | null,
): node is t.TSTupleType {
  if (!node) return false;

  if (node.type !== "TSTupleType") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSOptionalType(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSOptionalType> | null,
): node is t.TSOptionalType {
  if (!node) return false;

  if (node.type !== "TSOptionalType") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSRestType(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSRestType> | null,
): node is t.TSRestType {
  if (!node) return false;

  if (node.type !== "TSRestType") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSNamedTupleMember(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSNamedTupleMember> | null,
): node is t.TSNamedTupleMember {
  if (!node) return false;

  if (node.type !== "TSNamedTupleMember") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSUnionType(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSUnionType> | null,
): node is t.TSUnionType {
  if (!node) return false;

  if (node.type !== "TSUnionType") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSIntersectionType(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSIntersectionType> | null,
): node is t.TSIntersectionType {
  if (!node) return false;

  if (node.type !== "TSIntersectionType") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSConditionalType(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSConditionalType> | null,
): node is t.TSConditionalType {
  if (!node) return false;

  if (node.type !== "TSConditionalType") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSInferType(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSInferType> | null,
): node is t.TSInferType {
  if (!node) return false;

  if (node.type !== "TSInferType") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSParenthesizedType(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSParenthesizedType> | null,
): node is t.TSParenthesizedType {
  if (!node) return false;

  if (node.type !== "TSParenthesizedType") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSTypeOperator(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSTypeOperator> | null,
): node is t.TSTypeOperator {
  if (!node) return false;

  if (node.type !== "TSTypeOperator") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSIndexedAccessType(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSIndexedAccessType> | null,
): node is t.TSIndexedAccessType {
  if (!node) return false;

  if (node.type !== "TSIndexedAccessType") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSMappedType(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSMappedType> | null,
): node is t.TSMappedType {
  if (!node) return false;

  if (node.type !== "TSMappedType") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSLiteralType(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSLiteralType> | null,
): node is t.TSLiteralType {
  if (!node) return false;

  if (node.type !== "TSLiteralType") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSExpressionWithTypeArguments(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSExpressionWithTypeArguments> | null,
): node is t.TSExpressionWithTypeArguments {
  if (!node) return false;

  if (node.type !== "TSExpressionWithTypeArguments") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSInterfaceDeclaration(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSInterfaceDeclaration> | null,
): node is t.TSInterfaceDeclaration {
  if (!node) return false;

  if (node.type !== "TSInterfaceDeclaration") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSInterfaceBody(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSInterfaceBody> | null,
): node is t.TSInterfaceBody {
  if (!node) return false;

  if (node.type !== "TSInterfaceBody") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSTypeAliasDeclaration(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSTypeAliasDeclaration> | null,
): node is t.TSTypeAliasDeclaration {
  if (!node) return false;

  if (node.type !== "TSTypeAliasDeclaration") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSInstantiationExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSInstantiationExpression> | null,
): node is t.TSInstantiationExpression {
  if (!node) return false;

  if (node.type !== "TSInstantiationExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSAsExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSAsExpression> | null,
): node is t.TSAsExpression {
  if (!node) return false;

  if (node.type !== "TSAsExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSSatisfiesExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSSatisfiesExpression> | null,
): node is t.TSSatisfiesExpression {
  if (!node) return false;

  if (node.type !== "TSSatisfiesExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSTypeAssertion(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSTypeAssertion> | null,
): node is t.TSTypeAssertion {
  if (!node) return false;

  if (node.type !== "TSTypeAssertion") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSEnumBody(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSEnumBody> | null,
): node is t.TSEnumBody {
  if (!node) return false;

  if (node.type !== "TSEnumBody") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSEnumDeclaration(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSEnumDeclaration> | null,
): node is t.TSEnumDeclaration {
  if (!node) return false;

  if (node.type !== "TSEnumDeclaration") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSEnumMember(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSEnumMember> | null,
): node is t.TSEnumMember {
  if (!node) return false;

  if (node.type !== "TSEnumMember") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSModuleDeclaration(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSModuleDeclaration> | null,
): node is t.TSModuleDeclaration {
  if (!node) return false;

  if (node.type !== "TSModuleDeclaration") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSModuleBlock(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSModuleBlock> | null,
): node is t.TSModuleBlock {
  if (!node) return false;

  if (node.type !== "TSModuleBlock") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSImportType(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSImportType> | null,
): node is t.TSImportType {
  if (!node) return false;

  if (node.type !== "TSImportType") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSImportEqualsDeclaration(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSImportEqualsDeclaration> | null,
): node is t.TSImportEqualsDeclaration {
  if (!node) return false;

  if (node.type !== "TSImportEqualsDeclaration") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSExternalModuleReference(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSExternalModuleReference> | null,
): node is t.TSExternalModuleReference {
  if (!node) return false;

  if (node.type !== "TSExternalModuleReference") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSNonNullExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSNonNullExpression> | null,
): node is t.TSNonNullExpression {
  if (!node) return false;

  if (node.type !== "TSNonNullExpression") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSExportAssignment(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSExportAssignment> | null,
): node is t.TSExportAssignment {
  if (!node) return false;

  if (node.type !== "TSExportAssignment") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSNamespaceExportDeclaration(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSNamespaceExportDeclaration> | null,
): node is t.TSNamespaceExportDeclaration {
  if (!node) return false;

  if (node.type !== "TSNamespaceExportDeclaration") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSTypeAnnotation(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSTypeAnnotation> | null,
): node is t.TSTypeAnnotation {
  if (!node) return false;

  if (node.type !== "TSTypeAnnotation") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSTypeParameterInstantiation(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSTypeParameterInstantiation> | null,
): node is t.TSTypeParameterInstantiation {
  if (!node) return false;

  if (node.type !== "TSTypeParameterInstantiation") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSTypeParameterDeclaration(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSTypeParameterDeclaration> | null,
): node is t.TSTypeParameterDeclaration {
  if (!node) return false;

  if (node.type !== "TSTypeParameterDeclaration") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isTSTypeParameter(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSTypeParameter> | null,
): node is t.TSTypeParameter {
  if (!node) return false;

  if (node.type !== "TSTypeParameter") return false;

  return opts == null || shallowEqual(node, opts);
}
export function isStandardized(
  node: t.Node | null | undefined,
  opts?: Opts<t.Standardized> | null,
): node is t.Standardized {
  if (!node) return false;

  switch (node.type) {
    case "ArrayExpression":
    case "AssignmentExpression":
    case "BinaryExpression":
    case "InterpreterDirective":
    case "Directive":
    case "DirectiveLiteral":
    case "BlockStatement":
    case "BreakStatement":
    case "CallExpression":
    case "CatchClause":
    case "ConditionalExpression":
    case "ContinueStatement":
    case "DebuggerStatement":
    case "DoWhileStatement":
    case "EmptyStatement":
    case "ExpressionStatement":
    case "File":
    case "ForInStatement":
    case "ForStatement":
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "Identifier":
    case "IfStatement":
    case "LabeledStatement":
    case "StringLiteral":
    case "NumericLiteral":
    case "NullLiteral":
    case "BooleanLiteral":
    case "RegExpLiteral":
    case "LogicalExpression":
    case "MemberExpression":
    case "NewExpression":
    case "Program":
    case "ObjectExpression":
    case "ObjectMethod":
    case "ObjectProperty":
    case "RestElement":
    case "ReturnStatement":
    case "SequenceExpression":
    case "ParenthesizedExpression":
    case "SwitchCase":
    case "SwitchStatement":
    case "ThisExpression":
    case "ThrowStatement":
    case "TryStatement":
    case "UnaryExpression":
    case "UpdateExpression":
    case "VariableDeclaration":
    case "VariableDeclarator":
    case "WhileStatement":
    case "WithStatement":
    case "AssignmentPattern":
    case "ArrayPattern":
    case "ArrowFunctionExpression":
    case "ClassBody":
    case "ClassExpression":
    case "ClassDeclaration":
    case "ExportAllDeclaration":
    case "ExportDefaultDeclaration":
    case "ExportNamedDeclaration":
    case "ExportSpecifier":
    case "ForOfStatement":
    case "ImportDeclaration":
    case "ImportDefaultSpecifier":
    case "ImportNamespaceSpecifier":
    case "ImportSpecifier":
    case "ImportExpression":
    case "MetaProperty":
    case "ClassMethod":
    case "ObjectPattern":
    case "SpreadElement":
    case "Super":
    case "TaggedTemplateExpression":
    case "TemplateElement":
    case "TemplateLiteral":
    case "YieldExpression":
    case "AwaitExpression":
    case "Import":
    case "BigIntLiteral":
    case "ExportNamespaceSpecifier":
    case "OptionalMemberExpression":
    case "OptionalCallExpression":
    case "ClassProperty":
    case "ClassAccessorProperty":
    case "ClassPrivateProperty":
    case "ClassPrivateMethod":
    case "PrivateName":
    case "StaticBlock":
      break;
    case "Placeholder":
      switch (node.expectedNode) {
        case "Identifier":
        case "StringLiteral":
        case "BlockStatement":
        case "ClassBody":
          break;
        default:
          return false;
      }
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isExpression(
  node: t.Node | null | undefined,
  opts?: Opts<t.Expression> | null,
): node is t.Expression {
  if (!node) return false;

  switch (node.type) {
    case "ArrayExpression":
    case "AssignmentExpression":
    case "BinaryExpression":
    case "CallExpression":
    case "ConditionalExpression":
    case "FunctionExpression":
    case "Identifier":
    case "StringLiteral":
    case "NumericLiteral":
    case "NullLiteral":
    case "BooleanLiteral":
    case "RegExpLiteral":
    case "LogicalExpression":
    case "MemberExpression":
    case "NewExpression":
    case "ObjectExpression":
    case "SequenceExpression":
    case "ParenthesizedExpression":
    case "ThisExpression":
    case "UnaryExpression":
    case "UpdateExpression":
    case "ArrowFunctionExpression":
    case "ClassExpression":
    case "ImportExpression":
    case "MetaProperty":
    case "Super":
    case "TaggedTemplateExpression":
    case "TemplateLiteral":
    case "YieldExpression":
    case "AwaitExpression":
    case "Import":
    case "BigIntLiteral":
    case "OptionalMemberExpression":
    case "OptionalCallExpression":
    case "TypeCastExpression":
    case "JSXElement":
    case "JSXFragment":
    case "BindExpression":
    case "DoExpression":
    case "RecordExpression":
    case "TupleExpression":
    case "DecimalLiteral":
    case "ModuleExpression":
    case "TopicReference":
    case "PipelineTopicExpression":
    case "PipelineBareFunction":
    case "PipelinePrimaryTopicReference":
    case "TSInstantiationExpression":
    case "TSAsExpression":
    case "TSSatisfiesExpression":
    case "TSTypeAssertion":
    case "TSNonNullExpression":
      break;
    case "Placeholder":
      switch (node.expectedNode) {
        case "Expression":
        case "Identifier":
        case "StringLiteral":
          break;
        default:
          return false;
      }
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isBinary(
  node: t.Node | null | undefined,
  opts?: Opts<t.Binary> | null,
): node is t.Binary {
  if (!node) return false;

  switch (node.type) {
    case "BinaryExpression":
    case "LogicalExpression":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isScopable(
  node: t.Node | null | undefined,
  opts?: Opts<t.Scopable> | null,
): node is t.Scopable {
  if (!node) return false;

  switch (node.type) {
    case "BlockStatement":
    case "CatchClause":
    case "DoWhileStatement":
    case "ForInStatement":
    case "ForStatement":
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "Program":
    case "ObjectMethod":
    case "SwitchStatement":
    case "WhileStatement":
    case "ArrowFunctionExpression":
    case "ClassExpression":
    case "ClassDeclaration":
    case "ForOfStatement":
    case "ClassMethod":
    case "ClassPrivateMethod":
    case "StaticBlock":
    case "TSModuleBlock":
      break;
    case "Placeholder":
      if (node.expectedNode === "BlockStatement") break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isBlockParent(
  node: t.Node | null | undefined,
  opts?: Opts<t.BlockParent> | null,
): node is t.BlockParent {
  if (!node) return false;

  switch (node.type) {
    case "BlockStatement":
    case "CatchClause":
    case "DoWhileStatement":
    case "ForInStatement":
    case "ForStatement":
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "Program":
    case "ObjectMethod":
    case "SwitchStatement":
    case "WhileStatement":
    case "ArrowFunctionExpression":
    case "ForOfStatement":
    case "ClassMethod":
    case "ClassPrivateMethod":
    case "StaticBlock":
    case "TSModuleBlock":
      break;
    case "Placeholder":
      if (node.expectedNode === "BlockStatement") break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isBlock(
  node: t.Node | null | undefined,
  opts?: Opts<t.Block> | null,
): node is t.Block {
  if (!node) return false;

  switch (node.type) {
    case "BlockStatement":
    case "Program":
    case "TSModuleBlock":
      break;
    case "Placeholder":
      if (node.expectedNode === "BlockStatement") break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isStatement(
  node: t.Node | null | undefined,
  opts?: Opts<t.Statement> | null,
): node is t.Statement {
  if (!node) return false;

  switch (node.type) {
    case "BlockStatement":
    case "BreakStatement":
    case "ContinueStatement":
    case "DebuggerStatement":
    case "DoWhileStatement":
    case "EmptyStatement":
    case "ExpressionStatement":
    case "ForInStatement":
    case "ForStatement":
    case "FunctionDeclaration":
    case "IfStatement":
    case "LabeledStatement":
    case "ReturnStatement":
    case "SwitchStatement":
    case "ThrowStatement":
    case "TryStatement":
    case "VariableDeclaration":
    case "WhileStatement":
    case "WithStatement":
    case "ClassDeclaration":
    case "ExportAllDeclaration":
    case "ExportDefaultDeclaration":
    case "ExportNamedDeclaration":
    case "ForOfStatement":
    case "ImportDeclaration":
    case "DeclareClass":
    case "DeclareFunction":
    case "DeclareInterface":
    case "DeclareModule":
    case "DeclareModuleExports":
    case "DeclareTypeAlias":
    case "DeclareOpaqueType":
    case "DeclareVariable":
    case "DeclareExportDeclaration":
    case "DeclareExportAllDeclaration":
    case "InterfaceDeclaration":
    case "OpaqueType":
    case "TypeAlias":
    case "EnumDeclaration":
    case "TSDeclareFunction":
    case "TSInterfaceDeclaration":
    case "TSTypeAliasDeclaration":
    case "TSEnumDeclaration":
    case "TSModuleDeclaration":
    case "TSImportEqualsDeclaration":
    case "TSExportAssignment":
    case "TSNamespaceExportDeclaration":
      break;
    case "Placeholder":
      switch (node.expectedNode) {
        case "Statement":
        case "Declaration":
        case "BlockStatement":
          break;
        default:
          return false;
      }
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isTerminatorless(
  node: t.Node | null | undefined,
  opts?: Opts<t.Terminatorless> | null,
): node is t.Terminatorless {
  if (!node) return false;

  switch (node.type) {
    case "BreakStatement":
    case "ContinueStatement":
    case "ReturnStatement":
    case "ThrowStatement":
    case "YieldExpression":
    case "AwaitExpression":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isCompletionStatement(
  node: t.Node | null | undefined,
  opts?: Opts<t.CompletionStatement> | null,
): node is t.CompletionStatement {
  if (!node) return false;

  switch (node.type) {
    case "BreakStatement":
    case "ContinueStatement":
    case "ReturnStatement":
    case "ThrowStatement":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isConditional(
  node: t.Node | null | undefined,
  opts?: Opts<t.Conditional> | null,
): node is t.Conditional {
  if (!node) return false;

  switch (node.type) {
    case "ConditionalExpression":
    case "IfStatement":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isLoop(
  node: t.Node | null | undefined,
  opts?: Opts<t.Loop> | null,
): node is t.Loop {
  if (!node) return false;

  switch (node.type) {
    case "DoWhileStatement":
    case "ForInStatement":
    case "ForStatement":
    case "WhileStatement":
    case "ForOfStatement":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isWhile(
  node: t.Node | null | undefined,
  opts?: Opts<t.While> | null,
): node is t.While {
  if (!node) return false;

  switch (node.type) {
    case "DoWhileStatement":
    case "WhileStatement":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isExpressionWrapper(
  node: t.Node | null | undefined,
  opts?: Opts<t.ExpressionWrapper> | null,
): node is t.ExpressionWrapper {
  if (!node) return false;

  switch (node.type) {
    case "ExpressionStatement":
    case "ParenthesizedExpression":
    case "TypeCastExpression":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isFor(
  node: t.Node | null | undefined,
  opts?: Opts<t.For> | null,
): node is t.For {
  if (!node) return false;

  switch (node.type) {
    case "ForInStatement":
    case "ForStatement":
    case "ForOfStatement":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isForXStatement(
  node: t.Node | null | undefined,
  opts?: Opts<t.ForXStatement> | null,
): node is t.ForXStatement {
  if (!node) return false;

  switch (node.type) {
    case "ForInStatement":
    case "ForOfStatement":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isFunction(
  node: t.Node | null | undefined,
  opts?: Opts<t.Function> | null,
): node is t.Function {
  if (!node) return false;

  switch (node.type) {
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "ObjectMethod":
    case "ArrowFunctionExpression":
    case "ClassMethod":
    case "ClassPrivateMethod":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isFunctionParent(
  node: t.Node | null | undefined,
  opts?: Opts<t.FunctionParent> | null,
): node is t.FunctionParent {
  if (!node) return false;

  switch (node.type) {
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "ObjectMethod":
    case "ArrowFunctionExpression":
    case "ClassMethod":
    case "ClassPrivateMethod":
    case "StaticBlock":
    case "TSModuleBlock":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isPureish(
  node: t.Node | null | undefined,
  opts?: Opts<t.Pureish> | null,
): node is t.Pureish {
  if (!node) return false;

  switch (node.type) {
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "StringLiteral":
    case "NumericLiteral":
    case "NullLiteral":
    case "BooleanLiteral":
    case "RegExpLiteral":
    case "ArrowFunctionExpression":
    case "BigIntLiteral":
    case "DecimalLiteral":
      break;
    case "Placeholder":
      if (node.expectedNode === "StringLiteral") break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isDeclaration(
  node: t.Node | null | undefined,
  opts?: Opts<t.Declaration> | null,
): node is t.Declaration {
  if (!node) return false;

  switch (node.type) {
    case "FunctionDeclaration":
    case "VariableDeclaration":
    case "ClassDeclaration":
    case "ExportAllDeclaration":
    case "ExportDefaultDeclaration":
    case "ExportNamedDeclaration":
    case "ImportDeclaration":
    case "DeclareClass":
    case "DeclareFunction":
    case "DeclareInterface":
    case "DeclareModule":
    case "DeclareModuleExports":
    case "DeclareTypeAlias":
    case "DeclareOpaqueType":
    case "DeclareVariable":
    case "DeclareExportDeclaration":
    case "DeclareExportAllDeclaration":
    case "InterfaceDeclaration":
    case "OpaqueType":
    case "TypeAlias":
    case "EnumDeclaration":
    case "TSDeclareFunction":
    case "TSInterfaceDeclaration":
    case "TSTypeAliasDeclaration":
    case "TSEnumDeclaration":
    case "TSModuleDeclaration":
      break;
    case "Placeholder":
      if (node.expectedNode === "Declaration") break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isPatternLike(
  node: t.Node | null | undefined,
  opts?: Opts<t.PatternLike> | null,
): node is t.PatternLike {
  if (!node) return false;

  switch (node.type) {
    case "Identifier":
    case "RestElement":
    case "AssignmentPattern":
    case "ArrayPattern":
    case "ObjectPattern":
    case "TSAsExpression":
    case "TSSatisfiesExpression":
    case "TSTypeAssertion":
    case "TSNonNullExpression":
      break;
    case "Placeholder":
      switch (node.expectedNode) {
        case "Pattern":
        case "Identifier":
          break;
        default:
          return false;
      }
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isLVal(
  node: t.Node | null | undefined,
  opts?: Opts<t.LVal> | null,
): node is t.LVal {
  if (!node) return false;

  switch (node.type) {
    case "Identifier":
    case "MemberExpression":
    case "RestElement":
    case "AssignmentPattern":
    case "ArrayPattern":
    case "ObjectPattern":
    case "TSParameterProperty":
    case "TSAsExpression":
    case "TSSatisfiesExpression":
    case "TSTypeAssertion":
    case "TSNonNullExpression":
      break;
    case "Placeholder":
      switch (node.expectedNode) {
        case "Pattern":
        case "Identifier":
          break;
        default:
          return false;
      }
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isTSEntityName(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSEntityName> | null,
): node is t.TSEntityName {
  if (!node) return false;

  switch (node.type) {
    case "Identifier":
    case "TSQualifiedName":
      break;
    case "Placeholder":
      if (node.expectedNode === "Identifier") break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isLiteral(
  node: t.Node | null | undefined,
  opts?: Opts<t.Literal> | null,
): node is t.Literal {
  if (!node) return false;

  switch (node.type) {
    case "StringLiteral":
    case "NumericLiteral":
    case "NullLiteral":
    case "BooleanLiteral":
    case "RegExpLiteral":
    case "TemplateLiteral":
    case "BigIntLiteral":
    case "DecimalLiteral":
      break;
    case "Placeholder":
      if (node.expectedNode === "StringLiteral") break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isImmutable(
  node: t.Node | null | undefined,
  opts?: Opts<t.Immutable> | null,
): node is t.Immutable {
  if (!node) return false;

  switch (node.type) {
    case "StringLiteral":
    case "NumericLiteral":
    case "NullLiteral":
    case "BooleanLiteral":
    case "BigIntLiteral":
    case "JSXAttribute":
    case "JSXClosingElement":
    case "JSXElement":
    case "JSXExpressionContainer":
    case "JSXSpreadChild":
    case "JSXOpeningElement":
    case "JSXText":
    case "JSXFragment":
    case "JSXOpeningFragment":
    case "JSXClosingFragment":
    case "DecimalLiteral":
      break;
    case "Placeholder":
      if (node.expectedNode === "StringLiteral") break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isUserWhitespacable(
  node: t.Node | null | undefined,
  opts?: Opts<t.UserWhitespacable> | null,
): node is t.UserWhitespacable {
  if (!node) return false;

  switch (node.type) {
    case "ObjectMethod":
    case "ObjectProperty":
    case "ObjectTypeInternalSlot":
    case "ObjectTypeCallProperty":
    case "ObjectTypeIndexer":
    case "ObjectTypeProperty":
    case "ObjectTypeSpreadProperty":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isMethod(
  node: t.Node | null | undefined,
  opts?: Opts<t.Method> | null,
): node is t.Method {
  if (!node) return false;

  switch (node.type) {
    case "ObjectMethod":
    case "ClassMethod":
    case "ClassPrivateMethod":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isObjectMember(
  node: t.Node | null | undefined,
  opts?: Opts<t.ObjectMember> | null,
): node is t.ObjectMember {
  if (!node) return false;

  switch (node.type) {
    case "ObjectMethod":
    case "ObjectProperty":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isProperty(
  node: t.Node | null | undefined,
  opts?: Opts<t.Property> | null,
): node is t.Property {
  if (!node) return false;

  switch (node.type) {
    case "ObjectProperty":
    case "ClassProperty":
    case "ClassAccessorProperty":
    case "ClassPrivateProperty":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isUnaryLike(
  node: t.Node | null | undefined,
  opts?: Opts<t.UnaryLike> | null,
): node is t.UnaryLike {
  if (!node) return false;

  switch (node.type) {
    case "UnaryExpression":
    case "SpreadElement":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isPattern(
  node: t.Node | null | undefined,
  opts?: Opts<t.Pattern> | null,
): node is t.Pattern {
  if (!node) return false;

  switch (node.type) {
    case "AssignmentPattern":
    case "ArrayPattern":
    case "ObjectPattern":
      break;
    case "Placeholder":
      if (node.expectedNode === "Pattern") break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isClass(
  node: t.Node | null | undefined,
  opts?: Opts<t.Class> | null,
): node is t.Class {
  if (!node) return false;

  switch (node.type) {
    case "ClassExpression":
    case "ClassDeclaration":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isImportOrExportDeclaration(
  node: t.Node | null | undefined,
  opts?: Opts<t.ImportOrExportDeclaration> | null,
): node is t.ImportOrExportDeclaration {
  if (!node) return false;

  switch (node.type) {
    case "ExportAllDeclaration":
    case "ExportDefaultDeclaration":
    case "ExportNamedDeclaration":
    case "ImportDeclaration":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isExportDeclaration(
  node: t.Node | null | undefined,
  opts?: Opts<t.ExportDeclaration> | null,
): node is t.ExportDeclaration {
  if (!node) return false;

  switch (node.type) {
    case "ExportAllDeclaration":
    case "ExportDefaultDeclaration":
    case "ExportNamedDeclaration":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isModuleSpecifier(
  node: t.Node | null | undefined,
  opts?: Opts<t.ModuleSpecifier> | null,
): node is t.ModuleSpecifier {
  if (!node) return false;

  switch (node.type) {
    case "ExportSpecifier":
    case "ImportDefaultSpecifier":
    case "ImportNamespaceSpecifier":
    case "ImportSpecifier":
    case "ExportNamespaceSpecifier":
    case "ExportDefaultSpecifier":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isAccessor(
  node: t.Node | null | undefined,
  opts?: Opts<t.Accessor> | null,
): node is t.Accessor {
  if (!node) return false;

  switch (node.type) {
    case "ClassAccessorProperty":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isPrivate(
  node: t.Node | null | undefined,
  opts?: Opts<t.Private> | null,
): node is t.Private {
  if (!node) return false;

  switch (node.type) {
    case "ClassPrivateProperty":
    case "ClassPrivateMethod":
    case "PrivateName":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isFlow(
  node: t.Node | null | undefined,
  opts?: Opts<t.Flow> | null,
): node is t.Flow {
  if (!node) return false;

  switch (node.type) {
    case "AnyTypeAnnotation":
    case "ArrayTypeAnnotation":
    case "BooleanTypeAnnotation":
    case "BooleanLiteralTypeAnnotation":
    case "NullLiteralTypeAnnotation":
    case "ClassImplements":
    case "DeclareClass":
    case "DeclareFunction":
    case "DeclareInterface":
    case "DeclareModule":
    case "DeclareModuleExports":
    case "DeclareTypeAlias":
    case "DeclareOpaqueType":
    case "DeclareVariable":
    case "DeclareExportDeclaration":
    case "DeclareExportAllDeclaration":
    case "DeclaredPredicate":
    case "ExistsTypeAnnotation":
    case "FunctionTypeAnnotation":
    case "FunctionTypeParam":
    case "GenericTypeAnnotation":
    case "InferredPredicate":
    case "InterfaceExtends":
    case "InterfaceDeclaration":
    case "InterfaceTypeAnnotation":
    case "IntersectionTypeAnnotation":
    case "MixedTypeAnnotation":
    case "EmptyTypeAnnotation":
    case "NullableTypeAnnotation":
    case "NumberLiteralTypeAnnotation":
    case "NumberTypeAnnotation":
    case "ObjectTypeAnnotation":
    case "ObjectTypeInternalSlot":
    case "ObjectTypeCallProperty":
    case "ObjectTypeIndexer":
    case "ObjectTypeProperty":
    case "ObjectTypeSpreadProperty":
    case "OpaqueType":
    case "QualifiedTypeIdentifier":
    case "StringLiteralTypeAnnotation":
    case "StringTypeAnnotation":
    case "SymbolTypeAnnotation":
    case "ThisTypeAnnotation":
    case "TupleTypeAnnotation":
    case "TypeofTypeAnnotation":
    case "TypeAlias":
    case "TypeAnnotation":
    case "TypeCastExpression":
    case "TypeParameter":
    case "TypeParameterDeclaration":
    case "TypeParameterInstantiation":
    case "UnionTypeAnnotation":
    case "Variance":
    case "VoidTypeAnnotation":
    case "EnumDeclaration":
    case "EnumBooleanBody":
    case "EnumNumberBody":
    case "EnumStringBody":
    case "EnumSymbolBody":
    case "EnumBooleanMember":
    case "EnumNumberMember":
    case "EnumStringMember":
    case "EnumDefaultedMember":
    case "IndexedAccessType":
    case "OptionalIndexedAccessType":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isFlowType(
  node: t.Node | null | undefined,
  opts?: Opts<t.FlowType> | null,
): node is t.FlowType {
  if (!node) return false;

  switch (node.type) {
    case "AnyTypeAnnotation":
    case "ArrayTypeAnnotation":
    case "BooleanTypeAnnotation":
    case "BooleanLiteralTypeAnnotation":
    case "NullLiteralTypeAnnotation":
    case "ExistsTypeAnnotation":
    case "FunctionTypeAnnotation":
    case "GenericTypeAnnotation":
    case "InterfaceTypeAnnotation":
    case "IntersectionTypeAnnotation":
    case "MixedTypeAnnotation":
    case "EmptyTypeAnnotation":
    case "NullableTypeAnnotation":
    case "NumberLiteralTypeAnnotation":
    case "NumberTypeAnnotation":
    case "ObjectTypeAnnotation":
    case "StringLiteralTypeAnnotation":
    case "StringTypeAnnotation":
    case "SymbolTypeAnnotation":
    case "ThisTypeAnnotation":
    case "TupleTypeAnnotation":
    case "TypeofTypeAnnotation":
    case "UnionTypeAnnotation":
    case "VoidTypeAnnotation":
    case "IndexedAccessType":
    case "OptionalIndexedAccessType":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isFlowBaseAnnotation(
  node: t.Node | null | undefined,
  opts?: Opts<t.FlowBaseAnnotation> | null,
): node is t.FlowBaseAnnotation {
  if (!node) return false;

  switch (node.type) {
    case "AnyTypeAnnotation":
    case "BooleanTypeAnnotation":
    case "NullLiteralTypeAnnotation":
    case "MixedTypeAnnotation":
    case "EmptyTypeAnnotation":
    case "NumberTypeAnnotation":
    case "StringTypeAnnotation":
    case "SymbolTypeAnnotation":
    case "ThisTypeAnnotation":
    case "VoidTypeAnnotation":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isFlowDeclaration(
  node: t.Node | null | undefined,
  opts?: Opts<t.FlowDeclaration> | null,
): node is t.FlowDeclaration {
  if (!node) return false;

  switch (node.type) {
    case "DeclareClass":
    case "DeclareFunction":
    case "DeclareInterface":
    case "DeclareModule":
    case "DeclareModuleExports":
    case "DeclareTypeAlias":
    case "DeclareOpaqueType":
    case "DeclareVariable":
    case "DeclareExportDeclaration":
    case "DeclareExportAllDeclaration":
    case "InterfaceDeclaration":
    case "OpaqueType":
    case "TypeAlias":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isFlowPredicate(
  node: t.Node | null | undefined,
  opts?: Opts<t.FlowPredicate> | null,
): node is t.FlowPredicate {
  if (!node) return false;

  switch (node.type) {
    case "DeclaredPredicate":
    case "InferredPredicate":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isEnumBody(
  node: t.Node | null | undefined,
  opts?: Opts<t.EnumBody> | null,
): node is t.EnumBody {
  if (!node) return false;

  switch (node.type) {
    case "EnumBooleanBody":
    case "EnumNumberBody":
    case "EnumStringBody":
    case "EnumSymbolBody":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isEnumMember(
  node: t.Node | null | undefined,
  opts?: Opts<t.EnumMember> | null,
): node is t.EnumMember {
  if (!node) return false;

  switch (node.type) {
    case "EnumBooleanMember":
    case "EnumNumberMember":
    case "EnumStringMember":
    case "EnumDefaultedMember":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isJSX(
  node: t.Node | null | undefined,
  opts?: Opts<t.JSX> | null,
): node is t.JSX {
  if (!node) return false;

  switch (node.type) {
    case "JSXAttribute":
    case "JSXClosingElement":
    case "JSXElement":
    case "JSXEmptyExpression":
    case "JSXExpressionContainer":
    case "JSXSpreadChild":
    case "JSXIdentifier":
    case "JSXMemberExpression":
    case "JSXNamespacedName":
    case "JSXOpeningElement":
    case "JSXSpreadAttribute":
    case "JSXText":
    case "JSXFragment":
    case "JSXOpeningFragment":
    case "JSXClosingFragment":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isMiscellaneous(
  node: t.Node | null | undefined,
  opts?: Opts<t.Miscellaneous> | null,
): node is t.Miscellaneous {
  if (!node) return false;

  switch (node.type) {
    case "Noop":
    case "Placeholder":
    case "V8IntrinsicIdentifier":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isTypeScript(
  node: t.Node | null | undefined,
  opts?: Opts<t.TypeScript> | null,
): node is t.TypeScript {
  if (!node) return false;

  switch (node.type) {
    case "TSParameterProperty":
    case "TSDeclareFunction":
    case "TSDeclareMethod":
    case "TSQualifiedName":
    case "TSCallSignatureDeclaration":
    case "TSConstructSignatureDeclaration":
    case "TSPropertySignature":
    case "TSMethodSignature":
    case "TSIndexSignature":
    case "TSAnyKeyword":
    case "TSBooleanKeyword":
    case "TSBigIntKeyword":
    case "TSIntrinsicKeyword":
    case "TSNeverKeyword":
    case "TSNullKeyword":
    case "TSNumberKeyword":
    case "TSObjectKeyword":
    case "TSStringKeyword":
    case "TSSymbolKeyword":
    case "TSUndefinedKeyword":
    case "TSUnknownKeyword":
    case "TSVoidKeyword":
    case "TSThisType":
    case "TSFunctionType":
    case "TSConstructorType":
    case "TSTypeReference":
    case "TSTypePredicate":
    case "TSTypeQuery":
    case "TSTypeLiteral":
    case "TSArrayType":
    case "TSTupleType":
    case "TSOptionalType":
    case "TSRestType":
    case "TSNamedTupleMember":
    case "TSUnionType":
    case "TSIntersectionType":
    case "TSConditionalType":
    case "TSInferType":
    case "TSParenthesizedType":
    case "TSTypeOperator":
    case "TSIndexedAccessType":
    case "TSMappedType":
    case "TSLiteralType":
    case "TSExpressionWithTypeArguments":
    case "TSInterfaceDeclaration":
    case "TSInterfaceBody":
    case "TSTypeAliasDeclaration":
    case "TSInstantiationExpression":
    case "TSAsExpression":
    case "TSSatisfiesExpression":
    case "TSTypeAssertion":
    case "TSEnumBody":
    case "TSEnumDeclaration":
    case "TSEnumMember":
    case "TSModuleDeclaration":
    case "TSModuleBlock":
    case "TSImportType":
    case "TSImportEqualsDeclaration":
    case "TSExternalModuleReference":
    case "TSNonNullExpression":
    case "TSExportAssignment":
    case "TSNamespaceExportDeclaration":
    case "TSTypeAnnotation":
    case "TSTypeParameterInstantiation":
    case "TSTypeParameterDeclaration":
    case "TSTypeParameter":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isTSTypeElement(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSTypeElement> | null,
): node is t.TSTypeElement {
  if (!node) return false;

  switch (node.type) {
    case "TSCallSignatureDeclaration":
    case "TSConstructSignatureDeclaration":
    case "TSPropertySignature":
    case "TSMethodSignature":
    case "TSIndexSignature":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isTSType(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSType> | null,
): node is t.TSType {
  if (!node) return false;

  switch (node.type) {
    case "TSAnyKeyword":
    case "TSBooleanKeyword":
    case "TSBigIntKeyword":
    case "TSIntrinsicKeyword":
    case "TSNeverKeyword":
    case "TSNullKeyword":
    case "TSNumberKeyword":
    case "TSObjectKeyword":
    case "TSStringKeyword":
    case "TSSymbolKeyword":
    case "TSUndefinedKeyword":
    case "TSUnknownKeyword":
    case "TSVoidKeyword":
    case "TSThisType":
    case "TSFunctionType":
    case "TSConstructorType":
    case "TSTypeReference":
    case "TSTypePredicate":
    case "TSTypeQuery":
    case "TSTypeLiteral":
    case "TSArrayType":
    case "TSTupleType":
    case "TSOptionalType":
    case "TSRestType":
    case "TSUnionType":
    case "TSIntersectionType":
    case "TSConditionalType":
    case "TSInferType":
    case "TSParenthesizedType":
    case "TSTypeOperator":
    case "TSIndexedAccessType":
    case "TSMappedType":
    case "TSLiteralType":
    case "TSExpressionWithTypeArguments":
    case "TSImportType":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
export function isTSBaseType(
  node: t.Node | null | undefined,
  opts?: Opts<t.TSBaseType> | null,
): node is t.TSBaseType {
  if (!node) return false;

  switch (node.type) {
    case "TSAnyKeyword":
    case "TSBooleanKeyword":
    case "TSBigIntKeyword":
    case "TSIntrinsicKeyword":
    case "TSNeverKeyword":
    case "TSNullKeyword":
    case "TSNumberKeyword":
    case "TSObjectKeyword":
    case "TSStringKeyword":
    case "TSSymbolKeyword":
    case "TSUndefinedKeyword":
    case "TSUnknownKeyword":
    case "TSVoidKeyword":
    case "TSThisType":
    case "TSLiteralType":
      break;
    default:
      return false;
  }

  return opts == null || shallowEqual(node, opts);
}
/**
 * @deprecated Use `isNumericLiteral`
 */
export function isNumberLiteral(
  node: t.Node | null | undefined,
  opts?: Opts<t.NumberLiteral> | null,
): boolean {
  deprecationWarning("isNumberLiteral", "isNumericLiteral");
  if (!node) return false;

  if (node.type !== "NumberLiteral") return false;

  return opts == null || shallowEqual(node, opts);
}
/**
 * @deprecated Use `isRegExpLiteral`
 */
export function isRegexLiteral(
  node: t.Node | null | undefined,
  opts?: Opts<t.RegexLiteral> | null,
): boolean {
  deprecationWarning("isRegexLiteral", "isRegExpLiteral");
  if (!node) return false;

  if (node.type !== "RegexLiteral") return false;

  return opts == null || shallowEqual(node, opts);
}
/**
 * @deprecated Use `isRestElement`
 */
export function isRestProperty(
  node: t.Node | null | undefined,
  opts?: Opts<t.RestProperty> | null,
): boolean {
  deprecationWarning("isRestProperty", "isRestElement");
  if (!node) return false;

  if (node.type !== "RestProperty") return false;

  return opts == null || shallowEqual(node, opts);
}
/**
 * @deprecated Use `isSpreadElement`
 */
export function isSpreadProperty(
  node: t.Node | null | undefined,
  opts?: Opts<t.SpreadProperty> | null,
): boolean {
  deprecationWarning("isSpreadProperty", "isSpreadElement");
  if (!node) return false;

  if (node.type !== "SpreadProperty") return false;

  return opts == null || shallowEqual(node, opts);
}
/**
 * @deprecated Use `isImportOrExportDeclaration`
 */
export function isModuleDeclaration(
  node: t.Node | null | undefined,
  opts?: Opts<t.ModuleDeclaration> | null,
): node is t.ImportOrExportDeclaration {
  deprecationWarning("isModuleDeclaration", "isImportOrExportDeclaration");
  return isImportOrExportDeclaration(node, opts);
}
