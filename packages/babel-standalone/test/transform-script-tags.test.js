import fs from "fs";
import semver from "semver";

const nodeGte16 = semver.gte(process.version, "16.0.0");

(nodeGte16 ? describe : describe.skip)("transformScriptTags", () => {
  let standaloneSource;
  let JSDOM;
  beforeAll(async () => {
    standaloneSource = fs.readFileSync(
      new URL("../babel.js", import.meta.url),
      "utf8",
    );
    JSDOM = (await import("jsdom")).JSDOM;
  });
  it("should transform script element with type 'text/babel'", () => {
    const dom = new JSDOM(
      `<!DOCTYPE html><head><script>${standaloneSource}</script><script type="text/babel">globalThis ?? window</script></head>`,
      { runScripts: "dangerously" },
    );
    return new Promise((resolve, reject) => {
      dom.window.addEventListener("DOMContentLoaded", () => {
        try {
          const transformedScriptElement =
            dom.window.document.head.children.item(2);
          expect(transformedScriptElement.getAttribute("type")).toBeNull();
          expect(transformedScriptElement.innerHTML).toContain(
            "globalThis !== null && globalThis !== void 0 ? globalThis : window",
          );
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });
  });
  it("should pass through the nonce attribute to the transformed script element", () => {
    const nonceAttribute = "nonce_example";

    const dom = new JSDOM(
      `<!DOCTYPE html><head><script>${standaloneSource}</script><script type="text/babel" nonce="${nonceAttribute}">globalThis ?? window</script></head>`,
      { runScripts: "dangerously" },
    );
    return new Promise((resolve, reject) => {
      dom.window.addEventListener("DOMContentLoaded", () => {
        try {
          const transformedScriptElement =
            dom.window.document.head.children.item(2);
          expect(transformedScriptElement.nonce).toBe(nonceAttribute);
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });
  });
});
