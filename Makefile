.PHONY: help

.DEFAULT_GOAL := help

DIST_PATH := dist$(subst src,,$(SCRIPT_PATH))

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: ## Install npm dependencies for the api, admin, and frontend apps
	@echo "Installing Node dependencies"
	@npm install

check-script-path-env:
ifndef SCRIPT_PATH
	$(error ERROR: Required environment variable SCRIPT_PATH is undefined)
endif

build: check-script-path-env verup-patch ## Build user.js by merging meta.js and code.js files
	@mkdir -p $(DIST_PATH)
	@cat $(SCRIPT_PATH)/meta.js $(SCRIPT_PATH)/code.js > $(DIST_PATH)/user.js
	@cp $(SCRIPT_PATH)/meta.js $(DIST_PATH)

build-n-copy-to-clipboard: build ## Build user.js by merging meta.js and code.js files and copy user.js to clicpboard
	@cat $(DIST_PATH)/user.js | xclip -selection clipboard

verup-minor: check-script-path-env ## Bump minor version
	@./verup.cjs minor $(SCRIPT_PATH)

verup-patch: check-script-path-env ## Bump patch version
	@./verup.cjs patch $(SCRIPT_PATH)

verup: check-script-path-env ## Bump patch version
	@./verup.cjs $(SCRIPT_PATH)

create: ## Create new userscript, it wil gather script info via prompts
	@npx plop create
