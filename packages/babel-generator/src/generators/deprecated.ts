import type Printer from "../printer";
import type * as t from "@babel/types";

export type DeprecatedBabel7ASTTypes = "Noop" | "TSExpressionWithTypeArguments";

export function addDeprecatedGenerators(PrinterClass: typeof Printer) {
  // Add Babel 7 generator methods that is removed in Babel 8
  if (!process.env.BABEL_8_BREAKING) {
    const deprecatedBabel7Generators = {
      Noop(this: Printer) {},
      TSExpressionWithTypeArguments(
        this: Printer,
        // @ts-ignore(Babel 7 vs Babel 8) Babel 7 AST
        node: t.TSExpressionWithTypeArguments,
      ) {
        this.print(node.expression);
        this.print(node.typeParameters);
      },
    };
    Object.assign(PrinterClass.prototype, deprecatedBabel7Generators);
  }
}
