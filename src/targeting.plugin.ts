import * as path from 'path';
import { compilation, Compiler, Plugin } from 'webpack';

import ContextModuleFactory = compilation.ContextModuleFactory;
import Dependency           = compilation.Dependency;
import NormalModuleFactory  = compilation.NormalModuleFactory;

import { BabelTarget }                       from './babel.target';
import { KNOWN_EXCLUDED, STANDARD_EXCLUDED } from './excluded.packages';
import { PLUGIN_NAME }                       from './plugin.name';

const NOT_TARGETED = [
    /\.s?css$/,
];

// picks up where BabelTargetEntryPlugin leaves off and takes care of targeting all dependent modules
// includes special case handling for Angular lazy routes

/**
 * @internalapi
 */
export class TargetingPlugin implements Plugin {

    private babelLoaderPath = require.resolve('babel-loader');
    private multiTargetLoaderPath = require.resolve('./placeholder.loader');
    private babelLoaders: { [key: string]: any } = {};
    private remainingTargets: { [file: string]: BabelTarget[] } = {};

    constructor(private targets: BabelTarget[], private exclude: RegExp[]) {}

    public apply(compiler: Compiler): void {

        // make sure our taps come after other plugins (particularly AngularCompilerPlugin)
        compiler.hooks.afterPlugins.tap(PLUGIN_NAME, () => {

            compiler.hooks.contextModuleFactory.tap(PLUGIN_NAME, (cmf: ContextModuleFactory) => {
                cmf.hooks.afterResolve.tapPromise(PLUGIN_NAME, this.targetLazyModules.bind(this));
            });

            compiler.hooks.normalModuleFactory.tap(PLUGIN_NAME, (nmf: NormalModuleFactory) => {

                nmf.hooks.beforeResolve.tapPromise(PLUGIN_NAME, this.targetNormalRequest.bind(this));

                nmf.hooks.afterResolve.tapPromise(PLUGIN_NAME, this.addBabelLoaders.bind(this));
            });

            compiler.hooks.watchRun.tapPromise(PLUGIN_NAME, async () => {
                this.remainingTargets = {};
            });

        });
    }

    // FIXME: HACK ALERT!
    // this should get called once for each target for lazy contexts
    // Unfortunately, there doesn't seem to be a way to trace each request back to the targeted entry, so we just have
    // to assign targets from a copy of the targets array
    private getBlindTarget(key: string): BabelTarget {
        if (!this.remainingTargets) {
            this.remainingTargets = {};
        }
        if (!this.remainingTargets[key]) {
            this.remainingTargets[key] = this.targets.slice(0);
        }

        if (!this.remainingTargets[key].length) {
            // FIXME: Mixing Harmony and CommonJs requires of @angular/core breaks lazy loading!
            // if this is happening, it's likely that a dependency has not correctly provided a true ES6 module and is
            // instead providing CommonJs module.
            throw new Error(
                'Unexpected lazy module request, likely due to mixing ES Harmony and CommonJs imports of @angular/core'
            );
        }
        return this.remainingTargets[key].shift();
    }

    public async targetLazyModules(resolveContext: any) {

        // handle lazy modules from AngularCompilerPlugin
        if (resolveContext.mode === 'lazy' &&
            resolveContext.resource &&
            resolveContext.resource.endsWith('$$_lazy_route_resource')
        ) {

            const babelTarget = this.getBlindTarget(resolveContext.resource);

            resolveContext.resource = babelTarget.getTargetedRequest(resolveContext.resource);

            // track a map of resources to targets
            if (!resolveContext.resolveOptions.babelTargetMap) {
                resolveContext.resolveOptions.babelTargetMap = {};
            }
            resolveContext.resolveOptions.babelTargetMap[resolveContext.resource] = babelTarget;

            // piggy-back on angular's resolveDependencies function to target the dependencies.
            const ogResolveDependencies = resolveContext.resolveDependencies;
            resolveContext.resolveDependencies = (_fs: any, _resourceOrOptions: any, recursiveOrCallback: any, _regExp: any, cb?: Function) => {
                ogResolveDependencies(_fs, _resourceOrOptions, recursiveOrCallback, _regExp, (err: Error, dependencies: Dependency[]) => {

                    this.targetDependencies(babelTarget, { dependencies });

                    if (typeof cb !== 'function' && typeof recursiveOrCallback === 'function') {
                        // Webpack 4 only has 3 parameters
                        cb = recursiveOrCallback;
                    }
                    cb(null, dependencies);
                });
            };

            this.targetDependencies(babelTarget, resolveContext);

            return resolveContext;

        }
    }

    public async targetNormalRequest(requestContext: any): Promise<void> {

        requestContext.contextInfo.isTargeted = this.isTargetedRequestContext(requestContext);

        if (!requestContext.contextInfo.isTargeted) {
            return;
        }

        if (requestContext.context.includes('$$_lazy_route_resource')) {
            // handled in targetLazyModules - see the bit about resolveContext.resolveDependencies
            return;
        }

        let babelTarget = this.getTargetFromContext(requestContext);

        if (!babelTarget) {
            return;
        }

        requestContext.contextInfo.babelTarget = babelTarget;
        requestContext.request = babelTarget.getTargetedRequest(requestContext.request);

        this.targetDependencies(babelTarget, requestContext);
    }

    public targetDependencies(babelTarget: BabelTarget, context: any) {
        context.dependencies.forEach((dep: Dependency) => {
            if (!dep.request || !this.isTargetedRequest(dep.request)) {
                return;
            }

            // update the dependency requests to be targeted
            // only tag dep.request, not tag dep.userRequest, it breaks lazy loading
            // userRequest basically maps the user-friendly name to the actual request
            // so if the code does require('some-lazy-route/lazy.module.ngfactory.js') <-- userRequest
            // it can be mapped to 'some-lazy-route/lazy.module.ngfactory.js?babelTarget=modern <-- request
            if (dep.request) {
                dep.request = babelTarget.getTargetedRequest(dep.request);
            }
        });
    }

    // replace our placeholder loader with actual babel loaders
    public async addBabelLoaders(resolveContext: any): Promise<void> {

        if (!resolveContext.resourceResolveData ||
            !resolveContext.resourceResolveData.context.isTargeted ||
            !this.isTranspiledRequest(resolveContext)
        ) {
            return this.replaceLoader(resolveContext);
        }

        let babelTarget = this.getTargetFromContext(resolveContext);
        if (!babelTarget) {
            return this.replaceLoader(resolveContext);
        }

        this.replaceLoader(resolveContext, babelTarget);

    }

    public isTargetedRequest(request: string): boolean {
        if (NOT_TARGETED.find(entry => entry.test(request))) {
            return false;
        }

        return true;
    }

    public isTargetedRequestContext(requestContext: any): boolean {
        // if "compiler" is set, that seems to mean the request is from a secondary compiler, (sass/pug/etc) and
        // it should only be built once
        if (requestContext.contextInfo.compiler) {
            // TODO: report this somewhere?
            // console.info('not targeting request from compiler', requestContext.contextInfo.compiler);
            return false;
        }

        if (!this.isTargetedRequest(requestContext.request)) {
            // TODO: report this somewhere?
            // console.info('not targeting ignored request', requestContext.request);
            return false;
        }

        return true;
    }

    public isTranspiledRequest(resolveContext: any): boolean {

        // ignore files/libs that are known to not need transpiling
        if (STANDARD_EXCLUDED.find(pattern => pattern.test(resolveContext.resource))) {
            // TODO: report this somewhere?
            // console.info('not transpiling request from STANDARD_EXCLUDED', resolveContext.resource);
            return false;
        }
        if (KNOWN_EXCLUDED.find(pattern => pattern.test(resolveContext.resource))) {
            // TODO: report this somewhere?
            // console.info('not transpiling request from KNOWN_EXCLUDED', resolveContext.resource);
            return false;
        }

        if (this.exclude.find(pattern => pattern.test(resolveContext.resolve))) {
            // TODO: report this somewhere?
            // console.info('not transpiling request from excluded patterns', resolveContext.resource);
            return false;
        }

        const pkgRoot = resolveContext.resourceResolveData.descriptionFileRoot;
        const pkg = resolveContext.resourceResolveData.descriptionFileData;

        // coming from a package's "main" or "browser" field? don't need to transpile
        if (pkg.main && resolveContext.resource === path.resolve(pkgRoot, pkg.main)) {
            // TODO: report this somewhere?
            // console.info('not transpiling request using package "main"', resolveContext.resource);
            return false;
        }
        if (pkg.browser) {
            // TODO: report this somewhere?
            // console.info('not transpiling request using package "browser"', resolveContext.resource);
            if (typeof(pkg.browser) === 'string' && resolveContext.resource === path.resolve(pkgRoot, pkg.browser)) {
                return false;
            }
            if (Array.isArray(pkg.browser) &&
                pkg.browser.find((entry: string) => resolveContext.resource === path.resolve(pkgRoot, entry))
            ) {
                return false;
            }
            if (typeof(pkg.browser === 'object') &&
                Object.values(pkg.browser).find((entry: string) => resolveContext.resource === path.resolve(pkgRoot, entry))
            ) {
                return false;
            }

        }

        return true;
    }

    public getTargetFromContext(context: any): BabelTarget {
        if (context.contextInfo && context.contextInfo.babelTarget) {
            return context.contextInfo.babelTarget;
        }
        if (context.resourceResolveData &&
            context.resourceResolveData.context &&
            context.resourceResolveData.context.babelTarget
        ) {
            return context.resourceResolveData.context.babelTarget;
        }
        const dependencies = context.dependencies;
        for (const dep of dependencies) {
            if (dep.babelTarget) {
                return dep.babelTarget;
            }
            if (dep.originModule) {
                const target = BabelTarget.findTarget(dep.originModule);
                if (target) {
                    return target;
                }
            }
        }
    }

    private getTargetedBabelLoader(loader: any, babelTarget: BabelTarget) {
        if (!this.babelLoaders[babelTarget.key]) {
            this.babelLoaders[babelTarget.key] = Object.assign({}, loader, {
                loader: this.babelLoaderPath,
                options: babelTarget.options,
            });
        }
        return this.babelLoaders[babelTarget.key];
    };

    private replaceLoader(resolveContext: any, babelTarget?: BabelTarget): void {
        const targetedLoaderIndex = resolveContext.loaders.findIndex((loaderInfo: any) => {
            if (loaderInfo === this.multiTargetLoaderPath) {
                return true;
            }
            if (loaderInfo.loader === this.multiTargetLoaderPath) {
                return true;
            }
        });
        if (targetedLoaderIndex < 0) {
            return;
        }
        const multiTargetLoader = resolveContext.loaders[targetedLoaderIndex];
        if (!babelTarget) {
            resolveContext.loaders.splice(targetedLoaderIndex, 1);
            return;
        }
        resolveContext.loaders.splice(targetedLoaderIndex, 1, this.getTargetedBabelLoader(multiTargetLoader, babelTarget));
    }

    public static get loader(): string {
        return require.resolve('./placeholder.loader');
    }

}
