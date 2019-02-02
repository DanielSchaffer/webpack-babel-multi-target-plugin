import { BabelTarget } from './babel-target'

import Dependency = require('webpack/lib/Dependency')

export interface EntryLoc {
  name: string
  index?: number
}

export interface BabelTargetEntryDependency extends Dependency {
  babelTarget: BabelTarget
  loc: EntryLoc
  name: string
}
