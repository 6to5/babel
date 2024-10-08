// |reftest| error:ReferenceError
// Copyright (C) 2020 Rick Waldron. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
/*---
esid: sec-switch-statement-runtime-semantics-evaluation
description: Creation of new lexical environment (into `default` clause)
info: |
    1. Let exprRef be the result of evaluating Expression.
    2. Let switchValue be ? GetValue(exprRef).
    3. Let oldEnv be the running execution context's LexicalEnvironment.
    4. Let blockEnv be NewDeclarativeEnvironment(oldEnv).
    5. Perform BlockDeclarationInstantiation(CaseBlock, blockEnv).
    6. Set the running execution context's LexicalEnvironment to blockEnv.
    7. Let R be the result of performing CaseBlockEvaluation of CaseBlock with
      argument switchValue.
    [...]
negative:
  phase: runtime
  type: ReferenceError
---*/

expect(() => {
  switch (0) {
    default:
      var _x = function () {
        return babelHelpers.newAsyncGenerator(function* () {}, this, arguments);
      };
  }
  x;
}).toThrow(ReferenceError);
