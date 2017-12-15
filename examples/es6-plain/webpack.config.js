const babelHelpers = require('../../src/babel.helpers');

/** {Configuration} **/
module.exports = {

    entry: {
        'main': './src/entry.js',
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    babelHelpers.configureBabelLoader(babelHelpers.browserProfiles.modern),
                ],
            },
        ],
    },

};