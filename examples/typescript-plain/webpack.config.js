const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const BabelMultiTargetPlugin = require('../../src/babel.multi.target.plugin');

const browsers = require('../browsers');
const helpers = require('../config.helpers');

/** {Configuration} **/
module.exports = {

    entry: {
        'main': './src/entry.ts',
    },

    resolve: {
        extensions: ['.ts', '.js']
    },

    output: {
        path: path.resolve(__dirname, '../../out/examples', path.basename(__dirname)),
    },

    context: __dirname,

    devtool: '#source-map',

    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: helpers.babelTransformOptions(browsers.modern),
                    },
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            // required for instances when the build is run from a different working directory
                            configFileName: path.resolve(__dirname, 'tsconfig.json'),
                            // useBabel: true,
                            useCache: true,
                        },
                    }
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: helpers.babelTransformOptions(browsers.modern),
                }],
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
        ],
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime'
        }),
        // new HardSourceWebpackPlugin(),
        new BabelMultiTargetPlugin({
            key: 'es5',
            options: helpers.babelTransformOptions(browsers.legacy),
            commonsChunkName: 'runtime'
        }),
        new HtmlWebpackPlugin({
            cache: false,
            inject: 'head',
            template: '../index.html'
        }),
    ],

};