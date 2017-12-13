const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BabelTargetSplitterPlugin = require('../../src/babel.target.splitter.plugin');

const browsers = require('../browsers');
const helpers = require('../config.helpers');

/** {Configuration} **/
module.exports = {

    entry: {
        'main': './src/entry.ts',
    },

    output: {
        path: path.resolve('out'),
    },

    devtool: '#source-map',

    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader'
            },
            {
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader',
                    options: helpers.babelTransformOptions(browsers.modern),
                }],
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            }
        ],
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime'
        }),
        new BabelTargetSplitterPlugin({
            key: 'es5',
            options: helpers.babelTransformOptions(browsers.legacy),
            commonsChunkName: 'runtime'
        }),
        new HtmlWebpackPlugin({
            cache: false,
            inject: 'head',
            template: '../index.html'
        }),
    ]

};