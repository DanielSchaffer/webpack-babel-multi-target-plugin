const ExtractTextPlugin = require('extract-text-webpack-plugin');

const rxPaths = require('rxjs/_esm2015/path-mapping');

const BabelConfigHelper = require('../..').BabelConfigHelper;
const babelConfigHelper = new BabelConfigHelper({
    browserProfile: 'legacy'
});

module.exports.helper = babelConfigHelper;

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
            babelConfigHelper.createBabelAngularRule(),
            babelConfigHelper.createBabelJsRule(),

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
