const path = require('path')

const BabelMultiTargetPlugin = require('../../').BabelMultiTargetPlugin

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
        // exclude: /moment/,
        use: BabelMultiTargetPlugin.loader(),
      },
      {
        test: /\.ts$/,
        use: [
          BabelMultiTargetPlugin.loader(),
          {
            loader: 'ts-loader',
            options: {
              // required for instances when the build is run from a different working directory
              configFile: path.resolve(__dirname, 'tsconfig.json'),
            },
          },
        ],
      },
    ],
  },

}
