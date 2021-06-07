// @flow

// The algorithm used to determine whether a regexp can appear at a
// given point in the program is loosely based on sweet.js' approach.
// See https://github.com/mozilla/sweet.js/wiki/design

import { types as tt } from "./types";

export class TokContext {
  constructor(token: string, isExpr?: boolean, preserveSpace?: boolean) {
    this.token = token;
    this.isExpr = !!isExpr;
    this.preserveSpace = !!preserveSpace;
  }

  token: string;
  isExpr: boolean;
  preserveSpace: boolean;
}

export const types: {
  [key: string]: TokContext,
} = {
  brace: new TokContext("{", false),
  recordExpression: new TokContext("#{", true),
  templateQuasi: new TokContext("${", false),
  template: new TokContext("`", true, true),
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

tt.braceR.updateContext = function () {
  if (this.state.context.length === 1) {
    this.state.exprAllowed = true;
    return;
  }

  const out = this.state.context.pop();
  this.state.exprAllowed = !out.isExpr;
};

tt.braceL.updateContext = function () {
  this.state.context.push(types.brace);
  this.state.exprAllowed = true;
};

tt.dollarBraceL.updateContext = function () {
  this.state.context.push(types.templateQuasi);
  this.state.exprAllowed = true;
};

tt.incDec.updateContext = function () {
  // tokExprAllowed stays unchanged
};

tt._function.updateContext = tt._class.updateContext = function () {
  this.state.exprAllowed = false;
};

tt.backQuote.updateContext = function () {
  if (this.curContext() === types.template) {
    this.state.context.pop();
  } else {
    this.state.context.push(types.template);
  }
  this.state.exprAllowed = false;
};

// we don't need to update context for tt.braceBarL because we do not pop context for tt.braceBarR
tt.braceHashL.updateContext = function () {
  this.state.context.push(types.recordExpression);
  this.state.exprAllowed = true; /* tt.braceHashL.beforeExpr */
};
