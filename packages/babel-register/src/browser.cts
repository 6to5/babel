// TODO: Remove this file in Babel 8

// required to safely use babel/register within a browserify codebase

function register() {}

module.exports = Object.assign(register, {
  default: register,
  register,
  revert: function revert() {},
  __esModule: true,
});
