FLOW_COMMIT = b7f56844ec194c8901a18d11e6b356dd56b3bdeb
TEST262_COMMIT = 8296db887368bbffa3379f995a1e628ddbe8421f
TYPESCRIPT_COMMIT = d87d0adcd30ac285393bf3bfbbb4d94d50c4f3c9

SOURCES = packages codemods eslint

COMMA := ,
EMPTY :=
SPACE := $(EMPTY) $(EMPTY)
COMMA_SEPARATED_SOURCES = $(subst $(SPACE),$(COMMA),$(SOURCES))

YARN := yarn
NODE := $(YARN) node
MAKEJS := node Makefile.js


.PHONY: build build-dist watch lint fix clean test-clean test-only test test-ci publish bootstrap use-esm use-cjs

Makefile.js: Makefile.source.mjs yarn.lock
	$(NODE) ./scripts/pack-script.js

build:
	$(MAKEJS) build

build-bundle:
	$(MAKEJS) build-bundle

build-no-bundle:
	$(MAKEJS) build-no-bundle

generate-tsconfig:
	$(MAKEJS) generate-tsconfig

generate-type-helpers:
	$(MAKEJS) generate-type-helpers

build-flow-typings:
	$(MAKEJS) build-flow-typings

# For TypeScript older than 3.7
build-typescript-legacy-typings:
	$(MAKEJS) build-typescript-legacy-typings

build-standalone:
	$(MAKEJS) build-standalone

build-standalone-ci: build-no-bundle-ci
	$(MAKEJS) build-standalone

prepublish-build-standalone:
	$(MAKEJS) prepublish-build-standalone

build-dist: build-plugin-transform-runtime-dist

build-plugin-transform-runtime-dist:
	$(MAKEJS) build-plugin-transform-runtime-dist

watch:
	$(MAKEJS) watch

code-quality: lint

tscheck:
	$(MAKEJS) tscheck

clean-ts:
	$(MAKEJS) clean-ts

lint-ci:
	$(MAKEJS) lint-ci

generate-readme:
	$(NODE) scripts/generators/readmes.js

lint:
	$(MAKEJS) lint

fix: fix-json fix-js

fix-js:
	$(MAKEJS) fix-js

fix-json:
	$(MAKEJS) fix-json

clean:
	$(MAKEJS) clean

test-cov:
	$(MAKEJS) test-cov

test: lint test-only

clone-license:
	$(MAKEJS) clone-license

prepublish-prepare-dts:
	$(MAKEJS) prepublish-prepare-dts

prepublish-build:
	$(MAKEJS) prepublish-build

prepublish:
	$(MAKEJS) prepublish

bootstrap-only:
	$(MAKEJS) bootstrap-only

bootstrap:
	$(MAKEJS) bootstrap

use-cjs:
	$(MAKEJS) use-cjs

use-esm:
	$(MAKEJS) use-esm

clean-lib:
	$(MAKEJS) clean-lib

clean-node-modules:
	$(MAKEJS) clean-node-modules

clean-runtime-helpers:
	$(MAKEJS) clean-runtime-helpers

clean-all:
	$(MAKEJS) clean-all


build-no-bundle-ci: bootstrap-only
	$(YARN) gulp build-dev
	$(MAKE) build-flow-typings
	$(MAKE) build-dist

# Does not work on Windows; use "$(YARN) jest" instead
test-only:
	BABEL_ENV=test ./scripts/test.sh
	$(MAKE) test-clean

check-compat-data:
	cd packages/babel-compat-data; CHECK_COMPAT_DATA=true $(YARN) run build-data

build-compat-data:
	cd packages/babel-compat-data; $(YARN) run build-data

update-env-corejs-fixture:
	rm -rf packages/babel-preset-env/node_modules/core-js-compat
	$(YARN)
	$(MAKE) build-bundle
	OVERWRITE=true $(YARN) jest packages/babel-preset-env

test-ci: build-standalone-ci
	BABEL_ENV=test $(YARN) jest --maxWorkers=100% --ci
	$(MAKE) test-clean

test-ci-coverage:
	BABEL_ENV=test $(MAKE) bootstrap
	BABEL_ENV=test BABEL_COVERAGE=true $(YARN) c8 jest --maxWorkers=100% --ci
	rm -rf coverage/tmp

bootstrap-flow:
	$(MAKEJS) bootstrap-flow

test-flow:
	$(NODE) scripts/parser-tests/flow

test-flow-update-allowlist:
	$(NODE) scripts/parser-tests/flow --update-allowlist

bootstrap-typescript:
	$(MAKEJS) bootstrap-typescript

test-typescript:
	$(NODE) scripts/parser-tests/typescript

test-typescript-update-allowlist:
	$(NODE) scripts/parser-tests/typescript --update-allowlist

bootstrap-test262:
	$(MAKEJS) bootstrap-test262

test-test262:
	$(NODE) scripts/parser-tests/test262

test-test262-update-allowlist:
	$(NODE) scripts/parser-tests/test262 --update-allowlist


new-version-checklist:
	$(MAKEJS) new-version-checklist

new-version:
	$(MAKEJS) new-version

new-babel-8-version:
	$(MAKEJS) new-babel-8-version

new-babel-8-version-create-commit:
	$(MAKEJS) new-babel-8-version-create-commit

new-babel-8-version-create-commit-ci:
	$(MAKEJS) new-babel-8-version-create-commit-ci

# NOTE: Run make new-version first
publish:
	@echo "Please confirm you have stopped make watch. (y)es, [N]o:"; \
	read CLEAR; \
	if [ "_$$CLEAR" != "_y" ]; then \
		exit 1; \
	fi
	$(MAKE) prepublish
ifeq ("$(BABEL_8_BREAKING)", "true")
	USE_ESM=true $(YARN) release-tool publish --tag next
else
	$(YARN) release-tool publish
endif
	$(MAKE) clean

publish-test:
ifneq ("$(I_AM_USING_VERDACCIO)", "I_AM_SURE")
	echo "You probably don't know what you are doing"
	exit 1
endif
	$(YARN) release-tool version $(VERSION) --all --yes --tag-version-prefix="version-e2e-test-"
	$(MAKE) prepublish
	node ./scripts/set-module-type.js clean
	YARN_NPM_PUBLISH_REGISTRY=http://localhost:4873 $(YARN) release-tool publish --yes --tag-version-prefix="version-e2e-test-"
	$(MAKE) clean
