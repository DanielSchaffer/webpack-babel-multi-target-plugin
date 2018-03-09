import * as path    from 'path';
import * as webpack from 'webpack';
import * as merge   from 'webpack-merge';

import { Compiler, Condition, Configuration, Compilation } from 'webpack';

import { BABEL_LOADER, BabelRuleConverter }   from './babel.rule.converter';
import { BabelTargetChunkIdPrefixer }         from './babel.target.chunk.id.prefixer';
import { BrowserProfile }                     from './browser.profiles';
import { DependencyUtil }                     from './dependency.util';
import { STANDARD_EXCLUDED }                  from './excluded.packages';
import { CHILD_COMPILER_PREFIX }              from './plugin.name';
import { TempAsset }                          from './temp.emitter';
import { PluginsFn, Target }                  from './webpack.babel.multi.target.options';

export class BabelTargetCompilerFactory {
    constructor(
        private compilation: Compilation,
        private compilationBrowserProfiles: { [key: string]: BrowserProfile },
        private inputs: TempAsset[],
        private configTemplate: Configuration,
        private plugins: PluginsFn,
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
        target: Target,
        entry: any,
        alias: { [key: string]: string },
        template: Configuration,
        context: string,
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
                ],
            },
            module: {
                rules: [],
            },
            context,
            devtool: 'source-map',
            // FIXME: get from configuration!
            mode: 'development',
            plugins: [
                new BabelTargetChunkIdPrefixer(target),
                ...plugins,
            ],
        });
    }

    public createConfig(target: Target): Configuration {


        const alias = BabelTargetCompilerFactory.createConfigResolveAlias(this.inputs);
        const entry = BabelTargetCompilerFactory.createConfigEntry(alias);
        const config = BabelTargetCompilerFactory.createConfigBase(
            target,
            entry,
            alias,
            this.configTemplate,
            this.compilation.compiler.context,
            this.plugins,
        );

        const ignoredModules = this.getIgnoredModules();

        // reassign the babel loader options
        const babelRules = new BabelRuleConverter().convertLoaders(config.module.rules, ignoredModules, target.options);
        if (!babelRules.converted) {
            config.module.rules.push({
                test: /\.js$/,
                exclude: [
                    ...STANDARD_EXCLUDED,
                    ...ignoredModules,
                ],
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

    public createCompiler(target: Target): Compiler {

        const config = this.createConfig(target);
        const childCompiler: Compiler = webpack(config);
        childCompiler.name = `${CHILD_COMPILER_PREFIX}${target.key}`;
        this.compilationBrowserProfiles[childCompiler.name] = target.browserProfile;

        return childCompiler;
    }
}
