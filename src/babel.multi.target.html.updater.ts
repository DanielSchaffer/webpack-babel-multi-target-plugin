import { compilation, Compiler, Plugin } from 'webpack';

import { AlterAssetTagsData, HtmlTag, HtmlWebpackPlugin } from 'html-webpack-plugin';
import HtmlWebpackPluginType = require('html-webpack-plugin');

import Chunk       = compilation.Chunk;
import ChunkGroup  = compilation.ChunkGroup;
import Compilation = compilation.Compilation;

import { BabelTarget }      from './babel.target';
import { PLUGIN_NAME }      from './plugin.name';
import { TargetedChunkMap } from './targeted.chunk';

// Works with HtmlWebpackPlugin to make sure the targeted assets are referenced correctly
// Tags for assets whose target has `esModule` set are updated with the `"type"="module"` attribute
// Tags for assets whose target has `noModule` set are updated with the `"nomodule"` attribute

/**
 * @internal
 */
export class BabelMultiTargetHtmlUpdater implements Plugin {

    constructor(private targets: BabelTarget[]) {}

    public updateScriptTags(chunkMap: TargetedChunkMap, tags: HtmlTag[]): void {

        tags
            .forEach((tag: HtmlTag) => {
                if (tag.tagName !== 'script') {
                    return;
                }
                const target = chunkMap.get(tag.attributes.src).target;
                if (!target) {
                    return;
                }

                if (target.esModule) {
                    tag.attributes.type = 'module';
                    return;
                }

                if (target.noModule) {
                    tag.attributes.nomodule = true;
                }
            });
    }

    // expands any provided chunk names (for options.chunks or options.excludeChunks) to include the targeted versions
    // of each chunk. also includes the original chunk name if all targets are tagged so that CSS assets are included
    // or excluded as expected
    // also relevant: NormalizeCssChunks.extractCssChunks
    private mapChunkNames(chunkNames: string[]): string[] {
        const allTaggedWithKey = this.targets.every(target => target.tagAssetsWithKey);
        return chunkNames.reduce((result: string[], name: string) => {
            if (allTaggedWithKey) {
                result.push(name);
            }
            this.targets.forEach(target => {
                result.push(target.getTargetedAssetName(name));
            });


            return result;
        }, [] as string[]);
    }

    public apply(compiler: Compiler): void {

        compiler.hooks.afterPlugins.tap(PLUGIN_NAME, () => {
            const htmlWebpackPlugin: HtmlWebpackPlugin = compiler.options.plugins
                .find(plugin => plugin instanceof HtmlWebpackPluginType) as any;

            if ((htmlWebpackPlugin.options.chunks as any) !== 'all' &&
                htmlWebpackPlugin.options.chunks &&
                htmlWebpackPlugin.options.chunks.length
            ) {
                htmlWebpackPlugin.options.chunks = this.mapChunkNames(htmlWebpackPlugin.options.chunks);
            }

            if (htmlWebpackPlugin.options.excludeChunks &&
                htmlWebpackPlugin.options.excludeChunks.length) {
                htmlWebpackPlugin.options.excludeChunks = this.mapChunkNames(htmlWebpackPlugin.options.excludeChunks);

            }
        });

        compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: Compilation) => {

            compilation.hooks.htmlWebpackPluginAlterAssetTags.tapPromise(`${PLUGIN_NAME} update asset tags`,
                async (htmlPluginData: AlterAssetTagsData) => {

                const chunkMap: TargetedChunkMap = compilation.chunkGroups.reduce((result: TargetedChunkMap, chunkGroup: ChunkGroup) => {
                    chunkGroup.chunks.forEach((chunk: Chunk) => {
                        chunk.files.forEach((file: string) => {
                            result.set(file, chunkGroup, chunk);
                        });
                    });
                    return result;
                }, new TargetedChunkMap());

                this.updateScriptTags(chunkMap, htmlPluginData.head);
                this.updateScriptTags(chunkMap, htmlPluginData.body);

                return htmlPluginData;

            });

        });
    }

}
