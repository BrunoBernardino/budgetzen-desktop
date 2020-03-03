.PHONY: install
install:
	npm install

.PHONY: start
start:
	npm start

.PHONY: test
test:
	make lint
	npm test

.PHONY: test/pretty
test/pretty:
	npm run pretty/test

.PHONY: test/ci
test/ci:
	make test/pretty
	make test

.PHONY: lint
lint:
	npm run lint

.PHONY: pretty
pretty:
	npm run pretty

.PHONY: deploy
deploy:
	npm run make

.PHONY: deploy/prod
deploy/prod:
	@test -n "$(OSX_SIGN_IDENTITY)" || (echo "Please define an OSX_SIGN_IDENTITY variable" ; exit 1)
	@test -n "$(OSX_FLAT_IDENTITY)" || (echo "Please define an OSX_FLAT_IDENTITY variable" ; exit 1)
	npm run sign -- --identity=$(OSX_SIGN_IDENTITY)
	npm run flat -- --identity=$(OSX_FLAT_IDENTITY)
	@# npm run publish -- not really used
