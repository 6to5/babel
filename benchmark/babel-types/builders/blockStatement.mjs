import { Benchmark, baselineTypes, currentTypes } from "../../util.mjs";

const bench = new Benchmark();

function benchCases(implementations, num) {
  for (const version in implementations) {
    const t = implementations[version];
    const blockStatement = t.blockStatement;

    const stmts = new Array(num).fill(t.emptyStatement());
    bench.add(`${version} builder ${num}`, () => {
      blockStatement(stmts);
    });
  }
}

benchCases({ baselineTypes, currentTypes }, 1);
benchCases({ baselineTypes, currentTypes }, 128);

bench.run();
