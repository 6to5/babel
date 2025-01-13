import type * as t from "@babel/types";

export interface VirtualTypeAliases {
  BindingIdentifier: t.Identifier;
  BlockScoped:
    | t.FunctionDeclaration
    | t.ClassDeclaration
    | t.VariableDeclaration;
  ExistentialTypeParam: t.ExistsTypeAnnotation;
  Expression: t.Expression;
  Flow: t.Flow | t.ImportDeclaration | t.ExportDeclaration | t.ImportSpecifier;
  ForAwaitStatement: t.ForOfStatement;
  Generated: t.Node;
  NumericLiteralTypeAnnotation: t.NumberLiteralTypeAnnotation;
  Pure: t.Node;
  Referenced: t.Node;
  ReferencedIdentifier: t.Identifier | t.JSXIdentifier;
  ReferencedMemberExpression: t.MemberExpression;
  RestProperty: t.RestElement;
  Scope: t.Scopable | t.Pattern;
  SpreadProperty: t.RestElement;
  Statement: t.Statement;
  User: t.Node;
  Var: t.VariableDeclaration;
}

type VirtualTypeMapping = readonly (t.Node["type"] | keyof t.Aliases)[] | null;

export const ReferencedIdentifier: VirtualTypeMapping = [
  "Identifier",
  "JSXIdentifier",
] as const;

export const ReferencedMemberExpression: VirtualTypeMapping = [
  "MemberExpression",
] as const;

export const BindingIdentifier: VirtualTypeMapping = ["Identifier"] as const;

export const Statement: VirtualTypeMapping = ["Statement"] as const;

export const Expression: VirtualTypeMapping = ["Expression"] as const;

export const Scope: VirtualTypeMapping = ["Scopable", "Pattern"] as const;

export const Referenced: VirtualTypeMapping = null;

export const BlockScoped: VirtualTypeMapping = [
  "FunctionDeclaration",
  "ClassDeclaration",
  "VariableDeclaration",
] as const;

export const Var: VirtualTypeMapping = ["VariableDeclaration"];

export const User: VirtualTypeMapping = null;

export const Generated: VirtualTypeMapping = null;

export const Pure: VirtualTypeMapping = null;

export const Flow: VirtualTypeMapping = [
  "Flow",
  "ImportDeclaration",
  "ExportDeclaration",
  "ImportSpecifier",
] as const;

// TODO: 7.0 Backwards Compat
export const RestProperty: VirtualTypeMapping = ["RestElement"] as const;

export const SpreadProperty: VirtualTypeMapping = ["RestElement"] as const;

export const ExistentialTypeParam: VirtualTypeMapping = [
  "ExistsTypeAnnotation",
] as const;

export const NumericLiteralTypeAnnotation: VirtualTypeMapping = [
  "NumberLiteralTypeAnnotation",
] as const;

export const ForAwaitStatement: VirtualTypeMapping = [
  "ForOfStatement",
] as const;
