const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const merge = require('webpack-merge');

const exampleWorkingDir = example => path.resolve(__dirname, example);
const commonConfig = require('./webpack.common');

// first, determine which examples to build
let examples;

if (process.argv.length > 2) {

    // use the list of requested examples from the command line
    // e.g. npm run example es6-plain typescript-plain
    examples = process.argv.slice(2);


} else if (process.env.npm_lifecycle_event === 'examples') {

    // build all examples - get the list of examples by reading the subdirectories for ./examples
    examples = fs.readdirSync(path.resolve(__dirname))
        .filter(dir => fs.statSync(path.join(__dirname, dir)).isDirectory());

} else {

    // build the example in the current working directory
    // e.g. ./babel-multi-target-plugin/examples/es6-plain$ node ../build
    examples = [ path.basename(process.cwd()) ];

}

console.log('Building examples:\n\t', examples.join('\n\t'));

const workingDirs = examples.map(exampleWorkingDir);
const configs = workingDirs.map(workingDir => {
    let pluginsConfig;
    try { pluginsConfig = require(path.resolve(workingDir, 'webpack.config.plugins.js')); }
    catch (ex) { }
    let config = merge(commonConfig(workingDir, pluginsConfig), require(path.resolve(workingDir, 'webpack.config.js')));
    config.context = workingDir;
    return config;
});

const compiler = webpack(configs);
compiler.run((err, stats) => {
    if (err) {
        console.error(err);
    }
    console.log(stats.toString({ colors: true, errorDetails: true }))
});