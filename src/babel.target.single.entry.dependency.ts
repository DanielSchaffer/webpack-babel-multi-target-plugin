import { BabelTarget } from './babel.target';
import { BabelTargetEntryDependency } from './babel.target.entry.dependency';

import ModuleDependency = require('webpack/lib/dependencies/ModuleDependency');

export class BabelTargetSingleEntryDependency extends ModuleDependency implements BabelTargetEntryDependency {

    public name: string;
    public loc: string;

    public get type(): string {
        return "babel target single entry";
    }

    public getResourceIdentifier(): string {
        return `module${this.request}!${this.babelTarget.key}`;
    }

    private static readonly devServerClient = require.resolve('webpack-dev-server/client/index', { paths: [process.cwd()] });

    constructor(public babelTarget: BabelTarget, request: string, public originalName: string, loc?: string) {
        super(`${request.startsWith(BabelTargetSingleEntryDependency.devServerClient) ? request : babelTarget.getTargetedRequest(request)}`);

        this.name = babelTarget.getTargetedAssetName(originalName);
        if (!loc) {
            loc = `${this.request}:${babelTarget.key}`;
        }
        this.loc = loc;
    }
}
