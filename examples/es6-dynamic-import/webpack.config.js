const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const NamedLazyChunksPlugin =  require('../../').NamedLazyChunksPlugin

const BabelMultiTargetPlugin = require('../../').BabelMultiTargetPlugin

/**
 * @type {Configuration}
 *
 * this configuration is merged with ~/examples/webpack.common.js
 **/
module.exports = {

  entry: {
    'main': './src/entry.js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: BabelMultiTargetPlugin.loader(),
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ],
  },

  plugins: [
    // enable for smarter dynamic chunk naming
    // new NamedLazyChunksPlugin(),
    new MiniCssExtractPlugin(),
  ],

}
