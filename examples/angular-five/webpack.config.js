const browsers = require('../browsers');
const helpers = require('../config.helpers');

const BABEL_EXCLUDE = [
    /core-js/,
];

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
                    {
                        loader: 'babel-loader',
                        options: helpers.babelTransformOptions(browsers.modern),
                    },
                    {
                        loader: '@ngtools/webpack',
                    }
                ],
            },
            {
                test: /\.js$/,
                exclude: BABEL_EXCLUDE,
                use: [{
                    loader: 'babel-loader',
                    options: helpers.babelTransformOptions(browsers.modern),
                }],
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
