import * as t from "../../../lib/index.js";

describe("builders", function () {
  describe("ES2022", function () {
    describe("classProperty", function () {
      it("should validate", function () {
        expect(t.classProperty(t.stringLiteral("test"), t.numericLiteral(1)))
          .toMatchInlineSnapshot(`
          Object {
            "computed": false,
            "decorators": null,
            "key": Object {
              "type": "StringLiteral",
              "value": "test",
            },
            "static": false,
            "type": "ClassProperty",
            "typeAnnotation": null,
            "value": Object {
              "type": "NumericLiteral",
              "value": 1,
            },
          }
        `);

        expect(
          t.classProperty(
            t.stringLiteral("test"),
            t.numericLiteral(1),
            null,
            null,
            false,
            true,
          ),
        ).toMatchInlineSnapshot(`
          Object {
            "computed": false,
            "decorators": null,
            "key": Object {
              "type": "StringLiteral",
              "value": "test",
            },
            "static": true,
            "type": "ClassProperty",
            "typeAnnotation": null,
            "value": Object {
              "type": "NumericLiteral",
              "value": 1,
            },
          }
        `);
      });
    });
  });
});
