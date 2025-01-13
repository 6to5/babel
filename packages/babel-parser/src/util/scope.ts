import { ScopeFlag, BindingFlag } from "./scopeflags.ts";
import type * as N from "../types.ts";
import { Errors } from "../parse-error.ts";
import type Tokenizer from "../tokenizer/index.ts";

export const enum NameType {
  // var-declared names in the current lexical scope
  Var = 1 << 0,
  // lexically-declared names in the current lexical scope
  Lexical = 1 << 1,
  // lexically-declared FunctionDeclaration names in the current lexical scope
  Function = 1 << 2,
}

// Start an AST node, attaching a start offset.
export class Scope {
  flags: ScopeFlag = 0;
  names: Map<string, NameType> = new Map();
  firstLexicalName = "";

  constructor(flags: ScopeFlag) {
    this.flags = flags;
  }
}

// The functions in this module keep track of declared variables in the
// current scope in order to detect duplicate variable names.
export default class ScopeHandler<IScope extends Scope = Scope> {
  parser: Tokenizer;
  scopeStack: Array<IScope> = [];
  inModule: boolean;
  undefinedExports: Map<string, number> = new Map();

  constructor(parser: Tokenizer, inModule: boolean) {
    this.parser = parser;
    this.inModule = inModule;
  }

  get inTopLevel() {
    return (this.currentScope().flags & ScopeFlag.PROGRAM) > 0;
  }
  get inFunction() {
    return (this.currentVarScopeFlags() & ScopeFlag.FUNCTION) > 0;
  }
  get allowSuper() {
    return (this.currentThisScopeFlags() & ScopeFlag.SUPER) > 0;
  }
  get allowDirectSuper() {
    return (this.currentThisScopeFlags() & ScopeFlag.DIRECT_SUPER) > 0;
  }
  get inClass() {
    return (this.currentThisScopeFlags() & ScopeFlag.CLASS) > 0;
  }
  get inClassAndNotInNonArrowFunction() {
    const flags = this.currentThisScopeFlags();
    return (flags & ScopeFlag.CLASS) > 0 && (flags & ScopeFlag.FUNCTION) === 0;
  }
  get inStaticBlock() {
    for (let i = this.scopeStack.length - 1; ; i--) {
      const { flags } = this.scopeStack[i];
      if (flags & ScopeFlag.STATIC_BLOCK) {
        return true;
      }
      if (flags & (ScopeFlag.VAR | ScopeFlag.CLASS)) {
        // function body, module body, class property initializers
        return false;
      }
    }
  }
  get inNonArrowFunction() {
    return (this.currentThisScopeFlags() & ScopeFlag.FUNCTION) > 0;
  }
  get treatFunctionsAsVar() {
    return this.treatFunctionsAsVarInScope(this.currentScope());
  }

  createScope(flags: ScopeFlag): Scope {
    return new Scope(flags);
  }

  enter(flags: ScopeFlag) {
    /*:: +createScope: (flags:ScopeFlag) => IScope; */
    // @ts-expect-error This method will be overwritten by subclasses
    this.scopeStack.push(this.createScope(flags));
  }

  exit(): ScopeFlag {
    const scope = this.scopeStack.pop();
    return scope.flags;
  }

  // The spec says:
  // > At the top level of a function, or script, function declarations are
  // > treated like var declarations rather than like lexical declarations.
  treatFunctionsAsVarInScope(scope: IScope): boolean {
    return !!(
      scope.flags & (ScopeFlag.FUNCTION | ScopeFlag.STATIC_BLOCK) ||
      (!this.parser.inModule && scope.flags & ScopeFlag.PROGRAM)
    );
  }

  declareName(name: string, bindingType: BindingFlag, loc: number) {
    let scope = this.currentScope();
    if (
      bindingType & BindingFlag.SCOPE_LEXICAL ||
      bindingType & BindingFlag.SCOPE_FUNCTION
    ) {
      this.checkRedeclarationInScope(scope, name, bindingType, loc);

      let type = scope.names.get(name) || 0;

      if (bindingType & BindingFlag.SCOPE_FUNCTION) {
        type = type | NameType.Function;
      } else {
        if (!scope.firstLexicalName) {
          scope.firstLexicalName = name;
        }
        type = type | NameType.Lexical;
      }

      scope.names.set(name, type);

      if (bindingType & BindingFlag.SCOPE_LEXICAL) {
        this.maybeExportDefined(scope, name);
      }
    } else if (bindingType & BindingFlag.SCOPE_VAR) {
      for (let i = this.scopeStack.length - 1; i >= 0; --i) {
        scope = this.scopeStack[i];
        this.checkRedeclarationInScope(scope, name, bindingType, loc);
        scope.names.set(name, (scope.names.get(name) || 0) | NameType.Var);
        this.maybeExportDefined(scope, name);

        if (scope.flags & ScopeFlag.VAR) break;
      }
    }
    if (this.parser.inModule && scope.flags & ScopeFlag.PROGRAM) {
      this.undefinedExports.delete(name);
    }
  }

  maybeExportDefined(scope: IScope, name: string) {
    if (this.parser.inModule && scope.flags & ScopeFlag.PROGRAM) {
      this.undefinedExports.delete(name);
    }
  }

  checkRedeclarationInScope(
    scope: IScope,
    name: string,
    bindingType: BindingFlag,
    loc: number,
  ) {
    if (this.isRedeclaredInScope(scope, name, bindingType)) {
      this.parser.raise(Errors.VarRedeclaration, loc, {
        identifierName: name,
      });
    }
  }

  isRedeclaredInScope(
    scope: IScope,
    name: string,
    bindingType: BindingFlag,
  ): boolean {
    if (!(bindingType & BindingFlag.KIND_VALUE)) return false;

    if (bindingType & BindingFlag.SCOPE_LEXICAL) {
      return scope.names.has(name);
    }

    const type = scope.names.get(name);

    if (bindingType & BindingFlag.SCOPE_FUNCTION) {
      return (
        (type & NameType.Lexical) > 0 ||
        (!this.treatFunctionsAsVarInScope(scope) && (type & NameType.Var) > 0)
      );
    }

    return (
      ((type & NameType.Lexical) > 0 &&
        // Annex B.3.4
        // https://tc39.es/ecma262/#sec-variablestatements-in-catch-blocks
        !(
          scope.flags & ScopeFlag.SIMPLE_CATCH &&
          scope.firstLexicalName === name
        )) ||
      (!this.treatFunctionsAsVarInScope(scope) &&
        (type & NameType.Function) > 0)
    );
  }

  checkLocalExport(id: N.Identifier) {
    const { name } = id;
    const topLevelScope = this.scopeStack[0];
    if (!topLevelScope.names.has(name)) {
      this.undefinedExports.set(name, id.start);
    }
  }

  currentScope(): IScope {
    return this.scopeStack[this.scopeStack.length - 1];
  }

  currentVarScopeFlags(): ScopeFlag {
    for (let i = this.scopeStack.length - 1; ; i--) {
      const { flags } = this.scopeStack[i];
      if (flags & ScopeFlag.VAR) {
        return flags;
      }
    }
  }

  // Could be useful for `arguments`, `this`, `new.target`, `super()`, `super.property`, and `super[property]`.
  currentThisScopeFlags(): ScopeFlag {
    for (let i = this.scopeStack.length - 1; ; i--) {
      const { flags } = this.scopeStack[i];
      if (
        flags & (ScopeFlag.VAR | ScopeFlag.CLASS) &&
        !(flags & ScopeFlag.ARROW)
      ) {
        return flags;
      }
    }
  }
}
