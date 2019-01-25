import ModuleDependency = require('webpack/lib/dependencies/ModuleDependency')

import { BabelTarget }                          from './babel.target'
import { BabelTargetEntryDependency, EntryLoc } from './babel.target.entry.dependency'
import { DEV_SERVER_CLIENT }                    from './constants'

export class BabelTargetSingleEntryDependency extends ModuleDependency implements BabelTargetEntryDependency {

  public name: string
  public loc: EntryLoc

  public get type(): string {
    return "babel target single entry"
  }

  public getResourceIdentifier(): string {
    return `module${this.request}!${this.babelTarget.key}`
  }

  constructor(public babelTarget: BabelTarget, request: string, public originalName: string, loc?: EntryLoc) {
    super(`${request.startsWith(DEV_SERVER_CLIENT) ? request : babelTarget.getTargetedRequest(request)}`)

    this.name = babelTarget.getTargetedAssetName(originalName)
    if (!loc) {
      loc = { name: `${this.request}:${babelTarget.key}` }
    } else {
      loc.name += `:${babelTarget.key}`
    }
    this.loc = loc
  }
}
