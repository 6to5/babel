import * as t from "@babel/types";
import { IS_BABEL_8 } from "$repo-utils";

import _Printer from "../lib/printer.js";
const Printer = _Printer.default || _Printer;

describe("Printer", () => {
  it("completeness", function () {
    Object.keys(t.VISITOR_KEYS).forEach(function (type) {
      expect(Printer.prototype[type]).toBeTruthy();
    });

    Object.keys(Printer.prototype).forEach(function (type) {
      if (IS_BABEL_8()) {
        // Babel 7 AST
        if (
          type === "DecimalLiteral" ||
          type === "TSExpressionWithTypeArguments"
        ) {
          return;
        }
      } else {
        // Babel 8 AST
        if (
          type === "TSClassImplements" ||
          type === "TSEnumBody" ||
          type === "TSInterfaceHeritage"
        ) {
          return;
        }
      }

      if (!/[A-Z]/.test(type[0])) return;

      expect(t.VISITOR_KEYS).toHaveProperty(type);
    });
  });
});
