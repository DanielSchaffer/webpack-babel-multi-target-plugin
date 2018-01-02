const ExtractTextPlugin = require('extract-text-webpack-plugin');

const rxPaths = require('rxjs/_esm2015/path-mapping');

const babelHelpers = require('../../src/babel.helpers');

/** {Configuration} **/
module.exports = {

    entry: {
        'main': './src/main.ts',
    },

    resolve: {

        alias: rxPaths(),

    },

    module: {
        rules: [
            babelHelpers.configureBabelRule(/(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/, ['@ngtools/webpack']),
            babelHelpers.configureBabelRule(/\.js$/),

            // inline component scss
            {
                test: /\.component\.scss$/,
                use: [
                    'to-string-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },

            {
                test: /\.scss$/,
                exclude: [/\.component\.scss$/],
                use: [
                    'to-string-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },

            // extract global scss
            // {
            //     test: /\.scss$/,
            //     exclude: [/\.component\.scss$/],
            //     loader: ExtractTextPlugin.extract({
            //         use: [
            //             'css-loader?sourceMap',
            //             'sass-loader?sourceMap',
            //         ],
            //     }),
            // },
        ],
    },

};
