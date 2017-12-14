const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BabelMultiTargetPlugin = require('../../src/babel.multi.target.plugin');

const browsers = require('../browsers');
const helpers = require('../config.helpers');

/** {Configuration} **/
module.exports = {

    entry: {
        'main': './src/entry.ts',
    },

    output: {
        path: path.resolve('../../out/examples', path.basename(__dirname)),
    },

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
                    'awesome-typescript-loader',
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