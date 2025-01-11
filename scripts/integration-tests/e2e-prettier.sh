#!/usr/bin/env bash

#==============================================================================#
#                                  SETUP                                       #
#==============================================================================#

# Start in scripts/integration-tests/ even if run from root directory
cd "$(dirname "$0")" || exit
root="$PWD"

source utils/local-registry.sh
source utils/cleanup.sh

# Echo every command being executed
set -x

# Clone prettier
git clone --depth=1 https://github.com/prettier/prettier /tmp/prettier
cd /tmp/prettier || exit

# Update @babel/* dependencies
node "$root/utils/bump-babel-dependencies.js"

if [ "$BABEL_8_BREAKING" = true ] ; then
  # Based on https://github.com/prettier/prettier/pull/15157
  sed -i 's/const getChalk = () => chalk/default (code) => code/' scripts/build/shims/babel-highlight.js
  sed -i 's/const generate = babelGenerator.default/const generate = babelGenerator/' scripts/build/transform/index.js
  rm tests/unit/__snapshots__/visitor-keys.js.snap
  # https://github.com/babel/babel/pull/16733
  rm -r tests/format/flow/mapped-types
  rm tests/format/typescript/conditional-types/conditonal-types.ts
  rm tests/format/typescript/conditional-types/new-ternary-spec.ts
  rm -r tests/format/typescript/key-remapping-in-mapped-types
  rm -r tests/format/typescript/conformance/types/mappedType
  rm -r tests/format/typescript/mapped-type
  rm tests/format/typescript/custom/typeParameters/variables.ts
  rm -r tests/format/typescript/custom/modifiers
  rm tests/format/typescript/compiler/mappedTypeWithCombinedTypeMappers.ts
  rm tests/format/typescript/prettier-ignore/format.test.js
  rm tests/format/typescript/keyword-types/conditional-types.ts
  rm tests/format/typescript/comments/mapped_types.ts
  # https://github.com/babel/babel/pull/16817
  sed -i 's/node.type !== "MemberExpression" ||/node.type !== "MemberExpression" || \/\/@ts-expect-error/g' src/language-js/utils/is-node-matches.js
  # https://github.com/babel/babel/pull/16979
  rm tests/format/typescript/trailing-comma/format.test.js
  rm tests/format/typescript/enum/format.test.js
  rm tests/format/typescript/conformance/types/enumDeclaration/format.test.js
  rm tests/format/typescript/conformance/types/constKeyword/format.test.js
  rm tests/format/typescript/conformance/types/ambient/format.test.js
  rm tests/format/typescript/conformance/internalModules/importDeclarations/format.test.js
  rm tests/format/typescript/keywords/format.test.js
  rm tests/format/typescript/declare/format.test.js
  rm tests/format/typescript/const/format.test.js
fi

# Re-enable this test once prettier updated the snapshot
# https://github.com/babel/babel/pull/17028
rm -r tests/format/flow/jsx/format.test.js

#==============================================================================#
#                                 ENVIRONMENT                                  #
#==============================================================================#
node -v
yarn --version

#==============================================================================#
#                                   TEST                                       #
#==============================================================================#

startLocalRegistry "$root"/verdaccio-config.yml
yarn install --no-immutable
yarn info

# Test typings for @babel/parser
yarn lint:typecheck

# https://github.com/babel/babel/pull/14892#issuecomment-1233180626
echo "export default () => () => {}" > src/main/create-print-pre-check-function.js

# https://github.com/babel/babel/pull/15400#issuecomment-1414539133
# Temporarily ignore tests, use `rm -f path/to/jsfmt.spec.js`
# rm -f path/to/jsfmt.spec.js

yarn test "tests/format/(jsx?|misc|typescript|flow|flow-repo)/" --update-snapshot --runInBand

cleanup
