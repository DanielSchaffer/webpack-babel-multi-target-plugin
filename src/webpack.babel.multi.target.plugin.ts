import { TransformOptions } from 'babel-core';
import { AlterAssetTagsData, HtmlTag, BeforeHtmlGenerationData } from 'html-webpack-plugin';
import { Tapable, TapableCallback } from 'tapable';
import { Chunk, Compiler, Compilation, Configuration, ChunkGroup, Plugin } from 'webpack';
import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
import { BABEL_LOADER, BabelRuleConverter } from './babel.rule.converter';
import { BrowserProfile } from './browser.profiles';
import { TempEmitter } from './temp.emitter';

const CHILD_COMPILER_PREFIX = 'webpack-babel-multi-target-compiler-';
const PLUGIN_NAME = 'WebpackBabelMultiTargetPlugin';

export type PluginsFn = (target: Target) => (Tapable | Plugin)[];

export interface WebpackBabelMultiTargetOptions {
    targets: Target[];
    config?: Configuration;
    plugins?: PluginsFn;
}

export interface Target {
    key: string;
    tagWithKey: boolean;
    browserProfile: BrowserProfile;
    options: TransformOptions;
}

export class WebpackBabelMultiTargetPlugin extends Tapable {

    private readonly options: WebpackBabelMultiTargetOptions;
    private childCompilers: Compiler[];

    constructor(options: WebpackBabelMultiTargetOptions) {
        super();

        if (!options.targets.length) {
            throw new Error('Must provide at least one target');
        }
        options.targets.forEach(target => {
            if (!target.browserProfile) {
                throw new Error('WebpackBabelMultiTargetOptions.target.browserProfile is required');
            }
            if (options.plugins && typeof(options.plugins) !== 'function') {
                throw new Error('WebpackBabelMultiTargetOptions.target.plugins must be a function');
            }
            if (!target.key) {
                target.key = target.browserProfile;
            }
        });
        if (options.targets.filter(target => target.tagWithKey === false).length > 1) {
            throw new Error('Only one target may have the `tagWithKey` property set to false');
        }
        this.options = options;
    }

    public apply(compiler: Compiler) {

        let multiTargetOptions = this.options;
        let compilationBrowserProfiles: { [childCompilerName: string]: BrowserProfile } = {};

        compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: Compilation) => {

            // html-webpack-plugin helpers
            compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapAsync(PLUGIN_NAME,
                (htmlPluginData: BeforeHtmlGenerationData, callback: TapableCallback) => {
                // add assets from the child compilation
                compilation.children
                    .filter((child: Compilation) => child.name && child.name.startsWith(CHILD_COMPILER_PREFIX))
                    .forEach((child: Compilation) => {

                        const jsChunkGroups = child.chunkGroups
                            .filter((chunkGroup: ChunkGroup) => {
                                // webpack doesn't export Entrypoint :/
                                return chunkGroup.constructor.name === 'Entrypoint' &&
                                    chunkGroup.chunks.find(chunk => !!chunk.files.find(file => file.endsWith('.js')));
                            });

                        const jsChunks = jsChunkGroups
                            .reduce((result, group) => {
                                result.push(...group.chunks);
                                return result;
                            }, []);

                        // the plugin already sorted the chunks from the main compilation,
                        // so we'll need to do it for the children as well
                        let sortedChunks: Chunk[] = htmlPluginData.plugin.sortChunks(
                            jsChunks,
                            htmlPluginData.plugin.options.chunksSortMode,
                            jsChunkGroups
                        );

                        // generate the chunk objects used by the plugin
                        const htmlChunks = sortedChunks.reduce((result: any, chunk: Chunk) => {
                            let entry = chunk.files.find(file => file.endsWith('.js'));
                            result[chunk.name] = {
                                css: [],
                                entry,
                                hash: chunk.hash,
                            };
                        }, {});
                        Object.assign(htmlPluginData.assets.chunks, htmlChunks);

                        // add the asset names form the child
                        let assetNames = sortedChunks.map(chunk => chunk.files.find(file => file.endsWith('.js')));
                        htmlPluginData.assets.js.push(...assetNames);
                    });

                return callback(null, htmlPluginData);
            });

            compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(PLUGIN_NAME,
                (htmlPluginData: AlterAssetTagsData, callback: TapableCallback) => {
                // update script tags for module loading
                let children = compilation.children.filter(child => child.name.startsWith(CHILD_COMPILER_PREFIX));

                htmlPluginData.head
                    .concat(htmlPluginData.body)
                    .filter((tag: HtmlTag) => tag.tagName === 'script')
                    .forEach((tag: HtmlTag) => {
                        let child = children.find(child => !!child.assets[tag.attributes.src]);
                        let isModernBundle;
                        if (child) {
                            // if the tag is for a bundle generated by a child compilation, we can determine
                            // whether it is a "modern" bundle by checking the target browserProfile type
                            isModernBundle = compilationBrowserProfiles[child.name] === 'modern';
                        } else {
                            // if the tag is for a bundle generated by the main compilation, we determine whether
                            // it is a modern bundle by checking if any of the child compilations are used to generate
                            // a legacy bundle. If that is the case, then (for now, at least), it is safe to assume
                            // that the main compilation was used to create a modern bundle
                            isModernBundle = !!multiTargetOptions.targets.find(options => options.browserProfile === 'legacy');
                        }
                        if (isModernBundle) {
                            tag.attributes.type = 'module';
                        } else {
                            tag.attributes.nomodule = true;
                        }
                    });
                return callback(null, htmlPluginData);
            });

        });

        compiler.hooks.emit.tapPromise(PLUGIN_NAME, async (compilation: Compilation): Promise<void> => {

            // if one of the targets is not being tagged with its key, it will overwrite the output of the original
            // compilation, and we don't need to do anything further
            if (this.options.targets.find(target => target.tagWithKey === false)) {
                return;
            }

            // if all target outputs are being tagged, we need to delete the output of the original compilation
            compilation.chunkGroups.forEach(group => {
                group.chunks.forEach(chunk => {
                    const id = chunk.name || chunk.id;
                    if (!id) {
                        return;
                    }
                    delete compilation.assets[`${id}.js`];
                    delete compilation.assets[`${id}.js.map`];
                })
            });
        });

        compiler.hooks.afterCompile.tapPromise(PLUGIN_NAME, async (compilation: Compilation): Promise<void> => {

            if (compilation.name !== undefined) {
                return;
            }
            const tempEmitter = new TempEmitter(compilation);
            await tempEmitter.init();
            const emitResult = await tempEmitter.emit();

            this.childCompilers = multiTargetOptions.targets.map((target: Target) => {

                const plugins = typeof(this.options.plugins) === 'function' ?
                      this.options.plugins(target) : [];

                const alias = emitResult
                    .filter(tempAsset => tempAsset.name.endsWith('.js'))
                    .reduce((result, tempAsset) => {
                        result[tempAsset.name.replace(/\.js$/, '')] = tempAsset.path;
                        return result;
                    }, {} as { [name: string]: string });
                const entry = Object.keys(alias);

                const config = merge(this.options.config || {}, {
                    entry,
                    resolve: {
                        alias,
                    },
                    module: {
                        rules: [],
                    },
                    context: compiler.context,
                    devtool: 'source-map',
                    // FIXME: get from configuration!
                    mode: 'development',
                    plugins,
                });

                // reassign the babel loader options
                const babelRules = new BabelRuleConverter().convertLoaders(config.module.rules, target.options);
                if (!babelRules.converted) {
                    config.module.rules.push({
                        test: /\.js$/,
                        use: [
                            {
                                loader: BABEL_LOADER,
                                options: target.options,
                            },
                        ],
                    });
                }

                const childCompiler: Compiler = webpack(config);
                childCompiler.name = `${CHILD_COMPILER_PREFIX}${target.key}`;
                compilationBrowserProfiles[childCompiler.name] = target.browserProfile;

                childCompiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: any) => {
                    // add the key as the chunk name suffix for any chunks created
                    compilation.hooks.beforeChunkIds.tap(PLUGIN_NAME, (chunks: any[]) => {
                        chunks.forEach(chunk => {
                            if (chunk.id || chunk.name) {
                                let id = chunk.id || chunk.name;
                                if (target.tagWithKey !== false) {
                                    id += `.${target.key}`;
                                }
                                chunk.id = id;
                                chunk.name = id;
                            }
                        });
                    });
                });

                return childCompiler;
            });

            await Promise.all(
                this.childCompilers.map(childCompiler => {
                    childCompiler.parentCompilation = compilation;
                    return new Promise((resolve, reject) =>
                        childCompiler.runAsChild((err: Error) => {
                            if (err) {
                                return reject(err);
                            }
                            resolve();
                        }),
                    );
                }),
            );

        });

    }
}
