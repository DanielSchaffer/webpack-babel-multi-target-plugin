const merge = require('webpack-merge');
const path = require('path');

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const HtmlWebpackPlugin =       require('html-webpack-plugin');
const UglifyJsWebpackPlugin =   require('uglifyjs-webpack-plugin');

/**
 *
 * @type {webpack.Configuration}
 */
const config = merge(require('../webpack.common')(__dirname), require('./webpack.config'));

const html = config.plugins.find(plugin => plugin.constructor.name === 'HtmlWebpackPlugin');

html.options.chunksSortMode = 'none';

module.exports = config;
