import { compilation, Compiler } from 'webpack'
import Compilation = compilation.Compilation
import NormalModuleFactory = compilation.NormalModuleFactory
import MultiModuleFactory = require('webpack/lib/MultiModuleFactory')
import SingleEntryDependency = require('webpack/lib/dependencies/SingleEntryDependency')

import { BabelTarget }                      from './babel-target'
import { BabelTargetEntryDependency }       from './babel.target.entry.dependency'
import { BabelTargetEntryPlugin }           from './babel.target.entry.plugin'
import { BabelTargetMultiEntryDependency }  from './babel.target.multi.entry.dependency'
import { BabelTargetSingleEntryDependency } from './babel.target.single.entry.dependency'

interface ExistingFactories {
    multiModuleFactory?: MultiModuleFactory
    normalModuleFactory?: NormalModuleFactory
}

export class BabelTargetMultiEntryPlugin extends BabelTargetEntryPlugin {

  constructor(targets: BabelTarget[], context: string, name: string, private entries: string[]) {
    super(targets, context, name)
  }

  public apply(compiler: Compiler): void {
    super.apply(compiler)

    compiler.hooks.compilation.tap(
      'BabelTargetMultiEntryPlugin',
      (compilation: Compilation, { multiModuleFactory, normalModuleFactory }: ExistingFactories) => {
        (compilation.dependencyFactories as Map<any, any>).set(
          BabelTargetMultiEntryDependency,
          multiModuleFactory || new MultiModuleFactory(),
        );
        (compilation.dependencyFactories as Map<any, any>).set(
          SingleEntryDependency,
          normalModuleFactory,
        )
      },
    )

    compiler.hooks.make.tapPromise(
      'BabelTargetMultiEntryPlugin',
      async (compilation: Compilation) => {

        await Promise.all(this.targets.map(async target => {
          const entries = [...(target.additionalModules || []), ...this.entries]
          const dep = BabelTargetMultiEntryPlugin.createDependency(target, entries, this.name)
          return await this.addEntry(compilation, dep)
        }))
      },
    )
  }

  static createDependency(target: BabelTarget, entries: string[], name: string): BabelTargetEntryDependency {
    return new BabelTargetMultiEntryDependency(target,
      entries.map((e, idx) => {
        // Because entrypoints are not dependencies found in an
        // existing module, we give it a synthetic id
        return new BabelTargetSingleEntryDependency(target, e, name, { name, index: idx })
      }),
      name,
    )
  }

}
