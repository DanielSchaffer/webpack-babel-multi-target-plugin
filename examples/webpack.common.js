const path = require('path');
const merge = require('webpack-merge');

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const HtmlWebpackPlugin =       require('html-webpack-plugin');
const UglifyJsWebpackPlugin =   require('uglifyjs-webpack-plugin');

/**
 *
 * @param {string} workingDir
 * @param {BabelConfigHelper} babelHelper
 * @param pluginsConfig
 * @returns {*}
 */
const commonConfig = (workingDir, babelHelper, pluginsConfig = null) => merge({

    output: {
        path: path.resolve(workingDir, '../../out/examples', path.basename(workingDir)),
        sourceMapFilename: '[file].map',
    },

    devtool: 'inline-source-map',

    context: workingDir,

    resolve: {
        extensions: ['.ts', '.js', '.css', '.html'],

        // note that es2015 comes first, which allows using esm2015 outputs from Angular Package Format 5 packages
        mainFields: [
            'es2015',
            'module',
            'main'
        ],
    },

    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
        ],
    },

    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },

    mode: 'development',

    plugins: [
        // new HardSourceWebpackPlugin(),
        new HtmlWebpackPlugin({
            cache: false,
            inject: 'body',
            title: `Babel Multi Target Plugin Example: ${path.basename(workingDir)}`,
            template: '../index.html',
        }),
        babelHelper.multiTargetPlugin({
            targets: {
                modern: { tagWithKey: true },
                legacy: { tagWithKey: true },
            },
            plugins: () => [new UglifyJsWebpackPlugin({ sourceMap: true })],
            // plugins: () => commonConfig(workingDir, babelHelper, pluginsConfig).plugins,
        }),
        // new UglifyJsWebpackPlugin({
        //     uglifyOptions: { compress: false },
        // }),
    ],
}, pluginsConfig ? pluginsConfig() : {});
module.exports = commonConfig;
