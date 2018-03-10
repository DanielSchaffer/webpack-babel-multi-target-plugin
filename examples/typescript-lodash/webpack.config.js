const path = require('path');

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
