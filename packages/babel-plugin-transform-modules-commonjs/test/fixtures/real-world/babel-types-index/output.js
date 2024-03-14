"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.valueToNode = exports.validate = exports.traverseFast = exports.traverse = exports.toStatement = exports.toKeyAlias = exports.toIdentifier = exports.toExpression = exports.toComputedKey = exports.toBlock = exports.toBindingIdentifierName = exports.shallowEqual = exports.removeTypeDuplicates = exports.removePropertiesDeep = exports.removeProperties = exports.removeComments = exports.react = exports.prependToMemberExpression = exports.matchesPattern = exports.isVar = exports.isValidIdentifier = exports.isValidES3Identifier = exports.isType = exports.isSpecifierDefault = exports.isScope = exports.isReferenced = exports.isPlaceholderType = exports.isNodesEquivalent = exports.isNode = exports.isLet = exports.isImmutable = exports.isBlockScoped = exports.isBinding = exports.is = exports.inheritsComments = exports.inherits = exports.inheritTrailingComments = exports.inheritLeadingComments = exports.inheritInnerComments = exports.getOuterBindingIdentifiers = exports.getBindingIdentifiers = exports.ensureBlock = exports.createUnionTypeAnnotation = exports.createTypeAnnotationBasedOnTypeof = exports.createTSUnionType = exports.createFlowUnionType = exports.cloneWithoutLoc = exports.cloneNode = exports.cloneDeepWithoutLoc = exports.cloneDeep = exports.clone = exports.buildMatchMemberExpression = exports.assertNode = exports.appendToMemberExpression = exports.addComments = exports.addComment = exports.__internal__deprecationWarning = void 0;
var _isReactComponent = _interopRequireDefault(require("./validators/react/isReactComponent.js"));
var _isCompatTag = _interopRequireDefault(require("./validators/react/isCompatTag.js"));
var _buildChildren = _interopRequireDefault(require("./builders/react/buildChildren.js"));
var _assertNode = _interopRequireDefault(require("./asserts/assertNode.js"));
__exportStar(require("./asserts/generated/index.js"));
var _createTypeAnnotationBasedOnTypeof = _interopRequireDefault(require("./builders/flow/createTypeAnnotationBasedOnTypeof.js"));
var _createFlowUnionType = _interopRequireDefault(require("./builders/flow/createFlowUnionType.js"));
var _createTSUnionType = _interopRequireDefault(require("./builders/typescript/createTSUnionType.js"));
__exportStar(require("./builders/generated/index.js"));
__exportStar(require("./builders/generated/uppercase.js"));
__exportStar(require("./builders/productions.js"));
var _cloneNode = _interopRequireDefault(require("./clone/cloneNode.js"));
var _clone = _interopRequireDefault(require("./clone/clone.js"));
var _cloneDeep = _interopRequireDefault(require("./clone/cloneDeep.js"));
var _cloneDeepWithoutLoc = _interopRequireDefault(require("./clone/cloneDeepWithoutLoc.js"));
var _cloneWithoutLoc = _interopRequireDefault(require("./clone/cloneWithoutLoc.js"));
var _addComment = _interopRequireDefault(require("./comments/addComment.js"));
var _addComments = _interopRequireDefault(require("./comments/addComments.js"));
var _inheritInnerComments = _interopRequireDefault(require("./comments/inheritInnerComments.js"));
var _inheritLeadingComments = _interopRequireDefault(require("./comments/inheritLeadingComments.js"));
var _inheritsComments = _interopRequireDefault(require("./comments/inheritsComments.js"));
var _inheritTrailingComments = _interopRequireDefault(require("./comments/inheritTrailingComments.js"));
var _removeComments = _interopRequireDefault(require("./comments/removeComments.js"));
__exportStar(require("./constants/generated/index.js"));
__exportStar(require("./constants/index.js"));
var _ensureBlock = _interopRequireDefault(require("./converters/ensureBlock.js"));
var _toBindingIdentifierName = _interopRequireDefault(require("./converters/toBindingIdentifierName.js"));
var _toBlock = _interopRequireDefault(require("./converters/toBlock.js"));
var _toComputedKey = _interopRequireDefault(require("./converters/toComputedKey.js"));
var _toExpression = _interopRequireDefault(require("./converters/toExpression.js"));
var _toIdentifier = _interopRequireDefault(require("./converters/toIdentifier.js"));
var _toKeyAlias = _interopRequireDefault(require("./converters/toKeyAlias.js"));
var _toStatement = _interopRequireDefault(require("./converters/toStatement.js"));
var _valueToNode = _interopRequireDefault(require("./converters/valueToNode.js"));
__exportStar(require("./definitions/index.js"));
var _appendToMemberExpression = _interopRequireDefault(require("./modifications/appendToMemberExpression.js"));
var _inherits = _interopRequireDefault(require("./modifications/inherits.js"));
var _prependToMemberExpression = _interopRequireDefault(require("./modifications/prependToMemberExpression.js"));
var _removeProperties = _interopRequireDefault(require("./modifications/removeProperties.js"));
var _removePropertiesDeep = _interopRequireDefault(require("./modifications/removePropertiesDeep.js"));
var _removeTypeDuplicates = _interopRequireDefault(require("./modifications/flow/removeTypeDuplicates.js"));
var _getBindingIdentifiers = _interopRequireDefault(require("./retrievers/getBindingIdentifiers.js"));
var _getOuterBindingIdentifiers = _interopRequireDefault(require("./retrievers/getOuterBindingIdentifiers.js"));
_interop = 1;
var _traverse = __exportStar(require("./traverse/traverse.js"));
var _traverseFast = _interopRequireDefault(require("./traverse/traverseFast.js"));
var _shallowEqual = _interopRequireDefault(require("./utils/shallowEqual.js"));
var _is = _interopRequireDefault(require("./validators/is.js"));
var _isBinding = _interopRequireDefault(require("./validators/isBinding.js"));
var _isBlockScoped = _interopRequireDefault(require("./validators/isBlockScoped.js"));
var _isImmutable = _interopRequireDefault(require("./validators/isImmutable.js"));
var _isLet = _interopRequireDefault(require("./validators/isLet.js"));
var _isNode = _interopRequireDefault(require("./validators/isNode.js"));
var _isNodesEquivalent = _interopRequireDefault(require("./validators/isNodesEquivalent.js"));
var _isPlaceholderType = _interopRequireDefault(require("./validators/isPlaceholderType.js"));
var _isReferenced = _interopRequireDefault(require("./validators/isReferenced.js"));
var _isScope = _interopRequireDefault(require("./validators/isScope.js"));
var _isSpecifierDefault = _interopRequireDefault(require("./validators/isSpecifierDefault.js"));
var _isType = _interopRequireDefault(require("./validators/isType.js"));
var _isValidES3Identifier = _interopRequireDefault(require("./validators/isValidES3Identifier.js"));
var _isValidIdentifier = _interopRequireDefault(require("./validators/isValidIdentifier.js"));
var _isVar = _interopRequireDefault(require("./validators/isVar.js"));
var _matchesPattern = _interopRequireDefault(require("./validators/matchesPattern.js"));
var _validate = _interopRequireDefault(require("./validators/validate.js"));
var _buildMatchMemberExpression = _interopRequireDefault(require("./validators/buildMatchMemberExpression.js"));
_interop = 0;
__exportStar(require("./validators/generated/index.js"));
var _deprecationWarning = _interopRequireDefault(require("./utils/deprecationWarning.js"));
_export("__internal__deprecationWarning", _deprecationWarning, "default");
_export("addComment", _addComment, "default");
_export("addComments", _addComments, "default");
_export("appendToMemberExpression", _appendToMemberExpression, "default");
_export("assertNode", _assertNode, "default");
_export("buildMatchMemberExpression", _buildMatchMemberExpression, "default");
_export("clone", _clone, "default");
_export("cloneDeep", _cloneDeep, "default");
_export("cloneDeepWithoutLoc", _cloneDeepWithoutLoc, "default");
_export("cloneNode", _cloneNode, "default");
_export("cloneWithoutLoc", _cloneWithoutLoc, "default");
_export("createFlowUnionType", _createFlowUnionType, "default");
_export("createTSUnionType", _createTSUnionType, "default");
_export("createTypeAnnotationBasedOnTypeof", _createTypeAnnotationBasedOnTypeof, "default");
_export("createUnionTypeAnnotation", _createFlowUnionType, "default");
_export("ensureBlock", _ensureBlock, "default");
_export("getBindingIdentifiers", _getBindingIdentifiers, "default");
_export("getOuterBindingIdentifiers", _getOuterBindingIdentifiers, "default");
_export("inheritInnerComments", _inheritInnerComments, "default");
_export("inheritLeadingComments", _inheritLeadingComments, "default");
_export("inheritTrailingComments", _inheritTrailingComments, "default");
_export("inherits", _inherits, "default");
_export("inheritsComments", _inheritsComments, "default");
_export("is", _is, "default");
_export("isBinding", _isBinding, "default");
_export("isBlockScoped", _isBlockScoped, "default");
_export("isImmutable", _isImmutable, "default");
_export("isLet", _isLet, "default");
_export("isNode", _isNode, "default");
_export("isNodesEquivalent", _isNodesEquivalent, "default");
_export("isPlaceholderType", _isPlaceholderType, "default");
_export("isReferenced", _isReferenced, "default");
_export("isScope", _isScope, "default");
_export("isSpecifierDefault", _isSpecifierDefault, "default");
_export("isType", _isType, "default");
_export("isValidES3Identifier", _isValidES3Identifier, "default");
_export("isValidIdentifier", _isValidIdentifier, "default");
_export("isVar", _isVar, "default");
_export("matchesPattern", _matchesPattern, "default");
_export("prependToMemberExpression", _prependToMemberExpression, "default");
_export("removeComments", _removeComments, "default");
_export("removeProperties", _removeProperties, "default");
_export("removePropertiesDeep", _removePropertiesDeep, "default");
_export("removeTypeDuplicates", _removeTypeDuplicates, "default");
_export("shallowEqual", _shallowEqual, "default");
_export("toBindingIdentifierName", _toBindingIdentifierName, "default");
_export("toBlock", _toBlock, "default");
_export("toComputedKey", _toComputedKey, "default");
_export("toExpression", _toExpression, "default");
_export("toIdentifier", _toIdentifier, "default");
_export("toKeyAlias", _toKeyAlias, "default");
_export("toStatement", _toStatement, "default");
_export("traverse", _traverse, "default");
_export("traverseFast", _traverseFast, "default");
_export("validate", _validate, "default");
_export("valueToNode", _valueToNode, "default");
var _interop;
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var a, i = t ? n : r, o = { __proto__: null, default: e }; if (null == e || Object(e) !== e) return o; if (i) { if (i.has(e)) return i.get(e); i.set(e, o); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((a = Object.create && Object.getOwnPropertyDescriptor(e, t)) && (a.get || a.set) ? Object.defineProperty(o, t, a) : o[t] = e[t]); return o; })(e, t); }
function __exportStar(mod) {
  mod = _interop == 1 ? _interopRequireWildcard(mod) : mod;
  Object.keys(mod).forEach(function (k) {
    if (["default", "__esModule", "react", "assertNode", "createTypeAnnotationBasedOnTypeof", "createUnionTypeAnnotation", "createFlowUnionType", "createTSUnionType", "cloneNode", "clone", "cloneDeep", "cloneDeepWithoutLoc", "cloneWithoutLoc", "addComment", "addComments", "inheritInnerComments", "inheritLeadingComments", "inheritsComments", "inheritTrailingComments", "removeComments", "ensureBlock", "toBindingIdentifierName", "toBlock", "toComputedKey", "toExpression", "toIdentifier", "toKeyAlias", "toStatement", "valueToNode", "appendToMemberExpression", "inherits", "prependToMemberExpression", "removeProperties", "removePropertiesDeep", "removeTypeDuplicates", "getBindingIdentifiers", "getOuterBindingIdentifiers", "traverse", "traverseFast", "shallowEqual", "is", "isBinding", "isBlockScoped", "isImmutable", "isLet", "isNode", "isNodesEquivalent", "isPlaceholderType", "isReferenced", "isScope", "isSpecifierDefault", "isType", "isValidES3Identifier", "isValidIdentifier", "isVar", "matchesPattern", "validate", "buildMatchMemberExpression", "__internal__deprecationWarning"].indexOf(k) < 0 && !(k in exports && exports[k] === mod[k])) {
      Object.defineProperty(exports, k, {
        get: function () {
          return mod[k];
        },
        enumerable: true
      });
    }
  });
  return mod;
}
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _export(name, mod, name2) {
  Object.defineProperty(exports, name, {
    enumerable: true,
    get: function () {
      return mod[name2 == null ? name : name2];
    }
  });
}
const react = exports.react = {
  isReactComponent: _isReactComponent.default,
  isCompatTag: _isCompatTag.default,
  buildChildren: _buildChildren.default
};
;
