import browserslist from "browserslist";
import _getTargets from "../lib/index.js";
const getTargets = _getTargets.default || _getTargets;
import { itBabel8, itBabel7, commonJS } from "$repo-utils";
const { require } = commonJS(import.meta.url);

// Strip prerelease tag
const nodeVersion = process.versions.node.split("-")[0];

describe("getTargets", () => {
  it("parses", () => {
    expect(
      getTargets({
        chrome: 49,
        firefox: "55",
        ie: "9",
        node: "6.10",
        electron: "1.6",
      }),
    ).toEqual({
      chrome: "49.0.0",
      electron: "1.6.0",
      firefox: "55.0.0",
      ie: "9.0.0",
      node: "6.10.0",
    });
  });

  it("does not mutate the input", () => {
    const input = Object.freeze({ browsers: "defaults", esmodules: true });
    const expected = getTargets({
      browsers: browserslist.defaults,
      esmodules: true,
    });
    const actual = getTargets(input);
    expect(actual).toEqual(expected);
    expect(input.browsers).toEqual("defaults");
    expect(input.esmodules).toEqual(true);
  });

  it("allows 'defaults' query", () => {
    const browserslistDefaults = browserslist.defaults;

    const expected = getTargets({ browsers: browserslistDefaults });
    const actual = getTargets({ browsers: "defaults" });

    expect(actual).toEqual(expected);
  });

  it("does not clobber browserslists defaults", () => {
    const browserslistDefaults = browserslist.defaults;

    getTargets({
      browsers: "chrome 56, ie 11, firefox 51, safari 9",
    });

    expect(browserslist.defaults).toEqual(browserslistDefaults);
  });

  it("supports region browserslists query", () => {
    const actual = getTargets({ browsers: "> 0.5% in GB" });
    // chrome 4 is the first release of chrome,
    // it should never be included in this query
    expect(parseFloat(actual.chrome)).toBeGreaterThan(4);
  });

  describe("when process.env.BROWSERSLIST is specified", () => {
    afterAll(() => {
      delete process.env.BROWSERSLIST;
    });
    it("should provide fallback to any targets option", () => {
      process.env.BROWSERSLIST = "firefox 2";
      expect(getTargets()).toEqual({ firefox: "2.0.0" });
    });
  });

  describe("when process.env.BROWSERSLIST_CONFIG is specified", () => {
    afterAll(() => {
      delete process.env.BROWSERSLIST_CONFIG;
    });
    it("should provide fallback to any targets option", () => {
      process.env.BROWSERSLIST_CONFIG = require.resolve(
        "./fixtures/.browserslistrc",
      );
      expect(getTargets()).toEqual({ firefox: "30.0.0", chrome: "70.0.0" });
    });
  });

  describe("validation", () => {
    it("throws on invalid target name", () => {
      const invalidTargetName = () => {
        getTargets({
          unknown: "unknown",
        });
      };
      expect(invalidTargetName).toThrow();
    });

    it("throws on invalid browsers target", () => {
      const invalidBrowsersTarget = () => {
        getTargets({
          browsers: 59,
        });
      };
      expect(invalidBrowsersTarget).toThrow();
    });

    it("throws on invalid target version", () => {
      const invalidTargetVersion = () => {
        getTargets({
          chrome: "unknown",
        });
      };
      expect(invalidTargetVersion).toThrow();
    });
  });

  describe("browser", () => {
    it("merges browser key targets", () => {
      expect(
        getTargets({
          browsers: "chrome 56, ie 11, firefox 51, safari 9",
          chrome: "49",
          firefox: "55",
          ie: "9",
        }),
      ).toEqual({
        chrome: "49.0.0",
        firefox: "55.0.0",
        ie: "9.0.0",
        safari: "9.0.0",
      });
    });

    it("works with TP versions", () => {
      expect(
        getTargets({
          browsers: "safari tp",
        }),
      ).toEqual({
        safari: "tp",
      });
    });

    it("works with node versions", () => {
      expect(
        getTargets({
          browsers: "node 8.5",
        }),
      ).toEqual({
        node: "8.5.0",
      });
    });

    it("works with current node version and string type browsers", () => {
      expect(
        getTargets({
          browsers: "current node, chrome 55, opera 42",
        }),
      ).toEqual({
        node: nodeVersion,
        chrome: "55.0.0",
        opera: "42.0.0",
      });
    });

    it("does throws on unsupported versions", () => {
      expect(() => {
        getTargets({
          browsers: "node 15.0.0, chrome 1000",
        });
      }).toThrow();
    });

    it("works with current node version and array type browsers", () => {
      expect(
        getTargets({
          browsers: ["ie 11", "current node", "chrome 55"],
        }),
      ).toEqual({
        node: nodeVersion,
        chrome: "55.0.0",
        ie: "11.0.0",
      });
    });

    it("prefers released version over TP", () => {
      expect(
        getTargets({
          browsers: "safari tp, safari 11",
        }),
      ).toEqual({
        safari: "11.0.0",
      });
    });

    it("returns TP version in lower case", () => {
      expect(
        getTargets({
          safari: "TP",
        }),
      ).toEqual({
        safari: "tp",
      });
    });

    it("works with android", () => {
      expect(
        getTargets({
          browsers: "Android 4",
        }),
      ).toEqual({
        android: "4.0.0",
      });
    });

    it("works with inequalities", () => {
      expect(
        getTargets({
          browsers: "Android >= 4",
        }),
      ).toEqual({
        android: "4.0.0",
      });
    });
  });

  describe("esmodules", () => {
    it("returns browsers supporting modules", () => {
      expect(
        getTargets({
          esmodules: true,
        }),
      ).toMatchSnapshot();
    });

    it("returns browsers supporting modules, ignoring browsers key", () => {
      expect(
        getTargets({
          esmodules: true,
          browsers: "ie 8",
        }),
      ).toMatchSnapshot();
    });

    it("returns browser supporting modules and keyed browser overrides", () => {
      expect(
        getTargets({
          esmodules: true,
          ie: 11,
        }),
      ).toMatchSnapshot();
    });

    it("returns browser supporting modules and keyed browser overrides, ignoring browsers field", () => {
      expect(
        getTargets({
          esmodules: true,
          browsers: "ie 10",
          ie: 11,
        }),
      ).toMatchSnapshot();
    });

    it("can be intersected with the browsers option", () => {
      expect(
        getTargets({
          esmodules: "intersect",
          browsers: ["chrome >= 70", "firefox >= 30"],
        }),
      ).toMatchSnapshot();
    });

    it("can be intersected with ios browsers option", () => {
      expect(
        getTargets({
          esmodules: "intersect",
          browsers: ["ios >= 12"],
        }),
      ).toMatchSnapshot();
    });

    it("can be intersected with a .browserslistrc file", () => {
      expect(
        getTargets(
          {
            esmodules: "intersect",
          },
          {
            configPath: require.resolve("./fixtures/.browserslistrc"),
          },
        ),
      ).toMatchSnapshot();
    });

    it("explicit browser versions have the precedence over 'esmodules'", () => {
      expect(
        getTargets({
          browsers: "chrome 5, firefox 5",
          esmodules: "intersect",
          chrome: 20,
          firefox: 70,
        }),
      ).toMatchSnapshot();
    });

    itBabel7(
      "'intersect' behaves like 'true' if no browsers are specified - Babel 7",
      () => {
        expect(getTargets({ esmodules: "intersect" })).toEqual(
          getTargets({ esmodules: true }, { ignoreBrowserslistConfig: true }),
        );
      },
    );

    itBabel7(
      "'browsers' option will have no effect if it is an empty array - Babel 7",
      () => {
        expect(getTargets({ esmodules: "intersect", browsers: [] })).toEqual(
          getTargets({ esmodules: "intersect" }),
        );
      },
    );

    it("The final 'browsers' handled variable will have no effect if it is an empty array", () => {
      expect(getTargets({ esmodules: "intersect", browsers: [] })).toEqual(
        getTargets(
          { esmodules: "intersect" },
          { ignoreBrowserslistConfig: true },
        ),
      );
    });

    it("'resolveTargets' will be called rightly if 'browsers' is an array with some value", () => {
      // 'test' is an unknown browser query, so methods of 'browserslist' library will throw an error
      expect(() =>
        getTargets({ esmodules: "intersect", browsers: ["test"] }),
      ).toThrow();
    });

    itBabel8(
      "'intersect' behaves like no-op if no browsers are specified",
      () => {
        expect(getTargets({ esmodules: "intersect" })).toEqual(getTargets({}));
      },
    );

    it("'intersect' behaves like 'true' if no browsers are specified and the browserslist config is ignored", () => {
      expect(
        getTargets(
          { esmodules: "intersect" },
          { ignoreBrowserslistConfig: true },
        ),
      ).toEqual(
        getTargets({ esmodules: true }, { ignoreBrowserslistConfig: true }),
      );
    });
  });

  describe("node", () => {
    it("should return the current node version with option 'current'", () => {
      expect(
        getTargets({
          node: true,
        }),
      ).toEqual({
        node: nodeVersion,
      });
    });
  });

  describe("electron", () => {
    it("should be its own target", () => {
      expect(
        getTargets({
          chrome: "46",
          electron: "0.34",
        }),
      ).toEqual({
        chrome: "46.0.0",
        electron: "0.34.0",
      });
    });
  });

  describe("exception", () => {
    it("throws when version is not a semver", () => {
      expect(() =>
        getTargets({ chrome: "seventy-two" }),
      ).toThrowErrorMatchingSnapshot();
    });
  });
});
