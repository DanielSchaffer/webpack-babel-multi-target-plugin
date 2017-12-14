const webpack = require('webpack');
const merge = require('webpack-merge');
const _  = require('lodash');

const CHILD_COMPILER_PREFIX = 'babel-multi-target-compiler-';

/**
 *
 * @param {BabelMultiTargetOptions} babelMultiTargetOptions
 * @constructor
 */
function BabelMultiTargetPlugin(...babelMultiTargetOptions) {
    if (!babelMultiTargetOptions.length) {
        throw new Error('Must provide at least one BabelMultiTargetOptions object');
    }
    babelMultiTargetOptions.forEach(options => {
        if (!options.key) {
            throw new Error('BabelMultiTargetOptions.key is required');
        }
        if (options.plugins && typeof(options.plugins) !== 'function') {
            throw new Error('BabelMultiTargetOptions.plugins must be a function');
        }
    });
    this.babelMultiTargetOptions = babelMultiTargetOptions;
}

BabelMultiTargetPlugin.prototype.apply = function (compiler) {

    let babelMultiTargetOptions = this.babelMultiTargetOptions;
    let pluginSelf = this;
    const loader = 'babel-loader';

    function findBabelRule(rules) {
        for (let i = 0; i < rules.length; i++) {
            let rule = rules[i];
            if (rule.loader === loader || rule.use === loader) {
                return rule;
            }
            if (rule.use) {
                let babelRule = findBabelRule(rule.use);
                if (babelRule) {
                    return babelRule;
                }
            }
        }
        return null;
    }

    const childCompilers = babelMultiTargetOptions.map(babelMultiTargetOption => {
        let config = merge({}, compiler.options);

        let plugins = babelMultiTargetOption.plugins ? babelMultiTargetOption.plugins() : config.plugins;
        // remove plugin (self) and any HtmlWebpackPlugin instances
        config.plugins = plugins.filter(plugin =>
            plugin !== pluginSelf &&
            plugin.constructor !== BabelMultiTargetPlugin &&
            plugin.constructor.name !== 'HtmlWebpackPlugin'
        );

        config.plugins.forEach((plugin, index) => {
            // if there are CommonsChunkPlugins, prefix them with the child compiler key
            if (plugin.constructor.name === webpack.optimize.CommonsChunkPlugin.name) {

                config.plugins[index] = new webpack.optimize.CommonsChunkPlugin({
                    filename: plugin.filename,
                    names: plugin.chunkNames.map(name => `${name}.${babelMultiTargetOption.key}`),
                    minChunks: plugin.minChunks,
                    // chunks: plugin.chunks,
                    children: plugin.children,
                    async: plugin.async,
                    minSize: plugin.minSize,
                });

            }
        });

        // set up entries
        config.entry = _.mapKeys(config.entry, (source, name) => `${name}.${babelMultiTargetOption.key}`);

        // reassign the babel loader options
        let babelRule = findBabelRule(config.module.rules);
        if (!babelRule) {
            throw new Error('Could not find babel-loader rule');
        }
        babelRule.options = babelMultiTargetOption.options;

        let childCompiler = webpack(config);
        childCompiler.name = `${CHILD_COMPILER_PREFIX}${babelMultiTargetOption.key}`;
        return childCompiler;
    });

    compiler.plugin('compilation', compilation => {

        if (!compilation.name) {
            childCompilers.forEach(childCompiler => {
                childCompiler.parentCompilation = compilation;
            });
        }

        compiler.plugin('compilation', compilation => {
            // html-webpack-plugin helpers
            compilation.plugin('html-webpack-plugin-before-html-generation', function (htmlPluginData, callback) {
                // add assets from the child compilation
                compilation.children
                    .filter(child => child.name && child.name.startsWith(CHILD_COMPILER_PREFIX))
                    .forEach(child => {

                        let jsChunks = child.chunks.filter(chunk => chunk.files.find(file => file.endsWith('.js')));
                        // the plugin already sorted the chunks from the main compilation,
                        // so we'll need to do it for the children as well
                        let sortedChunks = htmlPluginData.plugin.sortChunks(
                            jsChunks,
                            htmlPluginData.plugin.options.chunksSortMode
                        );

                        // generate the chunk objects used by the plugin
                        let htmlChunks = _.chain(sortedChunks)
                            .map(chunk => {
                                let entry = _.find(chunk.files, file => file.endsWith('.js'));
                                return [chunk.name, {
                                    css: [],
                                    entry,
                                    hash: chunk.hash,
                                    size: chunk.size({})
                                }];
                            })
                            .fromPairs()
                            .value();
                        Object.assign(htmlPluginData.assets.chunks, htmlChunks);

                        // add the asset names form the child
                        let assetNames = sortedChunks.map(chunk => chunk.files.find(file => file.endsWith('.js')));
                        htmlPluginData.assets.js.push(...assetNames);
                    });

                return callback(null, htmlPluginData);
            });
            compilation.plugin('html-webpack-plugin-alter-asset-tags', function (htmlPluginData, callback) {
                // update script tags for module loading
                let children = compilation.children.filter(child => child.name.startsWith(CHILD_COMPILER_PREFIX));

                htmlPluginData.head
                    .concat(htmlPluginData.body)
                    .filter(tag => tag.tagName === 'script')
                    .forEach(tag => {
                        if (children.find(child => child.assets[tag.attributes.src])) {
                            tag.attributes.nomodule = true;
                        } else {
                            tag.attributes.type = 'module';
                        }
                    });
                return callback(null, htmlPluginData);
            });
        });

    });

    compiler.plugin('make', function (compilation, callback) {
        Promise.all(childCompilers.map(childCompiler =>
            new Promise((resolve, reject) =>
                childCompiler.runAsChild(err => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                })
            )
        ))
            .then(() => callback(), err => callback(err));
    });

};
module.exports = BabelMultiTargetPlugin;
