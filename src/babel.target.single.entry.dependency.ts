import { BabelTarget } from './babel.target';
import { BabelTargetEntryDependency } from './babel.target.entry.dependency';

import ModuleDependency = require('webpack/lib/dependencies/ModuleDependency');

export class BabelTargetSingleEntryDependency extends ModuleDependency implements BabelTargetEntryDependency {

    public loc: string;
    public name: string;

    public get type(): string {
        return "babel target single entry";
    }

    public getResourceIdentifier(): string {
        return `module${this.request}!${this.babelTarget.key}`;
    }

    constructor(public babelTarget: BabelTarget, request: string, public originalName: string) {
        super(`${babelTarget.getTargetedRequest(request)}`);

        this.name = babelTarget.getTargetedAssetName(originalName);
        this.loc = `${this.request}!${babelTarget.key}`;
    }
}
