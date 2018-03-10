# webpack-babel-multi-target-plugin

This project, inspired by Phil Walton's article
[Deploying es2015 Code in Production Today](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/),
attempts to add tooling to help with the compilation steps. This is
accomplished using a plugin, `BabelMultiTargetPlugin`.

This plugin works by starting with modern ES source (ES6/7/8), and then
creates a child webpack compilation for each target ("modern", "legacy",
etc). The initial webpack configuration should not do any transpiling -
the plugin will accomplish the transpilation on its own. When used with
`HtmlWebpackPlugin`, it modifies the tags rendered to change the
"modern" `<script>` tags to use `type="module"`, and adds additional
`<script nomodule>` tags for the "legacy" assets. Non-js assets like
CSS and images are not duplicated, and are shared between the targeted
outputs.

# Configuration

`BabelMultiTargetPlugin` requires a few changes to how most people
configure webpack.

* Plugin Factory - some plugins may need to be moved to the `plugins`
option in order to be applied correctly to the child compilations.

* Set `resolve.mainFields` to include `es2015`, which allows webpack to
load the es2015 modules if a package provides them according to the
Angular Package Format. Additional field names may be added to support
other package standards.

* Remove any webpack rules that reference `babel-loader`.

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
