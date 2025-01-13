import * as t from "../../../lib/index.js";

describe("builders", function () {
  describe("typescript", function () {
    describe("tsTypeOperator", function () {
      it("accept operator as argument for tsTypeOperator", function () {
        const tsTypeOperator = t.TSTypeOperator(
          t.TSTypeQuery(t.Identifier("x")),
          "keyof",
        );
        expect(tsTypeOperator).toMatchInlineSnapshot(`
          Object {
            "operator": "keyof",
            "type": "TSTypeOperator",
            "typeAnnotation": Object {
              "exprName": Object {
                "name": "x",
                "type": "Identifier",
              },
              "type": "TSTypeQuery",
              "typeParameters": null,
            },
          }
          `);
      });
    });
  });
});
