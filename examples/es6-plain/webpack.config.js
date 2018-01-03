const BabelHelper = require('../../src/babel.config.helper');
const babelHelper = new BabelHelper();

module.exports.helper = babelHelper;

/** {Configuration} **/
module.exports.webpack = {

    entry: {
        'main': './src/entry.js',
    },

    module: {
        rules: [
            babelHelper.createBabelJsRule(),
        ],
    },

};