/*
 * This file is auto-generated! Do not modify it directly.
 * To re-generate run 'make build'
 */
import * as _validate from "../../validators/validate.ts";
import type * as t from "../../index.ts";
import deprecationWarning from "../../utils/deprecationWarning.ts";
import * as utils from "../../definitions/utils.ts";

const { validateInternal: validate } = _validate;
const { NODE_FIELDS } = utils;

export function arrayExpression(
  elements: Array<null | t.Expression | t.SpreadElement> = [],
): t.ArrayExpression {
  const node: t.ArrayExpression = {
    type: "ArrayExpression",
    elements,
  };
  const defs = NODE_FIELDS.ArrayExpression;
  validate(defs.elements, node, "elements", elements, 1);
  return node;
}
export function assignmentExpression(
  operator: string,
  left: t.LVal | t.OptionalMemberExpression,
  right: t.Expression,
): t.AssignmentExpression {
  const node: t.AssignmentExpression = {
    type: "AssignmentExpression",
    operator,
    left,
    right,
  };
  const defs = NODE_FIELDS.AssignmentExpression;
  validate(defs.operator, node, "operator", operator);
  validate(defs.left, node, "left", left, 1);
  validate(defs.right, node, "right", right, 1);
  return node;
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
  const node: t.BinaryExpression = {
    type: "BinaryExpression",
    operator,
    left,
    right,
  };
  const defs = NODE_FIELDS.BinaryExpression;
  validate(defs.operator, node, "operator", operator);
  validate(defs.left, node, "left", left, 1);
  validate(defs.right, node, "right", right, 1);
  return node;
}
export function interpreterDirective(value: string): t.InterpreterDirective {
  const node: t.InterpreterDirective = {
    type: "InterpreterDirective",
    value,
  };
  const defs = NODE_FIELDS.InterpreterDirective;
  validate(defs.value, node, "value", value);
  return node;
}
export function directive(value: t.DirectiveLiteral): t.Directive {
  const node: t.Directive = {
    type: "Directive",
    value,
  };
  const defs = NODE_FIELDS.Directive;
  validate(defs.value, node, "value", value, 1);
  return node;
}
export function directiveLiteral(value: string): t.DirectiveLiteral {
  const node: t.DirectiveLiteral = {
    type: "DirectiveLiteral",
    value,
  };
  const defs = NODE_FIELDS.DirectiveLiteral;
  validate(defs.value, node, "value", value);
  return node;
}
export function blockStatement(
  body: Array<t.Statement>,
  directives: Array<t.Directive> = [],
): t.BlockStatement {
  const node: t.BlockStatement = {
    type: "BlockStatement",
    body,
    directives,
  };
  const defs = NODE_FIELDS.BlockStatement;
  validate(defs.body, node, "body", body, 1);
  validate(defs.directives, node, "directives", directives, 1);
  return node;
}
export function breakStatement(
  label: t.Identifier | null = null,
): t.BreakStatement {
  const node: t.BreakStatement = {
    type: "BreakStatement",
    label,
  };
  const defs = NODE_FIELDS.BreakStatement;
  validate(defs.label, node, "label", label, 1);
  return node;
}
export function callExpression(
  callee: t.Expression | t.Super | t.V8IntrinsicIdentifier,
  _arguments: Array<t.Expression | t.SpreadElement | t.ArgumentPlaceholder>,
): t.CallExpression {
  const node: t.CallExpression = {
    type: "CallExpression",
    callee,
    arguments: _arguments,
  };
  const defs = NODE_FIELDS.CallExpression;
  validate(defs.callee, node, "callee", callee, 1);
  validate(defs.arguments, node, "arguments", _arguments, 1);
  return node;
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
  const node: t.CatchClause = {
    type: "CatchClause",
    param,
    body,
  };
  const defs = NODE_FIELDS.CatchClause;
  validate(defs.param, node, "param", param, 1);
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function conditionalExpression(
  test: t.Expression,
  consequent: t.Expression,
  alternate: t.Expression,
): t.ConditionalExpression {
  const node: t.ConditionalExpression = {
    type: "ConditionalExpression",
    test,
    consequent,
    alternate,
  };
  const defs = NODE_FIELDS.ConditionalExpression;
  validate(defs.test, node, "test", test, 1);
  validate(defs.consequent, node, "consequent", consequent, 1);
  validate(defs.alternate, node, "alternate", alternate, 1);
  return node;
}
export function continueStatement(
  label: t.Identifier | null = null,
): t.ContinueStatement {
  const node: t.ContinueStatement = {
    type: "ContinueStatement",
    label,
  };
  const defs = NODE_FIELDS.ContinueStatement;
  validate(defs.label, node, "label", label, 1);
  return node;
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
  const node: t.DoWhileStatement = {
    type: "DoWhileStatement",
    test,
    body,
  };
  const defs = NODE_FIELDS.DoWhileStatement;
  validate(defs.test, node, "test", test, 1);
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function emptyStatement(): t.EmptyStatement {
  return {
    type: "EmptyStatement",
  };
}
export function expressionStatement(
  expression: t.Expression,
): t.ExpressionStatement {
  const node: t.ExpressionStatement = {
    type: "ExpressionStatement",
    expression,
  };
  const defs = NODE_FIELDS.ExpressionStatement;
  validate(defs.expression, node, "expression", expression, 1);
  return node;
}
export function file(
  program: t.Program,
  comments: Array<t.CommentBlock | t.CommentLine> | null = null,
  tokens: Array<any> | null = null,
): t.File {
  const node: t.File = {
    type: "File",
    program,
    comments,
    tokens,
  };
  const defs = NODE_FIELDS.File;
  validate(defs.program, node, "program", program, 1);
  validate(defs.comments, node, "comments", comments, 1);
  validate(defs.tokens, node, "tokens", tokens);
  return node;
}
export function forInStatement(
  left: t.VariableDeclaration | t.LVal,
  right: t.Expression,
  body: t.Statement,
): t.ForInStatement {
  const node: t.ForInStatement = {
    type: "ForInStatement",
    left,
    right,
    body,
  };
  const defs = NODE_FIELDS.ForInStatement;
  validate(defs.left, node, "left", left, 1);
  validate(defs.right, node, "right", right, 1);
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function forStatement(
  init: t.VariableDeclaration | t.Expression | null | undefined = null,
  test: t.Expression | null | undefined = null,
  update: t.Expression | null | undefined = null,
  body: t.Statement,
): t.ForStatement {
  const node: t.ForStatement = {
    type: "ForStatement",
    init,
    test,
    update,
    body,
  };
  const defs = NODE_FIELDS.ForStatement;
  validate(defs.init, node, "init", init, 1);
  validate(defs.test, node, "test", test, 1);
  validate(defs.update, node, "update", update, 1);
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function functionDeclaration(
  id: t.Identifier | null | undefined = null,
  params: Array<t.Identifier | t.Pattern | t.RestElement>,
  body: t.BlockStatement,
  generator: boolean = false,
  async: boolean = false,
): t.FunctionDeclaration {
  const node: t.FunctionDeclaration = {
    type: "FunctionDeclaration",
    id,
    params,
    body,
    generator,
    async,
  };
  const defs = NODE_FIELDS.FunctionDeclaration;
  validate(defs.id, node, "id", id, 1);
  validate(defs.params, node, "params", params, 1);
  validate(defs.body, node, "body", body, 1);
  validate(defs.generator, node, "generator", generator);
  validate(defs.async, node, "async", async);
  return node;
}
export function functionExpression(
  id: t.Identifier | null | undefined = null,
  params: Array<t.Identifier | t.Pattern | t.RestElement>,
  body: t.BlockStatement,
  generator: boolean = false,
  async: boolean = false,
): t.FunctionExpression {
  const node: t.FunctionExpression = {
    type: "FunctionExpression",
    id,
    params,
    body,
    generator,
    async,
  };
  const defs = NODE_FIELDS.FunctionExpression;
  validate(defs.id, node, "id", id, 1);
  validate(defs.params, node, "params", params, 1);
  validate(defs.body, node, "body", body, 1);
  validate(defs.generator, node, "generator", generator);
  validate(defs.async, node, "async", async);
  return node;
}
export function identifier(name: string): t.Identifier {
  const node: t.Identifier = {
    type: "Identifier",
    name,
  };
  const defs = NODE_FIELDS.Identifier;
  validate(defs.name, node, "name", name);
  return node;
}
export function ifStatement(
  test: t.Expression,
  consequent: t.Statement,
  alternate: t.Statement | null = null,
): t.IfStatement {
  const node: t.IfStatement = {
    type: "IfStatement",
    test,
    consequent,
    alternate,
  };
  const defs = NODE_FIELDS.IfStatement;
  validate(defs.test, node, "test", test, 1);
  validate(defs.consequent, node, "consequent", consequent, 1);
  validate(defs.alternate, node, "alternate", alternate, 1);
  return node;
}
export function labeledStatement(
  label: t.Identifier,
  body: t.Statement,
): t.LabeledStatement {
  const node: t.LabeledStatement = {
    type: "LabeledStatement",
    label,
    body,
  };
  const defs = NODE_FIELDS.LabeledStatement;
  validate(defs.label, node, "label", label, 1);
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function stringLiteral(value: string): t.StringLiteral {
  const node: t.StringLiteral = {
    type: "StringLiteral",
    value,
  };
  const defs = NODE_FIELDS.StringLiteral;
  validate(defs.value, node, "value", value);
  return node;
}
export function numericLiteral(value: number): t.NumericLiteral {
  const node: t.NumericLiteral = {
    type: "NumericLiteral",
    value,
  };
  const defs = NODE_FIELDS.NumericLiteral;
  validate(defs.value, node, "value", value);
  return node;
}
export function nullLiteral(): t.NullLiteral {
  return {
    type: "NullLiteral",
  };
}
export function booleanLiteral(value: boolean): t.BooleanLiteral {
  const node: t.BooleanLiteral = {
    type: "BooleanLiteral",
    value,
  };
  const defs = NODE_FIELDS.BooleanLiteral;
  validate(defs.value, node, "value", value);
  return node;
}
export function regExpLiteral(
  pattern: string,
  flags: string = "",
): t.RegExpLiteral {
  const node: t.RegExpLiteral = {
    type: "RegExpLiteral",
    pattern,
    flags,
  };
  const defs = NODE_FIELDS.RegExpLiteral;
  validate(defs.pattern, node, "pattern", pattern);
  validate(defs.flags, node, "flags", flags);
  return node;
}
export function logicalExpression(
  operator: "||" | "&&" | "??",
  left: t.Expression,
  right: t.Expression,
): t.LogicalExpression {
  const node: t.LogicalExpression = {
    type: "LogicalExpression",
    operator,
    left,
    right,
  };
  const defs = NODE_FIELDS.LogicalExpression;
  validate(defs.operator, node, "operator", operator);
  validate(defs.left, node, "left", left, 1);
  validate(defs.right, node, "right", right, 1);
  return node;
}
export function memberExpression(
  object: t.Expression | t.Super,
  property: t.Expression | t.Identifier | t.PrivateName,
  computed: boolean = false,
  optional: boolean | null = null,
): t.MemberExpression {
  const node: t.MemberExpression = {
    type: "MemberExpression",
    object,
    property,
    computed,
    optional,
  };
  const defs = NODE_FIELDS.MemberExpression;
  validate(defs.object, node, "object", object, 1);
  validate(defs.property, node, "property", property, 1);
  validate(defs.computed, node, "computed", computed);
  validate(defs.optional, node, "optional", optional);
  return node;
}
export function newExpression(
  callee: t.Expression | t.Super | t.V8IntrinsicIdentifier,
  _arguments: Array<t.Expression | t.SpreadElement | t.ArgumentPlaceholder>,
): t.NewExpression {
  const node: t.NewExpression = {
    type: "NewExpression",
    callee,
    arguments: _arguments,
  };
  const defs = NODE_FIELDS.NewExpression;
  validate(defs.callee, node, "callee", callee, 1);
  validate(defs.arguments, node, "arguments", _arguments, 1);
  return node;
}
export function program(
  body: Array<t.Statement>,
  directives: Array<t.Directive> = [],
  sourceType: "script" | "module" = "script",
  interpreter: t.InterpreterDirective | null = null,
): t.Program {
  const node: t.Program = {
    type: "Program",
    body,
    directives,
    sourceType,
    interpreter,
  };
  const defs = NODE_FIELDS.Program;
  validate(defs.body, node, "body", body, 1);
  validate(defs.directives, node, "directives", directives, 1);
  validate(defs.sourceType, node, "sourceType", sourceType);
  validate(defs.interpreter, node, "interpreter", interpreter, 1);
  return node;
}
export function objectExpression(
  properties: Array<t.ObjectMethod | t.ObjectProperty | t.SpreadElement>,
): t.ObjectExpression {
  const node: t.ObjectExpression = {
    type: "ObjectExpression",
    properties,
  };
  const defs = NODE_FIELDS.ObjectExpression;
  validate(defs.properties, node, "properties", properties, 1);
  return node;
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
  const node: t.ObjectMethod = {
    type: "ObjectMethod",
    kind,
    key,
    params,
    body,
    computed,
    generator,
    async,
  };
  const defs = NODE_FIELDS.ObjectMethod;
  validate(defs.kind, node, "kind", kind);
  validate(defs.key, node, "key", key, 1);
  validate(defs.params, node, "params", params, 1);
  validate(defs.body, node, "body", body, 1);
  validate(defs.computed, node, "computed", computed);
  validate(defs.generator, node, "generator", generator);
  validate(defs.async, node, "async", async);
  return node;
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
  const node: t.ObjectProperty = {
    type: "ObjectProperty",
    key,
    value,
    computed,
    shorthand,
    decorators,
  };
  const defs = NODE_FIELDS.ObjectProperty;
  validate(defs.key, node, "key", key, 1);
  validate(defs.value, node, "value", value, 1);
  validate(defs.computed, node, "computed", computed);
  validate(defs.shorthand, node, "shorthand", shorthand);
  validate(defs.decorators, node, "decorators", decorators, 1);
  return node;
}
export function restElement(argument: t.LVal): t.RestElement {
  const node: t.RestElement = {
    type: "RestElement",
    argument,
  };
  const defs = NODE_FIELDS.RestElement;
  validate(defs.argument, node, "argument", argument, 1);
  return node;
}
export function returnStatement(
  argument: t.Expression | null = null,
): t.ReturnStatement {
  const node: t.ReturnStatement = {
    type: "ReturnStatement",
    argument,
  };
  const defs = NODE_FIELDS.ReturnStatement;
  validate(defs.argument, node, "argument", argument, 1);
  return node;
}
export function sequenceExpression(
  expressions: Array<t.Expression>,
): t.SequenceExpression {
  const node: t.SequenceExpression = {
    type: "SequenceExpression",
    expressions,
  };
  const defs = NODE_FIELDS.SequenceExpression;
  validate(defs.expressions, node, "expressions", expressions, 1);
  return node;
}
export function parenthesizedExpression(
  expression: t.Expression,
): t.ParenthesizedExpression {
  const node: t.ParenthesizedExpression = {
    type: "ParenthesizedExpression",
    expression,
  };
  const defs = NODE_FIELDS.ParenthesizedExpression;
  validate(defs.expression, node, "expression", expression, 1);
  return node;
}
export function switchCase(
  test: t.Expression | null | undefined = null,
  consequent: Array<t.Statement>,
): t.SwitchCase {
  const node: t.SwitchCase = {
    type: "SwitchCase",
    test,
    consequent,
  };
  const defs = NODE_FIELDS.SwitchCase;
  validate(defs.test, node, "test", test, 1);
  validate(defs.consequent, node, "consequent", consequent, 1);
  return node;
}
export function switchStatement(
  discriminant: t.Expression,
  cases: Array<t.SwitchCase>,
): t.SwitchStatement {
  const node: t.SwitchStatement = {
    type: "SwitchStatement",
    discriminant,
    cases,
  };
  const defs = NODE_FIELDS.SwitchStatement;
  validate(defs.discriminant, node, "discriminant", discriminant, 1);
  validate(defs.cases, node, "cases", cases, 1);
  return node;
}
export function thisExpression(): t.ThisExpression {
  return {
    type: "ThisExpression",
  };
}
export function throwStatement(argument: t.Expression): t.ThrowStatement {
  const node: t.ThrowStatement = {
    type: "ThrowStatement",
    argument,
  };
  const defs = NODE_FIELDS.ThrowStatement;
  validate(defs.argument, node, "argument", argument, 1);
  return node;
}
export function tryStatement(
  block: t.BlockStatement,
  handler: t.CatchClause | null = null,
  finalizer: t.BlockStatement | null = null,
): t.TryStatement {
  const node: t.TryStatement = {
    type: "TryStatement",
    block,
    handler,
    finalizer,
  };
  const defs = NODE_FIELDS.TryStatement;
  validate(defs.block, node, "block", block, 1);
  validate(defs.handler, node, "handler", handler, 1);
  validate(defs.finalizer, node, "finalizer", finalizer, 1);
  return node;
}
export function unaryExpression(
  operator: "void" | "throw" | "delete" | "!" | "+" | "-" | "~" | "typeof",
  argument: t.Expression,
  prefix: boolean = true,
): t.UnaryExpression {
  const node: t.UnaryExpression = {
    type: "UnaryExpression",
    operator,
    argument,
    prefix,
  };
  const defs = NODE_FIELDS.UnaryExpression;
  validate(defs.operator, node, "operator", operator);
  validate(defs.argument, node, "argument", argument, 1);
  validate(defs.prefix, node, "prefix", prefix);
  return node;
}
export function updateExpression(
  operator: "++" | "--",
  argument: t.Expression,
  prefix: boolean = false,
): t.UpdateExpression {
  const node: t.UpdateExpression = {
    type: "UpdateExpression",
    operator,
    argument,
    prefix,
  };
  const defs = NODE_FIELDS.UpdateExpression;
  validate(defs.operator, node, "operator", operator);
  validate(defs.argument, node, "argument", argument, 1);
  validate(defs.prefix, node, "prefix", prefix);
  return node;
}
export function variableDeclaration(
  kind: "var" | "let" | "const" | "using" | "await using",
  declarations: Array<t.VariableDeclarator>,
): t.VariableDeclaration {
  const node: t.VariableDeclaration = {
    type: "VariableDeclaration",
    kind,
    declarations,
  };
  const defs = NODE_FIELDS.VariableDeclaration;
  validate(defs.kind, node, "kind", kind);
  validate(defs.declarations, node, "declarations", declarations, 1);
  return node;
}
export function variableDeclarator(
  id: t.LVal,
  init: t.Expression | null = null,
): t.VariableDeclarator {
  const node: t.VariableDeclarator = {
    type: "VariableDeclarator",
    id,
    init,
  };
  const defs = NODE_FIELDS.VariableDeclarator;
  validate(defs.id, node, "id", id, 1);
  validate(defs.init, node, "init", init, 1);
  return node;
}
export function whileStatement(
  test: t.Expression,
  body: t.Statement,
): t.WhileStatement {
  const node: t.WhileStatement = {
    type: "WhileStatement",
    test,
    body,
  };
  const defs = NODE_FIELDS.WhileStatement;
  validate(defs.test, node, "test", test, 1);
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function withStatement(
  object: t.Expression,
  body: t.Statement,
): t.WithStatement {
  const node: t.WithStatement = {
    type: "WithStatement",
    object,
    body,
  };
  const defs = NODE_FIELDS.WithStatement;
  validate(defs.object, node, "object", object, 1);
  validate(defs.body, node, "body", body, 1);
  return node;
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
  const node: t.AssignmentPattern = {
    type: "AssignmentPattern",
    left,
    right,
  };
  const defs = NODE_FIELDS.AssignmentPattern;
  validate(defs.left, node, "left", left, 1);
  validate(defs.right, node, "right", right, 1);
  return node;
}
export function arrayPattern(
  elements: Array<null | t.PatternLike | t.LVal>,
): t.ArrayPattern {
  const node: t.ArrayPattern = {
    type: "ArrayPattern",
    elements,
  };
  const defs = NODE_FIELDS.ArrayPattern;
  validate(defs.elements, node, "elements", elements, 1);
  return node;
}
export function arrowFunctionExpression(
  params: Array<t.Identifier | t.Pattern | t.RestElement>,
  body: t.BlockStatement | t.Expression,
  async: boolean = false,
): t.ArrowFunctionExpression {
  const node: t.ArrowFunctionExpression = {
    type: "ArrowFunctionExpression",
    params,
    body,
    async,
    expression: null,
  };
  const defs = NODE_FIELDS.ArrowFunctionExpression;
  validate(defs.params, node, "params", params, 1);
  validate(defs.body, node, "body", body, 1);
  validate(defs.async, node, "async", async);
  return node;
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
  const node: t.ClassBody = {
    type: "ClassBody",
    body,
  };
  const defs = NODE_FIELDS.ClassBody;
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function classExpression(
  id: t.Identifier | null | undefined = null,
  superClass: t.Expression | null | undefined = null,
  body: t.ClassBody,
  decorators: Array<t.Decorator> | null = null,
): t.ClassExpression {
  const node: t.ClassExpression = {
    type: "ClassExpression",
    id,
    superClass,
    body,
    decorators,
  };
  const defs = NODE_FIELDS.ClassExpression;
  validate(defs.id, node, "id", id, 1);
  validate(defs.superClass, node, "superClass", superClass, 1);
  validate(defs.body, node, "body", body, 1);
  validate(defs.decorators, node, "decorators", decorators, 1);
  return node;
}
export function classDeclaration(
  id: t.Identifier | null | undefined = null,
  superClass: t.Expression | null | undefined = null,
  body: t.ClassBody,
  decorators: Array<t.Decorator> | null = null,
): t.ClassDeclaration {
  const node: t.ClassDeclaration = {
    type: "ClassDeclaration",
    id,
    superClass,
    body,
    decorators,
  };
  const defs = NODE_FIELDS.ClassDeclaration;
  validate(defs.id, node, "id", id, 1);
  validate(defs.superClass, node, "superClass", superClass, 1);
  validate(defs.body, node, "body", body, 1);
  validate(defs.decorators, node, "decorators", decorators, 1);
  return node;
}
export function exportAllDeclaration(
  source: t.StringLiteral,
): t.ExportAllDeclaration {
  const node: t.ExportAllDeclaration = {
    type: "ExportAllDeclaration",
    source,
  };
  const defs = NODE_FIELDS.ExportAllDeclaration;
  validate(defs.source, node, "source", source, 1);
  return node;
}
export function exportDefaultDeclaration(
  declaration:
    | t.TSDeclareFunction
    | t.FunctionDeclaration
    | t.ClassDeclaration
    | t.Expression,
): t.ExportDefaultDeclaration {
  const node: t.ExportDefaultDeclaration = {
    type: "ExportDefaultDeclaration",
    declaration,
  };
  const defs = NODE_FIELDS.ExportDefaultDeclaration;
  validate(defs.declaration, node, "declaration", declaration, 1);
  return node;
}
export function exportNamedDeclaration(
  declaration: t.Declaration | null = null,
  specifiers: Array<
    t.ExportSpecifier | t.ExportDefaultSpecifier | t.ExportNamespaceSpecifier
  > = [],
  source: t.StringLiteral | null = null,
): t.ExportNamedDeclaration {
  const node: t.ExportNamedDeclaration = {
    type: "ExportNamedDeclaration",
    declaration,
    specifiers,
    source,
  };
  const defs = NODE_FIELDS.ExportNamedDeclaration;
  validate(defs.declaration, node, "declaration", declaration, 1);
  validate(defs.specifiers, node, "specifiers", specifiers, 1);
  validate(defs.source, node, "source", source, 1);
  return node;
}
export function exportSpecifier(
  local: t.Identifier,
  exported: t.Identifier | t.StringLiteral,
): t.ExportSpecifier {
  const node: t.ExportSpecifier = {
    type: "ExportSpecifier",
    local,
    exported,
  };
  const defs = NODE_FIELDS.ExportSpecifier;
  validate(defs.local, node, "local", local, 1);
  validate(defs.exported, node, "exported", exported, 1);
  return node;
}
export function forOfStatement(
  left: t.VariableDeclaration | t.LVal,
  right: t.Expression,
  body: t.Statement,
  _await: boolean = false,
): t.ForOfStatement {
  const node: t.ForOfStatement = {
    type: "ForOfStatement",
    left,
    right,
    body,
    await: _await,
  };
  const defs = NODE_FIELDS.ForOfStatement;
  validate(defs.left, node, "left", left, 1);
  validate(defs.right, node, "right", right, 1);
  validate(defs.body, node, "body", body, 1);
  validate(defs.await, node, "await", _await);
  return node;
}
export function importDeclaration(
  specifiers: Array<
    t.ImportSpecifier | t.ImportDefaultSpecifier | t.ImportNamespaceSpecifier
  >,
  source: t.StringLiteral,
): t.ImportDeclaration {
  const node: t.ImportDeclaration = {
    type: "ImportDeclaration",
    specifiers,
    source,
  };
  const defs = NODE_FIELDS.ImportDeclaration;
  validate(defs.specifiers, node, "specifiers", specifiers, 1);
  validate(defs.source, node, "source", source, 1);
  return node;
}
export function importDefaultSpecifier(
  local: t.Identifier,
): t.ImportDefaultSpecifier {
  const node: t.ImportDefaultSpecifier = {
    type: "ImportDefaultSpecifier",
    local,
  };
  const defs = NODE_FIELDS.ImportDefaultSpecifier;
  validate(defs.local, node, "local", local, 1);
  return node;
}
export function importNamespaceSpecifier(
  local: t.Identifier,
): t.ImportNamespaceSpecifier {
  const node: t.ImportNamespaceSpecifier = {
    type: "ImportNamespaceSpecifier",
    local,
  };
  const defs = NODE_FIELDS.ImportNamespaceSpecifier;
  validate(defs.local, node, "local", local, 1);
  return node;
}
export function importSpecifier(
  local: t.Identifier,
  imported: t.Identifier | t.StringLiteral,
): t.ImportSpecifier {
  const node: t.ImportSpecifier = {
    type: "ImportSpecifier",
    local,
    imported,
  };
  const defs = NODE_FIELDS.ImportSpecifier;
  validate(defs.local, node, "local", local, 1);
  validate(defs.imported, node, "imported", imported, 1);
  return node;
}
export function importExpression(
  source: t.Expression,
  options: t.Expression | null = null,
): t.ImportExpression {
  const node: t.ImportExpression = {
    type: "ImportExpression",
    source,
    options,
  };
  const defs = NODE_FIELDS.ImportExpression;
  validate(defs.source, node, "source", source, 1);
  validate(defs.options, node, "options", options, 1);
  return node;
}
export function metaProperty(
  meta: t.Identifier,
  property: t.Identifier,
): t.MetaProperty {
  const node: t.MetaProperty = {
    type: "MetaProperty",
    meta,
    property,
  };
  const defs = NODE_FIELDS.MetaProperty;
  validate(defs.meta, node, "meta", meta, 1);
  validate(defs.property, node, "property", property, 1);
  return node;
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
  const node: t.ClassMethod = {
    type: "ClassMethod",
    kind,
    key,
    params,
    body,
    computed,
    static: _static,
    generator,
    async,
  };
  const defs = NODE_FIELDS.ClassMethod;
  validate(defs.kind, node, "kind", kind);
  validate(defs.key, node, "key", key, 1);
  validate(defs.params, node, "params", params, 1);
  validate(defs.body, node, "body", body, 1);
  validate(defs.computed, node, "computed", computed);
  validate(defs.static, node, "static", _static);
  validate(defs.generator, node, "generator", generator);
  validate(defs.async, node, "async", async);
  return node;
}
export function objectPattern(
  properties: Array<t.RestElement | t.ObjectProperty>,
): t.ObjectPattern {
  const node: t.ObjectPattern = {
    type: "ObjectPattern",
    properties,
  };
  const defs = NODE_FIELDS.ObjectPattern;
  validate(defs.properties, node, "properties", properties, 1);
  return node;
}
export function spreadElement(argument: t.Expression): t.SpreadElement {
  const node: t.SpreadElement = {
    type: "SpreadElement",
    argument,
  };
  const defs = NODE_FIELDS.SpreadElement;
  validate(defs.argument, node, "argument", argument, 1);
  return node;
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
  const node: t.TaggedTemplateExpression = {
    type: "TaggedTemplateExpression",
    tag,
    quasi,
  };
  const defs = NODE_FIELDS.TaggedTemplateExpression;
  validate(defs.tag, node, "tag", tag, 1);
  validate(defs.quasi, node, "quasi", quasi, 1);
  return node;
}
export function templateElement(
  value: { raw: string; cooked?: string },
  tail: boolean = false,
): t.TemplateElement {
  const node: t.TemplateElement = {
    type: "TemplateElement",
    value,
    tail,
  };
  const defs = NODE_FIELDS.TemplateElement;
  validate(defs.value, node, "value", value);
  validate(defs.tail, node, "tail", tail);
  return node;
}
export function templateLiteral(
  quasis: Array<t.TemplateElement>,
  expressions: Array<t.Expression | t.TSType>,
): t.TemplateLiteral {
  const node: t.TemplateLiteral = {
    type: "TemplateLiteral",
    quasis,
    expressions,
  };
  const defs = NODE_FIELDS.TemplateLiteral;
  validate(defs.quasis, node, "quasis", quasis, 1);
  validate(defs.expressions, node, "expressions", expressions, 1);
  return node;
}
export function yieldExpression(
  argument: t.Expression | null = null,
  delegate: boolean = false,
): t.YieldExpression {
  const node: t.YieldExpression = {
    type: "YieldExpression",
    argument,
    delegate,
  };
  const defs = NODE_FIELDS.YieldExpression;
  validate(defs.argument, node, "argument", argument, 1);
  validate(defs.delegate, node, "delegate", delegate);
  return node;
}
export function awaitExpression(argument: t.Expression): t.AwaitExpression {
  const node: t.AwaitExpression = {
    type: "AwaitExpression",
    argument,
  };
  const defs = NODE_FIELDS.AwaitExpression;
  validate(defs.argument, node, "argument", argument, 1);
  return node;
}
function _import(): t.Import {
  return {
    type: "Import",
  };
}
export { _import as import };
export function bigIntLiteral(value: string): t.BigIntLiteral {
  const node: t.BigIntLiteral = {
    type: "BigIntLiteral",
    value,
  };
  const defs = NODE_FIELDS.BigIntLiteral;
  validate(defs.value, node, "value", value);
  return node;
}
export function exportNamespaceSpecifier(
  exported: t.Identifier,
): t.ExportNamespaceSpecifier {
  const node: t.ExportNamespaceSpecifier = {
    type: "ExportNamespaceSpecifier",
    exported,
  };
  const defs = NODE_FIELDS.ExportNamespaceSpecifier;
  validate(defs.exported, node, "exported", exported, 1);
  return node;
}
export function optionalMemberExpression(
  object: t.Expression,
  property: t.Expression | t.Identifier,
  computed: boolean | undefined = false,
  optional: boolean,
): t.OptionalMemberExpression {
  const node: t.OptionalMemberExpression = {
    type: "OptionalMemberExpression",
    object,
    property,
    computed,
    optional,
  };
  const defs = NODE_FIELDS.OptionalMemberExpression;
  validate(defs.object, node, "object", object, 1);
  validate(defs.property, node, "property", property, 1);
  validate(defs.computed, node, "computed", computed);
  validate(defs.optional, node, "optional", optional);
  return node;
}
export function optionalCallExpression(
  callee: t.Expression,
  _arguments: Array<t.Expression | t.SpreadElement | t.ArgumentPlaceholder>,
  optional: boolean,
): t.OptionalCallExpression {
  const node: t.OptionalCallExpression = {
    type: "OptionalCallExpression",
    callee,
    arguments: _arguments,
    optional,
  };
  const defs = NODE_FIELDS.OptionalCallExpression;
  validate(defs.callee, node, "callee", callee, 1);
  validate(defs.arguments, node, "arguments", _arguments, 1);
  validate(defs.optional, node, "optional", optional);
  return node;
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
  const node: t.ClassProperty = {
    type: "ClassProperty",
    key,
    value,
    typeAnnotation,
    decorators,
    computed,
    static: _static,
  };
  const defs = NODE_FIELDS.ClassProperty;
  validate(defs.key, node, "key", key, 1);
  validate(defs.value, node, "value", value, 1);
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  validate(defs.decorators, node, "decorators", decorators, 1);
  validate(defs.computed, node, "computed", computed);
  validate(defs.static, node, "static", _static);
  return node;
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
  const node: t.ClassAccessorProperty = {
    type: "ClassAccessorProperty",
    key,
    value,
    typeAnnotation,
    decorators,
    computed,
    static: _static,
  };
  const defs = NODE_FIELDS.ClassAccessorProperty;
  validate(defs.key, node, "key", key, 1);
  validate(defs.value, node, "value", value, 1);
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  validate(defs.decorators, node, "decorators", decorators, 1);
  validate(defs.computed, node, "computed", computed);
  validate(defs.static, node, "static", _static);
  return node;
}
export function classPrivateProperty(
  key: t.PrivateName,
  value: t.Expression | null = null,
  decorators: Array<t.Decorator> | null = null,
  _static: boolean = false,
): t.ClassPrivateProperty {
  const node: t.ClassPrivateProperty = {
    type: "ClassPrivateProperty",
    key,
    value,
    decorators,
    static: _static,
  };
  const defs = NODE_FIELDS.ClassPrivateProperty;
  validate(defs.key, node, "key", key, 1);
  validate(defs.value, node, "value", value, 1);
  validate(defs.decorators, node, "decorators", decorators, 1);
  validate(defs.static, node, "static", _static);
  return node;
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
  const node: t.ClassPrivateMethod = {
    type: "ClassPrivateMethod",
    kind,
    key,
    params,
    body,
    static: _static,
  };
  const defs = NODE_FIELDS.ClassPrivateMethod;
  validate(defs.kind, node, "kind", kind);
  validate(defs.key, node, "key", key, 1);
  validate(defs.params, node, "params", params, 1);
  validate(defs.body, node, "body", body, 1);
  validate(defs.static, node, "static", _static);
  return node;
}
export function privateName(id: t.Identifier): t.PrivateName {
  const node: t.PrivateName = {
    type: "PrivateName",
    id,
  };
  const defs = NODE_FIELDS.PrivateName;
  validate(defs.id, node, "id", id, 1);
  return node;
}
export function staticBlock(body: Array<t.Statement>): t.StaticBlock {
  const node: t.StaticBlock = {
    type: "StaticBlock",
    body,
  };
  const defs = NODE_FIELDS.StaticBlock;
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function anyTypeAnnotation(): t.AnyTypeAnnotation {
  return {
    type: "AnyTypeAnnotation",
  };
}
export function arrayTypeAnnotation(
  elementType: t.FlowType,
): t.ArrayTypeAnnotation {
  const node: t.ArrayTypeAnnotation = {
    type: "ArrayTypeAnnotation",
    elementType,
  };
  const defs = NODE_FIELDS.ArrayTypeAnnotation;
  validate(defs.elementType, node, "elementType", elementType, 1);
  return node;
}
export function booleanTypeAnnotation(): t.BooleanTypeAnnotation {
  return {
    type: "BooleanTypeAnnotation",
  };
}
export function booleanLiteralTypeAnnotation(
  value: boolean,
): t.BooleanLiteralTypeAnnotation {
  const node: t.BooleanLiteralTypeAnnotation = {
    type: "BooleanLiteralTypeAnnotation",
    value,
  };
  const defs = NODE_FIELDS.BooleanLiteralTypeAnnotation;
  validate(defs.value, node, "value", value);
  return node;
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
  const node: t.ClassImplements = {
    type: "ClassImplements",
    id,
    typeParameters,
  };
  const defs = NODE_FIELDS.ClassImplements;
  validate(defs.id, node, "id", id, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  return node;
}
export function declareClass(
  id: t.Identifier,
  typeParameters: t.TypeParameterDeclaration | null | undefined = null,
  _extends: Array<t.InterfaceExtends> | null | undefined = null,
  body: t.ObjectTypeAnnotation,
): t.DeclareClass {
  const node: t.DeclareClass = {
    type: "DeclareClass",
    id,
    typeParameters,
    extends: _extends,
    body,
  };
  const defs = NODE_FIELDS.DeclareClass;
  validate(defs.id, node, "id", id, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.extends, node, "extends", _extends, 1);
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function declareFunction(id: t.Identifier): t.DeclareFunction {
  const node: t.DeclareFunction = {
    type: "DeclareFunction",
    id,
  };
  const defs = NODE_FIELDS.DeclareFunction;
  validate(defs.id, node, "id", id, 1);
  return node;
}
export function declareInterface(
  id: t.Identifier,
  typeParameters: t.TypeParameterDeclaration | null | undefined = null,
  _extends: Array<t.InterfaceExtends> | null | undefined = null,
  body: t.ObjectTypeAnnotation,
): t.DeclareInterface {
  const node: t.DeclareInterface = {
    type: "DeclareInterface",
    id,
    typeParameters,
    extends: _extends,
    body,
  };
  const defs = NODE_FIELDS.DeclareInterface;
  validate(defs.id, node, "id", id, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.extends, node, "extends", _extends, 1);
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function declareModule(
  id: t.Identifier | t.StringLiteral,
  body: t.BlockStatement,
  kind: "CommonJS" | "ES" | null = null,
): t.DeclareModule {
  const node: t.DeclareModule = {
    type: "DeclareModule",
    id,
    body,
    kind,
  };
  const defs = NODE_FIELDS.DeclareModule;
  validate(defs.id, node, "id", id, 1);
  validate(defs.body, node, "body", body, 1);
  validate(defs.kind, node, "kind", kind);
  return node;
}
export function declareModuleExports(
  typeAnnotation: t.TypeAnnotation,
): t.DeclareModuleExports {
  const node: t.DeclareModuleExports = {
    type: "DeclareModuleExports",
    typeAnnotation,
  };
  const defs = NODE_FIELDS.DeclareModuleExports;
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export function declareTypeAlias(
  id: t.Identifier,
  typeParameters: t.TypeParameterDeclaration | null | undefined = null,
  right: t.FlowType,
): t.DeclareTypeAlias {
  const node: t.DeclareTypeAlias = {
    type: "DeclareTypeAlias",
    id,
    typeParameters,
    right,
  };
  const defs = NODE_FIELDS.DeclareTypeAlias;
  validate(defs.id, node, "id", id, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.right, node, "right", right, 1);
  return node;
}
export function declareOpaqueType(
  id: t.Identifier,
  typeParameters: t.TypeParameterDeclaration | null = null,
  supertype: t.FlowType | null = null,
): t.DeclareOpaqueType {
  const node: t.DeclareOpaqueType = {
    type: "DeclareOpaqueType",
    id,
    typeParameters,
    supertype,
  };
  const defs = NODE_FIELDS.DeclareOpaqueType;
  validate(defs.id, node, "id", id, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.supertype, node, "supertype", supertype, 1);
  return node;
}
export function declareVariable(id: t.Identifier): t.DeclareVariable {
  const node: t.DeclareVariable = {
    type: "DeclareVariable",
    id,
  };
  const defs = NODE_FIELDS.DeclareVariable;
  validate(defs.id, node, "id", id, 1);
  return node;
}
export function declareExportDeclaration(
  declaration: t.Flow | null = null,
  specifiers: Array<
    t.ExportSpecifier | t.ExportNamespaceSpecifier
  > | null = null,
  source: t.StringLiteral | null = null,
  attributes: Array<t.ImportAttribute> | null = null,
): t.DeclareExportDeclaration {
  const node: t.DeclareExportDeclaration = {
    type: "DeclareExportDeclaration",
    declaration,
    specifiers,
    source,
    attributes,
  };
  const defs = NODE_FIELDS.DeclareExportDeclaration;
  validate(defs.declaration, node, "declaration", declaration, 1);
  validate(defs.specifiers, node, "specifiers", specifiers, 1);
  validate(defs.source, node, "source", source, 1);
  validate(defs.attributes, node, "attributes", attributes, 1);
  return node;
}
export function declareExportAllDeclaration(
  source: t.StringLiteral,
  attributes: Array<t.ImportAttribute> | null = null,
): t.DeclareExportAllDeclaration {
  const node: t.DeclareExportAllDeclaration = {
    type: "DeclareExportAllDeclaration",
    source,
    attributes,
  };
  const defs = NODE_FIELDS.DeclareExportAllDeclaration;
  validate(defs.source, node, "source", source, 1);
  validate(defs.attributes, node, "attributes", attributes, 1);
  return node;
}
export function declaredPredicate(value: t.Flow): t.DeclaredPredicate {
  const node: t.DeclaredPredicate = {
    type: "DeclaredPredicate",
    value,
  };
  const defs = NODE_FIELDS.DeclaredPredicate;
  validate(defs.value, node, "value", value, 1);
  return node;
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
  const node: t.FunctionTypeAnnotation = {
    type: "FunctionTypeAnnotation",
    typeParameters,
    params,
    rest,
    returnType,
  };
  const defs = NODE_FIELDS.FunctionTypeAnnotation;
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.params, node, "params", params, 1);
  validate(defs.rest, node, "rest", rest, 1);
  validate(defs.returnType, node, "returnType", returnType, 1);
  return node;
}
export function functionTypeParam(
  name: t.Identifier | null | undefined = null,
  typeAnnotation: t.FlowType,
): t.FunctionTypeParam {
  const node: t.FunctionTypeParam = {
    type: "FunctionTypeParam",
    name,
    typeAnnotation,
  };
  const defs = NODE_FIELDS.FunctionTypeParam;
  validate(defs.name, node, "name", name, 1);
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export function genericTypeAnnotation(
  id: t.Identifier | t.QualifiedTypeIdentifier,
  typeParameters: t.TypeParameterInstantiation | null = null,
): t.GenericTypeAnnotation {
  const node: t.GenericTypeAnnotation = {
    type: "GenericTypeAnnotation",
    id,
    typeParameters,
  };
  const defs = NODE_FIELDS.GenericTypeAnnotation;
  validate(defs.id, node, "id", id, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  return node;
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
  const node: t.InterfaceExtends = {
    type: "InterfaceExtends",
    id,
    typeParameters,
  };
  const defs = NODE_FIELDS.InterfaceExtends;
  validate(defs.id, node, "id", id, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  return node;
}
export function interfaceDeclaration(
  id: t.Identifier,
  typeParameters: t.TypeParameterDeclaration | null | undefined = null,
  _extends: Array<t.InterfaceExtends> | null | undefined = null,
  body: t.ObjectTypeAnnotation,
): t.InterfaceDeclaration {
  const node: t.InterfaceDeclaration = {
    type: "InterfaceDeclaration",
    id,
    typeParameters,
    extends: _extends,
    body,
  };
  const defs = NODE_FIELDS.InterfaceDeclaration;
  validate(defs.id, node, "id", id, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.extends, node, "extends", _extends, 1);
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function interfaceTypeAnnotation(
  _extends: Array<t.InterfaceExtends> | null | undefined = null,
  body: t.ObjectTypeAnnotation,
): t.InterfaceTypeAnnotation {
  const node: t.InterfaceTypeAnnotation = {
    type: "InterfaceTypeAnnotation",
    extends: _extends,
    body,
  };
  const defs = NODE_FIELDS.InterfaceTypeAnnotation;
  validate(defs.extends, node, "extends", _extends, 1);
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function intersectionTypeAnnotation(
  types: Array<t.FlowType>,
): t.IntersectionTypeAnnotation {
  const node: t.IntersectionTypeAnnotation = {
    type: "IntersectionTypeAnnotation",
    types,
  };
  const defs = NODE_FIELDS.IntersectionTypeAnnotation;
  validate(defs.types, node, "types", types, 1);
  return node;
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
  const node: t.NullableTypeAnnotation = {
    type: "NullableTypeAnnotation",
    typeAnnotation,
  };
  const defs = NODE_FIELDS.NullableTypeAnnotation;
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export function numberLiteralTypeAnnotation(
  value: number,
): t.NumberLiteralTypeAnnotation {
  const node: t.NumberLiteralTypeAnnotation = {
    type: "NumberLiteralTypeAnnotation",
    value,
  };
  const defs = NODE_FIELDS.NumberLiteralTypeAnnotation;
  validate(defs.value, node, "value", value);
  return node;
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
  const node: t.ObjectTypeAnnotation = {
    type: "ObjectTypeAnnotation",
    properties,
    indexers,
    callProperties,
    internalSlots,
    exact,
  };
  const defs = NODE_FIELDS.ObjectTypeAnnotation;
  validate(defs.properties, node, "properties", properties, 1);
  validate(defs.indexers, node, "indexers", indexers, 1);
  validate(defs.callProperties, node, "callProperties", callProperties, 1);
  validate(defs.internalSlots, node, "internalSlots", internalSlots, 1);
  validate(defs.exact, node, "exact", exact);
  return node;
}
export function objectTypeInternalSlot(
  id: t.Identifier,
  value: t.FlowType,
  optional: boolean,
  _static: boolean,
  method: boolean,
): t.ObjectTypeInternalSlot {
  const node: t.ObjectTypeInternalSlot = {
    type: "ObjectTypeInternalSlot",
    id,
    value,
    optional,
    static: _static,
    method,
  };
  const defs = NODE_FIELDS.ObjectTypeInternalSlot;
  validate(defs.id, node, "id", id, 1);
  validate(defs.value, node, "value", value, 1);
  validate(defs.optional, node, "optional", optional);
  validate(defs.static, node, "static", _static);
  validate(defs.method, node, "method", method);
  return node;
}
export function objectTypeCallProperty(
  value: t.FlowType,
): t.ObjectTypeCallProperty {
  const node: t.ObjectTypeCallProperty = {
    type: "ObjectTypeCallProperty",
    value,
    static: null,
  };
  const defs = NODE_FIELDS.ObjectTypeCallProperty;
  validate(defs.value, node, "value", value, 1);
  return node;
}
export function objectTypeIndexer(
  id: t.Identifier | null | undefined = null,
  key: t.FlowType,
  value: t.FlowType,
  variance: t.Variance | null = null,
): t.ObjectTypeIndexer {
  const node: t.ObjectTypeIndexer = {
    type: "ObjectTypeIndexer",
    id,
    key,
    value,
    variance,
    static: null,
  };
  const defs = NODE_FIELDS.ObjectTypeIndexer;
  validate(defs.id, node, "id", id, 1);
  validate(defs.key, node, "key", key, 1);
  validate(defs.value, node, "value", value, 1);
  validate(defs.variance, node, "variance", variance, 1);
  return node;
}
export function objectTypeProperty(
  key: t.Identifier | t.StringLiteral,
  value: t.FlowType,
  variance: t.Variance | null = null,
): t.ObjectTypeProperty {
  const node: t.ObjectTypeProperty = {
    type: "ObjectTypeProperty",
    key,
    value,
    variance,
    kind: null,
    method: null,
    optional: null,
    proto: null,
    static: null,
  };
  const defs = NODE_FIELDS.ObjectTypeProperty;
  validate(defs.key, node, "key", key, 1);
  validate(defs.value, node, "value", value, 1);
  validate(defs.variance, node, "variance", variance, 1);
  return node;
}
export function objectTypeSpreadProperty(
  argument: t.FlowType,
): t.ObjectTypeSpreadProperty {
  const node: t.ObjectTypeSpreadProperty = {
    type: "ObjectTypeSpreadProperty",
    argument,
  };
  const defs = NODE_FIELDS.ObjectTypeSpreadProperty;
  validate(defs.argument, node, "argument", argument, 1);
  return node;
}
export function opaqueType(
  id: t.Identifier,
  typeParameters: t.TypeParameterDeclaration | null | undefined = null,
  supertype: t.FlowType | null | undefined = null,
  impltype: t.FlowType,
): t.OpaqueType {
  const node: t.OpaqueType = {
    type: "OpaqueType",
    id,
    typeParameters,
    supertype,
    impltype,
  };
  const defs = NODE_FIELDS.OpaqueType;
  validate(defs.id, node, "id", id, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.supertype, node, "supertype", supertype, 1);
  validate(defs.impltype, node, "impltype", impltype, 1);
  return node;
}
export function qualifiedTypeIdentifier(
  id: t.Identifier,
  qualification: t.Identifier | t.QualifiedTypeIdentifier,
): t.QualifiedTypeIdentifier {
  const node: t.QualifiedTypeIdentifier = {
    type: "QualifiedTypeIdentifier",
    id,
    qualification,
  };
  const defs = NODE_FIELDS.QualifiedTypeIdentifier;
  validate(defs.id, node, "id", id, 1);
  validate(defs.qualification, node, "qualification", qualification, 1);
  return node;
}
export function stringLiteralTypeAnnotation(
  value: string,
): t.StringLiteralTypeAnnotation {
  const node: t.StringLiteralTypeAnnotation = {
    type: "StringLiteralTypeAnnotation",
    value,
  };
  const defs = NODE_FIELDS.StringLiteralTypeAnnotation;
  validate(defs.value, node, "value", value);
  return node;
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
  const node: t.TupleTypeAnnotation = {
    type: "TupleTypeAnnotation",
    types,
  };
  const defs = NODE_FIELDS.TupleTypeAnnotation;
  validate(defs.types, node, "types", types, 1);
  return node;
}
export function typeofTypeAnnotation(
  argument: t.FlowType,
): t.TypeofTypeAnnotation {
  const node: t.TypeofTypeAnnotation = {
    type: "TypeofTypeAnnotation",
    argument,
  };
  const defs = NODE_FIELDS.TypeofTypeAnnotation;
  validate(defs.argument, node, "argument", argument, 1);
  return node;
}
export function typeAlias(
  id: t.Identifier,
  typeParameters: t.TypeParameterDeclaration | null | undefined = null,
  right: t.FlowType,
): t.TypeAlias {
  const node: t.TypeAlias = {
    type: "TypeAlias",
    id,
    typeParameters,
    right,
  };
  const defs = NODE_FIELDS.TypeAlias;
  validate(defs.id, node, "id", id, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.right, node, "right", right, 1);
  return node;
}
export function typeAnnotation(typeAnnotation: t.FlowType): t.TypeAnnotation {
  const node: t.TypeAnnotation = {
    type: "TypeAnnotation",
    typeAnnotation,
  };
  const defs = NODE_FIELDS.TypeAnnotation;
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export function typeCastExpression(
  expression: t.Expression,
  typeAnnotation: t.TypeAnnotation,
): t.TypeCastExpression {
  const node: t.TypeCastExpression = {
    type: "TypeCastExpression",
    expression,
    typeAnnotation,
  };
  const defs = NODE_FIELDS.TypeCastExpression;
  validate(defs.expression, node, "expression", expression, 1);
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export function typeParameter(
  bound: t.TypeAnnotation | null = null,
  _default: t.FlowType | null = null,
  variance: t.Variance | null = null,
): t.TypeParameter {
  const node: t.TypeParameter = {
    type: "TypeParameter",
    bound,
    default: _default,
    variance,
    name: null,
  };
  const defs = NODE_FIELDS.TypeParameter;
  validate(defs.bound, node, "bound", bound, 1);
  validate(defs.default, node, "default", _default, 1);
  validate(defs.variance, node, "variance", variance, 1);
  return node;
}
export function typeParameterDeclaration(
  params: Array<t.TypeParameter>,
): t.TypeParameterDeclaration {
  const node: t.TypeParameterDeclaration = {
    type: "TypeParameterDeclaration",
    params,
  };
  const defs = NODE_FIELDS.TypeParameterDeclaration;
  validate(defs.params, node, "params", params, 1);
  return node;
}
export function typeParameterInstantiation(
  params: Array<t.FlowType>,
): t.TypeParameterInstantiation {
  const node: t.TypeParameterInstantiation = {
    type: "TypeParameterInstantiation",
    params,
  };
  const defs = NODE_FIELDS.TypeParameterInstantiation;
  validate(defs.params, node, "params", params, 1);
  return node;
}
export function unionTypeAnnotation(
  types: Array<t.FlowType>,
): t.UnionTypeAnnotation {
  const node: t.UnionTypeAnnotation = {
    type: "UnionTypeAnnotation",
    types,
  };
  const defs = NODE_FIELDS.UnionTypeAnnotation;
  validate(defs.types, node, "types", types, 1);
  return node;
}
export function variance(kind: "minus" | "plus"): t.Variance {
  const node: t.Variance = {
    type: "Variance",
    kind,
  };
  const defs = NODE_FIELDS.Variance;
  validate(defs.kind, node, "kind", kind);
  return node;
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
  const node: t.EnumDeclaration = {
    type: "EnumDeclaration",
    id,
    body,
  };
  const defs = NODE_FIELDS.EnumDeclaration;
  validate(defs.id, node, "id", id, 1);
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function enumBooleanBody(
  members: Array<t.EnumBooleanMember>,
): t.EnumBooleanBody {
  const node: t.EnumBooleanBody = {
    type: "EnumBooleanBody",
    members,
    explicitType: null,
    hasUnknownMembers: null,
  };
  const defs = NODE_FIELDS.EnumBooleanBody;
  validate(defs.members, node, "members", members, 1);
  return node;
}
export function enumNumberBody(
  members: Array<t.EnumNumberMember>,
): t.EnumNumberBody {
  const node: t.EnumNumberBody = {
    type: "EnumNumberBody",
    members,
    explicitType: null,
    hasUnknownMembers: null,
  };
  const defs = NODE_FIELDS.EnumNumberBody;
  validate(defs.members, node, "members", members, 1);
  return node;
}
export function enumStringBody(
  members: Array<t.EnumStringMember | t.EnumDefaultedMember>,
): t.EnumStringBody {
  const node: t.EnumStringBody = {
    type: "EnumStringBody",
    members,
    explicitType: null,
    hasUnknownMembers: null,
  };
  const defs = NODE_FIELDS.EnumStringBody;
  validate(defs.members, node, "members", members, 1);
  return node;
}
export function enumSymbolBody(
  members: Array<t.EnumDefaultedMember>,
): t.EnumSymbolBody {
  const node: t.EnumSymbolBody = {
    type: "EnumSymbolBody",
    members,
    hasUnknownMembers: null,
  };
  const defs = NODE_FIELDS.EnumSymbolBody;
  validate(defs.members, node, "members", members, 1);
  return node;
}
export function enumBooleanMember(id: t.Identifier): t.EnumBooleanMember {
  const node: t.EnumBooleanMember = {
    type: "EnumBooleanMember",
    id,
    init: null,
  };
  const defs = NODE_FIELDS.EnumBooleanMember;
  validate(defs.id, node, "id", id, 1);
  return node;
}
export function enumNumberMember(
  id: t.Identifier,
  init: t.NumericLiteral,
): t.EnumNumberMember {
  const node: t.EnumNumberMember = {
    type: "EnumNumberMember",
    id,
    init,
  };
  const defs = NODE_FIELDS.EnumNumberMember;
  validate(defs.id, node, "id", id, 1);
  validate(defs.init, node, "init", init, 1);
  return node;
}
export function enumStringMember(
  id: t.Identifier,
  init: t.StringLiteral,
): t.EnumStringMember {
  const node: t.EnumStringMember = {
    type: "EnumStringMember",
    id,
    init,
  };
  const defs = NODE_FIELDS.EnumStringMember;
  validate(defs.id, node, "id", id, 1);
  validate(defs.init, node, "init", init, 1);
  return node;
}
export function enumDefaultedMember(id: t.Identifier): t.EnumDefaultedMember {
  const node: t.EnumDefaultedMember = {
    type: "EnumDefaultedMember",
    id,
  };
  const defs = NODE_FIELDS.EnumDefaultedMember;
  validate(defs.id, node, "id", id, 1);
  return node;
}
export function indexedAccessType(
  objectType: t.FlowType,
  indexType: t.FlowType,
): t.IndexedAccessType {
  const node: t.IndexedAccessType = {
    type: "IndexedAccessType",
    objectType,
    indexType,
  };
  const defs = NODE_FIELDS.IndexedAccessType;
  validate(defs.objectType, node, "objectType", objectType, 1);
  validate(defs.indexType, node, "indexType", indexType, 1);
  return node;
}
export function optionalIndexedAccessType(
  objectType: t.FlowType,
  indexType: t.FlowType,
): t.OptionalIndexedAccessType {
  const node: t.OptionalIndexedAccessType = {
    type: "OptionalIndexedAccessType",
    objectType,
    indexType,
    optional: null,
  };
  const defs = NODE_FIELDS.OptionalIndexedAccessType;
  validate(defs.objectType, node, "objectType", objectType, 1);
  validate(defs.indexType, node, "indexType", indexType, 1);
  return node;
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
  const node: t.JSXAttribute = {
    type: "JSXAttribute",
    name,
    value,
  };
  const defs = NODE_FIELDS.JSXAttribute;
  validate(defs.name, node, "name", name, 1);
  validate(defs.value, node, "value", value, 1);
  return node;
}
export { jsxAttribute as jSXAttribute };
export function jsxClosingElement(
  name: t.JSXIdentifier | t.JSXMemberExpression | t.JSXNamespacedName,
): t.JSXClosingElement {
  const node: t.JSXClosingElement = {
    type: "JSXClosingElement",
    name,
  };
  const defs = NODE_FIELDS.JSXClosingElement;
  validate(defs.name, node, "name", name, 1);
  return node;
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
  const node: t.JSXElement = {
    type: "JSXElement",
    openingElement,
    closingElement,
    children,
    selfClosing,
  };
  const defs = NODE_FIELDS.JSXElement;
  validate(defs.openingElement, node, "openingElement", openingElement, 1);
  validate(defs.closingElement, node, "closingElement", closingElement, 1);
  validate(defs.children, node, "children", children, 1);
  validate(defs.selfClosing, node, "selfClosing", selfClosing);
  return node;
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
  const node: t.JSXExpressionContainer = {
    type: "JSXExpressionContainer",
    expression,
  };
  const defs = NODE_FIELDS.JSXExpressionContainer;
  validate(defs.expression, node, "expression", expression, 1);
  return node;
}
export { jsxExpressionContainer as jSXExpressionContainer };
export function jsxSpreadChild(expression: t.Expression): t.JSXSpreadChild {
  const node: t.JSXSpreadChild = {
    type: "JSXSpreadChild",
    expression,
  };
  const defs = NODE_FIELDS.JSXSpreadChild;
  validate(defs.expression, node, "expression", expression, 1);
  return node;
}
export { jsxSpreadChild as jSXSpreadChild };
export function jsxIdentifier(name: string): t.JSXIdentifier {
  const node: t.JSXIdentifier = {
    type: "JSXIdentifier",
    name,
  };
  const defs = NODE_FIELDS.JSXIdentifier;
  validate(defs.name, node, "name", name);
  return node;
}
export { jsxIdentifier as jSXIdentifier };
export function jsxMemberExpression(
  object: t.JSXMemberExpression | t.JSXIdentifier,
  property: t.JSXIdentifier,
): t.JSXMemberExpression {
  const node: t.JSXMemberExpression = {
    type: "JSXMemberExpression",
    object,
    property,
  };
  const defs = NODE_FIELDS.JSXMemberExpression;
  validate(defs.object, node, "object", object, 1);
  validate(defs.property, node, "property", property, 1);
  return node;
}
export { jsxMemberExpression as jSXMemberExpression };
export function jsxNamespacedName(
  namespace: t.JSXIdentifier,
  name: t.JSXIdentifier,
): t.JSXNamespacedName {
  const node: t.JSXNamespacedName = {
    type: "JSXNamespacedName",
    namespace,
    name,
  };
  const defs = NODE_FIELDS.JSXNamespacedName;
  validate(defs.namespace, node, "namespace", namespace, 1);
  validate(defs.name, node, "name", name, 1);
  return node;
}
export { jsxNamespacedName as jSXNamespacedName };
export function jsxOpeningElement(
  name: t.JSXIdentifier | t.JSXMemberExpression | t.JSXNamespacedName,
  attributes: Array<t.JSXAttribute | t.JSXSpreadAttribute>,
  selfClosing: boolean = false,
): t.JSXOpeningElement {
  const node: t.JSXOpeningElement = {
    type: "JSXOpeningElement",
    name,
    attributes,
    selfClosing,
  };
  const defs = NODE_FIELDS.JSXOpeningElement;
  validate(defs.name, node, "name", name, 1);
  validate(defs.attributes, node, "attributes", attributes, 1);
  validate(defs.selfClosing, node, "selfClosing", selfClosing);
  return node;
}
export { jsxOpeningElement as jSXOpeningElement };
export function jsxSpreadAttribute(
  argument: t.Expression,
): t.JSXSpreadAttribute {
  const node: t.JSXSpreadAttribute = {
    type: "JSXSpreadAttribute",
    argument,
  };
  const defs = NODE_FIELDS.JSXSpreadAttribute;
  validate(defs.argument, node, "argument", argument, 1);
  return node;
}
export { jsxSpreadAttribute as jSXSpreadAttribute };
export function jsxText(value: string): t.JSXText {
  const node: t.JSXText = {
    type: "JSXText",
    value,
  };
  const defs = NODE_FIELDS.JSXText;
  validate(defs.value, node, "value", value);
  return node;
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
  const node: t.JSXFragment = {
    type: "JSXFragment",
    openingFragment,
    closingFragment,
    children,
  };
  const defs = NODE_FIELDS.JSXFragment;
  validate(defs.openingFragment, node, "openingFragment", openingFragment, 1);
  validate(defs.closingFragment, node, "closingFragment", closingFragment, 1);
  validate(defs.children, node, "children", children, 1);
  return node;
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
  const node: t.Placeholder = {
    type: "Placeholder",
    expectedNode,
    name,
  };
  const defs = NODE_FIELDS.Placeholder;
  validate(defs.expectedNode, node, "expectedNode", expectedNode);
  validate(defs.name, node, "name", name, 1);
  return node;
}
export function v8IntrinsicIdentifier(name: string): t.V8IntrinsicIdentifier {
  const node: t.V8IntrinsicIdentifier = {
    type: "V8IntrinsicIdentifier",
    name,
  };
  const defs = NODE_FIELDS.V8IntrinsicIdentifier;
  validate(defs.name, node, "name", name);
  return node;
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
  const node: t.BindExpression = {
    type: "BindExpression",
    object,
    callee,
  };
  const defs = NODE_FIELDS.BindExpression;
  validate(defs.object, node, "object", object, 1);
  validate(defs.callee, node, "callee", callee, 1);
  return node;
}
export function importAttribute(
  key: t.Identifier | t.StringLiteral,
  value: t.StringLiteral,
): t.ImportAttribute {
  const node: t.ImportAttribute = {
    type: "ImportAttribute",
    key,
    value,
  };
  const defs = NODE_FIELDS.ImportAttribute;
  validate(defs.key, node, "key", key, 1);
  validate(defs.value, node, "value", value, 1);
  return node;
}
export function decorator(expression: t.Expression): t.Decorator {
  const node: t.Decorator = {
    type: "Decorator",
    expression,
  };
  const defs = NODE_FIELDS.Decorator;
  validate(defs.expression, node, "expression", expression, 1);
  return node;
}
export function doExpression(
  body: t.BlockStatement,
  async: boolean = false,
): t.DoExpression {
  const node: t.DoExpression = {
    type: "DoExpression",
    body,
    async,
  };
  const defs = NODE_FIELDS.DoExpression;
  validate(defs.body, node, "body", body, 1);
  validate(defs.async, node, "async", async);
  return node;
}
export function exportDefaultSpecifier(
  exported: t.Identifier,
): t.ExportDefaultSpecifier {
  const node: t.ExportDefaultSpecifier = {
    type: "ExportDefaultSpecifier",
    exported,
  };
  const defs = NODE_FIELDS.ExportDefaultSpecifier;
  validate(defs.exported, node, "exported", exported, 1);
  return node;
}
export function recordExpression(
  properties: Array<t.ObjectProperty | t.SpreadElement>,
): t.RecordExpression {
  const node: t.RecordExpression = {
    type: "RecordExpression",
    properties,
  };
  const defs = NODE_FIELDS.RecordExpression;
  validate(defs.properties, node, "properties", properties, 1);
  return node;
}
export function tupleExpression(
  elements: Array<t.Expression | t.SpreadElement> = [],
): t.TupleExpression {
  const node: t.TupleExpression = {
    type: "TupleExpression",
    elements,
  };
  const defs = NODE_FIELDS.TupleExpression;
  validate(defs.elements, node, "elements", elements, 1);
  return node;
}
export function decimalLiteral(value: string): t.DecimalLiteral {
  const node: t.DecimalLiteral = {
    type: "DecimalLiteral",
    value,
  };
  const defs = NODE_FIELDS.DecimalLiteral;
  validate(defs.value, node, "value", value);
  return node;
}
export function moduleExpression(body: t.Program): t.ModuleExpression {
  const node: t.ModuleExpression = {
    type: "ModuleExpression",
    body,
  };
  const defs = NODE_FIELDS.ModuleExpression;
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function topicReference(): t.TopicReference {
  return {
    type: "TopicReference",
  };
}
export function pipelineTopicExpression(
  expression: t.Expression,
): t.PipelineTopicExpression {
  const node: t.PipelineTopicExpression = {
    type: "PipelineTopicExpression",
    expression,
  };
  const defs = NODE_FIELDS.PipelineTopicExpression;
  validate(defs.expression, node, "expression", expression, 1);
  return node;
}
export function pipelineBareFunction(
  callee: t.Expression,
): t.PipelineBareFunction {
  const node: t.PipelineBareFunction = {
    type: "PipelineBareFunction",
    callee,
  };
  const defs = NODE_FIELDS.PipelineBareFunction;
  validate(defs.callee, node, "callee", callee, 1);
  return node;
}
export function pipelinePrimaryTopicReference(): t.PipelinePrimaryTopicReference {
  return {
    type: "PipelinePrimaryTopicReference",
  };
}
export function tsParameterProperty(
  parameter: t.Identifier | t.AssignmentPattern,
): t.TSParameterProperty {
  const node: t.TSParameterProperty = {
    type: "TSParameterProperty",
    parameter,
  };
  const defs = NODE_FIELDS.TSParameterProperty;
  validate(defs.parameter, node, "parameter", parameter, 1);
  return node;
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
  const node: t.TSDeclareFunction = {
    type: "TSDeclareFunction",
    id,
    typeParameters,
    params,
    returnType,
  };
  const defs = NODE_FIELDS.TSDeclareFunction;
  validate(defs.id, node, "id", id, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.params, node, "params", params, 1);
  validate(defs.returnType, node, "returnType", returnType, 1);
  return node;
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
  const node: t.TSDeclareMethod = {
    type: "TSDeclareMethod",
    decorators,
    key,
    typeParameters,
    params,
    returnType,
  };
  const defs = NODE_FIELDS.TSDeclareMethod;
  validate(defs.decorators, node, "decorators", decorators, 1);
  validate(defs.key, node, "key", key, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.params, node, "params", params, 1);
  validate(defs.returnType, node, "returnType", returnType, 1);
  return node;
}
export { tsDeclareMethod as tSDeclareMethod };
export function tsQualifiedName(
  left: t.TSEntityName,
  right: t.Identifier,
): t.TSQualifiedName {
  const node: t.TSQualifiedName = {
    type: "TSQualifiedName",
    left,
    right,
  };
  const defs = NODE_FIELDS.TSQualifiedName;
  validate(defs.left, node, "left", left, 1);
  validate(defs.right, node, "right", right, 1);
  return node;
}
export { tsQualifiedName as tSQualifiedName };
export function tsCallSignatureDeclaration(
  typeParameters: t.TSTypeParameterDeclaration | null | undefined = null,
  parameters: Array<
    t.ArrayPattern | t.Identifier | t.ObjectPattern | t.RestElement
  >,
  typeAnnotation: t.TSTypeAnnotation | null = null,
): t.TSCallSignatureDeclaration {
  const node: t.TSCallSignatureDeclaration = {
    type: "TSCallSignatureDeclaration",
    typeParameters,
    parameters,
    typeAnnotation,
  };
  const defs = NODE_FIELDS.TSCallSignatureDeclaration;
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.parameters, node, "parameters", parameters, 1);
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export { tsCallSignatureDeclaration as tSCallSignatureDeclaration };
export function tsConstructSignatureDeclaration(
  typeParameters: t.TSTypeParameterDeclaration | null | undefined = null,
  parameters: Array<
    t.ArrayPattern | t.Identifier | t.ObjectPattern | t.RestElement
  >,
  typeAnnotation: t.TSTypeAnnotation | null = null,
): t.TSConstructSignatureDeclaration {
  const node: t.TSConstructSignatureDeclaration = {
    type: "TSConstructSignatureDeclaration",
    typeParameters,
    parameters,
    typeAnnotation,
  };
  const defs = NODE_FIELDS.TSConstructSignatureDeclaration;
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.parameters, node, "parameters", parameters, 1);
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export { tsConstructSignatureDeclaration as tSConstructSignatureDeclaration };
export function tsPropertySignature(
  key: t.Expression,
  typeAnnotation: t.TSTypeAnnotation | null = null,
): t.TSPropertySignature {
  const node: t.TSPropertySignature = {
    type: "TSPropertySignature",
    key,
    typeAnnotation,
    kind: null,
  };
  const defs = NODE_FIELDS.TSPropertySignature;
  validate(defs.key, node, "key", key, 1);
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export { tsPropertySignature as tSPropertySignature };
export function tsMethodSignature(
  key: t.Expression,
  typeParameters: t.TSTypeParameterDeclaration | null | undefined = null,
  parameters: Array<
    t.ArrayPattern | t.Identifier | t.ObjectPattern | t.RestElement
  >,
  typeAnnotation: t.TSTypeAnnotation | null = null,
): t.TSMethodSignature {
  const node: t.TSMethodSignature = {
    type: "TSMethodSignature",
    key,
    typeParameters,
    parameters,
    typeAnnotation,
    kind: null,
  };
  const defs = NODE_FIELDS.TSMethodSignature;
  validate(defs.key, node, "key", key, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.parameters, node, "parameters", parameters, 1);
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export { tsMethodSignature as tSMethodSignature };
export function tsIndexSignature(
  parameters: Array<t.Identifier>,
  typeAnnotation: t.TSTypeAnnotation | null = null,
): t.TSIndexSignature {
  const node: t.TSIndexSignature = {
    type: "TSIndexSignature",
    parameters,
    typeAnnotation,
  };
  const defs = NODE_FIELDS.TSIndexSignature;
  validate(defs.parameters, node, "parameters", parameters, 1);
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
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
  parameters: Array<
    t.ArrayPattern | t.Identifier | t.ObjectPattern | t.RestElement
  >,
  typeAnnotation: t.TSTypeAnnotation | null = null,
): t.TSFunctionType {
  const node: t.TSFunctionType = {
    type: "TSFunctionType",
    typeParameters,
    parameters,
    typeAnnotation,
  };
  const defs = NODE_FIELDS.TSFunctionType;
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.parameters, node, "parameters", parameters, 1);
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export { tsFunctionType as tSFunctionType };
export function tsConstructorType(
  typeParameters: t.TSTypeParameterDeclaration | null | undefined = null,
  parameters: Array<
    t.ArrayPattern | t.Identifier | t.ObjectPattern | t.RestElement
  >,
  typeAnnotation: t.TSTypeAnnotation | null = null,
): t.TSConstructorType {
  const node: t.TSConstructorType = {
    type: "TSConstructorType",
    typeParameters,
    parameters,
    typeAnnotation,
  };
  const defs = NODE_FIELDS.TSConstructorType;
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.parameters, node, "parameters", parameters, 1);
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export { tsConstructorType as tSConstructorType };
export function tsTypeReference(
  typeName: t.TSEntityName,
  typeParameters: t.TSTypeParameterInstantiation | null = null,
): t.TSTypeReference {
  const node: t.TSTypeReference = {
    type: "TSTypeReference",
    typeName,
    typeParameters,
  };
  const defs = NODE_FIELDS.TSTypeReference;
  validate(defs.typeName, node, "typeName", typeName, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  return node;
}
export { tsTypeReference as tSTypeReference };
export function tsTypePredicate(
  parameterName: t.Identifier | t.TSThisType,
  typeAnnotation: t.TSTypeAnnotation | null = null,
  asserts: boolean | null = null,
): t.TSTypePredicate {
  const node: t.TSTypePredicate = {
    type: "TSTypePredicate",
    parameterName,
    typeAnnotation,
    asserts,
  };
  const defs = NODE_FIELDS.TSTypePredicate;
  validate(defs.parameterName, node, "parameterName", parameterName, 1);
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  validate(defs.asserts, node, "asserts", asserts);
  return node;
}
export { tsTypePredicate as tSTypePredicate };
export function tsTypeQuery(
  exprName: t.TSEntityName | t.TSImportType,
  typeParameters: t.TSTypeParameterInstantiation | null = null,
): t.TSTypeQuery {
  const node: t.TSTypeQuery = {
    type: "TSTypeQuery",
    exprName,
    typeParameters,
  };
  const defs = NODE_FIELDS.TSTypeQuery;
  validate(defs.exprName, node, "exprName", exprName, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  return node;
}
export { tsTypeQuery as tSTypeQuery };
export function tsTypeLiteral(
  members: Array<t.TSTypeElement>,
): t.TSTypeLiteral {
  const node: t.TSTypeLiteral = {
    type: "TSTypeLiteral",
    members,
  };
  const defs = NODE_FIELDS.TSTypeLiteral;
  validate(defs.members, node, "members", members, 1);
  return node;
}
export { tsTypeLiteral as tSTypeLiteral };
export function tsArrayType(elementType: t.TSType): t.TSArrayType {
  const node: t.TSArrayType = {
    type: "TSArrayType",
    elementType,
  };
  const defs = NODE_FIELDS.TSArrayType;
  validate(defs.elementType, node, "elementType", elementType, 1);
  return node;
}
export { tsArrayType as tSArrayType };
export function tsTupleType(
  elementTypes: Array<t.TSType | t.TSNamedTupleMember>,
): t.TSTupleType {
  const node: t.TSTupleType = {
    type: "TSTupleType",
    elementTypes,
  };
  const defs = NODE_FIELDS.TSTupleType;
  validate(defs.elementTypes, node, "elementTypes", elementTypes, 1);
  return node;
}
export { tsTupleType as tSTupleType };
export function tsOptionalType(typeAnnotation: t.TSType): t.TSOptionalType {
  const node: t.TSOptionalType = {
    type: "TSOptionalType",
    typeAnnotation,
  };
  const defs = NODE_FIELDS.TSOptionalType;
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export { tsOptionalType as tSOptionalType };
export function tsRestType(typeAnnotation: t.TSType): t.TSRestType {
  const node: t.TSRestType = {
    type: "TSRestType",
    typeAnnotation,
  };
  const defs = NODE_FIELDS.TSRestType;
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export { tsRestType as tSRestType };
export function tsNamedTupleMember(
  label: t.Identifier,
  elementType: t.TSType,
  optional: boolean = false,
): t.TSNamedTupleMember {
  const node: t.TSNamedTupleMember = {
    type: "TSNamedTupleMember",
    label,
    elementType,
    optional,
  };
  const defs = NODE_FIELDS.TSNamedTupleMember;
  validate(defs.label, node, "label", label, 1);
  validate(defs.elementType, node, "elementType", elementType, 1);
  validate(defs.optional, node, "optional", optional);
  return node;
}
export { tsNamedTupleMember as tSNamedTupleMember };
export function tsUnionType(types: Array<t.TSType>): t.TSUnionType {
  const node: t.TSUnionType = {
    type: "TSUnionType",
    types,
  };
  const defs = NODE_FIELDS.TSUnionType;
  validate(defs.types, node, "types", types, 1);
  return node;
}
export { tsUnionType as tSUnionType };
export function tsIntersectionType(
  types: Array<t.TSType>,
): t.TSIntersectionType {
  const node: t.TSIntersectionType = {
    type: "TSIntersectionType",
    types,
  };
  const defs = NODE_FIELDS.TSIntersectionType;
  validate(defs.types, node, "types", types, 1);
  return node;
}
export { tsIntersectionType as tSIntersectionType };
export function tsConditionalType(
  checkType: t.TSType,
  extendsType: t.TSType,
  trueType: t.TSType,
  falseType: t.TSType,
): t.TSConditionalType {
  const node: t.TSConditionalType = {
    type: "TSConditionalType",
    checkType,
    extendsType,
    trueType,
    falseType,
  };
  const defs = NODE_FIELDS.TSConditionalType;
  validate(defs.checkType, node, "checkType", checkType, 1);
  validate(defs.extendsType, node, "extendsType", extendsType, 1);
  validate(defs.trueType, node, "trueType", trueType, 1);
  validate(defs.falseType, node, "falseType", falseType, 1);
  return node;
}
export { tsConditionalType as tSConditionalType };
export function tsInferType(typeParameter: t.TSTypeParameter): t.TSInferType {
  const node: t.TSInferType = {
    type: "TSInferType",
    typeParameter,
  };
  const defs = NODE_FIELDS.TSInferType;
  validate(defs.typeParameter, node, "typeParameter", typeParameter, 1);
  return node;
}
export { tsInferType as tSInferType };
export function tsParenthesizedType(
  typeAnnotation: t.TSType,
): t.TSParenthesizedType {
  const node: t.TSParenthesizedType = {
    type: "TSParenthesizedType",
    typeAnnotation,
  };
  const defs = NODE_FIELDS.TSParenthesizedType;
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export { tsParenthesizedType as tSParenthesizedType };
export function tsTypeOperator(
  typeAnnotation: t.TSType,
  operator: "keyof" | "readonly" | "unique",
): t.TSTypeOperator {
  const node: t.TSTypeOperator = {
    type: "TSTypeOperator",
    typeAnnotation,
    operator,
  };
  const defs = NODE_FIELDS.TSTypeOperator;
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  validate(defs.operator, node, "operator", operator);
  return node;
}
export { tsTypeOperator as tSTypeOperator };
export function tsIndexedAccessType(
  objectType: t.TSType,
  indexType: t.TSType,
): t.TSIndexedAccessType {
  const node: t.TSIndexedAccessType = {
    type: "TSIndexedAccessType",
    objectType,
    indexType,
  };
  const defs = NODE_FIELDS.TSIndexedAccessType;
  validate(defs.objectType, node, "objectType", objectType, 1);
  validate(defs.indexType, node, "indexType", indexType, 1);
  return node;
}
export { tsIndexedAccessType as tSIndexedAccessType };
export function tsMappedType(
  typeParameter: t.TSTypeParameter,
  typeAnnotation: t.TSType | null = null,
  nameType: t.TSType | null = null,
): t.TSMappedType {
  const node: t.TSMappedType = {
    type: "TSMappedType",
    typeParameter,
    typeAnnotation,
    nameType,
  };
  const defs = NODE_FIELDS.TSMappedType;
  validate(defs.typeParameter, node, "typeParameter", typeParameter, 1);
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  validate(defs.nameType, node, "nameType", nameType, 1);
  return node;
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
  const node: t.TSLiteralType = {
    type: "TSLiteralType",
    literal,
  };
  const defs = NODE_FIELDS.TSLiteralType;
  validate(defs.literal, node, "literal", literal, 1);
  return node;
}
export { tsLiteralType as tSLiteralType };
export function tsExpressionWithTypeArguments(
  expression: t.TSEntityName,
  typeParameters: t.TSTypeParameterInstantiation | null = null,
): t.TSExpressionWithTypeArguments {
  const node: t.TSExpressionWithTypeArguments = {
    type: "TSExpressionWithTypeArguments",
    expression,
    typeParameters,
  };
  const defs = NODE_FIELDS.TSExpressionWithTypeArguments;
  validate(defs.expression, node, "expression", expression, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  return node;
}
export { tsExpressionWithTypeArguments as tSExpressionWithTypeArguments };
export function tsInterfaceDeclaration(
  id: t.Identifier,
  typeParameters: t.TSTypeParameterDeclaration | null | undefined = null,
  _extends: Array<t.TSExpressionWithTypeArguments> | null | undefined = null,
  body: t.TSInterfaceBody,
): t.TSInterfaceDeclaration {
  const node: t.TSInterfaceDeclaration = {
    type: "TSInterfaceDeclaration",
    id,
    typeParameters,
    extends: _extends,
    body,
  };
  const defs = NODE_FIELDS.TSInterfaceDeclaration;
  validate(defs.id, node, "id", id, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.extends, node, "extends", _extends, 1);
  validate(defs.body, node, "body", body, 1);
  return node;
}
export { tsInterfaceDeclaration as tSInterfaceDeclaration };
export function tsInterfaceBody(
  body: Array<t.TSTypeElement>,
): t.TSInterfaceBody {
  const node: t.TSInterfaceBody = {
    type: "TSInterfaceBody",
    body,
  };
  const defs = NODE_FIELDS.TSInterfaceBody;
  validate(defs.body, node, "body", body, 1);
  return node;
}
export { tsInterfaceBody as tSInterfaceBody };
export function tsTypeAliasDeclaration(
  id: t.Identifier,
  typeParameters: t.TSTypeParameterDeclaration | null | undefined = null,
  typeAnnotation: t.TSType,
): t.TSTypeAliasDeclaration {
  const node: t.TSTypeAliasDeclaration = {
    type: "TSTypeAliasDeclaration",
    id,
    typeParameters,
    typeAnnotation,
  };
  const defs = NODE_FIELDS.TSTypeAliasDeclaration;
  validate(defs.id, node, "id", id, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export { tsTypeAliasDeclaration as tSTypeAliasDeclaration };
export function tsInstantiationExpression(
  expression: t.Expression,
  typeParameters: t.TSTypeParameterInstantiation | null = null,
): t.TSInstantiationExpression {
  const node: t.TSInstantiationExpression = {
    type: "TSInstantiationExpression",
    expression,
    typeParameters,
  };
  const defs = NODE_FIELDS.TSInstantiationExpression;
  validate(defs.expression, node, "expression", expression, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  return node;
}
export { tsInstantiationExpression as tSInstantiationExpression };
export function tsAsExpression(
  expression: t.Expression,
  typeAnnotation: t.TSType,
): t.TSAsExpression {
  const node: t.TSAsExpression = {
    type: "TSAsExpression",
    expression,
    typeAnnotation,
  };
  const defs = NODE_FIELDS.TSAsExpression;
  validate(defs.expression, node, "expression", expression, 1);
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export { tsAsExpression as tSAsExpression };
export function tsSatisfiesExpression(
  expression: t.Expression,
  typeAnnotation: t.TSType,
): t.TSSatisfiesExpression {
  const node: t.TSSatisfiesExpression = {
    type: "TSSatisfiesExpression",
    expression,
    typeAnnotation,
  };
  const defs = NODE_FIELDS.TSSatisfiesExpression;
  validate(defs.expression, node, "expression", expression, 1);
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export { tsSatisfiesExpression as tSSatisfiesExpression };
export function tsTypeAssertion(
  typeAnnotation: t.TSType,
  expression: t.Expression,
): t.TSTypeAssertion {
  const node: t.TSTypeAssertion = {
    type: "TSTypeAssertion",
    typeAnnotation,
    expression,
  };
  const defs = NODE_FIELDS.TSTypeAssertion;
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  validate(defs.expression, node, "expression", expression, 1);
  return node;
}
export { tsTypeAssertion as tSTypeAssertion };
export function tsEnumDeclaration(
  id: t.Identifier,
  members: Array<t.TSEnumMember>,
): t.TSEnumDeclaration {
  const node: t.TSEnumDeclaration = {
    type: "TSEnumDeclaration",
    id,
    members,
  };
  const defs = NODE_FIELDS.TSEnumDeclaration;
  validate(defs.id, node, "id", id, 1);
  validate(defs.members, node, "members", members, 1);
  return node;
}
export { tsEnumDeclaration as tSEnumDeclaration };
export function tsEnumMember(
  id: t.Identifier | t.StringLiteral,
  initializer: t.Expression | null = null,
): t.TSEnumMember {
  const node: t.TSEnumMember = {
    type: "TSEnumMember",
    id,
    initializer,
  };
  const defs = NODE_FIELDS.TSEnumMember;
  validate(defs.id, node, "id", id, 1);
  validate(defs.initializer, node, "initializer", initializer, 1);
  return node;
}
export { tsEnumMember as tSEnumMember };
export function tsModuleDeclaration(
  id: t.Identifier | t.StringLiteral,
  body: t.TSModuleBlock | t.TSModuleDeclaration,
): t.TSModuleDeclaration {
  const node: t.TSModuleDeclaration = {
    type: "TSModuleDeclaration",
    id,
    body,
    kind: null,
  };
  const defs = NODE_FIELDS.TSModuleDeclaration;
  validate(defs.id, node, "id", id, 1);
  validate(defs.body, node, "body", body, 1);
  return node;
}
export { tsModuleDeclaration as tSModuleDeclaration };
export function tsModuleBlock(body: Array<t.Statement>): t.TSModuleBlock {
  const node: t.TSModuleBlock = {
    type: "TSModuleBlock",
    body,
  };
  const defs = NODE_FIELDS.TSModuleBlock;
  validate(defs.body, node, "body", body, 1);
  return node;
}
export { tsModuleBlock as tSModuleBlock };
export function tsImportType(
  argument: t.StringLiteral,
  qualifier: t.TSEntityName | null = null,
  typeParameters: t.TSTypeParameterInstantiation | null = null,
): t.TSImportType {
  const node: t.TSImportType = {
    type: "TSImportType",
    argument,
    qualifier,
    typeParameters,
  };
  const defs = NODE_FIELDS.TSImportType;
  validate(defs.argument, node, "argument", argument, 1);
  validate(defs.qualifier, node, "qualifier", qualifier, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  return node;
}
export { tsImportType as tSImportType };
export function tsImportEqualsDeclaration(
  id: t.Identifier,
  moduleReference: t.TSEntityName | t.TSExternalModuleReference,
): t.TSImportEqualsDeclaration {
  const node: t.TSImportEqualsDeclaration = {
    type: "TSImportEqualsDeclaration",
    id,
    moduleReference,
    isExport: null,
  };
  const defs = NODE_FIELDS.TSImportEqualsDeclaration;
  validate(defs.id, node, "id", id, 1);
  validate(defs.moduleReference, node, "moduleReference", moduleReference, 1);
  return node;
}
export { tsImportEqualsDeclaration as tSImportEqualsDeclaration };
export function tsExternalModuleReference(
  expression: t.StringLiteral,
): t.TSExternalModuleReference {
  const node: t.TSExternalModuleReference = {
    type: "TSExternalModuleReference",
    expression,
  };
  const defs = NODE_FIELDS.TSExternalModuleReference;
  validate(defs.expression, node, "expression", expression, 1);
  return node;
}
export { tsExternalModuleReference as tSExternalModuleReference };
export function tsNonNullExpression(
  expression: t.Expression,
): t.TSNonNullExpression {
  const node: t.TSNonNullExpression = {
    type: "TSNonNullExpression",
    expression,
  };
  const defs = NODE_FIELDS.TSNonNullExpression;
  validate(defs.expression, node, "expression", expression, 1);
  return node;
}
export { tsNonNullExpression as tSNonNullExpression };
export function tsExportAssignment(
  expression: t.Expression,
): t.TSExportAssignment {
  const node: t.TSExportAssignment = {
    type: "TSExportAssignment",
    expression,
  };
  const defs = NODE_FIELDS.TSExportAssignment;
  validate(defs.expression, node, "expression", expression, 1);
  return node;
}
export { tsExportAssignment as tSExportAssignment };
export function tsNamespaceExportDeclaration(
  id: t.Identifier,
): t.TSNamespaceExportDeclaration {
  const node: t.TSNamespaceExportDeclaration = {
    type: "TSNamespaceExportDeclaration",
    id,
  };
  const defs = NODE_FIELDS.TSNamespaceExportDeclaration;
  validate(defs.id, node, "id", id, 1);
  return node;
}
export { tsNamespaceExportDeclaration as tSNamespaceExportDeclaration };
export function tsTypeAnnotation(typeAnnotation: t.TSType): t.TSTypeAnnotation {
  const node: t.TSTypeAnnotation = {
    type: "TSTypeAnnotation",
    typeAnnotation,
  };
  const defs = NODE_FIELDS.TSTypeAnnotation;
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export { tsTypeAnnotation as tSTypeAnnotation };
export function tsTypeParameterInstantiation(
  params: Array<t.TSType>,
): t.TSTypeParameterInstantiation {
  const node: t.TSTypeParameterInstantiation = {
    type: "TSTypeParameterInstantiation",
    params,
  };
  const defs = NODE_FIELDS.TSTypeParameterInstantiation;
  validate(defs.params, node, "params", params, 1);
  return node;
}
export { tsTypeParameterInstantiation as tSTypeParameterInstantiation };
export function tsTypeParameterDeclaration(
  params: Array<t.TSTypeParameter>,
): t.TSTypeParameterDeclaration {
  const node: t.TSTypeParameterDeclaration = {
    type: "TSTypeParameterDeclaration",
    params,
  };
  const defs = NODE_FIELDS.TSTypeParameterDeclaration;
  validate(defs.params, node, "params", params, 1);
  return node;
}
export { tsTypeParameterDeclaration as tSTypeParameterDeclaration };
export function tsTypeParameter(
  constraint: t.TSType | null | undefined = null,
  _default: t.TSType | null | undefined = null,
  name: string,
): t.TSTypeParameter {
  const node: t.TSTypeParameter = {
    type: "TSTypeParameter",
    constraint,
    default: _default,
    name,
  };
  const defs = NODE_FIELDS.TSTypeParameter;
  validate(defs.constraint, node, "constraint", constraint, 1);
  validate(defs.default, node, "default", _default, 1);
  validate(defs.name, node, "name", name);
  return node;
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
