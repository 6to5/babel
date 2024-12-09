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

This file contains the changelog starting from v8.0.0-alpha.0.

<!-- DO NOT CHANGE THESE COMMENTS -->
<!-- insert-new-changelog-here -->
## v8.0.0-alpha.14 (2024-12-06)

#### :boom: Breaking Change
* `babel-generator`, `babel-parser`, `babel-types`
  * [#17008](https://github.com/babel/babel/pull/17008) Rename `TSTypeReference.typeParameters` to `typeArguments` ([@JLHwung](https://github.com/JLHwung))
  * [#16952](https://github.com/babel/babel/pull/16952) [Babel 8] Remove `TSModuleDeclaration.global` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-generator`, `babel-parser`, `babel-plugin-transform-flow-comments`, `babel-plugin-transform-typescript`, `babel-types`
  * [#16997](https://github.com/babel/babel/pull/16997) [babel 8] Rename `superTypeParameters` -> `superTypeArguments` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-generator`, `babel-parser`, `babel-plugin-transform-typescript`, `babel-types`
  * [#16982](https://github.com/babel/babel/pull/16982) [Babel 8] Use `TSQualifiedName` for `namespace X.Y {}`'s name ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :bug: Bug Fix
* Other
  * [#17010](https://github.com/babel/babel/pull/17010) fix: build updated babel-type helpers ([@JLHwung](https://github.com/JLHwung))
* `babel-preset-react`, `babel-standalone`
  * [#16927](https://github.com/babel/babel/pull/16927) [react] Make `development` option default to the configured env ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* `babel-cli`, `babel-helper-transform-fixture-test-runner`
  * [#17007](https://github.com/babel/babel/pull/17007) fix: migrate to dirent.parentPath ([@JLHwung](https://github.com/JLHwung))
## v8.0.0-alpha.13 (2024-10-25)

#### :boom: Breaking Change
* `babel-core`, `babel-generator`, `babel-parser`, `babel-plugin-syntax-import-assertions`, `babel-plugin-syntax-import-attributes`, `babel-preset-env`, `babel-standalone`, `babel-types`
  * [#16850](https://github.com/babel/babel/pull/16850) Enable import attributes parsing by default ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-generator`, `babel-parser`, `babel-plugin-transform-typescript`, `babel-traverse`, `babel-types`
  * [#16731](https://github.com/babel/babel/pull/16731) Add `TSClassImplements|TSInterfaceHeritage` and rename `TsExpressionWithTypeArguments` in Babel 8 ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-generator`, `babel-parser`, `babel-plugin-proposal-pipeline-operator`, `babel-plugin-syntax-pipeline-operator`, `babel-standalone`
  * [#16801](https://github.com/babel/babel/pull/16801) [Babel 8] Remove `minimal,smart` option of Pipeline Operator ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-parser`
  * [#16813](https://github.com/babel/babel/pull/16813) [Flow] Drop support for annotations inside array patterns ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-plugin-transform-class-static-block`, `babel-plugin-transform-destructuring`, `babel-plugin-transform-spread`, `babel-traverse`
  * [#16705](https://github.com/babel/babel/pull/16705) [Babel 8] Remove some `Scope` methods ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-generator`, `babel-parser`, `babel-plugin-proposal-import-wasm-source`, `babel-template`, `babel-types`
  * [#16770](https://github.com/babel/babel/pull/16770) Remove `importAssertions` parser plugin ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-generator`, `babel-parser`, `babel-standalone`
  * [#16808](https://github.com/babel/babel/pull/16808) Remove `importReflection` parser plugin ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-generator`, `babel-traverse`, `babel-types`
  * [#16807](https://github.com/babel/babel/pull/16807) [Babel 8] Remove `DecimalLiteral` AST ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-generator`, `babel-parser`, `babel-plugin-proposal-destructuring-private`, `babel-plugin-syntax-decimal`, `babel-standalone`
  * [#16741](https://github.com/babel/babel/pull/16741) [Babel 8] Remove `decimal` from parser ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-generator`, `babel-parser`, `babel-types`
  * [#16733](https://github.com/babel/babel/pull/16733) [Babel 8] Split `typeParameter` of `TSMappedType` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-plugin-proposal-async-do-expressions`, `babel-traverse`
  * [#16655](https://github.com/babel/babel/pull/16655) Remove some `NodePath` methods ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :rocket: New Feature
* `babel-parser`, `babel-plugin-syntax-flow`, `babel-preset-typescript`
  * [#16792](https://github.com/babel/babel/pull/16792) [Babel 8] Remove `enums` option of flow plugin ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :bug: Bug Fix
* `babel-core`
  * [#16925](https://github.com/babel/babel/pull/16925) Only parse # as comment in .babelignore at line start ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-template`, `babel-types`
  * [#16830](https://github.com/babel/babel/pull/16830) fix: ObjectPattern used as id inside for-of ([@coderaiser](https://github.com/coderaiser))
* `babel-plugin-transform-async-generator-functions`, `babel-plugin-transform-block-scoped-functions`, `babel-plugin-transform-block-scoping`
  * [#16398](https://github.com/babel/babel/pull/16398) Refactor `transform-block-scoped-function` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-helper-transform-fixture-test-runner`, `babel-node`
  * [#16706](https://github.com/babel/babel/pull/16706) [babel 8] Align `@babel/node` args parsing to Node.js ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-parser`
  * [#16668](https://github.com/babel/babel/pull/16668) [Babel 8] Fix spelling of error code ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :nail_care: Polish
* `babel-core`
  * [#16836](https://github.com/babel/babel/pull/16836) [Babel 8] fix: Throwing exceptions synchronously ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :house: Internal
* `babel-generator`, `babel-helper-create-class-features-plugin`, `babel-helper-module-transforms`, `babel-plugin-proposal-destructuring-private`, `babel-plugin-transform-destructuring`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-object-rest-spread`, `babel-plugin-transform-parameters`, `babel-traverse`, `babel-types`
  * [#16817](https://github.com/babel/babel/pull/16817) Remove `BABEL_TYPES_8_BREAKING` flag and enable it by default ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-cli`, `babel-code-frame`, `babel-compat-data`, `babel-core`, `babel-generator`, `babel-helper-annotate-as-pure`, `babel-helper-builder-binary-assignment-operator-visitor`, `babel-helper-builder-react-jsx`, `babel-helper-check-duplicate-nodes`, `babel-helper-compilation-targets`, `babel-helper-create-class-features-plugin`, `babel-helper-create-regexp-features-plugin`, `babel-helper-fixtures`, `babel-helper-import-to-platform-api`, `babel-helper-member-expression-to-functions`, `babel-helper-module-imports`, `babel-helper-module-transforms`, `babel-helper-optimise-call-expression`, `babel-helper-plugin-test-runner`, `babel-helper-plugin-utils`, `babel-helper-remap-async-to-generator`, `babel-helper-replace-supers`, `babel-helper-simple-access`, `babel-helper-skip-transparent-expression-wrappers`, `babel-helper-string-parser`, `babel-helper-transform-fixture-test-runner`, `babel-helper-validator-identifier`, `babel-helper-validator-option`, `babel-helper-wrap-function`, `babel-helpers`, `babel-highlight`, `babel-node`, `babel-parser`, `babel-plugin-bugfix-firefox-class-in-computed-class-key`, `babel-plugin-bugfix-safari-class-field-initializer-scope`, `babel-plugin-bugfix-safari-id-destructuring-collision-in-function-expression`, `babel-plugin-bugfix-v8-spread-parameters-in-optional-chaining`, `babel-plugin-bugfix-v8-static-class-fields-redefine-readonly`, `babel-plugin-external-helpers`, `babel-plugin-proposal-async-do-expressions`, `babel-plugin-proposal-decorators`, `babel-plugin-proposal-destructuring-private`, `babel-plugin-proposal-do-expressions`, `babel-plugin-proposal-explicit-resource-management`, `babel-plugin-proposal-export-default-from`, `babel-plugin-proposal-function-bind`, `babel-plugin-proposal-function-sent`, `babel-plugin-proposal-import-attributes-to-assertions`, `babel-plugin-proposal-import-defer`, `babel-plugin-proposal-import-wasm-source`, `babel-plugin-proposal-json-modules`, `babel-plugin-proposal-optional-chaining-assign`, `babel-plugin-proposal-partial-application`, `babel-plugin-proposal-pipeline-operator`, `babel-plugin-proposal-record-and-tuple`, `babel-plugin-proposal-regexp-modifiers`, `babel-plugin-proposal-throw-expressions`, `babel-plugin-syntax-async-do-expressions`, `babel-plugin-syntax-decimal`, `babel-plugin-syntax-decorators`, `babel-plugin-syntax-destructuring-private`, `babel-plugin-syntax-do-expressions`, `babel-plugin-syntax-explicit-resource-management`, `babel-plugin-syntax-export-default-from`, `babel-plugin-syntax-flow`, `babel-plugin-syntax-function-bind`, `babel-plugin-syntax-function-sent`, `babel-plugin-syntax-import-assertions`, `babel-plugin-syntax-import-attributes`, `babel-plugin-syntax-import-defer`, `babel-plugin-syntax-import-reflection`, `babel-plugin-syntax-import-source`, `babel-plugin-syntax-jsx`, `babel-plugin-syntax-module-blocks`, `babel-plugin-syntax-optional-chaining-assign`, `babel-plugin-syntax-partial-application`, `babel-plugin-syntax-pipeline-operator`, `babel-plugin-syntax-record-and-tuple`, `babel-plugin-syntax-throw-expressions`, `babel-plugin-syntax-typescript`, `babel-plugin-transform-arrow-functions`, `babel-plugin-transform-async-generator-functions`, `babel-plugin-transform-async-to-generator`, `babel-plugin-transform-block-scoped-functions`, `babel-plugin-transform-block-scoping`, `babel-plugin-transform-class-properties`, `babel-plugin-transform-class-static-block`, `babel-plugin-transform-classes`, `babel-plugin-transform-computed-properties`, `babel-plugin-transform-destructuring`, `babel-plugin-transform-dotall-regex`, `babel-plugin-transform-duplicate-keys`, `babel-plugin-transform-duplicate-named-capturing-groups-regex`, `babel-plugin-transform-dynamic-import`, `babel-plugin-transform-exponentiation-operator`, `babel-plugin-transform-export-namespace-from`, `babel-plugin-transform-flow-comments`, `babel-plugin-transform-flow-strip-types`, `babel-plugin-transform-for-of`, `babel-plugin-transform-function-name`, `babel-plugin-transform-instanceof`, `babel-plugin-transform-jscript`, `babel-plugin-transform-json-strings`, `babel-plugin-transform-literals`, `babel-plugin-transform-logical-assignment-operators`, `babel-plugin-transform-member-expression-literals`, `babel-plugin-transform-modules-amd`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-modules-systemjs`, `babel-plugin-transform-modules-umd`, `babel-plugin-transform-named-capturing-groups-regex`, `babel-plugin-transform-new-target`, `babel-plugin-transform-nullish-coalescing-operator`, `babel-plugin-transform-numeric-separator`, `babel-plugin-transform-object-assign`, `babel-plugin-transform-object-rest-spread`, `babel-plugin-transform-object-set-prototype-of-to-assign`, `babel-plugin-transform-object-super`, `babel-plugin-transform-optional-catch-binding`, `babel-plugin-transform-optional-chaining`, `babel-plugin-transform-parameters`, `babel-plugin-transform-private-methods`, `babel-plugin-transform-private-property-in-object`, `babel-plugin-transform-property-literals`, `babel-plugin-transform-property-mutators`, `babel-plugin-transform-proto-to-assign`, `babel-plugin-transform-react-constant-elements`, `babel-plugin-transform-react-display-name`, `babel-plugin-transform-react-inline-elements`, `babel-plugin-transform-react-jsx-compat`, `babel-plugin-transform-react-jsx-development`, `babel-plugin-transform-react-jsx-self`, `babel-plugin-transform-react-jsx-source`, `babel-plugin-transform-react-jsx`, `babel-plugin-transform-react-pure-annotations`, `babel-plugin-transform-regenerator`, `babel-plugin-transform-reserved-words`, `babel-plugin-transform-runtime`, `babel-plugin-transform-shorthand-properties`, `babel-plugin-transform-spread`, `babel-plugin-transform-sticky-regex`, `babel-plugin-transform-strict-mode`, `babel-plugin-transform-template-literals`, `babel-plugin-transform-typeof-symbol`, `babel-plugin-transform-typescript`, `babel-plugin-transform-unicode-escapes`, `babel-plugin-transform-unicode-property-regex`, `babel-plugin-transform-unicode-regex`, `babel-plugin-transform-unicode-sets-regex`, `babel-preset-env`, `babel-preset-flow`, `babel-preset-react`, `babel-preset-typescript`, `babel-register`, `babel-runtime-corejs3`, `babel-runtime`, `babel-standalone`, `babel-template`, `babel-traverse`, `babel-types`
  * [#16800](https://github.com/babel/babel/pull/16800) [babel 8] Require Node.js `^18.20.0 || ^20.17.0 || >=22.8.0` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-generator`, `babel-parser`, `babel-plugin-bugfix-v8-spread-parameters-in-optional-chaining`, `babel-plugin-syntax-typescript`, `babel-plugin-transform-class-properties`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-private-methods`, `babel-plugin-transform-unicode-sets-regex`, `babel-traverse`
  * [#16572](https://github.com/babel/babel/pull/16572) Clean all always enabled parser plugins ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v8.0.0-alpha.12 (2024-07-26)

#### :boom: Breaking Change
* `babel-traverse`
  * [#16504](https://github.com/babel/babel/pull/16504) [babel 8] Remove methods starting with `_` in `@babel/traverse` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v8.0.0-alpha.11 (2024-06-07)

#### :boom: Breaking Change
* `babel-core`
  * [#16561](https://github.com/babel/babel/pull/16561) [babel 8] Remove `File.prototype.getModuleName` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v8.0.0-alpha.10 (2024-06-04)

#### :bug: Bug Fix
* `babel-traverse`, `babel-types`
  * [#16544](https://github.com/babel/babel/pull/16544) Improve `getBindingIdentifiers` ([@JLHwung](https://github.com/JLHwung))
* `babel-cli`, `babel-node`
  * [#16548](https://github.com/babel/babel/pull/16548) fix Babel 8 commander import ([@JLHwung](https://github.com/JLHwung))
## v8.0.0-alpha.9 (2024-06-03)

#### :boom: Breaking Change
* `babel-parser`, `babel-traverse`
  * [#16521](https://github.com/babel/babel/pull/16521) [Babel 8] Remove `extra.shorthand` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-generator`, `babel-parser`, `babel-plugin-proposal-pipeline-operator`, `babel-plugin-proposal-record-and-tuple`, `babel-plugin-syntax-record-and-tuple`, `babel-standalone`, `babel-traverse`
  * [#16458](https://github.com/babel/babel/pull/16458) Remove `syntaxType` option for record-and-tuple (parser&plugin) ([@JLHwung](https://github.com/JLHwung))
* _Every package_
  * [#16457](https://github.com/babel/babel/pull/16457) [babel 8] Require Node.js `^18.20.0 || ^20.10.0 || >=21.0.0` ([@JLHwung](https://github.com/JLHwung))

#### :rocket: New Feature
* _Every package_
  * [#16416](https://github.com/babel/babel/pull/16416) [babel 8] Publish `.d.ts` files for every package ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :house: Internal
* _Every package_
  * [#16494](https://github.com/babel/babel/pull/16494) Only import types from declared dependencies ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-cli`, `babel-node`
  * [#16517](https://github.com/babel/babel/pull/16517) [Babel 8] Bump commander to 12.1.0 ([@JLHwung](https://github.com/JLHwung))
* `babel-cli`, `babel-helper-transform-fixture-test-runner`
  * [#16459](https://github.com/babel/babel/pull/16459) [Babel 8] Use more native fs methods ([@JLHwung](https://github.com/JLHwung))
* `babel-cli`
  * [#16450](https://github.com/babel/babel/pull/16450) Bump glob to 10.3.12 ([@JLHwung](https://github.com/JLHwung))
## v8.0.0-alpha.8 (2024-04-04)

#### :boom: Breaking Change
* `babel-plugin-transform-runtime`, `babel-runtime-corejs3`
  * [#16347](https://github.com/babel/babel/pull/16347) Remove core-js and regenerator entrypoints from `@babel/runtime-*` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-plugin-transform-runtime`
  * [#16346](https://github.com/babel/babel/pull/16346) Remove `./helpers/esm` exports from `@babel/runtime` and drop Node.js 13.0-13.1 ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-plugin-transform-runtime`, `babel-plugin-transform-typeof-symbol`, `babel-runtime-corejs2`
  * [#16311](https://github.com/babel/babel/pull/16311) [babel 8] Cleanup `plugin-transform-runtime` options ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :nail_care: Polish
* `babel-plugin-transform-typescript`
  * [#16396](https://github.com/babel/babel/pull/16396) [babel 8] Turn `const enum`s into `const` variables ([@samualtnorman](https://github.com/samualtnorman))

#### :house: Internal
* `babel-core`
  * [#16365](https://github.com/babel/babel/pull/16365) [babel 8] Remove `import_` fallback ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helpers`, `babel-plugin-transform-async-generator-functions`, `babel-plugin-transform-class-properties`, `babel-plugin-transform-class-static-block`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-modules-systemjs`, `babel-plugin-transform-regenerator`, `babel-plugin-transform-runtime`, `babel-preset-env`, `babel-runtime-corejs3`, `babel-runtime`, `babel-standalone`
  * [#16323](https://github.com/babel/babel/pull/16323) Allow separate helpers to be excluded in Babel 8 ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-helper-plugin-test-runner`
  * [#16330](https://github.com/babel/babel/pull/16330) Add missing `"type": "module"` to helper-plugin-test-runner ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-compat-data`, `babel-plugin-transform-object-rest-spread`, `babel-preset-env`
  * [#16318](https://github.com/babel/babel/pull/16318) [babel 8] Fix `@babel/compat-data` package.json ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v8.0.0-alpha.7 (2024-02-28)

#### :house: Internal
* `babel-helper-create-class-features-plugin`, `babel-plugin-proposal-decorators`
  * [#16256](https://github.com/babel/babel/pull/16256) Remove logic for deprecated decorator versions from Babel 8 ([@JLHwung](https://github.com/JLHwung))
* `babel-core`, `babel-helper-fixtures`, `babel-helper-plugin-utils`, `babel-helper-transform-fixture-test-runner`, `babel-parser`, `babel-plugin-transform-runtime`, `babel-preset-env`, `babel-standalone`, `babel-template`, `babel-traverse`, `babel-types`
  * [#16248](https://github.com/babel/babel/pull/16248) Use `Object.hasOwn` when available ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-core`, `babel-plugin-transform-object-rest-spread`
  * [#16209](https://github.com/babel/babel/pull/16209) chore: Helper changes for Babel 8 ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v8.0.0-alpha.6 (2024-01-26)

#### :nail_care: Polish
* `babel-register`
  * [#16005](https://github.com/babel/babel/pull/16005) Use `@cspotcode/source-map-support` in `@babel/register` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
## v8.0.0-alpha.5 (2023-12-11)

#### :boom: Breaking Change
* `babel-plugin-transform-runtime`
  * [#16141](https://github.com/babel/babel/pull/16141) [babel 8] Remove `useESModules` option ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  * [#16063](https://github.com/babel/babel/pull/16063) [babel 8] Remove core-js@2 & regenerator from transform-runtime ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-create-class-features-plugin`, `babel-plugin-transform-flow-comments`, `babel-plugin-transform-flow-strip-types`, `babel-preset-env`
  * [#16043](https://github.com/babel/babel/pull/16043) [babel 8] Remove `loose` and `spec` options from `preset-env` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-core`, `babel-generator`, `babel-types`
  * [#16126](https://github.com/babel/babel/pull/16126) [babel 8] Remove `CodeGenerator` from `@babel/generator` ([@liuxingbaoyu](https://github.com/liuxingbaoyu))
* `babel-parser`
  * [#16114](https://github.com/babel/babel/pull/16114) Breaking: parserOpts.createImportExpressions defaults to true ([@JLHwung](https://github.com/JLHwung))
* `babel-traverse`, `babel-types`
  * [#16057](https://github.com/babel/babel/pull/16057) [babel 8] Inline `toSequenceExpression` into `@babel/traverse` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-preset-env`
  * [#15989](https://github.com/babel/babel/pull/15989) [babel 8] Remove `getModulesPluginNames` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-core`, `babel-preset-env`
  * [#15838](https://github.com/babel/babel/pull/15838) [babel 8] Remove core-js 2 and regenerator from preset-env ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :nail_care: Polish
* `babel-helper-validator-option`, `babel-plugin-transform-object-rest-spread`, `babel-plugin-transform-runtime`, `babel-preset-env`, `babel-standalone`
  * [#16095](https://github.com/babel/babel/pull/16095) [babel 8] Enforce specifying proper core-js version ([@liuxingbaoyu](https://github.com/liuxingbaoyu))

#### :house: Internal
* `babel-core`, `babel-plugin-bugfix-safari-id-destructuring-collision-in-function-expression`, `babel-plugin-bugfix-v8-spread-parameters-in-optional-chaining`, `babel-plugin-external-helpers`, `babel-plugin-proposal-async-do-expressions`, `babel-plugin-proposal-decorators`, `babel-plugin-proposal-destructuring-private`, `babel-plugin-proposal-do-expressions`, `babel-plugin-proposal-duplicate-named-capturing-groups-regex`, `babel-plugin-proposal-explicit-resource-management`, `babel-plugin-proposal-export-default-from`, `babel-plugin-proposal-function-bind`, `babel-plugin-proposal-function-sent`, `babel-plugin-proposal-import-attributes-to-assertions`, `babel-plugin-proposal-partial-application`, `babel-plugin-proposal-pipeline-operator`, `babel-plugin-proposal-record-and-tuple`, `babel-plugin-proposal-regexp-modifiers`, `babel-plugin-proposal-throw-expressions`, `babel-plugin-syntax-async-do-expressions`, `babel-plugin-syntax-decimal`, `babel-plugin-syntax-decorators`, `babel-plugin-syntax-destructuring-private`, `babel-plugin-syntax-do-expressions`, `babel-plugin-syntax-explicit-resource-management`, `babel-plugin-syntax-export-default-from`, `babel-plugin-syntax-flow`, `babel-plugin-syntax-function-bind`, `babel-plugin-syntax-function-sent`, `babel-plugin-syntax-import-assertions`, `babel-plugin-syntax-import-attributes`, `babel-plugin-syntax-import-reflection`, `babel-plugin-syntax-jsx`, `babel-plugin-syntax-module-blocks`, `babel-plugin-syntax-partial-application`, `babel-plugin-syntax-pipeline-operator`, `babel-plugin-syntax-record-and-tuple`, `babel-plugin-syntax-throw-expressions`, `babel-plugin-syntax-typescript`, `babel-plugin-transform-arrow-functions`, `babel-plugin-transform-async-generator-functions`, `babel-plugin-transform-async-to-generator`, `babel-plugin-transform-block-scoped-functions`, `babel-plugin-transform-block-scoping`, `babel-plugin-transform-class-properties`, `babel-plugin-transform-class-static-block`, `babel-plugin-transform-classes`, `babel-plugin-transform-computed-properties`, `babel-plugin-transform-destructuring`, `babel-plugin-transform-dotall-regex`, `babel-plugin-transform-duplicate-keys`, `babel-plugin-transform-dynamic-import`, `babel-plugin-transform-exponentiation-operator`, `babel-plugin-transform-export-namespace-from`, `babel-plugin-transform-flow-comments`, `babel-plugin-transform-flow-strip-types`, `babel-plugin-transform-for-of`, `babel-plugin-transform-function-name`, `babel-plugin-transform-instanceof`, `babel-plugin-transform-jscript`, `babel-plugin-transform-json-strings`, `babel-plugin-transform-literals`, `babel-plugin-transform-logical-assignment-operators`, `babel-plugin-transform-member-expression-literals`, `babel-plugin-transform-modules-amd`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-modules-systemjs`, `babel-plugin-transform-modules-umd`, `babel-plugin-transform-new-target`, `babel-plugin-transform-nullish-coalescing-operator`, `babel-plugin-transform-numeric-separator`, `babel-plugin-transform-object-assign`, `babel-plugin-transform-object-rest-spread`, `babel-plugin-transform-object-set-prototype-of-to-assign`, `babel-plugin-transform-object-super`, `babel-plugin-transform-optional-catch-binding`, `babel-plugin-transform-optional-chaining`, `babel-plugin-transform-parameters`, `babel-plugin-transform-private-methods`, `babel-plugin-transform-private-property-in-object`, `babel-plugin-transform-property-literals`, `babel-plugin-transform-property-mutators`, `babel-plugin-transform-proto-to-assign`, `babel-plugin-transform-react-constant-elements`, `babel-plugin-transform-react-display-name`, `babel-plugin-transform-react-inline-elements`, `babel-plugin-transform-react-jsx-compat`, `babel-plugin-transform-react-jsx-self`, `babel-plugin-transform-react-jsx-source`, `babel-plugin-transform-react-pure-annotations`, `babel-plugin-transform-regenerator`, `babel-plugin-transform-reserved-words`, `babel-plugin-transform-runtime`, `babel-plugin-transform-shorthand-properties`, `babel-plugin-transform-spread`, `babel-plugin-transform-sticky-regex`, `babel-plugin-transform-strict-mode`, `babel-plugin-transform-template-literals`, `babel-plugin-transform-typeof-symbol`, `babel-plugin-transform-typescript`, `babel-plugin-transform-unicode-escapes`, `babel-plugin-transform-unicode-property-regex`, `babel-plugin-transform-unicode-regex`, `babel-plugin-transform-unicode-sets-regex`, `babel-preset-env`, `babel-preset-flow`, `babel-preset-react`, `babel-preset-typescript`
  * [#15955](https://github.com/babel/babel/pull/15955) Require exact Babel 8 version in `assertVersion` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

## v8.0.0-alpha.4 (2023-10-11)

This release does not include any changes specific to Babel 8, but it ports all the recent Babel 7 commits to Babel 8.

## v8.0.0-alpha.3 (2023-09-26)

#### :boom: Breaking Change
* `babel-node`
  * [#15956](https://github.com/babel/babel/pull/15956) [babel 8] Remove `-d`/`-gc` babel-node aliases ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-core`
  * [#15869](https://github.com/babel/babel/pull/15869) Disallow sync `createConfigItem`, `loadPartialConfig`, `loadOptions` usage ([@JLHwung](https://github.com/JLHwung))

#### :house: Internal
* `babel-code-frame`, `babel-highlight`
  * [#15792](https://github.com/babel/babel/pull/15792) [babel 8] Use ESM-based `chalk@5` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
## v8.0.0-alpha.2 (2023-08-09)

#### :bug: Bug Fix
* `babel-core`, `babel-traverse`
  * [#15759](https://github.com/babel/babel/pull/15759) [babel 8] Reland "Use `NodePath#hub` as part of the paths cache key" ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :nail_care: Polish
* `babel-preset-typescript`
  * [#15847](https://github.com/babel/babel/pull/15847) Provide better error message when allowDeclareFields is enabled ([@JLHwung](https://github.com/JLHwung))

#### :house: Internal
* `babel-helper-create-class-features-plugin`, `babel-plugin-transform-async-generator-functions`, `babel-plugin-transform-class-static-block`, `babel-plugin-transform-dynamic-import`, `babel-plugin-transform-export-namespace-from`, `babel-plugin-transform-json-strings`, `babel-plugin-transform-logical-assignment-operators`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-modules-systemjs`, `babel-plugin-transform-nullish-coalescing-operator`, `babel-plugin-transform-numeric-separator`, `babel-plugin-transform-object-rest-spread`, `babel-plugin-transform-optional-catch-binding`, `babel-plugin-transform-optional-chaining`, `babel-plugin-transform-private-property-in-object`
  * [#15823](https://github.com/babel/babel/pull/15823) Do not use syntax plugins for syntax enabled by default ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-code-frame`, `babel-highlight`
  * [#15814](https://github.com/babel/babel/pull/15814) [babel 8] Use `chalk@4` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

## v8.0.0-alpha.0 (2023-07-20)

#### :eyeglasses: Spec Compliance
* `babel-parser`
  * [#12451](https://github.com/babel/babel/pull/12451) [babel 8] Report a SyntaxError for `}` and `>` in JSX text ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  * [#12447](https://github.com/babel/babel/pull/12447) [babel 8] Disallow sequence expressions in JSX expression containers ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :boom: Breaking Change
* Other
  * [#15763](https://github.com/babel/babel/pull/15763) [babel 8] Bump eslint-parser/plugin eslint requirements ([@JLHwung](https://github.com/JLHwung))
  * [#13921](https://github.com/babel/babel/pull/13921) [babel 8] Align `allow*` parser options with ESLint behavior ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* _All packages_
  * [#15585](https://github.com/babel/babel/pull/15585) [babel 8] Require Node.js `^16.20.0 || ^18.16.0 || >=20.0.0` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  * [#14013](https://github.com/babel/babel/pull/14013) [babel 8] Add `"exports"` to every package ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-plugin-proposal-decorators`, `babel-plugin-proposal-pipeline-operator`, `babel-plugin-transform-class-properties`
  * [#15676](https://github.com/babel/babel/pull/15676) [babel 8] Only support `legacy` and `2023-05` decorators ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-core`, `babel-helper-create-class-features-plugin`, `babel-plugin-transform-arrow-functions`, `babel-plugin-transform-computed-properties`, `babel-plugin-transform-for-of`, `babel-plugin-transform-regenerator`, `babel-plugin-transform-unicode-escapes`, `babel-preset-env`, `babel-traverse`, `babel-types`
  * [#15576](https://github.com/babel/babel/pull/15576) [babel 8] Other Babel 8 misc changes ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-core`, `babel-helper-builder-binary-assignment-operator-visitor`, `babel-helper-create-class-features-plugin`, `babel-helper-create-regexp-features-plugin`, `babel-helper-environment-visitor`, `babel-helper-member-expression-to-functions`, `babel-helper-module-transforms`, `babel-helper-plugin-utils`, `babel-helper-replace-supers`, `babel-helper-simple-access`, `babel-helper-string-parser`, `babel-helper-transform-fixture-test-runner`, `babel-helpers`, `babel-plugin-transform-modules-commonjs`, `babel-preset-env`
  * [#15550](https://github.com/babel/babel/pull/15550) More misc Babel 8 little changes ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-cli`, `babel-compat-data`, `babel-core`, `babel-helper-create-class-features-plugin`, `babel-helper-environment-visitor`, `babel-helper-replace-supers`, `babel-helpers`, `babel-parser`, `babel-plugin-transform-for-of`, `babel-plugin-transform-react-jsx`, `babel-preset-env`, `babel-traverse`, `babel-types`
  * [#15068](https://github.com/babel/babel/pull/15068) Babel 8 misc changes ([@JLHwung](https://github.com/JLHwung))
* `babel-types`
  * [#15527](https://github.com/babel/babel/pull/15527) [babel 8] Remove builders present only for backwards-compatibility ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  * [#14464](https://github.com/babel/babel/pull/14464) [babel 8] Remove `selfClosing` from `jsxElement` builder ([@wjw99830](https://github.com/wjw99830))
* `babel-core`, `babel-plugin-syntax-flow`, `babel-plugin-syntax-jsx`, `babel-plugin-syntax-typescript`, `babel-plugin-transform-parameters`, `babel-plugin-transform-react-jsx-development`, `babel-plugin-transform-spread`, `babel-plugin-transform-typescript`, `babel-preset-flow`, `babel-preset-typescript`, `babel-standalone`
  * [#14955](https://github.com/babel/babel/pull/14955) [babel 8] Better file ext handling for TS and Flow presets ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-traverse`
  * [#15288](https://github.com/babel/babel/pull/15288) [babel 8] Remove `block` argument from `Scope#rename` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-generator`, `babel-helper-compilation-targets`, `babel-preset-env`, `babel-preset-flow`, `babel-types`
  * [#14179](https://github.com/babel/babel/pull/14179) Bundle most packages in Babel 8 ([@JLHwung](https://github.com/JLHwung))
* `babel-generator`, `babel-helper-builder-binary-assignment-operator-visitor`, `babel-helper-create-class-features-plugin`, `babel-helper-member-expression-to-functions`, `babel-helper-skip-transparent-expression-wrappers`, `babel-plugin-proposal-function-bind`, `babel-plugin-proposal-logical-assignment-operators`, `babel-plugin-proposal-optional-chaining`, `babel-plugin-proposal-partial-application`, `babel-plugin-transform-proto-to-assign`, `babel-plugin-transform-spread`, `babel-traverse`, `babel-types`
  * [#14750](https://github.com/babel/babel/pull/14750) Remove `Super` from `Expression` alias ([@JLHwung](https://github.com/JLHwung))
* `babel-core`, `babel-generator`, `babel-helper-create-class-features-plugin`, `babel-plugin-proposal-class-properties`, `babel-plugin-proposal-decorators`, `babel-plugin-proposal-pipeline-operator`, `babel-plugin-syntax-decorators`, `babel-plugin-transform-function-name`, `babel-plugin-transform-typescript`, `babel-standalone`
  * [#12712](https://github.com/babel/babel/pull/12712) [babel 8] Remove support for the `2018-09` decorators proposal ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-core`, `babel-helper-module-imports`, `babel-helper-transform-fixture-test-runner`, `babel-node`, `babel-plugin-proposal-class-static-block`, `babel-plugin-syntax-decorators`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-runtime`, `babel-standalone`
  * [#12695](https://github.com/babel/babel/pull/12695) [babel 8] Disallow synchronous usage of `babel.*` callback methods ([@JLHwung](https://github.com/JLHwung))
* `babel-generator`, `babel-types`
  * [#14465](https://github.com/babel/babel/pull/14465) [babel 8] `ObjectTypeAnnotation` fields must always be arrays ([@danez](https://github.com/danez))
  * [#12361](https://github.com/babel/babel/pull/12361) [babel 8] Remove the `Noop` node type ([@sidntrivedi012](https://github.com/sidntrivedi012))
* `babel-generator`, `babel-parser`, `babel-types`
  * [#13709](https://github.com/babel/babel/pull/13709) [babel 8] fix properties name for function-like TS nodes ([@sosukesuzuki](https://github.com/sosukesuzuki))
  * [#12829](https://github.com/babel/babel/pull/12829) [babel 8] Use an identifier for `TSTypeParameter.name` ([@fedeci](https://github.com/fedeci))
* `babel-node`, `babel-register`
  * [#14025](https://github.com/babel/babel/pull/14025) [babel 8] Move `@babel/register` transform to a separate worker ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-parser`
  * [#13919](https://github.com/babel/babel/pull/13919) Improve template tokenizing ([@JLHwung](https://github.com/JLHwung))
  * [#13752](https://github.com/babel/babel/pull/13752) [babel 8] Materialize ESTree's `classFeatures` option ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-plugin-transform-react-constant-elements`, `babel-preset-env`
  * [#13866](https://github.com/babel/babel/pull/13866) [babel 8] Enable preset-env bugfixes by default ([@JLHwung](https://github.com/JLHwung))
* `babel-core`
  * [#13199](https://github.com/babel/babel/pull/13199) [babel 8] Move ESLint parsing to a Worker ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-generator`, `babel-parser`
  * [#13308](https://github.com/babel/babel/pull/13308) [Babel 8]: remove module attributes parser/generator support ([@JLHwung](https://github.com/JLHwung))
  * [#12608](https://github.com/babel/babel/pull/12608) [babel 8] Don't create `TSParenthesizedType` nodes by default ([@JLHwung](https://github.com/JLHwung))
* `babel-plugin-transform-block-scoping`, `babel-traverse`
  * [#13291](https://github.com/babel/babel/pull/13291) [babel 8] Do not skip requeued paths ([@JLHwung](https://github.com/JLHwung))
* `babel-cli`, `babel-core`, `babel-helper-module-transforms`, `babel-plugin-transform-modules-amd`, `babel-plugin-transform-modules-systemjs`, `babel-plugin-transform-modules-umd`
  * [#12724](https://github.com/babel/babel/pull/12724) [babel 8] Remove module-specific options from `@babel/core` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-preset-react`
  * [#12741](https://github.com/babel/babel/pull/12741) [babel 8] Type checking preset-react options ([@JLHwung](https://github.com/JLHwung))
* `babel-preset-flow`
  * [#12751](https://github.com/babel/babel/pull/12751) [babel 8] type checking preset-flow options ([@JLHwung](https://github.com/JLHwung))
* `babel-core`, `babel-helper-compilation-targets`, `babel-plugin-proposal-async-generator-functions`, `babel-plugin-proposal-class-properties`, `babel-plugin-proposal-decorators`, `babel-plugin-proposal-object-rest-spread`, `babel-plugin-transform-classes`, `babel-plugin-transform-flow-comments`, `babel-plugin-transform-flow-strip-types`, `babel-plugin-transform-function-name`, `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-parameters`, `babel-plugin-transform-react-constant-elements`, `babel-plugin-transform-regenerator`, `babel-plugin-transform-runtime`, `babel-preset-env`, `babel-standalone`
  * [#12989](https://github.com/babel/babel/pull/12989) breaking: fallback targets to "defaults, not ie 11" ([@JLHwung](https://github.com/JLHwung))
* `babel-plugin-proposal-dynamic-import`, `babel-plugin-transform-modules-systemjs`
  * [#12700](https://github.com/babel/babel/pull/12700) Require @babel/plugin-proposal-dynamic-import when transforming import() to SystemJS ([@JLHwung](https://github.com/JLHwung))
* `babel-generator`, `babel-plugin-transform-react-jsx`, `babel-plugin-transform-template-literals`, `babel-plugin-transform-unicode-escapes`
  * [#12675](https://github.com/babel/babel/pull/12675) [babel 8] Output minimal strings by default ([@JLHwung](https://github.com/JLHwung))
* `babel-code-frame`, `babel-highlight`
  * [#12660](https://github.com/babel/babel/pull/12660) [babel 8] Improve syntax highlighting ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-node`, `babel-plugin-transform-async-to-generator`, `babel-plugin-transform-block-scoping`, `babel-plugin-transform-classes`, `babel-plugin-transform-function-name`, `babel-plugin-transform-react-constant-elements`, `babel-plugin-transform-react-inline-elements`, `babel-plugin-transform-react-jsx`, `babel-plugin-transform-regenerator`, `babel-preset-react`, `babel-preset-typescript`, `babel-standalone`
  * [#12630](https://github.com/babel/babel/pull/12630) [babel 8] Use the JSX automatic runtime by default ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-builder-react-jsx`, `babel-plugin-transform-react-jsx-development`, `babel-plugin-transform-react-jsx`, `babel-preset-react`
  * [#12593](https://github.com/babel/babel/pull/12593) [babel 8] Remove `useSpread` and `useBuiltIns` jsx options ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-preset-env`
  * [#12594](https://github.com/babel/babel/pull/12594) [babel 8] Remove `uglify` target support in preset-env ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-plugin-proposal-class-properties`, `babel-plugin-transform-typescript`, `babel-preset-typescript`
  * [#12461](https://github.com/babel/babel/pull/12461) [babel 8] Enable `allowDeclareFields` option by default with TS ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-preset-typescript`
  * [#12460](https://github.com/babel/babel/pull/12460) Type checking preset-typescript options ([@JLHwung](https://github.com/JLHwung))
* `babel-generator`
  * [#12477](https://github.com/babel/babel/pull/12477) [babel 8] Remove the `jsonCompatibleStrings` option ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-helper-fixtures`, `babel-plugin-transform-flow-strip-types`
  * [#12457](https://github.com/babel/babel/pull/12457) [babel 8] Enable `allowDeclareFields` option by default w/ Flow ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))

#### :rocket: New Feature
* `babel-helper-compilation-targets`
  * [#15551](https://github.com/babel/babel/pull/15551) use browserslist's defaults as default targets ([@JLHwung](https://github.com/JLHwung))

#### :bug: Bug Fix
* `babel-helper-fixtures`, `babel-preset-typescript`
  * [#15562](https://github.com/babel/babel/pull/15562) [Babel 8] fix `ignoreExtensions` behaviour ([@JLHwung](https://github.com/JLHwung))

#### :house: Internal
* `babel-plugin-transform-runtime`
  * [#15528](https://github.com/babel/babel/pull/15528) [babel 8] regeneratorRuntime helper is always available ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-core`
  * [#15526](https://github.com/babel/babel/pull/15526) [babel 8] Remove old error plugin mappings for default syntax ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* Other
  * [#14949](https://github.com/babel/babel/pull/14949) Fix prepublish build of Babel 8 with ESM ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  * [#14872](https://github.com/babel/babel/pull/14872) Use the built-in class fields and private methods rules in ESLint 8 ([@JLHwung](https://github.com/JLHwung))
* `babel-plugin-transform-modules-commonjs`, `babel-plugin-transform-runtime`
  * [#14120](https://github.com/babel/babel/pull/14120) [babel 8] Remove `@babel/runtime@<=7.13.0` compat check ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-cli`
  * [#14119](https://github.com/babel/babel/pull/14119) [babel 8] Remove `@nicolo-ribaudo/chokidar-2` fallback ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-cli`, `babel-node`, `babel-plugin-transform-runtime`, `babel-register`
  * [#13828](https://github.com/babel/babel/pull/13828) [babel 8] Remove `make-dir` polyfill for `fs.mkdirSync` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
  * [#12458](https://github.com/babel/babel/pull/12458) Use native Node.js functions when available ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-parser`
  * [#13768](https://github.com/babel/babel/pull/13768) Store token type as number ([@JLHwung](https://github.com/JLHwung))
  * [#13294](https://github.com/babel/babel/pull/13294) fix(parser): [Babel8] Align error codes between Flow and TypeScript ([@sosukesuzuki](https://github.com/sosukesuzuki))
* `babel-plugin-proposal-partial-application`, `babel-types`
  * [#13407](https://github.com/babel/babel/pull/13407) [Babel 8] Remove `optional` field from `MemberExpression` ([@danez](https://github.com/danez))
* `babel-core`, `babel-helper-transform-fixture-test-runner`, `babel-register`
  * [#12677](https://github.com/babel/babel/pull/12677) [babel 8] Replace lodash/escapeRegExp with escape-string-regexp ([@hzoo](https://github.com/hzoo))
* `babel-cli`, `babel-plugin-transform-classes`, `babel-register`, `babel-traverse`
  * [#12656](https://github.com/babel/babel/pull/12656) [babel 8] Update `globals`, `find-cache-dir` and `slash` ([@nicolo-ribaudo](https://github.com/nicolo-ribaudo))
* `babel-plugin-syntax-typescript`
  * [#12607](https://github.com/babel/babel/pull/12607) chore: do not push objectRestSpread parser option in Babel 8 ([@JLHwung](https://github.com/JLHwung))
