const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

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

  optimization: {
    runtimeChunk: 'single',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
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

      // extract global scss
      {
        test: /\.scss$/,
        exclude: [/\.component\.scss$/],
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader?sourceMap',
          'sass-loader?sourceMap',
        ],
      },

    ],
  },

  plugins: [
    new MiniCssExtractPlugin(),
  ],

}
