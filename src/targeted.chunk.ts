import * as webpack from 'webpack';
import Chunk = webpack.compilation.Chunk;
import ChunkGroup = webpack.compilation.ChunkGroup;

import { BabelTarget } from './babel.target';

export class TargetedChunk {

    private _target: BabelTarget;
    public get target(): BabelTarget {
        if (!this._target) {
            this._target = BabelTarget.findTarget(this.group) || BabelTarget.findTarget(this.chunk);
        }
        return this._target;
    }

    public readonly chunk: Chunk;
    public readonly group: ChunkGroup;

    constructor(group: ChunkGroup, chunk: Chunk) {
        this.chunk = chunk;
        this.group = group;
    }

}

export class TargetedChunkMap {

    private innerMap: { [key: string]: TargetedChunk } = {};
    private targetedChunks: { [hash: string]: TargetedChunk } = {};

    constructor(private publicPath: string) {
        if (typeof(this.publicPath) === 'undefined') {
            this.publicPath = '';
        }
    }

    public get(key: string): TargetedChunk {
        return this.innerMap[key];
    }

    public set(key: string, group: ChunkGroup, chunk: Chunk): void {
        this.innerMap[this.publicPath + key] = this.getTargetedChunk(group, chunk);
    }

    private getTargetedChunk(group: ChunkGroup, chunk: Chunk): TargetedChunk {
        const key = group.id + chunk.hash;
        if (!this.targetedChunks[key]) {
            this.targetedChunks[key] = new TargetedChunk(group, chunk);
        }
        return this.targetedChunks[key];
    }

}
