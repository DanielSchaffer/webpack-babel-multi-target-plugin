import { BabelTarget } from './babel.target';

import Dependency = require('webpack/lib/Dependency');

export interface BabelTargetEntryDependency extends Dependency {
    babelTarget: BabelTarget;
    loc: string;
    name: string;
}
