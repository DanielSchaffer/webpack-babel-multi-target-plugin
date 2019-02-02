import { compilation, Compiler } from 'webpack'
import Compilation = compilation.Compilation;

import { BabelTarget }                      from './babel-target'
import { BabelTargetEntryDependency }       from './babel.target.entry.dependency'
import { BabelTargetEntryPlugin }           from './babel.target.entry.plugin'
import { BabelTargetSingleEntryDependency } from './babel.target.single.entry.dependency'

export class BabelTargetSingleEntryPlugin extends BabelTargetEntryPlugin {

  constructor(targets: BabelTarget[], context: string, name: string, private entry: string) {
    super(targets, context, name)
  }

  public apply(compiler: Compiler): void {
    super.apply(compiler)

    compiler.hooks.make.tapPromise(
      'BabelTargetSingleEntryPlugin',
      async (compilation: Compilation) => {

        await Promise.all(this.targets.map(async target => {
          const dep = BabelTargetSingleEntryPlugin.createDependency(target, this.entry, this.name)
          return await this.addEntry(compilation, dep)
        }))

      },
    )
  }

  static createDependency(target: BabelTarget, entry: string, name: string): BabelTargetEntryDependency {
    return new BabelTargetSingleEntryDependency(target, entry, name)
  }

}
