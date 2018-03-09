import { Tapable }               from 'tapable';
import { Compiler, Compilation } from 'webpack';

import { BabelTargetCompilerFactory } from './babel.target.compiler.factory';
import { BrowserProfile }             from './browser.profiles';
import { MultiTargetHtmlUpdater }     from './multi.target.html.updater';
import { PLUGIN_NAME }                from './plugin.name';
import { TempEmitter }                from './temp.emitter';
import { Target, Options }            from './webpack.babel.multi.target.options';

export class WebpackBabelMultiTargetPlugin extends Tapable {

    private readonly options: Options;

    constructor(options: Options) {
        super();

        if (!options.targets.length) {
            throw new Error('Must provide at least one target');
        }
        options.targets.forEach(target => {
            if (!target.browserProfile) {
                throw new Error('WebpackBabelMultiTargetOptions.target.browserProfile is required');
            }
            if (options.plugins && typeof(options.plugins) !== 'function') {
                throw new Error('WebpackBabelMultiTargetOptions.target.plugins must be a function');
            }
            if (!target.key) {
                target.key = target.browserProfile;
            }
        });
        if (options.targets.filter(target => target.tagWithKey === false).length > 1) {
            throw new Error('Only one target may have the `tagWithKey` property set to false');
        }
        this.options = options;
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
        if (this.options.targets.find(target => target.tagWithKey === false)) {
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

        const compilationBrowserProfiles: { [childCompilerName: string]: BrowserProfile } = {};

        new MultiTargetHtmlUpdater(this.options.targets, compilationBrowserProfiles).apply(compiler);

        compiler.hooks.afterCompile.tapPromise(PLUGIN_NAME, async (compilation: Compilation): Promise<void> => {

            if (compilation.name !== undefined || compilation.errors.length) {
                return;
            }
            const tempEmitter = new TempEmitter(compilation);
            await tempEmitter.init();
            const emitResult = await tempEmitter.emit();

            const targetCompilerFactory = new BabelTargetCompilerFactory(
                compilation,
                compilationBrowserProfiles,
                emitResult,
                this.options.config,
                this.options.plugins,
            );

            const childCompilers = this.options.targets
                .map((target: Target) => targetCompilerFactory.createCompiler(target));

            await this.runChildCompilers(compilation, childCompilers);

            this.cleanUpOriginalCompilation(compilation);
            await tempEmitter.dispose();

        });

    }
}
