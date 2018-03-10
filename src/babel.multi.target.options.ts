import { BabelPresetOptions }               from 'babel-loader';
import { Tapable }                          from 'tapable';
import { Condition, Configuration, Plugin } from 'webpack';

import { BabelTarget }   from './babel.target';
import { TargetInfoMap } from './babel.target.info';

/**
 * A function that will return an array of {@see webpack.Plugin} instances to be used on transpilation
 * compilations. The function should instantiate a new set up plugin instances every time it is called.
 */
export type PluginsFn = (target: BabelTarget) => (Tapable | Plugin)[];

/**
 * Options for configuring {@see BabelMultiTargetPlugin}.
 */
export interface Options {

    /**
     * A map of {@see TargetInfo} objects defining the targets for transpilation.
     */
    targets?: TargetInfoMap;

    /**
     * A webpack {@see Configuration} object to use as the base configuration for transpilation compilations.
     */
    config?: Configuration;

    /**
     * A {@see PluginsFn} that will return an array of {@see webpack.Plugin} instances to be used on transpilation
     * compilations. The function should instantiate a new set up plugin instances every time it is called.
     */
    plugins?: PluginsFn;

    /**
     * An array of {@see Condition} which will be excluded from transpilation. By default, {@see BabelMultiTargetPlugin}
     * will attempt to automatically exclude any CommonJs modules, on the assumption that these modules will have
     * already been transpiled by their publisher.
     */
    exclude?: Condition[];

    /**
     * Options for configuring `babel-loader`.
     */
    babel?: {

        /**
         * A list of plugins to use. `@babel/plugin-syntax-dynamic-import` is included by default.
         */
        plugins?: string[];

        /**
         * Options for configuring `@babel/preset-env`. Defaults to
         *
         * ```
         * {
         *     modules: false,
         *     useBuiltIns: 'usage',
         * }
         * ```
         *
         * **IMPORTANT:** `modules` is forced to `false`.
         */
        presetOptions?: BabelPresetOptions;
    }
}
