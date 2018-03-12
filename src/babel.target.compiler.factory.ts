import * as path    from 'path';
import * as webpack from 'webpack';
import * as merge   from 'webpack-merge';

import { Compiler, Condition, Configuration, Compilation } from 'webpack';

import { BABEL_LOADER, BabelRuleConverter }   from './babel.rule.converter';
import { BabelTarget }                        from './babel.target';
import { BabelTargetChunkIdUpdater }          from './babel.target.chunk.id.updater';
import { CompilationTargets }                 from './compilation.targets';
import { DependencyUtil }                     from './dependency.util';
import { STANDARD_EXCLUDED }                  from './excluded.packages';
import { CHILD_COMPILER_PREFIX }              from './plugin.name';
import { TempAsset }                          from './temp.emitter';
import { PluginsFn }                          from './babel.multi.target.options';

/**
 * @internal
 */
export class BabelTargetCompilerFactory {
    constructor(
        private compilation: Compilation,
        private compilationTargets: CompilationTargets,
        private inputContext: string,
        private inputs: TempAsset[],
        private configTemplate: Configuration,
        private plugins: PluginsFn,
        private exclude?: Condition[],
    ) { }

    public static createConfigResolveAlias(inputs: TempAsset[]): { [key: string]: string; } {
        return inputs
            .filter(tempAsset => tempAsset.name.endsWith('.js'))
            .reduce((result, tempAsset) => {
                result[tempAsset.name.replace(/\.js$/, '')] = tempAsset.path;
                return result;
            }, {} as { [name: string]: string });
    }

    public static createConfigEntry(alias: { [key: string]: string }): any {
        return Object.keys(alias);
    }

    public static createConfigBase(
        target: BabelTarget,
        entry: any,
        alias: { [key: string]: string },
        template: Configuration,
        context: string,
        inputContext: string,
        pluginsFn?: PluginsFn,
    ): Configuration {
        const plugins = typeof(pluginsFn) === 'function' ?
            pluginsFn(target) : [];
        return merge({}, template, {
            entry,
            resolve: {
                alias,
                modules: [
                    // need to point the child compiler at the right node_modules folder since it would
                    // otherwise be looking in the temp dir where the intermediate files are written
                    path.resolve(context, 'node_modules'),
                    inputContext,
                ],
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: [
                            path.resolve(__dirname, 'unnest.sourcemap.loader'),
                            'source-map-loader',
                        ],
                        enforce: 'pre',
                    }
                ],
            },
            context,
            devtool: 'source-map',
            // FIXME: get from configuration!
            mode: 'development',
            plugins: [
                new BabelTargetChunkIdUpdater(target),
                ...plugins,
            ],
        });
    }

    public createConfig(target: BabelTarget): Configuration {

        const alias = BabelTargetCompilerFactory.createConfigResolveAlias(this.inputs);
        const entry = BabelTargetCompilerFactory.createConfigEntry(alias);
        const config = BabelTargetCompilerFactory.createConfigBase(
            target,
            entry,
            alias,
            this.configTemplate,
            this.compilation.compiler.context,
            this.inputContext,
            this.plugins,
        );

        const exclude = [
            ...STANDARD_EXCLUDED,
            ...this.exclude,
            ...this.getIgnoredModules(),
        ];

        // reassign the babel loader options
        const babelRules = new BabelRuleConverter().convertLoaders(config.module.rules, exclude, target.options);
        if (!babelRules.converted) {
            config.module.rules.push({
                test: /\.js$/,
                exclude,
                use: [
                    {
                        loader: BABEL_LOADER,
                        options: target.options,
                    },
                ],
            });
        }

        return config;
    }

    public getIgnoredModules(): Condition[] {

        const depUtil = new DependencyUtil();
        const deps = depUtil.getDependencies(this.compilation);
        return deps.libs
            .filter((dep: any) => dep.usesCommonJs)
            .map((dep: any) => `node_modules/${dep.libName}`);
    }

    public createCompiler(target: BabelTarget): Compiler {

        const config = this.createConfig(target);
        const childCompiler: Compiler = webpack(config);
        childCompiler.name = `${CHILD_COMPILER_PREFIX}${target.key}`;
        this.compilationTargets[childCompiler.name] = target;

        return childCompiler;
    }
}
