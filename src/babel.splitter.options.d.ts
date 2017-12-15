import { TransformOptions } from 'babel-core';
import { Plugin } from 'webpack';

interface BabelMultiTargetOptions {
    key: string;
    options: TransformOptions;
    plugins?: () => Plugin[]
}