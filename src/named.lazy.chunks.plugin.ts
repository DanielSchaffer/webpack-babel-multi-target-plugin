import { compilation, Compiler, Plugin } from 'webpack';

import Chunk =       compilation.Chunk;
import Compilation = compilation.Compilation;
import Origin =      compilation.Origin;

import { BabelTarget } from './babel.target';

const PLUGIN_NAME = 'NamedLazyChunksPlugin';

export class NamedLazyChunksPlugin implements Plugin {

    private getNameFromOrigin(chunk: Chunk): string {
        for(let group of chunk.groupsIterable) {
            if (!group.origins || !group.origins.length) {
                continue;
            }
            const origin = group.origins.find(
                (origin: Origin) => !!(origin.request && origin.request.match(/\.ngfactory$/)),
            );
            if (!origin) {
                continue;
            }

            const babelTarget = BabelTarget.findTarget(origin.module);
            if (!babelTarget) {
                throw new Error('no babel target for lazy chunk');
            }

            const cleanedName = origin.request.replace(/\.ngfactory$/, '');
            const nameStart = cleanedName.lastIndexOf('/') + 1;
            const name = cleanedName.substring(nameStart);
            return babelTarget.tagAssetsWithKey ? `${name}.${babelTarget.key}` : name;
        }
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

                    chunk.id = this.getNameFromOrigin(chunk);
                });
            });
        });
    }

}
