import { BabelPresetOptions }               from 'babel-loader';
import { Tapable }                          from 'tapable';
import { Condition, Configuration, Plugin } from 'webpack';

import { BabelTarget }   from './babel.target';
import { TargetInfoMap } from './babel.target.info';

export type PluginsFn = (target: BabelTarget) => (Tapable | Plugin)[];

export interface Options {
    targets?: TargetInfoMap;
    config?: Configuration;
    plugins?: PluginsFn;
    exclude?: Condition[];

    babel?: {
        plugins?: string[];
        presetOptions?: BabelPresetOptions;
    }
}
