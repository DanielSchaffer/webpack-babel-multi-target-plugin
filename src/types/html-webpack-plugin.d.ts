import { ChunkComparator } from 'html-webpack-plugin';
import * as webpack from 'webpack';

declare module 'html-webpack-plugin' {

    import { Asset, Plugin } from 'webpack';

    import Compilation = webpack.compilation.Compilation;
    import Chunk = webpack.compilation.Chunk;
    import ChunkGroup = webpack.compilation.ChunkGroup;

    type ChunksSortMode = 'none' | 'auto' | 'dependency' | 'manual' | ChunkComparator;

    interface HtmlWebpackPlugin extends Plugin {
        evaluateCompilationResult(compilation: Compilation, source: any): Promise<any>;
        sortChunks(chunks: Chunk[], sortMode?: ChunksSortMode, chunkGroups?: ChunkGroup[]): Chunk[];
        filterChunks(allChunks: Chunk[], includeChunks: string[], excludeChunks: string[]): Chunk[];
        options: Options;
    }

    interface Options {
        chunks?: 'all' | string[];
        excludeChunks?: string[];
    }

    interface HtmlTagAttributes {
        [name: string]: string | boolean;
        src?: string;
        type?: string;
        nomodule?: boolean;
    }

    interface HtmlTag {
        attributes: HtmlTagAttributes;
        tagName: string;
    }

    interface HtmlWebpackPluginData {
        outputName: string;
        plugin: HtmlWebpackPlugin;
    }

    interface BeforeHtmlGenerationData extends HtmlWebpackPluginData {
        assets: { [src: string]: Asset };
    }

    interface HtmlData {
        html: string;
    }

    type HtmlProcessingData = BeforeHtmlGenerationData & HtmlData;

    interface AlterAssetTagsData extends BeforeHtmlGenerationData {
        head: HtmlTag[];
        body: HtmlTag[];
    }

    type EmitData = HtmlWebpackPluginData & HtmlData;

}

declare module 'webpack' {
    import { AlterAssetTagsData, BeforeHtmlGenerationData, EmitData, HtmlProcessingData } from 'html-webpack-plugin';
    import { Chunk } from 'webpack';
    import * as webpack from 'webpack';

    namespace compilation {
        interface CompilationHooks {
            htmlWebpackPluginAlterChunks: SyncHook<Chunk[], void>;
            htmlWebpackPluginBeforeHtmlGeneration: AsyncWaterfallHook<BeforeHtmlGenerationData, BeforeHtmlGenerationData>;
            htmlWebpackPluginBeforeHtmlProcessing: AsyncWaterfallHook<HtmlProcessingData, HtmlProcessingData>;
            htmlWebpackPluginAlterAssetTags: AsyncWaterfallHook<AlterAssetTagsData, AlterAssetTagsData>;
            htmlWebpackPluginAfterHtmlProcessing: AsyncWaterfallHook<HtmlProcessingData, HtmlProcessingData>;
            htmlWebpackPluginAfterEmit: AsyncWaterfallHook<EmitData, void>
        }
    }
}
