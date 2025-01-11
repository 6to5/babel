/*
 * This file is auto-generated! Do not modify it directly.
 * To re-generate run 'make build'
 */
import type * as t from "@babel/types";
import type NodePath from "../index";
import type { VirtualTypeNodePathValidators } from "../lib/virtual-types-validator";

type Opts<Obj> = Partial<{
  [Prop in keyof Obj]: Obj[Prop] extends t.Node
    ? t.Node
    : Obj[Prop] extends t.Node[]
      ? t.Node[]
      : Obj[Prop];
}>;

interface BaseNodePathValidators {
  isAccessor(
    this: NodePath,
    opts?: Opts<t.Accessor>,
  ): this is NodePath<t.Accessor>;
  isAnyTypeAnnotation(
    this: NodePath,
    opts?: Opts<t.AnyTypeAnnotation>,
  ): this is NodePath<t.AnyTypeAnnotation>;
  isArgumentPlaceholder(
    this: NodePath,
    opts?: Opts<t.ArgumentPlaceholder>,
  ): this is NodePath<t.ArgumentPlaceholder>;
  isArrayExpression(
    this: NodePath,
    opts?: Opts<t.ArrayExpression>,
  ): this is NodePath<t.ArrayExpression>;
  isArrayPattern(
    this: NodePath,
    opts?: Opts<t.ArrayPattern>,
  ): this is NodePath<t.ArrayPattern>;
  isArrayTypeAnnotation(
    this: NodePath,
    opts?: Opts<t.ArrayTypeAnnotation>,
  ): this is NodePath<t.ArrayTypeAnnotation>;
  isArrowFunctionExpression(
    this: NodePath,
    opts?: Opts<t.ArrowFunctionExpression>,
  ): this is NodePath<t.ArrowFunctionExpression>;
  isAssignmentExpression(
    this: NodePath,
    opts?: Opts<t.AssignmentExpression>,
  ): this is NodePath<t.AssignmentExpression>;
  isAssignmentPattern(
    this: NodePath,
    opts?: Opts<t.AssignmentPattern>,
  ): this is NodePath<t.AssignmentPattern>;
  isAwaitExpression(
    this: NodePath,
    opts?: Opts<t.AwaitExpression>,
  ): this is NodePath<t.AwaitExpression>;
  isBigIntLiteral(
    this: NodePath,
    opts?: Opts<t.BigIntLiteral>,
  ): this is NodePath<t.BigIntLiteral>;
  isBinary(this: NodePath, opts?: Opts<t.Binary>): this is NodePath<t.Binary>;
  isBinaryExpression(
    this: NodePath,
    opts?: Opts<t.BinaryExpression>,
  ): this is NodePath<t.BinaryExpression>;
  isBindExpression(
    this: NodePath,
    opts?: Opts<t.BindExpression>,
  ): this is NodePath<t.BindExpression>;
  isBlock(this: NodePath, opts?: Opts<t.Block>): this is NodePath<t.Block>;
  isBlockParent(
    this: NodePath,
    opts?: Opts<t.BlockParent>,
  ): this is NodePath<t.BlockParent>;
  isBlockStatement(
    this: NodePath,
    opts?: Opts<t.BlockStatement>,
  ): this is NodePath<t.BlockStatement>;
  isBooleanLiteral(
    this: NodePath,
    opts?: Opts<t.BooleanLiteral>,
  ): this is NodePath<t.BooleanLiteral>;
  isBooleanLiteralTypeAnnotation(
    this: NodePath,
    opts?: Opts<t.BooleanLiteralTypeAnnotation>,
  ): this is NodePath<t.BooleanLiteralTypeAnnotation>;
  isBooleanTypeAnnotation(
    this: NodePath,
    opts?: Opts<t.BooleanTypeAnnotation>,
  ): this is NodePath<t.BooleanTypeAnnotation>;
  isBreakStatement(
    this: NodePath,
    opts?: Opts<t.BreakStatement>,
  ): this is NodePath<t.BreakStatement>;
  isCallExpression(
    this: NodePath,
    opts?: Opts<t.CallExpression>,
  ): this is NodePath<t.CallExpression>;
  isCatchClause(
    this: NodePath,
    opts?: Opts<t.CatchClause>,
  ): this is NodePath<t.CatchClause>;
  isClass(this: NodePath, opts?: Opts<t.Class>): this is NodePath<t.Class>;
  isClassAccessorProperty(
    this: NodePath,
    opts?: Opts<t.ClassAccessorProperty>,
  ): this is NodePath<t.ClassAccessorProperty>;
  isClassBody(
    this: NodePath,
    opts?: Opts<t.ClassBody>,
  ): this is NodePath<t.ClassBody>;
  isClassDeclaration(
    this: NodePath,
    opts?: Opts<t.ClassDeclaration>,
  ): this is NodePath<t.ClassDeclaration>;
  isClassExpression(
    this: NodePath,
    opts?: Opts<t.ClassExpression>,
  ): this is NodePath<t.ClassExpression>;
  isClassImplements(
    this: NodePath,
    opts?: Opts<t.ClassImplements>,
  ): this is NodePath<t.ClassImplements>;
  isClassMethod(
    this: NodePath,
    opts?: Opts<t.ClassMethod>,
  ): this is NodePath<t.ClassMethod>;
  isClassPrivateMethod(
    this: NodePath,
    opts?: Opts<t.ClassPrivateMethod>,
  ): this is NodePath<t.ClassPrivateMethod>;
  isClassPrivateProperty(
    this: NodePath,
    opts?: Opts<t.ClassPrivateProperty>,
  ): this is NodePath<t.ClassPrivateProperty>;
  isClassProperty(
    this: NodePath,
    opts?: Opts<t.ClassProperty>,
  ): this is NodePath<t.ClassProperty>;
  isCompletionStatement(
    this: NodePath,
    opts?: Opts<t.CompletionStatement>,
  ): this is NodePath<t.CompletionStatement>;
  isConditional(
    this: NodePath,
    opts?: Opts<t.Conditional>,
  ): this is NodePath<t.Conditional>;
  isConditionalExpression(
    this: NodePath,
    opts?: Opts<t.ConditionalExpression>,
  ): this is NodePath<t.ConditionalExpression>;
  isContinueStatement(
    this: NodePath,
    opts?: Opts<t.ContinueStatement>,
  ): this is NodePath<t.ContinueStatement>;
  isDebuggerStatement(
    this: NodePath,
    opts?: Opts<t.DebuggerStatement>,
  ): this is NodePath<t.DebuggerStatement>;
  isDecimalLiteral(
    this: NodePath,
    opts?: Opts<t.DecimalLiteral>,
  ): this is NodePath<t.DecimalLiteral>;
  isDeclaration(
    this: NodePath,
    opts?: Opts<t.Declaration>,
  ): this is NodePath<t.Declaration>;
  isDeclareClass(
    this: NodePath,
    opts?: Opts<t.DeclareClass>,
  ): this is NodePath<t.DeclareClass>;
  isDeclareExportAllDeclaration(
    this: NodePath,
    opts?: Opts<t.DeclareExportAllDeclaration>,
  ): this is NodePath<t.DeclareExportAllDeclaration>;
  isDeclareExportDeclaration(
    this: NodePath,
    opts?: Opts<t.DeclareExportDeclaration>,
  ): this is NodePath<t.DeclareExportDeclaration>;
  isDeclareFunction(
    this: NodePath,
    opts?: Opts<t.DeclareFunction>,
  ): this is NodePath<t.DeclareFunction>;
  isDeclareInterface(
    this: NodePath,
    opts?: Opts<t.DeclareInterface>,
  ): this is NodePath<t.DeclareInterface>;
  isDeclareModule(
    this: NodePath,
    opts?: Opts<t.DeclareModule>,
  ): this is NodePath<t.DeclareModule>;
  isDeclareModuleExports(
    this: NodePath,
    opts?: Opts<t.DeclareModuleExports>,
  ): this is NodePath<t.DeclareModuleExports>;
  isDeclareOpaqueType(
    this: NodePath,
    opts?: Opts<t.DeclareOpaqueType>,
  ): this is NodePath<t.DeclareOpaqueType>;
  isDeclareTypeAlias(
    this: NodePath,
    opts?: Opts<t.DeclareTypeAlias>,
  ): this is NodePath<t.DeclareTypeAlias>;
  isDeclareVariable(
    this: NodePath,
    opts?: Opts<t.DeclareVariable>,
  ): this is NodePath<t.DeclareVariable>;
  isDeclaredPredicate(
    this: NodePath,
    opts?: Opts<t.DeclaredPredicate>,
  ): this is NodePath<t.DeclaredPredicate>;
  isDecorator(
    this: NodePath,
    opts?: Opts<t.Decorator>,
  ): this is NodePath<t.Decorator>;
  isDirective(
    this: NodePath,
    opts?: Opts<t.Directive>,
  ): this is NodePath<t.Directive>;
  isDirectiveLiteral(
    this: NodePath,
    opts?: Opts<t.DirectiveLiteral>,
  ): this is NodePath<t.DirectiveLiteral>;
  isDoExpression(
    this: NodePath,
    opts?: Opts<t.DoExpression>,
  ): this is NodePath<t.DoExpression>;
  isDoWhileStatement(
    this: NodePath,
    opts?: Opts<t.DoWhileStatement>,
  ): this is NodePath<t.DoWhileStatement>;
  isEmptyStatement(
    this: NodePath,
    opts?: Opts<t.EmptyStatement>,
  ): this is NodePath<t.EmptyStatement>;
  isEmptyTypeAnnotation(
    this: NodePath,
    opts?: Opts<t.EmptyTypeAnnotation>,
  ): this is NodePath<t.EmptyTypeAnnotation>;
  isEnumBody(
    this: NodePath,
    opts?: Opts<t.EnumBody>,
  ): this is NodePath<t.EnumBody>;
  isEnumBooleanBody(
    this: NodePath,
    opts?: Opts<t.EnumBooleanBody>,
  ): this is NodePath<t.EnumBooleanBody>;
  isEnumBooleanMember(
    this: NodePath,
    opts?: Opts<t.EnumBooleanMember>,
  ): this is NodePath<t.EnumBooleanMember>;
  isEnumDeclaration(
    this: NodePath,
    opts?: Opts<t.EnumDeclaration>,
  ): this is NodePath<t.EnumDeclaration>;
  isEnumDefaultedMember(
    this: NodePath,
    opts?: Opts<t.EnumDefaultedMember>,
  ): this is NodePath<t.EnumDefaultedMember>;
  isEnumMember(
    this: NodePath,
    opts?: Opts<t.EnumMember>,
  ): this is NodePath<t.EnumMember>;
  isEnumNumberBody(
    this: NodePath,
    opts?: Opts<t.EnumNumberBody>,
  ): this is NodePath<t.EnumNumberBody>;
  isEnumNumberMember(
    this: NodePath,
    opts?: Opts<t.EnumNumberMember>,
  ): this is NodePath<t.EnumNumberMember>;
  isEnumStringBody(
    this: NodePath,
    opts?: Opts<t.EnumStringBody>,
  ): this is NodePath<t.EnumStringBody>;
  isEnumStringMember(
    this: NodePath,
    opts?: Opts<t.EnumStringMember>,
  ): this is NodePath<t.EnumStringMember>;
  isEnumSymbolBody(
    this: NodePath,
    opts?: Opts<t.EnumSymbolBody>,
  ): this is NodePath<t.EnumSymbolBody>;
  isExistsTypeAnnotation(
    this: NodePath,
    opts?: Opts<t.ExistsTypeAnnotation>,
  ): this is NodePath<t.ExistsTypeAnnotation>;
  isExportAllDeclaration(
    this: NodePath,
    opts?: Opts<t.ExportAllDeclaration>,
  ): this is NodePath<t.ExportAllDeclaration>;
  isExportDeclaration(
    this: NodePath,
    opts?: Opts<t.ExportDeclaration>,
  ): this is NodePath<t.ExportDeclaration>;
  isExportDefaultDeclaration(
    this: NodePath,
    opts?: Opts<t.ExportDefaultDeclaration>,
  ): this is NodePath<t.ExportDefaultDeclaration>;
  isExportDefaultSpecifier(
    this: NodePath,
    opts?: Opts<t.ExportDefaultSpecifier>,
  ): this is NodePath<t.ExportDefaultSpecifier>;
  isExportNamedDeclaration(
    this: NodePath,
    opts?: Opts<t.ExportNamedDeclaration>,
  ): this is NodePath<t.ExportNamedDeclaration>;
  isExportNamespaceSpecifier(
    this: NodePath,
    opts?: Opts<t.ExportNamespaceSpecifier>,
  ): this is NodePath<t.ExportNamespaceSpecifier>;
  isExportSpecifier(
    this: NodePath,
    opts?: Opts<t.ExportSpecifier>,
  ): this is NodePath<t.ExportSpecifier>;
  isExpression(
    this: NodePath,
    opts?: Opts<t.Expression>,
  ): this is NodePath<t.Expression>;
  isExpressionStatement(
    this: NodePath,
    opts?: Opts<t.ExpressionStatement>,
  ): this is NodePath<t.ExpressionStatement>;
  isExpressionWrapper(
    this: NodePath,
    opts?: Opts<t.ExpressionWrapper>,
  ): this is NodePath<t.ExpressionWrapper>;
  isFile(this: NodePath, opts?: Opts<t.File>): this is NodePath<t.File>;
  isFlow(this: NodePath, opts?: Opts<t.Flow>): this is NodePath<t.Flow>;
  isFlowBaseAnnotation(
    this: NodePath,
    opts?: Opts<t.FlowBaseAnnotation>,
  ): this is NodePath<t.FlowBaseAnnotation>;
  isFlowDeclaration(
    this: NodePath,
    opts?: Opts<t.FlowDeclaration>,
  ): this is NodePath<t.FlowDeclaration>;
  isFlowPredicate(
    this: NodePath,
    opts?: Opts<t.FlowPredicate>,
  ): this is NodePath<t.FlowPredicate>;
  isFlowType(
    this: NodePath,
    opts?: Opts<t.FlowType>,
  ): this is NodePath<t.FlowType>;
  isFor(this: NodePath, opts?: Opts<t.For>): this is NodePath<t.For>;
  isForInStatement(
    this: NodePath,
    opts?: Opts<t.ForInStatement>,
  ): this is NodePath<t.ForInStatement>;
  isForOfStatement(
    this: NodePath,
    opts?: Opts<t.ForOfStatement>,
  ): this is NodePath<t.ForOfStatement>;
  isForStatement(
    this: NodePath,
    opts?: Opts<t.ForStatement>,
  ): this is NodePath<t.ForStatement>;
  isForXStatement(
    this: NodePath,
    opts?: Opts<t.ForXStatement>,
  ): this is NodePath<t.ForXStatement>;
  isFunction(
    this: NodePath,
    opts?: Opts<t.Function>,
  ): this is NodePath<t.Function>;
  isFunctionDeclaration(
    this: NodePath,
    opts?: Opts<t.FunctionDeclaration>,
  ): this is NodePath<t.FunctionDeclaration>;
  isFunctionExpression(
    this: NodePath,
    opts?: Opts<t.FunctionExpression>,
  ): this is NodePath<t.FunctionExpression>;
  isFunctionParent(
    this: NodePath,
    opts?: Opts<t.FunctionParent>,
  ): this is NodePath<t.FunctionParent>;
  isFunctionTypeAnnotation(
    this: NodePath,
    opts?: Opts<t.FunctionTypeAnnotation>,
  ): this is NodePath<t.FunctionTypeAnnotation>;
  isFunctionTypeParam(
    this: NodePath,
    opts?: Opts<t.FunctionTypeParam>,
  ): this is NodePath<t.FunctionTypeParam>;
  isGenericTypeAnnotation(
    this: NodePath,
    opts?: Opts<t.GenericTypeAnnotation>,
  ): this is NodePath<t.GenericTypeAnnotation>;
  isIdentifier(
    this: NodePath,
    opts?: Opts<t.Identifier>,
  ): this is NodePath<t.Identifier>;
  isIfStatement(
    this: NodePath,
    opts?: Opts<t.IfStatement>,
  ): this is NodePath<t.IfStatement>;
  isImmutable(
    this: NodePath,
    opts?: Opts<t.Immutable>,
  ): this is NodePath<t.Immutable>;
  isImport(this: NodePath, opts?: Opts<t.Import>): this is NodePath<t.Import>;
  isImportAttribute(
    this: NodePath,
    opts?: Opts<t.ImportAttribute>,
  ): this is NodePath<t.ImportAttribute>;
  isImportDeclaration(
    this: NodePath,
    opts?: Opts<t.ImportDeclaration>,
  ): this is NodePath<t.ImportDeclaration>;
  isImportDefaultSpecifier(
    this: NodePath,
    opts?: Opts<t.ImportDefaultSpecifier>,
  ): this is NodePath<t.ImportDefaultSpecifier>;
  isImportExpression(
    this: NodePath,
    opts?: Opts<t.ImportExpression>,
  ): this is NodePath<t.ImportExpression>;
  isImportNamespaceSpecifier(
    this: NodePath,
    opts?: Opts<t.ImportNamespaceSpecifier>,
  ): this is NodePath<t.ImportNamespaceSpecifier>;
  isImportOrExportDeclaration(
    this: NodePath,
    opts?: Opts<t.ImportOrExportDeclaration>,
  ): this is NodePath<t.ImportOrExportDeclaration>;
  isImportSpecifier(
    this: NodePath,
    opts?: Opts<t.ImportSpecifier>,
  ): this is NodePath<t.ImportSpecifier>;
  isIndexedAccessType(
    this: NodePath,
    opts?: Opts<t.IndexedAccessType>,
  ): this is NodePath<t.IndexedAccessType>;
  isInferredPredicate(
    this: NodePath,
    opts?: Opts<t.InferredPredicate>,
  ): this is NodePath<t.InferredPredicate>;
  isInterfaceDeclaration(
    this: NodePath,
    opts?: Opts<t.InterfaceDeclaration>,
  ): this is NodePath<t.InterfaceDeclaration>;
  isInterfaceExtends(
    this: NodePath,
    opts?: Opts<t.InterfaceExtends>,
  ): this is NodePath<t.InterfaceExtends>;
  isInterfaceTypeAnnotation(
    this: NodePath,
    opts?: Opts<t.InterfaceTypeAnnotation>,
  ): this is NodePath<t.InterfaceTypeAnnotation>;
  isInterpreterDirective(
    this: NodePath,
    opts?: Opts<t.InterpreterDirective>,
  ): this is NodePath<t.InterpreterDirective>;
  isIntersectionTypeAnnotation(
    this: NodePath,
    opts?: Opts<t.IntersectionTypeAnnotation>,
  ): this is NodePath<t.IntersectionTypeAnnotation>;
  isJSX(this: NodePath, opts?: Opts<t.JSX>): this is NodePath<t.JSX>;
  isJSXAttribute(
    this: NodePath,
    opts?: Opts<t.JSXAttribute>,
  ): this is NodePath<t.JSXAttribute>;
  isJSXClosingElement(
    this: NodePath,
    opts?: Opts<t.JSXClosingElement>,
  ): this is NodePath<t.JSXClosingElement>;
  isJSXClosingFragment(
    this: NodePath,
    opts?: Opts<t.JSXClosingFragment>,
  ): this is NodePath<t.JSXClosingFragment>;
  isJSXElement(
    this: NodePath,
    opts?: Opts<t.JSXElement>,
  ): this is NodePath<t.JSXElement>;
  isJSXEmptyExpression(
    this: NodePath,
    opts?: Opts<t.JSXEmptyExpression>,
  ): this is NodePath<t.JSXEmptyExpression>;
  isJSXExpressionContainer(
    this: NodePath,
    opts?: Opts<t.JSXExpressionContainer>,
  ): this is NodePath<t.JSXExpressionContainer>;
  isJSXFragment(
    this: NodePath,
    opts?: Opts<t.JSXFragment>,
  ): this is NodePath<t.JSXFragment>;
  isJSXIdentifier(
    this: NodePath,
    opts?: Opts<t.JSXIdentifier>,
  ): this is NodePath<t.JSXIdentifier>;
  isJSXMemberExpression(
    this: NodePath,
    opts?: Opts<t.JSXMemberExpression>,
  ): this is NodePath<t.JSXMemberExpression>;
  isJSXNamespacedName(
    this: NodePath,
    opts?: Opts<t.JSXNamespacedName>,
  ): this is NodePath<t.JSXNamespacedName>;
  isJSXOpeningElement(
    this: NodePath,
    opts?: Opts<t.JSXOpeningElement>,
  ): this is NodePath<t.JSXOpeningElement>;
  isJSXOpeningFragment(
    this: NodePath,
    opts?: Opts<t.JSXOpeningFragment>,
  ): this is NodePath<t.JSXOpeningFragment>;
  isJSXSpreadAttribute(
    this: NodePath,
    opts?: Opts<t.JSXSpreadAttribute>,
  ): this is NodePath<t.JSXSpreadAttribute>;
  isJSXSpreadChild(
    this: NodePath,
    opts?: Opts<t.JSXSpreadChild>,
  ): this is NodePath<t.JSXSpreadChild>;
  isJSXText(
    this: NodePath,
    opts?: Opts<t.JSXText>,
  ): this is NodePath<t.JSXText>;
  isLVal(this: NodePath, opts?: Opts<t.LVal>): this is NodePath<t.LVal>;
  isLabeledStatement(
    this: NodePath,
    opts?: Opts<t.LabeledStatement>,
  ): this is NodePath<t.LabeledStatement>;
  isLiteral(
    this: NodePath,
    opts?: Opts<t.Literal>,
  ): this is NodePath<t.Literal>;
  isLogicalExpression(
    this: NodePath,
    opts?: Opts<t.LogicalExpression>,
  ): this is NodePath<t.LogicalExpression>;
  isLoop(this: NodePath, opts?: Opts<t.Loop>): this is NodePath<t.Loop>;
  isMemberExpression(
    this: NodePath,
    opts?: Opts<t.MemberExpression>,
  ): this is NodePath<t.MemberExpression>;
  isMetaProperty(
    this: NodePath,
    opts?: Opts<t.MetaProperty>,
  ): this is NodePath<t.MetaProperty>;
  isMethod(this: NodePath, opts?: Opts<t.Method>): this is NodePath<t.Method>;
  isMiscellaneous(
    this: NodePath,
    opts?: Opts<t.Miscellaneous>,
  ): this is NodePath<t.Miscellaneous>;
  isMixedTypeAnnotation(
    this: NodePath,
    opts?: Opts<t.MixedTypeAnnotation>,
  ): this is NodePath<t.MixedTypeAnnotation>;
  isModuleDeclaration(
    this: NodePath,
    opts?: Opts<t.ModuleDeclaration>,
  ): this is NodePath<t.ModuleDeclaration>;
  isModuleExpression(
    this: NodePath,
    opts?: Opts<t.ModuleExpression>,
  ): this is NodePath<t.ModuleExpression>;
  isModuleSpecifier(
    this: NodePath,
    opts?: Opts<t.ModuleSpecifier>,
  ): this is NodePath<t.ModuleSpecifier>;
  isNewExpression(
    this: NodePath,
    opts?: Opts<t.NewExpression>,
  ): this is NodePath<t.NewExpression>;
  isNoop(this: NodePath, opts?: Opts<t.Noop>): this is NodePath<t.Noop>;
  isNullLiteral(
    this: NodePath,
    opts?: Opts<t.NullLiteral>,
  ): this is NodePath<t.NullLiteral>;
  isNullLiteralTypeAnnotation(
    this: NodePath,
    opts?: Opts<t.NullLiteralTypeAnnotation>,
  ): this is NodePath<t.NullLiteralTypeAnnotation>;
  isNullableTypeAnnotation(
    this: NodePath,
    opts?: Opts<t.NullableTypeAnnotation>,
  ): this is NodePath<t.NullableTypeAnnotation>;
  isNumberLiteral(
    this: NodePath,
    opts?: Opts<t.NumberLiteral>,
  ): this is NodePath<t.NumberLiteral>;
  isNumberLiteralTypeAnnotation(
    this: NodePath,
    opts?: Opts<t.NumberLiteralTypeAnnotation>,
  ): this is NodePath<t.NumberLiteralTypeAnnotation>;
  isNumberTypeAnnotation(
    this: NodePath,
    opts?: Opts<t.NumberTypeAnnotation>,
  ): this is NodePath<t.NumberTypeAnnotation>;
  isNumericLiteral(
    this: NodePath,
    opts?: Opts<t.NumericLiteral>,
  ): this is NodePath<t.NumericLiteral>;
  isObjectExpression(
    this: NodePath,
    opts?: Opts<t.ObjectExpression>,
  ): this is NodePath<t.ObjectExpression>;
  isObjectMember(
    this: NodePath,
    opts?: Opts<t.ObjectMember>,
  ): this is NodePath<t.ObjectMember>;
  isObjectMethod(
    this: NodePath,
    opts?: Opts<t.ObjectMethod>,
  ): this is NodePath<t.ObjectMethod>;
  isObjectPattern(
    this: NodePath,
    opts?: Opts<t.ObjectPattern>,
  ): this is NodePath<t.ObjectPattern>;
  isObjectProperty(
    this: NodePath,
    opts?: Opts<t.ObjectProperty>,
  ): this is NodePath<t.ObjectProperty>;
  isObjectTypeAnnotation(
    this: NodePath,
    opts?: Opts<t.ObjectTypeAnnotation>,
  ): this is NodePath<t.ObjectTypeAnnotation>;
  isObjectTypeCallProperty(
    this: NodePath,
    opts?: Opts<t.ObjectTypeCallProperty>,
  ): this is NodePath<t.ObjectTypeCallProperty>;
  isObjectTypeIndexer(
    this: NodePath,
    opts?: Opts<t.ObjectTypeIndexer>,
  ): this is NodePath<t.ObjectTypeIndexer>;
  isObjectTypeInternalSlot(
    this: NodePath,
    opts?: Opts<t.ObjectTypeInternalSlot>,
  ): this is NodePath<t.ObjectTypeInternalSlot>;
  isObjectTypeProperty(
    this: NodePath,
    opts?: Opts<t.ObjectTypeProperty>,
  ): this is NodePath<t.ObjectTypeProperty>;
  isObjectTypeSpreadProperty(
    this: NodePath,
    opts?: Opts<t.ObjectTypeSpreadProperty>,
  ): this is NodePath<t.ObjectTypeSpreadProperty>;
  isOpaqueType(
    this: NodePath,
    opts?: Opts<t.OpaqueType>,
  ): this is NodePath<t.OpaqueType>;
  isOptionalCallExpression(
    this: NodePath,
    opts?: Opts<t.OptionalCallExpression>,
  ): this is NodePath<t.OptionalCallExpression>;
  isOptionalIndexedAccessType(
    this: NodePath,
    opts?: Opts<t.OptionalIndexedAccessType>,
  ): this is NodePath<t.OptionalIndexedAccessType>;
  isOptionalMemberExpression(
    this: NodePath,
    opts?: Opts<t.OptionalMemberExpression>,
  ): this is NodePath<t.OptionalMemberExpression>;
  isParenthesizedExpression(
    this: NodePath,
    opts?: Opts<t.ParenthesizedExpression>,
  ): this is NodePath<t.ParenthesizedExpression>;
  isPattern(
    this: NodePath,
    opts?: Opts<t.Pattern>,
  ): this is NodePath<t.Pattern>;
  isPatternLike(
    this: NodePath,
    opts?: Opts<t.PatternLike>,
  ): this is NodePath<t.PatternLike>;
  isPipelineBareFunction(
    this: NodePath,
    opts?: Opts<t.PipelineBareFunction>,
  ): this is NodePath<t.PipelineBareFunction>;
  isPipelinePrimaryTopicReference(
    this: NodePath,
    opts?: Opts<t.PipelinePrimaryTopicReference>,
  ): this is NodePath<t.PipelinePrimaryTopicReference>;
  isPipelineTopicExpression(
    this: NodePath,
    opts?: Opts<t.PipelineTopicExpression>,
  ): this is NodePath<t.PipelineTopicExpression>;
  isPlaceholder(
    this: NodePath,
    opts?: Opts<t.Placeholder>,
  ): this is NodePath<t.Placeholder>;
  isPrivate(
    this: NodePath,
    opts?: Opts<t.Private>,
  ): this is NodePath<t.Private>;
  isPrivateName(
    this: NodePath,
    opts?: Opts<t.PrivateName>,
  ): this is NodePath<t.PrivateName>;
  isProgram(
    this: NodePath,
    opts?: Opts<t.Program>,
  ): this is NodePath<t.Program>;
  isProperty(
    this: NodePath,
    opts?: Opts<t.Property>,
  ): this is NodePath<t.Property>;
  isPureish(
    this: NodePath,
    opts?: Opts<t.Pureish>,
  ): this is NodePath<t.Pureish>;
  isQualifiedTypeIdentifier(
    this: NodePath,
    opts?: Opts<t.QualifiedTypeIdentifier>,
  ): this is NodePath<t.QualifiedTypeIdentifier>;
  isRecordExpression(
    this: NodePath,
    opts?: Opts<t.RecordExpression>,
  ): this is NodePath<t.RecordExpression>;
  isRegExpLiteral(
    this: NodePath,
    opts?: Opts<t.RegExpLiteral>,
  ): this is NodePath<t.RegExpLiteral>;
  isRegexLiteral(
    this: NodePath,
    opts?: Opts<t.RegexLiteral>,
  ): this is NodePath<t.RegexLiteral>;
  isRestElement(
    this: NodePath,
    opts?: Opts<t.RestElement>,
  ): this is NodePath<t.RestElement>;
  isRestProperty(
    this: NodePath,
    opts?: Opts<t.RestProperty>,
  ): this is NodePath<t.RestProperty>;
  isReturnStatement(
    this: NodePath,
    opts?: Opts<t.ReturnStatement>,
  ): this is NodePath<t.ReturnStatement>;
  isScopable(
    this: NodePath,
    opts?: Opts<t.Scopable>,
  ): this is NodePath<t.Scopable>;
  isSequenceExpression(
    this: NodePath,
    opts?: Opts<t.SequenceExpression>,
  ): this is NodePath<t.SequenceExpression>;
  isSpreadElement(
    this: NodePath,
    opts?: Opts<t.SpreadElement>,
  ): this is NodePath<t.SpreadElement>;
  isSpreadProperty(
    this: NodePath,
    opts?: Opts<t.SpreadProperty>,
  ): this is NodePath<t.SpreadProperty>;
  isStandardized(
    this: NodePath,
    opts?: Opts<t.Standardized>,
  ): this is NodePath<t.Standardized>;
  isStatement(
    this: NodePath,
    opts?: Opts<t.Statement>,
  ): this is NodePath<t.Statement>;
  isStaticBlock(
    this: NodePath,
    opts?: Opts<t.StaticBlock>,
  ): this is NodePath<t.StaticBlock>;
  isStringLiteral(
    this: NodePath,
    opts?: Opts<t.StringLiteral>,
  ): this is NodePath<t.StringLiteral>;
  isStringLiteralTypeAnnotation(
    this: NodePath,
    opts?: Opts<t.StringLiteralTypeAnnotation>,
  ): this is NodePath<t.StringLiteralTypeAnnotation>;
  isStringTypeAnnotation(
    this: NodePath,
    opts?: Opts<t.StringTypeAnnotation>,
  ): this is NodePath<t.StringTypeAnnotation>;
  isSuper(this: NodePath, opts?: Opts<t.Super>): this is NodePath<t.Super>;
  isSwitchCase(
    this: NodePath,
    opts?: Opts<t.SwitchCase>,
  ): this is NodePath<t.SwitchCase>;
  isSwitchStatement(
    this: NodePath,
    opts?: Opts<t.SwitchStatement>,
  ): this is NodePath<t.SwitchStatement>;
  isSymbolTypeAnnotation(
    this: NodePath,
    opts?: Opts<t.SymbolTypeAnnotation>,
  ): this is NodePath<t.SymbolTypeAnnotation>;
  isTSAnyKeyword(
    this: NodePath,
    opts?: Opts<t.TSAnyKeyword>,
  ): this is NodePath<t.TSAnyKeyword>;
  isTSArrayType(
    this: NodePath,
    opts?: Opts<t.TSArrayType>,
  ): this is NodePath<t.TSArrayType>;
  isTSAsExpression(
    this: NodePath,
    opts?: Opts<t.TSAsExpression>,
  ): this is NodePath<t.TSAsExpression>;
  isTSBaseType(
    this: NodePath,
    opts?: Opts<t.TSBaseType>,
  ): this is NodePath<t.TSBaseType>;
  isTSBigIntKeyword(
    this: NodePath,
    opts?: Opts<t.TSBigIntKeyword>,
  ): this is NodePath<t.TSBigIntKeyword>;
  isTSBooleanKeyword(
    this: NodePath,
    opts?: Opts<t.TSBooleanKeyword>,
  ): this is NodePath<t.TSBooleanKeyword>;
  isTSCallSignatureDeclaration(
    this: NodePath,
    opts?: Opts<t.TSCallSignatureDeclaration>,
  ): this is NodePath<t.TSCallSignatureDeclaration>;
  isTSConditionalType(
    this: NodePath,
    opts?: Opts<t.TSConditionalType>,
  ): this is NodePath<t.TSConditionalType>;
  isTSConstructSignatureDeclaration(
    this: NodePath,
    opts?: Opts<t.TSConstructSignatureDeclaration>,
  ): this is NodePath<t.TSConstructSignatureDeclaration>;
  isTSConstructorType(
    this: NodePath,
    opts?: Opts<t.TSConstructorType>,
  ): this is NodePath<t.TSConstructorType>;
  isTSDeclareFunction(
    this: NodePath,
    opts?: Opts<t.TSDeclareFunction>,
  ): this is NodePath<t.TSDeclareFunction>;
  isTSDeclareMethod(
    this: NodePath,
    opts?: Opts<t.TSDeclareMethod>,
  ): this is NodePath<t.TSDeclareMethod>;
  isTSEntityName(
    this: NodePath,
    opts?: Opts<t.TSEntityName>,
  ): this is NodePath<t.TSEntityName>;
  isTSEnumBody(
    this: NodePath,
    opts?: Opts<t.TSEnumBody>,
  ): this is NodePath<t.TSEnumBody>;
  isTSEnumDeclaration(
    this: NodePath,
    opts?: Opts<t.TSEnumDeclaration>,
  ): this is NodePath<t.TSEnumDeclaration>;
  isTSEnumMember(
    this: NodePath,
    opts?: Opts<t.TSEnumMember>,
  ): this is NodePath<t.TSEnumMember>;
  isTSExportAssignment(
    this: NodePath,
    opts?: Opts<t.TSExportAssignment>,
  ): this is NodePath<t.TSExportAssignment>;
  isTSExpressionWithTypeArguments(
    this: NodePath,
    opts?: Opts<t.TSExpressionWithTypeArguments>,
  ): this is NodePath<t.TSExpressionWithTypeArguments>;
  isTSExternalModuleReference(
    this: NodePath,
    opts?: Opts<t.TSExternalModuleReference>,
  ): this is NodePath<t.TSExternalModuleReference>;
  isTSFunctionType(
    this: NodePath,
    opts?: Opts<t.TSFunctionType>,
  ): this is NodePath<t.TSFunctionType>;
  isTSImportEqualsDeclaration(
    this: NodePath,
    opts?: Opts<t.TSImportEqualsDeclaration>,
  ): this is NodePath<t.TSImportEqualsDeclaration>;
  isTSImportType(
    this: NodePath,
    opts?: Opts<t.TSImportType>,
  ): this is NodePath<t.TSImportType>;
  isTSIndexSignature(
    this: NodePath,
    opts?: Opts<t.TSIndexSignature>,
  ): this is NodePath<t.TSIndexSignature>;
  isTSIndexedAccessType(
    this: NodePath,
    opts?: Opts<t.TSIndexedAccessType>,
  ): this is NodePath<t.TSIndexedAccessType>;
  isTSInferType(
    this: NodePath,
    opts?: Opts<t.TSInferType>,
  ): this is NodePath<t.TSInferType>;
  isTSInstantiationExpression(
    this: NodePath,
    opts?: Opts<t.TSInstantiationExpression>,
  ): this is NodePath<t.TSInstantiationExpression>;
  isTSInterfaceBody(
    this: NodePath,
    opts?: Opts<t.TSInterfaceBody>,
  ): this is NodePath<t.TSInterfaceBody>;
  isTSInterfaceDeclaration(
    this: NodePath,
    opts?: Opts<t.TSInterfaceDeclaration>,
  ): this is NodePath<t.TSInterfaceDeclaration>;
  isTSIntersectionType(
    this: NodePath,
    opts?: Opts<t.TSIntersectionType>,
  ): this is NodePath<t.TSIntersectionType>;
  isTSIntrinsicKeyword(
    this: NodePath,
    opts?: Opts<t.TSIntrinsicKeyword>,
  ): this is NodePath<t.TSIntrinsicKeyword>;
  isTSLiteralType(
    this: NodePath,
    opts?: Opts<t.TSLiteralType>,
  ): this is NodePath<t.TSLiteralType>;
  isTSMappedType(
    this: NodePath,
    opts?: Opts<t.TSMappedType>,
  ): this is NodePath<t.TSMappedType>;
  isTSMethodSignature(
    this: NodePath,
    opts?: Opts<t.TSMethodSignature>,
  ): this is NodePath<t.TSMethodSignature>;
  isTSModuleBlock(
    this: NodePath,
    opts?: Opts<t.TSModuleBlock>,
  ): this is NodePath<t.TSModuleBlock>;
  isTSModuleDeclaration(
    this: NodePath,
    opts?: Opts<t.TSModuleDeclaration>,
  ): this is NodePath<t.TSModuleDeclaration>;
  isTSNamedTupleMember(
    this: NodePath,
    opts?: Opts<t.TSNamedTupleMember>,
  ): this is NodePath<t.TSNamedTupleMember>;
  isTSNamespaceExportDeclaration(
    this: NodePath,
    opts?: Opts<t.TSNamespaceExportDeclaration>,
  ): this is NodePath<t.TSNamespaceExportDeclaration>;
  isTSNeverKeyword(
    this: NodePath,
    opts?: Opts<t.TSNeverKeyword>,
  ): this is NodePath<t.TSNeverKeyword>;
  isTSNonNullExpression(
    this: NodePath,
    opts?: Opts<t.TSNonNullExpression>,
  ): this is NodePath<t.TSNonNullExpression>;
  isTSNullKeyword(
    this: NodePath,
    opts?: Opts<t.TSNullKeyword>,
  ): this is NodePath<t.TSNullKeyword>;
  isTSNumberKeyword(
    this: NodePath,
    opts?: Opts<t.TSNumberKeyword>,
  ): this is NodePath<t.TSNumberKeyword>;
  isTSObjectKeyword(
    this: NodePath,
    opts?: Opts<t.TSObjectKeyword>,
  ): this is NodePath<t.TSObjectKeyword>;
  isTSOptionalType(
    this: NodePath,
    opts?: Opts<t.TSOptionalType>,
  ): this is NodePath<t.TSOptionalType>;
  isTSParameterProperty(
    this: NodePath,
    opts?: Opts<t.TSParameterProperty>,
  ): this is NodePath<t.TSParameterProperty>;
  isTSParenthesizedType(
    this: NodePath,
    opts?: Opts<t.TSParenthesizedType>,
  ): this is NodePath<t.TSParenthesizedType>;
  isTSPropertySignature(
    this: NodePath,
    opts?: Opts<t.TSPropertySignature>,
  ): this is NodePath<t.TSPropertySignature>;
  isTSQualifiedName(
    this: NodePath,
    opts?: Opts<t.TSQualifiedName>,
  ): this is NodePath<t.TSQualifiedName>;
  isTSRestType(
    this: NodePath,
    opts?: Opts<t.TSRestType>,
  ): this is NodePath<t.TSRestType>;
  isTSSatisfiesExpression(
    this: NodePath,
    opts?: Opts<t.TSSatisfiesExpression>,
  ): this is NodePath<t.TSSatisfiesExpression>;
  isTSStringKeyword(
    this: NodePath,
    opts?: Opts<t.TSStringKeyword>,
  ): this is NodePath<t.TSStringKeyword>;
  isTSSymbolKeyword(
    this: NodePath,
    opts?: Opts<t.TSSymbolKeyword>,
  ): this is NodePath<t.TSSymbolKeyword>;
  isTSThisType(
    this: NodePath,
    opts?: Opts<t.TSThisType>,
  ): this is NodePath<t.TSThisType>;
  isTSTupleType(
    this: NodePath,
    opts?: Opts<t.TSTupleType>,
  ): this is NodePath<t.TSTupleType>;
  isTSType(this: NodePath, opts?: Opts<t.TSType>): this is NodePath<t.TSType>;
  isTSTypeAliasDeclaration(
    this: NodePath,
    opts?: Opts<t.TSTypeAliasDeclaration>,
  ): this is NodePath<t.TSTypeAliasDeclaration>;
  isTSTypeAnnotation(
    this: NodePath,
    opts?: Opts<t.TSTypeAnnotation>,
  ): this is NodePath<t.TSTypeAnnotation>;
  isTSTypeAssertion(
    this: NodePath,
    opts?: Opts<t.TSTypeAssertion>,
  ): this is NodePath<t.TSTypeAssertion>;
  isTSTypeElement(
    this: NodePath,
    opts?: Opts<t.TSTypeElement>,
  ): this is NodePath<t.TSTypeElement>;
  isTSTypeLiteral(
    this: NodePath,
    opts?: Opts<t.TSTypeLiteral>,
  ): this is NodePath<t.TSTypeLiteral>;
  isTSTypeOperator(
    this: NodePath,
    opts?: Opts<t.TSTypeOperator>,
  ): this is NodePath<t.TSTypeOperator>;
  isTSTypeParameter(
    this: NodePath,
    opts?: Opts<t.TSTypeParameter>,
  ): this is NodePath<t.TSTypeParameter>;
  isTSTypeParameterDeclaration(
    this: NodePath,
    opts?: Opts<t.TSTypeParameterDeclaration>,
  ): this is NodePath<t.TSTypeParameterDeclaration>;
  isTSTypeParameterInstantiation(
    this: NodePath,
    opts?: Opts<t.TSTypeParameterInstantiation>,
  ): this is NodePath<t.TSTypeParameterInstantiation>;
  isTSTypePredicate(
    this: NodePath,
    opts?: Opts<t.TSTypePredicate>,
  ): this is NodePath<t.TSTypePredicate>;
  isTSTypeQuery(
    this: NodePath,
    opts?: Opts<t.TSTypeQuery>,
  ): this is NodePath<t.TSTypeQuery>;
  isTSTypeReference(
    this: NodePath,
    opts?: Opts<t.TSTypeReference>,
  ): this is NodePath<t.TSTypeReference>;
  isTSUndefinedKeyword(
    this: NodePath,
    opts?: Opts<t.TSUndefinedKeyword>,
  ): this is NodePath<t.TSUndefinedKeyword>;
  isTSUnionType(
    this: NodePath,
    opts?: Opts<t.TSUnionType>,
  ): this is NodePath<t.TSUnionType>;
  isTSUnknownKeyword(
    this: NodePath,
    opts?: Opts<t.TSUnknownKeyword>,
  ): this is NodePath<t.TSUnknownKeyword>;
  isTSVoidKeyword(
    this: NodePath,
    opts?: Opts<t.TSVoidKeyword>,
  ): this is NodePath<t.TSVoidKeyword>;
  isTaggedTemplateExpression(
    this: NodePath,
    opts?: Opts<t.TaggedTemplateExpression>,
  ): this is NodePath<t.TaggedTemplateExpression>;
  isTemplateElement(
    this: NodePath,
    opts?: Opts<t.TemplateElement>,
  ): this is NodePath<t.TemplateElement>;
  isTemplateLiteral(
    this: NodePath,
    opts?: Opts<t.TemplateLiteral>,
  ): this is NodePath<t.TemplateLiteral>;
  isTerminatorless(
    this: NodePath,
    opts?: Opts<t.Terminatorless>,
  ): this is NodePath<t.Terminatorless>;
  isThisExpression(
    this: NodePath,
    opts?: Opts<t.ThisExpression>,
  ): this is NodePath<t.ThisExpression>;
  isThisTypeAnnotation(
    this: NodePath,
    opts?: Opts<t.ThisTypeAnnotation>,
  ): this is NodePath<t.ThisTypeAnnotation>;
  isThrowStatement(
    this: NodePath,
    opts?: Opts<t.ThrowStatement>,
  ): this is NodePath<t.ThrowStatement>;
  isTopicReference(
    this: NodePath,
    opts?: Opts<t.TopicReference>,
  ): this is NodePath<t.TopicReference>;
  isTryStatement(
    this: NodePath,
    opts?: Opts<t.TryStatement>,
  ): this is NodePath<t.TryStatement>;
  isTupleExpression(
    this: NodePath,
    opts?: Opts<t.TupleExpression>,
  ): this is NodePath<t.TupleExpression>;
  isTupleTypeAnnotation(
    this: NodePath,
    opts?: Opts<t.TupleTypeAnnotation>,
  ): this is NodePath<t.TupleTypeAnnotation>;
  isTypeAlias(
    this: NodePath,
    opts?: Opts<t.TypeAlias>,
  ): this is NodePath<t.TypeAlias>;
  isTypeAnnotation(
    this: NodePath,
    opts?: Opts<t.TypeAnnotation>,
  ): this is NodePath<t.TypeAnnotation>;
  isTypeCastExpression(
    this: NodePath,
    opts?: Opts<t.TypeCastExpression>,
  ): this is NodePath<t.TypeCastExpression>;
  isTypeParameter(
    this: NodePath,
    opts?: Opts<t.TypeParameter>,
  ): this is NodePath<t.TypeParameter>;
  isTypeParameterDeclaration(
    this: NodePath,
    opts?: Opts<t.TypeParameterDeclaration>,
  ): this is NodePath<t.TypeParameterDeclaration>;
  isTypeParameterInstantiation(
    this: NodePath,
    opts?: Opts<t.TypeParameterInstantiation>,
  ): this is NodePath<t.TypeParameterInstantiation>;
  isTypeScript(
    this: NodePath,
    opts?: Opts<t.TypeScript>,
  ): this is NodePath<t.TypeScript>;
  isTypeofTypeAnnotation(
    this: NodePath,
    opts?: Opts<t.TypeofTypeAnnotation>,
  ): this is NodePath<t.TypeofTypeAnnotation>;
  isUnaryExpression(
    this: NodePath,
    opts?: Opts<t.UnaryExpression>,
  ): this is NodePath<t.UnaryExpression>;
  isUnaryLike(
    this: NodePath,
    opts?: Opts<t.UnaryLike>,
  ): this is NodePath<t.UnaryLike>;
  isUnionTypeAnnotation(
    this: NodePath,
    opts?: Opts<t.UnionTypeAnnotation>,
  ): this is NodePath<t.UnionTypeAnnotation>;
  isUpdateExpression(
    this: NodePath,
    opts?: Opts<t.UpdateExpression>,
  ): this is NodePath<t.UpdateExpression>;
  isUserWhitespacable(
    this: NodePath,
    opts?: Opts<t.UserWhitespacable>,
  ): this is NodePath<t.UserWhitespacable>;
  isV8IntrinsicIdentifier(
    this: NodePath,
    opts?: Opts<t.V8IntrinsicIdentifier>,
  ): this is NodePath<t.V8IntrinsicIdentifier>;
  isVariableDeclaration(
    this: NodePath,
    opts?: Opts<t.VariableDeclaration>,
  ): this is NodePath<t.VariableDeclaration>;
  isVariableDeclarator(
    this: NodePath,
    opts?: Opts<t.VariableDeclarator>,
  ): this is NodePath<t.VariableDeclarator>;
  isVariance(
    this: NodePath,
    opts?: Opts<t.Variance>,
  ): this is NodePath<t.Variance>;
  isVoidTypeAnnotation(
    this: NodePath,
    opts?: Opts<t.VoidTypeAnnotation>,
  ): this is NodePath<t.VoidTypeAnnotation>;
  isWhile(this: NodePath, opts?: Opts<t.While>): this is NodePath<t.While>;
  isWhileStatement(
    this: NodePath,
    opts?: Opts<t.WhileStatement>,
  ): this is NodePath<t.WhileStatement>;
  isWithStatement(
    this: NodePath,
    opts?: Opts<t.WithStatement>,
  ): this is NodePath<t.WithStatement>;
  isYieldExpression(
    this: NodePath,
    opts?: Opts<t.YieldExpression>,
  ): this is NodePath<t.YieldExpression>;
}

export interface NodePathValidators
  extends Omit<BaseNodePathValidators, keyof VirtualTypeNodePathValidators>,
    VirtualTypeNodePathValidators {}
