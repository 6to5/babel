import * as charCodes from "charcodes";

import { tokenLabelName, tt } from "../tokenizer/types.ts";
import type Parser from "../parser/index.ts";
import type * as N from "../types.ts";
import { ParseErrorEnum } from "../parse-error.ts";
import type { Undone } from "../parser/node.ts";
import type { ExpressionErrors } from "../parser/util.ts";
import type { BindingFlag } from "../util/scopeflags.ts";

type PossiblePlaceholders = {
  Identifier: N.Identifier;
  StringLiteral: N.StringLiteral;
  Expression: N.Expression;
  Statement: N.Statement;
  Declaration: N.Declaration;
  BlockStatement: N.BlockStatement;
  ClassBody: N.ClassBody;
  Pattern: N.Pattern;
};
export type PlaceholderTypes = keyof PossiblePlaceholders;

type NodeOf<T extends keyof PossiblePlaceholders> = PossiblePlaceholders[T];
// todo: when there  is proper union type for Node
// type NodeOf<T extends PlaceholderTypes> = Extract<N.Node, { type: T }>;

// todo: Placeholder<T> breaks everything, because its type is incompatible with
// the substituted nodes.
type MaybePlaceholder<T extends PlaceholderTypes> = NodeOf<T>; // | Placeholder<T>

/* eslint sort-keys: "error" */
const PlaceholderErrors = ParseErrorEnum`placeholders`({
  ClassNameIsRequired: "A class name is required.",
  UnexpectedSpace: "Unexpected space in placeholder.",
});

export default (superClass: typeof Parser) =>
  class PlaceholdersParserMixin extends superClass implements Parser {
    parsePlaceholder<T extends PlaceholderTypes>(
      expectedNode: T,
    ): /*?N.Placeholder<T>*/ MaybePlaceholder<T> | undefined {
      if (this.match(tt.placeholder)) {
        const node = this.startNode<N.Placeholder<T>>();
        this.next();
        this.assertNoSpace();

        // We can't use this.parseIdentifier because
        // we don't want nested placeholders.
        node.name = super.parseIdentifier(/* liberal */ true);

        this.assertNoSpace();
        this.expect(tt.placeholder);
        return this.finishPlaceholder(node, expectedNode);
      }
    }

    finishPlaceholder<T extends PlaceholderTypes>(
      node: Undone<N.Placeholder> | Undone<NodeOf<PlaceholderTypes>>,
      expectedNode: T,
    ): /*N.Placeholder<T>*/ MaybePlaceholder<T> {
      let placeholder = node as unknown as N.Placeholder<T>;

      if (!placeholder.expectedNode || !placeholder.type) {
        placeholder = this.finishNode(
          placeholder,
          "Placeholder",
        ) as unknown as N.Placeholder<T>;
      }

      placeholder.expectedNode = expectedNode;
      return placeholder as unknown as MaybePlaceholder<T>;
    }

    /* ============================================================ *
     * tokenizer/index.js                                           *
     * ============================================================ */

    getTokenFromCode(code: number) {
      if (
        code === charCodes.percentSign &&
        this.input.charCodeAt(this.state.pos + 1) === charCodes.percentSign
      ) {
        this.finishOp(tt.placeholder, 2);
      } else {
        super.getTokenFromCode(code);
      }
    }

    /* ============================================================ *
     * parser/expression.js                                         *
     * ============================================================ */

    parseExprAtom(
      refExpressionErrors?: ExpressionErrors | null,
    ): MaybePlaceholder<"Expression"> {
      return (
        this.parsePlaceholder("Expression") ||
        super.parseExprAtom(refExpressionErrors)
      );
    }

    parseIdentifier(liberal?: boolean): MaybePlaceholder<"Identifier"> {
      // NOTE: This function only handles identifiers outside of
      // expressions and binding patterns, since they are already
      // handled by the parseExprAtom and parseBindingAtom functions.
      // This is needed, for example, to parse "class %%NAME%% {}".
      return (
        this.parsePlaceholder("Identifier") || super.parseIdentifier(liberal)
      );
    }

    checkReservedWord(
      word: string,
      startLoc: number,
      checkKeywords: boolean,
      isBinding: boolean,
    ) {
      // Sometimes we call #checkReservedWord(node.name), expecting
      // that node is an Identifier. If it is a Placeholder, name
      // will be undefined.
      if (word !== undefined) {
        super.checkReservedWord(word, startLoc, checkKeywords, isBinding);
      }
    }

    /* ============================================================ *
     * parser/lval.js                                               *
     * ============================================================ */

    parseBindingAtom(): MaybePlaceholder<"Pattern"> {
      return this.parsePlaceholder("Pattern") || super.parseBindingAtom();
    }

    isValidLVal(type: string, isParenthesized: boolean, binding: BindingFlag) {
      return (
        type === "Placeholder" ||
        super.isValidLVal(type, isParenthesized, binding)
      );
    }

    toAssignable(node: N.Node, isLHS: boolean): void {
      if (
        node &&
        node.type === "Placeholder" &&
        node.expectedNode === "Expression"
      ) {
        node.expectedNode = "Pattern";
      } else {
        super.toAssignable(node, isLHS);
      }
    }

    /* ============================================================ *
     * parser/statement.js                                          *
     * ============================================================ */

    chStartsBindingIdentifier(ch: number, pos: number): boolean {
      if (super.chStartsBindingIdentifier(ch, pos)) {
        return true;
      }

      // Accept "let %%" as the start of "let %%placeholder%%", as though the
      // placeholder were an identifier.
      const nextToken = this.lookahead();
      if (nextToken.type === tt.placeholder) {
        return true;
      }

      return false;
    }

    verifyBreakContinue(
      node: N.BreakStatement | N.ContinueStatement,
      isBreak: boolean,
    ) {
      // @ts-expect-error: node.label could be Placeholder
      if (node.label && node.label.type === "Placeholder") return;
      super.verifyBreakContinue(node, isBreak);
    }

    // @ts-expect-error Plugin will override parser interface
    parseExpressionStatement(
      node: MaybePlaceholder<"Statement">,
      expr: MaybePlaceholder<"Expression">,
    ): MaybePlaceholder<"Statement"> {
      // @ts-expect-error placeholder typings
      if (expr.type !== "Placeholder" || expr.extra?.parenthesized) {
        // @ts-expect-error placeholder typings
        return super.parseExpressionStatement(node, expr);
      }

      if (this.match(tt.colon)) {
        // @ts-expect-error placeholder typings
        const stmt: N.LabeledStatement = node;
        stmt.label = this.finishPlaceholder(expr, "Identifier");
        this.next();
        stmt.body = super.parseStatementOrSloppyAnnexBFunctionDeclaration();
        return this.finishNode(stmt, "LabeledStatement");
      }

      this.semicolon();
      const stmtPlaceholder = node as unknown as N.Placeholder<"Statement">;
      stmtPlaceholder.name = (expr as N.Placeholder).name;
      return this.finishPlaceholder(stmtPlaceholder, "Statement");
    }

    parseBlock(
      allowDirectives?: boolean,
      createNewLexicalScope?: boolean,
      afterBlockParse?: (hasStrictModeDirective: boolean) => void,
    ): MaybePlaceholder<"BlockStatement"> {
      return (
        this.parsePlaceholder("BlockStatement") ||
        super.parseBlock(
          allowDirectives,
          createNewLexicalScope,
          afterBlockParse,
        )
      );
    }

    parseFunctionId(
      requireId?: boolean,
    ): MaybePlaceholder<"Identifier"> | undefined | null {
      return (
        this.parsePlaceholder("Identifier") || super.parseFunctionId(requireId)
      );
    }
    // @ts-expect-error Plugin will override parser interface
    parseClass<T extends N.Class>(
      node: T,
      isStatement: /* T === ClassDeclaration */ boolean,
      optionalId?: boolean,
    ): T {
      const type = isStatement ? "ClassDeclaration" : "ClassExpression";

      this.next();
      const oldStrict = this.state.strict;

      const placeholder = this.parsePlaceholder("Identifier");
      if (placeholder) {
        if (
          this.match(tt._extends) ||
          this.match(tt.placeholder) ||
          this.match(tt.braceL)
        ) {
          node.id = placeholder;
        } else if (optionalId || !isStatement) {
          node.id = null;
          node.body = this.finishPlaceholder(placeholder, "ClassBody");
          return this.finishNode(node, type);
        } else {
          throw this.raise(
            PlaceholderErrors.ClassNameIsRequired,
            this.state.startLoc,
          );
        }
      } else {
        this.parseClassId(node, isStatement, optionalId);
      }

      super.parseClassSuper(node);
      node.body =
        this.parsePlaceholder("ClassBody") ||
        super.parseClassBody(!!node.superClass, oldStrict);
      return this.finishNode(node, type);
    }

    parseExport(
      node: Undone<
        | N.ExportDefaultDeclaration
        | N.ExportAllDeclaration
        | N.ExportNamedDeclaration
      >,
      decorators: N.Decorator[] | null,
    ): N.AnyExport {
      const placeholder = this.parsePlaceholder("Identifier");
      if (!placeholder) return super.parseExport(node, decorators);

      const node2 = node as Undone<N.ExportNamedDeclaration>;

      if (!this.isContextual(tt._from) && !this.match(tt.comma)) {
        // export %%DECL%%;
        node2.specifiers = [];
        node2.source = null;
        node2.declaration = this.finishPlaceholder(placeholder, "Declaration");
        return this.finishNode(node2, "ExportNamedDeclaration");
      }

      // export %%NAME%% from "foo";
      this.expectPlugin("exportDefaultFrom");
      const specifier = this.startNode<N.ExportDefaultSpecifier>();
      specifier.exported = placeholder;
      node2.specifiers = [this.finishNode(specifier, "ExportDefaultSpecifier")];

      return super.parseExport(node2, decorators);
    }

    isExportDefaultSpecifier(): boolean {
      if (this.match(tt._default)) {
        const next = this.nextTokenStart();
        if (this.isUnparsedContextual(next, "from")) {
          if (
            this.input.startsWith(
              tokenLabelName(tt.placeholder),
              this.nextTokenStartSince(next + 4),
            )
          ) {
            return true;
          }
        }
      }
      return super.isExportDefaultSpecifier();
    }

    maybeParseExportDefaultSpecifier(
      node: Undone<
        | N.ExportDefaultDeclaration
        | N.ExportAllDeclaration
        | N.ExportNamedDeclaration
      >,
      maybeDefaultIdentifier: N.Identifier | null,
    ): node is Undone<N.ExportNamedDeclaration> {
      if ((node as N.ExportNamedDeclaration).specifiers?.length) {
        // "export %%NAME%%" has already been parsed by #parseExport.
        return true;
      }
      return super.maybeParseExportDefaultSpecifier(
        node,
        maybeDefaultIdentifier,
      );
    }

    checkExport(node: N.ExportNamedDeclaration): void {
      const { specifiers } = node;
      if (specifiers?.length) {
        node.specifiers = specifiers.filter(
          // @ts-expect-error placeholder typings
          node => node.exported.type === "Placeholder",
        );
      }
      super.checkExport(node);
      node.specifiers = specifiers;
    }

    parseImport(
      node: Undone<N.ImportDeclaration>,
    ): N.ImportDeclaration | N.TsImportEqualsDeclaration {
      const placeholder = this.parsePlaceholder("Identifier");
      if (!placeholder) return super.parseImport(node);

      node.specifiers = [];

      if (!this.isContextual(tt._from) && !this.match(tt.comma)) {
        // import %%STRING%%;
        node.source = this.finishPlaceholder(placeholder, "StringLiteral");
        this.semicolon();
        return this.finishNode(node, "ImportDeclaration");
      }

      // import %%DEFAULT%% ...
      const specifier =
        this.startNodeAtNode<N.ImportDefaultSpecifier>(placeholder);
      specifier.local = placeholder;
      node.specifiers.push(
        this.finishNode(specifier, "ImportDefaultSpecifier"),
      );

      if (this.eat(tt.comma)) {
        // import %%DEFAULT%%, * as ...
        const hasStarImport = this.maybeParseStarImportSpecifier(node);

        // import %%DEFAULT%%, { ...
        if (!hasStarImport) this.parseNamedImportSpecifiers(node);
      }

      this.expectContextual(tt._from);
      node.source = this.parseImportSource();
      this.semicolon();
      return this.finishNode(node, "ImportDeclaration");
    }

    parseImportSource(): MaybePlaceholder<"StringLiteral"> {
      // import ... from %%STRING%%;

      return (
        this.parsePlaceholder("StringLiteral") || super.parseImportSource()
      );
    }

    // Throws if the current token and the prev one are separated by a space.
    assertNoSpace(): void {
      if (
        this.state.start >
        this.offsetToSourcePos(this.state.lastTokEndLoc.index)
      ) {
        this.raise(PlaceholderErrors.UnexpectedSpace, this.state.lastTokEndLoc);
      }
    }
  };
