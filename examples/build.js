const path = require('path');
const webpack = require('webpack');

const compiler = webpack(require(path.resolve(process.cwd(), 'webpack.config.js')));
compiler.run((err, stats) => {
    if (err) {
        console.error(err);
    }
    console.log(stats.toString({ colors: true }))
});