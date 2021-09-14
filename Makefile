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

.PHONY: build/macos
build/macos:
	npm run make/mas

.PHONY: build/snap
build/snap:
	npm run make/snap

.PHONY: build/win
build/win:
	npm run make/win

.PHONY: deploy/snap
deploy/snap:
	snapcraft upload --release=stable dist/budgetzen-desktop_*.snap
