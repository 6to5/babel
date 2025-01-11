/*
 * This file is auto-generated! Do not modify it directly.
 * To re-generate run 'make build'
 */
import type * as t from "@babel/types";
import type NodePath from "../index";

type Opts<Obj> = Partial<{
  [Prop in keyof Obj]: Obj[Prop] extends t.Node
    ? t.Node
    : Obj[Prop] extends t.Node[]
      ? t.Node[]
      : Obj[Prop];
}>;

export interface NodePathAssertions {
  assertAccessor(opts?: Opts<t.Accessor>): asserts this is NodePath<t.Accessor>;
  assertAnyTypeAnnotation(
    opts?: Opts<t.AnyTypeAnnotation>,
  ): asserts this is NodePath<t.AnyTypeAnnotation>;
  assertArgumentPlaceholder(
    opts?: Opts<t.ArgumentPlaceholder>,
  ): asserts this is NodePath<t.ArgumentPlaceholder>;
  assertArrayExpression(
    opts?: Opts<t.ArrayExpression>,
  ): asserts this is NodePath<t.ArrayExpression>;
  assertArrayPattern(
    opts?: Opts<t.ArrayPattern>,
  ): asserts this is NodePath<t.ArrayPattern>;
  assertArrayTypeAnnotation(
    opts?: Opts<t.ArrayTypeAnnotation>,
  ): asserts this is NodePath<t.ArrayTypeAnnotation>;
  assertArrowFunctionExpression(
    opts?: Opts<t.ArrowFunctionExpression>,
  ): asserts this is NodePath<t.ArrowFunctionExpression>;
  assertAssignmentExpression(
    opts?: Opts<t.AssignmentExpression>,
  ): asserts this is NodePath<t.AssignmentExpression>;
  assertAssignmentPattern(
    opts?: Opts<t.AssignmentPattern>,
  ): asserts this is NodePath<t.AssignmentPattern>;
  assertAwaitExpression(
    opts?: Opts<t.AwaitExpression>,
  ): asserts this is NodePath<t.AwaitExpression>;
  assertBigIntLiteral(
    opts?: Opts<t.BigIntLiteral>,
  ): asserts this is NodePath<t.BigIntLiteral>;
  assertBinary(opts?: Opts<t.Binary>): asserts this is NodePath<t.Binary>;
  assertBinaryExpression(
    opts?: Opts<t.BinaryExpression>,
  ): asserts this is NodePath<t.BinaryExpression>;
  assertBindExpression(
    opts?: Opts<t.BindExpression>,
  ): asserts this is NodePath<t.BindExpression>;
  assertBlock(opts?: Opts<t.Block>): asserts this is NodePath<t.Block>;
  assertBlockParent(
    opts?: Opts<t.BlockParent>,
  ): asserts this is NodePath<t.BlockParent>;
  assertBlockStatement(
    opts?: Opts<t.BlockStatement>,
  ): asserts this is NodePath<t.BlockStatement>;
  assertBooleanLiteral(
    opts?: Opts<t.BooleanLiteral>,
  ): asserts this is NodePath<t.BooleanLiteral>;
  assertBooleanLiteralTypeAnnotation(
    opts?: Opts<t.BooleanLiteralTypeAnnotation>,
  ): asserts this is NodePath<t.BooleanLiteralTypeAnnotation>;
  assertBooleanTypeAnnotation(
    opts?: Opts<t.BooleanTypeAnnotation>,
  ): asserts this is NodePath<t.BooleanTypeAnnotation>;
  assertBreakStatement(
    opts?: Opts<t.BreakStatement>,
  ): asserts this is NodePath<t.BreakStatement>;
  assertCallExpression(
    opts?: Opts<t.CallExpression>,
  ): asserts this is NodePath<t.CallExpression>;
  assertCatchClause(
    opts?: Opts<t.CatchClause>,
  ): asserts this is NodePath<t.CatchClause>;
  assertClass(opts?: Opts<t.Class>): asserts this is NodePath<t.Class>;
  assertClassAccessorProperty(
    opts?: Opts<t.ClassAccessorProperty>,
  ): asserts this is NodePath<t.ClassAccessorProperty>;
  assertClassBody(
    opts?: Opts<t.ClassBody>,
  ): asserts this is NodePath<t.ClassBody>;
  assertClassDeclaration(
    opts?: Opts<t.ClassDeclaration>,
  ): asserts this is NodePath<t.ClassDeclaration>;
  assertClassExpression(
    opts?: Opts<t.ClassExpression>,
  ): asserts this is NodePath<t.ClassExpression>;
  assertClassImplements(
    opts?: Opts<t.ClassImplements>,
  ): asserts this is NodePath<t.ClassImplements>;
  assertClassMethod(
    opts?: Opts<t.ClassMethod>,
  ): asserts this is NodePath<t.ClassMethod>;
  assertClassPrivateMethod(
    opts?: Opts<t.ClassPrivateMethod>,
  ): asserts this is NodePath<t.ClassPrivateMethod>;
  assertClassPrivateProperty(
    opts?: Opts<t.ClassPrivateProperty>,
  ): asserts this is NodePath<t.ClassPrivateProperty>;
  assertClassProperty(
    opts?: Opts<t.ClassProperty>,
  ): asserts this is NodePath<t.ClassProperty>;
  assertCompletionStatement(
    opts?: Opts<t.CompletionStatement>,
  ): asserts this is NodePath<t.CompletionStatement>;
  assertConditional(
    opts?: Opts<t.Conditional>,
  ): asserts this is NodePath<t.Conditional>;
  assertConditionalExpression(
    opts?: Opts<t.ConditionalExpression>,
  ): asserts this is NodePath<t.ConditionalExpression>;
  assertContinueStatement(
    opts?: Opts<t.ContinueStatement>,
  ): asserts this is NodePath<t.ContinueStatement>;
  assertDebuggerStatement(
    opts?: Opts<t.DebuggerStatement>,
  ): asserts this is NodePath<t.DebuggerStatement>;
  assertDecimalLiteral(
    opts?: Opts<t.DecimalLiteral>,
  ): asserts this is NodePath<t.DecimalLiteral>;
  assertDeclaration(
    opts?: Opts<t.Declaration>,
  ): asserts this is NodePath<t.Declaration>;
  assertDeclareClass(
    opts?: Opts<t.DeclareClass>,
  ): asserts this is NodePath<t.DeclareClass>;
  assertDeclareExportAllDeclaration(
    opts?: Opts<t.DeclareExportAllDeclaration>,
  ): asserts this is NodePath<t.DeclareExportAllDeclaration>;
  assertDeclareExportDeclaration(
    opts?: Opts<t.DeclareExportDeclaration>,
  ): asserts this is NodePath<t.DeclareExportDeclaration>;
  assertDeclareFunction(
    opts?: Opts<t.DeclareFunction>,
  ): asserts this is NodePath<t.DeclareFunction>;
  assertDeclareInterface(
    opts?: Opts<t.DeclareInterface>,
  ): asserts this is NodePath<t.DeclareInterface>;
  assertDeclareModule(
    opts?: Opts<t.DeclareModule>,
  ): asserts this is NodePath<t.DeclareModule>;
  assertDeclareModuleExports(
    opts?: Opts<t.DeclareModuleExports>,
  ): asserts this is NodePath<t.DeclareModuleExports>;
  assertDeclareOpaqueType(
    opts?: Opts<t.DeclareOpaqueType>,
  ): asserts this is NodePath<t.DeclareOpaqueType>;
  assertDeclareTypeAlias(
    opts?: Opts<t.DeclareTypeAlias>,
  ): asserts this is NodePath<t.DeclareTypeAlias>;
  assertDeclareVariable(
    opts?: Opts<t.DeclareVariable>,
  ): asserts this is NodePath<t.DeclareVariable>;
  assertDeclaredPredicate(
    opts?: Opts<t.DeclaredPredicate>,
  ): asserts this is NodePath<t.DeclaredPredicate>;
  assertDecorator(
    opts?: Opts<t.Decorator>,
  ): asserts this is NodePath<t.Decorator>;
  assertDirective(
    opts?: Opts<t.Directive>,
  ): asserts this is NodePath<t.Directive>;
  assertDirectiveLiteral(
    opts?: Opts<t.DirectiveLiteral>,
  ): asserts this is NodePath<t.DirectiveLiteral>;
  assertDoExpression(
    opts?: Opts<t.DoExpression>,
  ): asserts this is NodePath<t.DoExpression>;
  assertDoWhileStatement(
    opts?: Opts<t.DoWhileStatement>,
  ): asserts this is NodePath<t.DoWhileStatement>;
  assertEmptyStatement(
    opts?: Opts<t.EmptyStatement>,
  ): asserts this is NodePath<t.EmptyStatement>;
  assertEmptyTypeAnnotation(
    opts?: Opts<t.EmptyTypeAnnotation>,
  ): asserts this is NodePath<t.EmptyTypeAnnotation>;
  assertEnumBody(opts?: Opts<t.EnumBody>): asserts this is NodePath<t.EnumBody>;
  assertEnumBooleanBody(
    opts?: Opts<t.EnumBooleanBody>,
  ): asserts this is NodePath<t.EnumBooleanBody>;
  assertEnumBooleanMember(
    opts?: Opts<t.EnumBooleanMember>,
  ): asserts this is NodePath<t.EnumBooleanMember>;
  assertEnumDeclaration(
    opts?: Opts<t.EnumDeclaration>,
  ): asserts this is NodePath<t.EnumDeclaration>;
  assertEnumDefaultedMember(
    opts?: Opts<t.EnumDefaultedMember>,
  ): asserts this is NodePath<t.EnumDefaultedMember>;
  assertEnumMember(
    opts?: Opts<t.EnumMember>,
  ): asserts this is NodePath<t.EnumMember>;
  assertEnumNumberBody(
    opts?: Opts<t.EnumNumberBody>,
  ): asserts this is NodePath<t.EnumNumberBody>;
  assertEnumNumberMember(
    opts?: Opts<t.EnumNumberMember>,
  ): asserts this is NodePath<t.EnumNumberMember>;
  assertEnumStringBody(
    opts?: Opts<t.EnumStringBody>,
  ): asserts this is NodePath<t.EnumStringBody>;
  assertEnumStringMember(
    opts?: Opts<t.EnumStringMember>,
  ): asserts this is NodePath<t.EnumStringMember>;
  assertEnumSymbolBody(
    opts?: Opts<t.EnumSymbolBody>,
  ): asserts this is NodePath<t.EnumSymbolBody>;
  assertExistsTypeAnnotation(
    opts?: Opts<t.ExistsTypeAnnotation>,
  ): asserts this is NodePath<t.ExistsTypeAnnotation>;
  assertExportAllDeclaration(
    opts?: Opts<t.ExportAllDeclaration>,
  ): asserts this is NodePath<t.ExportAllDeclaration>;
  assertExportDeclaration(
    opts?: Opts<t.ExportDeclaration>,
  ): asserts this is NodePath<t.ExportDeclaration>;
  assertExportDefaultDeclaration(
    opts?: Opts<t.ExportDefaultDeclaration>,
  ): asserts this is NodePath<t.ExportDefaultDeclaration>;
  assertExportDefaultSpecifier(
    opts?: Opts<t.ExportDefaultSpecifier>,
  ): asserts this is NodePath<t.ExportDefaultSpecifier>;
  assertExportNamedDeclaration(
    opts?: Opts<t.ExportNamedDeclaration>,
  ): asserts this is NodePath<t.ExportNamedDeclaration>;
  assertExportNamespaceSpecifier(
    opts?: Opts<t.ExportNamespaceSpecifier>,
  ): asserts this is NodePath<t.ExportNamespaceSpecifier>;
  assertExportSpecifier(
    opts?: Opts<t.ExportSpecifier>,
  ): asserts this is NodePath<t.ExportSpecifier>;
  assertExpression(
    opts?: Opts<t.Expression>,
  ): asserts this is NodePath<t.Expression>;
  assertExpressionStatement(
    opts?: Opts<t.ExpressionStatement>,
  ): asserts this is NodePath<t.ExpressionStatement>;
  assertExpressionWrapper(
    opts?: Opts<t.ExpressionWrapper>,
  ): asserts this is NodePath<t.ExpressionWrapper>;
  assertFile(opts?: Opts<t.File>): asserts this is NodePath<t.File>;
  assertFlow(opts?: Opts<t.Flow>): asserts this is NodePath<t.Flow>;
  assertFlowBaseAnnotation(
    opts?: Opts<t.FlowBaseAnnotation>,
  ): asserts this is NodePath<t.FlowBaseAnnotation>;
  assertFlowDeclaration(
    opts?: Opts<t.FlowDeclaration>,
  ): asserts this is NodePath<t.FlowDeclaration>;
  assertFlowPredicate(
    opts?: Opts<t.FlowPredicate>,
  ): asserts this is NodePath<t.FlowPredicate>;
  assertFlowType(opts?: Opts<t.FlowType>): asserts this is NodePath<t.FlowType>;
  assertFor(opts?: Opts<t.For>): asserts this is NodePath<t.For>;
  assertForInStatement(
    opts?: Opts<t.ForInStatement>,
  ): asserts this is NodePath<t.ForInStatement>;
  assertForOfStatement(
    opts?: Opts<t.ForOfStatement>,
  ): asserts this is NodePath<t.ForOfStatement>;
  assertForStatement(
    opts?: Opts<t.ForStatement>,
  ): asserts this is NodePath<t.ForStatement>;
  assertForXStatement(
    opts?: Opts<t.ForXStatement>,
  ): asserts this is NodePath<t.ForXStatement>;
  assertFunction(opts?: Opts<t.Function>): asserts this is NodePath<t.Function>;
  assertFunctionDeclaration(
    opts?: Opts<t.FunctionDeclaration>,
  ): asserts this is NodePath<t.FunctionDeclaration>;
  assertFunctionExpression(
    opts?: Opts<t.FunctionExpression>,
  ): asserts this is NodePath<t.FunctionExpression>;
  assertFunctionParent(
    opts?: Opts<t.FunctionParent>,
  ): asserts this is NodePath<t.FunctionParent>;
  assertFunctionTypeAnnotation(
    opts?: Opts<t.FunctionTypeAnnotation>,
  ): asserts this is NodePath<t.FunctionTypeAnnotation>;
  assertFunctionTypeParam(
    opts?: Opts<t.FunctionTypeParam>,
  ): asserts this is NodePath<t.FunctionTypeParam>;
  assertGenericTypeAnnotation(
    opts?: Opts<t.GenericTypeAnnotation>,
  ): asserts this is NodePath<t.GenericTypeAnnotation>;
  assertIdentifier(
    opts?: Opts<t.Identifier>,
  ): asserts this is NodePath<t.Identifier>;
  assertIfStatement(
    opts?: Opts<t.IfStatement>,
  ): asserts this is NodePath<t.IfStatement>;
  assertImmutable(
    opts?: Opts<t.Immutable>,
  ): asserts this is NodePath<t.Immutable>;
  assertImport(opts?: Opts<t.Import>): asserts this is NodePath<t.Import>;
  assertImportAttribute(
    opts?: Opts<t.ImportAttribute>,
  ): asserts this is NodePath<t.ImportAttribute>;
  assertImportDeclaration(
    opts?: Opts<t.ImportDeclaration>,
  ): asserts this is NodePath<t.ImportDeclaration>;
  assertImportDefaultSpecifier(
    opts?: Opts<t.ImportDefaultSpecifier>,
  ): asserts this is NodePath<t.ImportDefaultSpecifier>;
  assertImportExpression(
    opts?: Opts<t.ImportExpression>,
  ): asserts this is NodePath<t.ImportExpression>;
  assertImportNamespaceSpecifier(
    opts?: Opts<t.ImportNamespaceSpecifier>,
  ): asserts this is NodePath<t.ImportNamespaceSpecifier>;
  assertImportOrExportDeclaration(
    opts?: Opts<t.ImportOrExportDeclaration>,
  ): asserts this is NodePath<t.ImportOrExportDeclaration>;
  assertImportSpecifier(
    opts?: Opts<t.ImportSpecifier>,
  ): asserts this is NodePath<t.ImportSpecifier>;
  assertIndexedAccessType(
    opts?: Opts<t.IndexedAccessType>,
  ): asserts this is NodePath<t.IndexedAccessType>;
  assertInferredPredicate(
    opts?: Opts<t.InferredPredicate>,
  ): asserts this is NodePath<t.InferredPredicate>;
  assertInterfaceDeclaration(
    opts?: Opts<t.InterfaceDeclaration>,
  ): asserts this is NodePath<t.InterfaceDeclaration>;
  assertInterfaceExtends(
    opts?: Opts<t.InterfaceExtends>,
  ): asserts this is NodePath<t.InterfaceExtends>;
  assertInterfaceTypeAnnotation(
    opts?: Opts<t.InterfaceTypeAnnotation>,
  ): asserts this is NodePath<t.InterfaceTypeAnnotation>;
  assertInterpreterDirective(
    opts?: Opts<t.InterpreterDirective>,
  ): asserts this is NodePath<t.InterpreterDirective>;
  assertIntersectionTypeAnnotation(
    opts?: Opts<t.IntersectionTypeAnnotation>,
  ): asserts this is NodePath<t.IntersectionTypeAnnotation>;
  assertJSX(opts?: Opts<t.JSX>): asserts this is NodePath<t.JSX>;
  assertJSXAttribute(
    opts?: Opts<t.JSXAttribute>,
  ): asserts this is NodePath<t.JSXAttribute>;
  assertJSXClosingElement(
    opts?: Opts<t.JSXClosingElement>,
  ): asserts this is NodePath<t.JSXClosingElement>;
  assertJSXClosingFragment(
    opts?: Opts<t.JSXClosingFragment>,
  ): asserts this is NodePath<t.JSXClosingFragment>;
  assertJSXElement(
    opts?: Opts<t.JSXElement>,
  ): asserts this is NodePath<t.JSXElement>;
  assertJSXEmptyExpression(
    opts?: Opts<t.JSXEmptyExpression>,
  ): asserts this is NodePath<t.JSXEmptyExpression>;
  assertJSXExpressionContainer(
    opts?: Opts<t.JSXExpressionContainer>,
  ): asserts this is NodePath<t.JSXExpressionContainer>;
  assertJSXFragment(
    opts?: Opts<t.JSXFragment>,
  ): asserts this is NodePath<t.JSXFragment>;
  assertJSXIdentifier(
    opts?: Opts<t.JSXIdentifier>,
  ): asserts this is NodePath<t.JSXIdentifier>;
  assertJSXMemberExpression(
    opts?: Opts<t.JSXMemberExpression>,
  ): asserts this is NodePath<t.JSXMemberExpression>;
  assertJSXNamespacedName(
    opts?: Opts<t.JSXNamespacedName>,
  ): asserts this is NodePath<t.JSXNamespacedName>;
  assertJSXOpeningElement(
    opts?: Opts<t.JSXOpeningElement>,
  ): asserts this is NodePath<t.JSXOpeningElement>;
  assertJSXOpeningFragment(
    opts?: Opts<t.JSXOpeningFragment>,
  ): asserts this is NodePath<t.JSXOpeningFragment>;
  assertJSXSpreadAttribute(
    opts?: Opts<t.JSXSpreadAttribute>,
  ): asserts this is NodePath<t.JSXSpreadAttribute>;
  assertJSXSpreadChild(
    opts?: Opts<t.JSXSpreadChild>,
  ): asserts this is NodePath<t.JSXSpreadChild>;
  assertJSXText(opts?: Opts<t.JSXText>): asserts this is NodePath<t.JSXText>;
  assertLVal(opts?: Opts<t.LVal>): asserts this is NodePath<t.LVal>;
  assertLabeledStatement(
    opts?: Opts<t.LabeledStatement>,
  ): asserts this is NodePath<t.LabeledStatement>;
  assertLiteral(opts?: Opts<t.Literal>): asserts this is NodePath<t.Literal>;
  assertLogicalExpression(
    opts?: Opts<t.LogicalExpression>,
  ): asserts this is NodePath<t.LogicalExpression>;
  assertLoop(opts?: Opts<t.Loop>): asserts this is NodePath<t.Loop>;
  assertMemberExpression(
    opts?: Opts<t.MemberExpression>,
  ): asserts this is NodePath<t.MemberExpression>;
  assertMetaProperty(
    opts?: Opts<t.MetaProperty>,
  ): asserts this is NodePath<t.MetaProperty>;
  assertMethod(opts?: Opts<t.Method>): asserts this is NodePath<t.Method>;
  assertMiscellaneous(
    opts?: Opts<t.Miscellaneous>,
  ): asserts this is NodePath<t.Miscellaneous>;
  assertMixedTypeAnnotation(
    opts?: Opts<t.MixedTypeAnnotation>,
  ): asserts this is NodePath<t.MixedTypeAnnotation>;
  assertModuleDeclaration(
    opts?: Opts<t.ModuleDeclaration>,
  ): asserts this is NodePath<t.ModuleDeclaration>;
  assertModuleExpression(
    opts?: Opts<t.ModuleExpression>,
  ): asserts this is NodePath<t.ModuleExpression>;
  assertModuleSpecifier(
    opts?: Opts<t.ModuleSpecifier>,
  ): asserts this is NodePath<t.ModuleSpecifier>;
  assertNewExpression(
    opts?: Opts<t.NewExpression>,
  ): asserts this is NodePath<t.NewExpression>;
  assertNoop(opts?: Opts<t.Noop>): asserts this is NodePath<t.Noop>;
  assertNullLiteral(
    opts?: Opts<t.NullLiteral>,
  ): asserts this is NodePath<t.NullLiteral>;
  assertNullLiteralTypeAnnotation(
    opts?: Opts<t.NullLiteralTypeAnnotation>,
  ): asserts this is NodePath<t.NullLiteralTypeAnnotation>;
  assertNullableTypeAnnotation(
    opts?: Opts<t.NullableTypeAnnotation>,
  ): asserts this is NodePath<t.NullableTypeAnnotation>;
  assertNumberLiteral(
    opts?: Opts<t.NumberLiteral>,
  ): asserts this is NodePath<t.NumberLiteral>;
  assertNumberLiteralTypeAnnotation(
    opts?: Opts<t.NumberLiteralTypeAnnotation>,
  ): asserts this is NodePath<t.NumberLiteralTypeAnnotation>;
  assertNumberTypeAnnotation(
    opts?: Opts<t.NumberTypeAnnotation>,
  ): asserts this is NodePath<t.NumberTypeAnnotation>;
  assertNumericLiteral(
    opts?: Opts<t.NumericLiteral>,
  ): asserts this is NodePath<t.NumericLiteral>;
  assertObjectExpression(
    opts?: Opts<t.ObjectExpression>,
  ): asserts this is NodePath<t.ObjectExpression>;
  assertObjectMember(
    opts?: Opts<t.ObjectMember>,
  ): asserts this is NodePath<t.ObjectMember>;
  assertObjectMethod(
    opts?: Opts<t.ObjectMethod>,
  ): asserts this is NodePath<t.ObjectMethod>;
  assertObjectPattern(
    opts?: Opts<t.ObjectPattern>,
  ): asserts this is NodePath<t.ObjectPattern>;
  assertObjectProperty(
    opts?: Opts<t.ObjectProperty>,
  ): asserts this is NodePath<t.ObjectProperty>;
  assertObjectTypeAnnotation(
    opts?: Opts<t.ObjectTypeAnnotation>,
  ): asserts this is NodePath<t.ObjectTypeAnnotation>;
  assertObjectTypeCallProperty(
    opts?: Opts<t.ObjectTypeCallProperty>,
  ): asserts this is NodePath<t.ObjectTypeCallProperty>;
  assertObjectTypeIndexer(
    opts?: Opts<t.ObjectTypeIndexer>,
  ): asserts this is NodePath<t.ObjectTypeIndexer>;
  assertObjectTypeInternalSlot(
    opts?: Opts<t.ObjectTypeInternalSlot>,
  ): asserts this is NodePath<t.ObjectTypeInternalSlot>;
  assertObjectTypeProperty(
    opts?: Opts<t.ObjectTypeProperty>,
  ): asserts this is NodePath<t.ObjectTypeProperty>;
  assertObjectTypeSpreadProperty(
    opts?: Opts<t.ObjectTypeSpreadProperty>,
  ): asserts this is NodePath<t.ObjectTypeSpreadProperty>;
  assertOpaqueType(
    opts?: Opts<t.OpaqueType>,
  ): asserts this is NodePath<t.OpaqueType>;
  assertOptionalCallExpression(
    opts?: Opts<t.OptionalCallExpression>,
  ): asserts this is NodePath<t.OptionalCallExpression>;
  assertOptionalIndexedAccessType(
    opts?: Opts<t.OptionalIndexedAccessType>,
  ): asserts this is NodePath<t.OptionalIndexedAccessType>;
  assertOptionalMemberExpression(
    opts?: Opts<t.OptionalMemberExpression>,
  ): asserts this is NodePath<t.OptionalMemberExpression>;
  assertParenthesizedExpression(
    opts?: Opts<t.ParenthesizedExpression>,
  ): asserts this is NodePath<t.ParenthesizedExpression>;
  assertPattern(opts?: Opts<t.Pattern>): asserts this is NodePath<t.Pattern>;
  assertPatternLike(
    opts?: Opts<t.PatternLike>,
  ): asserts this is NodePath<t.PatternLike>;
  assertPipelineBareFunction(
    opts?: Opts<t.PipelineBareFunction>,
  ): asserts this is NodePath<t.PipelineBareFunction>;
  assertPipelinePrimaryTopicReference(
    opts?: Opts<t.PipelinePrimaryTopicReference>,
  ): asserts this is NodePath<t.PipelinePrimaryTopicReference>;
  assertPipelineTopicExpression(
    opts?: Opts<t.PipelineTopicExpression>,
  ): asserts this is NodePath<t.PipelineTopicExpression>;
  assertPlaceholder(
    opts?: Opts<t.Placeholder>,
  ): asserts this is NodePath<t.Placeholder>;
  assertPrivate(opts?: Opts<t.Private>): asserts this is NodePath<t.Private>;
  assertPrivateName(
    opts?: Opts<t.PrivateName>,
  ): asserts this is NodePath<t.PrivateName>;
  assertProgram(opts?: Opts<t.Program>): asserts this is NodePath<t.Program>;
  assertProperty(opts?: Opts<t.Property>): asserts this is NodePath<t.Property>;
  assertPureish(opts?: Opts<t.Pureish>): asserts this is NodePath<t.Pureish>;
  assertQualifiedTypeIdentifier(
    opts?: Opts<t.QualifiedTypeIdentifier>,
  ): asserts this is NodePath<t.QualifiedTypeIdentifier>;
  assertRecordExpression(
    opts?: Opts<t.RecordExpression>,
  ): asserts this is NodePath<t.RecordExpression>;
  assertRegExpLiteral(
    opts?: Opts<t.RegExpLiteral>,
  ): asserts this is NodePath<t.RegExpLiteral>;
  assertRegexLiteral(
    opts?: Opts<t.RegexLiteral>,
  ): asserts this is NodePath<t.RegexLiteral>;
  assertRestElement(
    opts?: Opts<t.RestElement>,
  ): asserts this is NodePath<t.RestElement>;
  assertRestProperty(
    opts?: Opts<t.RestProperty>,
  ): asserts this is NodePath<t.RestProperty>;
  assertReturnStatement(
    opts?: Opts<t.ReturnStatement>,
  ): asserts this is NodePath<t.ReturnStatement>;
  assertScopable(opts?: Opts<t.Scopable>): asserts this is NodePath<t.Scopable>;
  assertSequenceExpression(
    opts?: Opts<t.SequenceExpression>,
  ): asserts this is NodePath<t.SequenceExpression>;
  assertSpreadElement(
    opts?: Opts<t.SpreadElement>,
  ): asserts this is NodePath<t.SpreadElement>;
  assertSpreadProperty(
    opts?: Opts<t.SpreadProperty>,
  ): asserts this is NodePath<t.SpreadProperty>;
  assertStandardized(
    opts?: Opts<t.Standardized>,
  ): asserts this is NodePath<t.Standardized>;
  assertStatement(
    opts?: Opts<t.Statement>,
  ): asserts this is NodePath<t.Statement>;
  assertStaticBlock(
    opts?: Opts<t.StaticBlock>,
  ): asserts this is NodePath<t.StaticBlock>;
  assertStringLiteral(
    opts?: Opts<t.StringLiteral>,
  ): asserts this is NodePath<t.StringLiteral>;
  assertStringLiteralTypeAnnotation(
    opts?: Opts<t.StringLiteralTypeAnnotation>,
  ): asserts this is NodePath<t.StringLiteralTypeAnnotation>;
  assertStringTypeAnnotation(
    opts?: Opts<t.StringTypeAnnotation>,
  ): asserts this is NodePath<t.StringTypeAnnotation>;
  assertSuper(opts?: Opts<t.Super>): asserts this is NodePath<t.Super>;
  assertSwitchCase(
    opts?: Opts<t.SwitchCase>,
  ): asserts this is NodePath<t.SwitchCase>;
  assertSwitchStatement(
    opts?: Opts<t.SwitchStatement>,
  ): asserts this is NodePath<t.SwitchStatement>;
  assertSymbolTypeAnnotation(
    opts?: Opts<t.SymbolTypeAnnotation>,
  ): asserts this is NodePath<t.SymbolTypeAnnotation>;
  assertTSAnyKeyword(
    opts?: Opts<t.TSAnyKeyword>,
  ): asserts this is NodePath<t.TSAnyKeyword>;
  assertTSArrayType(
    opts?: Opts<t.TSArrayType>,
  ): asserts this is NodePath<t.TSArrayType>;
  assertTSAsExpression(
    opts?: Opts<t.TSAsExpression>,
  ): asserts this is NodePath<t.TSAsExpression>;
  assertTSBaseType(
    opts?: Opts<t.TSBaseType>,
  ): asserts this is NodePath<t.TSBaseType>;
  assertTSBigIntKeyword(
    opts?: Opts<t.TSBigIntKeyword>,
  ): asserts this is NodePath<t.TSBigIntKeyword>;
  assertTSBooleanKeyword(
    opts?: Opts<t.TSBooleanKeyword>,
  ): asserts this is NodePath<t.TSBooleanKeyword>;
  assertTSCallSignatureDeclaration(
    opts?: Opts<t.TSCallSignatureDeclaration>,
  ): asserts this is NodePath<t.TSCallSignatureDeclaration>;
  assertTSConditionalType(
    opts?: Opts<t.TSConditionalType>,
  ): asserts this is NodePath<t.TSConditionalType>;
  assertTSConstructSignatureDeclaration(
    opts?: Opts<t.TSConstructSignatureDeclaration>,
  ): asserts this is NodePath<t.TSConstructSignatureDeclaration>;
  assertTSConstructorType(
    opts?: Opts<t.TSConstructorType>,
  ): asserts this is NodePath<t.TSConstructorType>;
  assertTSDeclareFunction(
    opts?: Opts<t.TSDeclareFunction>,
  ): asserts this is NodePath<t.TSDeclareFunction>;
  assertTSDeclareMethod(
    opts?: Opts<t.TSDeclareMethod>,
  ): asserts this is NodePath<t.TSDeclareMethod>;
  assertTSEntityName(
    opts?: Opts<t.TSEntityName>,
  ): asserts this is NodePath<t.TSEntityName>;
  assertTSEnumBody(
    opts?: Opts<t.TSEnumBody>,
  ): asserts this is NodePath<t.TSEnumBody>;
  assertTSEnumDeclaration(
    opts?: Opts<t.TSEnumDeclaration>,
  ): asserts this is NodePath<t.TSEnumDeclaration>;
  assertTSEnumMember(
    opts?: Opts<t.TSEnumMember>,
  ): asserts this is NodePath<t.TSEnumMember>;
  assertTSExportAssignment(
    opts?: Opts<t.TSExportAssignment>,
  ): asserts this is NodePath<t.TSExportAssignment>;
  assertTSExpressionWithTypeArguments(
    opts?: Opts<t.TSExpressionWithTypeArguments>,
  ): asserts this is NodePath<t.TSExpressionWithTypeArguments>;
  assertTSExternalModuleReference(
    opts?: Opts<t.TSExternalModuleReference>,
  ): asserts this is NodePath<t.TSExternalModuleReference>;
  assertTSFunctionType(
    opts?: Opts<t.TSFunctionType>,
  ): asserts this is NodePath<t.TSFunctionType>;
  assertTSImportEqualsDeclaration(
    opts?: Opts<t.TSImportEqualsDeclaration>,
  ): asserts this is NodePath<t.TSImportEqualsDeclaration>;
  assertTSImportType(
    opts?: Opts<t.TSImportType>,
  ): asserts this is NodePath<t.TSImportType>;
  assertTSIndexSignature(
    opts?: Opts<t.TSIndexSignature>,
  ): asserts this is NodePath<t.TSIndexSignature>;
  assertTSIndexedAccessType(
    opts?: Opts<t.TSIndexedAccessType>,
  ): asserts this is NodePath<t.TSIndexedAccessType>;
  assertTSInferType(
    opts?: Opts<t.TSInferType>,
  ): asserts this is NodePath<t.TSInferType>;
  assertTSInstantiationExpression(
    opts?: Opts<t.TSInstantiationExpression>,
  ): asserts this is NodePath<t.TSInstantiationExpression>;
  assertTSInterfaceBody(
    opts?: Opts<t.TSInterfaceBody>,
  ): asserts this is NodePath<t.TSInterfaceBody>;
  assertTSInterfaceDeclaration(
    opts?: Opts<t.TSInterfaceDeclaration>,
  ): asserts this is NodePath<t.TSInterfaceDeclaration>;
  assertTSIntersectionType(
    opts?: Opts<t.TSIntersectionType>,
  ): asserts this is NodePath<t.TSIntersectionType>;
  assertTSIntrinsicKeyword(
    opts?: Opts<t.TSIntrinsicKeyword>,
  ): asserts this is NodePath<t.TSIntrinsicKeyword>;
  assertTSLiteralType(
    opts?: Opts<t.TSLiteralType>,
  ): asserts this is NodePath<t.TSLiteralType>;
  assertTSMappedType(
    opts?: Opts<t.TSMappedType>,
  ): asserts this is NodePath<t.TSMappedType>;
  assertTSMethodSignature(
    opts?: Opts<t.TSMethodSignature>,
  ): asserts this is NodePath<t.TSMethodSignature>;
  assertTSModuleBlock(
    opts?: Opts<t.TSModuleBlock>,
  ): asserts this is NodePath<t.TSModuleBlock>;
  assertTSModuleDeclaration(
    opts?: Opts<t.TSModuleDeclaration>,
  ): asserts this is NodePath<t.TSModuleDeclaration>;
  assertTSNamedTupleMember(
    opts?: Opts<t.TSNamedTupleMember>,
  ): asserts this is NodePath<t.TSNamedTupleMember>;
  assertTSNamespaceExportDeclaration(
    opts?: Opts<t.TSNamespaceExportDeclaration>,
  ): asserts this is NodePath<t.TSNamespaceExportDeclaration>;
  assertTSNeverKeyword(
    opts?: Opts<t.TSNeverKeyword>,
  ): asserts this is NodePath<t.TSNeverKeyword>;
  assertTSNonNullExpression(
    opts?: Opts<t.TSNonNullExpression>,
  ): asserts this is NodePath<t.TSNonNullExpression>;
  assertTSNullKeyword(
    opts?: Opts<t.TSNullKeyword>,
  ): asserts this is NodePath<t.TSNullKeyword>;
  assertTSNumberKeyword(
    opts?: Opts<t.TSNumberKeyword>,
  ): asserts this is NodePath<t.TSNumberKeyword>;
  assertTSObjectKeyword(
    opts?: Opts<t.TSObjectKeyword>,
  ): asserts this is NodePath<t.TSObjectKeyword>;
  assertTSOptionalType(
    opts?: Opts<t.TSOptionalType>,
  ): asserts this is NodePath<t.TSOptionalType>;
  assertTSParameterProperty(
    opts?: Opts<t.TSParameterProperty>,
  ): asserts this is NodePath<t.TSParameterProperty>;
  assertTSParenthesizedType(
    opts?: Opts<t.TSParenthesizedType>,
  ): asserts this is NodePath<t.TSParenthesizedType>;
  assertTSPropertySignature(
    opts?: Opts<t.TSPropertySignature>,
  ): asserts this is NodePath<t.TSPropertySignature>;
  assertTSQualifiedName(
    opts?: Opts<t.TSQualifiedName>,
  ): asserts this is NodePath<t.TSQualifiedName>;
  assertTSRestType(
    opts?: Opts<t.TSRestType>,
  ): asserts this is NodePath<t.TSRestType>;
  assertTSSatisfiesExpression(
    opts?: Opts<t.TSSatisfiesExpression>,
  ): asserts this is NodePath<t.TSSatisfiesExpression>;
  assertTSStringKeyword(
    opts?: Opts<t.TSStringKeyword>,
  ): asserts this is NodePath<t.TSStringKeyword>;
  assertTSSymbolKeyword(
    opts?: Opts<t.TSSymbolKeyword>,
  ): asserts this is NodePath<t.TSSymbolKeyword>;
  assertTSThisType(
    opts?: Opts<t.TSThisType>,
  ): asserts this is NodePath<t.TSThisType>;
  assertTSTupleType(
    opts?: Opts<t.TSTupleType>,
  ): asserts this is NodePath<t.TSTupleType>;
  assertTSType(opts?: Opts<t.TSType>): asserts this is NodePath<t.TSType>;
  assertTSTypeAliasDeclaration(
    opts?: Opts<t.TSTypeAliasDeclaration>,
  ): asserts this is NodePath<t.TSTypeAliasDeclaration>;
  assertTSTypeAnnotation(
    opts?: Opts<t.TSTypeAnnotation>,
  ): asserts this is NodePath<t.TSTypeAnnotation>;
  assertTSTypeAssertion(
    opts?: Opts<t.TSTypeAssertion>,
  ): asserts this is NodePath<t.TSTypeAssertion>;
  assertTSTypeElement(
    opts?: Opts<t.TSTypeElement>,
  ): asserts this is NodePath<t.TSTypeElement>;
  assertTSTypeLiteral(
    opts?: Opts<t.TSTypeLiteral>,
  ): asserts this is NodePath<t.TSTypeLiteral>;
  assertTSTypeOperator(
    opts?: Opts<t.TSTypeOperator>,
  ): asserts this is NodePath<t.TSTypeOperator>;
  assertTSTypeParameter(
    opts?: Opts<t.TSTypeParameter>,
  ): asserts this is NodePath<t.TSTypeParameter>;
  assertTSTypeParameterDeclaration(
    opts?: Opts<t.TSTypeParameterDeclaration>,
  ): asserts this is NodePath<t.TSTypeParameterDeclaration>;
  assertTSTypeParameterInstantiation(
    opts?: Opts<t.TSTypeParameterInstantiation>,
  ): asserts this is NodePath<t.TSTypeParameterInstantiation>;
  assertTSTypePredicate(
    opts?: Opts<t.TSTypePredicate>,
  ): asserts this is NodePath<t.TSTypePredicate>;
  assertTSTypeQuery(
    opts?: Opts<t.TSTypeQuery>,
  ): asserts this is NodePath<t.TSTypeQuery>;
  assertTSTypeReference(
    opts?: Opts<t.TSTypeReference>,
  ): asserts this is NodePath<t.TSTypeReference>;
  assertTSUndefinedKeyword(
    opts?: Opts<t.TSUndefinedKeyword>,
  ): asserts this is NodePath<t.TSUndefinedKeyword>;
  assertTSUnionType(
    opts?: Opts<t.TSUnionType>,
  ): asserts this is NodePath<t.TSUnionType>;
  assertTSUnknownKeyword(
    opts?: Opts<t.TSUnknownKeyword>,
  ): asserts this is NodePath<t.TSUnknownKeyword>;
  assertTSVoidKeyword(
    opts?: Opts<t.TSVoidKeyword>,
  ): asserts this is NodePath<t.TSVoidKeyword>;
  assertTaggedTemplateExpression(
    opts?: Opts<t.TaggedTemplateExpression>,
  ): asserts this is NodePath<t.TaggedTemplateExpression>;
  assertTemplateElement(
    opts?: Opts<t.TemplateElement>,
  ): asserts this is NodePath<t.TemplateElement>;
  assertTemplateLiteral(
    opts?: Opts<t.TemplateLiteral>,
  ): asserts this is NodePath<t.TemplateLiteral>;
  assertTerminatorless(
    opts?: Opts<t.Terminatorless>,
  ): asserts this is NodePath<t.Terminatorless>;
  assertThisExpression(
    opts?: Opts<t.ThisExpression>,
  ): asserts this is NodePath<t.ThisExpression>;
  assertThisTypeAnnotation(
    opts?: Opts<t.ThisTypeAnnotation>,
  ): asserts this is NodePath<t.ThisTypeAnnotation>;
  assertThrowStatement(
    opts?: Opts<t.ThrowStatement>,
  ): asserts this is NodePath<t.ThrowStatement>;
  assertTopicReference(
    opts?: Opts<t.TopicReference>,
  ): asserts this is NodePath<t.TopicReference>;
  assertTryStatement(
    opts?: Opts<t.TryStatement>,
  ): asserts this is NodePath<t.TryStatement>;
  assertTupleExpression(
    opts?: Opts<t.TupleExpression>,
  ): asserts this is NodePath<t.TupleExpression>;
  assertTupleTypeAnnotation(
    opts?: Opts<t.TupleTypeAnnotation>,
  ): asserts this is NodePath<t.TupleTypeAnnotation>;
  assertTypeAlias(
    opts?: Opts<t.TypeAlias>,
  ): asserts this is NodePath<t.TypeAlias>;
  assertTypeAnnotation(
    opts?: Opts<t.TypeAnnotation>,
  ): asserts this is NodePath<t.TypeAnnotation>;
  assertTypeCastExpression(
    opts?: Opts<t.TypeCastExpression>,
  ): asserts this is NodePath<t.TypeCastExpression>;
  assertTypeParameter(
    opts?: Opts<t.TypeParameter>,
  ): asserts this is NodePath<t.TypeParameter>;
  assertTypeParameterDeclaration(
    opts?: Opts<t.TypeParameterDeclaration>,
  ): asserts this is NodePath<t.TypeParameterDeclaration>;
  assertTypeParameterInstantiation(
    opts?: Opts<t.TypeParameterInstantiation>,
  ): asserts this is NodePath<t.TypeParameterInstantiation>;
  assertTypeScript(
    opts?: Opts<t.TypeScript>,
  ): asserts this is NodePath<t.TypeScript>;
  assertTypeofTypeAnnotation(
    opts?: Opts<t.TypeofTypeAnnotation>,
  ): asserts this is NodePath<t.TypeofTypeAnnotation>;
  assertUnaryExpression(
    opts?: Opts<t.UnaryExpression>,
  ): asserts this is NodePath<t.UnaryExpression>;
  assertUnaryLike(
    opts?: Opts<t.UnaryLike>,
  ): asserts this is NodePath<t.UnaryLike>;
  assertUnionTypeAnnotation(
    opts?: Opts<t.UnionTypeAnnotation>,
  ): asserts this is NodePath<t.UnionTypeAnnotation>;
  assertUpdateExpression(
    opts?: Opts<t.UpdateExpression>,
  ): asserts this is NodePath<t.UpdateExpression>;
  assertUserWhitespacable(
    opts?: Opts<t.UserWhitespacable>,
  ): asserts this is NodePath<t.UserWhitespacable>;
  assertV8IntrinsicIdentifier(
    opts?: Opts<t.V8IntrinsicIdentifier>,
  ): asserts this is NodePath<t.V8IntrinsicIdentifier>;
  assertVariableDeclaration(
    opts?: Opts<t.VariableDeclaration>,
  ): asserts this is NodePath<t.VariableDeclaration>;
  assertVariableDeclarator(
    opts?: Opts<t.VariableDeclarator>,
  ): asserts this is NodePath<t.VariableDeclarator>;
  assertVariance(opts?: Opts<t.Variance>): asserts this is NodePath<t.Variance>;
  assertVoidTypeAnnotation(
    opts?: Opts<t.VoidTypeAnnotation>,
  ): asserts this is NodePath<t.VoidTypeAnnotation>;
  assertWhile(opts?: Opts<t.While>): asserts this is NodePath<t.While>;
  assertWhileStatement(
    opts?: Opts<t.WhileStatement>,
  ): asserts this is NodePath<t.WhileStatement>;
  assertWithStatement(
    opts?: Opts<t.WithStatement>,
  ): asserts this is NodePath<t.WithStatement>;
  assertYieldExpression(
    opts?: Opts<t.YieldExpression>,
  ): asserts this is NodePath<t.YieldExpression>;
}
