import { TransformOptions }      from 'babel-core';
import { Tapable }               from 'tapable';
import { Compiler, Compilation } from 'webpack';

import {
    DEFAULT_BABEL_PLUGINS, DEFAULT_BABEL_PRESET_OPTIONS, DEFAULT_BROWSERS,
    DEFAULT_TARGET_INFO,
} from './defaults';

import { BabelMultiTargetHtmlUpdater } from './babel.multi.target.html.updater';
import { Options }                     from './babel.multi.target.options';
import { BabelTarget }                 from './babel.target';
import { BabelTargetCompilerFactory }  from './babel.target.compiler.factory';
import { BrowserProfileName, StandardBrowserProfileName } from './browser.profile.name';
import { CompilationTargets }          from './compilation.targets';
import { PLUGIN_NAME }                 from './plugin.name';
import { TempEmitter }                 from './temp.emitter';

export class BabelMultiTargetPlugin extends Tapable {

    private readonly options: Options;
    private readonly targets: BabelTarget[];

    constructor(options: Options) {
        super();

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
            throw new Error('Only one target may have the `tagAssetsWithKey` property set to false');
        }
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

    public async runChildCompilers(parent: Compilation, childCompilers: Compiler[]): Promise<void> {

        await Promise.all(
            childCompilers.map(childCompiler => {
                childCompiler.parentCompilation = parent;
                return new Promise((resolve, reject) =>
                    childCompiler.runAsChild((err: Error) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    }),
                );
            }),
        );

    }

    public cleanUpOriginalCompilation(compilation: Compilation) {

        // if one of the targets is not being tagged with its key, it will overwrite the output of the original
        // compilation, and we don't need to do anything further
        if (this.targets.find(target => target.tagAssetsWithKey === false)) {
            return;
        }

        // if all target outputs are being tagged, we need to delete the output of the original compilation
        compilation.chunkGroups.forEach(group => {
            group.chunks.forEach(chunk => {

                const id = chunk.name || chunk.id;
                if (!id) {
                    return;
                }

                // remove the assets so they aren't emitted
                delete compilation.assets[`${id}.js`];
                delete compilation.assets[`${id}.js.map`];

                // remove js and js.map files so they aren't referenced by HtmlWebpackPlugin
                // this leaves any other files (like css) so they can still be referenced
                chunk.files = group.runtimeChunk.files.filter(file => !/\.js(?:\.map)?$/.test(file));

            });
        });
    }

    public apply(compiler: Compiler) {

        const compilationTargets: CompilationTargets = {};

        new BabelMultiTargetHtmlUpdater(compilationTargets).apply(compiler);

        compiler.hooks.afterCompile.tapPromise(PLUGIN_NAME, async (compilation: Compilation): Promise<void> => {

            if (compilation.name !== undefined || compilation.errors.length) {
                return;
            }
            const tempEmitter = new TempEmitter(compilation);
            await tempEmitter.init();
            const emitResult = await tempEmitter.emit();

            const targetCompilerFactory = new BabelTargetCompilerFactory(
                compilation,
                compilationTargets,
                emitResult,
                this.options.config,
                this.options.plugins,
                this.options.exclude,
            );

            const childCompilers = this.targets
                .map((target: BabelTarget) => targetCompilerFactory.createCompiler(target));

            await this.runChildCompilers(compilation, childCompilers);

            this.cleanUpOriginalCompilation(compilation);
            await tempEmitter.dispose();

        });

    }
}
