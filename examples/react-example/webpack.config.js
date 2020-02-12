const BabelMultiTargetPlugin = require('../..').BabelMultiTargetPlugin

/**
 * @type {Configuration}
 *
 * this configuration is merged with ~/examples/webpack.common.js
 **/
module.exports = {
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
  plugins: [
    new BabelMultiTargetPlugin({
      normalizeModuleIds: true,
      babel: {
        presets: ['@babel/preset-react'],
      },
    }),
  ],

}
