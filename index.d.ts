import { TransformOptions } from 'babel-core';
import { Plugin } from 'webpack';

interface BabelMultiTargetOptions {
    key: string;
    options: TransformOptions;
    plugins?: () => Plugin[]
}

interface BabelPresetOptions {
    spec?: boolean;
    loose?: boolean;
    modules?: 'amd' | 'umd' | 'systemjs' | 'commonjs' | false;
    debug?: boolean;
    include?: Array<string>;
    exclude?: Array<string>;
    useBuiltIns?: 'usage' | 'entry' | false;
    forceAllTransforms?: boolean;
    configPath?: string;
    ignoreBrowserslistConfig?: boolean;
    shippedProposals?: boolean;
}