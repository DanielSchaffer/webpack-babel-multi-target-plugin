import { Tapable } from 'tapable';
import { BabelTargetModule } from './babel.target.module';
import { BabelTargetSingleEntryDependency } from './babel.target.single.entry.dependency';

export class BabelTargetModuleFactory extends Tapable {
    constructor() {
        super();
        // this.hooks = {};
    }

    public create(data: any, callback: Function) {
        const dependency: BabelTargetSingleEntryDependency = data.dependencies[0];
        callback(
            null,
            new BabelTargetModule(data.context, dependency.dependencies, dependency.name)
        );
    }
}
