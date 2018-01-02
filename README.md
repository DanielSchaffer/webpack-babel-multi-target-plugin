# BabelMultiTargetPlugin

This project, inspired by Phil Walton's article
[Deploying es2015 Code in Production Today](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/),
attempts to add tooling to help with the compilation steps. This is accomplished using
a plugin, `BabelMultiTargetPlugin`.

The plugin works by cloning the original webpack configuration and creating a child
compilation to handle the "legacy" compilation. The plugin replaces the `babel-loader`
options wherever it finds a `babel-loader` usage. When used with `HtmlWebpackPlugin`,
it modifies the tags rendered to change the "modern" `<script>` tags to use
`type="module"`, and adds additional `<script nomodule>` tags for the "legacy"
assets.

## Configuration

```javascript
plugins: [
    new BabelMultiTargetPlugin({
        key: 'es5',
        options: {
            presets: [
                ['@babel/env', {
                    modules: false,
                    useBuiltIns: 'usage',
                    targets: {
                        browsers: [
                            '> 1%',
                            'last 2 versions',
                            'Firefox ESR',
                        ],
                    },
                }],
            ],
        },
    });
],
```

**key: (required)** Used to distinguish the child compilation, and is also appended to the filename of
generated assets.

**options: (required)** Babel loader options that will replace the options specified in the

**plugins: (optional)** A function that returns an array of Webpack plugins to be used for the
child compilation. If specified, this will be used instead of any plugins defined in the original
configuration. This will likely be necessary with most projects, since many plugins will require
a separate plugin instance for the child compilation to work correctly.

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

## Caveats
* Does not play nice with [hard-source-webpack-plugin](https://github.com/mzgoddard/hard-source-webpack-plugin)
  * Can be used on main compilation, but not on the child compilation created by `BabelMultiTargetPlugin`