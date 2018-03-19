import { compilation, Compiler, Plugin } from 'webpack';

import Chunk =       compilation.Chunk;
import Compilation = compilation.Compilation;
import Origin =      compilation.Origin;

import { BabelTarget } from './babel.target';

const PLUGIN_NAME = 'NamedLazyChunksPlugin';

/**
 * Gives names to lazy chunks (lazy routes) so their assets have recognizable names instead of just numbers.
 */
export class NamedLazyChunksPlugin implements Plugin {

    private getNameFromOrigins(chunk: Chunk): string {

        const nameInfo = [...chunk.groupsIterable].reduce((result, group) => {
            if (!group.origins) {
                return;
            }
            group.origins.forEach((origin: Origin) => {
                if (!origin.request || !origin.request.match(/\.ngfactory$/)) {
                    return;
                }
                const cleanedName = origin.request.replace(/\.ngfactory$/, '');
                const nameStart = cleanedName.lastIndexOf('/') + 1;
                const originName = cleanedName.substring(nameStart);

                if (!result.origins.includes(originName)) {
                    result.origins.push(originName);
                }

                if (!result.babelTarget) {
                    result.babelTarget = BabelTarget.findTarget(origin.module);
                }
            });
            return result;
        }, { origins: [] } as { origins: string[], babelTarget?: BabelTarget });


        const name = nameInfo.origins.join('~');
        return nameInfo.babelTarget.tagAssetsWithKey ? `${name}.${nameInfo.babelTarget.key}` : name;
    }

    public apply(compiler: Compiler): void {
        compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: Compilation) => {
            if (compilation.name) {
                return;
            }
            compilation.hooks.beforeChunkIds.tap(PLUGIN_NAME, (chunks: Chunk[]) => {
                chunks.forEach(chunk => {
                    if (chunk.id || chunk.name) {
                        return;
                    }

                    const isVendorsChunk = chunk.chunkReason === 'split chunk (cache group: vendors)';
                    chunk.id = `${isVendorsChunk ? 'vendors~': ''}${this.getNameFromOrigins(chunk)}`;
                });
            });
        });
    }

}
