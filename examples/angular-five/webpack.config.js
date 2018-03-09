const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
            {
                test: /\.ts$/,
                use: [
                    '@ngtools/webpack',
                ]
            },

            // babelConfigHelper.createBabelAngularRule(),
            // babelConfigHelper.createBabelJsRule(),

            {
                test: /\.pug$/,
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
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader?sourceMap',
                    'sass-loader?sourceMap',
                ],
            },
        ],
    },

};
