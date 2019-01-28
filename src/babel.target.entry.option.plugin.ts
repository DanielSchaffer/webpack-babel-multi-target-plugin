import { Compiler } from 'webpack'

import { BabelTarget }                  from './babel.target'
import { BabelTargetMultiEntryPlugin }  from './babel.target.multi.entry.plugin'
import { BabelTargetSingleEntryPlugin } from './babel.target.single.entry.plugin'

// takes over processing of webpack's entry options so that it generates one entry per entry and target
// basically the same as webpack's built-in EntryOptionPlugin, just using the babel targeting stuff instead

/**
 * @internalapi
 */
export class BabelTargetEntryOptionPlugin {

  constructor(private targets: BabelTarget[]) {
  }

  private itemToPlugin(context: string, item: string | string[], name: string) {
    if (Array.isArray(item)) {
      return new BabelTargetMultiEntryPlugin(this.targets, context, name, item)
    }
    if (this.targets.find(target => !!(target.additionalModules && target.additionalModules.length))) {
      return new BabelTargetMultiEntryPlugin(this.targets, context, name, [item])
    }
    return new BabelTargetSingleEntryPlugin(this.targets, context, name, item)
  }

  public apply(compiler: Compiler) {
    compiler.hooks.entryOption.tap('EntryOptionPlugin', (context: string, entry: any) => {
      if (typeof entry === 'string' || Array.isArray(entry)) {
        this.itemToPlugin(context, entry, 'main').apply(compiler)
      } else if (typeof entry === 'object') {
        for (const name of Object.keys(entry)) {
          this.itemToPlugin(context, entry[name], name).apply(compiler)
        }
      } else if (typeof entry === 'function') {
        throw new Error('not supported')
        // new DynamicEntryPlugin(context, entry).apply(compiler)
      }
      return true
    })
  }
}
