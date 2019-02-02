import { compilation, Compiler, Plugin } from 'webpack'
import Compilation = compilation.Compilation
import Dependency = compilation.Dependency
import NormalModuleFactory = compilation.NormalModuleFactory

import { BabelTarget }                      from './babel-target'
import { BabelTargetSingleEntryDependency } from './babel.target.single.entry.dependency'
import { BabelTargetEntryDependency }       from './babel.target.entry.dependency'

export abstract class BabelTargetEntryPlugin implements Plugin {

  protected constructor(protected targets: BabelTarget[], protected context: string, protected name: string) {
  }

  public apply(compiler: Compiler): void {
    compiler.hooks.compilation.tap(
      this.constructor.name,
      (compilation: Compilation, { normalModuleFactory }: { normalModuleFactory: NormalModuleFactory }) => {
        (compilation.dependencyFactories as Map<any, any>).set(
          BabelTargetSingleEntryDependency,
          normalModuleFactory,
        )
      },
    )
  }

  protected async addEntry(compilation: Compilation, dep: BabelTargetEntryDependency): Promise<void>
  protected async addEntry(compilation: Compilation, dep: Dependency, name: string): Promise<void>
  protected async addEntry(compilation: Compilation, dep: Dependency, name?: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      compilation.addEntry(this.context, dep, (dep as BabelTargetEntryDependency).name || name, (err: Error) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

}
