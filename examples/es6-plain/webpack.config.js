const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BabelMultiTargetPlugin = require('../../src/babel.multi.target.plugin');

const browsers = require('../browsers');
const helpers = require('../config.helpers');

/** {Configuration} **/
module.exports = {

    entry: {
        'main': './src/entry.js',
    },

    output: {
        path: path.resolve('../../out/examples', path.basename(__dirname)),
    },

    devtool: '#source-map',

    module: {
        rules: [
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
        new BabelMultiTargetPlugin({
            key: 'es5',
            options: helpers.babelTransformOptions(browsers.legacy),
        }),
        new HtmlWebpackPlugin({
            cache: false,
            inject: 'head',
            template: '../index.html'
        }),
    ]

};