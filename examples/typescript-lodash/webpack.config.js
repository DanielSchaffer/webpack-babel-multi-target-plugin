const path = require('path');

const browsers = require('../browsers');
const helpers = require('../config.helpers');

/** {Configuration} **/
module.exports = {

    entry: {
        'main': './src/entry.ts',
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: helpers.babelTransformOptions(browsers.modern),
                    },
                    {
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
            {
                test: /\.js$/,
                exclude: /lodash/,
                use: [{
                    loader: 'babel-loader',
                    options: helpers.babelTransformOptions(browsers.modern),
                }],
            }
        ],
    },

};