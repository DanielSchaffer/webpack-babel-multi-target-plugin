import { TransformOptions }      from 'babel-core';
import { Tapable }               from 'tapable';
import { Configuration, Plugin } from 'webpack';

import { BrowserProfile } from './browser.profiles';

export type PluginsFn = (target: Target) => (Tapable | Plugin)[];

export interface Options {
    targets: Target[];
    config?: Configuration;
    plugins?: PluginsFn;
}

export interface Target {
    key: string;
    tagWithKey: boolean;
    browserProfile: BrowserProfile;
    options: TransformOptions;
}
