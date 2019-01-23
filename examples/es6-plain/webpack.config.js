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

  module: {
    rules: [
      {
        test: /\.js$/,
        use: BabelMultiTargetPlugin.loader(),
      },
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: 'babel-loader',
      //     options: {
      //       presets: [
      //         ['@babel/preset-env', {
      //           modules: false,
      //           useBuiltIns: 'usage',
      //           targets: {
      //             browsers: ['IE 11'],
      //           },
      //         }],
      //       ],
      //       plugins: [
      //         '@babel/plugin-syntax-dynamic-import',
      //         // '@babel/plugin-transform-runtime',
      //       ]
      //     },
      //   }
      // },
    ],
  },

}
