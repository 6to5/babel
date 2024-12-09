import type { SourceType } from "./options.ts";
import type { Token } from "./tokenizer/index.ts";
import type { SourceLocation } from "./util/location.ts";
import type { PlaceholderTypes } from "./plugins/placeholders.ts";
import type { ParseError } from "./parse-error.ts";

/*
 * If making any changes to the AST, update:
 * - This repository:
 *   - This file (including the `Node` alias at the bottom)
 *   - packages/babel-types/src/definitions
 *   - packages/babel-generators/src/generators
 */

interface CommentBase {
  type: "CommentBlock" | "CommentLine";
  value: string;
  start: number;
  end: number;
  loc: SourceLocation;
}

export interface CommentBlock extends CommentBase {
  type: "CommentBlock";
}

export interface CommentLine extends CommentBase {
  type: "CommentLine";
}

export type Comment = CommentBlock | CommentLine;

// A whitespace containing comments
export interface CommentWhitespace {
  start: number;
  end: number;
  comments: Array<Comment>;
  leadingNode: Node | null;
  trailingNode: Node | null;
  containerNode: Node | null;
}

export interface NodeBase {
  start: number;
  end: number;
  loc: SourceLocation;
  range?: [number, number];
  leadingComments?: Array<Comment>;
  trailingComments?: Array<Comment>;
  innerComments?: Array<Comment>;
  extra?: {
    [key: string]: any;
  };
}

type NodeAny<T extends string, KnownProps = object> = NodeBase & {
  type: T;
  [key: string]: any;
} & KnownProps;
export type Expression =
  | ArrayExpression
  | AssignmentExpression
  | BinaryExpression
  | CallExpression
  | ConditionalExpression
  | FunctionExpression
  | Identifier
  | StringLiteral
  | NumericLiteral
  | NullLiteral
  | BooleanLiteral
  | RegExpLiteral
  | LogicalExpression
  | MemberExpression
  | NewExpression
  | ObjectExpression
  | SequenceExpression
  | ParenthesizedExpression
  | ThisExpression
  | UnaryExpression
  | UpdateExpression
  | ArrowFunctionExpression
  | ClassExpression
  | ImportExpression
  | MetaProperty
  | Super
  | TaggedTemplateExpression
  | TemplateLiteral
  | YieldExpression
  | AwaitExpression
  | Import
  | BigIntLiteral
  | OptionalMemberExpression
  | OptionalCallExpression
  | TypeCastExpression
  | JSXElement
  | JSXFragment
  | BindExpression
  | DoExpression
  | RecordExpression
  | TupleExpression
  | DecimalLiteral
  | ModuleExpression
  | TopicReference
  | PipelineTopicExpression
  | PipelineBareFunction
  | PipelinePrimaryTopicReference
  | TsInstantiationExpression
  | TsAsExpression
  | TsSatisfiesExpression
  | TsTypeAssertion
  | TsTypeCastExpression
  | TsNonNullExpression
  | EstreeChainExpression
  | EstreeLiteral;
export type Statement =
  | BlockStatement
  | BreakStatement
  | ContinueStatement
  | DebuggerStatement
  | DoWhileStatement
  | EmptyStatement
  | ExpressionStatement
  | ForInStatement
  | ForStatement
  | FunctionDeclaration
  | IfStatement
  | LabeledStatement
  | ReturnStatement
  | SwitchStatement
  | ThrowStatement
  | TryStatement
  | VariableDeclaration
  | WhileStatement
  | WithStatement
  | ClassDeclaration
  | ExportAllDeclaration
  | ExportDefaultDeclaration
  | ExportNamedDeclaration
  | ForOfStatement
  | ImportDeclaration
  | FlowDeclareClass
  | FlowDeclareFunction
  | FlowDeclareInterface
  | FlowDeclareModule
  | FlowDeclareModuleExports
  | FlowDeclareTypeAlias
  | FlowDeclareOpaqueType
  | FlowDeclareVariable
  | FlowDeclareExportDeclaration
  | FlowEnumDeclaration
  | FlowInterface
  | FlowOpaqueType
  | FlowTypeAlias
  | TSDeclareFunction
  | TsInterfaceDeclaration
  | TsTypeAliasDeclaration
  | TsEnumDeclaration
  | TsModuleDeclaration
  | TsImportEqualsDeclaration
  | TsExportAssignment
  | TsNamespaceExportDeclaration;
export type Pattern =
  | Identifier
  | ObjectPattern
  | ArrayPattern
  | RestElement
  | AssignmentPattern;
//| Placeholder<"Pattern">;
export type Declaration =
  | VariableDeclaration
  | ClassDeclaration
  | FunctionDeclaration
  | TsInterfaceDeclaration
  | TsTypeAliasDeclaration
  | TsEnumDeclaration
  | TsModuleDeclaration;
// | Placeholder<"Declaration">;

export interface DeclarationBase extends NodeBase {
  // TypeScript allows declarations to be prefixed by `declare`.
  //TODO: a FunctionDeclaration is never "declare", because it's a TSDeclareFunction instead.
  declare?: true;
}

// TODO: Not in spec
export interface HasDecorators extends NodeBase {
  decorators?: Decorator[];
}

export interface InterpreterDirective extends NodeBase {
  type: "InterpreterDirective";
  value: string;
}

export interface Identifier extends PatternBase {
  type: "Identifier";
  name: string;
  // @deprecated
  __clone(): Identifier;
  // TypeScript only. Used in case of an optional parameter.
  optional?: true | null;
}
// | Placeholder<"Identifier">;

export interface PrivateName extends NodeBase {
  type: "PrivateName";
  id: Identifier;
}

// Literals

export type Literal =
  | RegExpLiteral
  | NullLiteral
  | StringLiteral
  | BooleanLiteral
  | NumericLiteral
  | BigIntLiteral
  | DecimalLiteral;

type RegExpFlag = "g" | "i" | "m" | "u" | "s" | "y" | "v";

export interface RegExpLiteral extends NodeBase {
  type: "RegExpLiteral";
  pattern: string;
  flags: RegExpFlag[];
}

export interface NullLiteral extends NodeBase {
  type: "NullLiteral";
}

export interface StringLiteral extends NodeBase {
  type: "StringLiteral";
  value: string;
}

export interface BooleanLiteral extends NodeBase {
  type: "BooleanLiteral";
  value: boolean;
}

export interface NumericLiteral extends NodeBase {
  type: "NumericLiteral";
  value: number;
}

export interface BigIntLiteral extends NodeBase {
  type: "BigIntLiteral";
  value: number;
}

export interface DecimalLiteral extends NodeBase {
  type: "DecimalLiteral";
  value: number;
}

export interface ParserOutput {
  comments: Comment[];
  errors: Array<ParseError<any>>;
  tokens?: Array<Token | Comment>;
}
// Programs

export type BlockStatementLike = Program | BlockStatement;

export interface File extends NodeBase, ParserOutput {
  type: "File";
  program: Program;
}

export interface Program extends NodeBase {
  type: "Program";
  sourceType: SourceType;
  body: Array<Statement | ModuleDeclaration>; // TODO: $ReadOnlyArray,
  directives: Directive[]; // TODO: Not in spec,
  interpreter: InterpreterDirective | null;
}

// Functions

export type Function =
  | NormalFunction
  | ArrowFunctionExpression
  | ObjectMethod
  | ClassMethod;

export type NormalFunction = FunctionDeclaration | FunctionExpression;

export interface BodilessFunctionOrMethodBase extends HasDecorators {
  // TODO: Remove this. Should not assign "id" to methods.
  // https://github.com/babel/babylon/issues/535
  id: Identifier | undefined | null;
  params: Array<Pattern | TSParameterProperty>;
  generator: boolean;
  async: boolean;
  // TODO: All not in spec
  expression: boolean;
  typeParameters?: TypeParameterDeclarationBase | null;
  returnType?: TypeAnnotationBase | null;
}

export interface FunctionBase extends BodilessFunctionOrMethodBase {
  body: BlockStatement;
}

// Statements

export interface ExpressionStatement extends NodeBase {
  type: "ExpressionStatement";
  expression: Expression;
}

export interface BlockStatement extends NodeBase {
  type: "BlockStatement";
  body: Array<Statement>; // TODO: $ReadOnlyArray,
  directives: Directive[];
}
// | Placeholder<"BlockStatement">;

export interface EmptyStatement extends NodeBase {
  type: "EmptyStatement";
}

export interface DebuggerStatement extends NodeBase {
  type: "DebuggerStatement";
}

export interface WithStatement extends NodeBase {
  type: "WithStatement";
  object: Expression;
  body: Statement;
}

export interface ReturnStatement extends NodeBase {
  type: "ReturnStatement";
  argument: Expression | undefined | null;
}

export interface LabeledStatement extends NodeBase {
  type: "LabeledStatement";
  label: Identifier;
  body: Statement;
}

export interface BreakStatement extends NodeBase {
  type: "BreakStatement";
  label: Identifier | undefined | null;
}

export interface ContinueStatement extends NodeBase {
  type: "ContinueStatement";
  label: Identifier | undefined | null;
}

// Choice

export interface IfStatement extends NodeBase {
  type: "IfStatement";
  test: Expression;
  consequent: Statement;
  alternate: Statement | undefined | null;
}

export interface SwitchStatement extends NodeBase {
  type: "SwitchStatement";
  discriminant: Expression;
  cases: SwitchCase[];
}

export interface SwitchCase extends NodeBase {
  type: "SwitchCase";
  test: Expression | undefined | null;
  consequent: Statement[];
}

// Exceptions

export interface ThrowStatement extends NodeBase {
  type: "ThrowStatement";
  argument: Expression;
}

export interface TryStatement extends NodeBase {
  type: "TryStatement";
  block: BlockStatement;
  handler: CatchClause | null;
  finalizer: BlockStatement | null;
}

export interface CatchClause extends NodeBase {
  type: "CatchClause";
  param: Pattern;
  body: BlockStatement;
}

// Loops

export interface WhileStatement extends NodeBase {
  type: "WhileStatement";
  test: Expression;
  body: Statement;
}

export interface DoWhileStatement extends NodeBase {
  type: "DoWhileStatement";
  body: Statement;
  test: Expression;
}

export type ForLike = ForStatement | ForInOf;

export interface ForStatement extends NodeBase {
  type: "ForStatement";
  init: VariableDeclaration | Expression | undefined | null;
  test: Expression | undefined | null;
  update: Expression | undefined | null;
  body: Statement;
}

export type ForInOf = ForInStatement | ForOfStatement;

interface ForInOfBase extends NodeBase {
  left: VariableDeclaration | Assignable;
  right: Expression;
  body: Statement;
}

export interface ForInStatement extends ForInOfBase {
  type: "ForInStatement";
  // TODO: Shouldn't be here, but have to declare it because it's assigned to a ForInOf unconditionally.
  await: boolean;
}

export interface ForOfStatement extends ForInOfBase {
  type: "ForOfStatement";
  await: boolean;
}

// Declarations

export interface OptFunctionDeclaration extends FunctionBase, DeclarationBase {
  type: "FunctionDeclaration";
}

export interface FunctionDeclaration extends OptFunctionDeclaration {
  id: Identifier;
}

export interface VariableDeclaration extends DeclarationBase, HasDecorators {
  type: "VariableDeclaration";
  declarations: VariableDeclarator[];
  kind: "var" | "let" | "const" | "using" | "await using";
}

export interface VariableDeclarator extends NodeBase {
  type: "VariableDeclarator";
  id: Pattern;
  init: Expression | undefined | null;
  // TypeScript only:
  definite?: true;
}

// Misc

export interface ArgumentPlaceholder extends NodeBase {
  type: "ArgumentPlaceholder";
}

export interface Decorator extends NodeBase {
  type: "Decorator";
  expression: Expression;
  arguments?: Array<Expression | SpreadElement>;
}

export interface Directive extends NodeBase {
  type: "Directive";
  value: DirectiveLiteral;
}

export interface DirectiveLiteral extends NodeBase {
  type: "DirectiveLiteral";
  value: string;
}

export interface ImportAttribute extends NodeBase {
  type: "ImportAttribute";
  key: Identifier | StringLiteral;
  value: StringLiteral;
}

// Expressions

export interface Super extends NodeBase {
  type: "Super";
}

export interface Import extends NodeBase {
  type: "Import";
}

export interface ThisExpression extends NodeBase {
  type: "ThisExpression";
}

export interface ArrowFunctionExpression extends BodilessFunctionOrMethodBase {
  type: "ArrowFunctionExpression";
  body: BlockStatement | Expression;
}

export interface YieldExpression extends NodeBase {
  type: "YieldExpression";
  argument: Expression | undefined | null;
  delegate: boolean;
}

export interface AwaitExpression extends NodeBase {
  type: "AwaitExpression";
  argument: Expression;
}

export interface ArrayExpression extends NodeBase {
  type: "ArrayExpression";
  elements: Array<Expression | SpreadElement | undefined | null>;
}

export interface DoExpression extends NodeBase {
  type: "DoExpression";
  body: BlockStatement | undefined | null;
  async: boolean;
}

export interface TupleExpression extends NodeBase {
  type: "TupleExpression";
  elements: Array<Expression | SpreadElement | undefined | null>;
}

export interface ObjectExpression extends NodeBase {
  type: "ObjectExpression";
  properties: Array<ObjectProperty | ObjectMethod | SpreadElement>;
}
export interface RecordExpression extends NodeBase {
  type: "RecordExpression";
  properties: Array<ObjectProperty | ObjectMethod | SpreadElement>;
}

export type ObjectOrClassMember = ClassMethod | ClassProperty | ObjectMember;

export type ObjectMember = ObjectProperty | ObjectMethod;

export interface ObjectMemberBase extends NodeBase {
  computed: boolean;
  value: Expression | Pattern;
  decorators?: Decorator[];
  kind?: "get" | "set" | "method";
  method: boolean; // TODO: Not in spec,
  typeParameters?: TypeParameterDeclarationBase | null; // TODO: Not in spec,
  variance?: FlowVariance | null; // TODO: Not in spec
}

export interface ObjectProperty extends ObjectMemberBase {
  type: "ObjectProperty";
  shorthand: boolean;
  key: Expression | PrivateName; // For private destructuring
  value: Expression | Pattern;
}

export interface ObjectMethod extends ObjectMemberBase, FunctionBase {
  type: "ObjectMethod";
  kind: "get" | "set" | "method"; // Never "constructor"
  key: Expression;
  value: Expression;
}

export interface FunctionExpression extends FunctionBase {
  kind?: void; // never set,
  type: "FunctionExpression";
}

// Unary operations

export interface UnaryExpression extends NodeBase {
  type: "UnaryExpression";
  operator: UnaryOperator;
  prefix: boolean;
  argument: Expression;
}

export type UnaryOperator =
  | "-"
  | "+"
  | "!"
  | "~"
  | "typeof"
  | "void"
  | "delete"
  | "throw";

export interface UpdateExpression extends NodeBase {
  type: "UpdateExpression";
  operator: UpdateOperator;
  argument: Expression;
  prefix: boolean;
}

export type UpdateOperator = "++" | "--";

// Binary operations

export interface BinaryExpression extends NodeBase {
  type: "BinaryExpression";
  operator: BinaryOperator;
  left: Expression | PrivateName;
  right: Expression;
}

export type BinaryOperator =
  | "=="
  | "!="
  | "==="
  | "!=="
  | "<"
  | "<="
  | ">"
  | ">="
  | "<<"
  | ">>"
  | ">>>"
  | "+"
  | "-"
  | "*"
  | "/"
  | "%"
  | "|"
  | "^"
  | "&"
  | "in"
  | "instanceof";

export type Assignable =
  | Pattern
  | MemberExpression
  | ParenthesizedExpression
  | TsTypeCastExpression
  | TypeCastExpression;

export interface AssignmentExpression extends NodeBase {
  type: "AssignmentExpression";
  operator: AssignmentOperator;
  left: Assignable;
  right: Expression;
}

export type AssignmentOperator =
  | "="
  | "+="
  | "-="
  | "*="
  | "/="
  | "%="
  | "<<="
  | ">>="
  | ">>>="
  | "|="
  | "^="
  | "&=";

export interface LogicalExpression extends NodeBase {
  type: "LogicalExpression";
  operator: LogicalOperator;
  left: Expression;
  right: Expression;
}

export type LogicalOperator = "||" | "&&";

export interface SpreadElement extends NodeBase {
  type: "SpreadElement";
  argument: Expression;
}

export interface MemberExpression extends NodeBase {
  type: "MemberExpression";
  object: Expression | Super;
  property: Expression | PrivateName;
  computed: boolean;
}

export interface OptionalMemberExpression extends NodeBase {
  type: "OptionalMemberExpression";
  object: Expression | Super;
  property: Expression | PrivateName;
  computed: boolean;
  optional: boolean;
}

export interface OptionalCallExpression extends CallOrNewBase {
  type: "OptionalCallExpression";
  optional: boolean;
}
export interface BindExpression extends NodeBase {
  type: "BindExpression";
  object: Expression | undefined | null;
  callee: Expression;
}

export interface ConditionalExpression extends NodeBase {
  type: "ConditionalExpression";
  test: Expression;
  alternate: Expression;
  consequent: Expression;
}

export interface CallOrNewBase extends NodeBase {
  callee: Expression | Super | Import;
  arguments: Array<Expression | SpreadElement>; // TODO: $ReadOnlyArray,
  typeArguments: TypeParameterInstantiationBase | undefined | null;
  typeParameters?: TypeParameterInstantiationBase | null; // TODO: Not in spec
}

export interface CallExpression extends CallOrNewBase {
  type: "CallExpression";
}

export interface NewExpression extends CallOrNewBase {
  type: "NewExpression";
  optional?: boolean; // TODO: Not in spec
}

export interface ImportExpression extends NodeBase {
  type: "ImportExpression";
  source: Expression;
  phase?: null | "source" | "defer";
  options: Expression | null;
}

export interface SequenceExpression extends NodeBase {
  type: "SequenceExpression";
  expressions: Expression[];
}

export interface ParenthesizedExpression extends NodeBase {
  type: "ParenthesizedExpression";
  expression: Expression;
}

// Hack pipe operator

export interface TopicReference extends NodeBase {
  type: "TopicReference";
}

// Smart-mix pipe operator

export interface PipelineBody extends NodeBase {
  type: "PipelineBody";
}

export interface PipelineBareFunctionBody extends NodeBase {
  type: "PipelineBareFunctionBody";
  callee: Expression;
}

export interface PipelineBareConstructorBody extends NodeBase {
  type: "PipelineBareConstructorBody";
  callee: Expression;
}

export interface PipelineBareAwaitedFunctionBody extends NodeBase {
  type: "PipelineBareAwaitedFunctionBody";
  callee: Expression;
}

export interface PipelineTopicBody extends NodeBase {
  type: "PipelineTopicBody";
  expression: Expression;
}

export type PipelineStyle =
  | "PipelineBareFunction"
  | "PipelineBareConstructor"
  | "PipelineBareAwaitedFunction"
  | "PipelineTopicExpression";

export interface PipelinePrimaryTopicReference extends NodeBase {
  type: "PipelinePrimaryTopicReference";
}

// Template Literals

export interface TemplateLiteral extends NodeBase {
  type: "TemplateLiteral";
  quasis: TemplateElement[];
  expressions: Expression[] | TsType[];
}

export interface TaggedTemplateExpression extends NodeBase {
  type: "TaggedTemplateExpression";
  tag: Expression;
  quasi: TemplateLiteral;
  typeParameters?: TypeParameterInstantiationBase | null; // TODO: Not in spec
}

export interface TemplateElement extends NodeBase {
  type: "TemplateElement";
  tail: boolean;
  value: {
    cooked: string;
    raw: string;
  };
}

export interface ModuleExpression extends NodeBase {
  type: "ModuleExpression";
  body: Program;
}

// Patterns

// TypeScript access modifiers
export type Accessibility = "public" | "protected" | "private";

export type VarianceAnnotations = "in" | "out";

export interface PatternBase extends HasDecorators {
  // TODO: All not in spec
  // Flow/TypeScript only:
  typeAnnotation?: TypeAnnotationBase | null;
}

export interface AssignmentProperty extends ObjectProperty {
  value: Pattern;
}

export interface ObjectPattern extends PatternBase {
  type: "ObjectPattern";
  properties: (AssignmentProperty | RestElement)[];
}

export interface ArrayPattern extends PatternBase {
  type: "ArrayPattern";
  elements: (Pattern | undefined | null)[];
}

export interface RestElement extends PatternBase {
  type: "RestElement";
  argument: Pattern;
}

export interface AssignmentPattern extends PatternBase {
  type: "AssignmentPattern";
  left: Pattern;
  right: Expression;
}

// Classes

export type Class = ClassDeclaration | ClassExpression;

export interface ClassBase extends HasDecorators {
  id: Identifier | undefined | null;
  superClass: Expression | undefined | null;
  body: ClassBody;
  decorators?: Decorator[];
  // TODO: All not in spec
  typeParameters?: TypeParameterDeclarationBase | null;
  superTypeParameters?: TypeParameterInstantiationBase | null; // babel 7
  superTypeArguments?: TypeParameterInstantiationBase | null; // babel 8
  abstract?: boolean;
  implements?: TSClassImplements[] | undefined | null | FlowClassImplements[];
}

export interface ClassBody extends NodeBase {
  type: "ClassBody";
  body: Array<ClassMember | StaticBlock | TsIndexSignature>; // TODO: $ReadOnlyArray
}
// | Placeholder<"ClassBody">;

export interface ClassMemberBase extends NodeBase, HasDecorators {
  static: boolean;
  computed: boolean;
  // TypeScript only:
  accessibility?: Accessibility | null;
  override?: true | null;
  abstract?: true | null;
  optional?: true | null;
}

export interface StaticBlock extends NodeBase {
  type: "StaticBlock";
  body: Array<Statement>;
}

export type ClassMember =
  | ClassMethod
  | ClassPrivateMethod
  | ClassProperty
  | ClassPrivateProperty
  | ClassAccessorProperty;

export type MethodLike =
  | ObjectMethod
  | FunctionExpression
  | ClassMethod
  | ClassPrivateMethod
  | TSDeclareMethod;

interface MethodBase extends FunctionBase {
  kind: MethodKind;
}

export type MethodKind = "constructor" | "method" | "get" | "set";

export interface ClassMethodOrDeclareMethodCommon extends ClassMemberBase {
  key: Expression | PrivateName;
  kind: MethodKind;
  static: boolean;
  decorators?: Decorator[];
}

export interface ClassMethod
  extends MethodBase,
    ClassMethodOrDeclareMethodCommon {
  type: "ClassMethod";
  variance?: FlowVariance | null; // TODO: Not in spec
}

export interface ClassPrivateMethod
  extends NodeBase,
    ClassMethodOrDeclareMethodCommon,
    MethodBase {
  type: "ClassPrivateMethod";
  key: PrivateName;
  computed: false;
  variance?: FlowVariance | null; // TODO: Not in spec
}

export interface ClassProperty extends ClassMemberBase, DeclarationBase {
  type: "ClassProperty";
  key: Expression;
  value: Expression | undefined | null; // TODO: Not in spec that this is nullable.,
  typeAnnotation?: TypeAnnotationBase | null; // TODO: Not in spec,
  // Flow only:
  variance?: FlowVariance | null; // TODO: Not in spec,
  // TypeScript only: (TODO: Not in spec)
  readonly?: true;
  definite?: true;
}

export interface ClassPrivateProperty extends NodeBase {
  type: "ClassPrivateProperty";
  key: PrivateName;
  value: Expression | undefined | null; // TODO: Not in spec that this is nullable.,
  static: boolean;
  computed: false;
  // Flow and Typescript
  typeAnnotation?: TypeAnnotationBase | null;
  // TypeScript only
  optional?: true;
  definite?: true;
  readonly?: true;
  override?: true;
  // Flow only
  variance?: FlowVariance | null;
}

export interface ClassAccessorProperty
  extends ClassMemberBase,
    DeclarationBase {
  type: "ClassAccessorProperty";
  key: Expression | PrivateName;
  value: Expression | undefined | null;
  typeAnnotation?: TypeAnnotationBase | null; // TODO: Not in spec,
  variance?: FlowVariance | null; // TODO: Not in spec,
  // TypeScript only: (TODO: Not in spec)
  readonly?: true;
  definite?: true;
}

export interface OptClassDeclaration
  extends ClassBase,
    DeclarationBase,
    HasDecorators {
  type: "ClassDeclaration";
  // TypeScript only
  abstract?: true | null;
}

export interface ClassDeclaration extends OptClassDeclaration {
  id: Identifier;
}

export interface ClassExpression extends ClassBase {
  type: "ClassExpression";
}

export interface MetaProperty extends NodeBase {
  type: "MetaProperty";
  meta: Identifier;
  property: Identifier;
}

// Modules

export type ModuleDeclaration = AnyImport | AnyExport;

export type AnyImport = ImportDeclaration | TsImportEqualsDeclaration;

export type AnyExport =
  | ExportNamedDeclaration
  | ExportDefaultDeclaration
  | ExportAllDeclaration
  | TsExportAssignment
  | TsImportEqualsDeclaration
  | TsNamespaceExportDeclaration;

interface ModuleSpecifier extends NodeBase {
  local: Identifier;
}

// Imports

export interface ImportDeclaration extends NodeBase {
  type: "ImportDeclaration";
  // TODO: $ReadOnlyArray
  specifiers: Array<
    ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier
  >;
  source: Literal;
  importKind?: "type" | "typeof" | "value"; // TODO: Not in spec,
  phase?: null | "source" | "defer";
  attributes?: ImportAttribute[];
  // @deprecated
  assertions?: ImportAttribute[];
  module?: boolean;
}

export interface ImportSpecifier extends ModuleSpecifier {
  type: "ImportSpecifier";
  imported: Identifier | StringLiteral;
  importKind?: "type" | "value";
}

export interface ImportDefaultSpecifier extends ModuleSpecifier {
  type: "ImportDefaultSpecifier";
}

export interface ImportNamespaceSpecifier extends ModuleSpecifier {
  type: "ImportNamespaceSpecifier";
}

// Exports

export interface ExportNamedDeclaration extends NodeBase {
  type: "ExportNamedDeclaration";
  declaration: Declaration | undefined | null;
  specifiers: Array<
    ExportSpecifier | ExportDefaultSpecifier | ExportNamespaceSpecifier
  >;
  source: Literal | undefined | null;
  exportKind?: "type" | "value"; // TODO: Not in spec,
  attributes?: ImportAttribute[];
  // @deprecated
  assertions?: ImportAttribute[];
}

export interface ExportSpecifier extends NodeBase {
  type: "ExportSpecifier";
  exported: Identifier | StringLiteral;
  local: Identifier;
  exportKind?: "type" | "value";
}

export interface ExportDefaultSpecifier extends NodeBase {
  type: "ExportDefaultSpecifier";
  exported: Identifier;
}

export interface ExportNamespaceSpecifier extends NodeBase {
  type: "ExportNamespaceSpecifier";
  exported: Identifier | StringLiteral;
}

export interface ExportDefaultDeclaration extends NodeBase {
  type: "ExportDefaultDeclaration";
  declaration:
    | OptFunctionDeclaration
    | OptTSDeclareFunction
    | OptClassDeclaration
    | FlowEnumDeclaration
    | TsInterfaceDeclaration
    | Expression;
}

export interface ExportAllDeclaration extends NodeBase {
  type: "ExportAllDeclaration";
  source: Literal;
  exportKind?: "type" | "value"; // TODO: Not in spec,
  assertions?: ImportAttribute[];
  attributes?: ImportAttribute[];
}

export interface PipelineTopicExpression extends NodeBase {
  type: "PipelineTopicExpression";
  expression: Expression;
}

export interface PipelineBareFunction extends NodeBase {
  type: "PipelineBareFunction";
  callee: Expression;
}

// JSX (TODO: Not in spec)

export type JSXIdentifier = NodeAny<"JSXIdentifier">;
export type JSXNamespacedName = NodeAny<"JSXNamespacedName">;
export type JSXMemberExpression = NodeAny<"JSXMemberExpression">;
export type JSXEmptyExpression = NodeAny<"JSXEmptyExpression">;
export type JSXSpreadChild = NodeAny<"JSXSpreadChild">;
export type JSXExpressionContainer = NodeAny<"JSXExpressionContainer">;
export type JSXAttribute = NodeAny<"JSXAttribute">;
export type JSXSpreadAttribute = NodeAny<"JSXSpreadAttribute">;
export interface JSXOpeningElement extends NodeBase {
  type: "JSXOpeningElement";
  name: JSXNamespacedName | JSXMemberExpression;
  typeParameters?: TypeParameterInstantiationBase | null; // TODO: Not in spec,
  attributes: (JSXAttribute | JSXSpreadAttribute)[];
  selfClosing: boolean;
}
export type JSXClosingElement = NodeAny<"JSXClosingElement">;
export type JSXElement = NodeAny<"JSXElement">;
export type JSXOpeningFragment = NodeAny<"JSXOpeningFragment">;
export type JSXClosingFragment = NodeAny<"JSXClosingFragment">;
export type JSXFragment = NodeAny<"JSXFragment">;
export type JSXElementTag = JSXOpeningElement | JSXClosingElement;
export type JSXFragmentTag = JSXOpeningFragment | JSXClosingFragment;
export type JSXTag = JSXElementTag | JSXFragmentTag;
export type JSXText = NodeAny<"JSXText">;

// Flow/TypeScript common (TODO: Not in spec)

export interface TypeAnnotationBase extends NodeBase {
  typeAnnotation: Node;
}

export interface TypeAnnotation extends NodeBase {
  type: "TypeAnnotation";
  typeAnnotation: FlowType;
}

export interface TsTypeAnnotation extends NodeBase {
  type: "TSTypeAnnotation";
  typeAnnotation: TsType;
}

export interface TypeParameterDeclarationBase extends NodeBase {
  params: Array<TypeParameter | TsTypeParameter>;
}

export interface TypeParameterDeclaration extends TypeParameterDeclarationBase {
  type: "TypeParameterDeclaration";
  params: TypeParameter[];
}

export interface TsTypeParameterDeclaration
  extends TypeParameterDeclarationBase {
  type: "TSTypeParameterDeclaration";
  params: TsTypeParameter[];
}

export interface TypeParameter extends NodeBase {
  type: "TypeParameter";
  name: string;
  default?: TypeAnnotation;
}

export interface TsTypeParameter extends NodeBase {
  type: "TSTypeParameter";
  // TODO(Babel 8): remove string type support
  name: string | Identifier;
  in?: boolean;
  out?: boolean;
  const?: boolean;
  constraint?: TsType;
  default?: TsType;
}

export interface TypeParameterInstantiationBase extends NodeBase {
  params: Node[];
}

export interface TypeParameterInstantiation
  extends TypeParameterInstantiationBase {
  type: "TypeParameterInstantiation";
  params: FlowType[];
}

export interface TsTypeParameterInstantiation
  extends TypeParameterInstantiationBase {
  type: "TSTypeParameterInstantiation";
  params: TsType[];
}

// Flow (TODO: Not in spec)

export interface TypeCastExpressionBase extends NodeBase {
  expression: Expression;
  typeAnnotation: TypeAnnotationBase;
}

export interface TypeCastExpression extends NodeBase {
  type: "TypeCastExpression";
  expression: Expression;
  typeAnnotation: TypeAnnotation;
}

export interface TsTypeCastExpression extends NodeBase {
  type: "TSTypeCastExpression";
  expression: Expression;
  typeAnnotation: TsTypeAnnotation;
}

export type FlowPredicate =
  | NodeAny<"DeclaredPredicate">
  | NodeAny<"InferredPredicate">;
export type FlowDeclare =
  | FlowDeclareClass
  | FlowDeclareExportDeclaration
  | FlowDeclareFunction
  | FlowDeclareVariable
  | FlowDeclareModule
  | FlowDeclareModuleExports
  | FlowDeclareTypeAlias
  | FlowDeclareOpaqueType
  | FlowDeclareInterface;
export type FlowDeclareClass = NodeAny<"DeclareClass">;
export type FlowDeclareExportDeclaration =
  | NodeAny<"DeclareExportDeclaration">
  | NodeAny<"DeclareExportDefaultDeclaration">
  | NodeAny<"DeclareExportAllDeclaration">;
export type FlowDeclareFunction = NodeAny<"DeclareFunction">;
export type FlowDeclareVariable = NodeAny<"DeclareVariable">;
export type FlowDeclareModule = NodeAny<"DeclareModule">;
export type FlowDeclareModuleExports = NodeAny<"DeclareModuleExports">;
export type FlowDeclareTypeAlias = NodeAny<"DeclareTypeAlias">;
export type FlowDeclareOpaqueType = NodeAny<"DeclareOpaqueType">;
export type FlowDeclareInterface = NodeAny<"DeclareInterface">;
export type FlowInterface = NodeAny<"InterfaceDeclaration">;
export type FlowInterfaceExtends = NodeAny<"InterfaceExtends">;
export type FlowTypeAlias = NodeAny<"TypeAlias">;
export type FlowOpaqueType = NodeAny<"OpaqueType">;
export type FlowObjectTypeIndexer = NodeAny<"ObjectTypeIndexer">;
export type FlowObjectTypeInternalSlot = NodeAny<"ObjectTypeInternalSlot">;
export type FlowEnumDeclaration = NodeAny<"EnumDeclaration">;
export type FlowEnumBody = NodeAny<
  "EnumBooleanBody" | "EnumNumberBody" | "EnumStringBody" | "EnumSymbolBody"
>;
export type FlowEnumMember =
  | NodeAny<"EnumBooleanMember">
  | NodeAny<"EnumNumberMember">
  | NodeAny<"EnumStringMember">
  | NodeAny<"EnumDefaultedMember">;
export type FlowFunctionTypeAnnotation = NodeAny<"FunctionTypeAnnotation">;
export type FlowObjectTypeProperty = NodeAny<"ObjectTypeProperty">;
export type FlowObjectTypeSpreadProperty = NodeAny<"ObjectTypeSpreadProperty">;
export type FlowObjectTypeCallProperty = NodeAny<"ObjectTypeCallProperty">;
export type FlowObjectTypeAnnotation = NodeAny<"ObjectTypeAnnotation">;
export type FlowQualifiedTypeIdentifier = NodeAny<"QualifiedTypeIdentifier">;
export type FlowGenericTypeAnnotation = NodeAny<"GenericTypeAnnotation">;
export type FlowTypeofTypeAnnotation = NodeAny<"TypeofTypeAnnotation">;
export type FlowTupleTypeAnnotation = NodeAny<"TupleTypeAnnotation">;
export type FlowFunctionTypeParam = NodeAny<"FunctionTypeParam">;
export type FlowOtherTypeAnnotation = NodeAny<
  | "AnyTypeAnnotation"
  | "BooleanTypeAnnotation"
  | "MixedTypeAnnotation"
  | "EmptyTypeAnnotation"
  | "ExistsTypeAnnotation"
  | "NumberTypeAnnotation"
  | "StringTypeAnnotation"
  | "SymbolTypeAnnotation"
  | "NullLiteralTypeAnnotation"
  | "VoidTypeAnnotation"
  | "ThisTypeAnnotation"
  | "ArrayTypeAnnotation"
  | "NullableTypeAnnotation"
  | "IntersectionTypeAnnotation"
  | "UnionTypeAnnotation"
>;
export type FlowType =
  | FlowFunctionTypeAnnotation
  | FlowObjectTypeAnnotation
  | FlowGenericTypeAnnotation
  | FlowTypeofTypeAnnotation
  | FlowTupleTypeAnnotation
  | FlowInterfaceType
  | FlowIndexedAccessType
  | FlowOptionalIndexedAccessType
  | FlowOtherTypeAnnotation
  | StringLiteralTypeAnnotation
  | BooleanLiteralTypeAnnotation
  | NumberLiteralTypeAnnotation
  | BigIntLiteralTypeAnnotation
  | Identifier;
export type FlowVariance = NodeAny<"Variance">;
export type FlowClassImplements = NodeAny<"ClassImplements">;

export interface FlowInterfaceType extends NodeBase {
  type: "InterfaceTypeAnnotation";
  extends: FlowInterfaceExtends[];
  body: FlowObjectTypeAnnotation;
}

export interface FlowIndexedAccessType extends NodeBase {
  type: "IndexedAccessType";
  objectType: FlowType;
  indexType: FlowType;
}

export interface FlowOptionalIndexedAccessType extends NodeBase {
  type: "OptionalIndexedAccessType";
  objectType: FlowType;
  indexType: FlowType;
  optional: boolean;
}

export interface StringLiteralTypeAnnotation extends NodeBase {
  type: "StringLiteralTypeAnnotation";
  value: string;
}

export interface BooleanLiteralTypeAnnotation extends NodeBase {
  type: "BooleanLiteralTypeAnnotation";
  value: boolean;
}
export interface NumberLiteralTypeAnnotation extends NodeBase {
  type: "NumberLiteralTypeAnnotation";
  value: number;
}

export interface BigIntLiteralTypeAnnotation extends NodeBase {
  type: "BigIntLiteralTypeAnnotation";
  //todo(flow): use bigint when Flow supports BigInt
  value: number;
}

// ESTree
export interface EstreeLiteral extends NodeBase {
  type: "Literal";
  value: any;
  decimal?: string;
}

interface EstreeRegExpLiteralRegex {
  pattern: string;
  flags: string;
}

export interface EstreeRegExpLiteral extends EstreeLiteral {
  regex: EstreeRegExpLiteralRegex;
}

export interface EstreeBigIntLiteral extends EstreeLiteral {
  value: number | null;
  bigint: string;
}

export interface EstreeProperty extends NodeBase {
  type: "Property";
  method: boolean;
  shorthand: boolean;
  key: Expression | EstreePrivateIdentifier;
  computed: boolean;
  value: Expression;
  decorators: Decorator[];
  kind?: "get" | "set" | "init";
  variance?: FlowVariance | null;
}

export interface EstreeMethodDefinition extends NodeBase {
  type: "MethodDefinition";
  static: boolean;
  key: Expression;
  computed: boolean;
  value: FunctionExpression;
  decorators: Decorator[];
  kind?: "get" | "set" | "method";
  variance?: FlowVariance | null;
}

export interface EstreeImportExpression extends NodeBase {
  type: "ImportExpression";
  source: Expression;
  options?: Expression | null;
  /**
   * @deprecated Use options instead
   */
  attributes?: Expression | null;
}

export interface EstreePrivateIdentifier extends NodeBase {
  type: "PrivateIdentifier";
  name: string;
}

export interface EstreePropertyDefinition extends NodeBase {
  type: "PropertyDefinition";
  static: boolean;
  key: Expression | EstreePrivateIdentifier;
  computed: boolean;
  value: Expression;
}

export interface EstreeChainExpression extends NodeBase {
  type: "ChainExpression";
  expression: Expression;
}

// === === === ===
// TypeScript
// === === === ===

// Note: A type named `TsFoo` is based on TypeScript's `FooNode` type,
// defined in https://github.com/Microsoft/TypeScript/blob/master/src/compiler/types.ts
// Differences:
// * Change `NodeArray<T>` to just `$T[]`.
// * Don't give nodes a "modifiers" list; use boolean flags instead,
//   and only allow modifiers that are not considered errors.
// * A property named `type` must be renamed to `typeAnnotation` to avoid conflict with the node's type.
// * Sometimes TypeScript allows to parse something which will be a grammar error later;
//   in @babel/parser these cause exceptions, so the AST format is stricter.

// ================
// Misc
// ================

export interface TSParameterProperty extends HasDecorators {
  // Note: This has decorators instead of its parameter.
  type: "TSParameterProperty";
  // At least one of `accessibility` or `readonly` must be set.
  accessibility?: Accessibility | null;
  readonly?: true | null;
  override?: true | null;
  parameter: Identifier | AssignmentPattern;
}

export interface OptTSDeclareFunction extends FunctionBase, DeclarationBase {
  type: "TSDeclareFunction";
}

export interface TSDeclareFunction extends OptTSDeclareFunction {
  id: Identifier;
}

export interface TSDeclareMethod
  extends FunctionBase,
    ClassMethodOrDeclareMethodCommon {
  type: "TSDeclareMethod";
  kind: MethodKind;
}

export interface TsQualifiedName extends NodeBase {
  type: "TSQualifiedName";
  left: TsEntityName;
  right: Identifier;
}

export type TsEntityName = Identifier | TsQualifiedName;

export type TsSignatureDeclaration =
  | TsCallSignatureDeclaration
  | TsConstructSignatureDeclaration
  | TsMethodSignature
  | TsFunctionType
  | TsConstructorType;

export interface TsSignatureDeclarationOrIndexSignatureBase extends NodeBase {
  // Not using TypeScript's "ParameterDeclaration" here, since it's inconsistent with regular functions.
  params: Array<Identifier | RestElement | ObjectPattern | ArrayPattern>;
  returnType: TsTypeAnnotation | undefined | null;
  // TODO(Babel 8): Remove
  parameters: Array<Identifier | RestElement | ObjectPattern | ArrayPattern>;
  typeAnnotation: TsTypeAnnotation | undefined | null;
}

export interface TsSignatureDeclarationBase
  extends TsSignatureDeclarationOrIndexSignatureBase {
  typeParameters: TsTypeParameterDeclaration | undefined | null;
}

// ================
// TypeScript type members (for type literal / interface / class)
// ================

export type TsTypeElement =
  | TsCallSignatureDeclaration
  | TsConstructSignatureDeclaration
  | TsPropertySignature
  | TsMethodSignature
  | TsIndexSignature;

export interface TsCallSignatureDeclaration extends TsSignatureDeclarationBase {
  type: "TSCallSignatureDeclaration";
}

export interface TsConstructSignatureDeclaration
  extends TsSignatureDeclarationBase {
  type: "TSConstructSignatureDeclaration";
}

export interface TsNamedTypeElementBase extends NodeBase {
  // Not using TypeScript's `PropertyName` here since we don't have a `ComputedPropertyName` node type.
  // This is usually an Identifier but may be e.g. `Symbol.iterator` if `computed` is true.
  key: Expression;
  computed: boolean;
  optional?: true;
}

export interface TsPropertySignature extends TsNamedTypeElementBase {
  type: "TSPropertySignature";
  readonly?: true;
  typeAnnotation?: TsTypeAnnotation;
}

export interface TsMethodSignature
  extends TsSignatureDeclarationBase,
    TsNamedTypeElementBase {
  type: "TSMethodSignature";
  kind: "method" | "get" | "set";
}

// *Not* a ClassMemberBase: Can't have accessibility, can't be abstract, can't be optional.
export interface TsIndexSignature
  extends TsSignatureDeclarationOrIndexSignatureBase {
  readonly?: true;
  static?: true;
  type: "TSIndexSignature";
  // Note: parameters.length must be 1.
}

// ================
// TypeScript types
// ================

export type TsType =
  | TsKeywordType
  | TsThisType
  | TsFunctionOrConstructorType
  | TsTypeReference
  | TsTypeQuery
  | TsTypeLiteral
  | TsArrayType
  | TsTupleType
  | TsOptionalType
  | TsRestType
  | TsUnionOrIntersectionType
  | TsConditionalType
  | TsInferType
  | TsParenthesizedType
  | TsTypeOperator
  | TsIndexedAccessType
  | TsMappedType
  | TsLiteralType // TODO: This probably shouldn't be included here.
  | TsImportType
  | TsTypePredicate;

export type TsTypeBase = NodeBase;

export type TsKeywordTypeType =
  | "TSAnyKeyword"
  | "TSUnknownKeyword"
  | "TSNumberKeyword"
  | "TSObjectKeyword"
  | "TSBooleanKeyword"
  | "TSBigIntKeyword"
  | "TSStringKeyword"
  | "TSSymbolKeyword"
  | "TSVoidKeyword"
  | "TSUndefinedKeyword"
  | "TSNullKeyword"
  | "TSNeverKeyword"
  | "TSIntrinsicKeyword";
export interface TsKeywordType extends TsTypeBase {
  type: TsKeywordTypeType;
}

export interface TsThisType extends TsTypeBase {
  type: "TSThisType";
}

export type TsFunctionOrConstructorType = TsFunctionType | TsConstructorType;

export interface TsFunctionType extends TsTypeBase, TsSignatureDeclarationBase {
  type: "TSFunctionType";
  typeAnnotation: TsTypeAnnotation; // not optional
}

export interface TsConstructorType
  extends TsTypeBase,
    TsSignatureDeclarationBase {
  type: "TSConstructorType";
  typeAnnotation: TsTypeAnnotation;
  abstract: boolean;
}

export interface TsTypeReference extends TsTypeBase {
  type: "TSTypeReference";
  typeName: TsEntityName;
  typeArguments?: TsTypeParameterInstantiation;
  /**
   * @deprecated
   */
  typeParameters?: TsTypeParameterInstantiation;
}

export interface TsTypePredicate extends TsTypeBase {
  type: "TSTypePredicate";
  parameterName: Identifier | TsThisType;
  typeAnnotation: TsTypeAnnotation | null;
  asserts: boolean;
}

// `typeof` operator
export interface TsTypeQuery extends TsTypeBase {
  type: "TSTypeQuery";
  exprName: TsEntityName | TsImportType;
  typeParameters?: TsTypeParameterInstantiation;
}

export interface TsTypeLiteral extends TsTypeBase {
  type: "TSTypeLiteral";
  members: TsTypeElement[];
}

export interface TsArrayType extends TsTypeBase {
  type: "TSArrayType";
  elementType: TsType;
}

export interface TsTupleType extends TsTypeBase {
  type: "TSTupleType";
  elementTypes: Array<TsType | TsNamedTupleMember>;
}

export interface TsNamedTupleMember extends TsTypeBase {
  type: "TSNamedTupleMember";
  label: Identifier;
  optional: boolean;
  elementType: TsType;
}

export interface TsOptionalType extends TsTypeBase {
  type: "TSOptionalType";
  typeAnnotation: TsType;
}

export interface TsRestType extends TsTypeBase {
  type: "TSRestType";
  typeAnnotation: TsType | TsNamedTupleMember;
}

export type TsUnionOrIntersectionType = TsUnionType | TsIntersectionType;

export interface TsUnionOrIntersectionTypeBase extends TsTypeBase {
  types: TsType[];
}

export interface TsUnionType extends TsUnionOrIntersectionTypeBase {
  type: "TSUnionType";
}

export interface TsIntersectionType extends TsUnionOrIntersectionTypeBase {
  type: "TSIntersectionType";
}

export interface TsConditionalType extends TsTypeBase {
  type: "TSConditionalType";
  checkType: TsType;
  extendsType: TsType;
  trueType: TsType;
  falseType: TsType;
}

export interface TsInferType extends TsTypeBase {
  type: "TSInferType";
  typeParameter: TsTypeParameter;
}

export interface TsParenthesizedType extends TsTypeBase {
  type: "TSParenthesizedType";
  typeAnnotation: TsType;
}

export interface TsTypeOperator extends TsTypeBase {
  type: "TSTypeOperator";
  operator: "keyof" | "unique" | "readonly";
  typeAnnotation: TsType;
}

export interface TsIndexedAccessType extends TsTypeBase {
  type: "TSIndexedAccessType";
  objectType: TsType;
  indexType: TsType;
}

export interface TsMappedType extends TsTypeBase {
  type: "TSMappedType";
  key: Identifier;
  constraint: TsType;
  readonly?: true | "+" | "-";
  optional?: true | "+" | "-";
  typeAnnotation: TsType | undefined | null;
  nameType: TsType | undefined | null;
}

export interface TsLiteralType extends TsTypeBase {
  type: "TSLiteralType";
  literal: NumericLiteral | StringLiteral | BooleanLiteral | TemplateLiteral;
}

export interface TsImportType extends TsTypeBase {
  type: "TSImportType";
  argument: StringLiteral;
  qualifier?: TsEntityName;
  typeParameters?: TsTypeParameterInstantiation;
  options?: Expression | null;
}

// ================
// TypeScript declarations
// ================

export interface TsInterfaceDeclaration extends DeclarationBase {
  type: "TSInterfaceDeclaration";
  id: Identifier | undefined | null;
  typeParameters: TsTypeParameterDeclaration | undefined | null;
  extends?: TSInterfaceHeritage[];
  body: TSInterfaceBody;
}

export interface TSInterfaceBody extends NodeBase {
  type: "TSInterfaceBody";
  body: TsTypeElement[];
}

export interface TSHeritageBase extends NodeBase {
  expression: TsEntityName;
  typeParameters?: TsTypeParameterInstantiation;
}

export interface TSClassImplements extends TSHeritageBase {
  type: "TSClassImplements";
}

export interface TSInterfaceHeritage extends TSHeritageBase {
  type: "TSInterfaceHeritage";
}

export interface TsTypeAliasDeclaration extends DeclarationBase {
  type: "TSTypeAliasDeclaration";
  id: Identifier;
  typeParameters: TsTypeParameterDeclaration | undefined | null;
  typeAnnotation: TsType;
}

export interface TsEnumDeclaration extends DeclarationBase {
  type: "TSEnumDeclaration";
  const?: true;
  id: Identifier;
  members: TsEnumMember[];
}

export interface TsEnumMember extends NodeBase {
  type: "TSEnumMember";
  id: Identifier | StringLiteral;
  initializer?: Expression;
}

export interface TsModuleDeclaration extends DeclarationBase {
  type: "TSModuleDeclaration";
  kind: "global" | "module" | "namespace";
  global?: true; // In TypeScript, this is only available through `node.flags`.,
  id: TsModuleName;
  body: TsNamespaceBody;
}

// `namespace A.B { }` is a namespace named `A` with another TsNamespaceDeclaration as its body.
export type TsNamespaceBody = TsModuleBlock | TsNamespaceDeclaration;

export interface TsModuleBlock extends NodeBase {
  type: "TSModuleBlock";
  body: Statement[];
}

export interface TsNamespaceDeclaration extends TsModuleDeclaration {
  id: Identifier;
  body: TsNamespaceBody;
}

export type TsModuleName = TsEntityName | StringLiteral;

export interface TsImportEqualsDeclaration extends NodeBase {
  type: "TSImportEqualsDeclaration";
  isExport: boolean;
  id: Identifier;
  importKind: "type" | "value";
  moduleReference: TsModuleReference;
}

export type TsModuleReference = TsEntityName | TsExternalModuleReference;

export interface TsExternalModuleReference extends NodeBase {
  type: "TSExternalModuleReference";
  expression: StringLiteral;
}

// TypeScript's own parser uses ExportAssignment for both `export default` and `export =`.
// But for @babel/parser, `export default` is an ExportDefaultDeclaration,
// so a TsExportAssignment is always `export =`.
export interface TsExportAssignment extends NodeBase {
  type: "TSExportAssignment";
  expression: Expression;
}

export interface TsNamespaceExportDeclaration extends NodeBase {
  type: "TSNamespaceExportDeclaration";
  id: Identifier;
}

// ================
// TypeScript expressions
// ================

export interface TsTypeAssertionLikeBase extends NodeBase {
  expression: Expression;
  typeAnnotation: TsType;
}

export interface TsAsExpression extends TsTypeAssertionLikeBase {
  type: "TSAsExpression";
}

export interface TsTypeAssertion extends TsTypeAssertionLikeBase {
  type: "TSTypeAssertion";
}

export type TsSatisfiesExpression = TsTypeAssertionLikeBase & {
  type: "TSSatisfiesExpression";
};

export interface TsNonNullExpression extends NodeBase {
  type: "TSNonNullExpression";
  expression: Expression;
}

export interface TsInstantiationExpression extends NodeBase {
  type: "TSInstantiationExpression";
  expression: Expression;
  typeParameters: TsTypeParameterInstantiation;
}

// ================
// Babel placeholders %%foo%%
// ================

export interface Placeholder<N extends PlaceholderTypes = PlaceholderTypes>
  extends NodeBase {
  type: "Placeholder";
  name: Identifier;
  expectedNode: N;
}

// ================
// Other
// ================

export interface ParseSubscriptState {
  optionalChainMember: boolean;
  maybeAsyncArrow: boolean;
  stop: boolean;
}

export interface ParseClassMemberState {
  hadConstructor: boolean;
  hadSuperClass: boolean;
}

export type Node =
  | ArgumentPlaceholder
  | ArrayExpression
  | ArrayPattern
  | ArrowFunctionExpression
  | AssignmentExpression
  | AssignmentPattern
  | AwaitExpression
  | BigIntLiteral
  | BigIntLiteralTypeAnnotation
  | BinaryExpression
  | BindExpression
  | BlockStatement
  | BooleanLiteral
  | BooleanLiteralTypeAnnotation
  | BreakStatement
  | CallExpression
  | CatchClause
  | ClassAccessorProperty
  | ClassBody
  | ClassDeclaration
  | ClassExpression
  | ClassMethod
  | ClassPrivateMethod
  | ClassPrivateProperty
  | ClassProperty
  | ConditionalExpression
  | ContinueStatement
  | DebuggerStatement
  | DecimalLiteral
  | Decorator
  | Directive
  | DirectiveLiteral
  | DoExpression
  | DoWhileStatement
  | EmptyStatement
  | EstreeChainExpression
  | EstreeLiteral
  | EstreeMethodDefinition
  | EstreePrivateIdentifier
  | EstreeProperty
  | EstreePropertyDefinition
  | ExportAllDeclaration
  | ExportDefaultDeclaration
  | ExportDefaultSpecifier
  | ExportNamedDeclaration
  | ExportNamespaceSpecifier
  | ExportSpecifier
  | ExpressionStatement
  | File
  | FlowClassImplements
  | FlowDeclareClass
  | FlowDeclareExportDeclaration
  | FlowDeclareFunction
  | FlowDeclareInterface
  | FlowDeclareModule
  | FlowDeclareModuleExports
  | FlowDeclareOpaqueType
  | FlowDeclareTypeAlias
  | FlowDeclareVariable
  | FlowEnumBody
  | FlowEnumDeclaration
  | FlowEnumMember
  | FlowFunctionTypeAnnotation
  | FlowFunctionTypeParam
  | FlowGenericTypeAnnotation
  | FlowIndexedAccessType
  | FlowInterface
  | FlowInterfaceExtends
  | FlowInterfaceType
  | FlowObjectTypeAnnotation
  | FlowObjectTypeCallProperty
  | FlowObjectTypeIndexer
  | FlowObjectTypeInternalSlot
  | FlowObjectTypeProperty
  | FlowObjectTypeSpreadProperty
  | FlowOpaqueType
  | FlowOptionalIndexedAccessType
  | FlowOtherTypeAnnotation
  | FlowPredicate
  | FlowPredicate
  | FlowQualifiedTypeIdentifier
  | FlowTupleTypeAnnotation
  | FlowTypeAlias
  | FlowTypeofTypeAnnotation
  | FlowVariance
  | ForInStatement
  | ForOfStatement
  | ForStatement
  | FunctionDeclaration
  | FunctionExpression
  | Identifier
  | IfStatement
  | Import
  | ImportAttribute
  | ImportDeclaration
  | ImportDefaultSpecifier
  | ImportExpression
  | ImportExpression
  | ImportNamespaceSpecifier
  | ImportSpecifier
  | InterpreterDirective
  | JSXAttribute
  | JSXClosingElement
  | JSXClosingFragment
  | JSXElement
  | JSXEmptyExpression
  | JSXExpressionContainer
  | JSXFragment
  | JSXIdentifier
  | JSXMemberExpression
  | JSXNamespacedName
  | JSXOpeningElement
  | JSXOpeningFragment
  | JSXSpreadAttribute
  | JSXSpreadChild
  | JSXText
  | LabeledStatement
  | Literal
  | LogicalExpression
  | MemberExpression
  | MetaProperty
  | ModuleExpression
  | NewExpression
  | NullLiteral
  | NumberLiteralTypeAnnotation
  | NumericLiteral
  | ObjectExpression
  | ObjectMethod
  | ObjectPattern
  | ObjectProperty
  | OptionalCallExpression
  | OptionalMemberExpression
  | ParenthesizedExpression
  | PipelineBareAwaitedFunctionBody
  | PipelineBareConstructorBody
  | PipelineBareFunction
  | PipelineBareFunctionBody
  | PipelineBody
  | PipelinePrimaryTopicReference
  | PipelineTopicBody
  | PipelineTopicExpression
  | Placeholder
  | PrivateName
  | Program
  | RecordExpression
  | RegExpLiteral
  | RestElement
  | ReturnStatement
  | SequenceExpression
  | SpreadElement
  | StaticBlock
  | StringLiteral
  | StringLiteralTypeAnnotation
  | Super
  | SwitchCase
  | SwitchStatement
  | TSDeclareFunction
  | TSDeclareMethod
  | TSInterfaceBody
  | TSParameterProperty
  | TaggedTemplateExpression
  | TemplateElement
  | TemplateLiteral
  | ThisExpression
  | ThrowStatement
  | TopicReference
  | TryStatement
  | TsArrayType
  | TsAsExpression
  | TsCallSignatureDeclaration
  | TsConditionalType
  | TsConstructSignatureDeclaration
  | TsConstructorType
  | TsEnumDeclaration
  | TsEnumMember
  | TsExportAssignment
  | TSClassImplements
  | TSInterfaceHeritage
  | TsExternalModuleReference
  | TsFunctionType
  | TsImportEqualsDeclaration
  | TsImportType
  | TsIndexSignature
  | TsIndexedAccessType
  | TsInferType
  | TsInstantiationExpression
  | TsInterfaceDeclaration
  | TsIntersectionType
  | TsKeywordType
  | TsLiteralType
  | TsMappedType
  | TsMethodSignature
  | TsModuleBlock
  | TsModuleDeclaration
  | TsNamedTupleMember
  | TsNamespaceExportDeclaration
  | TsNonNullExpression
  | TsOptionalType
  | TsParenthesizedType
  | TsPropertySignature
  | TsQualifiedName
  | TsRestType
  | TsSatisfiesExpression
  | TsThisType
  | TsTupleType
  | TsTypeAliasDeclaration
  | TsTypeAnnotation
  | TsTypeAssertion
  | TsTypeCastExpression
  | TsTypeLiteral
  | TsTypeOperator
  | TsTypeParameter
  | TsTypeParameterDeclaration
  | TsTypeParameterInstantiation
  | TsTypePredicate
  | TsTypeQuery
  | TsTypeReference
  | TsUnionType
  | TupleExpression
  | TypeAnnotation
  | TypeCastExpression
  | TypeParameter
  | TypeParameterDeclaration
  | TypeParameterInstantiation
  | UnaryExpression
  | UpdateExpression
  | VariableDeclaration
  | VariableDeclarator
  | WhileStatement
  | WithStatement
  | YieldExpression;
