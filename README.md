# webpack-babel-multi-target-plugin

This project, inspired by Phil Walton's article
[Deploying es2015 Code in Production Today](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/),
attempts to add tooling to help with the compilation steps. This is
accomplished using a plugin, `BabelMultiTargetPlugin`.

This plugin works by internally creating a separate entry for each
browser profile, or "target" - for example "modern" browsers, which
support loading ES6 Modules using the `<script type="module">` tag, and
"legacy" browsers that do not.



# Configuration

* Replace any instances of `babel-loader` with `BabelMultiTargetPlugin.loader`

* TypeScript: loader rules must use `BabelMultiTargetPlugin.loader`
after your compiler loader; set `tsconfig` to target es6 or higher.

* Add an instance of `BabelMultiTargetPlugin` to the webpack
 configuration's `plugins` property

* `BabelMultiTargetPlugin` does not require any configuration - but can
be customized (see below)

* Set `resolve.mainFields` to include `es2015`, which allows webpack to
load the es2015 modules if a package provides them according to the
Angular Package Format. Additional field names may be added to support
other package standards.

* No `.babelrc`

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

## Configuration Examples

### Basic Usage

```javascript

// webpack.config.js

const pluginFactory = (target) => [
    new UglifyJsWebpackPlugin({
        ecma: target.esModule ? 6: 5,
        uglifyOptions: { compress: false },
    }),
];

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
                    BabelMultiTargetPlugin.loader,
                ],
            },
        ],
    },

    plugins: [
        new BabelMultiTargetPlugin(),
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

# Example Projects
Several simple use cases are provided to show how the plugin works.

## Build the Example Projects
```bash
# builds all example projects
npm run examples

# build just the specified example projects
npm run angular-five typescript-plain
```

## Example Project Dev Server
```bash
# builds and serves all example projects
npm start

# builds and serves just the specified example projects
npm start angular-five typescript-plain
```

Examples will be available at `http://HOST:PORT/examples/EXAMPLE_NAME`.

# Caveats
* May not play nice with [hard-source-webpack-plugin](https://github.com/mzgoddard/hard-source-webpack-plugin)

* CommonJs dependencies can cause lots of fragmentation when using code
 splitting - I haven't yet figured out a way to be able to target CommonJs
 dependencies the way ES Module dependencies are. This can result in targeted
 bundles sharing the same dependencies. While it doesn't break anything, it
 can cause some seemingly unpredicable chunk splitting results, and can
 make filtering chunks for `HtmlWebpackPlugin` a bit tricky.

* Angular Apps: if a dependency does not provide ES modules and imports `@angular/core` as
a CommonJs dependency (e.g. `require('@angular/core')`), things will break, particularly
when using lazy routing modules.

