.PHONY: build package clean

build:
	npm run build

# Copy necessary files to dist before zipping, reusing the vite build output
package: build
	rm -f plugin.zip
	cp plugin.json dist/
	cp icon.svg dist/
	cd dist && zip -r ../plugin.zip plugin.js plugin.json icon.svg

clean:
	rm -rf dist plugin.zip
