import { TransformOptions } from 'babel-core';
import { Loader, NewLoader, NewUseRule, Plugin } from 'webpack';

declare type BrowserProfile = 'modern' | 'legacy';

export type PluginsFn = (browserProfile: BrowserProfile) => Plugin[];

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
    createBabelRule(test: RegExp, loaders?: Loader[]): NewUseRule;
    createBabelJsRule(loaders?: Loader[]): NewUseRule;
    createBabelTsRule(loaders?: Loader[]): NewUseRule;
    createBabelAngularRule(loaders?: Loader[]): NewUseRule;
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
