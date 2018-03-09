import { ChunkComparator, ChunksSortMode } from 'html-webpack-plugin';
import * as webpack from 'webpack';

declare module 'html-webpack-plugin' {

    import OGHtmlWebpackPlugin = require('html-webpack-plugin');
    import { Asset } from 'webpack';

    type ChunksSortMode = 'none' | 'auto' | 'dependency' | 'manual' | ChunkComparator;

    class HtmlWebpackPlugin extends OGHtmlWebpackPlugin {
        evaluateCompilationResult(compilation: Compilation, source: any): Promise<any>;
        sortChunks(chunks: Chunk[], sortMode?: ChunksSortMode, chunkGroups?: ChunkGroup[]);
        options: Options;
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

    import {
    AlterAssetTagsData, BeforeHtmlGenerationData, Chunk, EmitData, HtmlProcessingData,
        Options,
} from 'html-webpack-plugin';

}

declare module 'webpack' {
    import { AlterAssetTagsData, BeforeHtmlGenerationData, EmitData, HtmlProcessingData } from 'html-webpack-plugin';
    import { Chunk } from 'webpack';

    interface CompilationHooks {
        htmlWebpackPluginAlterChunks: SyncHook<Chunk[], void>;
        htmlWebpackPluginBeforeHtmlGeneration: AsyncWaterfallHook<BeforeHtmlGenerationData, BeforeHtmlGenerationData>;
        htmlWebpackPluginBeforeHtmlProcessing: AsyncWaterfallHook<BeforeHtmlProcessingData, HtmlProcessingData>;
        htmlWebpackPluginAlterAssetTags: AsyncWaterfallHook<AlterAssetTagsData, AlterAssetTagsData>;
        htmlWebpackPluginAfterHtmlProcessing: AsyncWaterfallHook<HtmlProcessingData, HtmlProcessingData>;
        htmlWebpackPluginAfterEmit: AsyncWaterfallHook<EmitData, void>
    }
}
