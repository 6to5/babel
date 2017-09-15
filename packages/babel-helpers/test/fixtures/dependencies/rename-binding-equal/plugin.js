const defineHelper = require("../../../helpers/define-helper").default;

const dependency = defineHelper("dependency", `
  let foo = "dependency";
  export default function fn() { return foo }
`);

const main = defineHelper("main", `
  import dep from "${dependency}";

  let foo = "main";

  export default function helper() {
    return dep() + foo;
  }
`);

module.exports = {
  visitor: {
    Identifier(path) {
      if (path.node.name !== "REPLACE_ME") return;
      const helper = this.addHelper(main);
      path.replaceWith(helper);
    },
  },
};
