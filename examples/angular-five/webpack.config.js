const babelHelpers = require('../../src/babel.helpers');

/** {Configuration} **/
module.exports = {

    entry: {
        'main': './src/main.ts',
    },

    module: {
        rules: [
            babelHelpers.configureBabelRule(/(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/, ['@ngtools/webpack']),
            babelHelpers.configureBabelRule(/\.js$/),
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
