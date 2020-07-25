const { ProvidePlugin } = require('webpack')

const BabelMultiTargetPlugin = require('../../').BabelMultiTargetPlugin

/**
 * @type {Configuration}
 *
 * this configuration is merged with ~/examples/webpack.common.js
 **/
module.exports = {

  entry: {
    'main': [
      './src/one.js',
      './src/two.js',
      './src/three.js',
      './src/four.js',
      './src/entry.js',
    ],
  },

  module: {
    rules: [
      {
        test: require.resolve('jquery'),
        loader: 'expose-loader',
        options: {
          exposes: ['$', 'jquery'],
        },
      },
      {
        test: /\.js$/,
        use: BabelMultiTargetPlugin.loader(),
      },
    ],
  },
  plugins: [
    new ProvidePlugin({
      $: 'jquery',
      jQuery: 'jQuery',
    }),
  ],

}
