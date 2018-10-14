const BabelMultiTargetPlugin = require('../../').BabelMultiTargetPlugin;

/**
 * @type {Configuration}
 *
 * this configuration is merged with ~/examples/webpack.common.js
 **/
module.exports = {

    entry: {
        'main': './src/entry.js',
    },

    externals: {
        'jquery': 'jQuery',
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: BabelMultiTargetPlugin.loader(),
            },
        ]
    }

};
