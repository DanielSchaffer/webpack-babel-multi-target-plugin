import { TransformOptions } from '@babel/core';
import { Loader, NewLoader, Plugin, Rule } from 'webpack';

declare type BrowserProfile = 'modern' | 'legacy';

export type PluginsFn = () => Plugin[];

declare interface WebpackBabelMultiTargetOptions {
    key: string;
    browserProfile: BrowserProfile
    options: TransformOptions;
    plugins?: PluginsFn;
}

declare interface BabelPresetOptions {
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

declare interface BabelConfigHelperOptions {
    babelPlugins?: string[];
    babelPresetOptions?: BabelPresetOptions;
    browserProfile?: BrowserProfile;
    browserProfiles?: {
        legacy?: string[];
        modern?: string[];
    };
    exclude?: (string | RegExp)[];
}

declare class BabelConfigHelper {

    constructor(options?: BabelConfigHelperOptions);

    createTransformOptions(): TransformOptions;
    createBabelLoader(): NewLoader;
    createBabelRule(test: RegExp, loaders?: Loader[]): Rule;
    createBabelJsRule(loaders?: Loader[]): Rule;
    createBabelTsRule(loaders?: Loader[]): Rule;
    createBabelAngularRule(loaders?: Loader[]): Rule;
    profile(browserList?: string[]) : BabelConfigHelper;
    multiTargetPlugin({ key, plugins }: { key: string, plugins: PluginsFn}): WebpackBabelMultiTargetPlugin;

    babelPlugins: string[];
    babelPresetOptions: BabelPresetOptions;
    browserProfile: BrowserProfile;
    browserProfiles: { [name: string]: string[] };
    exclude: (string | RegExp)[];

}

declare class WebpackBabelMultiTargetPlugin extends Plugin {
    constructor(...multiTargetOptions: WebpackBabelMultiTargetOptions[]);
}
