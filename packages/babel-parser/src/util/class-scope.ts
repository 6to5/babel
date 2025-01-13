import { ClassElementType } from "./scopeflags.ts";
import type { Position } from "./location.ts";
import { Errors } from "../parse-error.ts";
import type Tokenizer from "../tokenizer/index.ts";

export class ClassScope {
  // A list of private named declared in the current class
  privateNames: Set<string> = new Set();

  // A list of private getters of setters without their counterpart
  loneAccessors: Map<string, ClassElementType> = new Map();

  // A list of private names used before being defined, mapping to
  // their position.
  undefinedPrivateNames: Map<string, Position | number> = new Map();
}

export default class ClassScopeHandler {
  parser: Tokenizer;
  stack: Array<ClassScope> = [];

  constructor(parser: Tokenizer) {
    this.parser = parser;
  }

  current(): ClassScope {
    return this.stack[this.stack.length - 1];
  }

  enter() {
    this.stack.push(new ClassScope());
  }

  exit() {
    const oldClassScope = this.stack.pop();

    // Migrate the usage of not yet defined private names to the outer
    // class scope, or raise an error if we reached the top-level scope.

    const current = this.current();

    // Array.from is needed because this is compiled to an array-like for loop
    for (const [name, loc] of Array.from(oldClassScope.undefinedPrivateNames)) {
      if (current) {
        if (!current.undefinedPrivateNames.has(name)) {
          current.undefinedPrivateNames.set(name, loc);
        }
      } else {
        this.parser.raise(Errors.InvalidPrivateFieldResolution, loc, {
          identifierName: name,
        });
      }
    }
  }

  declarePrivateName(name: string, elementType: ClassElementType, loc: number) {
    const { privateNames, loneAccessors, undefinedPrivateNames } =
      this.current();
    let redefined = privateNames.has(name);

    if (elementType & ClassElementType.KIND_ACCESSOR) {
      const accessor = redefined && loneAccessors.get(name);
      if (accessor) {
        const oldStatic = accessor & ClassElementType.FLAG_STATIC;
        const newStatic = elementType & ClassElementType.FLAG_STATIC;

        const oldKind = accessor & ClassElementType.KIND_ACCESSOR;
        const newKind = elementType & ClassElementType.KIND_ACCESSOR;

        // The private name can be duplicated only if it is used by
        // two accessors with different kind (get and set), and if
        // they have the same placement (static or not).
        redefined = oldKind === newKind || oldStatic !== newStatic;

        if (!redefined) loneAccessors.delete(name);
      } else if (!redefined) {
        loneAccessors.set(name, elementType);
      }
    }

    if (redefined) {
      this.parser.raise(Errors.PrivateNameRedeclaration, loc, {
        identifierName: name,
      });
    }

    privateNames.add(name);
    undefinedPrivateNames.delete(name);
  }

  usePrivateName(name: string, loc: Position | number) {
    let classScope;
    for (classScope of this.stack) {
      if (classScope.privateNames.has(name)) return;
    }

    if (classScope) {
      classScope.undefinedPrivateNames.set(name, loc);
    } else {
      // top-level
      this.parser.raise(Errors.InvalidPrivateFieldResolution, loc, {
        identifierName: name,
      });
    }
  }
}
