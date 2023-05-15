import { createRequire } from "module";
const require = createRequire(import.meta.url);

describe("stage-1 preset", () => {
  let Babel;
  beforeAll(() => {
    Babel = require("../babel.js");
  });

  it("should parser decimal literal", () => {
    const output = Babel.transform("0.3m", {
      presets: [["stage-1", { decoratorsLegacy: true }]],
    }).code;
    expect(output).toBe("0.3m;");
  });

  it("should support hack pipeline", () => {
    const output = Babel.transform("x |> %", {
      presets: [
        [
          "stage-1",
          {
            pipelineProposal: "hack",
            decoratorsLegacy: true,
          },
        ],
      ],
    }).code;
    expect(output).toMatchInlineSnapshot(`"x;"`);
  });

  it("should support hack pipeline with `#` topic token", () => {
    const output = Babel.transform("x |> #", {
      presets: [
        [
          "stage-1",
          {
            pipelineProposal: "hack",
            pipelineTopicToken: "#",
            recordAndTupleSyntax: "bar",
            decoratorsLegacy: true,
          },
        ],
      ],
    }).code;
    expect(output).toMatchInlineSnapshot(`"x;"`);
  });
  it("should support decorators versioned 2021-12", () => {
    const output = Babel.transform("@dec class C {}", {
      plugins: [["external-helpers", { helperVersion: "7.100.0" }]],
      presets: [["stage-1", { decoratorsVersion: "2021-12" }]],
    }).code;
    expect(output).toMatch("babelHelpers.applyDecs");
  });
  it("should support private destructuring", () => {
    const output = Babel.transform("class C { #x; m({ #x: x}) {} }", {
      plugins: [["external-helpers", { helperVersion: "7.100.0" }]],
      presets: [
        [
          "stage-1",
          {
            decoratorsVersion: "2021-12",
          },
        ],
      ],
    }).code;
    expect(output).not.toContain("#x:");
  });
  it("should support regexp v flag", () => {
    const output = Babel.transform("/[[a-p]&&[d-z]]/v", {
      presets: [["stage-1", { decoratorsVersion: "2021-12" }]],
    }).code;
    expect(output).toMatchInlineSnapshot(`"/[d-p]/u;"`);
  });
  it("should support record and tuple", () => {
    const output = Babel.transform("#[#{}]", {
      presets: [["stage-1", { decoratorsVersion: "2021-12" }]],
    }).code;
    expect(output).toMatchInlineSnapshot(`"Tuple(Record({}));"`);
  });
  it("should support await.ops", () => {
    const output = Babel.transform("async () => await.all []", {
      presets: [["stage-1", { decoratorsVersion: "2022-03" }]],
    }).code;
    expect(output).toMatchInlineSnapshot(
      `"async () => await Promise.all([]);"`,
    );
  });
});
