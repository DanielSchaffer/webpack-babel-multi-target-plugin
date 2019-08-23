# webpack-babel-multi-target-plugin

[![](https://img.shields.io/npm/v/webpack-babel-multi-target-plugin.svg)](https://www.npmjs.com/package/webpack-babel-multi-target-plugin)
[![](https://img.shields.io/npm/dm/webpack-babel-multi-target-plugin.svg)](https://www.npmjs.com/package/webpack-babel-multi-target-plugin)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=UHB0dnF0cUoyaDJZeVJqOTJDWk1EQjY1NC93d29zaTZEYytJZEt1THhsbz0tLU5EcHhtQzJtaGFUbno3aGd3d1pKN2c9PQ==--7f5b762117052ec52c9b04edff86c01266da5dd0)](https://www.browserstack.com/automate/public-build/UHB0dnF0cUoyaDJZeVJqOTJDWk1EQjY1NC93d29zaTZEYytJZEt1THhsbz0tLU5EcHhtQzJtaGFUbno3aGd3d1pKN2c9PQ==--7f5b762117052ec52c9b04edff86c01266da5dd0)
[![Build Status](https://travis-ci.org/DanielSchaffer/webpack-babel-multi-target-plugin.svg?branch=master)](https://travis-ci.org/DanielSchaffer/webpack-babel-multi-target-plugin)

This project, inspired by Phil Walton's article
[Deploying es2015 Code in Production Today](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/),
adds tooling to simplify the additional configuration with a
Webpack plugin, `BabelMultiTargetPlugin`.

# Setup and Configuration

[![NPM](https://nodei.co/npm/webpack-babel-multi-target-plugin.png)](https://npmjs.org/package/webpack-babel-multi-target-plugin)

Using the plugin requires making a few small changes to your existing webpack configuration:

* Replace any instances of `'babel-loader'` with `BabelMultiTargetPlugin.loader()`
  * Do not use a `Loader` configuration object here - see [Options Reference](#options-reference)
  below for information on customizing options for `'babel-loader'`
  
* Add a loader rule for `.js` files if there isn't one already:
```javascript
{
  test: /\.js$/,
  use: [
    BabelMultiTargetPlugin.loader(),
  ],
},
```
_Note:_ The above example intentionally does not exclude _node\_modules_.

* Set `resolve.mainFields` to favor modern ES modules, which allows webpack to load the most modern source possible.
There are several intersecting de-facto standards flying around, so this should cover as much as possible:
```javascript
mainFields: [

  // rxjs and Angular Package Format
  // these are generally shipped as a higher ES language level than `module`
  'es2015',
  'esm2015',
  'fesm2015',

  // current leading de-facto standard - see https://github.com/rollup/rollup/wiki/pkg.module
  'module',

  // previous de-facto standard, superceded by `module`, but still in use by some packages
  'jsnext:main',

  // Angular Package Format - lower ES level
  'esm5',
  'fesm5',

  // standard package.json fields
  'browser',
  'main',
],
```

* Add an instance of `BabelMultiTargetPlugin` to the webpack
 configuration's `plugins` property

* `BabelMultiTargetPlugin` does not require any configuration - but can
be customized (see [Options Reference](#options-reference) below)

* Remove any `.babelrc` - see [Options Reference](#options-reference) below for setting preset options

* Remove any references to `babel-loader` from your `package.json` - it is a direct dependency of
  `webpack-babel-multi-target-plugin`, and may cause unexpected issues if there are duplicate instances due to
  a version mismatch
  
* Remove any path or pattern matching _node\_modules_ from the `exclude`
  property of any rules using `BabelMultiTargetPlugin.loader()`

* TypeScript
  * Loader rules must use `BabelMultiTargetPlugin.loader()` after your compiler loader (remember, loaders are run bottom to top)
  * Set `tsconfig` to `target` es6 or higher

* Vue
  * Replace `'vue-loader'` with `BabelMultiTargetPlugin.loader('vue-loader')`
  
* `expose-loader`
  * Rules using `expose-loader` must be defined _before_ rules using `BabelMultiTargetPlugin.loader()`
  * Do not `import`/`require` libraries exposed with `expose-loader` - either reference them from the global scope,
    or do not use `expose-loader`. You may also need to use Webpack's `ProvidePlugin`.

## Upgrading from v1.x

* Change usages of `BabelMultiTargetPlugin.loader` to `BabelMultiTargetPlugin.loader()`

## Usage with ES6 Dynamic Imports (including Angular "Lazy" Routes)

When using ES6's `import(...)` syntax, you may use Webpack's built-in chunk naming syntax to control the naming
of the resulting chunk:

```typescript
import(/* webpackChunkName: "my-dynamic-import" */'./some-other-module')
``` 

When working with imports that use an expression within the import syntax, `BabelMultiTargetPlugin` adds the `[resource]`
tag to allow better control over the naming of the resulting chunk. The `[resource]` tag will be replaced by the
relative path of the imported module, minus the file extension.

```typescript
/*
 * ./src/
 *   - plugins
 *     - a
 *       plugin.js
*      - b
*        plugin.js
 *  
 */

// ./src/loader.js
import(/* webpackChunkName: "[resource]" */`./plugins/${plugin}/plugin.js`)
```

In the above example, the resulting chunks for the plugin files would be (depending on the target configuration):
* `a-plugin.js` (legacy bundle for `./src/plugins/a/plugin.js`)
* `a-plugin.modern.js` (modern bundle for `./src/plugins/a/plugin.js`)
* `b-plugin.js` (legacy bundle for `./src/plugins/b/plugin.js`)
* `b-plugin.modern.js` (modern bundle for `./src/plugins/b/plugin.js`)

### Naming Angular Lazy Routes

Adding the included `NamedLazyChunksPlugin` will allow similar human-friendly chunk naming for Angular lazy routes:

```javascript
// webpack.config.js

const BabelMultiTargetPlugin = require('webpack-babel-multi-target-plugin').BabelMultiTargetPlugin
const NamedLazyChunksPlugin =  require('webpack-babel-multi-target-plugin').NamedLazyChunksPlugin

module.exports = {
  ...
  
  plugins: [
    new BabelMultiTargetPlugin(),
    new NamedLazyChunksPlugin(),
  ],
}

```

`NamedLazyChunkPlugin` can also be used with plain ES6 Dynamic Imports as an alternative to Webpack's chunk naming
syntax.

## Configuration Defaults

`BabelMultiTargetPlugin` does not require any options to be set. The
default behavior is:

* Generate "modern" and "legacy" bundles.

* The "modern" bundle assets will have their filenames appended with
`.modern`, while the "legacy" bundle assets will remain the same. This
enables these assets to be deployed without breaking anything since it
will still have the required polyfills.

* "modern" browsers are the last 2 versions of each browser, excluding
versions that don't support `<script type="module">`

### Options Reference

* **`babel.plugins`** (`string[]`) - a list of Babel plugins to use. `@babel/plugin-syntax-dynamic-import` is included automatically.
* **`babel.presetOptions`** (`BabelPresetOptions`) - options passed to `@babel/preset-env`. See Babel's preset-env [options](https://babeljs.io/docs/en/babel-preset-env#options) documentation for more info.
  * Default: `{ modules: false, useBuiltIns: 'usage' }`
  * **IMPORTANT:** `modules` is forced to `false` to avoid problems with transformed commonjs modules
* **`doNotTarget`** (`RegExp[]`) - an array of `RegExp` patterns for modules which
 will be excluded from targeting (see [How It Works](#how-it-works) below)
* **`exclude`** (`RegExp[]`) - an array of `RegExp` patterns for modules which will
 be excluded from transpiling
* **`targets`** (`{ [browserProfile: string]: BabelTargetOptions }`) - a
 map of browser profiles to target definitions. This is used to control
 the transpilation for each browser target. See [Configuration Defaults](#configuration-defaults)
 above for default values.
  * **`targets[browserProfile].key`** (`string`) - Used internally to
  identify the target, and is appended to the filename of an asset if
  `tagAssetsWithKey` is set to `true`. Defaults to `browserProfile` if
  not set.
  * **`targets[browserProfile].tagAssetsWithKey`** (`boolean`) - Determines whether the
  `key` is appended to the filename of the target's assets. Defaults to
  `true` for the "modern" target, and `false` for the "legacy" target.
  Only one target can have this property set to `false`.
  * **`targets[browserProfile].browsers`** Defines the
   [browserslist](https://babeljs.io/docs/en/babel-preset-env#options) used
  by `@babel/preset-env` for this target.
  * **`targets[browserProfile].esModule`** (`boolean`) - Determines whether
  this target can be referenced by a `<script type="module">` tag. Only
  one target may have this property set to `true`.
  * **`targets[browserProfile].noModule`** (`boolean`) - Determines whether
    this target can be referenced by a `<script nomodule>` tag. Only
    one target may have this property set to `true`.
  * **`targets[browserProfile].additionalModules`** (`string[]`) - An optional
  array of modules that will be prepended to the entry module for the target.
* **`safari10NoModuleFix`** (`boolean` | `'external'`, `'inline'` | `'inline-data'` | `'inline-data-base64'`) - Embeds a polyfill/workaround
to allow the `nomodule` attribute to function correctly in Safari 10.1.
See #9 for more information.
  * `false` - disabled (default)
  * `true` | `'inline'` - adds the nomodule fix in an inline script (`HtmlWebpackPlugin` only)
  * `'inline-data'` - adds the nomodule fix using a script tag with a data url (`HtmlWebpackPlugin` only)
  * `'inline-data-base64'` - adds the nomodule fix using a script tag with a base64-encoded data url (`HtmlWebpackPlugin` only)
  * `'external'` - adds the nomodule fix as a separate file linked with a `<script src>` tag

* **`normalizeModuleIds`**: (`boolean`) - **EXPERIMENTAL**. Removes the babel targeting query from module ids so they
 use what the module id would be without using `BabelMultiTargetPlugin`, and adds a check to webpack's bootstrapping
 code that stops bundle code from executing if it detects that webpack has already been bootstrapped elsewhere.
 This has the effect of preventing duplicate modules from loading in instances where the browser loads both bundles
 (e.g. Safari 10.1).

## Configuration Examples

### Basic Usage

```javascript

// webpack.config.js

const BabelMultiTargetPlugin = require('webpack-babel-multi-target-plugin').BabelMultiTargetPlugin;

module.exports = {

    entry: 'src/main.js',

    resolve: {
        mainFields: [
            'es2015',
            'module',
            'main',
        ],
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    BabelMultiTargetPlugin.loader(),
                ],
            },
        ],
    },

    plugins: [
        new BabelMultiTargetPlugin(),
    ],

};
```

### TypeScript

```javascript

// webpack.config.js

const BabelMultiTargetPlugin = require('webpack-babel-multi-target-plugin').BabelMultiTargetPlugin;

module.exports = {

    entry: 'src/main.ts',

    resolve: {
        mainFields: [
            'es2015',
            'module',
            'main',
        ],
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    BabelMultiTargetPlugin.loader(),
                ],
            },
            {
                test: /\.ts$/,
                use: [
                    BabelMultiTargetPlugin.loader(),
                    'awesome-typescript-loader'
                ],
                options: {
                    useCache: true,
                    cacheDirectory: 'node_modules/.cache/awesome-typescript-loader',
                },
            },
        ],
    },

    plugins: [
        new BabelMultiTargetPlugin(),
    ],

};
```

### With Options

```javascript

// webpack.config.js

const BabelMultiTargetPlugin = require('webpack-babel-multi-target-plugin').BabelMultiTargetPlugin;

module.exports = {

    entry: 'src/main.js',

    resolve: {
        mainFields: [
            'es2015',
            'module',
            'main',
        ],
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    BabelMultiTargetPlugin.loader(),
                ],
            },
        ],
    },

    plugins: [
        new BabelMultiTargetPlugin({

            babel: {
                // babel preset-env plugin options go here
            },

            // excludes the untargetable-library module from being targeted
            doNotTarget: [
                /node_modules\/untargetable-library/,
            ],

            // excludes the transpiling-trouble module from being transpiled
            exclude: [
                /node_modules\/transpiling-trouble/
            ],

            // swap which target gets the name appended
            targets: {

                // results in the "modern" bundle being output as main.js
                // the default is main.modern.js
                modern: {
                    tagAssetsWithKey: false,
                },

                // results in the "legacy" bundle being output as main.old-and-broke.js
                // the default is main.js
                legacy: {
                    key: 'old-and-broke',
                    tagAssetsWithKey: true,
                },
            },
        }),
    ],

};
```

### Don't Transpile ES5-only Libraries

Some libraries may cause runtime errors if they are transpiled - often,
they will already have been transpiled by Babel as part of the author's
publishing process. These errors may look like:

> `Cannot assign to read only property 'exports' of object '\#\<Object\>'`

or

> `__webpack_require__(...) is not a function`

These libraries most likely need to be excluded from Babel's
transpilation. While the plugin will automatically attempt to filter out
CommonJs modules, you can also specify libraries to be excluded in the
`BabelMultiTargetPlugin` constructor:

```javascript

new BabelMultiTargetPlugin({
    exclude: [
        /node_modules\/some-es5-library/,
        /node_modules\/another-es5-library/,
    ],
});
```

## Example Projects
Several simple use cases are provided to show how the plugin works.

### Install Example Project Dependencies
```bash
# installs dependencies for all example projects; requires bash
npm run install-examples
```

### Build the Example Projects
```bash
# builds all example projects
npm run examples

# build just the specified example projects
npm run angular-five typescript-plain
```

### Example Project Dev Server
```bash
# builds and serves all example projects
npm start

# builds and serves just the specified example projects
npm start angular-five typescript-plain
```

Note that when running all example projects concurrently, you may need to increase
Node's memory limit:
```
NODE_OPTIONS="--max-old-space-size 8192" npm start
```

Examples will be available at `http://HOST:PORT/examples/EXAMPLE_NAME`.

## How It Works

This plugin works by effectively duplicating each entry point, and giving it
a target. Each target corresponds to a browser definition that is passed
to Babel. As the compilation processes each entry point, the target filters
down from the entry point through each of its dependencies. Once the
compilation is complete, any CSS outputs are merged into a single
module so they are not duplicated (since CSS will be the same regardless
of ES supported level). If [HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin)
is being used, the script tags are updated to use the appropriate
`type="module"` and `nomodule` attributes.

### Transpiling _node\_modules_
In order to have the greatest possible positive effect, the compilation must
be able to start with the high possible ES level of source code. This is why
the extra entries were added to the `mainFields` array, and why
_node\_modules_ is not excluded from loader rules. This ensures that even
dependencies can take advantage of being able to be bundled with ES6
features and syntax, and the more verbose syntax and polyfill-laden
only included for legacy browsers.

### Blind Targeting
In some circumstances, such as lazy-loaded routes and modules with
Angular, Vue, and ES6 dynamic imports, it may not be possible to
determine the entry point of a module. In these cases, the plugin will
assign the module a target on its own. It does this by creating an array
of the targets, and removing and assigning one target each time it
encounters a given resource.

If you encounter a `BlindTargetingError` while attempting to use this
plugin, please create an issue with a simple reproduction.

## Benefits

* Automatically sets up your index HTML files with both "modern" and
 "legacy" bundles

* Uses ES2015 source when available, and attempts to automatically avoid
re-transpiling ES5/CommonJs code

* Avoid using between 30-70 KB of polyfill code on browsers that don't
need them (depends on project size and features used)

## Caveats
* Increased build time - since the plugin duplicates entry points, everything
has to be done twice. This can be helped with appropriate cache
configurations where they are available (Babel, TypeScript, etc), but
it may make sense to avoid using this plugin during development.

* May not play nice with [hard-source-webpack-plugin](https://github.com/mzgoddard/hard-source-webpack-plugin)

* Code Splitting - Since CommonJs dependencies can be shared between
 "modern" and "legacy" bundles, apps with multiple entries or
 lazy-loaded modules may end up with a large number of "vendor" chunks.

* Angular Apps: if a dependency does not provide ES modules and imports `@angular/core` as
a CommonJs dependency (e.g. `require('@angular/core')`), things will break, particularly
when using lazy routing modules.

## Testing
The output generated by this plugin is tested on the following browsers courtesy of BrowserStack:

* Chrome
* Firefox
* Edge
* Safari (including 10.1 on Mac OS and 10.3 on iOS)
* IE 11

<a href="https://www.browserstack.com" target="_blank"><img src="./doc/browserstack-logo.svg" width="25%"></a>
