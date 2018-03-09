import { Compiler, Plugin } from 'webpack';

import { PLUGIN_NAME }      from './plugin.name';
import { Target }           from './webpack.babel.multi.target.options';

export class BabelTargetChunkIdPrefixer implements Plugin {

    constructor(private target: Target) { }

    public apply(compiler: Compiler): void {
        compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: any) => {
            // add the key as the chunk name suffix for any chunks created

            compilation.hooks.beforeChunkIds.tap(PLUGIN_NAME, (chunks: any[]) => {
                chunks.forEach(chunk => {
                    if (chunk.id || chunk.name) {
                        let id = chunk.id || chunk.name;
                        if (this.target.tagWithKey !== false) {
                            id += `.${this.target.key}`;
                        }
                        chunk.id = id;
                        chunk.name = id;
                    }
                });
            });
        });
    }

}
