import { TransformOptions } from 'babel-core';
import { Plugin } from 'webpack';

interface BabelSplitterOptions {
    key: string;
    options: TransformOptions;
    commonsChunkName?: string;
    plugins?: () => Plugin[]
}