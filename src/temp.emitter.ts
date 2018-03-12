import { mkdirp, rmdir, unlink, writeFile } from 'fs-extra';
import * as os         from 'os';
import * as path       from 'path';
import { Compilation } from 'webpack';

/**
 * @internal
 */
export interface TempAsset {
    name: string;
    path: string;
}

/**
 * @internal
 */
export class TempEmitter {

    private isDisposed: boolean;
    private files: string[] = [];

    private _context: string;
    public get context(): string {
        return this._context;
    }

    constructor(private compilation: Compilation) {
        this._context = path.resolve(os.tmpdir(), compilation.fullHash);
    }

    public async init(): Promise<void> {
        if (this.isDisposed) {
            throw new Error('Cannot init, already disposed');
        }
        await mkdirp(this._context);
    }

    public async emit(): Promise<TempAsset[]> {
        if (this.isDisposed) {
            throw new Error('Cannot emit, already disposed');
        }
        return await Promise.all(Object.keys(this.compilation.assets)
            .map(async assetFile => {
                const asset = this.compilation.assets[assetFile];
                const assetPath = path.resolve(this._context, assetFile);
                await mkdirp(path.dirname(assetPath));
                await writeFile(assetPath, asset.source(), 'utf-8');
                this.files.push(assetPath);
                return {
                    name: assetFile,
                    path: assetPath,
                };
            }),
        );
    }

    public async dispose(): Promise<void> {
        if (this.isDisposed) {
            return;
        }

        await Promise.all(this.files.map(file => unlink(file)));
        this.files = undefined;

        await rmdir(this._context);
        this._context = undefined;

        this.isDisposed = true;
    }
}
