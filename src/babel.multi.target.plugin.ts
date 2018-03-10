import { TransformOptions } from 'babel-core';
import { Compiler, Plugin } from 'webpack';

import {
    DEFAULT_BABEL_PLUGINS, DEFAULT_BABEL_PRESET_OPTIONS, DEFAULT_BROWSERS,
    DEFAULT_TARGET_INFO,
} from './defaults';

import { Options }            from './babel.multi.target.options';
import { BrowserProfileName, StandardBrowserProfileName } from './browser.profile.name';
import { BabelTarget }        from './babel.target';
import { TranspilerCompiler } from './transpiler.compiler';

export class BabelMultiTargetPlugin implements Plugin {

    private readonly options: Options;
    private readonly targets: BabelTarget[];
    private readonly transpilerCompiler: TranspilerCompiler;

    constructor(options: Options) {

        if (options.plugins && typeof(options.plugins) !== 'function') {
            throw new Error('WebpackBabelMultiTargetOptions.plugins must be a function');
        }

        if (!options.babel) {
            options.babel = {};
        }

        if (!options.babel.plugins) {
            options.babel.plugins = [];
        }
        if (!options.babel.presetOptions) {
            options.babel.presetOptions = {};
        }

        if (!options.targets) {
            options.targets = DEFAULT_TARGET_INFO;
        }

        if (!options.exclude) {
            options.exclude = [];
        }

        this.options = options;

        this.targets = Object.keys(options.targets)
            .reduce((result, profileName: BrowserProfileName) => {
                const targetInfo = options.targets[profileName];
                const browsers = targetInfo.browsers || DEFAULT_BROWSERS[profileName];
                const key = targetInfo.key || profileName;
                result.push(Object.assign(
                    {},
                    DEFAULT_TARGET_INFO[profileName as StandardBrowserProfileName],
                    targetInfo,
                    {
                        profileName,
                        browsers,
                        key,
                        options: this.createTransformOptions(browsers),
                    },
                ));
                return result;
            }, []);

        if (!this.targets.length) {
            throw new Error('Must provide at least one target');
        }

        if (this.targets.filter(target => target.tagAssetsWithKey === false).length > 1) {
            throw new Error('Only one target may have the `tagAssetsWithKey` property set to `false`');
        }
        if (this.targets.filter(target => target.esModule).length > 1) {
            throw new Error('Only one target may have the `esModule` property set to `true`')
        }
        if (this.targets.filter(target => target.noModule).length > 1) {
            throw new Error('Only one target may have the `noModule` property set to `true`')
        }

        this.transpilerCompiler = new TranspilerCompiler(
            this.targets,
            this.options.config,
            this.options.plugins,
            this.options.exclude,
        );
    }

    public createTransformOptions(browsers: string[]): TransformOptions {

        const mergedPresetOptions = Object.assign(
            {},
            DEFAULT_BABEL_PRESET_OPTIONS,
            this.options.babel.presetOptions,
            {
                targets: {
                    browsers,
                },
            },
            {
                modules: false,
            }
        );

        return {
            presets: [
                [ '@babel/preset-env', mergedPresetOptions ],
            ],
            plugins: [
                ...DEFAULT_BABEL_PLUGINS,
                ...this.options.babel.plugins,
            ],
        };

    }

    public apply(compiler: Compiler) {
        this.transpilerCompiler.init(compiler);
    }
}
