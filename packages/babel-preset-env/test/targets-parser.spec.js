import getTargets from "../lib/targets-parser";

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
      ).toEqual({
        chrome: "61.0.0",
        safari: "10.1.0",
        firefox: "60.0.0",
        ios: "10.3.0",
        edge: "16.0.0",
      });
    });

    it("returns browsers supporting modules, ignoring browsers key", () => {
      expect(
        getTargets({
          esmodules: true,
          browsers: "ie 8",
        }),
      ).toEqual({
        chrome: "61.0.0",
        safari: "10.1.0",
        firefox: "60.0.0",
        ios: "10.3.0",
        edge: "16.0.0",
      });
    });

    it("returns browser supporting modules and keyed browser overrides", () => {
      expect(
        getTargets({
          esmodules: true,
          ie: 11,
        }),
      ).toEqual({
        chrome: "61.0.0",
        safari: "10.1.0",
        firefox: "60.0.0",
        ios: "10.3.0",
        ie: "11.0.0",
        edge: "16.0.0",
      });
    });

    it("returns browser supporting modules and keyed browser overrides, ignoring browsers field", () => {
      expect(
        getTargets({
          esmodules: true,
          browsers: "ie 10",
          ie: 11,
        }),
      ).toEqual({
        chrome: "61.0.0",
        safari: "10.1.0",
        ios: "10.3.0",
        ie: "11.0.0",
        edge: "16.0.0",
        firefox: "60.0.0",
      });
    });
  });

  describe("node", () => {
    it("should return the current node version with option 'current'", () => {
      expect(
        getTargets({
          node: true,
        }),
      ).toEqual({
        node: process.versions.node,
      });
    });
  });

  describe("ecmascript", () => {
    it("should be a target", () => {
      assert.deepEqual(
        getTargets({
          ecmascript: 2015,
        }),
        {
          ecmascript: "2015",
        },
      );
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
});
