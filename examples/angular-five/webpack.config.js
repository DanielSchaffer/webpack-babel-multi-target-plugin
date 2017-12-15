const babelHelpers = require('../../src/babel.helpers');

/** {Configuration} **/
module.exports = {

    entry: {
        'main': './src/main.ts',
    },

    module: {
        rules: [
            {
                test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                use: [
                    babelHelpers.configureBabelLoader(babelHelpers.browserProfiles.modern),
                    {
                        loader: '@ngtools/webpack',
                    }
                ],
            },
            {
                test: /\.js$/,
                exclude: babelHelpers.excludedPackages,
                use: [
                    babelHelpers.configureBabelLoader(babelHelpers.browserProfiles.modern),
                ],
            },
            {
                test: /\.css$/,
                use: [
                    'raw-loader',
                    'css-loader',
                ],
            },
        ],
    },

};
