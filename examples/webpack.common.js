const BabelMultiTargetPlugin = require('../').BabelMultiTargetPlugin;

const path = require('path');

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const HtmlWebpackPlugin =       require('html-webpack-plugin');
const UglifyJsWebpackPlugin =   require('uglifyjs-webpack-plugin');

/**
 *
 * @param {string} workingDir
 * @returns {webpack.Configuration}
 */
module.exports = (workingDir) => ({

    output: {
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
            'main'
        ],
    },

    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
            {
                test: /\.pug$/,
                use: [
                    // 'html-loader',
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

        // new HardSourceWebpackPlugin(),
        new HtmlWebpackPlugin({
            cache: false,
            inject: 'body',
            template: '../index.pug',
            type: 'pug',
        }),

        new BabelMultiTargetPlugin({

            targets: {
                modern: { tagAssetsWithKey: true },
                legacy: { tagAssetsWithKey: true },
            },

            plugins: target => [
                new UglifyJsWebpackPlugin({
                    sourceMap: true,
                    parallel: true,
                    uglifyOptions: {
                        ecma: target.esModule ? 6 : 5,
                        compress: {
                            // WORKAROUND: https://github.com/mishoo/UglifyJS2/issues/2842
                            inline: 1,
                        },
                        mangle: {
                            // WORKAROUND: https://github.com/mishoo/UglifyJS2/issues/1753
                            safari10: true,
                        },
                    },
                }),
            ],

        }),
    ],

});
