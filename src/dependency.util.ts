import * as path from 'path';
import { Compilation, BuildModule } from 'webpack';

export enum MainKey {
    main = 'main',
    module = 'module',
    esm2015 = 'esm2015',
}

export interface MainInfo {
    key: MainKey;
    file: string;
}

export class DependencyUtil {

    private packages: { [modulePath: string]: MainInfo[] } = {};

    // TODO: is this needed?
    // currently using usesCommonJs to determine whether or not to transpile, but we could base it on whether
    // the module was loaded from the package's "main" (skip transpiling), "module" (needs transpiling),
    // or "esm2015" (needs transpiling) file
    public getPackageInfo(modulePath: string): MainInfo[] {
        if (this.packages[modulePath]) {
            return this.packages[modulePath];
        }

        const pkg = require(path.resolve(modulePath, 'package.json'));
        const info: MainInfo[] = Object.keys(MainKey)
            .filter(key => pkg.hasOwnProperty(key))
            .map(key => ({ key: key as MainKey, file: pkg[key] }));

        this.packages[modulePath] = info;
        return info;
    }

    public getDependencies(
        compilation: Compilation,
    ): any {
        return compilation.modules
            .reduce((result, module: BuildModule) => {
                if (!module.request || module.request.includes('!') || result.cache[module.request]) {
                    return result;
                }
                const match = module.request.match(/(.*\/?node_modules\/(?!@types)(?:@[\w-_.]+\/)?[\w-_.]+)\/(.+)/);
                if (!match) {
                    return result;
                }
                const modulePath = match[1];
                const file = match[2];
                let lib = result.libMap[modulePath];
                if (!lib) {
                    lib = {
                        pkgInfo: this.getPackageInfo(modulePath),
                        entry: {},
                        depInfo: [],
                        usesCommonJs: false,
                        libName: modulePath.match(/node_modules\/(.*)/)[1],
                    };
                    result.libMap[modulePath] = lib;
                    result.libs.push(lib);
                }
                lib.pkgInfo
                    .filter((entry: MainInfo) => entry.file === file)
                    .forEach((entry: MainInfo) => {
                        lib.entry[entry.key] = file;
                    });
                if (module.issuer) {
                    const deps = module.issuer.dependencies.filter(dep => dep.module && dep.module.request === module.request);
                    lib.depInfo.push(...deps);

                    // TODO: is this a reliable way to figure out whether a package shouldn't be transpiled?
                    // the assumption is that if we're loading a commonjs module, the author would have already
                    // transpiled it before publishing
                    if (deps.find(dep => !!dep.constructor.name.match(/CommonJs/))) {
                        lib.usesCommonJs = true;
                    }
                }

                result.cache[module.request] = true;
                return result;
            }, { cache: {} as any, libMap: {} as any, libs: []} as any);
    }
}
