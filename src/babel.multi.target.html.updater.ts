import { Compiler, Compilation, Chunk ,ChunkGroup, Plugin }      from 'webpack';
import { BeforeHtmlGenerationData, AlterAssetTagsData, HtmlTag } from 'html-webpack-plugin';

import { CompilationTargets }                 from './compilation.targets';
import { CHILD_COMPILER_PREFIX, PLUGIN_NAME } from './plugin.name';

/**
 * @internal
 */
export class BabelMultiTargetHtmlUpdater implements Plugin {

    constructor(
        private compilationTargets: CompilationTargets,
    ) { }

    public addAssetsFromChildCompilations(compilation: Compilation, htmlPluginData: BeforeHtmlGenerationData): void {
        compilation.children
            .filter((child: Compilation) => {
                const isMultiTargetChild =  child.name && child.name.startsWith(CHILD_COMPILER_PREFIX);
                if (!isMultiTargetChild) {
                    return false;
                }
                const target = this.compilationTargets[child.name];
                return target.esModule || target.noModule;
            })
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
                    jsChunkGroups,
                );

                // generate the chunk objects used by the plugin
                const htmlChunks = sortedChunks.reduce((result: any, chunk: Chunk) => {
                    let entry = chunk.files.find((file: string) => file.endsWith('.js'));
                    result[chunk.name] = {
                        css: [],
                        entry,
                        hash: chunk.hash,
                    };
                }, {});
                Object.assign(htmlPluginData.assets.chunks, htmlChunks);

                // add the asset names form the child
                let assetNames = sortedChunks.map(chunk => chunk.files.find((file: string) => file.endsWith('.js')));
                htmlPluginData.assets.js.push(...assetNames);
            });
    }

    public updateScriptTags(compilation: Compilation, htmlPluginData: AlterAssetTagsData): void {
        let childCompilations: Compilation[] = compilation.children
            .filter(child => child.name.startsWith(CHILD_COMPILER_PREFIX));

        htmlPluginData.head
            .concat(htmlPluginData.body)
            .filter((tag: HtmlTag) => tag.tagName === 'script')
            .forEach((tag: HtmlTag) => {
                const childCompilation = childCompilations
                    .find(child => !!child.assets[tag.attributes.src]);
                const target = this.compilationTargets[childCompilation.name];
                if (target.esModule) {
                    tag.attributes.type = 'module';
                } else {
                    tag.attributes.nomodule = true;
                }
            });
    }

    public apply(compiler: Compiler): void {

        compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: Compilation) => {

            compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapPromise(PLUGIN_NAME,
                async (htmlPluginData: BeforeHtmlGenerationData) => {

                this.addAssetsFromChildCompilations(compilation, htmlPluginData);
                return htmlPluginData;
            });

            compilation.hooks.htmlWebpackPluginAlterAssetTags.tapPromise(PLUGIN_NAME,
                async (htmlPluginData: AlterAssetTagsData) => {

                this.updateScriptTags(compilation, htmlPluginData);
                return htmlPluginData;
            });

        });
    }

}
