const path = require('path');

const BabelConfigHelper = require('../..').BabelConfigHelper;
const babelConfigHelper = new BabelConfigHelper();

module.exports.helper = babelConfigHelper;

/** {webpack.Configuration} **/
module.exports.webpack = {

    entry: {
        'main': './src/entry.ts',
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader',
                // loader: 'ts-loader',
                options: {
                    // required for instances when the build is run from a different working directory
                    // configFile: path.resolve(__dirname, 'tsconfig.json'),
                    configFileName: path.resolve(__dirname, 'tsconfig.json'),
                    useCache: true,
                    sourceMaps: true,
                    // cacheDirectory: 'node_modules/.cache/ts-loader',
                },
            },
        ],
    },
};
