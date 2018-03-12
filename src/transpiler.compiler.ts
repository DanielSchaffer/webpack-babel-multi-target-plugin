import { Compiler, Compilation, Configuration, Condition } from 'webpack';

import { BabelMultiTargetHtmlUpdater } from './babel.multi.target.html.updater';
import { PluginsFn }                   from './babel.multi.target.options';
import { BabelTarget }                 from './babel.target';
import { BabelTargetCompilerFactory }  from './babel.target.compiler.factory';
import { CompilationTargets }          from './compilation.targets';
import { PLUGIN_NAME }                 from './plugin.name';
import { TempEmitter }                 from './temp.emitter';

/**
 * @internal
 */
export class TranspilerCompiler {

    private compilationTargets: CompilationTargets = {};

    constructor(
        private targets: BabelTarget[],
        private config: Configuration,
        private plugins: PluginsFn,
        private exclude: Condition[],
    ) {
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

    public init(compiler: Compiler): void {
        new BabelMultiTargetHtmlUpdater(this.compilationTargets).apply(compiler);
        compiler.hooks.afterCompile.tapPromise(PLUGIN_NAME, async (compilation: Compilation): Promise<void> => {
            await this.run(compilation);
        });
    }

    public async run(compilation: Compilation): Promise<void> {
        if (compilation.name !== undefined || compilation.errors.length) {
            return;
        }
        const tempEmitter = new TempEmitter(compilation);
        await tempEmitter.init();
        const emitResult = await tempEmitter.emit();

        const targetCompilerFactory = new BabelTargetCompilerFactory(
            compilation,
            this.compilationTargets,
            tempEmitter.context,
            emitResult,
            this.config,
            this.plugins,
            this.exclude,
        );

        const childCompilers = this.targets
            .map((target: BabelTarget) => targetCompilerFactory.createCompiler(target));

        try {
            await this.runChildCompilers(compilation, childCompilers);
            this.cleanUpOriginalCompilation(compilation);
        } finally {
            await tempEmitter.dispose();
        }
    }
}
