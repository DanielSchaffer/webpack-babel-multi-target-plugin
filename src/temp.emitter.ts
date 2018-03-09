import { mkdirp, unlink, writeFile } from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import { Compilation } from 'webpack';

export interface TempAsset {
    name: string;
    path: string;
}

export class TempEmitter {

    private isDisposed: boolean;
    private tmpDir: string;

    constructor(private compilation: Compilation) {
        this.tmpDir = path.resolve(os.tmpdir(), compilation.fullHash);
    }

    public async init(): Promise<void> {
        await mkdirp(this.tmpDir);
    }

    public async emit(): Promise<TempAsset[]> {
        return await Promise.all(Object.keys(this.compilation.assets)
            .map(async assetFile => {
                const asset = this.compilation.assets[assetFile];
                const assetPath = path.resolve(this.tmpDir, assetFile);
                await mkdirp(path.dirname(assetPath));
                await writeFile(assetPath, asset.source(), 'utf-8');
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

        await unlink(this.tmpDir);

        this.isDisposed = true;
    }
}
