const BabelMultiTargetPlugin = require('../../').BabelMultiTargetPlugin
// const NamedLazyChunksPlugin =  require('../../').NamedLazyChunksPlugin

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
    ],
  },

  plugins: [
    // enable for smarter dynamic chunk naming
    // new NamedLazyChunksPlugin(),
  ],

}
