const path = require('path');

const BabelHelper = require('../../src/babel.config.helper');
const babelHelper = new BabelHelper();

module.exports.helper = babelHelper;

/** {webpack.Configuration} **/
module.exports.webpack = {

    entry: {
        'main': './src/entry.ts',
    },

    module: {
        rules: [
            babelHelper.createBabelTsRule([
                {
                    loader: 'awesome-typescript-loader',
                    options: {
                        // required for instances when the build is run from a different working directory
                        configFileName: path.resolve(__dirname, 'tsconfig.json'),
                        useCache: true,
                        sourceMaps: true,
                        cacheDirectory: 'node_modules/.cache/awesome-typescript-loader',
                    },
                }]
            ),
            babelHelper.createBabelJsRule(),
        ],
    },
};