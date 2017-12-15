const path = require('path');
const webpack = require('webpack');

const BabelMultiTargetPlugin =  require('../src/babel.multi.target.plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const HtmlWebpackPlugin =       require('html-webpack-plugin');

const browsers = require('./browsers');
const helpers = require('./config.helpers');

const commonConfig = (workingDir) => ({

    output: {
        path: path.resolve(workingDir, '../../out/examples', path.basename(workingDir)),
    },

    devtool: '#source-map',

    context: workingDir,

    resolve: {
        extensions: ['.ts', '.js'],
    },

    module: {
        rules: [
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
        new HardSourceWebpackPlugin(),
        new HtmlWebpackPlugin({
            cache: false,
            inject: 'head',
            template: '../index.html'
        }),
        new BabelMultiTargetPlugin({
            key: 'es5',
            options: helpers.babelTransformOptions(browsers.legacy),
            plugins: () => commonConfig(workingDir).plugins,
        }),
    ],
});
module.exports = commonConfig;