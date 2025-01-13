import type Binding from "../binding.ts";
import * as t from "@babel/types";
import type { NodePath, Visitor } from "../../index.ts";
import { traverseNode } from "../../traverse-node.ts";
import { explode } from "../../visitors.ts";
import { getAssignmentIdentifiers, type Identifier } from "@babel/types";
import { requeueComputedKeyAndDecorators } from "../../path/context.ts";

type RenameState = {
  oldNames: string[];
  newNames: string[];
  bindings: Binding[];
};

export const newRenameVisitor: Visitor<RenameState> = {
  ReferencedIdentifier({ node, scope }, state) {
    const i = state.oldNames.indexOf(node.name);
    if (
      i !== -1 &&
      scope.getBindingIdentifier(node.name) === state.bindings[i].identifier
    ) {
      node.name = state.newNames[i];
    }
  },

  ObjectProperty({ node, scope }, state) {
    const { name } = node.key as Identifier;
    if (node.shorthand) {
      const i = state.oldNames.indexOf(name);
      const i2 = state.newNames.indexOf(name);
      // In destructuring the identifier is already renamed by the
      // AssignmentExpression|Declaration|VariableDeclarator visitor,
      // while in object literals it's renamed later by the
      // ReferencedIdentifier visitor.
      if (
        (i !== -1 &&
          // Ignore shadowed bindings
          scope.getBindingIdentifier(name) === state.bindings[i].identifier) ||
        (i2 !== -1 &&
          scope.getBindingIdentifier(name) === state.bindings[i2].identifier)
      ) {
        node.shorthand = false;
        if (!process.env.BABEL_8_BREAKING) {
          if (node.extra?.shorthand) node.extra.shorthand = false;
        }
      }
    }
  },

  "AssignmentExpression|Declaration|VariableDeclarator"(
    path: NodePath<
      t.AssignmentExpression | t.Declaration | t.VariableDeclarator
    >,
    state,
  ) {
    if (path.isVariableDeclaration()) return;
    const ids = path.isAssignmentExpression()
      ? path.getAssignmentIdentifiers()
      : path.getOuterBindingIdentifiers();

    for (const name of Object.keys(ids)) {
      const i = state.oldNames.indexOf(name);
      if (
        i !== -1 &&
        path.scope.getBindingIdentifier(name) === state.bindings[i].identifier
      ) {
        ids[name].name = state.newNames[i];
      }
    }
  },
};

const renameVisitor: Visitor<Renamer> = {
  ReferencedIdentifier({ node }, state) {
    if (node.name === state.oldName) {
      node.name = state.newName;
    }
  },

  Scope(path, state) {
    if (
      !path.scope.bindingIdentifierEquals(
        state.oldName,
        state.binding.identifier,
      )
    ) {
      path.skip();
      if (path.isMethod()) {
        if (
          !process.env.BABEL_8_BREAKING &&
          !path.requeueComputedKeyAndDecorators
        ) {
          // See https://github.com/babel/babel/issues/16694
          requeueComputedKeyAndDecorators.call(path);
        } else {
          path.requeueComputedKeyAndDecorators();
        }
      }
    }
  },

  ObjectProperty({ node, scope }, state) {
    const { name } = node.key as Identifier;
    if (
      node.shorthand &&
      // In destructuring the identifier is already renamed by the
      // AssignmentExpression|Declaration|VariableDeclarator visitor,
      // while in object literals it's renamed later by the
      // ReferencedIdentifier visitor.
      (name === state.oldName || name === state.newName) &&
      // Ignore shadowed bindings
      scope.getBindingIdentifier(name) === state.binding.identifier
    ) {
      node.shorthand = false;
      if (!process.env.BABEL_8_BREAKING) {
        if (node.extra?.shorthand) node.extra.shorthand = false;
      }
    }
  },

  "AssignmentExpression|Declaration|VariableDeclarator"(
    path: NodePath<
      t.AssignmentExpression | t.Declaration | t.VariableDeclarator
    >,
    state,
  ) {
    if (path.isVariableDeclaration()) return;
    const ids = path.isAssignmentExpression()
      ? // See https://github.com/babel/babel/issues/16694
        getAssignmentIdentifiers(path.node)
      : path.getOuterBindingIdentifiers();

    for (const name in ids) {
      if (name === state.oldName) ids[name].name = state.newName;
    }
  },
};

export default class Renamer {
  constructor(binding: Binding, oldName: string, newName: string) {
    this.newName = newName;
    this.oldName = oldName;
    this.binding = binding;
  }

  declare oldName: string;
  declare newName: string;
  declare binding: Binding;

  maybeConvertFromExportDeclaration(parentDeclar: NodePath) {
    const maybeExportDeclar = parentDeclar.parentPath;

    if (!maybeExportDeclar.isExportDeclaration()) {
      return;
    }

    if (maybeExportDeclar.isExportDefaultDeclaration()) {
      const { declaration } = maybeExportDeclar.node;
      if (t.isDeclaration(declaration) && !declaration.id) {
        return;
      }
    }

    if (maybeExportDeclar.isExportAllDeclaration()) {
      return;
    }

    maybeExportDeclar.splitExportDeclaration();
  }

  maybeConvertFromClassFunctionDeclaration(path: NodePath) {
    return path; // TODO

    // // retain the `name` of a class/function declaration

    // if (!path.isFunctionDeclaration() && !path.isClassDeclaration()) return;
    // if (this.binding.kind !== "hoisted") return;

    // path.node.id = identifier(this.oldName);
    // path.node._blockHoist = 3;

    // path.replaceWith(
    //   variableDeclaration("let", [
    //     variableDeclarator(identifier(this.newName), toExpression(path.node)),
    //   ]),
    // );
  }

  maybeConvertFromClassFunctionExpression(path: NodePath) {
    return path; // TODO

    // // retain the `name` of a class/function expression

    // if (!path.isFunctionExpression() && !path.isClassExpression()) return;
    // if (this.binding.kind !== "local") return;

    // path.node.id = identifier(this.oldName);

    // this.binding.scope.parent.push({
    //   id: identifier(this.newName),
    // });

    // path.replaceWith(
    //   assignmentExpression("=", identifier(this.newName), path.node),
    // );
  }

  rename(/* Babel 7 - block?: t.Pattern | t.Scopable */) {
    const { binding, oldName, newName } = this;
    const { scope, path } = binding;

    const parentDeclar = path.find(
      path =>
        path.isDeclaration() ||
        path.isFunctionExpression() ||
        path.isClassExpression(),
    );
    if (parentDeclar) {
      const bindingIds = parentDeclar.getOuterBindingIdentifiers();
      if (bindingIds[oldName] === binding.identifier) {
        // When we are renaming an exported identifier, we need to ensure that
        // the exported binding keeps the old name.
        this.maybeConvertFromExportDeclaration(parentDeclar);
      }
    }

    const blockToTraverse = process.env.BABEL_8_BREAKING
      ? scope.block
      : (arguments[0] as t.Pattern | t.Scopable) || scope.block;

    // When blockToTraverse is a SwitchStatement, the discriminant
    // is not part of the current scope and thus should be skipped.

    // const foo = {
    //   get [x]() {
    //     return x;
    //   },
    // };
    const skipKeys: Record<string, true> = { discriminant: true };
    if (t.isMethod(blockToTraverse)) {
      if (blockToTraverse.computed) {
        skipKeys.key = true;
      }
      if (!t.isObjectMethod(blockToTraverse)) {
        skipKeys.decorators = true;
      }
    }

    traverseNode(
      blockToTraverse,
      explode(renameVisitor),
      scope,
      this,
      scope.path,
      skipKeys,
    );

    if (process.env.BABEL_8_BREAKING) {
      scope.removeOwnBinding(oldName);
      scope.bindings[newName] = binding;
      this.binding.identifier.name = newName;
    } else if (!arguments[0]) {
      scope.removeOwnBinding(oldName);
      scope.bindings[newName] = binding;
      this.binding.identifier.name = newName;
    }

    if (parentDeclar) {
      this.maybeConvertFromClassFunctionDeclaration(path);
      this.maybeConvertFromClassFunctionExpression(path);
    }
  }
}
