SHELL := /bin/bash


clean:
	rm -rf node_modules/

getdeps:
	npm install

release: clean getdeps
	npm run release
