import * as t from "../../../lib/index.js";
import { describeBabel8, describeBabel7 } from "$repo-utils";

describe("builders", function () {
  describe("typescript", function () {
    describeBabel8("tsTypeParameter", function () {
      it("accept name as argument for tsTypeParameter", function () {
        const tsTypeParameter = t.tsTypeParameter(
          t.tsTypeReference(t.identifier("bar")),
          t.tsTypeReference(t.identifier("baz")),
          t.identifier("foo"),
        );
        expect(tsTypeParameter).toMatchInlineSnapshot(`
          Object {
            "constraint": Object {
              "type": "TSTypeReference",
              "typeArguments": null,
              "typeName": Object {
                "name": "bar",
                "type": "Identifier",
              },
            },
            "default": Object {
              "type": "TSTypeReference",
              "typeArguments": null,
              "typeName": Object {
                "name": "baz",
                "type": "Identifier",
              },
            },
            "name": Object {
              "name": "foo",
              "type": "Identifier",
            },
            "type": "TSTypeParameter",
          }
        `);
      });
      it("throws when name is missing", function () {
        expect(() => {
          t.tsTypeParameter(
            t.tsTypeReference(t.identifier("bar")),
            t.tsTypeReference(t.identifier("baz")),
          );
        }).toThrow(
          'Property name of TSTypeParameter expected node to be of a type ["Identifier"] but instead got undefined',
        );
      });
    });
    describeBabel7("tsTypeParameter - Babel 7", function () {
      it("accept name as argument for tsTypeParameter in Babel 7", function () {
        const tsTypeParameter = t.tsTypeParameter(
          t.tsTypeReference(t.identifier("bar")),
          t.tsTypeReference(t.identifier("baz")),
          "foo",
        );
        expect(tsTypeParameter).toMatchInlineSnapshot(`
            Object {
              "constraint": Object {
                "type": "TSTypeReference",
                "typeName": Object {
                  "name": "bar",
                  "type": "Identifier",
                },
                "typeParameters": null,
              },
              "default": Object {
                "type": "TSTypeReference",
                "typeName": Object {
                  "name": "baz",
                  "type": "Identifier",
                },
                "typeParameters": null,
              },
              "name": "foo",
              "type": "TSTypeParameter",
            }
          `);
      });
      it("throws when name is missing in Babel 7", function () {
        expect(() => {
          t.tsTypeParameter(
            t.tsTypeReference(t.identifier("bar")),
            t.tsTypeReference(t.identifier("baz")),
          );
        }).toThrow("Property name expected type of string but got undefined");
      });
    });
  });
});
