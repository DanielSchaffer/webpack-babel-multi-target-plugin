const BabelConfigHelper = require('../..').BabelConfigHelper;
const babelConfigHelper = new BabelConfigHelper();

module.exports.helper = babelConfigHelper;

/** {Configuration} **/
module.exports.webpack = {

    entry: {
        'main': './src/entry.js',
    },

    module: {
        rules: [
            babelConfigHelper.createBabelJsRule(),
        ],
    },

};