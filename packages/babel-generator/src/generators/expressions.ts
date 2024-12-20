import type Printer from "../printer.ts";
import {
  isCallExpression,
  isLiteral,
  isMemberExpression,
  isNewExpression,
  isPattern,
} from "@babel/types";
import type * as t from "@babel/types";
import { TokenContext } from "../node/index.ts";

export function UnaryExpression(this: Printer, node: t.UnaryExpression) {
  const { operator } = node;
  if (
    operator === "void" ||
    operator === "delete" ||
    operator === "typeof" ||
    // throwExpressions
    operator === "throw"
  ) {
    this.word(operator);
    this.space();
  } else {
    this.token(operator);
  }

  this.print(node.argument);
}

export function DoExpression(this: Printer, node: t.DoExpression) {
  if (node.async) {
    this.word("async", true);
    this.space();
  }
  this.word("do");
  this.space();
  this.print(node.body);
}

export function ParenthesizedExpression(
  this: Printer,
  node: t.ParenthesizedExpression,
) {
  this.token("(");
  const exit = this.enterDelimited();
  this.print(node.expression);
  exit();
  this.rightParens(node);
}

export function UpdateExpression(this: Printer, node: t.UpdateExpression) {
  if (node.prefix) {
    this.token(node.operator);
    this.print(node.argument);
  } else {
    this.print(node.argument, true);
    this.token(node.operator);
  }
}

export function ConditionalExpression(
  this: Printer,
  node: t.ConditionalExpression,
) {
  this.print(node.test);
  this.space();
  this.token("?");
  this.space();
  this.print(node.consequent);
  this.space();
  this.token(":");
  this.space();
  this.print(node.alternate);
}

export function NewExpression(
  this: Printer,
  node: t.NewExpression,
  parent: t.Node,
) {
  this.word("new");
  this.space();
  this.print(node.callee);
  if (
    this.format.minified &&
    node.arguments.length === 0 &&
    // @ts-ignore(Babel 7 vs Babel 8) Removed in Babel 8
    !node.optional &&
    !isCallExpression(parent, { callee: node }) &&
    !isMemberExpression(parent) &&
    !isNewExpression(parent)
  ) {
    return;
  }

  this.print(node.typeArguments);
  if (!process.env.BABEL_8_BREAKING) {
    // @ts-ignore(Babel 7 vs Babel 8) Removed in Babel 8
    this.print(node.typeParameters); // Legacy TS AST
  }

  // @ts-ignore(Babel 7 vs Babel 8) Removed in Babel 8
  if (node.optional) {
    // TODO: This can never happen
    this.token("?.");
  }

  if (
    node.arguments.length === 0 &&
    this.tokenMap &&
    !this.tokenMap.endMatches(node, ")")
  ) {
    return;
  }

  this.token("(");
  const exit = this.enterDelimited();
  this.printList(node.arguments, this.shouldPrintTrailingComma(")"));
  exit();
  this.rightParens(node);
}

export function SequenceExpression(this: Printer, node: t.SequenceExpression) {
  this.printList(node.expressions);
}

export function ThisExpression(this: Printer) {
  this.word("this");
}

export function Super(this: Printer) {
  this.word("super");
}

export function _shouldPrintDecoratorsBeforeExport(
  this: Printer,
  node: t.ExportDeclaration & { declaration: t.ClassDeclaration },
) {
  if (typeof this.format.decoratorsBeforeExport === "boolean") {
    return this.format.decoratorsBeforeExport;
  }
  return (
    typeof node.start === "number" && node.start === node.declaration.start
  );
}

export function Decorator(this: Printer, node: t.Decorator) {
  this.token("@");
  this.print(node.expression);
  this.newline();
}

export function OptionalMemberExpression(
  this: Printer,
  node: t.OptionalMemberExpression,
) {
  let { computed } = node;
  const { optional, property } = node;

  this.print(node.object);

  if (!computed && isMemberExpression(property)) {
    throw new TypeError("Got a MemberExpression for MemberExpression property");
  }

  // @ts-expect-error todo(flow->ts) maybe instead of typeof check specific literal types?
  if (isLiteral(property) && typeof property.value === "number") {
    computed = true;
  }
  if (optional) {
    this.token("?.");
  }

  if (computed) {
    this.token("[");
    this.print(property);
    this.token("]");
  } else {
    if (!optional) {
      this.token(".");
    }
    this.print(property);
  }
}

export function OptionalCallExpression(
  this: Printer,
  node: t.OptionalCallExpression,
) {
  this.print(node.callee);

  if (!process.env.BABEL_8_BREAKING) {
    // @ts-ignore(Babel 7 vs Babel 8) Removed in Babel 8
    this.print(node.typeParameters); // legacy TS AST
  }

  if (node.optional) {
    this.token("?.");
  }

  this.print(node.typeArguments);

  this.token("(");
  const exit = this.enterDelimited();
  this.printList(node.arguments);
  exit();
  this.rightParens(node);
}

export function CallExpression(this: Printer, node: t.CallExpression) {
  this.print(node.callee);

  this.print(node.typeArguments);
  if (!process.env.BABEL_8_BREAKING) {
    // @ts-ignore(Babel 7 vs Babel 8) Removed in Babel 8
    this.print(node.typeParameters); // legacy TS AST
  }
  this.token("(");
  const exit = this.enterDelimited();
  this.printList(node.arguments, this.shouldPrintTrailingComma(")"));
  exit();
  this.rightParens(node);
}

export function Import(this: Printer) {
  this.word("import");
}

export function AwaitExpression(this: Printer, node: t.AwaitExpression) {
  this.word("await");

  if (node.argument) {
    this.space();
    this.printTerminatorless(node.argument);
  }
}

export function YieldExpression(this: Printer, node: t.YieldExpression) {
  this.word("yield", true);

  if (node.delegate) {
    this.token("*");
    if (node.argument) {
      this.space();
      // line terminators are allowed after yield*
      this.print(node.argument);
    }
  } else {
    if (node.argument) {
      this.space();
      this.printTerminatorless(node.argument);
    }
  }
}

export function EmptyStatement(this: Printer) {
  this.semicolon(true /* force */);
}

export function ExpressionStatement(
  this: Printer,
  node: t.ExpressionStatement,
) {
  this.tokenContext |= TokenContext.expressionStatement;
  this.print(node.expression);
  this.semicolon();
}

export function AssignmentPattern(this: Printer, node: t.AssignmentPattern) {
  this.print(node.left);
  if (node.left.type === "Identifier" || isPattern(node.left)) {
    if (node.left.optional) this.token("?");
    this.print(node.left.typeAnnotation);
  }
  this.space();
  this.token("=");
  this.space();
  this.print(node.right);
}

export function AssignmentExpression(
  this: Printer,
  node: t.AssignmentExpression | t.BinaryExpression | t.LogicalExpression,
) {
  this.print(node.left);

  this.space();
  if (node.operator === "in" || node.operator === "instanceof") {
    this.word(node.operator);
  } else {
    this.token(node.operator);
    this._endsWithDiv = node.operator === "/";
  }
  this.space();

  this.print(node.right);
}

export function BindExpression(this: Printer, node: t.BindExpression) {
  this.print(node.object);
  this.token("::");
  this.print(node.callee);
}

export {
  AssignmentExpression as BinaryExpression,
  AssignmentExpression as LogicalExpression,
};

export function MemberExpression(this: Printer, node: t.MemberExpression) {
  this.print(node.object);

  if (!node.computed && isMemberExpression(node.property)) {
    throw new TypeError("Got a MemberExpression for MemberExpression property");
  }

  let computed = node.computed;
  // @ts-expect-error todo(flow->ts) maybe use specific literal types
  if (isLiteral(node.property) && typeof node.property.value === "number") {
    computed = true;
  }

  if (computed) {
    const exit = this.enterDelimited();
    this.token("[");
    this.print(node.property);
    this.token("]");
    exit();
  } else {
    this.token(".");
    this.print(node.property);
  }
}

export function MetaProperty(this: Printer, node: t.MetaProperty) {
  this.print(node.meta);
  this.token(".");
  this.print(node.property);
}

export function PrivateName(this: Printer, node: t.PrivateName) {
  this.token("#");
  this.print(node.id);
}

export function V8IntrinsicIdentifier(
  this: Printer,
  node: t.V8IntrinsicIdentifier,
) {
  this.token("%");
  this.word(node.name);
}

export function ModuleExpression(this: Printer, node: t.ModuleExpression) {
  this.word("module", true);
  this.space();
  this.token("{");
  this.indent();
  const { body } = node;
  if (body.body.length || body.directives.length) {
    this.newline();
  }
  this.print(body);
  this.dedent();
  this.rightBrace(node);
}
