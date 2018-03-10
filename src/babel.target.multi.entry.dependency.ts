import { BabelTarget } from './babel.target';
import { BabelTargetSingleEntryDependency } from './babel.target.single.entry.dependency';
import { BabelTargetEntryDependency } from './babel.target.entry.dependency';
import Dependency = require('webpack/lib/Dependency');

export class BabelTargetMultiEntryDependency extends Dependency implements BabelTargetEntryDependency {

    public loc: string;

    public get type(): string {
        return "babel target multi entry";
    }

    constructor(public babelTarget: BabelTarget, public dependencies: BabelTargetSingleEntryDependency[], public name: string) {
        super();
    }
}
