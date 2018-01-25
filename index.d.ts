import { TransformOptions } from 'babel-core';
import { Loader, NewLoader, Plugin } from 'webpack';

declare type BrowserProfile = 'modern' | 'legacy';

declare interface WebpackBabelMultiTargetOptions {
    key: string;
    browserProfile: BrowserProfile
    options: TransformOptions;
    plugins?: () => Plugin[]
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
    createBabelRule(test: RegExp, loaders?: Loader[]);
    createBabelJsRule(loaders?: Loader[]);
    createBabelTsRule(loaders?: Loader[]);
    createBabelAngularRule(loaders?: Loader[]);
    profile(browserList?: string[]);

    babelPlugins: string[];
    babelPresetOptions: BabelPresetOptions;
    browserProfile: BrowserProfile;
    browserProfiles: { [name: string]: string[] };
    exclude: (string | RegExp)[];


}