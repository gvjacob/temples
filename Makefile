.PHONY: build

build:
	npm run build
	cp package.json dist/package.json
	cp README.md dist/README.md
	cp LICENSE dist/LICENSE
