import * as path from 'path';

import { compilation, Compiler } from 'webpack';

import ContextModuleFactory = compilation.ContextModuleFactory;
import Dependency           = compilation.Dependency;
import NormalModuleFactory  = compilation.NormalModuleFactory;

import { BabelTarget }       from './babel.target';
import { STANDARD_EXCLUDED } from './excluded.packages';
import { PLUGIN_NAME }       from './plugin.name';

/**
 * @internal
 */
export class TranspilerCompiler {

    constructor(
        private targets: BabelTarget[],
    ) {
    }

    public init(compiler: Compiler): void {


    }

    private removeBabelLoader(resolveContext: any): void {
        // TODO: remove the loader;
    }

}
