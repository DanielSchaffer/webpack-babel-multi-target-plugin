const ExtractTextPlugin = require('extract-text-webpack-plugin');

const rxPaths = require('rxjs/_esm2015/path-mapping');

const BabelHelper = require('../../src/babel.config.helper');
const babelHelper = new BabelHelper({
    browserProfile: 'legacy'
});

module.exports.helper = babelHelper;

/** {Configuration} **/
module.exports.webpack = {

    entry: {
        'main': './src/main.ts',
    },

    resolve: {

        alias: rxPaths(),

    },

    module: {
        rules: [
            babelHelper.createBabelAngularRule(),
            babelHelper.createBabelJsRule(),

            {
                test: /\.component.pug$/,
                use: [
                    'raw-loader',
                    'pug-html-loader',
                ],
            },

            // inline component scss
            {
                test: /\.component\.scss$/,
                use: [
                    'to-string-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },

            // extract global scss
            {
                test: /\.scss$/,
                exclude: [/\.component\.scss$/],
                loader: ExtractTextPlugin.extract({
                    use: [
                        'css-loader?sourceMap',
                        'sass-loader?sourceMap',
                    ],
                }),
            },
        ],
    },

};
