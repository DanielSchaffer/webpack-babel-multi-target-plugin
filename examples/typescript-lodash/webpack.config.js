const path = require('path');
const BabelMultiTargetPlugin = require('../../').BabelMultiTargetPlugin;

/**
 * @type {Configuration}
 *
 * this configuration is merged with ~/examples/webpack.common.js
 **/
module.exports = {

    entry: {
        'main': './src/entry.ts',
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: BabelMultiTargetPlugin.loader,
            },

            {
                test: /\.ts$/,
                use: [
                    BabelMultiTargetPlugin.loader,
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            // required for instances when the build is run from a different working directory
                            configFileName: path.resolve(__dirname, 'tsconfig.json'),
                            useCache: true,
                            sourceMaps: true,
                            cacheDirectory: 'node_modules/.cache/ts-loader',
                        },
                    },
                ]
            },
        ],
    },
};
