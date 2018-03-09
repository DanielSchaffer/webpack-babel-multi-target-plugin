import { TransformOptions } from 'babel-core';
import { BabelPresetOptions } from 'babel-loader';
import { Condition, Loader, NewLoader, NewUseRule } from 'webpack';

import { BrowserProfile, BrowserProfiles } from './browser.profiles';
import { DEFAULT_BROWSER_PROFILE, DEFAULT_BROWSER_PROFILES, DEFAULT_PLUGINS, DEFAULT_PRESET_OPTIONS } from './defaults';
import { EXCLUDED_PACKAGES } from './excluded.packages';
import { PluginsFn, WebpackBabelMultiTargetPlugin } from './webpack.babel.multi.target.plugin';

export interface BabelConfigHelperOptions {
    babelPlugins?: string[];
    babelPresetOptions?: BabelPresetOptions;
    browserProfile?: BrowserProfile;
    browserProfiles?: {
        legacy?: string[];
        modern?: string[];
    };
    exclude?: (string | RegExp)[];
}

export class BabelConfigHelper {

    private babelPlugins: string[];
    private babelPresetOptions: BabelPresetOptions;
    private browserProfiles: BrowserProfiles;
    private exclude: (string | RegExp)[];

    /**
     *
     * @param {BabelConfigHelperOptions} [options]
     */
    constructor({ babelPlugins, babelPresetOptions, browserProfiles, exclude }: BabelConfigHelperOptions = {}) {

        if (!babelPlugins) {
            babelPlugins = [];
        }
        if (!babelPresetOptions) {
            babelPresetOptions = {};
        }

        if (!browserProfiles) {
            browserProfiles = DEFAULT_BROWSER_PROFILES;
        }
        if (!browserProfiles.legacy) {
            browserProfiles.legacy = DEFAULT_BROWSER_PROFILES.legacy;
        }
        if (!browserProfiles.modern) {
            browserProfiles.modern = DEFAULT_BROWSER_PROFILES.modern;
        }

        if (!exclude) {
            exclude = [];
        }

        this.babelPlugins = babelPlugins;
        this.babelPresetOptions = babelPresetOptions;
        this.browserProfiles = browserProfiles;
        this.exclude = exclude;

    }

    public createTransformOptions(browserProfile: BrowserProfile): TransformOptions {

        const mergedPresetOptions = Object.assign({}, DEFAULT_PRESET_OPTIONS, this.babelPresetOptions, {
            targets: {
                browsers: this.browserProfiles[browserProfile],
            },
        });

        return {
            presets: [
                [ '@babel/preset-env', mergedPresetOptions ],
            ],
            plugins: DEFAULT_PLUGINS.concat(this.babelPlugins),
        };
    }

    public createBabelLoader(profile: BrowserProfile): NewLoader {
        return {
            loader: 'babel-loader',
            options: this.createTransformOptions(profile),
        };
    }

    public createBabelRule(profile: BrowserProfile, test: Condition | Condition[], loaders: Loader[] = []): NewUseRule {
        return {
            test,
            exclude: EXCLUDED_PACKAGES.concat(this.exclude),
            use: [
                this.createBabelLoader(profile),
                ...(loaders || []),
            ],
        };

    }

    // public createBabelJsRule(loaders: Loader[] = []): NewUseRule {
    //     return this.createBabelRule(/\.js$/, loaders);
    // }
    //
    // public createBabelTsRule(loaders: Loader[] = []): NewUseRule {
    //     return this.createBabelRule(/\.ts$/, loaders);
    // }
    //
    // public createBabelAngularRule(loaders: Loader[] = []) : NewUseRule{
    //     return this.createBabelRule(/\.ts$/, [
    //         '@ngtools/webpack',
    //         ...(loaders || []),
    //     ]);
    // }

    // public profile(browserProfile: BrowserProfile): BabelConfigHelper {
    //     return new BabelConfigHelper({
    //         babelPlugins: this.babelPlugins,
    //         babelPresetOptions: this.babelPresetOptions,
    //         browserProfile,
    //         browserProfiles: this.browserProfiles,
    //         exclude: this.exclude,
    //     });
    // }

    public multiTargetPlugin({ targets, plugins } : {
                                 targets?: { [browserProfile in keyof typeof BrowserProfile]?: { key?: string, tagWithKey?: boolean }},
                                 plugins?: PluginsFn,
                             }
    ): WebpackBabelMultiTargetPlugin {
        return new WebpackBabelMultiTargetPlugin({
            targets: Object.keys(this.browserProfiles)
                .reduce((result, browserProfile: keyof typeof BrowserProfile) => {
                    if (!targets) {
                        targets = {};
                    }
                    const tagWithKey = (targets[browserProfile] || {
                        tagWithKey: browserProfile === BrowserProfile.legacy,
                    }).tagWithKey || browserProfile === BrowserProfile.legacy;
                    result.push({
                        key: targets[browserProfile].key,
                        tagWithKey,
                        browserProfile,
                        options: this.createTransformOptions(BrowserProfile[browserProfile])
                    });
                    return result;
                }, []),
            plugins,
        });
    }

}
