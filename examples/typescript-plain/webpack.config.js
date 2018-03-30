const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/** {webpack.Configuration} **/
module.exports = {

    entry: {
        'main': './src/entry.ts',
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader',
                options: {
                    // required for instances when the build is run from a different working directory
                    configFileName: path.resolve(__dirname, 'tsconfig.json'),
                    useCache: true,
                    cacheDirectory: 'node_modules/.cache/awesome-typescript-loader',
                },
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
        new MiniCssExtractPlugin(),
    ],

};
