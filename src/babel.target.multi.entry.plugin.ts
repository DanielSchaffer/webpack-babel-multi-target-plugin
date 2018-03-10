import { compilation, Compiler } from 'webpack';
import Compilation = compilation.Compilation;
import MultiModuleFactory = require('webpack/lib/MultiModuleFactory');

import { BabelTarget }                      from './babel.target';
import { BabelTargetEntryPlugin }           from './babel.target.entry.plugin';
import { BabelTargetMultiEntryDependency }  from './babel.target.multi.entry.dependency';
import { BabelTargetSingleEntryDependency } from './babel.target.single.entry.dependency';

export class BabelTargetMultiEntryPlugin extends BabelTargetEntryPlugin {

    constructor(targets: BabelTarget[], context: string, name: string, private entries: string[]) {
        super(targets, context, name);
    }

    public apply(compiler: Compiler): void {
        super.apply(compiler);

        compiler.hooks.compilation.tap(
            'BabelTargetMultiEntryPlugin',
            (compilation: Compilation, { multiModuleFactory }: { multiModuleFactory: MultiModuleFactory }) => {
                (compilation.dependencyFactories as Map<any, any>).set(
                    BabelTargetMultiEntryDependency,
                    multiModuleFactory
                );
            }
        );

        compiler.hooks.make.tapPromise(
            'BabelTargetMultiEntryPlugin',
            async (compilation: Compilation) => {

                await Promise.all(this.targets.map(async target => {
                    const dep = BabelTargetMultiEntryPlugin.createDependency(target, this.entries, this.name);
                    return await this.addEntry(compilation, dep);
                }))
            }
        );
    }

    static createDependency(target: BabelTarget, entries: string[], name: string) {
        return new BabelTargetMultiEntryDependency(target,
            entries.map((e, idx) => {
                const dep = new BabelTargetSingleEntryDependency(target, e, name);
                // Because entrypoints are not dependencies found in an
                // existing module, we give it a synthetic id
                dep.loc = `${name}:${100000 + idx}`;
                return dep;
            }),
            name
        );
    }

}
