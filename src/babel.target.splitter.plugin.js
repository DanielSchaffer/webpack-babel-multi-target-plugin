const webpack = require('webpack');
const merge = require('webpack-merge');
const _  = require('lodash');

const CHILD_COMPILER_PREFIX = 'babel-splitter-compiler-';

/**
 *
 * @param {BabelSplitterOptions} babelSplitterOptions
 * @constructor
 */
function BabelTargetSplitterPlugin(...babelSplitterOptions) {
    if (!babelSplitterOptions.length) {
        throw new Error('Must provide at least one BabelSplitterOptions object');
    }
    babelSplitterOptions.forEach(options => {
        if (!options.key) {
            throw new Error('BabelSplitterOptions.key is required');
        }
        if (options.plugins && typeof(options.plugins) !== 'function') {
            throw new Error('BabelSplitterOptions.plugins must be a function');
        }
    });
    this.babelSplitterOptions = babelSplitterOptions;
}

BabelTargetSplitterPlugin.prototype.apply = function (compiler) {

    let babelSplitterOptions = this.babelSplitterOptions;
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

    const subCompilers = _.map(babelSplitterOptions, babelSplitterOption => {
        let config = merge({}, compiler.options);

        let plugins = babelSplitterOption.plugins ? babelSplitterOption.plugins() : config.plugins;
        // remove splitter plugin (self) and any HtmlWebpackPlugin instances
        config.plugins = _.filter(plugins, plugin =>
            plugin !== pluginSelf &&
            plugin.constructor !== BabelTargetSplitterPlugin &&
            plugin.constructor.name !== 'HtmlWebpackPlugin'
        );

        config.plugins.forEach((plugin, index) => {
            // if there are CommonsChunkPlugins, prefix them with the subcompiler key
            if (plugin.constructor.name === webpack.optimize.CommonsChunkPlugin.name) {
                let name;
                let names;
                const getChunkName = originalName => `${babelSplitterOption.key}/${originalName}`;

                if (plugin.chunkNames && plugin.chunkNames.length) {
                    names = _.map(plugin.chunkNames, getChunkName);
                }
                if (plugin.chunkName) {
                    name = getChunkName(plugin.chunkName);
                }

                config.plugins[index] = new webpack.optimize.CommonsChunkPlugin({
                    name,
                    names
                });
            }
        });

        // set up entries
        config.entry = _.mapKeys(config.entry, (source, name) => `${babelSplitterOption.key}/${name}`);

        // reassign the babel loader options
        let babelRule = findBabelRule(config.module.rules);
        if (!babelRule) {
            throw new Error('Could not find babel-loader rule');
        }
        babelRule.options = babelSplitterOption.options;

        let subCompiler = webpack(config);
        subCompiler.name = `${CHILD_COMPILER_PREFIX}${babelSplitterOption.key}`;
        return subCompiler;
    });

    compiler.plugin('compilation', compilation => {

        if (!compilation.name) {
            subCompilers.forEach(subCompiler => {
                subCompiler.parentCompilation = compilation;
            });
        }

        compiler.plugin('compilation', compilation => {
            // html-webpack-plugin helpers
            compilation.plugin('html-webpack-plugin-before-html-generation', function (htmlPluginData, callback) {
                // add assets from the child compilation
                compilation.children
                    .filter(child => child.name && child.name.startsWith(CHILD_COMPILER_PREFIX))
                    .forEach(child => {
                        let htmlChunks = _.chain(child.chunks)
                            .filter(chunk => _.find(chunk.files, file => file.endsWith('.js')))
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
                        htmlPluginData.assets.js.push(...Object.keys(child.assets).filter(asset => asset.endsWith('.js')));
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
        Promise.all(_.map(subCompilers, subCompiler =>
            new Promise((resolve, reject) =>
                subCompiler.runAsChild(err => {
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
module.exports = BabelTargetSplitterPlugin;
