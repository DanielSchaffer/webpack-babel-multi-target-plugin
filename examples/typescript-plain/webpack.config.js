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
                options: {
                    // required for instances when the build is run from a different working directory
                    configFileName: path.resolve(__dirname, 'tsconfig.json'),
                    useCache: true,
                    cacheDirectory: 'node_modules/.cache/awesome-typescript-loader',
                },
            }
        ],
    },

};
