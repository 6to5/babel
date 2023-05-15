import type Printer from "../printer";
import {
  isCallExpression,
  isLiteral,
  isMemberExpression,
  isNewExpression,
} from "@babel/types";
import type * as t from "@babel/types";
import * as n from "../node";

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

  this.print(node.argument, node);
}

export function DoExpression(this: Printer, node: t.DoExpression) {
  if (node.async) {
    this.word("async", true);
    this.space();
  }
  this.word("do");
  this.space();
  this.print(node.body, node);
}

export function ParenthesizedExpression(
  this: Printer,
  node: t.ParenthesizedExpression,
) {
  this.token("(");
  this.print(node.expression, node);
  this.rightParens(node);
}

export function UpdateExpression(this: Printer, node: t.UpdateExpression) {
  if (node.prefix) {
    this.token(node.operator);
    this.print(node.argument, node);
  } else {
    this.printTerminatorless(node.argument, node, true);
    this.token(node.operator);
  }
}

export function ConditionalExpression(
  this: Printer,
  node: t.ConditionalExpression,
) {
  this.print(node.test, node);
  this.space();
  this.token("?");
  this.space();
  this.print(node.consequent, node);
  this.space();
  this.token(":");
  this.space();
  this.print(node.alternate, node);
}

export function NewExpression(
  this: Printer,
  node: t.NewExpression,
  parent: t.Node,
) {
  this.word("new");
  this.space();
  this.print(node.callee, node);
  if (
    this.format.minified &&
    node.arguments.length === 0 &&
    !node.optional &&
    !isCallExpression(parent, { callee: node }) &&
    !isMemberExpression(parent) &&
    !isNewExpression(parent)
  ) {
    return;
  }

  this.print(node.typeArguments, node); // Flow
  this.print(node.typeParameters, node); // TS

  if (node.optional) {
    // TODO: This can never happen
    this.token("?.");
  }
  this.token("(");
  this.printList(node.arguments, node);
  this.rightParens(node);
}

export function SequenceExpression(this: Printer, node: t.SequenceExpression) {
  this.printList(node.expressions, node);
}

export function ThisExpression(this: Printer) {
  this.word("this");
}

export function Super(this: Printer) {
  this.word("super");
}

function isDecoratorMemberExpression(
  node: t.Expression | t.Super | t.V8IntrinsicIdentifier,
): boolean {
  switch (node.type) {
    case "Identifier":
      return true;
    case "MemberExpression":
      return (
        !node.computed &&
        node.property.type === "Identifier" &&
        isDecoratorMemberExpression(node.object)
      );
    default:
      return false;
  }
}
function shouldParenthesizeDecoratorExpression(
  node: t.Expression | t.Super | t.V8IntrinsicIdentifier,
) {
  if (node.type === "ParenthesizedExpression") {
    // We didn't check extra?.parenthesized here because we don't track decorators in needsParen
    return false;
  }
  return !isDecoratorMemberExpression(
    node.type === "CallExpression" ? node.callee : node,
  );
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
  const { expression } = node;
  if (shouldParenthesizeDecoratorExpression(expression)) {
    this.token("(");
    this.print(expression, node);
    this.token(")");
  } else {
    this.print(expression, node);
  }
  this.newline();
}

export function OptionalMemberExpression(
  this: Printer,
  node: t.OptionalMemberExpression,
) {
  let { computed } = node;
  const { optional, property } = node;

  this.print(node.object, node);

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
    this.print(property, node);
    this.token("]");
  } else {
    if (!optional) {
      this.token(".");
    }
    this.print(property, node);
  }
}

export function OptionalCallExpression(
  this: Printer,
  node: t.OptionalCallExpression,
) {
  this.print(node.callee, node);

  this.print(node.typeParameters, node); // TS

  if (node.optional) {
    this.token("?.");
  }

  this.print(node.typeArguments, node); // Flow

  this.token("(");
  this.printList(node.arguments, node);
  this.rightParens(node);
}

export function CallExpression(this: Printer, node: t.CallExpression) {
  this.print(node.callee, node);

  this.print(node.typeArguments, node); // Flow
  this.print(node.typeParameters, node); // TS
  this.token("(");
  this.printList(node.arguments, node);
  this.rightParens(node);
}

export function Import(this: Printer) {
  this.word("import");
}

export function AwaitExpression(this: Printer, node: t.AwaitExpression) {
  this.word("await");

  if (node.operation) {
    this.token(".");
    this.print(node.operation, node);
  }

  if (node.argument) {
    this.space();
    this.printTerminatorless(node.argument, node, false);
  }
}

export function YieldExpression(this: Printer, node: t.YieldExpression) {
  this.word("yield", true);

  if (node.delegate) {
    this.token("*");
    if (node.argument) {
      this.space();
      // line terminators are allowed after yield*
      this.print(node.argument, node);
    }
  } else {
    if (node.argument) {
      this.space();
      this.printTerminatorless(node.argument, node, false);
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
  this.print(node.expression, node);
  this.semicolon();
}

export function AssignmentPattern(this: Printer, node: t.AssignmentPattern) {
  this.print(node.left, node);
  // @ts-expect-error todo(flow->ts) property present on some of the types in union but not all
  if (node.left.optional) this.token("?");
  // @ts-expect-error todo(flow->ts) property present on some of the types in union but not all
  this.print(node.left.typeAnnotation, node);
  this.space();
  this.token("=");
  this.space();
  this.print(node.right, node);
}

export function AssignmentExpression(
  this: Printer,
  node: t.AssignmentExpression,
  parent: t.Node,
) {
  // Somewhere inside a for statement `init` node but doesn't usually
  // needs a paren except for `in` expressions: `for (a in b ? a : b;;)`
  const parens =
    this.inForStatementInitCounter &&
    node.operator === "in" &&
    !n.needsParens(node, parent);

  if (parens) {
    this.token("(");
  }

  this.print(node.left, node);

  this.space();
  if (node.operator === "in" || node.operator === "instanceof") {
    this.word(node.operator);
  } else {
    this.token(node.operator);
  }
  this.space();

  this.print(node.right, node);

  if (parens) {
    this.token(")");
  }
}

export function BindExpression(this: Printer, node: t.BindExpression) {
  this.print(node.object, node);
  this.token("::");
  this.print(node.callee, node);
}

export {
  AssignmentExpression as BinaryExpression,
  AssignmentExpression as LogicalExpression,
};

export function MemberExpression(this: Printer, node: t.MemberExpression) {
  this.print(node.object, node);

  if (!node.computed && isMemberExpression(node.property)) {
    throw new TypeError("Got a MemberExpression for MemberExpression property");
  }

  let computed = node.computed;
  // @ts-expect-error todo(flow->ts) maybe use specific literal types
  if (isLiteral(node.property) && typeof node.property.value === "number") {
    computed = true;
  }

  if (computed) {
    this.token("[");
    this.print(node.property, node);
    this.token("]");
  } else {
    this.token(".");
    this.print(node.property, node);
  }
}

export function MetaProperty(this: Printer, node: t.MetaProperty) {
  this.print(node.meta, node);
  this.token(".");
  this.print(node.property, node);
}

export function PrivateName(this: Printer, node: t.PrivateName) {
  this.token("#");
  this.print(node.id, node);
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
  this.print(body, node);
  this.dedent();
  this.rightBrace(node);
}
