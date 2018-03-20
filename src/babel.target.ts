import { BabelLoaderTransformOptions, BabelPresetOptions } from 'babel-loader';
import * as webpack from 'webpack';
import Chunk = webpack.compilation.Chunk;
import ChunkGroup = webpack.compilation.ChunkGroup;
import Entrypoint = webpack.compilation.Entrypoint;
import Module = webpack.compilation.Module;

import { BabelTargetOptions }    from './babel.target.options';
import { BrowserProfileName, StandardBrowserProfileName } from './browser.profile.name';
import { DEFAULT_BABEL_PLUGINS, DEFAULT_BABEL_PRESET_OPTIONS, DEFAULT_BROWSERS, DEFAULT_TARGET_INFO } from './defaults';

export type BabelTargetSource = Module | Chunk | ChunkGroup;

/**
 * Represents a targeted transpilation output.
 *
 * Includes properties from {@link BabelTargetOptions}, but all properties are required.
 */
export type BabelTargetInfo = { [p in keyof BabelTargetOptions]: BabelTargetOptions[p] } & {
    readonly profileName: BrowserProfileName;
    readonly options: BabelLoaderTransformOptions;
};

// webpack doesn't actually export things from the `compilation` namespace, so can only use them to
// type checking, not anything at runtime like instanceof
// so, need to do this instead
const SIG = {
    module: [
        'disconnect',
        'unseal',
        'isEntryModule',
        'isInChunk',
    ],
    entrypoint: [
        'isInitial',
        'getFiles',
        'getRuntimeChunk',
        'setRuntimeChunk',
    ],
    chunkGroup: [
        'unshiftChunk',
        'insertChunk',
        'pushChunk',
        'replaceChunk',
        'isInitial',
        'addChild',
        'getChildren',
        'getNumberOfChildren',
    ]
};

function hasSig(obj: any, sig: string[]): boolean {
    return sig.every(name => typeof obj[name] === 'function');
}

function isModule(obj: any): obj is Module {
    return hasSig(obj, SIG.module);
}

function isEntrypoint(obj: any): obj is Entrypoint {
    return hasSig(obj, SIG.entrypoint);
}

function isChunkGroup(obj: any): obj is ChunkGroup {
    return hasSig(obj, SIG.chunkGroup);
}

function isChunk(obj: any): obj is Chunk {
    return false;
}

export class BabelTarget implements BabelTargetInfo {

    public readonly profileName: BrowserProfileName;
    public readonly key: string;
    public readonly options: BabelLoaderTransformOptions;
    public readonly tagAssetsWithKey: boolean;
    public readonly browsers: string[];
    public readonly esModule: boolean;
    public readonly noModule: boolean;

    constructor(info: BabelTargetInfo) {
        Object.assign(this, info);
    }

    public getTargetedAssetName(name: string): string {
        return this.tagAssetsWithKey ? `${name}.${this.key}` : name;
    }

    public getTargetedRequest(request: string): string {
        const tag = `?babelTarget=${this.key}`;
        if (request.endsWith(tag)) {
            return request;
        }
        return request + tag;
    }

    public static getTargetFromModule(module: Module): BabelTarget {
        if (module.options && module.options.babelTarget) {
            return module.options.babelTarget;
        }

        for (const reason of module.reasons) {
            if (reason.dependency && reason.dependency.babelTarget) {
                return reason.dependency.babelTarget;
            }
            if (reason.module) {
                const target = BabelTarget.getTargetFromModule(reason.module);
                if (target) {
                    return target;
                }
            }
        }

        return null;

    }

    public static getTargetFromEntrypoint(entrypoint: Entrypoint): BabelTarget {
        return BabelTarget.getTargetFromModule(entrypoint.runtimeChunk.entryModule);
    }

    public static getTargetFromGroup(group: ChunkGroup): BabelTarget {
        return null;
    }

    public static getTargetFromChunk(chunk: Chunk): BabelTarget {
        if (chunk.entryModule) {
            return BabelTarget.getTargetFromModule(chunk.entryModule);
        }

        return null;
    }

    public static findTarget(source: BabelTargetSource): BabelTarget {

        if (isModule(source)) {
            return BabelTarget.getTargetFromModule(source);
        }
        if (isEntrypoint(source)) {
            return BabelTarget.getTargetFromEntrypoint(source);
        }
        if (isChunkGroup(source)) {
            return BabelTarget.getTargetFromGroup(source);
        }
        if (isChunk(source)) {
            return BabelTarget.getTargetFromChunk(source);
        }

        return null;
    }
}

export class BabelTargetFactory {

    constructor(private presetOptions: BabelPresetOptions, private plugins: string[]) {
    }

    public createBabelTarget(profileName: BrowserProfileName, options: BabelTargetOptions) {
        const browsers = options.browsers || DEFAULT_BROWSERS[profileName];
        const key = options.key || profileName;

        const info: BabelTargetInfo = Object.assign(
            {},
            DEFAULT_TARGET_INFO[profileName as StandardBrowserProfileName],
            options,
            {
                profileName,
                browsers,
                key,
                options: this.createTransformOptions(key, browsers),
            },
        );

        return new BabelTarget(info);
    }

    public createTransformOptions(key: string, browsers: string[]): BabelLoaderTransformOptions {

        const mergedPresetOptions = Object.assign(
            {},
            DEFAULT_BABEL_PRESET_OPTIONS,
            this.presetOptions,
            {
                targets: {
                    browsers,
                },
            },
            {
                modules: false,
            },
        );

        return {
            // ignore: [
            //     ...STANDARD_IGNORED,
            //     ...this.options.ignore || [],
            // ],
            presets: [
                [ '@babel/preset-env', mergedPresetOptions ],
            ],
            plugins: [
                ...DEFAULT_BABEL_PLUGINS,
                ...this.plugins,
            ],
            cacheDirectory: `node_modules/.cache/babel-loader/${key}`,
        };

    }
}
