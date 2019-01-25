const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const exampleWorkingDir = example => path.resolve(__dirname, example);
const commonConfig = require('./webpack.common');

/**
 *
 * @param {string[]} examples
 * @returns {webpack.Compiler|webpack.MultiCompiler}
 */
module.exports = (examples) => {

    if (!examples || !examples.length) {
        throw new Error('Must specify at least one example');
    }
    console.log(`Including examples:\n  ${examples.join('\n  ')}\n`);

    const workingDirs = examples.map(exampleWorkingDir);
    const configs = workingDirs.map(workingDir => {
        const exampleConfig = require(path.resolve(workingDir, 'webpack.config.js'));
        let optionsConfig = {}
        try { optionsConfig = require(path.resolve(workingDir, 'options.config.js')) }
        catch(err) { /* ignore */ }
        return merge(
            commonConfig(workingDir, examples, optionsConfig),
            exampleConfig,
        );
    });

    return webpack(configs);
};
