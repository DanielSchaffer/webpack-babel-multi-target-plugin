const BabelMultiTargetPlugin = require('../..').BabelMultiTargetPlugin

/**
 * @type {Configuration}
 *
 * this configuration is merged with ~/examples/webpack.common.js
 **/
module.exports = {
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  entry: {
    main: './src/Application.jsx',
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: BabelMultiTargetPlugin.loader(),
      },
    ],
  },

}
