import type { Client } from "./client.cts";

const {
  Definition,
  PatternVisitor: OriginalPatternVisitor,
  Referencer: OriginalReferencer,
  Scope,
  ScopeManager,
} = (
  process.env.BABEL_8_BREAKING
    ? require("eslint-scope")
    : require("@nicolo-ribaudo/eslint-scope-5-internals")
) as import("./types.cts").Scope;
const { getKeys: fallback } = require("eslint-visitor-keys");

let visitorKeysMap: Record<string, string[]>;
function getVisitorValues(nodeType: string, client: Client) {
  if (visitorKeysMap) return visitorKeysMap[nodeType];

  const { FLOW_FLIPPED_ALIAS_KEYS, VISITOR_KEYS } = client.getTypesInfo();

  const flowFlippedAliasKeys = new Set(
    FLOW_FLIPPED_ALIAS_KEYS.concat([
      "ArrayPattern",
      "ClassDeclaration",
      "ClassExpression",
      "FunctionDeclaration",
      "FunctionExpression",
      "Identifier",
      "ObjectPattern",
      "RestElement",
    ]),
  );

  visitorKeysMap = Object.entries(VISITOR_KEYS).reduce((acc, [key, value]) => {
    if (!flowFlippedAliasKeys.has(value)) {
      // @ts-expect-error FIXME: value is not assignable to type string[]
      acc[key] = value;
    }
    return acc;
  }, {});

  return visitorKeysMap[nodeType];
}

const propertyTypes = {
  // loops
  callProperties: { type: "loop", values: ["value"] },
  indexers: { type: "loop", values: ["key", "value"] },
  properties: { type: "loop", values: ["argument", "value"] },
  types: { type: "loop" },
  params: { type: "loop" },
  // single property
  argument: { type: "single" },
  elementType: { type: "single" },
  qualification: { type: "single" },
  rest: { type: "single" },
  returnType: { type: "single" },
  // others
  typeAnnotation: { type: "typeAnnotation" },
  typeParameters: { type: "typeParameters" },
  id: { type: "id" },
};

class PatternVisitor extends OriginalPatternVisitor {
  ArrayPattern(node: any) {
    node.elements.forEach(this.visit, this);
  }

  ObjectPattern(node: any) {
    node.properties.forEach(this.visit, this);
  }
}

class Referencer extends OriginalReferencer {
  #client;

  constructor(options: any, scopeManager: any, client: Client) {
    super(options, scopeManager);
    this.#client = client;
  }

  // inherits.
  visitPattern(node: any, options: any, callback: any) {
    if (!node) {
      return;
    }

    // Visit type annotations.
    this._checkIdentifierOrVisit(node.typeAnnotation);
    if (node.type === "AssignmentPattern") {
      this._checkIdentifierOrVisit(node.left.typeAnnotation);
    }

    // Overwrite `super.visitPattern(node, options, callback)` in order to not visit `ArrayPattern#typeAnnotation` and `ObjectPattern#typeAnnotation`.
    if (typeof options === "function") {
      callback = options;
      options = { processRightHandNodes: false };
    }

    const visitor = new PatternVisitor(this.options, node, callback);
    visitor.visit(node);

    // Process the right hand nodes recursively.
    if (options.processRightHandNodes) {
      visitor.rightHandNodes.forEach(this.visit, this);
    }
  }

  // inherits.
  visitClass(node: any) {
    // Decorators.
    this._visitArray(node.decorators);

    // Flow type parameters.
    const typeParamScope = this._nestTypeParamScope(node);

    // Flow super types.
    this._visitTypeAnnotation(node.implements);
    this._visitTypeAnnotation(
      (process.env.BABEL_8_BREAKING
        ? // @ts-ignore(Babel 7 vs Babel 8) Renamed
          node.superTypeArguments
        : // @ts-ignore(Babel 7 vs Babel 8) Renamed
          node.superTypeParameters
      )?.params,
    );

    // Basic.
    super.visitClass(node);

    // Close the type parameter scope.
    if (typeParamScope) {
      this.close(node);
    }
  }

  // inherits.
  visitFunction(node: any) {
    const typeParamScope = this._nestTypeParamScope(node);

    // Flow return types.
    this._checkIdentifierOrVisit(node.returnType);

    // Basic.
    super.visitFunction(node);

    // Close the type parameter scope.
    if (typeParamScope) {
      this.close(node);
    }
  }

  // inherits.
  visitProperty(node: any) {
    if (node.value?.type === "TypeCastExpression") {
      this._visitTypeAnnotation(node.value);
    }
    this._visitArray(node.decorators);
    super.visitProperty(node);
  }

  InterfaceDeclaration(node: any) {
    this._createScopeVariable(node, node.id);

    const typeParamScope = this._nestTypeParamScope(node);

    // TODO: Handle mixins
    this._visitArray(node.extends);
    this.visit(node.body);

    if (typeParamScope) {
      this.close(node);
    }
  }

  TypeAlias(node: any) {
    this._createScopeVariable(node, node.id);

    const typeParamScope = this._nestTypeParamScope(node);

    this.visit(node.right);

    if (typeParamScope) {
      this.close(node);
    }
  }

  ClassProperty(node: any) {
    this._visitClassProperty(node);
  }

  ClassPrivateProperty(node: any) {
    this._visitClassProperty(node);
  }

  ClassAccessorProperty(node: any) {
    this._visitClassProperty(node);
  }

  PropertyDefinition(node: any) {
    this._visitClassProperty(node);
  }

  // TODO: Update to visit type annotations when TypeScript/Flow support this syntax.
  ClassPrivateMethod(node: any) {
    super.MethodDefinition(node);
  }

  DeclareModule(node: any) {
    this._visitDeclareX(node);
  }

  DeclareFunction(node: any) {
    this._visitDeclareX(node);
  }

  DeclareVariable(node: any) {
    this._visitDeclareX(node);
  }

  DeclareClass(node: any) {
    this._visitDeclareX(node);
  }

  // visit OptionalMemberExpression as a MemberExpression.
  OptionalMemberExpression(node: any) {
    super.MemberExpression(node);
  }

  _visitClassProperty(node: any) {
    const { computed, key, typeAnnotation, decorators, value } = node;

    this._visitArray(decorators);
    if (computed) this.visit(key);
    this._visitTypeAnnotation(typeAnnotation);

    if (value) {
      if (this.scopeManager.__nestClassFieldInitializerScope) {
        this.scopeManager.__nestClassFieldInitializerScope(value);
      } else {
        // Given that ESLint 7 didn't have a "class field initializer" scope,
        // we create a plain method scope. Semantics are the same.
        this.scopeManager.__nestScope(
          new Scope(
            this.scopeManager,
            "function",
            this.scopeManager.__currentScope,
            value,
            true,
          ),
        );
      }
      this.visit(value);
      this.close(value);
    }
  }

  _visitDeclareX(node: any) {
    if (node.id) {
      this._createScopeVariable(node, node.id);
    }

    const typeParamScope = this._nestTypeParamScope(node);
    if (typeParamScope) {
      this.close(node);
    }
  }

  _createScopeVariable(node: any, name: any) {
    this.currentScope().variableScope.__define(
      name,
      new Definition("Variable", name, node, null, null, null),
    );
  }

  _nestTypeParamScope(node: any) {
    if (!node.typeParameters) {
      return null;
    }

    const parentScope = this.scopeManager.__currentScope;
    const scope = new Scope(
      this.scopeManager,
      "type-parameters",
      parentScope,
      node,
      false,
    );

    this.scopeManager.__nestScope(scope);
    for (let j = 0; j < node.typeParameters.params.length; j++) {
      const name = node.typeParameters.params[j];
      scope.__define(name, new Definition("TypeParameter", name, name));
      if (name.typeAnnotation) {
        this._checkIdentifierOrVisit(name);
      }
    }
    scope.__define = parentScope.__define.bind(parentScope);

    return scope;
  }

  _visitTypeAnnotation(node: any) {
    if (!node) {
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(this._visitTypeAnnotation, this);
      return;
    }

    // get property to check (params, id, etc...)
    const visitorValues = getVisitorValues(node.type, this.#client);
    if (!visitorValues) {
      return;
    }

    // can have multiple properties
    for (let i = 0; i < visitorValues.length; i++) {
      const visitorValue = visitorValues[i];
      const propertyType = (propertyTypes as Record<string, any>)[visitorValue];
      const nodeProperty = node[visitorValue];
      // check if property or type is defined
      if (propertyType == null || nodeProperty == null) {
        continue;
      }
      if (propertyType.type === "loop") {
        for (let j = 0; j < nodeProperty.length; j++) {
          if (Array.isArray(propertyType.values)) {
            for (let k = 0; k < propertyType.values.length; k++) {
              const loopPropertyNode = nodeProperty[j][propertyType.values[k]];
              if (loopPropertyNode) {
                this._checkIdentifierOrVisit(loopPropertyNode);
              }
            }
          } else {
            this._checkIdentifierOrVisit(nodeProperty[j]);
          }
        }
      } else if (propertyType.type === "single") {
        this._checkIdentifierOrVisit(nodeProperty);
      } else if (propertyType.type === "typeAnnotation") {
        this._visitTypeAnnotation(node.typeAnnotation);
      } else if (propertyType.type === "typeParameters") {
        for (let l = 0; l < node.typeParameters.params.length; l++) {
          this._checkIdentifierOrVisit(node.typeParameters.params[l]);
        }
      } else if (propertyType.type === "id") {
        if (node.id.type === "Identifier") {
          this._checkIdentifierOrVisit(node.id);
        } else {
          this._visitTypeAnnotation(node.id);
        }
      }
    }
  }

  _checkIdentifierOrVisit(node: any) {
    if (node?.typeAnnotation) {
      this._visitTypeAnnotation(node.typeAnnotation);
    } else if (node?.type === "Identifier") {
      this.visit(node);
    } else {
      this._visitTypeAnnotation(node);
    }
  }

  _visitArray(nodeList: any[]) {
    if (nodeList) {
      for (const node of nodeList) {
        this.visit(node);
      }
    }
  }
}

export = function analyzeScope(ast: any, parserOptions: any, client: Client) {
  const options = {
    ignoreEval: true,
    optimistic: false,
    directive: false,
    nodejsScope:
      ast.sourceType === "script" &&
      parserOptions.ecmaFeatures?.globalReturn === true,
    impliedStrict: false,
    sourceType: ast.sourceType,
    ecmaVersion: parserOptions.ecmaVersion,
    fallback,
    childVisitorKeys: client.getVisitorKeys(),
  };

  const scopeManager = new ScopeManager(options);
  const referencer = new Referencer(options, scopeManager, client);

  referencer.visit(ast);

  return scopeManager as any;
};
