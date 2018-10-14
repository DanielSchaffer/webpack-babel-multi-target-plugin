const path = require('path');

const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
const BabelMultiTargetPlugin = require('../../').BabelMultiTargetPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const rxPaths = require('rxjs/_esm2015/path-mapping');

/**
 * @type {Configuration}
 *
 * this configuration is merged with ~/examples/webpack.common.js
 **/
module.exports = {

    entry: {
        'main': './src/main.ts',
    },

    resolve: {

        alias: rxPaths(),

    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    BabelMultiTargetPlugin.loader(),
                    '@ngtools/webpack',
                ]
            },

            {
                test: /\.js$/,
                use: BabelMultiTargetPlugin.loader(),
            },

            // inline component scss
            {
                test: /\.component\.scss$/,
                use: [
                    'to-string-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },

            // extract global scss
            {
                test: /\.scss$/,
                exclude: [/\.component\.scss$/],
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader?sourceMap',
                    'sass-loader?sourceMap',
                ],
            },
        ],
    },

    plugins: [

        new AngularCompilerPlugin({
            tsConfigPath: path.resolve(__dirname, 'tsconfig.json'),
            entryModule: path.resolve(__dirname, 'src/app/app.module#AppModule'),
            sourceMap: true,
        }),

        new MiniCssExtractPlugin(),

    ],

};
