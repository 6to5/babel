// @flow

// The algorithm used to determine whether a regexp can appear at a
// given point in the program is loosely based on sweet.js' approach.
// See https://github.com/mozilla/sweet.js/wiki/design

import { types as tt } from "./types";

export class TokContext {
  constructor(token: string, preserveSpace?: boolean) {
    this.token = token;
    this.preserveSpace = !!preserveSpace;
  }

  token: string;
  preserveSpace: boolean;
}

export const types: {
  [key: string]: TokContext,
} = {
  brace: new TokContext("{"),
  templateQuasi: new TokContext("${"),
  template: new TokContext("`", true),
};

// Token-specific context update code
// Note that we should avoid accessing `this.prodParam` in context update,
// because it is executed immediately when last token is consumed, which may be
// before `this.prodParam` is updated. e.g.
// ```
// function *g() { () => yield / 2 }
// ```
// When `=>` is eaten, the context update of `yield` is executed, however,
// `this.prodParam` still has `[Yield]` production because it is not yet updated

tt.braceR.updateContext = function (context) {
  if (context.length > 1) {
    context.pop();
  }
};

// we don't need to update context for tt.braceBarL because we do not pop context for tt.braceBarR
tt.braceL.updateContext = tt.braceHashL.updateContext = function (context) {
  context.push(types.brace);
};

tt.dollarBraceL.updateContext = function (context) {
  context.push(types.templateQuasi);
};

tt.incDec.updateContext = function () {
  // tokExprAllowed stays unchanged
};

tt.backQuote.updateContext = function (context) {
  if (context[context.length - 1] === types.template) {
    context.pop();
  } else {
    context.push(types.template);
  }
};
