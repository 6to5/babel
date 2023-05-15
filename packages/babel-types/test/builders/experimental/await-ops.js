import * as t from "../../../lib/index.js";

describe("builders", function () {
  describe("experimental", function () {
    describe("await expression with operation", function () {
      it("operation is optional", function () {
        expect(t.awaitExpression(t.numericLiteral(0))).toMatchInlineSnapshot(`
          Object {
            "argument": Object {
              "type": "NumericLiteral",
              "value": 0,
            },
            "operation": null,
            "type": "AwaitExpression",
          }
        `);
      });
      it("should accept valid operation", function () {
        expect(t.awaitExpression(t.numericLiteral(0), t.identifier("any")))
          .toMatchInlineSnapshot(`
          Object {
            "argument": Object {
              "type": "NumericLiteral",
              "value": 0,
            },
            "operation": Object {
              "name": "any",
              "type": "Identifier",
            },
            "type": "AwaitExpression",
          }
        `);
      });
      it("should throw on unsupported operation", function () {
        expect(() =>
          t.awaitExpression(t.numericLiteral(0), t.identifier("resolve")),
        ).toThrowErrorMatchingInlineSnapshot(
          `"The only valid await operations are \\"all\\", \\"allSettled\\", \\"any\\" and \\"race\\", but got \\"resolve\\""`,
        );
      });
    });
  });
});
