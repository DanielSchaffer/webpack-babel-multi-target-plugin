const BabelMultiTargetPlugin = require('../').BabelMultiTargetPlugin;

const path = require('path');
const webpack = require('webpack');

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const HtmlWebpackPlugin =       require('html-webpack-plugin');
const UglifyJsWebpackPlugin =   require('uglifyjs-webpack-plugin');

/**
 *
 * @param {string} workingDir
 * @returns {webpack.Configuration}
 */
module.exports = (workingDir, options = {}) => ({

    output: {
        publicPath: '/',
        sourceMapFilename: '[file].map',
        path: path.resolve(workingDir, '../../out/examples', path.basename(workingDir)),
    },

    context: workingDir,

    devtool: 'source-map',

    resolve: {
        extensions: ['.ts', '.js'],

        // note that es2015 comes first, which allows using esm2015 outputs from Angular Package Format 5 packages
        mainFields: [
            'es2015',
            'module',
            'browser',
            'main'
        ],

        modules: [
            path.resolve(workingDir, 'node_modules'),
        ],
    },

    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
            {
                test: /\.(jpe?g|png|gif)/,
                use: 'file-loader',
            },
            {
                test: /\.pug$/,
                use: [
                    'raw-loader',
                    {
                        loader: 'pug-html-loader',
                        options: {
                            data: {
                                title: `Babel Multi Target Plugin Example: ${path.basename(workingDir)}`,
                            },
                        }
                    },
                ],
            }
        ],
    },

    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },

    mode: 'development',

    plugins: [

        new webpack.ProgressPlugin(),

        // new HardSourceWebpackPlugin(),
        new HtmlWebpackPlugin({
            cache: false,
            inject: 'body',
            template: options.template || '../index.pug',
        }),

        new BabelMultiTargetPlugin({ normalizeModuleIds: true }),
    ],

});
