# Changelog

> **Tags:**
>
> - :boom: [Breaking Change]
> - :eyeglasses: [Spec Compliance]
> - :rocket: [New Feature]
> - :bug: [Bug Fix]
> - :memo: [Documentation]
> - :house: [Internal]
> - :nail_care: [Polish]

_Note: Gaps between patch versions are faulty, broken or test releases._

This file contains the changelog starting from v7.15.0.

- See [CHANGELOG - v7.0.0 to v7.14.9](/.github/CHANGELOG-v7.0.0-v7.14.9.md) for v7.0.0 to v7.14.9 changes.
- See [CHANGELOG - v7 prereleases](/.github/CHANGELOG-v7-prereleases.md) for v7.0.0-alpha.1 to v7.0.0-rc.4 changes.
- See [CHANGELOG - v4](/.github/CHANGELOG-v4.md), [CHANGELOG - v5](/.github/CHANGELOG-v5.md), and [CHANGELOG - v6](/.github/CHANGELOG-v6.md) for v4.x-v6.x changes.
- See [CHANGELOG - 6to5](/.github/CHANGELOG-6to5.md) for the pre-4.0.0 version changelog.
- See [Babylon's CHANGELOG](packages/babel-parser/CHANGELOG.md) for the Babylon pre-7.0.0-beta.29 version changelog.
- See [`babel-eslint`'s releases](https://github.com/babel/babel-eslint/releases) for the changelog before `@babel/eslint-parser` 7.8.0.
- See [`eslint-plugin-babel`'s releases](https://github.com/babel/eslint-plugin-babel/releases) for the changelog before `@babel/eslint-plugin` 7.8.0.

<!-- DO NOT CHANGE THESE COMMENTS - See .github/actions/trigger-github-release/update-changelog.js -->
<!-- insert-new-changelog-here -->
## v7.26.5 (2025-01-10)

#### :eyeglasses: Spec Compliance
* `babel-parser`
  * [#17011](https://github.com/babel/babel/pull/17011) Allow the dynamic `import.defer()` form of `import defer` ([@babel-bot](https://github.com/babel-bot))

#### :bug: Bug Fix
* `babel-plugin-transform-block-scoped-functions`
  * [#17024](https://github.com/babel/babel/pull/17024) chore: Avoid calling `isInStrictMode` in Babel 7 ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-plugin-transform-typescript`
  * [#17026](https://github.com/babel/babel/pull/17026) fix: Correctly generate exported const enums in namespace ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-parser`
  * [#17045](https://github.com/babel/babel/pull/17045) [estree] Unify method type parameters handling ([@JLHwung](https://github.com/JLHwung))
  * [#17013](https://github.com/babel/babel/pull/17013) fix: Correctly set position for `@(a.b)()` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
  * [#16996](https://github.com/babel/babel/pull/16996) [estree] Adjust the start loc of class methods with type params ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-generator`, `babel-parser`, `babel-plugin-transform-flow-strip-types`, `babel-types`
  * [#17028](https://github.com/babel/babel/pull/17028) Support flow jsx opening element type arguments ([@JLHwung](https://github.com/JLHwung))
* `babel-compat-data`, `babel-preset-env`
  * [#17031](https://github.com/babel/babel/pull/17031) fix: More accurate `transform-typeof-symbol` compat data ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-generator`, `babel-parser`, `babel-types`
  * [#17019](https://github.com/babel/babel/pull/17019) Fix incomplete visitor keys ([@JLHwung](https://github.com/JLHwung))

#### :microscope: Output optimization
* `babel-plugin-transform-nullish-coalescing-operator`
  * [#16612](https://github.com/babel/babel/pull/16612) Improve nullish coalescing operator output ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v7.26.4 (2024-12-05)

#### :leftwards_arrow_with_hook: Revert
* `babel-traverse`
  * [#17005](https://github.com/babel/babel/pull/17005) Revert "perf: Improve scope information collection performance" ([@JLHwung](https://github.com/JLHwung))
## v7.26.3 (2024-12-04)

#### :bug: Bug Fix
* `babel-generator`
  * [#16958](https://github.com/babel/babel/pull/16958) [preserveFormat] force semicolons when invalidating ASI ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* `babel-helper-builder-binary-assignment-operator-visitor`, `babel-plugin-transform-exponentiation-operator`
  * [#16895](https://github.com/babel/babel/pull/16895) Remove helper-builder-binary-assignment-operator-visitor ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :running_woman: Performance
* `babel-generator`
  * [#16959](https://github.com/babel/babel/pull/16959) perf: Reduce the use of temporary objects ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-traverse`
  * [#16923](https://github.com/babel/babel/pull/16923) perf: Improve scope information collection performance ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
  * [#16964](https://github.com/babel/babel/pull/16964) perf: Avoid repeated traversal when creating scope ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-plugin-transform-modules-commonjs`
  * [#16954](https://github.com/babel/babel/pull/16954) perf: Remove use of `simplifyAccess` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v7.26.2 (2024-10-30)

#### :bug: Bug Fix
* `babel-parser`
  * [#16903](https://github.com/babel/babel/pull/16903) fix: Parse placeholder for TS namespace ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
  * [#16937](https://github.com/babel/babel/pull/16937) fix: Account for offsets when creating new Position instances ([@DylanPiercey](https://github.com/DylanPiercey))
* `babel-generator`
  * [#16948](https://github.com/babel/babel/pull/16948) Fix mapping of tokens with generated nodes in between ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.26.1 (2024-10-25)

#### :bug: Bug Fix
* `babel-parser`
  * [#16936](https://github.com/babel/babel/pull/16936) fix(parser): offset internal index locations by startIndex ([@DylanPiercey](https://github.com/DylanPiercey))
## v7.26.0 (2024-10-25)

#### :rocket: New Feature
* `babel-core`, `babel-generator`, `babel-parser`, `babel-plugin-syntax-import-assertions`, `babel-plugin-syntax-import-attributes`, `babel-preset-env`, `babel-standalone`, `babel-types`
  * [#16850](https://github.com/babel/babel/pull/16850) Enable import attributes parsing by default ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-core`
  * [#16862](https://github.com/babel/babel/pull/16862) feat: support async plugin's pre/post ([@timofei-iatsenko](https://github.com/timofei-iatsenko))
* `babel-compat-data`, `babel-plugin-proposal-regexp-modifiers`, `babel-plugin-transform-regexp-modifiers`, `babel-preset-env`, `babel-standalone`
  * [#16692](https://github.com/babel/babel/pull/16692) Add `transform-regexp-modifiers` to `preset-env` ([@JLHwung](https://github.com/JLHwung))
* `babel-parser`
  * [#16849](https://github.com/babel/babel/pull/16849) feat: add `startIndex` parser option ([@DylanPiercey](https://github.com/DylanPiercey))
* `babel-generator`, `babel-parser`, `babel-plugin-syntax-flow`
  * [#16841](https://github.com/babel/babel/pull/16841) Always enable parsing of Flow enums ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helpers`, `babel-preset-typescript`, `babel-runtime-corejs3`
  * [#16794](https://github.com/babel/babel/pull/16794) Support `import()` in `rewriteImportExtensions` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-generator`, `babel-parser`
  * [#16708](https://github.com/babel/babel/pull/16708) Add experimental format-preserving mode to `@babel/generator` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :bug: Bug Fix
* `babel-core`
  * [#16928](https://github.com/babel/babel/pull/16928) Workaround Node.js bug for parallel loading of TLA modules ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  * [#16926](https://github.com/babel/babel/pull/16926) Fix loading of modules with TLA in Node.js 23 ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :nail_care: Polish
* `babel-plugin-proposal-json-modules`, `babel-plugin-transform-json-modules`, `babel-standalone`
  * [#16924](https://github.com/babel/babel/pull/16924) Rename `proposal-json-modules` to `transform-json-modules` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* `babel-code-frame`, `babel-highlight`
  * [#16896](https://github.com/babel/babel/pull/16896) Inline `@babel/highlight` in `@babel/code-frame` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-generator`, `babel-parser`, `babel-types`
  * [#16732](https://github.com/babel/babel/pull/16732) Add `kind` to `TSModuleDeclaration` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :running_woman: Performance
* `babel-helper-module-transforms`, `babel-plugin-transform-modules-commonjs`
  * [#16882](https://github.com/babel/babel/pull/16882) perf: Improve module transforms ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v7.25.9 (2024-10-22)

#### :bug: Bug Fix
* `babel-parser`, `babel-template`, `babel-types`
  * [#16905](https://github.com/babel/babel/pull/16905) fix: Keep type annotations in `syntacticPlaceholders` mode ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-helper-compilation-targets`, `babel-preset-env`
  * [#16907](https://github.com/babel/babel/pull/16907) fix: support BROWSERSLIST{,_CONFIG} env ([@JLHwung](https://github.com/JLHwung))
* Other
  * [#16884](https://github.com/babel/babel/pull/16884) Analyze `ClassAccessorProperty` to prevent the `no-undef` rule ([@victorenator](https://github.com/victorenator))

#### :house: Internal
* `babel-helper-transform-fixture-test-runner`
  * [#16914](https://github.com/babel/babel/pull/16914) remove test options flaky ([@JLHwung](https://github.com/JLHwung))

#### :running_woman: Performance
* `babel-parser`, `babel-types`
  * [#16918](https://github.com/babel/babel/pull/16918) perf: Make `VISITOR_KEYS` etc. faster to access ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v7.25.8 (2024-10-10)

#### :bug: Bug Fix
* `babel-core`
  * [#16888](https://github.com/babel/babel/pull/16888) Restore public API of `resolvePlugin`/`resolvePreset` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* `babel-parser`, `babel-plugin-proposal-async-do-expressions`, `babel-plugin-proposal-destructuring-private`, `babel-plugin-proposal-do-expressions`, `babel-plugin-proposal-explicit-resource-management`, `babel-plugin-proposal-export-default-from`, `babel-plugin-proposal-function-bind`, `babel-plugin-proposal-function-sent`, `babel-plugin-proposal-import-defer`, `babel-plugin-proposal-partial-application`, `babel-plugin-proposal-throw-expressions`, `babel-plugin-transform-async-generator-functions`, `babel-plugin-transform-class-static-block`, `babel-plugin-transform-dynamic-import`, `babel-plugin-transform-export-namespace-from`, `babel-plugin-transform-json-strings`, `babel-plugin-transform-logical-assignment-operators`, `babel-plugin-transform-nullish-coalescing-operator`, `babel-plugin-transform-numeric-separator`, `babel-plugin-transform-object-rest-spread`, `babel-plugin-transform-optional-catch-binding`, `babel-plugin-transform-optional-chaining`, `babel-plugin-transform-private-property-in-object`, `babel-preset-env`
  * [#16824](https://github.com/babel/babel/pull/16824) Inline one-line syntax plugins ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.25.7 (2024-10-02)

#### :bug: Bug Fix
* `babel-helper-validator-identifier`
  * [#16825](https://github.com/babel/babel/pull/16825) fix: update identifier to unicode 16 ([@JLHwung](https://github.com/JLHwung))
* `babel-traverse`
  * [#16814](https://github.com/babel/babel/pull/16814) fix: issue with node path keys updated on unrelated paths ([@DylanPiercey](https://github.com/DylanPiercey))
* `babel-plugin-transform-classes`
  * [#16797](https://github.com/babel/babel/pull/16797) Use an inclusion rather than exclusion list for `super()` check ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-generator`
  * [#16788](https://github.com/babel/babel/pull/16788) Fix printing of TS `infer` in compact mode ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  * [#16785](https://github.com/babel/babel/pull/16785) Print TS type annotations for destructuring in assignment pattern ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  * [#16778](https://github.com/babel/babel/pull/16778) Respect `[no LineTerminator here]` after nodes ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :nail_care: Polish
* `babel-types`
  * [#16852](https://github.com/babel/babel/pull/16852) Add deprecated JSDOC for fields ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :house: Internal
* `babel-core`
  * [#16820](https://github.com/babel/babel/pull/16820) Allow sync loading of ESM when `--experimental-require-module` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-compilation-targets`, `babel-helper-plugin-utils`, `babel-preset-env`
  * [#16858](https://github.com/babel/babel/pull/16858) Add browserslist config to external dependency ([@JLHwung](https://github.com/JLHwung))
* `babel-plugin-proposal-destructuring-private`, `babel-plugin-syntax-decimal`, `babel-plugin-syntax-import-reflection`, `babel-standalone`
  * [#16809](https://github.com/babel/babel/pull/16809) Archive syntax-import-reflection and syntax-decimal ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-generator`
  * [#16779](https://github.com/babel/babel/pull/16779) Simplify logic for `[no LineTerminator here]` before nodes ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :running_woman: Performance
* `babel-plugin-transform-typescript`
  * [#16875](https://github.com/babel/babel/pull/16875) perf: Avoid extra cloning of namespaces ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-types`
  * [#16842](https://github.com/babel/babel/pull/16842) perf: Improve @babel/types builders ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
  * [#16828](https://github.com/babel/babel/pull/16828) Only access `BABEL_TYPES_8_BREAKING` at startup ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.25.6 (2024-08-29)

#### :bug: Bug Fix
* `babel-generator`
  * [#16783](https://github.com/babel/babel/pull/16783) Properly print inner comments in TS array types ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  * [#16775](https://github.com/babel/babel/pull/16775) fix: jsx whitespace is not properly preserved when retainLines ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-traverse`
  * [#16727](https://github.com/babel/babel/pull/16727) fix: `path.getAssignmentIdentifiers` may be `undefined` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-parser`
  * [#16761](https://github.com/babel/babel/pull/16761) fix: improve static canFollowModifier checks ([@JLHwung](https://github.com/JLHwung))
* `babel-helpers`, `babel-plugin-transform-optional-chaining`, `babel-runtime-corejs3`
  * [#16769](https://github.com/babel/babel/pull/16769) Only wrap functions in `superPropertyGet` helper ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :nail_care: Polish
* `babel-generator`, `babel-plugin-transform-async-to-generator`, `babel-plugin-transform-block-scoping`, `babel-plugin-transform-class-properties`, `babel-plugin-transform-classes`, `babel-plugin-transform-duplicate-named-capturing-groups-regex`, `babel-plugin-transform-named-capturing-groups-regex`, `babel-plugin-transform-react-jsx-development`, `babel-plugin-transform-react-jsx`, `babel-plugin-transform-react-pure-annotations`, `babel-plugin-transform-regenerator`, `babel-plugin-transform-runtime`, `babel-preset-env`
  * [#16780](https://github.com/babel/babel/pull/16780) Do not enforce printing space between `(` and comments ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-plugin-syntax-import-assertions`, `babel-plugin-syntax-import-attributes`
  * [#16781](https://github.com/babel/babel/pull/16781) Don't throw when enabling both syntax-import-{assertions,attributes} ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-generator`
  * [#16782](https://github.com/babel/babel/pull/16782) TS union/intersection nested in union does not need parens ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* `babel-generator`
  * [#16777](https://github.com/babel/babel/pull/16777) Remove unused `parent` params in the generator ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.25.5 (2024-08-23)

#### :bug: Bug Fix
* `babel-generator`, `babel-traverse`
  * [#16764](https://github.com/babel/babel/pull/16764) fix: Generate parentheses correctly ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :nail_care: Polish
* `babel-generator`
  * [#16738](https://github.com/babel/babel/pull/16738) Only force-parenthesize `satisfies`'s LHS if it has newlines ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.25.4 (2024-08-22)

#### :bug: Bug Fix
* `babel-traverse`
  * [#16756](https://github.com/babel/babel/pull/16756) fix: Skip computed key when renaming ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-helper-create-class-features-plugin`, `babel-plugin-proposal-decorators`
  * [#16755](https://github.com/babel/babel/pull/16755) fix: Decorator 2018-09 may throw an exception ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-types`
  * [#16710](https://github.com/babel/babel/pull/16710) Visit AST fields nodes according to their syntactical order ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-generator`
  * [#16709](https://github.com/babel/babel/pull/16709) Print semicolon after TS `export namespace as A` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :nail_care: Polish
* `babel-generator`, `babel-plugin-proposal-decorators`, `babel-plugin-proposal-destructuring-private`, `babel-plugin-proposal-pipeline-operator`, `babel-plugin-transform-class-properties`, `babel-plugin-transform-destructuring`, `babel-plugin-transform-optional-chaining`, `babel-plugin-transform-private-methods`, `babel-plugin-transform-private-property-in-object`, `babel-plugin-transform-typescript`, `babel-runtime-corejs2`, `babel-runtime`, `babel-traverse`
  * [#16722](https://github.com/babel/babel/pull/16722) Avoid unnecessary parens around sequence expressions ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-generator`, `babel-plugin-transform-class-properties`
  * [#16714](https://github.com/babel/babel/pull/16714) Avoid unnecessary parens around exported arrow functions ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-generator`, `babel-plugin-proposal-decorators`, `babel-plugin-proposal-destructuring-private`, `babel-plugin-transform-object-rest-spread`
  * [#16712](https://github.com/babel/babel/pull/16712) Avoid printing unnecessary parens around object destructuring ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :microscope: Output optimization
* `babel-generator`
  * [#16740](https://github.com/babel/babel/pull/16740) Avoid extra spaces between comments/regexps in compact mode ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.25.3 (2024-07-31)

#### :bug: Bug Fix
* `babel-plugin-bugfix-firefox-class-in-computed-class-key`, `babel-traverse`
  * [#16699](https://github.com/babel/babel/pull/16699) Avoid validating visitors produced by `traverse.visitors.merge` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* `babel-parser`
  * [#16688](https://github.com/babel/babel/pull/16688) Add `@babel/types` as a dependency of `@babel/parser` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.25.2 (2024-07-30)

#### :bug: Bug Fix
* `babel-core`, `babel-traverse`
  * [#16695](https://github.com/babel/babel/pull/16695) Ensure that `requeueComputedKeyAndDecorators` is available ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.25.1 (2024-07-28)

#### :bug: Bug Fix
* `babel-plugin-transform-function-name`
  * [#16683](https://github.com/babel/babel/pull/16683) fix: `ensureFunctionName` may be undefined ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-plugin-transform-react-constant-elements`
  * [#16582](https://github.com/babel/babel/pull/16582) fix plugin-transform-react-constant-elements transform JSXFrament but not add JSXExpressionContainer ([@keiseiTi](https://github.com/keiseiTi))
* `babel-traverse`
  * [#16587](https://github.com/babel/babel/pull/16587) fix: fixed issue16583 + test ([@nerodesu017](https://github.com/nerodesu017))

#### :house: Internal
* [#16663](https://github.com/babel/babel/pull/16663) Test eslint plugin against eslint 9 ([@JLHwung](https://github.com/JLHwung))
## v7.25.0 (2024-07-26)

#### :eyeglasses: Spec Compliance
* `babel-helpers`, `babel-plugin-proposal-explicit-resource-management`, `babel-runtime-corejs3`
  * [#16537](https://github.com/babel/babel/pull/16537) `await using` normative updates ([@JLHwung](https://github.com/JLHwung))
* `babel-plugin-transform-typescript`
  * [#16602](https://github.com/babel/babel/pull/16602) Ensure enum members syntactically determinable to be strings do not get reverse mappings ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :rocket: New Feature
* `babel-helper-create-class-features-plugin`, `babel-helper-function-name`, `babel-helper-plugin-utils`, `babel-helper-wrap-function`, `babel-plugin-bugfix-safari-class-field-initializer-scope`, `babel-plugin-bugfix-safari-id-destructuring-collision-in-function-expression`, `babel-plugin-transform-classes`, `babel-plugin-transform-function-name`, `babel-preset-env`, `babel-traverse`, `babel-types`
  * [#16658](https://github.com/babel/babel/pull/16658) Move `ensureFunctionName` to `NodePath.prototype` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-hoist-variables`, `babel-helper-plugin-utils`, `babel-plugin-proposal-async-do-expressions`, `babel-plugin-transform-modules-systemjs`, `babel-traverse`
  * [#16644](https://github.com/babel/babel/pull/16644) Move `hoistVariables` to `Scope.prototype` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-create-class-features-plugin`, `babel-helper-module-transforms`, `babel-helper-plugin-utils`, `babel-helper-split-export-declaration`, `babel-plugin-transform-classes`, `babel-traverse`, `babel-types`
  * [#16645](https://github.com/babel/babel/pull/16645) Move `splitExportDeclaration` to `NodePath.prototype` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-create-class-features-plugin`, `babel-helper-environment-visitor`, `babel-helper-module-transforms`, `babel-helper-plugin-utils`, `babel-helper-remap-async-to-generator`, `babel-helper-replace-supers`, `babel-plugin-bugfix-firefox-class-in-computed-class-key`, `babel-plugin-bugfix-v8-static-class-fields-redefine-readonly`, `babel-plugin-transform-async-generator-functions`, `babel-plugin-transform-classes`, `babel-traverse`
  * [#16649](https://github.com/babel/babel/pull/16649) Move `environment-visitor` helper into `@babel/traverse` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-core`, `babel-parser`
  * [#16480](https://github.com/babel/babel/pull/16480) Expose wether a module has TLA or not as `.extra.async` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-compat-data`, `babel-plugin-bugfix-safari-class-field-initializer-scope`, `babel-preset-env`
  * [#16569](https://github.com/babel/babel/pull/16569) Introduce `bugfix-safari-class-field-initializer-scope` ([@davidtaylorhq](https://github.com/davidtaylorhq))
* `babel-plugin-transform-block-scoping`, `babel-traverse`, `babel-types`
  * [#16551](https://github.com/babel/babel/pull/16551) Add `NodePath#getAssignmentIdentifiers` ([@JLHwung](https://github.com/JLHwung))
* `babel-helper-import-to-platform-api`, `babel-plugin-proposal-json-modules`
  * [#16579](https://github.com/babel/babel/pull/16579) Add `uncheckedRequire` option for JSON imports to CJS ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-transform-fixture-test-runner`, `babel-node`
  * [#16642](https://github.com/babel/babel/pull/16642) Allow using custom config in `babel-node --eval` ([@slatereax](https://github.com/slatereax))
* `babel-compat-data`, `babel-helper-create-regexp-features-plugin`, `babel-plugin-proposal-duplicate-named-capturing-groups-regex`, `babel-plugin-transform-duplicate-named-capturing-groups-regex`, `babel-preset-env`, `babel-standalone`
  * [#16445](https://github.com/babel/babel/pull/16445) Add `duplicate-named-capturing-groups-regex` to `preset-env` ([@JLHwung](https://github.com/JLHwung))

#### :bug: Bug Fix
* `babel-generator`
  * [#16678](https://github.com/babel/babel/pull/16678) Print parens around as expressions on the LHS ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-template`, `babel-types`
  * [#15286](https://github.com/babel/babel/pull/15286) fix: Props are lost when the template replaces the node ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :house: Internal
* Other
  * [#16674](https://github.com/babel/babel/pull/16674) bump gulp to 5 ([@JLHwung](https://github.com/JLHwung))
* `babel-generator`
  * [#16651](https://github.com/babel/babel/pull/16651) Simplify the printing logic for `(` before ambiguous tokens ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-function-name`, `babel-plugin-transform-arrow-functions`, `babel-plugin-transform-function-name`, `babel-preset-env`, `babel-traverse`
  * [#16652](https://github.com/babel/babel/pull/16652) Simplify `helper-function-name` logic ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :running_woman: Performance
* `babel-parser`, `babel-plugin-proposal-pipeline-operator`
  * [#16461](https://github.com/babel/babel/pull/16461) Some minor parser performance improvements for ts ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :microscope: Output optimization
* `babel-plugin-transform-classes`
  * [#16670](https://github.com/babel/babel/pull/16670) Reduce redundant `assertThisInitialized` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-helper-create-class-features-plugin`, `babel-helper-replace-supers`, `babel-helpers`, `babel-plugin-proposal-decorators`, `babel-plugin-transform-class-properties`, `babel-plugin-transform-classes`, `babel-plugin-transform-exponentiation-operator`, `babel-plugin-transform-object-super`, `babel-plugin-transform-private-methods`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`
  * [#16374](https://github.com/babel/babel/pull/16374) Improve `super.x` output ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-plugin-transform-class-properties`, `babel-plugin-transform-classes`
  * [#16656](https://github.com/babel/babel/pull/16656) Simplify output for anonymous classes with no methods ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.24.10 (2024-07-16)

#### :bug: Bug Fix
* `babel-generator`
  * [#16648](https://github.com/babel/babel/pull/16648) Fix parens detection for object&function in `as`/`satisfies` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.24.9 (2024-07-15)

#### :bug: Bug Fix
* `babel-core`, `babel-standalone`
  * [#16639](https://github.com/babel/babel/pull/16639) Avoid `require()` call in `@babel/standalone` bundle ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-types`
  * [#16638](https://github.com/babel/babel/pull/16638) fix: provide legacy typings for TS < 4.1 ([@JLHwung](https://github.com/JLHwung))

#### :nail_care: Polish
* `babel-generator`, `babel-plugin-transform-optional-chaining`
  * [#16617](https://github.com/babel/babel/pull/16617) Avoid extra parens in TS `as`/`satisfies` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* `babel-helper-module-transforms`
  * [#16629](https://github.com/babel/babel/pull/16629) Lazy top-level initializations for module transforms ([@guybedford](https://github.com/guybedford))
## v7.24.8 (2024-07-11)

#### :eyeglasses: Spec Compliance
* `babel-parser`
  * [#16567](https://github.com/babel/babel/pull/16567) Do not use strict mode in TS `declare` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :bug: Bug Fix
* `babel-generator`
  * [#16630](https://github.com/babel/babel/pull/16630) Correctly print parens around `in` in `for` heads ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  * [#16626](https://github.com/babel/babel/pull/16626) Fix printing of comments in `await using` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  * [#16591](https://github.com/babel/babel/pull/16591) fix typescript code generation for yield expression inside type expre… ([@SreeXD](https://github.com/SreeXD))
* `babel-parser`
  * [#16613](https://github.com/babel/babel/pull/16613) Disallow destructuring assignment in `using` declarations ([@H0onnn](https://github.com/H0onnn))
  * [#16490](https://github.com/babel/babel/pull/16490) fix: do not add `.value: undefined` to regexp literals ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-types`
  * [#16615](https://github.com/babel/babel/pull/16615) Remove boolean props from `ObjectTypeInternalSlot` visitor keys ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-plugin-transform-typescript`
  * [#16566](https://github.com/babel/babel/pull/16566) fix: Correctly handle `export import x =` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :nail_care: Polish
* `babel-generator`
  * [#16625](https://github.com/babel/babel/pull/16625) Avoid unnecessary parens around `async` in `for await` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-traverse`
  * [#16619](https://github.com/babel/babel/pull/16619) Avoid checking `Scope.globals` multiple times ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v7.24.7 (2024-06-05)

#### :bug: Bug Fix
* `babel-node`
  * [#16554](https://github.com/babel/babel/pull/16554) Allow extra flags in babel-node ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-traverse`
  * [#16522](https://github.com/babel/babel/pull/16522) fix: incorrect `constantViolations` with destructuring ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-helper-transform-fixture-test-runner`, `babel-plugin-proposal-explicit-resource-management`
  * [#16524](https://github.com/babel/babel/pull/16524) fix: Transform `using` in `switch` correctly ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :house: Internal
* `babel-helpers`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`
  * [#16525](https://github.com/babel/babel/pull/16525) Delete unused array helpers ([@blakewilson](https://github.com/blakewilson))
## v7.24.6 (2024-05-24)

#### :bug: Bug Fix
* `babel-helper-create-class-features-plugin`, `babel-plugin-transform-class-properties`
  * [#16514](https://github.com/babel/babel/pull/16514) Fix source maps for private member expressions ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-core`, `babel-generator`, `babel-plugin-transform-modules-commonjs`
  * [#16515](https://github.com/babel/babel/pull/16515) Fix source maps for template literals ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-create-class-features-plugin`, `babel-plugin-proposal-decorators`
  * [#16485](https://github.com/babel/babel/pull/16485) Support undecorated static accessor in anonymous classes ([@JLHwung](https://github.com/JLHwung))
  * [#16484](https://github.com/babel/babel/pull/16484) Fix decorator bare yield await ([@JLHwung](https://github.com/JLHwung))
* `babel-helpers`, `babel-plugin-proposal-decorators`, `babel-runtime-corejs3`
  * [#16483](https://github.com/babel/babel/pull/16483) Fix: throw TypeError if addInitializer is called after finished ([@JLHwung](https://github.com/JLHwung))
* `babel-parser`, `babel-plugin-transform-typescript`
  * [#16476](https://github.com/babel/babel/pull/16476) fix: Correctly parse `cls.fn<C> = x` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :house: Internal
* `babel-core`, `babel-helpers`, `babel-plugin-transform-runtime`, `babel-preset-env`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`
  * [#16501](https://github.com/babel/babel/pull/16501) Generate helper metadata at build time ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helpers`
  * [#16499](https://github.com/babel/babel/pull/16499) Add `tsconfig.json` for `@babel/helpers/src/helpers` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-cli`, `babel-helpers`, `babel-plugin-external-helpers`, `babel-plugin-proposal-decorators`, `babel-plugin-transform-class-properties`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-modules-systemjs`, `babel-plugin-transform-runtime`, `babel-preset-env`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`
  * [#16495](https://github.com/babel/babel/pull/16495) Move all runtime helpers to individual files ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-parser`, `babel-traverse`
  * [#16482](https://github.com/babel/babel/pull/16482) Statically generate boilerplate for bitfield accessors ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* Other
  * [#16466](https://github.com/babel/babel/pull/16466) Migrate import assertions syntax ([@JLHwung](https://github.com/JLHwung))
## v7.24.5 (2024-04-29)

#### :bug: Bug Fix
* `babel-plugin-transform-classes`, `babel-traverse`
  * [#16377](https://github.com/babel/babel/pull/16377) fix: TypeScript annotation affects output ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-helpers`, `babel-plugin-proposal-explicit-resource-management`, `babel-runtime-corejs3`
  * [#16440](https://github.com/babel/babel/pull/16440) Fix suppressed error order ([@sossost](https://github.com/sossost))
  * [#16408](https://github.com/babel/babel/pull/16408) Await nullish async disposable ([@JLHwung](https://github.com/JLHwung))

#### :nail_care: Polish
* `babel-parser`
  * [#16407](https://github.com/babel/babel/pull/16407) Recover from exported `using` declaration ([@JLHwung](https://github.com/JLHwung))

#### :house: Internal
* Other
  * [#16414](https://github.com/babel/babel/pull/16414) Relax ESLint peerDependency constraint to allow v9 ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-parser`
  * [#16425](https://github.com/babel/babel/pull/16425) Improve `@babel/parser` AST types ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  * [#16417](https://github.com/babel/babel/pull/16417) Always pass type argument to `.startNode` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-create-class-features-plugin`, `babel-helper-member-expression-to-functions`, `babel-helper-module-transforms`, `babel-helper-split-export-declaration`, `babel-helper-wrap-function`, `babel-helpers`, `babel-plugin-bugfix-firefox-class-in-computed-class-key`, `babel-plugin-proposal-explicit-resource-management`, `babel-plugin-transform-block-scoping`, `babel-plugin-transform-destructuring`, `babel-plugin-transform-object-rest-spread`, `babel-plugin-transform-optional-chaining`, `babel-plugin-transform-parameters`, `babel-plugin-transform-private-property-in-object`, `babel-plugin-transform-react-jsx-self`, `babel-plugin-transform-typeof-symbol`, `babel-plugin-transform-typescript`, `babel-traverse`
  * [#16439](https://github.com/babel/babel/pull/16439) Make `NodePath<T | U>` distributive ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-plugin-proposal-partial-application`, `babel-types`
  * [#16421](https://github.com/babel/babel/pull/16421) Remove `JSXNamespacedName` from valid `CallExpression` args ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-plugin-transform-class-properties`, `babel-preset-env`
  * [#16406](https://github.com/babel/babel/pull/16406) Do not load unnecessary Babel 7 syntax plugins in Babel 8 ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :running_woman: Performance
* `babel-helpers`, `babel-preset-env`, `babel-runtime-corejs3`
  * [#16357](https://github.com/babel/babel/pull/16357) Performance: improve `objectWithoutPropertiesLoose` on V8 ([@romgrk](https://github.com/romgrk))
## v7.24.4 (2024-04-03)

#### :eyeglasses: Spec Compliance
* `babel-parser`
  * [#16403](https://github.com/babel/babel/pull/16403) Forbid initializerless using ([@JLHwung](https://github.com/JLHwung))
* `babel-helpers`, `babel-plugin-proposal-decorators`, `babel-runtime-corejs3`
  * [#16388](https://github.com/babel/babel/pull/16388) Ensure decorators are callable ([@JLHwung](https://github.com/JLHwung))

#### :bug: Bug Fix
* `babel-generator`
  * [#16402](https://github.com/babel/babel/pull/16402) fix: Correctly prints `{ [key in Bar]? }` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
  * [#16394](https://github.com/babel/babel/pull/16394) fix: Correctly generate `TSMappedType` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-compat-data`, `babel-plugin-bugfix-firefox-class-in-computed-class-key`, `babel-preset-env`
  * [#16390](https://github.com/babel/babel/pull/16390) Create bugfix plugin for classes in computed keys in Firefox ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-create-class-features-plugin`, `babel-plugin-proposal-decorators`
  * [#16387](https://github.com/babel/babel/pull/16387) fix: support mutated outer decorated class binding ([@JLHwung](https://github.com/JLHwung))
  * [#16385](https://github.com/babel/babel/pull/16385) fix: Decorators when `super()` exists and `protoInit` is not needed ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-plugin-transform-block-scoping`
  * [#16384](https://github.com/babel/babel/pull/16384) fix: Transform scoping for `for X` in loop ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
  * [#16368](https://github.com/babel/babel/pull/16368) fix: Capture `let` when the `for` body is not a block ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-core`, `babel-plugin-transform-block-scoped-functions`, `babel-plugin-transform-block-scoping`
  * [#16363](https://github.com/babel/babel/pull/16363) Fix incorrect function hoisting in some case statements ([@luiscubal](https://github.com/luiscubal))
## v7.24.3 (2024-03-20)

#### :bug: Bug Fix
* `babel-helper-module-imports`
  * [#16370](https://github.com/babel/babel/pull/16370) fix: do not inject the same imported identifier multiple times ([@ota-meshi](https://github.com/ota-meshi))
## v7.24.2 (2024-03-19)

#### :bug: Bug Fix
* `babel-code-frame`, `babel-highlight`
  * [#16362](https://github.com/babel/babel/pull/16362) Restore previous `FORCE_COLOR=0` behavior ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.24.1 (2024-03-19)

#### :bug: Bug Fix
* `babel-helper-create-class-features-plugin`, `babel-plugin-proposal-decorators`
  * [#16350](https://github.com/babel/babel/pull/16350) Fix decorated class computed keys ordering ([@JLHwung](https://github.com/JLHwung))
  * [#16344](https://github.com/babel/babel/pull/16344) Fix decorated class static field private access ([@JLHwung](https://github.com/JLHwung))
* `babel-plugin-proposal-decorators`, `babel-plugin-proposal-json-modules`, `babel-plugin-transform-async-generator-functions`, `babel-plugin-transform-regenerator`, `babel-plugin-transform-runtime`, `babel-preset-env`
  * [#16329](https://github.com/babel/babel/pull/16329) Respect `moduleName` for `@babel/runtime/regenerator` imports ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-create-class-features-plugin`, `babel-plugin-proposal-decorators`, `babel-plugin-proposal-pipeline-operator`, `babel-plugin-transform-class-properties`
  * [#16331](https://github.com/babel/babel/pull/16331) Fix decorator memoiser binding kind ([@JLHwung](https://github.com/JLHwung))
* `babel-helper-create-class-features-plugin`, `babel-helper-replace-supers`, `babel-plugin-proposal-decorators`, `babel-plugin-transform-class-properties`
  * [#16325](https://github.com/babel/babel/pull/16325) Fix decorator evaluation private environment ([@JLHwung](https://github.com/JLHwung))

#### :memo: Documentation
* [#16319](https://github.com/babel/babel/pull/16319) Update SECURITY.md ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* `babel-code-frame`, `babel-highlight`
  * [#16359](https://github.com/babel/babel/pull/16359) Replace `chalk` with `picocolors` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-fixtures`, `babel-helpers`, `babel-plugin-bugfix-safari-id-destructuring-collision-in-function-expression`, `babel-plugin-proposal-pipeline-operator`, `babel-plugin-transform-unicode-sets-regex`, `babel-preset-env`, `babel-preset-flow`
  * [#16352](https://github.com/babel/babel/pull/16352) Run Babel transform tests on old node if possible ([@JLHwung](https://github.com/JLHwung))
* `babel-helpers`, `babel-plugin-transform-async-generator-functions`, `babel-plugin-transform-class-properties`, `babel-plugin-transform-class-static-block`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-modules-systemjs`, `babel-plugin-transform-regenerator`, `babel-plugin-transform-runtime`, `babel-preset-env`, `babel-runtime-corejs3`, `babel-runtime`, `babel-standalone`
  * [#16323](https://github.com/babel/babel/pull/16323) Allow separate helpers to be excluded in Babel 8 ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-helper-module-imports`, `babel-plugin-proposal-import-wasm-source`, `babel-plugin-proposal-json-modules`, `babel-plugin-proposal-record-and-tuple`, `babel-plugin-transform-react-jsx-development`, `babel-plugin-transform-react-jsx`
  * [#16349](https://github.com/babel/babel/pull/16349) Support merging imports in import injector ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-create-class-features-plugin`, `babel-plugin-bugfix-safari-id-destructuring-collision-in-function-expression`, `babel-plugin-bugfix-v8-spread-parameters-in-optional-chaining`, `babel-plugin-bugfix-v8-static-class-fields-redefine-readonly`, `babel-plugin-external-helpers`, `babel-plugin-proposal-async-do-expressions`, `babel-plugin-proposal-decorators`, `babel-plugin-proposal-destructuring-private`, `babel-plugin-proposal-do-expressions`, `babel-plugin-proposal-duplicate-named-capturing-groups-regex`, `babel-plugin-proposal-explicit-resource-management`, `babel-plugin-proposal-export-default-from`, `babel-plugin-proposal-function-bind`, `babel-plugin-proposal-function-sent`, `babel-plugin-proposal-import-attributes-to-assertions`, `babel-plugin-proposal-import-defer`, `babel-plugin-proposal-import-wasm-source`, `babel-plugin-proposal-json-modules`, `babel-plugin-proposal-optional-chaining-assign`, `babel-plugin-proposal-partial-application`, `babel-plugin-proposal-pipeline-operator`, `babel-plugin-proposal-record-and-tuple`, `babel-plugin-proposal-regexp-modifiers`, `babel-plugin-proposal-throw-expressions`, `babel-plugin-syntax-async-do-expressions`, `babel-plugin-syntax-decimal`, `babel-plugin-syntax-decorators`, `babel-plugin-syntax-destructuring-private`, `babel-plugin-syntax-do-expressions`, `babel-plugin-syntax-explicit-resource-management`, `babel-plugin-syntax-export-default-from`, `babel-plugin-syntax-flow`, `babel-plugin-syntax-function-bind`, `babel-plugin-syntax-function-sent`, `babel-plugin-syntax-import-assertions`, `babel-plugin-syntax-import-attributes`, `babel-plugin-syntax-import-defer`, `babel-plugin-syntax-import-reflection`, `babel-plugin-syntax-import-source`, `babel-plugin-syntax-jsx`, `babel-plugin-syntax-module-blocks`, `babel-plugin-syntax-optional-chaining-assign`, `babel-plugin-syntax-partial-application`, `babel-plugin-syntax-pipeline-operator`, `babel-plugin-syntax-record-and-tuple`, `babel-plugin-syntax-throw-expressions`, `babel-plugin-syntax-typescript`, `babel-plugin-transform-arrow-functions`, `babel-plugin-transform-async-generator-functions`, `babel-plugin-transform-async-to-generator`, `babel-plugin-transform-block-scoped-functions`, `babel-plugin-transform-block-scoping`, `babel-plugin-transform-class-properties`, `babel-plugin-transform-class-static-block`, `babel-plugin-transform-classes`, `babel-plugin-transform-computed-properties`, `babel-plugin-transform-destructuring`, `babel-plugin-transform-dotall-regex`, `babel-plugin-transform-duplicate-keys`, `babel-plugin-transform-dynamic-import`, `babel-plugin-transform-exponentiation-operator`, `babel-plugin-transform-export-namespace-from`, `babel-plugin-transform-flow-comments`, `babel-plugin-transform-flow-strip-types`, `babel-plugin-transform-for-of`, `babel-plugin-transform-function-name`, `babel-plugin-transform-instanceof`, `babel-plugin-transform-jscript`, `babel-plugin-transform-json-strings`, `babel-plugin-transform-literals`, `babel-plugin-transform-logical-assignment-operators`, `babel-plugin-transform-member-expression-literals`, `babel-plugin-transform-modules-amd`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-modules-systemjs`, `babel-plugin-transform-modules-umd`, `babel-plugin-transform-new-target`, `babel-plugin-transform-nullish-coalescing-operator`, `babel-plugin-transform-numeric-separator`, `babel-plugin-transform-object-assign`, `babel-plugin-transform-object-rest-spread`, `babel-plugin-transform-object-set-prototype-of-to-assign`, `babel-plugin-transform-object-super`, `babel-plugin-transform-optional-catch-binding`, `babel-plugin-transform-optional-chaining`, `babel-plugin-transform-parameters`, `babel-plugin-transform-private-methods`, `babel-plugin-transform-private-property-in-object`, `babel-plugin-transform-property-literals`, `babel-plugin-transform-property-mutators`, `babel-plugin-transform-proto-to-assign`, `babel-plugin-transform-react-constant-elements`, `babel-plugin-transform-react-display-name`, `babel-plugin-transform-react-inline-elements`, `babel-plugin-transform-react-jsx-compat`, `babel-plugin-transform-react-jsx-self`, `babel-plugin-transform-react-jsx-source`, `babel-plugin-transform-react-pure-annotations`, `babel-plugin-transform-regenerator`, `babel-plugin-transform-reserved-words`, `babel-plugin-transform-runtime`, `babel-plugin-transform-shorthand-properties`, `babel-plugin-transform-spread`, `babel-plugin-transform-sticky-regex`, `babel-plugin-transform-strict-mode`, `babel-plugin-transform-template-literals`, `babel-plugin-transform-typeof-symbol`, `babel-plugin-transform-typescript`, `babel-plugin-transform-unicode-escapes`, `babel-plugin-transform-unicode-property-regex`, `babel-plugin-transform-unicode-regex`, `babel-plugin-transform-unicode-sets-regex`, `babel-preset-env`, `babel-preset-flow`, `babel-preset-react`, `babel-preset-typescript`
  * [#16332](https://github.com/babel/babel/pull/16332) Test Babel 7 plugins compatibility with Babel 8 core ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-compat-data`, `babel-plugin-transform-object-rest-spread`, `babel-preset-env`
  * [#16318](https://github.com/babel/babel/pull/16318) [babel 8] Fix `@babel/compat-data` package.json ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :microscope: Output optimization
* `babel-helper-replace-supers`, `babel-plugin-transform-class-properties`, `babel-plugin-transform-classes`, `babel-plugin-transform-parameters`, `babel-plugin-transform-runtime`
  * [#16345](https://github.com/babel/babel/pull/16345) Optimize the use of `assertThisInitialized` after `super()` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-plugin-transform-class-properties`, `babel-plugin-transform-classes`
  * [#16343](https://github.com/babel/babel/pull/16343) Use simpler `assertThisInitialized` more often ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-plugin-proposal-decorators`, `babel-plugin-transform-class-properties`, `babel-plugin-transform-object-rest-spread`, `babel-traverse`
  * [#16342](https://github.com/babel/babel/pull/16342) Consider well-known and registered symbols as literals ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-core`, `babel-plugin-external-helpers`, `babel-plugin-proposal-decorators`, `babel-plugin-proposal-function-bind`, `babel-plugin-transform-class-properties`, `babel-plugin-transform-classes`, `babel-plugin-transform-flow-comments`, `babel-plugin-transform-flow-strip-types`, `babel-plugin-transform-function-name`, `babel-plugin-transform-modules-systemjs`, `babel-plugin-transform-parameters`, `babel-plugin-transform-private-property-in-object`, `babel-plugin-transform-react-jsx`, `babel-plugin-transform-runtime`, `babel-plugin-transform-spread`, `babel-plugin-transform-typescript`, `babel-preset-env`
  * [#16326](https://github.com/babel/babel/pull/16326) Reduce the use of class names ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v7.24.0 (2024-02-28)

#### :rocket: New Feature
* `babel-standalone`
  * [#11696](https://github.com/babel/babel/pull/11696) Export babel tooling packages in `@babel/standalone` ([@ajihyf](https://github.com/ajihyf))
* `babel-core`, `babel-helper-create-class-features-plugin`, `babel-helpers`, `babel-plugin-transform-class-properties`
  * [#16267](https://github.com/babel/babel/pull/16267) Implement `noUninitializedPrivateFieldAccess` assumption ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-create-class-features-plugin`, `babel-helpers`, `babel-plugin-proposal-decorators`, `babel-plugin-proposal-pipeline-operator`, `babel-plugin-syntax-decorators`, `babel-plugin-transform-class-properties`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`
  * [#16242](https://github.com/babel/babel/pull/16242) Support decorator 2023-11 normative updates ([@JLHwung](https://github.com/JLHwung))
* `babel-preset-flow`
  * [#16309](https://github.com/babel/babel/pull/16309) [babel 7] Allow setting `ignoreExtensions` in Flow preset ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  * [#16284](https://github.com/babel/babel/pull/16284) Add `experimental_useHermesParser` option in `preset-flow` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-helper-import-to-platform-api`, `babel-plugin-proposal-import-wasm-source`, `babel-plugin-proposal-json-modules`, `babel-standalone`
  * [#16172](https://github.com/babel/babel/pull/16172) Add transform support for JSON modules imports ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-plugin-transform-runtime`
  * [#16241](https://github.com/babel/babel/pull/16241) Add back `moduleName` option to `@babel/plugin-transform-runtime` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-parser`, `babel-types`
  * [#16277](https://github.com/babel/babel/pull/16277) Allow import attributes for `TSImportType` ([@sosukesuzuki](https://github.com/sosukesuzuki))

#### :bug: Bug Fix
* `babel-plugin-proposal-do-expressions`, `babel-traverse`
  * [#16305](https://github.com/babel/babel/pull/16305) fix: avoid `popContext` on unvisited node paths ([@JLHwung](https://github.com/JLHwung))
* `babel-helper-create-class-features-plugin`, `babel-plugin-transform-private-methods`, `babel-plugin-transform-private-property-in-object`
  * [#16312](https://github.com/babel/babel/pull/16312) Fix class private properties when `privateFieldsAsSymbols` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-helper-create-class-features-plugin`, `babel-plugin-transform-private-methods`
  * [#16307](https://github.com/babel/babel/pull/16307) Fix the support of `arguments` in private `get/set` method ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-helper-create-class-features-plugin`, `babel-helpers`, `babel-plugin-proposal-decorators`
  * [#16287](https://github.com/babel/babel/pull/16287) Reduce decorator static property size ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-helper-create-class-features-plugin`, `babel-plugin-proposal-decorators`
  * [#16281](https://github.com/babel/babel/pull/16281) Fix evaluation order of decorators with cached receiver ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  * [#16279](https://github.com/babel/babel/pull/16279) Fix decorator this memoization ([@JLHwung](https://github.com/JLHwung))
  * [#16266](https://github.com/babel/babel/pull/16266) Preserve `static` on decorated private `accessor` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  * [#16258](https://github.com/babel/babel/pull/16258) fix: handle decorated async private method and generator ([@JLHwung](https://github.com/JLHwung))
* `babel-helper-create-class-features-plugin`, `babel-plugin-proposal-decorators`, `babel-plugin-transform-async-generator-functions`, `babel-plugin-transform-private-methods`, `babel-plugin-transform-private-property-in-object`, `babel-plugin-transform-typescript`, `babel-preset-env`
  * [#16275](https://github.com/babel/babel/pull/16275) Fix class private properties when `privateFieldsAsProperties` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-helpers`
  * [#16268](https://github.com/babel/babel/pull/16268) Do not consider `arguments` in a helper as a global reference ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helpers`, `babel-plugin-proposal-decorators`
  * [#16270](https://github.com/babel/babel/pull/16270) Handle symbol key class elements decoration ([@JLHwung](https://github.com/JLHwung))
  * [#16265](https://github.com/babel/babel/pull/16265) Do not define `access.get` for public setter decorators ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :nail_care: Polish
* `babel-core`, `babel-helper-create-class-features-plugin`, `babel-preset-env`
  * [#12428](https://github.com/babel/babel/pull/12428) Suggest using `BABEL_SHOW_CONFIG_FOR` for config problems ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* `babel-helper-transform-fixture-test-runner`
  * [#16278](https://github.com/babel/babel/pull/16278) Continue writing `output.js` when `exec.js` throws ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :microscope: Output optimization
* `babel-helper-create-class-features-plugin`, `babel-plugin-proposal-decorators`
  * [#16306](https://github.com/babel/babel/pull/16306) Avoid intermediate functions for private accessors with decs ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-create-class-features-plugin`, `babel-helpers`, `babel-plugin-proposal-decorators`, `babel-plugin-proposal-pipeline-operator`, `babel-plugin-transform-class-properties`
  * [#16294](https://github.com/babel/babel/pull/16294) More aggressively inline decorators in the static block ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-create-class-features-plugin`, `babel-helpers`, `babel-plugin-transform-private-methods`
  * [#16283](https://github.com/babel/babel/pull/16283) Do not use `classPrivateMethodGet` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-helper-create-class-features-plugin`, `babel-helpers`, `babel-plugin-proposal-decorators`
  * [#16287](https://github.com/babel/babel/pull/16287) Reduce decorator static property size ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-helper-create-class-features-plugin`, `babel-plugin-proposal-decorators`, `babel-plugin-transform-class-properties`
  * [#16280](https://github.com/babel/babel/pull/16280) Reduce element decorator temp variables ([@JLHwung](https://github.com/JLHwung))
* `babel-helper-create-class-features-plugin`, `babel-helper-fixtures`, `babel-helpers`, `babel-plugin-bugfix-v8-spread-parameters-in-optional-chaining`, `babel-plugin-proposal-decorators`, `babel-plugin-proposal-destructuring-private`, `babel-plugin-proposal-optional-chaining-assign`, `babel-plugin-transform-class-properties`, `babel-plugin-transform-class-static-block`, `babel-plugin-transform-private-methods`, `babel-plugin-transform-private-property-in-object`, `babel-preset-env`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`
  * [#16261](https://github.com/babel/babel/pull/16261) Do not use descriptors for private class elements ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helpers`, `babel-plugin-proposal-decorators`
  * [#16263](https://github.com/babel/babel/pull/16263) Reduce helper size for decorator 2023-11 ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v7.23.10 (2024-01-31)

#### :bug: Bug Fix
* Other
  * [#16240](https://github.com/babel/babel/pull/16240) [eslint] Include field decorators in scope analysis ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-create-class-features-plugin`, `babel-plugin-proposal-decorators`
  * [#16235](https://github.com/babel/babel/pull/16235) Fix `protoInit` call injection timing ([@JLHwung](https://github.com/JLHwung))
## v7.23.9 (2024-01-25)

#### :bug: Bug Fix
* `babel-helper-transform-fixture-test-runner`, `babel-plugin-transform-function-name`, `babel-plugin-transform-modules-systemjs`, `babel-preset-env`
  * [#16225](https://github.com/babel/babel/pull/16225) fix: `systemjs` re-traverses helpers ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-helper-create-class-features-plugin`, `babel-plugin-proposal-decorators`
  * [#16226](https://github.com/babel/babel/pull/16226) Improve decorated private method check ([@JLHwung](https://github.com/JLHwung))
* `babel-plugin-proposal-decorators`, `babel-plugin-transform-async-generator-functions`, `babel-plugin-transform-runtime`, `babel-preset-env`
  * [#16224](https://github.com/babel/babel/pull/16224) Properly sort `core-js@3` imports ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-traverse`
  * [#15383](https://github.com/babel/babel/pull/15383) fix: Don't throw in `getTypeAnnotation` when using TS+inference ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* Other
  * [#16210](https://github.com/babel/babel/pull/16210) [eslint] Fix `no-use-before-define` for class ref in fields ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* `babel-core`, `babel-parser`, `babel-template`
  * [#16222](https://github.com/babel/babel/pull/16222) Migrate `eslint-parser` to cts ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-types`
  * [#16213](https://github.com/babel/babel/pull/16213) Remove `@babel/types` props that are not produced by the parser ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :running_woman: Performance
* `babel-parser`
  * [#16072](https://github.com/babel/babel/pull/16072) perf: Improve parser performance for typescript ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :microscope: Output optimization
* `babel-helper-create-class-features-plugin`, `babel-plugin-proposal-decorators`, `babel-plugin-proposal-destructuring-private`, `babel-plugin-proposal-pipeline-operator`, `babel-plugin-transform-class-properties`, `babel-plugin-transform-class-static-block`, `babel-plugin-transform-new-target`, `babel-plugin-transform-parameters`, `babel-plugin-transform-private-methods`, `babel-preset-env`
  * [#16218](https://github.com/babel/babel/pull/16218) Improve temporary variables for decorators ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-helpers`, `babel-plugin-proposal-explicit-resource-management`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`
  * [#15959](https://github.com/babel/babel/pull/15959) Improve output of `using` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v7.23.8 (2024-01-08)

#### :bug: Bug Fix
* `babel-preset-env`
  * [#16181](https://github.com/babel/babel/pull/16181) fix: `preset-env` throws exception for `export * as x` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-helpers`, `babel-plugin-proposal-decorators`
  * [#16201](https://github.com/babel/babel/pull/16201) fix: decorator binds `getter/setter` to `ctx.access` for public fields ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
  * [#16199](https://github.com/babel/babel/pull/16199) fix: Class decorator correctly passes return value ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :leftwards_arrow_with_hook: Revert
* [#16202](https://github.com/babel/babel/pull/16202) Revert "chore: Update artifact tools (#16184)" ([@JLHwung](https://github.com/JLHwung))

#### :microscope: Output optimization
* `babel-helpers`, `babel-plugin-proposal-decorators`, `babel-plugin-transform-class-properties`, `babel-plugin-transform-classes`, `babel-plugin-transform-function-name`, `babel-plugin-transform-parameters`, `babel-plugin-transform-react-jsx`, `babel-plugin-transform-runtime`, `babel-plugin-transform-spread`, `babel-plugin-transform-typescript`, `babel-preset-env`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`
  * [#16194](https://github.com/babel/babel/pull/16194) Improve output of `super()` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v7.23.7 (2023-12-29)

#### :bug: Bug Fix
* `babel-traverse`
  * [#16191](https://github.com/babel/babel/pull/16191) fix: Crash when removing without `Program` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-helpers`, `babel-plugin-proposal-decorators`
  * [#16180](https://github.com/babel/babel/pull/16180) fix: Class decorator `ctx.kind` is wrong ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-plugin-proposal-decorators`
  * [#16170](https://github.com/babel/babel/pull/16170) Fix decorator initProto usage in derived classes ([@JLHwung](https://github.com/JLHwung))
* `babel-core`
  * [#16167](https://github.com/babel/babel/pull/16167) Avoid unpreventable `unhandledRejection` events ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* `babel-helper-create-class-features-plugin`
  * [#16186](https://github.com/babel/babel/pull/16186) chore: Update deps ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-helper-create-class-features-plugin`, `babel-plugin-proposal-decorators`
  * [#16177](https://github.com/babel/babel/pull/16177) Merge decorators into class features ([@JLHwung](https://github.com/JLHwung))
## v7.23.6 (2023-12-11)

#### :eyeglasses: Spec Compliance
* `babel-generator`, `babel-parser`, `babel-types`
  * [#16154](https://github.com/babel/babel/pull/16154) Remove `TSPropertySignature.initializer` ([@fisker](https://github.com/fisker))
* `babel-helpers`, `babel-plugin-proposal-decorators`, `babel-plugin-transform-class-properties`, `babel-plugin-transform-class-static-block`, `babel-plugin-transform-runtime`, `babel-preset-env`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`, `babel-types`
  * [#16139](https://github.com/babel/babel/pull/16139) Apply `toPropertyKey` on decorator context name ([@JLHwung](https://github.com/JLHwung))

#### :bug: Bug Fix
* `babel-generator`
  * [#16166](https://github.com/babel/babel/pull/16166) fix: Correctly indenting when `retainLines` is enabled ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-helpers`, `babel-plugin-proposal-explicit-resource-management`
  * [#16150](https://github.com/babel/babel/pull/16150) `using`: Allow looking up `Symbol.dispose` on a function ([@odinho](https://github.com/odinho))
* `babel-plugin-proposal-decorators`, `babel-plugin-transform-class-properties`
  * [#16161](https://github.com/babel/babel/pull/16161) Ensure the `[[@@toPrimitive]]` call of a decorated class member key is invoked once ([@JLHwung](https://github.com/JLHwung))
  * [#16148](https://github.com/babel/babel/pull/16148) Support named evaluation for decorated anonymous class exp ([@JLHwung](https://github.com/JLHwung))
* `babel-plugin-transform-for-of`, `babel-preset-env`
  * [#16011](https://github.com/babel/babel/pull/16011) fix: `for of` with `iterableIsArray` and shadowing variable  ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-helpers`, `babel-plugin-proposal-decorators`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`
  * [#16144](https://github.com/babel/babel/pull/16144) Set function name for decorated private non-field elements ([@JLHwung](https://github.com/JLHwung))
* `babel-plugin-transform-typescript`
  * [#16137](https://github.com/babel/babel/pull/16137) Fix references to enum values with merging ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :microscope: Output optimization
* `babel-helper-create-class-features-plugin`, `babel-plugin-transform-class-properties`
  * [#16159](https://github.com/babel/babel/pull/16159) Reuse computed key memoiser ([@JLHwung](https://github.com/JLHwung))
* `babel-helpers`, `babel-plugin-proposal-decorators`
  * [#16160](https://github.com/babel/babel/pull/16160) Optimize decorator helper size ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v7.23.5 (2023-11-29)

#### :eyeglasses: Spec Compliance
* `babel-plugin-proposal-decorators`
  * [#16138](https://github.com/babel/babel/pull/16138) Class binding is in TDZ during decorators initialization ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helpers`, `babel-plugin-proposal-decorators`
  * [#16132](https://github.com/babel/babel/pull/16132) Allow addInitializer in field decorator context ([@JLHwung](https://github.com/JLHwung))

#### :bug: Bug Fix
* `babel-traverse`, `babel-types`
  * [#16131](https://github.com/babel/babel/pull/16131) Do not remove bindings when removing assignment expression path ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-plugin-transform-classes`
  * [#16135](https://github.com/babel/babel/pull/16135) Require class properties transform when compiling class with private fields ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-generator`
  * [#16122](https://github.com/babel/babel/pull/16122) fix: Missing parentheses after line break ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-helpers`
  * [#16130](https://github.com/babel/babel/pull/16130) Fix helpers internal fns names conflict resolution  ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-create-class-features-plugin`, `babel-plugin-transform-class-properties`, `babel-plugin-transform-typescript`
  * [#16123](https://github.com/babel/babel/pull/16123) Simplify class fields injetion after `super()` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-generator`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-parameters`, `babel-plugin-transform-typescript`, `babel-traverse`
  * [#16110](https://github.com/babel/babel/pull/16110) fix: Unexpected duplication of comments ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-eslint-plugin`
  * [#16023](https://github.com/babel/babel/pull/16023) Add `@babel/eslint-plugin/no-undef` to fix `no-undef` with accessor props ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :microscope: Output optimization
* `babel-helpers`
  * [#16129](https://github.com/babel/babel/pull/16129) Optimize `decorator` helper size ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v7.23.4 (2023-11-20)

#### :bug: Bug Fix
* `babel-generator`
  * [#16104](https://github.com/babel/babel/pull/16104) fix: Pure comments missing parentheses ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v7.23.3 (2023-11-09)

#### :bug: Bug Fix
* `babel-plugin-transform-typescript`
  * [#16071](https://github.com/babel/babel/pull/16071) Strip type-only TS namespaces ([@colinaaa](https://github.com/colinaaa))
* `babel-generator`
  * [#16078](https://github.com/babel/babel/pull/16078) Fix indentation when generating comments with `concise: true` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-compat-data`, `babel-plugin-bugfix-v8-static-class-fields-redefine-readonly`, `babel-preset-env`
  * [#14295](https://github.com/babel/babel/pull/14295) Add a bugfix plugin for https://crbug.com/v8/12421 ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-plugin-transform-object-super`
  * [#15948](https://github.com/babel/babel/pull/15948) fix: `super.x` in a loop ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-helper-module-transforms`, `babel-plugin-transform-modules-amd`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-modules-umd`
  * [#16015](https://github.com/babel/babel/pull/16015) fix: handle `__proto__` exports name in CJS/AMD/UMD ([@magic-akari](https://github.com/magic-akari))

#### :memo: Documentation
* [#16044](https://github.com/babel/babel/pull/16044) docs: Update links in @babel/eslint-parser README ([@aryehb](https://github.com/aryehb))

#### :house: Internal
* `babel-core`, `babel-preset-env`
  * [#15988](https://github.com/babel/babel/pull/15988) Refactor handling of modules plugins in `preset-env` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :running_woman: Performance
* `babel-generator`
  * [#16061](https://github.com/babel/babel/pull/16061) perf: Improve `@babel/generator` performance ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-traverse`
  * [#16060](https://github.com/babel/babel/pull/16060) Avoid dynamic dispatch when calling wrapCheck ([@yepitschunked](https://github.com/yepitschunked))

#### :microscope: Output optimization
* `babel-plugin-transform-computed-properties`
  * [#6652](https://github.com/babel/babel/pull/6652) Optimize computed properties output (byte-wise) ([@Andarist](https://github.com/Andarist))
## v7.23.2 (2023-10-11)

#### :bug: Bug Fix
* `babel-traverse`
  * [#16033](https://github.com/babel/babel/pull/16033) Only evaluate own String/Number/Math methods ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-preset-typescript`
  * [#16022](https://github.com/babel/babel/pull/16022) Rewrite `.tsx` extension when using `rewriteImportExtensions` ([@jimmydief](https://github.com/jimmydief))
* `babel-helpers`
  * [#16017](https://github.com/babel/babel/pull/16017) Fix: fallback to typeof when toString is applied to incompatible object ([@JLHwung](https://github.com/JLHwung))
* `babel-helpers`, `babel-plugin-transform-modules-commonjs`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`
  * [#16025](https://github.com/babel/babel/pull/16025) Avoid override mistake in namespace imports ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.23.0 (2023-09-25)

#### :rocket: New Feature
* `babel-plugin-proposal-import-wasm-source`, `babel-plugin-syntax-import-source`, `babel-plugin-transform-dynamic-import`
  * [#15870](https://github.com/babel/babel/pull/15870) Support transforming `import source` for wasm ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-module-transforms`, `babel-helpers`, `babel-plugin-proposal-import-defer`, `babel-plugin-syntax-import-defer`, `babel-plugin-transform-modules-commonjs`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`, `babel-standalone`
  * [#15878](https://github.com/babel/babel/pull/15878) Implement `import defer` proposal transform support ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-generator`, `babel-parser`, `babel-types`
  * [#15845](https://github.com/babel/babel/pull/15845) Implement `import defer` parsing support ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  * [#15829](https://github.com/babel/babel/pull/15829) Add parsing support for the "source phase imports" proposal ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-generator`, `babel-helper-module-transforms`, `babel-parser`, `babel-plugin-transform-dynamic-import`, `babel-plugin-transform-modules-amd`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-modules-systemjs`, `babel-traverse`, `babel-types`
  * [#15682](https://github.com/babel/babel/pull/15682) Add `createImportExpressions` parser option ([@JLHwung](https://github.com/JLHwung))
* `babel-standalone`
  * [#15671](https://github.com/babel/babel/pull/15671) Pass through nonce to the transformed script element ([@JLHwung](https://github.com/JLHwung))
* `babel-helper-function-name`, `babel-helper-member-expression-to-functions`, `babel-helpers`, `babel-parser`, `babel-plugin-proposal-destructuring-private`, `babel-plugin-proposal-optional-chaining-assign`, `babel-plugin-syntax-optional-chaining-assign`, `babel-plugin-transform-destructuring`, `babel-plugin-transform-optional-chaining`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`, `babel-standalone`, `babel-types`
  * [#15751](https://github.com/babel/babel/pull/15751) Add support for optional chain in assignments ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helpers`, `babel-plugin-proposal-decorators`
  * [#15895](https://github.com/babel/babel/pull/15895) Implement the "decorator metadata" proposal ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-traverse`, `babel-types`
  * [#15893](https://github.com/babel/babel/pull/15893) Add `t.buildUndefinedNode` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-preset-typescript`
  * [#15913](https://github.com/babel/babel/pull/15913) Add `rewriteImportExtensions` option to TS preset ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-parser`
  * [#15896](https://github.com/babel/babel/pull/15896) Allow TS tuples to have both labeled and unlabeled elements ([@yukukotani](https://github.com/yukukotani))

#### :bug: Bug Fix
* `babel-plugin-transform-block-scoping`
  * [#15962](https://github.com/babel/babel/pull/15962) fix: `transform-block-scoping` captures the variables of the method in the loop ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :nail_care: Polish
* `babel-traverse`
  * [#15797](https://github.com/babel/babel/pull/15797) Expand evaluation of global built-ins in `@babel/traverse` ([@lorenzoferre](https://github.com/lorenzoferre))
* `babel-plugin-proposal-explicit-resource-management`
  * [#15985](https://github.com/babel/babel/pull/15985) Improve source maps for blocks with `using` declarations ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :microscope: Output optimization
* `babel-core`, `babel-helper-module-transforms`, `babel-plugin-transform-async-to-generator`, `babel-plugin-transform-classes`, `babel-plugin-transform-dynamic-import`, `babel-plugin-transform-function-name`, `babel-plugin-transform-modules-amd`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-modules-umd`, `babel-plugin-transform-parameters`, `babel-plugin-transform-react-constant-elements`, `babel-plugin-transform-react-inline-elements`, `babel-plugin-transform-runtime`, `babel-plugin-transform-typescript`, `babel-preset-env`
  * [#15984](https://github.com/babel/babel/pull/15984) Inline `exports.XXX =` update in simple variable declarations ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.22.20 (2023-09-16)

#### :house: Internal
* `babel-helper-validator-identifier`
  * [#15973](https://github.com/babel/babel/pull/15973) Remove special-casing of U+200C and U+200D ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-plugin-transform-dotall-regex`
  * [#15974](https://github.com/babel/babel/pull/15974) Update Unicode test fixtures ([@JLHwung](https://github.com/JLHwung))

#### :leftwards_arrow_with_hook: Revert
* `babel-helper-remap-async-to-generator`, `babel-helper-wrap-function`, `babel-plugin-proposal-explicit-resource-management`, `babel-plugin-proposal-function-sent`, `babel-plugin-transform-async-generator-functions`, `babel-plugin-transform-async-to-generator`, `babel-plugin-transform-block-scoping`, `babel-plugin-transform-class-properties`, `babel-plugin-transform-classes`, `babel-plugin-transform-parameters`, `babel-plugin-transform-runtime`, `babel-preset-env`
  * [#15979](https://github.com/babel/babel/pull/15979) Revert "Improve output when wrapping functions" ([@jjonescz](https://github.com/jjonescz))

## v7.22.18 (2023-09-14)

#### :bug: Bug Fix
* `babel-helper-validator-identifier`
  * [#15957](https://github.com/babel/babel/pull/15957) Update identifier name definitions to Unicode 15.1 ([@JLHwung](https://github.com/JLHwung))
* `babel-helper-module-transforms`, `babel-plugin-transform-modules-amd`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-modules-umd`
  * [#15898](https://github.com/babel/babel/pull/15898) Fix transform of named import with shadowed namespace import ([@dhlolo](https://github.com/dhlolo))

#### :leftwards_arrow_with_hook: Revert
* [#15965](https://github.com/babel/babel/pull/15965) Revert Node.js 20.6.0 bug workaround ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

## v7.22.17 (2023-09-08)

#### :bug: Bug Fix
* `babel-core`
  * [#15947](https://github.com/babel/babel/pull/15947) Fix compatibility with Node.js 20.6 ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-module-transforms`, `babel-plugin-transform-modules-commonjs`
  * [#15941](https://github.com/babel/babel/pull/15941) Fix compiling duplicate ns imports to lazy CommonJS ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-types`
  * [#15920](https://github.com/babel/babel/pull/15920) Make `ClassDeclaration["id"]` optional in babel-types ([@jordanbtucker](https://github.com/jordanbtucker))

#### :microscope: Output optimization
* `babel-helper-remap-async-to-generator`, `babel-helper-wrap-function`, `babel-plugin-proposal-explicit-resource-management`, `babel-plugin-proposal-function-sent`, `babel-plugin-transform-async-generator-functions`, `babel-plugin-transform-async-to-generator`, `babel-plugin-transform-block-scoping`, `babel-plugin-transform-class-properties`, `babel-plugin-transform-classes`, `babel-plugin-transform-parameters`, `babel-plugin-transform-runtime`, `babel-preset-env`
  * [#15922](https://github.com/babel/babel/pull/15922) Improve output when wrapping functions (e.g. `async` functions) ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v7.22.16 (2023-09-06)

#### :bug: Bug Fix
* `babel-parser`
  * [#15935](https://github.com/babel/babel/pull/15935) fix: `__esModule` is missing from published `@babel/parser` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :house: Internal
* `babel-traverse`
  * [#15936](https://github.com/babel/babel/pull/15936) Skip deprecation warning tests when in a folder named `@babel` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.22.15 (2023-09-04)

#### :bug: Bug Fix
* `babel-core`
  * [#15923](https://github.com/babel/babel/pull/15923) Only perform config loading re-entrancy check for cjs ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* `babel-cli`, `babel-core`, `babel-generator`, `babel-helper-builder-binary-assignment-operator-visitor`, `babel-helper-compilation-targets`, `babel-helper-create-class-features-plugin`, `babel-helper-create-regexp-features-plugin`, `babel-helper-member-expression-to-functions`, `babel-helper-module-imports`, `babel-helper-module-transforms`, `babel-helper-transform-fixture-test-runner`, `babel-helper-validator-identifier`, `babel-helper-validator-option`, `babel-helpers`, `babel-node`, `babel-parser`, `babel-plugin-bugfix-safari-id-destructuring-collision-in-function-expression`, `babel-plugin-bugfix-v8-spread-parameters-in-optional-chaining`, `babel-plugin-proposal-decorators`, `babel-plugin-proposal-destructuring-private`, `babel-plugin-proposal-pipeline-operator`, `babel-plugin-transform-async-generator-functions`, `babel-plugin-transform-block-scoping`, `babel-plugin-transform-classes`, `babel-plugin-transform-destructuring`, `babel-plugin-transform-for-of`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-object-rest-spread`, `babel-plugin-transform-optional-chaining`, `babel-plugin-transform-parameters`, `babel-plugin-transform-property-mutators`, `babel-plugin-transform-react-jsx`, `babel-plugin-transform-runtime`, `babel-plugin-transform-typescript`, `babel-preset-env`, `babel-preset-flow`, `babel-preset-react`, `babel-preset-typescript`, `babel-register`, `babel-standalone`, `babel-template`, `babel-traverse`, `babel-types`
  * [#15892](https://github.com/babel/babel/pull/15892) Add explicit `.ts`/`.js` extension to all imports in `src` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.22.14 (2023-08-30)

#### :bug: Bug Fix
* `babel-preset-env`
  * [#15907](https://github.com/babel/babel/pull/15907) Avoid dynamic require call in preset-env ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* `babel-parser`
  * [#15884](https://github.com/babel/babel/pull/15884) Simplify parser errors creation ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-core`, `babel-helper-compilation-targets`, `babel-helper-simple-access`, `babel-parser`, `babel-plugin-syntax-decorators`, `babel-preset-env`, `babel-preset-flow`, `babel-preset-react`, `babel-preset-typescript`, `babel-traverse`, `babel-types`
  * [#15902](https://github.com/babel/babel/pull/15902) extract more test helpers to repo-utils ([@JLHwung](https://github.com/JLHwung))
## v7.22.13 (2023-08-28)

#### :house: Internal
* `babel-helper-fixtures`, `babel-plugin-proposal-function-bind`, `babel-plugin-transform-modules-commonjs`, `babel-preset-env`
  * [#15890](https://github.com/babel/babel/pull/15890) Improve helper-fixtures ([@JLHwung](https://github.com/JLHwung))

#### :leftwards_arrow_with_hook: Revert
* `babel-parser`
  * [#15901](https://github.com/babel/babel/pull/15901) Revert "Do not record trailing comma pos when `maybeAsyncArrow: false`" ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.22.12 (2023-08-25)

#### :bug: Bug Fix
* `babel-plugin-transform-optional-chaining`
  * [#15888](https://github.com/babel/babel/pull/15888) Fix optional chain optimization in sequence expression ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.22.11 (2023-08-24)

#### :bug: Bug Fix
* `babel-plugin-transform-typescript`
  * [#15882](https://github.com/babel/babel/pull/15882) Fix: fully remove TS nested type-only exported namespaces ([@yangguansen](https://github.com/yangguansen))
* `babel-types`
  * [#15867](https://github.com/babel/babel/pull/15867) fix: definition of TS function type params ([@danez](https://github.com/danez))
* `babel-plugin-transform-async-generator-functions`, `babel-plugin-transform-class-static-block`, `babel-plugin-transform-dynamic-import`, `babel-plugin-transform-export-namespace-from`, `babel-plugin-transform-json-strings`, `babel-plugin-transform-logical-assignment-operators`, `babel-plugin-transform-nullish-coalescing-operator`, `babel-plugin-transform-numeric-separator`, `babel-plugin-transform-object-rest-spread`, `babel-plugin-transform-optional-catch-binding`, `babel-plugin-transform-optional-chaining`, `babel-plugin-transform-private-property-in-object`
  * [#15858](https://github.com/babel/babel/pull/15858) fix(standalone): strip archived syntax plugins ([@JLHwung](https://github.com/JLHwung))
* `babel-core`
  * [#15850](https://github.com/babel/babel/pull/15850) Support configuring cache in ESM configs ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* `babel-parser`
  * [#10940](https://github.com/babel/babel/pull/10940) Do not record trailing comma pos when `maybeAsyncArrow: false` ([@JLHwung](https://github.com/JLHwung))
* `babel-core`, `babel-helper-compilation-targets`, `babel-parser`, `babel-plugin-proposal-destructuring-private`, `babel-plugin-syntax-decorators`, `babel-preset-env`, `babel-preset-react`, `babel-register`, `babel-traverse`, `babel-types`
  * [#15872](https://github.com/babel/babel/pull/15872) enable jest/no-standalone-expect ([@JLHwung](https://github.com/JLHwung))
* `babel-core`, `babel-helpers`, `babel-plugin-transform-async-generator-functions`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-regenerator`, `babel-preset-env`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`
  * [#15833](https://github.com/babel/babel/pull/15833) bump json5, terser and webpack, further minimize babel helpers ([@JLHwung](https://github.com/JLHwung))
* Other
  * [#15846](https://github.com/babel/babel/pull/15846) Use Babel 8.0 alpha to build babel ([@JLHwung](https://github.com/JLHwung))
  * [#15856](https://github.com/babel/babel/pull/15856) Exclude redundant files from publish process ([@JLHwung](https://github.com/JLHwung))

#### :microscope: Output optimization
* `babel-plugin-bugfix-v8-spread-parameters-in-optional-chaining`, `babel-plugin-transform-class-properties`, `babel-plugin-transform-classes`, `babel-plugin-transform-optional-chaining`, `babel-preset-env`
  * [#15871](https://github.com/babel/babel/pull/15871) Simplify `?.` output when chain result is ignored ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.22.10 (2023-08-07)

#### :bug: Bug Fix
* `babel-plugin-transform-typescript`
  * [#15799](https://github.com/babel/babel/pull/15799) [ts] Strip type-only namespaces ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  * [#15798](https://github.com/babel/babel/pull/15798) [ts] Fix compiling extended exported nested namespace ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-create-class-features-plugin`, `babel-plugin-proposal-decorators`, `babel-plugin-proposal-destructuring-private`, `babel-plugin-transform-class-properties`, `babel-plugin-transform-class-static-block`, `babel-plugin-transform-new-target`, `babel-plugin-transform-private-methods`, `babel-preset-env`
  * [#15701](https://github.com/babel/babel/pull/15701) Memoize class binding when compiling private methods and static elements ([@JLHwung](https://github.com/JLHwung))

#### :nail_care: Polish
* `babel-cli`
  * [#15824](https://github.com/babel/babel/pull/15824) Add `meta` object to `@babel/eslint-plugin` ([@JLHwung](https://github.com/JLHwung))
* `babel-traverse`, `babel-types`
  * [#15661](https://github.com/babel/babel/pull/15661) Improve the type definition of `path.isX` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-generator`, `babel-types`
  * [#15776](https://github.com/babel/babel/pull/15776) improve SourceLocation typing ([@JLHwung](https://github.com/JLHwung))

#### :house: Internal
* Other
  * [#15818](https://github.com/babel/babel/pull/15818) build: generate flow typings in prepublish job ([@JLHwung](https://github.com/JLHwung))
  * [#15777](https://github.com/babel/babel/pull/15777) chore: bump dev dependencies and remove .eslintignore ([@JLHwung](https://github.com/JLHwung))
* `babel-cli`, `babel-core`, `babel-generator`, `babel-helper-builder-react-jsx`, `babel-preset-env`, `babel-standalone`
  * [#15794](https://github.com/babel/babel/pull/15794) Enable `@typescript-eslint/no-redundant-type-constituents` rule ([@JLHwung](https://github.com/JLHwung))
* `babel-helper-compilation-targets`
  * [#15811](https://github.com/babel/babel/pull/15811) Remove `@babel/core` peerDep from `helper-compilation-targets` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-parser`
  * [#15793](https://github.com/babel/babel/pull/15793) Use const enum in babel-parser ([@JLHwung](https://github.com/JLHwung))
* `babel-plugin-transform-runtime`, `babel-traverse`, `babel-types`
  * [#15716](https://github.com/babel/babel/pull/15716) chore: Use `typescript-eslint@v6` with reworked configs ([@JoshuaKGoldberg](https://github.com/JoshuaKGoldberg))

#### :microscope: Output optimization
* `babel-plugin-transform-block-scoping`, `babel-plugin-transform-parameters`, `babel-plugin-transform-regenerator`
  * [#15746](https://github.com/babel/babel/pull/15746) Reduce `transform-block-scoping` loops output size ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v7.22.9 (2023-07-12)

#### :bug: Bug Fix
* `babel-plugin-transform-typescript`
  * [#15774](https://github.com/babel/babel/pull/15774) fix: `Infinity` in enums ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :nail_care: Polish
* `babel-generator`
  * [#15757](https://github.com/babel/babel/pull/15757) `recordAndTupleSyntaxType` defaults to `"hash"` ([@coderaiser](https://github.com/coderaiser))

#### :house: Internal
* [#15748](https://github.com/babel/babel/pull/15748) Migrate to `eslint.config.js` ([@JLHwung](https://github.com/JLHwung))
* [#15758](https://github.com/babel/babel/pull/15758) Use Prettier 3 stable ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.22.8 (2023-07-06)

#### :leftwards_arrow_with_hook: Revert
* `babel-core`, `babel-traverse`
  * [#15754](https://github.com/babel/babel/pull/15754) Revert "Use `NodePath#hub` as part of the paths cache key" ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.22.7 (2023-07-06)

#### :bug: Bug Fix
* `babel-generator`
  * [#15719](https://github.com/babel/babel/pull/15719) fix: Avoid internally generating negative source maps columns ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-core`, `babel-traverse`
  * [#15725](https://github.com/babel/babel/pull/15725) Use `NodePath#hub` as part of the paths cache key ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* Other
  * [#15747](https://github.com/babel/babel/pull/15747) fix: export `meta` from `eslint-parser/experimental-worker` ([@JLHwung](https://github.com/JLHwung))

#### :house: Internal
* `babel-core`, `babel-traverse`
  * [#15702](https://github.com/babel/babel/pull/15702) Refactor visitors merging ([@nullableVoidPtr](https://github.com/nullableVoidPtr))
## v7.22.6 (2023-07-04)

#### :bug: Bug Fix
* `babel-compat-data`, `babel-helper-compilation-targets`, `babel-preset-env`
  * [#15727](https://github.com/babel/babel/pull/15727) Add opera mobile compat data ([@JLHwung](https://github.com/JLHwung))
* `babel-plugin-transform-optional-chaining`
  * [#15739](https://github.com/babel/babel/pull/15739) Fix transform of `delete a?.b` in function params ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-split-export-declaration`, `babel-plugin-transform-modules-commonjs`
  * [#15736](https://github.com/babel/babel/pull/15736) fix: Default export for duplicate names ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-compat-data`, `babel-preset-env`
  * [#15726](https://github.com/babel/babel/pull/15726) update compat-data sources ([@JLHwung](https://github.com/JLHwung))
* `babel-helpers`, `babel-plugin-proposal-explicit-resource-management`, `babel-runtime-corejs3`, `babel-runtime`
  * [#15705](https://github.com/babel/babel/pull/15705) Fix handling of sync error in `@@asyncDispose` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-standalone`
  * [#15707](https://github.com/babel/babel/pull/15707) fix: Support transforming Explicit Resource Management in `stage-2` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-core`
  * [#15626](https://github.com/babel/babel/pull/15626) fix: Works correctly with `--frozen-intrinsics` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :house: Internal
* `babel-helper-create-class-features-plugin`, `babel-plugin-transform-classes`
  * [#15700](https://github.com/babel/babel/pull/15700) Minor class transform cleanups ([@JLHwung](https://github.com/JLHwung))

#### :microscope: Output optimization
* `babel-plugin-bugfix-v8-spread-parameters-in-optional-chaining`, `babel-plugin-transform-class-properties`, `babel-plugin-transform-optional-chaining`, `babel-plugin-transform-typescript`
  * [#15740](https://github.com/babel/babel/pull/15740) Compress output for optional chain with multiple `?.` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-plugin-proposal-destructuring-private`, `babel-plugin-proposal-do-expressions`, `babel-plugin-proposal-pipeline-operator`, `babel-plugin-transform-class-properties`, `babel-plugin-transform-nullish-coalescing-operator`, `babel-plugin-transform-optional-chaining`, `babel-plugin-transform-private-property-in-object`, `babel-traverse`
  * [#15741](https://github.com/babel/babel/pull/15741) Inject tmp vars in the params list of IIFEs when possible ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.22.5 (2023-06-08)

#### :bug: Bug Fix
* `babel-preset-env`, `babel-standalone`
  * [#15675](https://github.com/babel/babel/pull/15675) Fix using `syntax-unicode-sets-regex` in standalone ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :nail_care: Polish
* `babel-core`
  * [#15683](https://github.com/babel/babel/pull/15683) Suggest `-transform-` when resolving missing plugins ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.22.4 (2023-05-29)

#### :bug: Bug Fix
* `babel-traverse`
  * [#15649](https://github.com/babel/babel/pull/15649) Set `shorthand: false` when renaming an identifier inside an object property ([@coderaiser](https://github.com/coderaiser))

#### :house: Internal
* `babel-types`
  * [#15666](https://github.com/babel/babel/pull/15666) Add missing `attributes`/`assertions` to `VISITOR_KEYS` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-parser`
  * [#15667](https://github.com/babel/babel/pull/15667) Mark `assert` attributes with `extra.deprecatedAssertSyntax` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

## v7.22.3 (2023-05-27)

- Re-publish all the package published in 7.22.0 that hadn't been republished yet. We accidentally published them with a `package.json` file containing `"type": "script"` instead of `"type": "commonjs"` ([#15664](https://github.com/babel/babel/issues/15664)).

## v7.22.2 (2023-05-26)

#### :bug: Bug Fix
* `babel-plugin-transform-runtime`, `babel-preset-env`, `babel-runtime-corejs2`
  * [#15660](https://github.com/babel/babel/pull/15660) Fix importing symbol polyfill in `@babel/runtime-corejs2` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.22.1 (2023-05-26)

#### :bug: Bug Fix
* `babel-preset-env`
  * [#15658](https://github.com/babel/babel/pull/15658) Workaround for broken babel-preset-react-app ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.22.0 (2023-05-26)

#### :rocket: New Feature
* `babel-parser`, `babel-plugin-transform-typescript`
  * [#15497](https://github.com/babel/babel/pull/15497) [ts] Support `import ... =` and `export =` in scripts ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-compat-data`, `babel-core`, `babel-plugin-proposal-unicode-sets-regex`, `babel-plugin-transform-unicode-sets-regex`, `babel-preset-env`, `babel-standalone`
  * [#15636](https://github.com/babel/babel/pull/15636) Add `unicode-sets-regex` transform to `preset-env` ([@JLHwung](https://github.com/JLHwung))
* `babel-helpers`, `babel-plugin-proposal-explicit-resource-management`, `babel-plugin-transform-runtime`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`, `babel-standalone`
  * [#15633](https://github.com/babel/babel/pull/15633) Implement transform support for `using` declarations ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-plugin-proposal-import-attributes-to-assertions`
  * [#15620](https://github.com/babel/babel/pull/15620) Create `@babel/plugin-proposal-import-attributes-to-assertions` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-core`, `babel-generator`, `babel-parser`, `babel-plugin-syntax-import-attributes`, `babel-preset-env`, `babel-standalone`, `babel-types`
  * [#15536](https://github.com/babel/babel/pull/15536) Add support for the updated import attributes proposal ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-generator`, `babel-parser`, `babel-traverse`, `babel-types`
  * [#15520](https://github.com/babel/babel/pull/15520) Parse `await using` declarations ([@JLHwung](https://github.com/JLHwung))
* `babel-core`, `babel-helper-create-regexp-features-plugin`, `babel-parser`
  * [#15638](https://github.com/babel/babel/pull/15638) Enable regexp unicode sets parsing by default ([@JLHwung](https://github.com/JLHwung))
* `babel-helpers`, `babel-plugin-proposal-decorators`, `babel-plugin-syntax-decorators`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`
  * [#15570](https://github.com/babel/babel/pull/15570) Add decorators version `2023-05` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :nail_care: Polish
* `babel-plugin-transform-react-constant-elements`, `babel-plugin-transform-react-jsx`, `babel-traverse`, `babel-types`
  * [#15549](https://github.com/babel/babel/pull/15549) Improve type definitions for validators ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :house: Internal
* `babel-parser`
  * [#15630](https://github.com/babel/babel/pull/15630) Unify parsing of import/export modifiers (type/typeof/module) ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-compat-data`, `babel-helper-transform-fixture-test-runner`, `babel-node`, `babel-plugin-proposal-decorators`, `babel-plugin-proposal-duplicate-named-capturing-groups-regex`, `babel-plugin-transform-async-generator-functions`, `babel-plugin-transform-named-capturing-groups-regex`, `babel-plugin-transform-runtime`, `babel-preset-env`, `babel-runtime-corejs3`
  * [#15531](https://github.com/babel/babel/pull/15531) Allow polyfill providers to specify custom `@babel/runtime` pkg ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-core`, `babel-plugin-proposal-async-generator-functions`, `babel-plugin-proposal-class-properties`, `babel-plugin-proposal-class-static-block`, `babel-plugin-proposal-decorators`, `babel-plugin-proposal-dynamic-import`, `babel-plugin-proposal-export-namespace-from`, `babel-plugin-proposal-function-sent`, `babel-plugin-proposal-json-strings`, `babel-plugin-proposal-logical-assignment-operators`, `babel-plugin-proposal-nullish-coalescing-operator`, `babel-plugin-proposal-numeric-separator`, `babel-plugin-proposal-object-rest-spread`, `babel-plugin-proposal-optional-catch-binding`, `babel-plugin-proposal-optional-chaining`, `babel-plugin-proposal-pipeline-operator`, `babel-plugin-proposal-private-methods`, `babel-plugin-proposal-private-property-in-object`, `babel-plugin-proposal-unicode-property-regex`, `babel-preset-env`, `babel-standalone`
  * [#15614](https://github.com/babel/babel/pull/15614) Rename `-proposal-`s that became standard to `-transform-` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

## v7.21.9 (2023-05-22)

#### :bug: Bug Fix
* `babel-parser`
  * [#15631](https://github.com/babel/babel/pull/15631) rescan gt token at the end of type args parsing ([@JLHwung](https://github.com/JLHwung))
* `babel-generator`
  * [#15569](https://github.com/babel/babel/pull/15569) Fix indentation when `retainLines` is `true` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-template`
  * [#15534](https://github.com/babel/babel/pull/15534) fix: Template `export { x }` stuck in infinite loop ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-compat-data`, `babel-preset-env`
  * [#15606](https://github.com/babel/babel/pull/15606) fix: enable transform-block-scoping with generators feature (#12806) ([@IlyaSemenov](https://github.com/IlyaSemenov))
## v7.21.8 (2023-05-02)

#### :eyeglasses: Spec Compliance
* `babel-parser`
  * [#15602](https://github.com/babel/babel/pull/15602) Remove `using await` restriction in explicitResourceManagement ([@JLHwung](https://github.com/JLHwung))

#### :bug: Bug Fix
* `babel-helper-create-class-features-plugin`, `babel-helper-create-regexp-features-plugin`
  * [#15605](https://github.com/babel/babel/pull/15605) Fix backward compat for semver checks in class&regexp feat plugins ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

## v7.21.6 (2023-04-29)

#### :bug: Bug Fix
* `babel-compat-data`
  * [#15598](https://github.com/babel/babel/pull/15598) fix: Not found `corejs3-shipped-proposals.json` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v7.21.5 (2023-04-28)

#### :eyeglasses: Spec Compliance
* `babel-generator`, `babel-parser`, `babel-types`
  * [#15539](https://github.com/babel/babel/pull/15539) fix: Remove `mixins` and `implements` for `DeclareInterface` and `InterfaceDeclaration` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :bug: Bug Fix
* `babel-core`, `babel-generator`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-react-jsx`
  * [#15515](https://github.com/babel/babel/pull/15515) fix: `)` position with `createParenthesizedExpressions` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-preset-env`
  * [#15580](https://github.com/babel/babel/pull/15580) Add syntax import meta to preset env ([@JLHwung](https://github.com/JLHwung))

#### :nail_care: Polish
* `babel-types`
  * [#15546](https://github.com/babel/babel/pull/15546) Improve the layout of generated validators ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-core`
  * [#15535](https://github.com/babel/babel/pull/15535) Use `lt` instead of `lte` to check TS version for .cts config ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* `babel-core`
  * [#15575](https://github.com/babel/babel/pull/15575) Use synchronous `import.meta.resolve` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-fixtures`, `babel-preset-typescript`
  * [#15568](https://github.com/babel/babel/pull/15568) Handle `.overrides` and `.env` when resolving plugins/presets from fixture options ([@JLHwung](https://github.com/JLHwung))
* `babel-helper-create-class-features-plugin`, `babel-helper-create-regexp-features-plugin`
  * [#15548](https://github.com/babel/babel/pull/15548) Use `semver` package to compare versions ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.21.4 (2023-03-31)

#### :bug: Bug Fix
* `babel-core`, `babel-helper-module-imports`, `babel-preset-typescript`
  * [#15478](https://github.com/babel/babel/pull/15478) Fix support for `import/export` in `.cts` files ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-generator`
  * [#15496](https://github.com/babel/babel/pull/15496) Fix compact printing of non-null assertion operators ([@rtsao](https://github.com/rtsao))

#### :nail_care: Polish
* `babel-helper-create-class-features-plugin`, `babel-plugin-proposal-class-properties`, `babel-plugin-transform-typescript`, `babel-traverse`
  * [#15427](https://github.com/babel/babel/pull/15427) Fix moving comments of removed nodes ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* Other
  * [#15519](https://github.com/babel/babel/pull/15519) Update Prettier integration test ([@fisker](https://github.com/fisker))
* `babel-parser`
  * [#15510](https://github.com/babel/babel/pull/15510) refactor: introduce `lookaheadInLineCharCode` ([@JLHwung](https://github.com/JLHwung))
* `babel-code-frame`, `babel-highlight`
  * [#15499](https://github.com/babel/babel/pull/15499) Polish babel-code-frame highlight test ([@JLHwung](https://github.com/JLHwung))
## v7.21.3 (2023-03-14)

#### :eyeglasses: Spec Compliance
* `babel-parser`
  * [#15479](https://github.com/babel/babel/pull/15479) disallow mixins/implements in flow interface ([@JLHwung](https://github.com/JLHwung))

#### :bug: Bug Fix
* `babel-parser`
  * [#15423](https://github.com/babel/babel/pull/15423) [ts] Allow keywords in tuple labels ([@Harpica](https://github.com/Harpica))
* `babel-plugin-transform-typescript`
  * [#15489](https://github.com/babel/babel/pull/15489) Register `var` decls generated by `import ... =` TS transform ([@amoeller](https://github.com/amoeller))
  * [#15494](https://github.com/babel/babel/pull/15494) fix: Consider `export { type foo }` as type-only usage ([@magic-akari](https://github.com/magic-akari))

#### :nail_care: Polish
* `babel-traverse`, `babel-types`
  * [#15484](https://github.com/babel/babel/pull/15484) Skip node deprecation warnings when used by an old `@babel` package ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-generator`
  * [#15480](https://github.com/babel/babel/pull/15480) chore: Improve `jsonCompatibleStrings` deprecation ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :house: Internal
* [#15465](https://github.com/babel/babel/pull/15465) Add ESLint-readable package name ([@nzakas](https://github.com/nzakas))

#### :microscope: Output optimization
* `babel-plugin-transform-typescript`, `babel-preset-typescript`
  * [#15467](https://github.com/babel/babel/pull/15467) Optimize TS enums output ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v7.21.2 (2023-02-23)

#### :eyeglasses: Spec Compliance
* `babel-parser`
  * [#15439](https://github.com/babel/babel/pull/15439) fix: Throws on `new foo?.bar!()` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :nail_care: Polish
* `babel-traverse`, `babel-types`
  * [#15448](https://github.com/babel/babel/pull/15448) Reduce warnings for deprecated node aliases ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* `babel-types`
  * [#15451](https://github.com/babel/babel/pull/15451) Update babel-types docs generator ([@JLHwung](https://github.com/JLHwung))

#### :microscope: Output optimization
* `babel-helper-module-transforms`, `babel-plugin-transform-modules-commonjs`
  * [#15449](https://github.com/babel/babel/pull/15449) Avoid unnecessary code for unused lazy imports ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.21.1 (2023-02-20)

#### :bug: Bug Fix
* `babel-core`, `babel-parser`
  * [#15440](https://github.com/babel/babel/pull/15440) Fix problems found while publishing 7.21.0 ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-generator`
  * [#15445](https://github.com/babel/babel/pull/15445) fix: Handling source maps without `sourcesContent` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :house: Internal
* [#15443](https://github.com/babel/babel/pull/15443) Use native GitHub markdown `Note` admonition ([@yardenshoham](https://github.com/yardenshoham))
## v7.21.0 (2023-02-20)

#### :rocket: New Feature
* `babel-core`, `babel-helper-create-class-features-plugin`, `babel-plugin-proposal-class-properties`, `babel-plugin-proposal-private-methods`, `babel-plugin-proposal-private-property-in-object`
  * [#15435](https://github.com/babel/babel/pull/15435) feat: Implement `privateFieldsAsSymbols` assumption for classes ([@fwienber](https://github.com/fwienber))
* `babel-helper-create-regexp-features-plugin`, `babel-plugin-proposal-regexp-modifiers`, `babel-standalone`
  * [#15226](https://github.com/babel/babel/pull/15226) feat: Support regexp modifiers proposal ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-cli`, `babel-core`, `babel-generator`, `babel-plugin-transform-destructuring`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-react-jsx`, `babel-traverse`
  * [#15022](https://github.com/babel/babel/pull/15022) feat: Generate sourcemaps of friendly call frames ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-parser`, `babel-types`
  * [#15384](https://github.com/babel/babel/pull/15384) [ts] Support `const` modifier in type parameters ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-generator`, `babel-helpers`, `babel-parser`, `babel-plugin-proposal-decorators`, `babel-plugin-syntax-decorators`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`
  * [#15405](https://github.com/babel/babel/pull/15405) Implement decorators as presented at `2023-01` TC39 meeting ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-parser`
  * [#15114](https://github.com/babel/babel/pull/15114) Parser option to allow `new.target` outside functions ([@overlookmotel](https://github.com/overlookmotel))
  * [#15320](https://github.com/babel/babel/pull/15320) Add `annexb: false` parser option to disable Annex B ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-core`
  * [#15283](https://github.com/babel/babel/pull/15283) feat: Support `.cts` as configuration file ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-generator`, `babel-parser`, `babel-plugin-transform-typescript`
  * [#15381](https://github.com/babel/babel/pull/15381) [ts] Support `export type * from` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :bug: Bug Fix
* `babel-plugin-transform-typescript`
  * [#15379](https://github.com/babel/babel/pull/15379) [ts5.0] Better inlining of constants in enums ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-core`
  * [#15366](https://github.com/babel/babel/pull/15366) handling circular/shared structures in deep-clone ([@azizghuloum](https://github.com/azizghuloum))
* `babel-helper-create-class-features-plugin`, `babel-plugin-proposal-class-properties`, `babel-plugin-proposal-class-static-block`, `babel-plugin-proposal-private-methods`, `babel-plugin-transform-classes`, `babel-plugin-transform-new-target`
  * [#15406](https://github.com/babel/babel/pull/15406) Preserve class elements comments in class transform ([@JLHwung](https://github.com/JLHwung))
* `babel-parser`, `babel-plugin-transform-flow-comments`, `babel-plugin-transform-flow-strip-types`, `babel-types`
  * [#15414](https://github.com/babel/babel/pull/15414) [ts] Fix restrictions for optional parameters ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :nail_care: Polish
* `babel-parser`
  * [#15400](https://github.com/babel/babel/pull/15400) polish: improve "`await` as identifier" error in modules ([@JLHwung](https://github.com/JLHwung))

#### :house: Internal
* `babel-core`
  * [#15137](https://github.com/babel/babel/pull/15137) Improve CJS compat with ESM-based `@babel/core` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :microscope: Output optimization
* `babel-plugin-transform-typescript`
  * [#15418](https://github.com/babel/babel/pull/15418) [ts] Handle exponentiation operator in constant folding ([@ehoogeveen-medweb](https://github.com/ehoogeveen-medweb))

## v7.20.15 (2023-02-02)

#### :eyeglasses: Spec Compliance
* `babel-parser`
  * [#15391](https://github.com/babel/babel/pull/15391) Disallow await as bound name in using declaration ([@JLHwung](https://github.com/JLHwung))
* `babel-generator`, `babel-parser`, `babel-plugin-proposal-export-namespace-from`
  * [#15385](https://github.com/babel/babel/pull/15385) Disallows specifiers after export * as ns ([@JLHwung](https://github.com/JLHwung))

#### :bug: Bug Fix
* `babel-plugin-transform-block-scoping`
  * [#15398](https://github.com/babel/babel/pull/15398) fix: Loop was converted wrong ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-parser`
  * [#15377](https://github.com/babel/babel/pull/15377) fix: `new (foo?.bar)()` incorrectly throws exception `OptionalChainingNoNew` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v7.20.14 (2023-01-27)

#### :bug: Bug Fix
* `babel-plugin-transform-block-scoping`
  * [#15361](https://github.com/babel/babel/pull/15361) fix: Identifiers in the loop are not renamed ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-cli`, `babel-core`, `babel-generator`, `babel-helper-transform-fixture-test-runner`, `babel-plugin-transform-destructuring`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-react-jsx`, `babel-traverse`
  * [#15365](https://github.com/babel/babel/pull/15365) fix: Properly generate source maps for manually added multi-line content ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v7.20.13 (2023-01-21)

#### :bug: Bug Fix
* `babel-helpers`, `babel-plugin-proposal-decorators`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`
  * [#15332](https://github.com/babel/babel/pull/15332) Ensure class decorators can access decorated non-static members ([@JLHwung](https://github.com/JLHwung))
* `babel-plugin-transform-typescript`
  * [#15349](https://github.com/babel/babel/pull/15349) fix: Preserve `import {type T} from 'x'` when `onlyRemoveTypeImports:true` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
  * [#15344](https://github.com/babel/babel/pull/15344) fix: Properties that are `abstract` should not be initialized. ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-parser`
  * [#15338](https://github.com/babel/babel/pull/15338) Allow negative number in ambient const initializer ([@JLHwung](https://github.com/JLHwung))

#### :leftwards_arrow_with_hook: Revert
* `babel-plugin-transform-react-inline-elements`, `babel-plugin-transform-react-jsx-development`, `babel-plugin-transform-react-jsx`
  * [#15355](https://github.com/babel/babel/pull/15355) Reverts "Re-use common JSX element transform for <>...</>" ([@JLHwung](https://github.com/JLHwung))
## v7.20.12 (2023-01-04)

#### :bug: Bug Fix
* `babel-traverse`
  * [#15224](https://github.com/babel/babel/pull/15224) Fix `TaggedTemplateLiteral` evaluation ([@nmn](https://github.com/nmn))
* `babel-helper-create-class-features-plugin`, `babel-plugin-proposal-class-properties`
  * [#15312](https://github.com/babel/babel/pull/15312) fix: `delete this` in static class properties initialization ([@SuperSodaSea](https://github.com/SuperSodaSea))

#### :nail_care: Polish
* `babel-traverse`
  * [#15313](https://github.com/babel/babel/pull/15313) Implement support for evaluating computed properties. ([@JBYoshi](https://github.com/JBYoshi))
## v7.20.11 (2022-12-23)

#### :eyeglasses: Spec Compliance
* `babel-helper-module-transforms`, `babel-plugin-proposal-dynamic-import`, `babel-plugin-transform-modules-amd`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-modules-systemjs`
  * [#15290](https://github.com/babel/babel/pull/15290) Return rejected promise when stringify import specifier throws ([@SuperSodaSea](https://github.com/SuperSodaSea))

#### :bug: Bug Fix
* `babel-plugin-transform-block-scoping`
  * [#15309](https://github.com/babel/babel/pull/15309) Fix for binding shadowing outer var with loop closure ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.20.10 (2022-12-23)

#### :bug: Bug Fix
* `babel-traverse`
  * [#15305](https://github.com/babel/babel/pull/15305) fix: `guessExecutionStatusRelativeTo` exception ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v7.20.9 (2022-12-23)

#### :bug: Bug Fix
* `babel-plugin-transform-block-scoping`
  * [#15303](https://github.com/babel/babel/pull/15303) fix: Do not throw exceptions when scope information is corrupted ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v7.20.8 (2022-12-22)

#### :bug: Bug Fix
* `babel-plugin-transform-block-scoping`
  * [#15301](https://github.com/babel/babel/pull/15301) fix: `transform-block-scoping` accesses properties of `null` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-plugin-proposal-class-properties`, `babel-traverse`
  * [#15294](https://github.com/babel/babel/pull/15294) Properly transpile exported classes that shadowed builtins ([@JLHwung](https://github.com/JLHwung))
## v7.20.7 (2022-12-22)

#### :eyeglasses: Spec Compliance
* `babel-helper-member-expression-to-functions`, `babel-helper-replace-supers`, `babel-plugin-proposal-class-properties`, `babel-plugin-transform-classes`
  * [#15223](https://github.com/babel/babel/pull/15223) fix: Deleting super property should throw ([@SuperSodaSea](https://github.com/SuperSodaSea))
* `babel-helpers`, `babel-plugin-proposal-class-properties`, `babel-plugin-transform-classes`, `babel-plugin-transform-object-super`
  * [#15241](https://github.com/babel/babel/pull/15241) fix: Throw correct error types from sed ant class TDZ helpers ([@SuperSodaSea](https://github.com/SuperSodaSea))

#### :bug: Bug Fix
* `babel-parser`, `babel-plugin-transform-typescript`
  * [#15209](https://github.com/babel/babel/pull/15209) fix: Support auto accessors with TypeScript annotations ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-traverse`
  * [#15287](https://github.com/babel/babel/pull/15287) Fix `.parentPath` after rename in `SwitchCase` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-plugin-transform-typescript`, `babel-traverse`
  * [#15284](https://github.com/babel/babel/pull/15284) fix: Ts import type and func with duplicate name ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-plugin-transform-block-scoping`
  * [#15278](https://github.com/babel/babel/pull/15278) Fix tdz analysis for reassigned captured for bindings ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-plugin-proposal-async-generator-functions`, `babel-preset-env`
  * [#15235](https://github.com/babel/babel/pull/15235) fix: Transform `for await` with shadowed variables ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-generator`, `babel-plugin-proposal-optional-chaining`
  * [#15258](https://github.com/babel/babel/pull/15258) fix: Correctly generate `(a ?? b) as T` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-plugin-transform-react-jsx`, `babel-types`
  * [#15233](https://github.com/babel/babel/pull/15233) fix: Emit correct sourcemap ranges for `JSXText` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-core`, `babel-helpers`, `babel-plugin-transform-computed-properties`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`
  * [#15232](https://github.com/babel/babel/pull/15232) fix: Computed properties should keep original definition order ([@SuperSodaSea](https://github.com/SuperSodaSea))
* `babel-helper-member-expression-to-functions`, `babel-helper-replace-supers`, `babel-plugin-proposal-class-properties`, `babel-plugin-transform-classes`
  * [#15223](https://github.com/babel/babel/pull/15223) fix: Deleting super property should throw ([@SuperSodaSea](https://github.com/SuperSodaSea))
* `babel-generator`
  * [#15216](https://github.com/babel/babel/pull/15216) fix: Print newlines for leading Comments of `TSEnumMember` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :nail_care: Polish
* `babel-plugin-transform-block-scoping`, `babel-traverse`
  * [#15275](https://github.com/babel/babel/pull/15275) Improve relative execution tracking in fn exprs ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* `babel-helper-define-map`, `babel-plugin-transform-property-mutators`
  * [#15274](https://github.com/babel/babel/pull/15274) Inline & simplify `@babel/helper-define-map` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-core`, `babel-plugin-proposal-class-properties`, `babel-plugin-transform-block-scoping`, `babel-plugin-transform-classes`, `babel-plugin-transform-destructuring`, `babel-plugin-transform-parameters`, `babel-plugin-transform-regenerator`, `babel-plugin-transform-runtime`, `babel-preset-env`, `babel-traverse`
  * [#15200](https://github.com/babel/babel/pull/15200) Rewrite `transform-block-scoping` plugin ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :running_woman: Performance
* `babel-helper-compilation-targets`
  * [#15228](https://github.com/babel/babel/pull/15228) perf: Speed up `getTargets` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v7.20.6 (2022-11-28)

#### :bug: Bug Fix
* `babel-helpers`
  * [#15231](https://github.com/babel/babel/pull/15231) Update `checkInRHS` helper min version ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.20.5 (2022-11-28)

#### :eyeglasses: Spec Compliance
* `babel-helpers`, `babel-plugin-transform-destructuring`, `babel-plugin-transform-modules-commonjs`, `babel-preset-env`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`, `babel-traverse`
  * [#15183](https://github.com/babel/babel/pull/15183) Improve array destructuring spec compliance ([@SuperSodaSea](https://github.com/SuperSodaSea))
* `babel-cli`, `babel-helpers`, `babel-plugin-proposal-class-properties`, `babel-plugin-proposal-class-static-block`, `babel-plugin-transform-classes`, `babel-plugin-transform-runtime`, `babel-preset-env`
  * [#15182](https://github.com/babel/babel/pull/15182) fix: apply toPropertyKey when defining class members ([@JLHwung](https://github.com/JLHwung))
* `babel-helper-create-class-features-plugin`, `babel-helpers`, `babel-plugin-proposal-decorators`, `babel-plugin-proposal-private-property-in-object`, `babel-preset-env`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`
  * [#15133](https://github.com/babel/babel/pull/15133) fix: validate rhs of `in` when transpiling `#p in C` ([@JLHwung](https://github.com/JLHwung))

#### :bug: Bug Fix
* `babel-parser`
  * [#15225](https://github.com/babel/babel/pull/15225) Parse `using[foo]` as computed member expression ([@JLHwung](https://github.com/JLHwung))
  * [#15207](https://github.com/babel/babel/pull/15207) Export `ParseResult` type ([@davydof](https://github.com/davydof))
  * [#15198](https://github.com/babel/babel/pull/15198) fix: parse `import module, ...` ([@JLHwung](https://github.com/JLHwung))
* `babel-helper-wrap-function`, `babel-preset-env`, `babel-traverse`
  * [#15181](https://github.com/babel/babel/pull/15181) fix: Edge cases for async functions and `noNewArrow` assumption ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-plugin-transform-arrow-functions`, `babel-plugin-transform-parameters`, `babel-traverse`
  * [#15163](https://github.com/babel/babel/pull/15163) fix: Throw error when compiling `super()` in arrow functions with default / rest parameters ([@SuperSodaSea](https://github.com/SuperSodaSea))
* `babel-helpers`, `babel-node`, `babel-plugin-proposal-async-generator-functions`, `babel-plugin-transform-regenerator`, `babel-preset-env`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`
  * [#15194](https://github.com/babel/babel/pull/15194) fix: Bump `regenerator` and add tests ([@SuperSodaSea](https://github.com/SuperSodaSea))
* `babel-helper-create-regexp-features-plugin`
  * [#15192](https://github.com/babel/babel/pull/15192) fix: Update `regjsparser` for `@babel/standalone` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-parser`, `babel-types`
  * [#15109](https://github.com/babel/babel/pull/15109) fix: Babel 8 types ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-generator`
  * [#15143](https://github.com/babel/babel/pull/15143) Don't print inner comments as leading when wrapping in `(``)` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-plugin-transform-block-scoping`, `babel-traverse`
  * [#15167](https://github.com/babel/babel/pull/15167) Register `switch`'s `discriminant` in the outer scope ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :nail_care: Polish
* `babel-generator`
  * [#15173](https://github.com/babel/babel/pull/15173) Improve generator behavior when `comments:false` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-plugin-transform-block-scoping`
  * [#15164](https://github.com/babel/babel/pull/15164) Only extract IDs for TDZ checks in assign when necessary ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* `babel-core`, `babel-parser`
  * [#15202](https://github.com/babel/babel/pull/15202) Bump typescript to 4.9.3 ([@JLHwung](https://github.com/JLHwung))
## v7.20.4 (2022-11-08)

#### :bug: Bug Fix
* `babel-generator`
  * [#15160](https://github.com/babel/babel/pull/15160) Fix printing of comments before `=>` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-generator`, `babel-plugin-transform-typescript`
  * [#15144](https://github.com/babel/babel/pull/15144) Fallback to printing inner comments as trailing ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.20.3 (2022-11-07)

#### :bug: Bug Fix
* `babel-generator`
  * [#15135](https://github.com/babel/babel/pull/15135) Don't convert line comments containing `*/` to block comments ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-plugin-transform-parameters`
  * [#15146](https://github.com/babel/babel/pull/15146) Fix compilation of parameters in async generators ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-parser`
  * [#15134](https://github.com/babel/babel/pull/15134) fix: support await as for-of-lhs ([@JLHwung](https://github.com/JLHwung))
## v7.20.2 (2022-11-04)

#### :bug: Bug Fix
* `babel-core`, `babel-helper-create-class-features-plugin`, `babel-helper-module-transforms`, `babel-helper-plugin-utils`, `babel-helper-simple-access`, `babel-node`, `babel-plugin-transform-block-scoping`, `babel-plugin-transform-classes`, `babel-plugin-transform-react-constant-elements`, `babel-preset-env`, `babel-standalone`, `babel-types`
  * [#15124](https://github.com/babel/babel/pull/15124) fix: `@babel/node` repl and enable `no-use-before-define` rule ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-plugin-transform-typescript`
  * [#15121](https://github.com/babel/babel/pull/15121) fix: `tsSatisfiesExpression` check with different duplicated `@babel/types` versions ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-parser`
  * [#15094](https://github.com/babel/babel/pull/15094) fix: `parser` typings for plugins ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-generator`
  * [#15118](https://github.com/babel/babel/pull/15118) Improve printing of [no LineTerminator here] with comments ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-plugin-proposal-decorators`, `babel-plugin-proposal-object-rest-spread`, `babel-plugin-transform-jscript`
  * [#15113](https://github.com/babel/babel/pull/15113) fix: wrap anonymous class expression within statement ([@JLHwung](https://github.com/JLHwung))
* `babel-plugin-transform-destructuring`
  * [#15104](https://github.com/babel/babel/pull/15104) fix: Destructuring exceptions `for ( let { } = 0 ; 0 ; ) ` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v7.20.1 (2022-11-01)

#### :bug: Bug Fix
* `babel-plugin-proposal-async-generator-functions`
  * [#15103](https://github.com/babel/babel/pull/15103) fix: Compile re-declare var in `init` and `body` of `for await` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-plugin-proposal-class-properties`, `babel-traverse`
  * [#15106](https://github.com/babel/babel/pull/15106) Do not mark `in` and `instanceof` as constant expressions ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helpers`, `babel-plugin-proposal-duplicate-named-capturing-groups-regex`, `babel-plugin-transform-named-capturing-groups-regex`
  * [#15092](https://github.com/babel/babel/pull/15092) Support `indices.groups` when compiling named groups in regexps ([@ptomato](https://github.com/ptomato))
* `babel-parser`
  * [#15102](https://github.com/babel/babel/pull/15102) fix: Parse re-declare var in class static body  ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
  * [#15096](https://github.com/babel/babel/pull/15096) fix: `a satisfies b` as lval ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-helpers`, `babel-plugin-proposal-duplicate-named-capturing-groups-regex`
  * [#15090](https://github.com/babel/babel/pull/15090) Handle multiple named groups in wrapRegExp replace() ([@ptomato](https://github.com/ptomato))
* `babel-plugin-transform-async-to-generator`, `babel-plugin-transform-parameters`, `babel-preset-env`
  * [#15081](https://github.com/babel/babel/pull/15081) Move the generator body to a gen IIFE when compiling its params ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* `babel-generator`
  * [#15080](https://github.com/babel/babel/pull/15080) Automatically print inner comments ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.20.0 (2022-10-27)

#### :rocket: New Feature
* `babel-compat-data`, `babel-helper-compilation-targets`, `babel-preset-env`
  * [#14944](https://github.com/babel/babel/pull/14944) Add `deno` compilation target ([@JLHwung](https://github.com/JLHwung))
* `babel-plugin-syntax-typescript`
  * [#14923](https://github.com/babel/babel/pull/14923) Expose `dts` option in `@babel/plugin-syntax-typescript` ([@oceandrama](https://github.com/oceandrama))
* `babel-generator`, `babel-parser`, `babel-plugin-syntax-explicit-resource-management`, `babel-plugin-transform-block-scoping`, `babel-plugin-transform-destructuring`, `babel-standalone`, `babel-traverse`, `babel-types`
  * [#14968](https://github.com/babel/babel/pull/14968) Parse `using` declaration (explicit resource management) ([@JLHwung](https://github.com/JLHwung))
* `babel-generator`, `babel-parser`, `babel-plugin-syntax-import-reflection`, `babel-standalone`, `babel-types`
  * [#14926](https://github.com/babel/babel/pull/14926) Parse import reflection ([@JLHwung](https://github.com/JLHwung))
* `babel-generator`, `babel-helper-skip-transparent-expression-wrappers`, `babel-parser`, `babel-plugin-transform-typescript`, `babel-traverse`, `babel-types`
  * [#14211](https://github.com/babel/babel/pull/14211) [ts] Add support for `expr satisfies Type` expressions ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :bug: Bug Fix
* `babel-generator`, `babel-parser`
  * [#15032](https://github.com/babel/babel/pull/15032) Fix handling of comments with decorators before `export` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-generator`
  * [#15008](https://github.com/babel/babel/pull/15008) Support more inner comments ([@JLHwung](https://github.com/JLHwung))

#### :house: Internal
* `babel-helpers`, `babel-node`, `babel-plugin-proposal-async-generator-functions`, `babel-plugin-transform-regenerator`, `babel-preset-env`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`
  * [#15078](https://github.com/babel/babel/pull/15078) Update `regenerator-runtime` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.19.6 (2022-10-20)

#### :eyeglasses: Spec Compliance
* `babel-plugin-proposal-decorators`
  * [#15059](https://github.com/babel/babel/pull/15059) Ensure non-static decorators are applied when a class is instantiated. ([@JLHwung](https://github.com/JLHwung))

#### :bug: Bug Fix
* `babel-parser`
  * [#15062](https://github.com/babel/babel/pull/15062) Fix parsing of block comments nested in flow comments ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  * [#15052](https://github.com/babel/babel/pull/15052) fix: improve module block program location tracking ([@JLHwung](https://github.com/JLHwung))
* `babel-plugin-transform-runtime`, `babel-runtime-corejs2`, `babel-runtime-corejs3`
  * [#15060](https://github.com/babel/babel/pull/15060) Ensure `@babel/runtime-corejs3/core-js/*.js` can be imported on Node.js 17+ ([@JLHwung](https://github.com/JLHwung))
* `babel-preset-env`, `babel-traverse`
  * [#15043](https://github.com/babel/babel/pull/15043) fix: preserve this for `super.*` template tags ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :nail_care: Polish
* `babel-generator`, `babel-plugin-transform-flow-comments`
  * [#15037](https://github.com/babel/babel/pull/15037) Improve generation of comments without location ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :memo: Documentation
* `babel-standalone`
  * [#15055](https://github.com/babel/babel/pull/15055) Fix missing `transformSync` function name ([@lomirus](https://github.com/lomirus))

#### :house: Internal
* `babel-parser`
  * [#15056](https://github.com/babel/babel/pull/15056) Use `startLoc.index` instead of carrying around `start` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* Other
  * [#15035](https://github.com/babel/babel/pull/15035) chore: Update yarn 3.2.4 ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :running_woman: Performance
* `babel-core`, `babel-standalone`
  * [#15023](https://github.com/babel/babel/pull/15023) Don't bundle unnecessary plugins in `@babel/standalone` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.19.5 (2022-10-10)

#### :bug: Bug Fix
* `babel-generator`
  * [#15031](https://github.com/babel/babel/pull/15031) Fix "Cannot read properties of undefined" regression ([@farewell-zy](https://github.com/farewell-zy))
## v7.19.4 (2022-10-10)

#### :eyeglasses: Spec Compliance
* `babel-plugin-transform-block-scoping`
  * [#15019](https://github.com/babel/babel/pull/15019) fix: check constant violation inside loops ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helpers`, `babel-plugin-proposal-destructuring-private`, `babel-plugin-proposal-object-rest-spread`, `babel-plugin-transform-destructuring`
  * [#14985](https://github.com/babel/babel/pull/14985) Disallow rest object destructuring of null/undefined ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :bug: Bug Fix
* `babel-plugin-transform-react-jsx-development`, `babel-plugin-transform-typescript`, `babel-types`
  * [#14109](https://github.com/babel/babel/pull/14109) Fix: properly scope variables in TSModuleBlock ([@The-x-Theorist](https://github.com/The-x-Theorist))
* `babel-plugin-transform-destructuring`, `babel-plugin-transform-react-constant-elements`, `babel-traverse`
  * [#15027](https://github.com/babel/babel/pull/15027) fix: mark `var` declarations in loops as not constant ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-string-parser`, `babel-parser`, `babel-types`
  * [#14964](https://github.com/babel/babel/pull/14964) Never throw for invalid escapes in tagged templates ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-generator`, `babel-parser`
  * [#14980](https://github.com/babel/babel/pull/14980) Improve module expression parsing/printing ([@JLHwung](https://github.com/JLHwung))
* `babel-plugin-transform-destructuring`
  * [#14984](https://github.com/babel/babel/pull/14984) Fix holes handling in optimized array destructuring ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :nail_care: Polish
* `babel-cli`, `babel-core`, `babel-generator`, `babel-helper-create-class-features-plugin`, `babel-helper-fixtures`, `babel-helper-simple-access`, `babel-helper-transform-fixture-test-runner`, `babel-helpers`, `babel-plugin-bugfix-safari-id-destructuring-collision-in-function-expression`, `babel-plugin-bugfix-v8-spread-parameters-in-optional-chaining`, `babel-plugin-external-helpers`, `babel-plugin-proposal-async-do-expressions`, `babel-plugin-proposal-async-generator-functions`, `babel-plugin-proposal-class-properties`, `babel-plugin-proposal-class-static-block`, `babel-plugin-proposal-decorators`, `babel-plugin-proposal-destructuring-private`, `babel-plugin-proposal-do-expressions`, `babel-plugin-proposal-duplicate-named-capturing-groups-regex`, `babel-plugin-proposal-dynamic-import`, `babel-plugin-proposal-function-bind`, `babel-plugin-proposal-function-sent`, `babel-plugin-proposal-json-strings`, `babel-plugin-proposal-logical-assignment-operators`, `babel-plugin-proposal-nullish-coalescing-operator`, `babel-plugin-proposal-object-rest-spread`, `babel-plugin-proposal-optional-chaining`, `babel-plugin-proposal-partial-application`, `babel-plugin-proposal-pipeline-operator`, `babel-plugin-proposal-private-methods`, `babel-plugin-proposal-private-property-in-object`, `babel-plugin-proposal-record-and-tuple`, `babel-plugin-syntax-typescript`, `babel-plugin-transform-arrow-functions`, `babel-plugin-transform-async-to-generator`, `babel-plugin-transform-block-scoping`, `babel-plugin-transform-classes`, `babel-plugin-transform-computed-properties`, `babel-plugin-transform-destructuring`, `babel-plugin-transform-duplicate-keys`, `babel-plugin-transform-exponentiation-operator`, `babel-plugin-transform-flow-comments`, `babel-plugin-transform-flow-strip-types`, `babel-plugin-transform-for-of`, `babel-plugin-transform-function-name`, `babel-plugin-transform-jscript`, `babel-plugin-transform-modules-amd`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-modules-systemjs`, `babel-plugin-transform-modules-umd`, `babel-plugin-transform-new-target`, `babel-plugin-transform-object-super`, `babel-plugin-transform-parameters`, `babel-plugin-transform-proto-to-assign`, `babel-plugin-transform-react-constant-elements`, `babel-plugin-transform-react-inline-elements`, `babel-plugin-transform-react-jsx-development`, `babel-plugin-transform-react-jsx-self`, `babel-plugin-transform-react-jsx`, `babel-plugin-transform-react-pure-annotations`, `babel-plugin-transform-regenerator`, `babel-plugin-transform-runtime`, `babel-plugin-transform-shorthand-properties`, `babel-plugin-transform-spread`, `babel-plugin-transform-strict-mode`, `babel-plugin-transform-template-literals`, `babel-plugin-transform-typeof-symbol`, `babel-plugin-transform-typescript`, `babel-plugin-transform-unicode-escapes`, `babel-preset-env`, `babel-preset-react`, `babel-preset-typescript`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`, `babel-traverse`
  * [#14979](https://github.com/babel/babel/pull/14979) Improve comments generation ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-cli`, `babel-core`, `babel-generator`, `babel-helper-fixtures`, `babel-helper-transform-fixture-test-runner`, `babel-plugin-transform-destructuring`, `babel-plugin-transform-modules-commonjs`, `babel-traverse`
  * [#14967](https://github.com/babel/babel/pull/14967) Improve source map generation ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :house: Internal
* Other
  * [#15001](https://github.com/babel/babel/pull/15001) Run test262 again ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-compat-data`, `babel-preset-env`
  * [#14976](https://github.com/babel/babel/pull/14976) Internally rename `proposal-*` to `transform-*` in preset-env ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.19.3 (2022-09-27)

#### :bug: Bug Fix
* `babel-plugin-proposal-decorators`
  * [#8566](https://github.com/babel/babel/pull/8566) Correctly update bindings of decorated class declarations ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-parser`
  * [#14974](https://github.com/babel/babel/pull/14974) fix: Normal parsing of `JSXText` following `JSXSpreadChild` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
  * [#14941](https://github.com/babel/babel/pull/14941) fix: Support local exports in TS `declare module`s ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
  * [#14940](https://github.com/babel/babel/pull/14940) fix: allow ts redeclaration with `import =` and `var` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-generator`
  * [#14962](https://github.com/babel/babel/pull/14962) Fix printing of Flow internal slot functions ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-cli`
  * [#14950](https://github.com/babel/babel/pull/14950) Emit `@babel/cli` source maps based on configuration files ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-plugin-transform-typescript`
  * [#14946](https://github.com/babel/babel/pull/14946) fix: ts exported vars are shadowed by `declare` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :nail_care: Polish
* `babel-core`
  * [#14954](https://github.com/babel/babel/pull/14954) Optional filename when preset uses fn test/include/exclude ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* `babel-helper-compilation-targets`, `babel-helper-transform-fixture-test-runner`, `babel-parser`, `babel-preset-env`, `babel-traverse`
  * [#14961](https://github.com/babel/babel/pull/14961) chore: use `c8` for coverage testing ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :microscope: Output optimization
* `babel-plugin-transform-typescript`
  * [#14952](https://github.com/babel/babel/pull/14952) [ts] remove nested `declare namespace` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v7.19.2 (2022-09-15)

#### :bug: Bug Fix
* `babel-runtime-corejs2`
  * [#14937](https://github.com/babel/babel/pull/14937) fix: runtime-corejs 2 should depend on core-js@2 ([@JLHwung](https://github.com/JLHwung))
## v7.19.1 (2022-09-14)

#### :bug: Bug Fix
* `babel-core`
  * [#14930](https://github.com/babel/babel/pull/14930) Avoid fancy stack traces size computation ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-traverse`
  * [#14932](https://github.com/babel/babel/pull/14932) fix: isForAwaitStatement is broken ([@JLHwung](https://github.com/JLHwung))
* Other
  * [#14872](https://github.com/babel/babel/pull/14872) Use the built-in class fields and private methods rules in ESLint 8 ([@JLHwung](https://github.com/JLHwung))
* `babel-parser`
  * [#14920](https://github.com/babel/babel/pull/14920) [estree] attach comments after directives at the end of file ([@hegemonic](https://github.com/hegemonic))
  * [#14900](https://github.com/babel/babel/pull/14900) [ts] allow redeclaring a var/type with the same name as import ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-plugin-transform-typescript`
  * [#14913](https://github.com/babel/babel/pull/14913) fix: do not remove type import used in TS import= ([@JLHwung](https://github.com/JLHwung))
## v7.19.0 (2022-09-05)

#### :eyeglasses: Spec Compliance
* `babel-parser`
  * [#14666](https://github.com/babel/babel/pull/14666) Support private name in decorator member expression ([@JLHwung](https://github.com/JLHwung))
* `babel-helpers`, `babel-plugin-proposal-async-generator-functions`, `babel-preset-env`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`
  * [#14877](https://github.com/babel/babel/pull/14877)  Remove one promise tick in yield* (tc39/ecma262#2819)  ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :rocket: New Feature
* `babel-generator`, `babel-helpers`, `babel-parser`, `babel-plugin-proposal-decorators`, `babel-plugin-syntax-decorators`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`
  * [#14836](https://github.com/babel/babel/pull/14836) Add 2022-03 decorators version (stage 3) ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-parser`
  * [#14695](https://github.com/babel/babel/pull/14695) [parser] Make `decoratorsBeforeExport` default to `false` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-generator`, `babel-parser`
  * [#14744](https://github.com/babel/babel/pull/14744) Default to hash syntax for Record&Tuple ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-standalone`
  * [#14867](https://github.com/babel/babel/pull/14867) feat: add proposal-record-and-tuple to standalone ([@JLHwung](https://github.com/JLHwung))
* `babel-helper-create-regexp-features-plugin`, `babel-helpers`, `babel-plugin-proposal-duplicate-named-capturing-groups-regex`, `babel-plugin-transform-named-capturing-groups-regex`, `babel-standalone`
  * [#14805](https://github.com/babel/babel/pull/14805) Add support for the duplicate named capturing groups proposal ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :bug: Bug Fix
* `babel-helper-function-name`, `babel-helper-wrap-function`, `babel-plugin-transform-classes`
  * [#14897](https://github.com/babel/babel/pull/14897) Fix: class transform should not drop method definition when key contains non-BMP characters ([@JLHwung](https://github.com/JLHwung))
* `babel-plugin-transform-typescript`
  * [#14890](https://github.com/babel/babel/pull/14890) fix: TS plugin shouldn't remove `#privateField!` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-parser`
  * [#14819](https://github.com/babel/babel/pull/14819) fix: parse a&lt;b>>>c as a<(b>>>c) ([@JLHwung](https://github.com/JLHwung))
* `babel-helper-builder-react-jsx`
  * [#14886](https://github.com/babel/babel/pull/14886) Fix helper-builder-react-jsx compat with Babel 7.9 ([@JLHwung](https://github.com/JLHwung))

#### :nail_care: Polish
* `babel-core`
  * [#11612](https://github.com/babel/babel/pull/11612) Make error message prefixes more descriptive ([@eps1lon](https://github.com/eps1lon))
  * [#11554](https://github.com/babel/babel/pull/11554) Hide internal `@babel/core` functions in config errors ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :memo: Documentation
* [#14895](https://github.com/babel/babel/pull/14895) docs: remove david-dm from README ([@SukkaW](https://github.com/SukkaW))

#### :house: Internal
* `babel-standalone`
  * [#14863](https://github.com/babel/babel/pull/14863) ship @babel/standalone source maps ([@JLHwung](https://github.com/JLHwung))
* `babel-core`, `babel-parser`, `babel-traverse`
  * [#14880](https://github.com/babel/babel/pull/14880) Update typescript to 4.8 ([@JLHwung](https://github.com/JLHwung))
## v7.18.13 (2022-08-22)

#### :bug: Bug Fix
* `babel-generator`
  * [#14869](https://github.com/babel/babel/pull/14869) fix: jsx with `retainLines` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-core`
  * [#14843](https://github.com/babel/babel/pull/14843) Fix a race condition in `@babel/core` ([@JLHwung](https://github.com/JLHwung))
* `babel-plugin-transform-destructuring`
  * [#14841](https://github.com/babel/babel/pull/14841) fix: Destructuring exceptions in nested `for` expressions ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :nail_care: Polish
* `babel-traverse`
  * [#14833](https://github.com/babel/babel/pull/14833) Let `path.remove()` remove `IfStatement.alternate` ([@djpohly](https://github.com/djpohly))
  * [#14837](https://github.com/babel/babel/pull/14837) Add support for static evaluation of ?? operator ([@djpohly](https://github.com/djpohly))

#### :house: Internal
* [#14846](https://github.com/babel/babel/pull/14846) fix: Print build logs correctly ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v7.18.12 (2022-08-05)

#### :bug: Bug Fix
* `babel-plugin-transform-react-constant-elements`
  * [#14828](https://github.com/babel/babel/pull/14828) fix: react-cons-elem should not hoist router comp ([@JLHwung](https://github.com/JLHwung))
* `babel-generator`
  * [#14810](https://github.com/babel/babel/pull/14810) fix: Certain comments cause `generator` exceptions ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-plugin-transform-typescript`
  * [#14827](https://github.com/babel/babel/pull/14827) Fix: do not report global variables as injected binding  ([@JLHwung](https://github.com/JLHwung))
## v7.18.11 (2022-08-04)

#### :bug: Bug Fix
* `babel-helper-wrap-function`
  * [#14825](https://github.com/babel/babel/pull/14825) fix: helper-wrap-function compat with old traverse ([@JLHwung](https://github.com/JLHwung))

#### :house: Internal
* `babel-traverse`
  * [#14821](https://github.com/babel/babel/pull/14821) chore(traverse): fix some internal typescript types ([@danez](https://github.com/danez))
* `babel-parser`
  * [#14801](https://github.com/babel/babel/pull/14801) babel parser type improvements ([@zxbodya](https://github.com/zxbodya))
## v7.18.10 (2022-08-01)

#### :rocket: New Feature
* `babel-helper-string-parser`, `babel-types`
  * [#14757](https://github.com/babel/babel/pull/14757) feat: Automatically generate `cooked` for `templateElement` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :bug: Bug Fix
* `babel-parser`
  * [#14817](https://github.com/babel/babel/pull/14817) fix(parser): allow TS declare readonly fields with initializers ([@Josh-Cena](https://github.com/Josh-Cena))
* `babel-helper-string-parser`, `babel-parser`
  * [#14798](https://github.com/babel/babel/pull/14798) Fix position of errors in template literals after newlines ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-plugin-transform-typescript`
  * [#14774](https://github.com/babel/babel/pull/14774) fix: TS `declare class` in namespace should be removed ([@yimingjfe](https://github.com/yimingjfe))
* `babel-plugin-transform-react-jsx`
  * [#14759](https://github.com/babel/babel/pull/14759) fix: skip flattening spread object with __proto__ ([@JLHwung](https://github.com/JLHwung))
* `babel-generator`
  * [#14762](https://github.com/babel/babel/pull/14762) fix: Types containing comments generate invalid code ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-helper-wrap-function`, `babel-plugin-transform-async-to-generator`, `babel-traverse`
  * [#14752](https://github.com/babel/babel/pull/14752) Fix compiling async arrows in uncompiled class fields ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* Other
  * [#14800](https://github.com/babel/babel/pull/14800) chore: Remove `.yarnrc` file ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
  * [#14802](https://github.com/babel/babel/pull/14802) chore: Fix coverage test ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
  * [#14671](https://github.com/babel/babel/pull/14671) feat: Make most `make` commands cross-platform ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
  * [#14790](https://github.com/babel/babel/pull/14790) enable typescript incremental builds ([@zxbodya](https://github.com/zxbodya))
* `babel-traverse`
  * [#14799](https://github.com/babel/babel/pull/14799) Restructure virtual types validator ([@JLHwung](https://github.com/JLHwung))
* `babel-cli`
  * [#14779](https://github.com/babel/babel/pull/14779) chore: expand prettier-e2e test and update typings/deps ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-parser`
  * [#14796](https://github.com/babel/babel/pull/14796) Make ParseError Much Simpler now that we can use TypeScript ([@tolmasky](https://github.com/tolmasky))
* `babel-core`, `babel-parser`
  * [#14785](https://github.com/babel/babel/pull/14785) chore: remove flow check scripts ([@JLHwung](https://github.com/JLHwung))
* `babel-cli`, `babel-core`, `babel-parser`, `babel-plugin-transform-unicode-escapes`, `babel-preset-env`, `babel-template`, `babel-traverse`
  * [#14783](https://github.com/babel/babel/pull/14783) Convert `@babel/parser` to TypeScript ([@JLHwung](https://github.com/JLHwung))
* `babel-helper-string-parser`, `babel-parser`
  * [#14772](https://github.com/babel/babel/pull/14772) Extract string parsing to a separate package ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-cli`, `babel-node`
  * [#14765](https://github.com/babel/babel/pull/14765) Enforce type checking on `babel-{cli,node}` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :microscope: Output optimization
* `babel-plugin-proposal-export-default-from`
  * [#14768](https://github.com/babel/babel/pull/14768) optimize: Simplify the `export-default-from` transform ([@magic-akari](https://github.com/magic-akari))
## v7.18.9 (2022-07-18)

#### :bug: Bug Fix
* `babel-plugin-transform-modules-systemjs`, `babel-types`
  * [#14763](https://github.com/babel/babel/pull/14763) fix: allow exporting `TSDeclareFunction` as default ([@zxbodya](https://github.com/zxbodya))
* `babel-generator`
  * [#14758](https://github.com/babel/babel/pull/14758) fix: `returnType` with comments generates incorrect code ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :nail_care: Polish
* `babel-cli`
  * [#14748](https://github.com/babel/babel/pull/14748) Print a message when the watcher of `babel-cli` is ready. ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :house: Internal
* `babel-core`, `babel-helper-remap-async-to-generator`, `babel-helpers`, `babel-parser`, `babel-plugin-transform-block-scoping`, `babel-preset-env`
  * [#13414](https://github.com/babel/babel/pull/13414) Prepare for compiling Babel to native ESM ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-create-class-features-plugin`, `babel-helper-member-expression-to-functions`, `babel-helper-remap-async-to-generator`, `babel-helper-replace-supers`, `babel-helper-wrap-function`, `babel-helpers`, `babel-plugin-bugfix-v8-spread-parameters-in-optional-chaining`, `babel-plugin-proposal-decorators`, `babel-plugin-proposal-object-rest-spread`, `babel-plugin-proposal-optional-chaining`, `babel-plugin-transform-block-scoping`, `babel-plugin-transform-classes`, `babel-traverse`, `babel-types`
  * [#14739](https://github.com/babel/babel/pull/14739) Provide better parentPath typings ([@JLHwung](https://github.com/JLHwung))

#### :running_woman: Performance
* `babel-generator`
  * [#14701](https://github.com/babel/babel/pull/14701) perf: Improve generator perf ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v7.18.8 (2022-07-08)

#### :eyeglasses: Spec Compliance
* `babel-parser`, `babel-types`
  * [#14730](https://github.com/babel/babel/pull/14730) Misc fixes to `@babel/types` AST definitions ([@JLHwung](https://github.com/JLHwung))

#### :bug: Bug Fix
* `babel-plugin-transform-parameters`
  * [#14736](https://github.com/babel/babel/pull/14736) Inject IIFE when variables shadow binding in rest param ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-plugin-transform-classes`
  * [#14709](https://github.com/babel/babel/pull/14709) Fix compilation of nested `super(...)` calls ([@dbacarel](https://github.com/dbacarel))
* `babel-plugin-transform-for-of`, `babel-plugin-transform-spread`, `babel-traverse`, `babel-types`
  * [#14393](https://github.com/babel/babel/pull/14393) Support some TSTypes in the inferrer ([@JLHwung](https://github.com/JLHwung))
* `babel-helper-module-transforms`, `babel-plugin-transform-modules-commonjs`
  * [#14708](https://github.com/babel/babel/pull/14708) Unshadow `cjs` exports when transforming mutations ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :memo: Documentation
* [#14486](https://github.com/babel/babel/pull/14486) Fix test debugging instructions for contributors ([@conartist6](https://github.com/conartist6))

#### :house: Internal
* `babel-types`
  * [#14737](https://github.com/babel/babel/pull/14737) fix: deep clone shared AST field definitions ([@JLHwung](https://github.com/JLHwung))
* Other
  * [#14720](https://github.com/babel/babel/pull/14720) fix: support compiling monorepo on single-core CPU machines ([@JLHwung](https://github.com/JLHwung))
* `babel-helper-fixtures`, `babel-parser`
  * [#12619](https://github.com/babel/babel/pull/12619) Add json schema of fixture runner options ([@JLHwung](https://github.com/JLHwung))

#### :microscope: Output optimization
* `babel-plugin-transform-typescript`
  * [#14723](https://github.com/babel/babel/pull/14723) [optimizeConstEnums] Inline const enum if only exported as type ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.18.7 (2022-06-28)

#### :bug: Bug Fix
* `babel-types`
  * [#14706](https://github.com/babel/babel/pull/14706) fix: `@babel/types` exception in typescript project. ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v7.18.6 (2022-06-27)

#### :eyeglasses: Spec Compliance
* `babel-parser`
  * [#14650](https://github.com/babel/babel/pull/14650) [ts] Disallow property access after instantiation expression ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  * [#14636](https://github.com/babel/babel/pull/14636) [ts] Allow `...<...>` followed by newline or binary operator ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-generator`, `babel-parser`, `babel-preset-env`, `babel-template`
  * [#14668](https://github.com/babel/babel/pull/14668) JSON modules should be imported with default ([@JLHwung](https://github.com/JLHwung))

#### :bug: Bug Fix
* `babel-helper-remap-async-to-generator`, `babel-plugin-proposal-async-generator-functions`
  * [#14391](https://github.com/babel/babel/pull/14391) Transform `await` in computed class keys ([@Yokubjon-J](https://github.com/Yokubjon-J))
* `babel-plugin-transform-parameters`
  * [#14694](https://github.com/babel/babel/pull/14694) fix: preserve function params type if possible ([@magic-akari](https://github.com/magic-akari))
* `babel-core`
  * [#14583](https://github.com/babel/babel/pull/14583) fix: Memory leak when deep cloning in `babel-core` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-core`, `babel-helper-check-duplicate-nodes`, `babel-plugin-bugfix-safari-id-destructuring-collision-in-function-expression`, `babel-plugin-bugfix-v8-spread-parameters-in-optional-chaining`, `babel-plugin-proposal-destructuring-private`, `babel-plugin-proposal-optional-chaining`, `babel-plugin-transform-runtime`
  * [#14663](https://github.com/babel/babel/pull/14663) Fix `import { types } from "@babel/core"` with native ESM ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* `babel-standalone`
  * [#14697](https://github.com/babel/babel/pull/14697) Add `proposal-unicode-sets-regex` to `@babel/standalone` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* Other
  * [#14687](https://github.com/babel/babel/pull/14687) chore: Update bench baselines ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-generator`, `babel-types`
  * [#14685](https://github.com/babel/babel/pull/14685) enable TS compiler option: strictBindCallApply ([@JLHwung](https://github.com/JLHwung))
* `babel-code-frame`, `babel-core`, `babel-generator`, `babel-helper-annotate-as-pure`, `babel-helper-builder-binary-assignment-operator-visitor`, `babel-helper-builder-react-jsx`, `babel-helper-check-duplicate-nodes`, `babel-helper-compilation-targets`, `babel-helper-create-class-features-plugin`, `babel-helper-create-regexp-features-plugin`, `babel-helper-define-map`, `babel-helper-explode-assignable-expression`, `babel-helper-fixtures`, `babel-helper-function-name`, `babel-helper-hoist-variables`, `babel-helper-member-expression-to-functions`, `babel-helper-module-imports`, `babel-helper-module-transforms`, `babel-helper-optimise-call-expression`, `babel-helper-plugin-test-runner`, `babel-helper-plugin-utils`, `babel-helper-remap-async-to-generator`, `babel-helper-replace-supers`, `babel-helper-simple-access`, `babel-helper-split-export-declaration`, `babel-helper-transform-fixture-test-runner`, `babel-helper-validator-option`, `babel-helper-wrap-function`, `babel-helpers`, `babel-highlight`, `babel-plugin-bugfix-v8-spread-parameters-in-optional-chaining`, `babel-plugin-external-helpers`, `babel-plugin-proposal-async-generator-functions`, `babel-plugin-proposal-class-static-block`, `babel-plugin-proposal-decorators`, `babel-plugin-proposal-destructuring-private`, `babel-plugin-proposal-function-bind`, `babel-plugin-proposal-function-sent`, `babel-plugin-proposal-json-strings`, `babel-plugin-proposal-object-rest-spread`, `babel-plugin-proposal-optional-chaining`, `babel-plugin-proposal-partial-application`, `babel-plugin-proposal-pipeline-operator`, `babel-plugin-proposal-private-property-in-object`, `babel-plugin-proposal-record-and-tuple`, `babel-plugin-syntax-typescript`, `babel-plugin-transform-block-scoped-functions`, `babel-plugin-transform-block-scoping`, `babel-plugin-transform-classes`, `babel-plugin-transform-computed-properties`, `babel-plugin-transform-destructuring`, `babel-plugin-transform-duplicate-keys`, `babel-plugin-transform-exponentiation-operator`, `babel-plugin-transform-flow-comments`, `babel-plugin-transform-flow-strip-types`, `babel-plugin-transform-for-of`, `babel-plugin-transform-function-name`, `babel-plugin-transform-modules-amd`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-modules-systemjs`, `babel-plugin-transform-modules-umd`, `babel-plugin-transform-object-super`, `babel-plugin-transform-parameters`, `babel-plugin-transform-property-mutators`, `babel-plugin-transform-proto-to-assign`, `babel-plugin-transform-react-constant-elements`, `babel-plugin-transform-react-display-name`, `babel-plugin-transform-react-inline-elements`, `babel-plugin-transform-react-jsx-compat`, `babel-plugin-transform-react-jsx-source`, `babel-plugin-transform-react-jsx`, `babel-plugin-transform-runtime`, `babel-plugin-transform-typescript`, `babel-plugin-transform-unicode-escapes`, `babel-preset-env`, `babel-preset-typescript`, `babel-standalone`, `babel-template`, `babel-traverse`, `babel-types`
  * [#14601](https://github.com/babel/babel/pull/14601) enable noImplicitAny ([@JLHwung](https://github.com/JLHwung))
* `babel-core`, `babel-helper-transform-fixture-test-runner`, `babel-plugin-transform-destructuring`
  * [#14659](https://github.com/babel/babel/pull/14659) Run Babel asynchronously in fixtures ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

## v7.18.5 (2022-06-13)

#### :bug: Bug Fix
* `babel-plugin-transform-new-target`
  * [#14611](https://github.com/babel/babel/pull/14611) fix: `new.target` with shadowed class name ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-plugin-transform-modules-systemjs`
  * [#14655](https://github.com/babel/babel/pull/14655) Fix named destructuring exports ([@underfin](https://github.com/underfin))

#### :memo: Documentation
* [#14332](https://github.com/babel/babel/pull/14332) docs: eslint-parser requireConfigFile behaviour ([@JLHwung](https://github.com/JLHwung))
* [#14619](https://github.com/babel/babel/pull/14619) Move v7 prereleases changelog to a separate file ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* `babel-traverse`
  * [#14649](https://github.com/babel/babel/pull/14649) Rely on the call stack to clean up cache in `_guessExecutionStatusRelativeTo` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-core`
  * [#14641](https://github.com/babel/babel/pull/14641) Change limit of source map 3MB ([@vasicvuk](https://github.com/vasicvuk))
* Other
  * [#14627](https://github.com/babel/babel/pull/14627) Speedup e2e test on github ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
  * [#14248](https://github.com/babel/babel/pull/14248) chore: automate compat-data update ([@tony-go](https://github.com/tony-go))
* `babel-parser`
  * [#14592](https://github.com/babel/babel/pull/14592) feat: Automatically generate test results that do not exist ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :running_woman: Performance
* `babel-traverse`
  * [#14617](https://github.com/babel/babel/pull/14617) Fix `_guessExecutionStatusRelativeToDifferentFunctions` perf ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v7.18.4 (2022-05-29)

#### :eyeglasses: Spec Compliance
* `babel-types`
  * [#14591](https://github.com/babel/babel/pull/14591) fix: remove TSDeclareFunction from ExportDefaultDeclaration ([@JLHwung](https://github.com/JLHwung))

#### :bug: Bug Fix
* `babel-plugin-transform-typescript`
  * [#14610](https://github.com/babel/babel/pull/14610) Fix `@babel/transform-typescript` compatibility with Next.js ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-parser`
  * [#14604](https://github.com/babel/babel/pull/14604) [ts] FIx parsing of nested `extends` type in arrow type ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-check-duplicate-nodes`, `babel-parser`
  * [#14595](https://github.com/babel/babel/pull/14595) fix: `loc.index` of some nodes is wrongly enumerable. ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :house: Internal
* `babel-plugin-transform-block-scoping`, `babel-plugin-transform-classes`, `babel-plugin-transform-modules-systemjs`
  * [#14599](https://github.com/babel/babel/pull/14599) refactor: avoid mutating AST nodes ([@JLHwung](https://github.com/JLHwung))
## v7.18.3 (2022-05-25)

#### :bug: Bug Fix
* `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`
  * [#14588](https://github.com/babel/babel/pull/14588) Restore es5 compatibility in `@babel/runtime/regenerator` ([@jlowcs](https://github.com/jlowcs))
## v7.18.2 (2022-05-25)

#### :bug: Bug Fix
* `babel-plugin-transform-template-literals`
  * [#14582](https://github.com/babel/babel/pull/14582) fix: skip template literal transform for TSLiteralType ([@JLHwung](https://github.com/JLHwung))
* `babel-helpers`
  * [#14537](https://github.com/babel/babel/pull/14537) Support frozen built-ins in `@babel/runtime` ([@Jack-Works](https://github.com/Jack-Works))
* `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`
  * [#14581](https://github.com/babel/babel/pull/14581) Define the global `regeneratorRuntime` in `@babel/runtime/regenerator` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-environment-visitor`, `babel-helper-replace-supers`, `babel-plugin-proposal-class-properties`, `babel-plugin-proposal-decorators`, `babel-traverse`, `babel-types`
  * [#14371](https://github.com/babel/babel/pull/14371) environmentVisitor should skip decorator expressions ([@JLHwung](https://github.com/JLHwung))

#### :memo: Documentation
* `babel-types`
  * [#14571](https://github.com/babel/babel/pull/14571) add Accessor alias description ([@JLHwung](https://github.com/JLHwung))

#### :house: Internal
* [#14541](https://github.com/babel/babel/pull/14541) Fix synchronization between main thread and worker ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v7.18.1 (2022-05-19)

#### :bug: Bug Fix
* `babel-plugin-transform-typescript`
  * [#14566](https://github.com/babel/babel/pull/14566) Fix TypeScript plugin compat with `@babel/types` versions ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-plugin-transform-for-of`
  * [#14564](https://github.com/babel/babel/pull/14564) fix: Duplicate declaration in transformed for...of ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v7.18.0 (2022-05-19)

#### :rocket: New Feature
* `babel-preset-env`
  * [#14556](https://github.com/babel/babel/pull/14556) feat: add import-assertions to shippedProposals ([@JLHwung](https://github.com/JLHwung))
* `babel-helper-create-class-features-plugin`, `babel-helper-define-map`, `babel-plugin-proposal-class-static-block`, `babel-plugin-proposal-destructuring-private`, `babel-plugin-proposal-object-rest-spread`, `babel-plugin-syntax-destructuring-private`, `babel-plugin-transform-destructuring`, `babel-plugin-transform-proto-to-assign`, `babel-plugin-transform-typescript`, `babel-standalone`, `babel-traverse`, `babel-types`
  * [#14304](https://github.com/babel/babel/pull/14304) Transform destructuring private ([@JLHwung](https://github.com/JLHwung))
* `babel-generator`, `babel-parser`, `babel-types`
  * [#14359](https://github.com/babel/babel/pull/14359) [ts 4.7] Support optional variance annotations ([@magic-akari](https://github.com/magic-akari))
* `babel-generator`, `babel-parser`
  * [#14476](https://github.com/babel/babel/pull/14476) [ts 4.7] Support `extends` constraints for `infer` ([@sosukesuzuki](https://github.com/sosukesuzuki))
* `babel-generator`, `babel-parser`, `babel-plugin-transform-typescript`, `babel-traverse`, `babel-types`
  * [#14457](https://github.com/babel/babel/pull/14457) [ts] Add support for instantiation expressions ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-module-transforms`, `babel-plugin-transform-modules-amd`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-modules-umd`
  * [#14456](https://github.com/babel/babel/pull/14456) Pass filename to `importInterop` method ([@NickHeiner](https://github.com/NickHeiner))

#### :bug: Bug Fix
* `babel-types`
  * [#14551](https://github.com/babel/babel/pull/14551) Do not create multiple copies of comments when cloning nodes ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-parser`
  * [#14557](https://github.com/babel/babel/pull/14557) Fix parsing of `<` after object literals with the `jsx` plugin ([@JLHwung](https://github.com/JLHwung))
* `babel-plugin-transform-react-pure-annotations`
  * [#14528](https://github.com/babel/babel/pull/14528) fix: do not mark computed `React[...]` methods as pure ([@JLHwung](https://github.com/JLHwung))

#### :nail_care: Polish
* `babel-core`, `babel-helper-transform-fixture-test-runner`, `babel-helpers`, `babel-plugin-proposal-async-generator-functions`, `babel-plugin-transform-async-to-generator`, `babel-plugin-transform-block-scoping`, `babel-plugin-transform-classes`, `babel-plugin-transform-regenerator`, `babel-plugin-transform-runtime`, `babel-preset-env`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`, `babel-standalone`
  * [#14538](https://github.com/babel/babel/pull/14538) Inline `regeneratorRuntime` as a normal helper ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* `babel-core`, `babel-helper-create-class-features-plugin`, `babel-plugin-proposal-decorators`, `babel-plugin-transform-modules-systemjs`
  * [#14530](https://github.com/babel/babel/pull/14530) improve helper-create-class-features typings ([@JLHwung](https://github.com/JLHwung))
## v7.17.12 (2022-05-16)

#### :bug: Bug Fix
* `babel-plugin-transform-react-constant-elements`
  * [#14536](https://github.com/babel/babel/pull/14536) Never hoist JSX elts referencing vars from the current scope ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-generator`
  * [#14524](https://github.com/babel/babel/pull/14524) fix: perserve parentheses of lhs id with rhs unamed fn ([@JLHwung](https://github.com/JLHwung))
  * [#14532](https://github.com/babel/babel/pull/14532) Print necessary parentheses for functions in postfix expressions ([@xiawenqi](https://github.com/xiawenqi))
* `babel-plugin-transform-destructuring`
  * [#14494](https://github.com/babel/babel/pull/14494) Update scope info after destructuring transform ([@peey](https://github.com/peey))
* `babel-parser`
  * [#14522](https://github.com/babel/babel/pull/14522) fix: allow liberal named type-as imports ([@JLHwung](https://github.com/JLHwung))
* `babel-parser`, `babel-plugin-transform-destructuring`, `babel-types`
  * [#14500](https://github.com/babel/babel/pull/14500) Fix parsing ts type casts and nested patterns in destructuring ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* `babel-plugin-proposal-decorators`, `babel-types`
  * [#14519](https://github.com/babel/babel/pull/14519) @babel/types builder improvements ([@JLHwung](https://github.com/JLHwung))
* `babel-core`
  * [#14490](https://github.com/babel/babel/pull/14490) Update to Jest 28 ([@JLHwung](https://github.com/JLHwung))
* `babel-core`, `babel-generator`, `babel-helper-create-class-features-plugin`, `babel-helper-create-regexp-features-plugin`, `babel-helper-module-transforms`, `babel-helper-plugin-utils`, `babel-parser`, `babel-plugin-bugfix-safari-id-destructuring-collision-in-function-expression`, `babel-plugin-bugfix-v8-spread-parameters-in-optional-chaining`, `babel-plugin-external-helpers`, `babel-plugin-proposal-async-do-expressions`, `babel-plugin-proposal-async-generator-functions`, `babel-plugin-proposal-class-properties`, `babel-plugin-proposal-class-static-block`, `babel-plugin-proposal-decorators`, `babel-plugin-proposal-export-default-from`, `babel-plugin-proposal-export-namespace-from`, `babel-plugin-proposal-function-sent`, `babel-plugin-proposal-json-strings`, `babel-plugin-proposal-logical-assignment-operators`, `babel-plugin-proposal-nullish-coalescing-operator`, `babel-plugin-proposal-object-rest-spread`, `babel-plugin-proposal-optional-chaining`, `babel-plugin-proposal-partial-application`, `babel-plugin-proposal-pipeline-operator`, `babel-plugin-proposal-private-methods`, `babel-plugin-proposal-private-property-in-object`, `babel-plugin-proposal-record-and-tuple`, `babel-plugin-proposal-unicode-property-regex`, `babel-plugin-syntax-decorators`, `babel-plugin-syntax-destructuring-private`, `babel-plugin-syntax-flow`, `babel-plugin-syntax-import-assertions`, `babel-plugin-syntax-pipeline-operator`, `babel-plugin-syntax-record-and-tuple`, `babel-plugin-syntax-typescript`, `babel-plugin-transform-arrow-functions`, `babel-plugin-transform-async-to-generator`, `babel-plugin-transform-block-scoping`, `babel-plugin-transform-classes`, `babel-plugin-transform-computed-properties`, `babel-plugin-transform-destructuring`, `babel-plugin-transform-duplicate-keys`, `babel-plugin-transform-flow-comments`, `babel-plugin-transform-flow-strip-types`, `babel-plugin-transform-for-of`, `babel-plugin-transform-instanceof`, `babel-plugin-transform-jscript`, `babel-plugin-transform-literals`, `babel-plugin-transform-modules-amd`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-modules-systemjs`, `babel-plugin-transform-modules-umd`, `babel-plugin-transform-named-capturing-groups-regex`, `babel-plugin-transform-new-target`, `babel-plugin-transform-parameters`, `babel-plugin-transform-property-mutators`, `babel-plugin-transform-proto-to-assign`, `babel-plugin-transform-react-constant-elements`, `babel-plugin-transform-react-jsx`, `babel-plugin-transform-reserved-words`, `babel-plugin-transform-runtime`, `babel-plugin-transform-spread`, `babel-plugin-transform-template-literals`, `babel-plugin-transform-typeof-symbol`, `babel-plugin-transform-typescript`, `babel-preset-env`, `babel-preset-flow`, `babel-preset-react`, `babel-preset-typescript`, `babel-traverse`, `babel-types`
  * [#14499](https://github.com/babel/babel/pull/14499) Provide plugin/preset typings from plugin-utils ([@JLHwung](https://github.com/JLHwung))
## v7.17.11 (2022-04-29)

#### :bug: Bug Fix
* `babel-runtime-corejs2`
  * [#14509](https://github.com/babel/babel/pull/14509) fix: `@babel/runtime-corejs2` should depend on core-js 2 ([@JLHwung](https://github.com/JLHwung))
## v7.17.10 (2022-04-29)

#### :bug: Bug Fix
* `babel-cli`, `babel-core`, `babel-generator`, `babel-helper-transform-fixture-test-runner`
  * [#14479](https://github.com/babel/babel/pull/14479) [cli] Avoid `SourceMapGenerator` for simple map concatenation ([@jridgewell](https://github.com/jridgewell))

#### :nail_care: Polish
* `babel-cli`, `babel-core`, `babel-generator`, `babel-helper-fixtures`, `babel-helper-transform-fixture-test-runner`
  * [#14506](https://github.com/babel/babel/pull/14506) Do not add sourcemap markings for indentation ([@jridgewell](https://github.com/jridgewell))
* `babel-plugin-proposal-pipeline-operator`, `babel-traverse`
  * [#14424](https://github.com/babel/babel/pull/14424) Update detection of pure nodes (`Scope#isPure`) ([@JLHwung](https://github.com/JLHwung))

#### :house: Internal
* `babel-core`
  * [#14493](https://github.com/babel/babel/pull/14493) Remove git.io shortlinks from repo ([@Andoryuuta](https://github.com/Andoryuuta))
* Other
  * [#14462](https://github.com/babel/babel/pull/14462) fix: build standalone on windows ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :running_woman: Performance
* `babel-cli`, `babel-core`, `babel-generator`
  * [#14497](https://github.com/babel/babel/pull/14497) Switch to `@jridgewell/gen-mapping` for sourcemap generation ([@jridgewell](https://github.com/jridgewell))
## v7.17.9 (2022-04-06)

#### :bug: Bug Fix
* `babel-parser`, `babel-standalone`
  * [#14427](https://github.com/babel/babel/pull/14427) Restore numeric separators support in `@babel/standalone` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-traverse`
  * [#14403](https://github.com/babel/babel/pull/14403) Fix NodePath.referencesImport for  JSXMemberExpression ([@swandir](https://github.com/swandir))
* `babel-plugin-proposal-decorators`
  * [#14396](https://github.com/babel/babel/pull/14396) [2021-12] Support class decorators in export declarations ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  * [#14387](https://github.com/babel/babel/pull/14387) fix: forward accessor proxy getter results ([@JLHwung](https://github.com/JLHwung))
* `babel-parser`
  * [#14384](https://github.com/babel/babel/pull/14384) fix: parse type parameters within correct context ([@JLHwung](https://github.com/JLHwung))
* `babel-generator`, `babel-parser`
  * [#14378](https://github.com/babel/babel/pull/14378) Parenthesize non-simple decorator expression ([@JLHwung](https://github.com/JLHwung))
* `babel-plugin-transform-classes`, `babel-plugin-transform-modules-commonjs`, `babel-preset-env`
  * [#14366](https://github.com/babel/babel/pull/14366) Align named imports behavior in `.mjs` and `.js` files ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-create-class-features-plugin`, `babel-plugin-proposal-class-properties`
  * [#14351](https://github.com/babel/babel/pull/14351) [setPublicClassFields] Use define for static `name`/`length` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :nail_care: Polish
* `babel-plugin-proposal-decorators`
  * [#14398](https://github.com/babel/babel/pull/14398) Add missing semicolons in 2021-12 decorators output ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :memo: Documentation
* [#14397](https://github.com/babel/babel/pull/14397) Mention how to report vulns in Babel dependencies ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* Other
  * [#14419](https://github.com/babel/babel/pull/14419) Use `jest-light-runner` from npm ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-cli`
  * [#14385](https://github.com/babel/babel/pull/14385) Fix flaky @babel/cli test ([@JLHwung](https://github.com/JLHwung))
* `babel-helper-function-name`, `babel-helper-get-function-arity`
  * [#14389](https://github.com/babel/babel/pull/14389) Inline `@babel/helper-get-function-arity` package ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helpers`
  * [#14343](https://github.com/babel/babel/pull/14343) Remove unused `@babel/helpers` code ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-core`, `babel-highlight`, `babel-parser`
  * [#14377](https://github.com/babel/babel/pull/14377) refactor: replace deprecated String.prototype.substr() ([@CommanderRoot](https://github.com/CommanderRoot))
## v7.17.8 (2022-03-18)

#### :eyeglasses: Spec Compliance
* `babel-helpers`, `babel-plugin-proposal-decorators`
  * [#14353](https://github.com/babel/babel/pull/14353) Update decorators to match latest spec ([@pzuraq](https://github.com/pzuraq))
  * [#14339](https://github.com/babel/babel/pull/14339) Decorators misc fixes ([@JLHwung](https://github.com/JLHwung))

#### :bug: Bug Fix
* `babel-plugin-transform-modules-systemjs`
  * [#14057](https://github.com/babel/babel/pull/14057) [systemjs] Fix nested `let`/`const` shadowing imported bindings ([@The-x-Theorist](https://github.com/The-x-Theorist))
* `babel-parser`
  * [#14362](https://github.com/babel/babel/pull/14362) Allow keywords in TS qualified types ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :leftwards_arrow_with_hook: Revert
* `babel-parser`
  * [#14367](https://github.com/babel/babel/pull/14367) Defer `<T>() => {}` TSX error to Babel 8 ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.17.7 (2022-03-14)

#### :eyeglasses: Spec Compliance
* `babel-generator`, `babel-parser`
  * [#14135](https://github.com/babel/babel/pull/14135) [tsx] raise error on single arrow type argument without comma ([@ozanhonamlioglu](https://github.com/ozanhonamlioglu))

#### :bug: Bug Fix
* `babel-helper-compilation-targets`
  * [#14294](https://github.com/babel/babel/pull/14294) Avoid `resolveTargets` call if `browsers` is an empty array ([@dev-itsheng](https://github.com/dev-itsheng))
* `babel-helper-module-transforms`, `babel-helper-simple-access`, `babel-plugin-transform-modules-amd`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-modules-umd`
  * [#14341](https://github.com/babel/babel/pull/14341) Fix update expression for exported bigints ([@magic-akari](https://github.com/magic-akari))
* `babel-parser`
  * [#14344](https://github.com/babel/babel/pull/14344) Allow variable and function with the same name in static blocks ([@Yokubjon-J](https://github.com/Yokubjon-J))
  * [#14327](https://github.com/babel/babel/pull/14327) Remove length restriction from JSX entities, and ignore `Object.prototype` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  * [#14293](https://github.com/babel/babel/pull/14293) fix(ts): skip func-type param start on parsing ([@JLHwung](https://github.com/JLHwung))
* `babel-helpers`, `babel-plugin-proposal-decorators`
  * [#14335](https://github.com/babel/babel/pull/14335) Fix static/proto initializers when there aren't class fields ([@JLHwung](https://github.com/JLHwung))
  * [#14334](https://github.com/babel/babel/pull/14334) fix: push `newClass` only when class is decorated ([@JLHwung](https://github.com/JLHwung))
* `babel-generator`
  * [#14309](https://github.com/babel/babel/pull/14309) Fix `import type/typeof` printing with no specifiers ([@The-x-Theorist](https://github.com/The-x-Theorist))
* `babel-helper-module-transforms`, `babel-plugin-transform-modules-commonjs`
  * [#14313](https://github.com/babel/babel/pull/14313) Fix duplicate exports initialization with many exports ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-member-expression-to-functions`, `babel-plugin-proposal-class-properties`, `babel-plugin-proposal-private-methods`, `babel-plugin-transform-classes`, `babel-plugin-transform-object-super`
  * [#14311](https://github.com/babel/babel/pull/14311) fix: support bigints in update expressions for private fields ([@magic-akari](https://github.com/magic-akari))
* `babel-register`
  * [#14303](https://github.com/babel/babel/pull/14303) Fix babel register cache invalidation ([@cha0s](https://github.com/cha0s))

#### :nail_care: Polish
* `babel-parser`
  * [#14338](https://github.com/babel/babel/pull/14338) Report single error for invalid num seps in unicode escapes ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* `babel-generator`, `babel-parser`
  * [#14320](https://github.com/babel/babel/pull/14320) Type-safe ParseErrors ([@tolmasky](https://github.com/tolmasky))
* `babel-plugin-transform-destructuring`
  * [#14236](https://github.com/babel/babel/pull/14236) Improve `transform-destructuring` typings ([@JLHwung](https://github.com/JLHwung))
* Other
  * [#14180](https://github.com/babel/babel/pull/14180) Convert ESLint plugins to CommonJS ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.17.6 (2022-02-21)

#### :eyeglasses: Spec Compliance
* `babel-helper-module-transforms`
  * [#14287](https://github.com/babel/babel/pull/14287) Make module namespace sort compare function consistent ([@devsnek](https://github.com/devsnek))

#### :bug: Bug Fix
* `babel-cli`
  * [#14281](https://github.com/babel/babel/pull/14281) cli: handle multiple input sources in watch mode ([@JLHwung](https://github.com/JLHwung))

#### :microscope: Output optimization
* `babel-plugin-transform-react-constant-elements`
  * [#12975](https://github.com/babel/babel/pull/12975) `allowMutablePropsOnTags`: cache JSX constant elements with function props ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-plugin-proposal-pipeline-operator`, `babel-standalone`
  * [#14278](https://github.com/babel/babel/pull/14278) [hack pipes] Inline topic token when possible ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-create-class-features-plugin`, `babel-plugin-proposal-class-static-block`, `babel-plugin-proposal-decorators`, `babel-preset-env`
  * [#14275](https://github.com/babel/babel/pull/14275) Avoid IIFE for single-expression class static blocks ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.17.5 (2022-02-17)

#### :bug: Bug Fix
* `babel-core`
  * [#14283](https://github.com/babel/babel/pull/14283) Make source maps plain objects for use with `t.valueToNode` ([@thebanjomatic](https://github.com/thebanjomatic))
  * [#14282](https://github.com/babel/babel/pull/14282) Fix merging sourcemaps on Windows ([@jridgewell](https://github.com/jridgewell))
## v7.17.4 (2022-02-15)

#### :bug: Bug Fix
* `babel-core`
  * [#14274](https://github.com/babel/babel/pull/14274) Fix infinite recursion when merge sourcemaps ([@jridgewell](https://github.com/jridgewell))
## v7.17.3 (2022-02-15)

#### :bug: Bug Fix
* `babel-plugin-transform-react-jsx-development`, `babel-plugin-transform-react-jsx`
  * [#14271](https://github.com/babel/babel/pull/14271) jsx-development: do not emit `this` within ts module block ([@JLHwung](https://github.com/JLHwung))
* `babel-plugin-transform-destructuring`
  * [#14240](https://github.com/babel/babel/pull/14240) Fix destructuring with holes in assign pattern ([@magic-akari](https://github.com/magic-akari))

#### :house: Internal
* `babel-cli`, `babel-core`, `babel-generator`, `babel-helper-transform-fixture-test-runner`
  * [#14253](https://github.com/babel/babel/pull/14253) Convert all SourceMapConsumers to TraceMaps ([@jridgewell](https://github.com/jridgewell))

#### :microscope: Output optimization
* `babel-plugin-proposal-class-properties`, `babel-plugin-proposal-class-static-block`, `babel-plugin-proposal-decorators`, `babel-plugin-proposal-private-methods`, `babel-plugin-proposal-private-property-in-object`, `babel-plugin-transform-new-target`, `babel-plugin-transform-parameters`, `babel-traverse`
  * [#14268](https://github.com/babel/babel/pull/14268) Skip unnecessary temp vars in `path.insertAfter` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.17.2 (2022-02-08)

#### :bug: Bug Fix
* `babel-helpers`, `babel-plugin-proposal-decorators`
  * [#14244](https://github.com/babel/babel/pull/14244) Fix 2021-12 decorators application order ([@JLHwung](https://github.com/JLHwung))
* `babel-core`
  * [#14241](https://github.com/babel/babel/pull/14241) Fix reinstantiation of inherited plugins ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  * [#14246](https://github.com/babel/babel/pull/14246) Merge multi-source output sourcemaps ([@jridgewell](https://github.com/jridgewell))
## v7.17.1 (2022-02-03)

#### :bug: Bug Fix
* `babel-helper-create-class-features-plugin`
  * [#14231](https://github.com/babel/babel/pull/14231) Restore class fields transform compat with old `@babel/types` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.17.0 (2022-02-02)

#### :rocket: New Feature
* `babel-cli`, `babel-core`
  * [#14065](https://github.com/babel/babel/pull/14065) Allow plugins/presets to indicate external dependencies ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-core`, `babel-parser`, `babel-traverse`
  * [#14174](https://github.com/babel/babel/pull/14174) Expose `.index` on Position to internally track nodes location ([@tolmasky](https://github.com/tolmasky))
* `babel-generator`, `babel-parser`, `babel-plugin-proposal-pipeline-operator`, `babel-plugin-syntax-pipeline-operator`
  * [#13973](https://github.com/babel/babel/pull/13973) proposal-pipe: Add support for `^^` and `@@` topics ([@js-choi](https://github.com/js-choi))
* `babel-traverse`
  * [#13940](https://github.com/babel/babel/pull/13940) Add new method to check if node is null or not ([@danez](https://github.com/danez))
* `babel-generator`, `babel-parser`, `babel-plugin-syntax-destructuring-private`, `babel-standalone`
  * [#13931](https://github.com/babel/babel/pull/13931) Parse destructuring private fields ([@JLHwung](https://github.com/JLHwung))
* `babel-helper-create-class-features-plugin`, `babel-helpers`, `babel-plugin-proposal-decorators`, `babel-plugin-syntax-decorators`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`, `babel-standalone`, `babel-types`
  * [#14004](https://github.com/babel/babel/pull/14004) Add new decorators transform ([@pzuraq](https://github.com/pzuraq))
* `babel-generator`, `babel-parser`, `babel-traverse`, `babel-types`
  * [#13681](https://github.com/babel/babel/pull/13681) Add the `decoratorsAutoAccessors` parser plugin ([@pzuraq](https://github.com/pzuraq))
* `babel-core`, `babel-helper-create-regexp-features-plugin`, `babel-plugin-proposal-unicode-sets-regex`, `babel-plugin-syntax-unicode-sets-regex`, `babel-plugin-transform-dotall-regex`
  * [#14125](https://github.com/babel/babel/pull/14125) Add transform support for the "regexp unicode sets" proposal ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-parser`
  * [#14086](https://github.com/babel/babel/pull/14086) Add parser support for the "regexp unicode sets" proposal ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-register`
  * [#14087](https://github.com/babel/babel/pull/14087) Expose `@babel/register/experimental-worker` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :bug: Bug Fix
* `babel-parser`
  * [#14145](https://github.com/babel/babel/pull/14145) Reinterpret << when parsing TS type arguments ([@JLHwung](https://github.com/JLHwung))
* `babel-plugin-transform-runtime`
  * [#14187](https://github.com/babel/babel/pull/14187) Normalize absolute paths on Windows ([@atti187](https://github.com/atti187))

#### :memo: Documentation
* [#14223](https://github.com/babel/babel/pull/14223) Remove Babel 6 from SECURITY.md ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* `babel-helper-fixtures`, `babel-parser`
  * [#14201](https://github.com/babel/babel/pull/14201) Fuzz test location-related parser options ([@tolmasky](https://github.com/tolmasky))
* `babel-compat-data`
  * [#14208](https://github.com/babel/babel/pull/14208) Update compat data (specifically for rhino 1.7.14) ([@phulin](https://github.com/phulin))
* Other
  * [#14190](https://github.com/babel/babel/pull/14190) chore: run tscheck on babel 8 breaking test ([@JLHwung](https://github.com/JLHwung))

#### :running_woman: Performance
* `babel-cli`, `babel-core`
  * [#14209](https://github.com/babel/babel/pull/14209) Switch to `@ampproject/remapping` to merge source maps ([@jridgewell](https://github.com/jridgewell))
## v7.16.12 (2022-01-22)

#### :bug: Bug Fix
* `babel-core`
  * [#14192](https://github.com/babel/babel/pull/14192) Avoid dynamic import when it's not needed ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-parser`
  * [#14194](https://github.com/babel/babel/pull/14194) fix: incorrect `in` parsing in arrow ConciseBody ([@JLHwung](https://github.com/JLHwung))

## v7.16.10 (2022-01-19)

#### :bug: Bug Fix
* `babel-highlight`
  * [#14165](https://github.com/babel/babel/pull/14165) Avoid infinite loop when highlighting an empty input ([@blankPen](https://github.com/blankPen))
* `babel-traverse`
  * [#14164](https://github.com/babel/babel/pull/14164) Handle logical assignment in super property transforms ([@magic-akari](https://github.com/magic-akari))
  * [#14162](https://github.com/babel/babel/pull/14162) Fix the transform of `super.foo--`/`super[foo]--` (and prefix) ([@magic-akari](https://github.com/magic-akari))
* `babel-core`
  * [#14110](https://github.com/babel/babel/pull/14110) Respect `package.json#exports` when resolving plugins ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  * [#14153](https://github.com/babel/babel/pull/14153) Disable "Reentrant plugin detected" error in async mode ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* `babel-plugin-transform-runtime`
  * [#14157](https://github.com/babel/babel/pull/14157) Remove workaround for `_typeof` in runtime build script ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-parser`
  * [#14130](https://github.com/babel/babel/pull/14130) Improve errors location tracking ([@tolmasky](https://github.com/tolmasky))

#### :microscope: Output optimization
* `babel-helper-create-class-features-plugin`, `babel-preset-env`
  * [#14169](https://github.com/babel/babel/pull/14169) Skip class fields transform when not necessary for private methods ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.16.9 (2022-01-11)

#### :bug: Bug Fix
* `babel-register`
  * [#14136](https://github.com/babel/babel/pull/14136) Restore `@babel/register` compat with `@babel/core@7.5.x` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.16.8 (2022-01-10)

#### :bug: Bug Fix
* `babel-generator`, `babel-plugin-syntax-typescript`, `babel-plugin-transform-parameters`
  * [#14113](https://github.com/babel/babel/pull/14113) Print trailing comma after a single TS generic in arrow fns ([@ozanhonamlioglu](https://github.com/ozanhonamlioglu))
* `babel-traverse`
  * [#14105](https://github.com/babel/babel/pull/14105) fix: forward stop signal to parent path ([@JLHwung](https://github.com/JLHwung))
* `babel-register`
  * [#14107](https://github.com/babel/babel/pull/14107) Don't mutate `@babel/register` options ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-plugin-transform-modules-commonjs`
  * [#14097](https://github.com/babel/babel/pull/14097) Register binding for newly created vars for commonjs transforms ([@The-x-Theorist](https://github.com/The-x-Theorist))
* `babel-plugin-transform-typescript`
  * [#14093](https://github.com/babel/babel/pull/14093) Fix TypeScript Enum self-references ([@magic-akari](https://github.com/magic-akari))

#### :nail_care: Polish
* `babel-generator`
  * [#14094](https://github.com/babel/babel/pull/14094) Always print directives with double quotes when minified ([@overlookmotel](https://github.com/overlookmotel))

#### :house: Internal
* `babel-helper-fixtures`, `babel-plugin-proposal-record-and-tuple`, `babel-preset-env`
  * [#14118](https://github.com/babel/babel/pull/14118) Always use the plugin/preset name in fixtures options ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :microscope: Output optimization
* `babel-helper-remap-async-to-generator`, `babel-helper-wrap-function`, `babel-plugin-transform-async-to-generator`
  * [#14122](https://github.com/babel/babel/pull/14122) Optimize `transform-async-to-generator` output ([@magic-akari](https://github.com/magic-akari))
## v7.16.7 (2021-12-31)

#### :eyeglasses: Spec Compliance
* `babel-parser`
  * [#14049](https://github.com/babel/babel/pull/14049) fix: check preceding line break before exclamation ([@JLHwung](https://github.com/JLHwung))

#### :bug: Bug Fix
* `babel-plugin-transform-runtime`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`
  * [#14081](https://github.com/babel/babel/pull/14081) Import the correct `./typeof.js` helper in `@babel/runtime` ([@exb](https://github.com/exb))
* `babel-helpers`
  * [#14072](https://github.com/babel/babel/pull/14072) Fix derived classes in Chrome <= 36 ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-function-name`, `babel-plugin-transform-function-name`
  * [#14047](https://github.com/babel/babel/pull/14047) Fix unicode handling in generated function names ([@The-x-Theorist](https://github.com/The-x-Theorist))

#### :nail_care: Polish
* `babel-core`
  * [#14067](https://github.com/babel/babel/pull/14067) Allow `$schema` property in json config files ([@The-x-Theorist](https://github.com/The-x-Theorist))
## v7.16.6 (2021-12-14)

#### :bug: Bug Fix
* `babel-parser`
  * [#14055](https://github.com/babel/babel/pull/14055) fix: handle tokens for invalid template element ([@JLHwung](https://github.com/JLHwung))
## v7.16.5 (2021-12-13)

#### :eyeglasses: Spec Compliance
* `babel-cli`, `babel-core`, `babel-helpers`, `babel-plugin-proposal-class-properties`, `babel-plugin-proposal-decorators`, `babel-plugin-transform-classes`, `babel-plugin-transform-jscript`, `babel-plugin-transform-parameters`, `babel-plugin-transform-runtime`, `babel-plugin-transform-spread`, `babel-plugin-transform-typescript`, `babel-preset-env`
  * [#12115](https://github.com/babel/babel/pull/12115) Mark class prototype as read-only ([@wentout](https://github.com/wentout))

#### :bug: Bug Fix
* `babel-plugin-transform-parameters`
  * [#14032](https://github.com/babel/babel/pull/14032) Fix: default rest argument array elements as undefined ([@The-x-Theorist](https://github.com/The-x-Theorist))
* `babel-plugin-transform-arrow-functions`, `babel-traverse`
  * [#14036](https://github.com/babel/babel/pull/14036) Don't resolve shadowed `arguments` variables from functions ([@The-x-Theorist](https://github.com/The-x-Theorist))
* `babel-parser`
  * [#14039](https://github.com/babel/babel/pull/14039) maintain estree string literal shape when cloned ([@JLHwung](https://github.com/JLHwung))
* `babel-traverse`
  * [#14016](https://github.com/babel/babel/pull/14016) Fix duplicate declaration error on ambient class declarations ([@The-x-Theorist](https://github.com/The-x-Theorist))
* `babel-generator`
  * [#14014](https://github.com/babel/babel/pull/14014) Support flow function type annotation with no parent ([@krosenberg](https://github.com/krosenberg))
* `babel-plugin-transform-react-jsx`
  * [#14012](https://github.com/babel/babel/pull/14012) Fix JSX pragma anywhere in comment ([@The-x-Theorist](https://github.com/The-x-Theorist))
* `babel-helper-create-class-features-plugin`, `babel-helper-environment-visitor`, `babel-helper-member-expression-to-functions`, `babel-helper-module-transforms`, `babel-helper-replace-supers`, `babel-plugin-transform-classes`, `babel-traverse`
  * [#14005](https://github.com/babel/babel/pull/14005) Fix handling of `this`&co in computed keys in arrows transform ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :nail_care: Polish
* `babel-parser`
  * [#13968](https://github.com/babel/babel/pull/13968) Recover from shorthand assign exprs ([@JLHwung](https://github.com/JLHwung))
  * [#13975](https://github.com/babel/babel/pull/13975) fix: update UnexpectedPrivateField error message ([@JLHwung](https://github.com/JLHwung))

#### :memo: Documentation
* `babel-compat-data`, `babel-helper-annotate-as-pure`, `babel-helper-builder-binary-assignment-operator-visitor`, `babel-helper-builder-react-jsx`, `babel-helper-compilation-targets`, `babel-helper-create-class-features-plugin`, `babel-helper-create-regexp-features-plugin`, `babel-helper-define-map`, `babel-helper-explode-assignable-expression`, `babel-helper-fixtures`, `babel-helper-function-name`, `babel-helper-get-function-arity`, `babel-helper-hoist-variables`, `babel-helper-member-expression-to-functions`, `babel-helper-module-imports`, `babel-helper-module-transforms`, `babel-helper-optimise-call-expression`, `babel-helper-plugin-test-runner`, `babel-helper-plugin-utils`, `babel-helper-remap-async-to-generator`, `babel-helper-replace-supers`, `babel-helper-simple-access`, `babel-helper-skip-transparent-expression-wrappers`, `babel-helper-split-export-declaration`, `babel-helper-transform-fixture-test-runner`, `babel-helper-validator-identifier`, `babel-helper-validator-option`, `babel-helper-wrap-function`, `babel-plugin-bugfix-safari-id-destructuring-collision-in-function-expression`, `babel-plugin-bugfix-v8-spread-parameters-in-optional-chaining`, `babel-plugin-proposal-async-do-expressions`, `babel-plugin-proposal-record-and-tuple`, `babel-plugin-syntax-async-do-expressions`, `babel-plugin-syntax-module-blocks`, `babel-plugin-transform-react-jsx-development`, `babel-plugin-transform-react-pure-annotations`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`
  * [#14006](https://github.com/babel/babel/pull/14006) Regenerate monorepo READMEs ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* `babel-cli`, `babel-code-frame`, `babel-core`, `babel-generator`, `babel-helper-annotate-as-pure`, `babel-helper-compilation-targets`, `babel-helper-create-class-features-plugin`, `babel-helper-create-regexp-features-plugin`, `babel-helper-fixtures`, `babel-helper-module-imports`, `babel-helper-optimise-call-expression`, `babel-helper-plugin-test-runner`, `babel-helper-transform-fixture-test-runner`, `babel-helper-validator-identifier`, `babel-helper-validator-option`, `babel-helpers`, `babel-highlight`, `babel-node`, `babel-parser`, `babel-plugin-bugfix-safari-id-destructuring-collision-in-function-expression`, `babel-plugin-bugfix-v8-spread-parameters-in-optional-chaining`, `babel-plugin-external-helpers`, `babel-plugin-proposal-async-do-expressions`, `babel-plugin-proposal-async-generator-functions`, `babel-plugin-proposal-class-properties`, `babel-plugin-proposal-class-static-block`, `babel-plugin-proposal-decorators`, `babel-plugin-proposal-do-expressions`, `babel-plugin-proposal-dynamic-import`, `babel-plugin-proposal-export-default-from`, `babel-plugin-proposal-export-namespace-from`, `babel-plugin-proposal-function-bind`, `babel-plugin-proposal-function-sent`, `babel-plugin-proposal-json-strings`, `babel-plugin-proposal-logical-assignment-operators`, `babel-plugin-proposal-nullish-coalescing-operator`, `babel-plugin-proposal-numeric-separator`, `babel-plugin-proposal-object-rest-spread`, `babel-plugin-proposal-optional-catch-binding`, `babel-plugin-proposal-optional-chaining`, `babel-plugin-proposal-partial-application`, `babel-plugin-proposal-pipeline-operator`, `babel-plugin-proposal-private-methods`, `babel-plugin-proposal-private-property-in-object`, `babel-plugin-proposal-record-and-tuple`, `babel-plugin-proposal-throw-expressions`, `babel-plugin-proposal-unicode-property-regex`, `babel-plugin-syntax-decorators`, `babel-plugin-syntax-typescript`, `babel-plugin-transform-arrow-functions`, `babel-plugin-transform-async-to-generator`, `babel-plugin-transform-block-scoped-functions`, `babel-plugin-transform-block-scoping`, `babel-plugin-transform-classes`, `babel-plugin-transform-computed-properties`, `babel-plugin-transform-destructuring`, `babel-plugin-transform-dotall-regex`, `babel-plugin-transform-duplicate-keys`, `babel-plugin-transform-exponentiation-operator`, `babel-plugin-transform-flow-comments`, `babel-plugin-transform-flow-strip-types`, `babel-plugin-transform-for-of`, `babel-plugin-transform-function-name`, `babel-plugin-transform-instanceof`, `babel-plugin-transform-jscript`, `babel-plugin-transform-member-expression-literals`, `babel-plugin-transform-modules-amd`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-modules-systemjs`, `babel-plugin-transform-modules-umd`, `babel-plugin-transform-named-capturing-groups-regex`, `babel-plugin-transform-new-target`, `babel-plugin-transform-object-super`, `babel-plugin-transform-parameters`, `babel-plugin-transform-property-literals`, `babel-plugin-transform-property-mutators`, `babel-plugin-transform-proto-to-assign`, `babel-plugin-transform-react-constant-elements`, `babel-plugin-transform-react-display-name`, `babel-plugin-transform-react-inline-elements`, `babel-plugin-transform-react-jsx-compat`, `babel-plugin-transform-react-jsx-development`, `babel-plugin-transform-react-jsx-self`, `babel-plugin-transform-react-jsx-source`, `babel-plugin-transform-react-jsx`, `babel-plugin-transform-react-pure-annotations`, `babel-plugin-transform-regenerator`, `babel-plugin-transform-reserved-words`, `babel-plugin-transform-runtime`, `babel-plugin-transform-shorthand-properties`, `babel-plugin-transform-spread`, `babel-plugin-transform-sticky-regex`, `babel-plugin-transform-strict-mode`, `babel-plugin-transform-template-literals`, `babel-plugin-transform-typeof-symbol`, `babel-plugin-transform-typescript`, `babel-plugin-transform-unicode-escapes`, `babel-plugin-transform-unicode-regex`, `babel-preset-env`, `babel-preset-flow`, `babel-preset-react`, `babel-preset-typescript`, `babel-register`, `babel-standalone`, `babel-template`, `babel-traverse`, `babel-types`
  * [#13966](https://github.com/babel/babel/pull/13966) Run tests in a native Node.js ESM environment ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-parser`
  * [#13982](https://github.com/babel/babel/pull/13982) Extend `hasPlugin` to accept plugin-configuration array pairs ([@js-choi](https://github.com/js-choi))
* `babel-helpers`
  * [#13996](https://github.com/babel/babel/pull/13996) Don't use ESM for `require`d files in `@babel/helpers` tests ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-plugin-proposal-object-rest-spread`, `babel-traverse`
  * [#13948](https://github.com/babel/babel/pull/13948) Convert proposal-object-rest-spread to TS ([@JLHwung](https://github.com/JLHwung))
* `babel-parser`, `babel-plugin-bugfix-safari-id-destructuring-collision-in-function-expression`, `babel-plugin-bugfix-v8-spread-parameters-in-optional-chaining`, `babel-plugin-proposal-optional-chaining`, `babel-preset-react`, `babel-preset-typescript`
  * [#13978](https://github.com/babel/babel/pull/13978) Only bundle the release build, and don't import `src` in tests ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* Other
  * [#13976](https://github.com/babel/babel/pull/13976) Fail CI when `@babel/runtime` ESM tests fail ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :running_woman: Performance
* `babel-parser`
  * [#13919](https://github.com/babel/babel/pull/13919) Improve template tokenizing ([@JLHwung](https://github.com/JLHwung))

#### :microscope: Output optimization
* `babel-helpers`, `babel-plugin-proposal-async-generator-functions`, `babel-plugin-transform-runtime`, `babel-preset-env`, `babel-runtime-corejs2`, `babel-runtime`
  * [#13837](https://github.com/babel/babel/pull/13837) minify `helpers-generated.ts` ([@lightmare](https://github.com/lightmare))
## v7.16.4 (2021-11-16)

#### :eyeglasses: Spec Compliance
* `babel-helper-remap-async-to-generator`, `babel-plugin-transform-async-to-generator`
  * [#13961](https://github.com/babel/babel/pull/13961) Wait the correct number of ticks on nested `await` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-parser`
  * [#13929](https://github.com/babel/babel/pull/13929) Refactor bindingProperty parsing ([@JLHwung](https://github.com/JLHwung))

#### :bug: Bug Fix
* `babel-parser`
  * [#13957](https://github.com/babel/babel/pull/13957) Add `assertions` to `ExportNamedDeclaration` without `from` ([@sosukesuzuki](https://github.com/sosukesuzuki))
  * [#13951](https://github.com/babel/babel/pull/13951) Throw on duplicate `__proto__` props followed by assignment ([@The-x-Theorist](https://github.com/The-x-Theorist))
* `babel-plugin-proposal-async-generator-functions`, `babel-plugin-proposal-decorators`, `babel-plugin-transform-runtime`, `babel-preset-env`
  * [#12827](https://github.com/babel/babel/pull/12827) Add file extension when using `absoluteRuntime` ([@mbehzad](https://github.com/mbehzad))

#### :nail_care: Polish
* `babel-parser`
  * [#13960](https://github.com/babel/babel/pull/13960) Always expose `expressionValue` in `DirectiveLiteral` nodes ([@tolmasky](https://github.com/tolmasky))
## v7.16.3 (2021-11-09)

#### :bug: Bug Fix
* `babel-helpers`
  * [#13862](https://github.com/babel/babel/pull/13862) fix(helpers): match `Reflect.get` behaviour ([@lightmare](https://github.com/lightmare))
* `babel-plugin-transform-parameters`, `babel-traverse`
  * [#13941](https://github.com/babel/babel/pull/13941) Support transforming params of arrow functions in class fields ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-parser`
  * [#13928](https://github.com/babel/babel/pull/13928) fix: incorrect await rejection following arrow function in parameters (Closes [#13872](https://github.com/babel/babel/issues/13872)) ([@The-x-Theorist](https://github.com/The-x-Theorist))
* Other
  * [#13918](https://github.com/babel/babel/pull/13918) Fix `parserOverride` support in `@babel/eslint-parser` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* `babel-parser`
  * [#13891](https://github.com/babel/babel/pull/13891) Simplify tracking of valid JSX positions ([@JLHwung](https://github.com/JLHwung))
  * [#13892](https://github.com/babel/babel/pull/13892) extract tt.lt and tt.gt from tt.relation ([@JLHwung](https://github.com/JLHwung))
* `babel-helper-compilation-targets`, `babel-preset-env`
  * [#13914](https://github.com/babel/babel/pull/13914) Update browserslist ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v7.16.2 (2021-11-01)

#### :bug: Bug Fix
* `babel-plugin-bugfix-safari-id-destructuring-collision-in-function-expression`
  * [#13910](https://github.com/babel/babel/pull/13910) skip id-destructuring bugfix when binding info is not found ([@JLHwung](https://github.com/JLHwung))

#### :house: Internal
* `babel-parser`
  * [#13905](https://github.com/babel/babel/pull/13905) babel-parser: add missing assertions type ([@sosukesuzuki](https://github.com/sosukesuzuki))
## v7.16.1 (2021-10-30)

#### :bug: Bug Fix
* `babel-plugin-transform-typescript`
  * [#13900](https://github.com/babel/babel/pull/13900) Fix binding access for plugin-transform-typescript ([@PeachScript](https://github.com/PeachScript))

#### :house: Internal
* [#13898](https://github.com/babel/babel/pull/13898) Skip ESLint 8 tests on publish ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

## v7.16.0 (2021-10-30)

#### :eyeglasses: Spec Compliance

- `babel-helpers`, `babel-plugin-proposal-async-generator-functions`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`
  - [#13824](https://github.com/babel/babel/pull/13824) Await promises from sync iterators with `for-await` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :rocket: New Feature

- `babel-generator`, `babel-parser`, `babel-plugin-transform-typescript`, `babel-types`
  - [#13802](https://github.com/babel/babel/pull/13802) Support TypeScript 4.5 type-only import/export specifiers ([@sosukesuzuki](https://github.com/sosukesuzuki))
- `babel-parser`
  - [#13887](https://github.com/babel/babel/pull/13887) feat: support `startColumn` option ([@JLHwung](https://github.com/JLHwung))
- `babel-helper-fixtures`, `babel-helper-transform-fixture-test-runner`, `babel-parser`, `babel-plugin-syntax-typescript`, `babel-preset-typescript`
  - [#13838](https://github.com/babel/babel/pull/13838) Handle `.mts` and `.cts` files in `@babel/preset-typescript` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
- Other
  - [#13782](https://github.com/babel/babel/pull/13782) Add ESLint 8 support to `@babel/eslint-parser` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
- `babel-generator`, `babel-parser`, `babel-plugin-proposal-pipeline-operator`, `babel-plugin-syntax-pipeline-operator`
  - [#13749](https://github.com/babel/babel/pull/13749) Caret topic (pipe operator) ([@js-choi](https://github.com/js-choi))
- `babel-compat-data`, `babel-generator`, `babel-parser`, `babel-preset-env`, `babel-types`
  - [#13713](https://github.com/babel/babel/pull/13713) Enable class static blocks by default ([@sosukesuzuki](https://github.com/sosukesuzuki))
- `babel-helper-skip-transparent-expression-wrappers`, `babel-plugin-proposal-optional-chaining`
  - [#13687](https://github.com/babel/babel/pull/13687) add `skipTransparentExprWrapperNodes` helper ([@lightmare](https://github.com/lightmare))
- `babel-traverse`, `babel-types`
  - [#13666](https://github.com/babel/babel/pull/13666) Add aliases for Standardized, TypeScript, and Flow ([@jridgewell](https://github.com/jridgewell))

#### :bug: Bug Fix

- `babel-parser`, `babel-plugin-transform-typescript`
  - [#13876](https://github.com/babel/babel/pull/13876) [ts] Support private methods overloads ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
- `babel-plugin-transform-typescript`
  - [#13865](https://github.com/babel/babel/pull/13865) fix: allow enum member without initializer after non-literal member ([@lightmare](https://github.com/lightmare))
- `babel-core`, `babel-helper-create-class-features-plugin`, `babel-plugin-transform-typescript`
  - [#13854](https://github.com/babel/babel/pull/13854) Don't transform `declare class` in plugin-proposal-class-properties ([@forivall](https://github.com/forivall))
- `babel-compat-data`, `babel-plugin-bugfix-safari-id-destructuring-collision-in-function-expression`, `babel-plugin-bugfix-v8-spread-parameters-in-optional-chaining`, `babel-plugin-transform-react-constant-elements`, `babel-preset-env`, `babel-traverse`
  - [#13842](https://github.com/babel/babel/pull/13842) Implement @babel/plugin-bugfix-safari-id-destructuring-collision-in-function-expression ([@JLHwung](https://github.com/JLHwung))
- `babel-plugin-proposal-async-generator-functions`, `babel-traverse`
  - [#13813](https://github.com/babel/babel/pull/13813) Restore traversal context after enter / traverse ([@JLHwung](https://github.com/JLHwung))
- `babel-traverse`, `babel-types`
  - [#13832](https://github.com/babel/babel/pull/13832) Mark static block as FunctionParent ([@JLHwung](https://github.com/JLHwung))
- `babel-generator`
  - [#13825](https://github.com/babel/babel/pull/13825) Fix missing inner comments in function expressions ([@overlookmotel](https://github.com/overlookmotel))

#### :house: Internal

- _Every package_
  - [#13772](https://github.com/babel/babel/pull/13772) Use `workspace:^` to specify `@babel/` dependencies ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
- Other
  - [#13856](https://github.com/babel/babel/pull/13856) Update to Yarn 3.1 ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  - [#13867](https://github.com/babel/babel/pull/13867) Test on Node.js 17 ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
- `babel-helper-fixtures`, `babel-plugin-proposal-class-properties`, `babel-plugin-transform-runtime`, `babel-preset-react`
  - [#13858](https://github.com/babel/babel/pull/13858) Force loading plugins/presets from the monorepo in tests ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
- `babel-types`
  - [#13844](https://github.com/babel/babel/pull/13844) [ts] precise return type on `createTypeAnnotationBasedOnTypeof` (babel-types) ([@lightmare](https://github.com/lightmare))
- `babel-helpers`
  - [#13841](https://github.com/babel/babel/pull/13841) minor: remove ineffectual helper names filter ([@lightmare](https://github.com/lightmare))
- `babel-core`, `babel-plugin-transform-react-jsx-development`, `babel-plugin-transform-react-jsx`, `babel-types`
  - [#13820](https://github.com/babel/babel/pull/13820) Improve transform-react-jsx typings ([@JLHwung](https://github.com/JLHwung))

#### :running_woman: Performance

- `babel-types`
  - [#13843](https://github.com/babel/babel/pull/13843) Simplify (transpiled) babel-types builder wrappers ([@lightmare](https://github.com/lightmare))

## v7.15.8 (2021-10-06)

#### :eyeglasses: Spec Compliance

- `babel-helper-module-transforms`, `babel-plugin-transform-modules-amd`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-modules-umd`
  - [#13788](https://github.com/babel/babel/pull/13788) Sort module export names ([@JLHwung](https://github.com/JLHwung))
- `babel-parser`
  - [#13769](https://github.com/babel/babel/pull/13769) Tokenize keywords-like identifier as new tokens ([@JLHwung](https://github.com/JLHwung))

#### :bug: Bug Fix

- `babel-generator`
  - [#13821](https://github.com/babel/babel/pull/13821) Fix missing inner comments in class expressions ([@overlookmotel](https://github.com/overlookmotel))
- `babel-generator`, `babel-parser`, `babel-plugin-proposal-pipeline-operator`
  - [#13803](https://github.com/babel/babel/pull/13803) Collect comments around parentheses in expressions ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
- `babel-plugin-transform-typescript`
  - [#13800](https://github.com/babel/babel/pull/13800) fix: remove imported types from export ([@JLHwung](https://github.com/JLHwung))

#### :nail_care: Polish

- `babel-core`
  - [#13814](https://github.com/babel/babel/pull/13814) Improve debug logging for IgnoreList ([@paleite](https://github.com/paleite))
- `babel-node`
  - [#13784](https://github.com/babel/babel/pull/13784) [@babel/node] Forward the signal SIGTERM as well ([@julienw](https://github.com/julienw))

#### :house: Internal

- [#13808](https://github.com/babel/babel/pull/13808) Update parser plugins for TypeScript tests ([@sosukesuzuki](https://github.com/sosukesuzuki))
- [#13795](https://github.com/babel/babel/pull/13795) Fix Gulpfile path separator issue on Windows ([@NotWearingPants](https://github.com/NotWearingPants))

#### :running_woman: Performance

- `babel-code-frame`
  - [#13812](https://github.com/babel/babel/pull/13812) Optimization of string splitting ([@shoonia](https://github.com/shoonia))

## v7.15.7 (2021-09-17)

#### :bug: Bug Fix

- `babel-parser`
  - [#13771](https://github.com/babel/babel/pull/13771) fix(babel-parser): Allow line break before `assert` return type ([@JuniorTour](https://github.com/JuniorTour))
  - [#13755](https://github.com/babel/babel/pull/13755) [estree] Fix conversion of `PrivateName` in `MemberExpression` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
- `babel-standalone`
  - [#13754](https://github.com/babel/babel/pull/13754) Move pipeline operator to Stage 2 ([@sdegutis](https://github.com/sdegutis))
- Other
  - [#13767](https://github.com/babel/babel/pull/13767) Fix `regexpu-core` bundling in `@babel/standalone` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  - [#13751](https://github.com/babel/babel/pull/13751) [eslint-parser] Represent `static` using a `Keyword` token ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
- `babel-helper-validator-identifier`
  - [#13759](https://github.com/babel/babel/pull/13759) Update Identifier definitions to Unicode 14 ([@JLHwung](https://github.com/JLHwung))

#### :house: Internal

- `babel-parser`
  - [#13768](https://github.com/babel/babel/pull/13768) Store token type as number ([@JLHwung](https://github.com/JLHwung))
- `babel-helper-module-transforms`, `babel-plugin-transform-modules-commonjs`
  - [#13739](https://github.com/babel/babel/pull/13739) Throw a better error when transforming imported bindings in types ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
- Other
  - [#13140](https://github.com/babel/babel/pull/13140) Update to Yarn 3 ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  - [#13744](https://github.com/babel/babel/pull/13744) chore: add constraint for duplicate dependency declarations ([@merceyz](https://github.com/merceyz))
- `babel-helper-transform-fixture-test-runner`
  - [#13741](https://github.com/babel/babel/pull/13741) Replace the deprecated `produceCachedData` option used in `vm` module with `script.createCachedData()` ([@wafuwafu13](https://github.com/wafuwafu13))

## v7.15.6 (2021-09-09)

#### :eyeglasses: Spec Compliance

- `babel-parser`, `babel-plugin-proposal-pipeline-operator`
  - [#13668](https://github.com/babel/babel/pull/13668) Fix right precedence of Hack pipes ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :bug: Bug Fix

- `babel-parser`, `babel-plugin-proposal-pipeline-operator`
  - [#13668](https://github.com/babel/babel/pull/13668) Fix right precedence of Hack pipes ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
- `babel-plugin-proposal-object-rest-spread`
  - [#13711](https://github.com/babel/babel/pull/13711) fix: Duplicate function call in variable destructuring ([@dan-kez](https://github.com/dan-kez))
- `babel-types`
  - [#13733](https://github.com/babel/babel/pull/13733) id in import attributes should not be referenced ([@JLHwung](https://github.com/JLHwung))
- `babel-parser`
  - [#13731](https://github.com/babel/babel/pull/13731) fix(babel-parser): Fix end of `range` of `SequenceExpression` ([@sosukesuzuki](https://github.com/sosukesuzuki))

#### :house: Internal

- `babel-helper-transform-fixture-test-runner`
  - [#13738](https://github.com/babel/babel/pull/13738) Use `@types/node` for `vm` module ([@wafuwafu13](https://github.com/wafuwafu13))
- `babel-preset-env`
  - [#13737](https://github.com/babel/babel/pull/13737) Remove duplicate `dependency` and `devDependency` in preset-env ([@fyzhu](https://github.com/fyzhu))

## v7.15.5 (2021-09-04)

#### :eyeglasses: Spec Compliance

- `babel-parser`
  - [#13727](https://github.com/babel/babel/pull/13727) Disallow `#a in #b in c` and similar expressions ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :leftwards_arrow_with_hook: Revert

- `babel-core`
  - [#13732](https://github.com/babel/babel/pull/13732) Revert "fix: non breaking align options naming" ([@fedeci](https://github.com/fedeci))

## v7.15.4 (2021-09-02)

#### :eyeglasses: Spec Compliance

- `babel-helper-create-class-features-plugin`, `babel-helpers`, `babel-plugin-bugfix-v8-spread-parameters-in-optional-chaining`, `babel-plugin-proposal-async-generator-functions`, `babel-plugin-proposal-class-properties`, `babel-plugin-proposal-private-methods`, `babel-plugin-proposal-private-property-in-object`, `babel-preset-env`, `babel-runtime-corejs2`, `babel-runtime-corejs3`, `babel-runtime`
  - [#13601](https://github.com/babel/babel/pull/13601) Disallow reinitializing private elements ([@komyg](https://github.com/komyg))

#### :bug: Bug Fix

- [#13638](https://github.com/babel/babel/pull/13638) [eslint] Allow `"latest"` as `ecmaVersion` ([@fisker](https://github.com/fisker))
- `babel-traverse`, `babel-types`
  - [#13723](https://github.com/babel/babel/pull/13723) `getBindingIdentifiers` should return params for private methods ([@JLHwung](https://github.com/JLHwung))
- `babel-types`
  - [#13715](https://github.com/babel/babel/pull/13715) [babel 8] fix: stricter rest element builder check ([@JLHwung](https://github.com/JLHwung))
- `babel-helper-compilation-targets`
  - [#13697](https://github.com/babel/babel/pull/13697) fix: pass `browserslistEnv` to `resolveTargets` ([@meskill](https://github.com/meskill))
- `babel-helper-create-class-features-plugin`, `babel-plugin-proposal-class-properties`, `babel-plugin-proposal-private-property-in-object`
  - [#13656](https://github.com/babel/babel/pull/13656) fix: fix static private field shadowed by local variable ([@colinaaa](https://github.com/colinaaa))
- `babel-plugin-transform-typescript`
  - [#13664](https://github.com/babel/babel/pull/13664) [ts] Fix transform for nested namespaces shorthand syntax ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
- `babel-parser`
  - [#13680](https://github.com/babel/babel/pull/13680) fix(babel-parser): delete `static` property from class static block for TS ([@sosukesuzuki](https://github.com/sosukesuzuki))
  - [#13695](https://github.com/babel/babel/pull/13695) fix: assure left bracket is not consumed after dot ([@JLHwung](https://github.com/JLHwung))
- `babel-core`
  - [#13532](https://github.com/babel/babel/pull/13532) fix: non breaking align options naming ([@fedeci](https://github.com/fedeci))

#### :memo: Documentation

- `babel-parser`
  - [#13691](https://github.com/babel/babel/pull/13691) add missing ExportNamespaceSpecifier in spec.md ([@flyinox](https://github.com/flyinox))

#### :house: Internal

- `babel-helper-create-class-features-plugin`, `babel-plugin-proposal-class-static-block`, `babel-plugin-proposal-private-property-in-object`, `babel-plugin-syntax-class-static-block`, `babel-plugin-syntax-private-property-in-object`, `babel-plugin-syntax-top-level-await`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-modules-systemjs`, `babel-preset-env`, `babel-standalone`
  - [#13717](https://github.com/babel/babel/pull/13717) archive stage 4 parser plugins ([@JLHwung](https://github.com/JLHwung))

#### :running_woman: Performance

- `babel-core`, `babel-generator`, `babel-helper-annotate-as-pure`, `babel-helper-builder-binary-assignment-operator-visitor`, `babel-helper-builder-react-jsx`, `babel-helper-define-map`, `babel-helper-explode-assignable-expression`, `babel-helper-function-name`, `babel-helper-get-function-arity`, `babel-helper-hoist-variables`, `babel-helper-member-expression-to-functions`, `babel-helper-module-imports`, `babel-helper-module-transforms`, `babel-helper-optimise-call-expression`, `babel-helper-remap-async-to-generator`, `babel-helper-replace-supers`, `babel-helper-simple-access`, `babel-helper-skip-transparent-expression-wrappers`, `babel-helper-split-export-declaration`, `babel-helper-wrap-function`, `babel-helpers`, `babel-preset-env`, `babel-template`, `babel-traverse`
  - [#13685](https://github.com/babel/babel/pull/13685) Use named imports for babel types ([@JLHwung](https://github.com/JLHwung))
- `babel-cli`, `babel-helper-define-map`, `babel-helpers`, `babel-node`, `babel-parser`, `babel-plugin-proposal-async-generator-functions`, `babel-plugin-proposal-decorators`, `babel-plugin-transform-classes`, `babel-plugin-transform-for-of`, `babel-plugin-transform-modules-systemjs`, `babel-plugin-transform-parameters`, `babel-traverse`, `babel-types`
  - [#13609](https://github.com/babel/babel/pull/13609) perf: partially replace `.concat` with `.push` ([@fedeci](https://github.com/fedeci))

## v7.15.3 (2021-08-11)

#### :eyeglasses: Spec Compliance

- `babel-helpers`, `babel-plugin-transform-classes`
  - [#13571](https://github.com/babel/babel/pull/13571) Derived constructors should not be allowed to return primitives ([@dhrubesh](https://github.com/dhrubesh))

#### :bug: Bug Fix

- `babel-parser`
  - [#13659](https://github.com/babel/babel/pull/13659) Fix parse error when using named import "as" with flow parser ([@doing-art](https://github.com/doing-art))
  - [#13655](https://github.com/babel/babel/pull/13655) [flow] Fix parsing of arrows in conditional expressions in parentheses ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  - [#13645](https://github.com/babel/babel/pull/13645) Disallow `<T>(a => b)` when parsing Flow ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  - [#13657](https://github.com/babel/babel/pull/13657) fix(parser): add `attachComment` to `ParserOptions` type ([@sosukesuzuki](https://github.com/sosukesuzuki))

#### :house: Internal

- [#13643](https://github.com/babel/babel/pull/13643) Use `@babel/eslint-parser/experimental-worker` for our own repo ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :running_woman: Performance

- `babel-parser`
  - [#13652](https://github.com/babel/babel/pull/13652) perf: minor tokenizer tweaks ([@lightmare](https://github.com/lightmare))
- `babel-register`
  - [#13654](https://github.com/babel/babel/pull/13654) Reduce stat calls in register ([@overlookmotel](https://github.com/overlookmotel))

## v7.15.2 (2021-08-08)

#### :bug: Bug Fix

- `babel-parser`
  - [#13653](https://github.com/babel/babel/pull/13653) Add `.errors` to the `@babel/parser` return type definitions ([@sosukesuzuki](https://github.com/sosukesuzuki))
  - [#13641](https://github.com/babel/babel/pull/13641) Fix array destructuring elision parsing in TS arrow functions ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

## v7.15.1 (2021-08-05)

#### :leftwards_arrow_with_hook: Revert

- `babel-plugin-transform-react-display-name`
  - [#13637](https://github.com/babel/babel/pull/13637) Revert "Add display name after create context (#13501)" ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

## v7.15.0 (2021-08-04)

#### :eyeglasses: Spec Compliance

- `babel-parser`
  - [#13523](https://github.com/babel/babel/pull/13523) feat(ts): raise error for abstract property with initializer ([@fedeci](https://github.com/fedeci))

#### :rocket: New Feature

- `babel-parser`
  - [#13229](https://github.com/babel/babel/pull/13229) Add `attachComment` parser option to disable comment attachment ([@JLHwung](https://github.com/JLHwung))
- `babel-standalone`
  - [#13476](https://github.com/babel/babel/pull/13476) standalone: update `preset-stage-*` ([@sosukesuzuki](https://github.com/sosukesuzuki))
  - [#13555](https://github.com/babel/babel/pull/13555) feat: support hack pipeline in `@babel/standalone` ([@JLHwung](https://github.com/JLHwung))
- `babel-parser`, `babel-preset-env`
  - [#13387](https://github.com/babel/babel/pull/13387) Enable top-level `await` parsing by default ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
- `babel-plugin-transform-typescript`, `babel-preset-typescript`
  - [#13324](https://github.com/babel/babel/pull/13324) Support TypeScript const enums ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
- `babel-plugin-transform-typescript`
  - [#13528](https://github.com/babel/babel/pull/13528) feat(typescript): implement namespace alias ([@colinaaa](https://github.com/colinaaa))
- `babel-core`, `babel-helper-create-class-features-plugin`, `babel-helper-module-transforms`, `babel-plugin-transform-modules-commonjs`
  - [#13290](https://github.com/babel/babel/pull/13290) feat: add `noIncompleteNsImportDetection` assumption to `plugin-transform-modules-commonjs` ([@fedeci](https://github.com/fedeci))
- `babel-plugin-transform-react-display-name`
  - [#13501](https://github.com/babel/babel/pull/13501) Add display name after create context ([@JLHwung](https://github.com/JLHwung))
- `babel-parser`, `babel-plugin-proposal-pipeline-operator`, `babel-plugin-syntax-pipeline-operator`
  - [#13416](https://github.com/babel/babel/pull/13416) Hack-pipe proposal with `%` topic token ([@js-choi](https://github.com/js-choi))
- `babel-generator`, `babel-parser`, `babel-plugin-proposal-pipeline-operator`, `babel-plugin-syntax-pipeline-operator`, `babel-traverse`, `babel-types`
  - [#13191](https://github.com/babel/babel/pull/13191) Add support for the "Hack" pipeline proposal ([@js-choi](https://github.com/js-choi))
- `babel-plugin-transform-runtime`
  - [#13398](https://github.com/babel/babel/pull/13398) Expose `@babel/eslint-parser/experimental-worker` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
- `babel-compat-data`, `babel-helper-compilation-targets`, `babel-preset-env`
  - [#13448](https://github.com/babel/babel/pull/13448) Add support for rhino as a compilation target ([@gausie](https://github.com/gausie))
- `babel-compat-data`, `babel-parser`, `babel-preset-env`
  - [#13554](https://github.com/babel/babel/pull/13554) Enable ergonomic brand checks (`#priv in`) by default ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :bug: Bug Fix

- `babel-parser`, `babel-plugin-transform-typescript`
  - [#13513](https://github.com/babel/babel/pull/13513) [ts] support optional chain call with generic ([@lala7573](https://github.com/lala7573))
- `babel-plugin-transform-typescript`
  - [#13605](https://github.com/babel/babel/pull/13605) Handle typescript function overloading in a default export ([@tony-go](https://github.com/tony-go))
- `babel-parser`
  - [#13536](https://github.com/babel/babel/pull/13536) Fix `%==` parsing in hack pipes ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  - [#13426](https://github.com/babel/babel/pull/13426) parser: Fix Hack/smart-pipe error positions ([@js-choi](https://github.com/js-choi))
  - [#13622](https://github.com/babel/babel/pull/13622) fix(ts): raise error for `export default interface {}` ([@a-tarasyuk](https://github.com/a-tarasyuk))

#### :memo: Documentation

- [#13607](https://github.com/babel/babel/pull/13607) chore(doc): add jest specific pckg command ([@tony-go](https://github.com/tony-go))

---

- See [CHANGELOG - v7.0.0 to v7.14.9](/.github/CHANGELOG-v7.0.0-v7.14.9.md) for v7.0.0 to v7.14.9 changes.
- See [CHANGELOG - v7 prereleases](/.github/CHANGELOG-v7-prereleases.md) for v7.0.0-alpha.1 to v7.0.0-rc.4 changes.

We have to split the v7 changelog in multiple files otherwise it's too big to render on GitHub.
