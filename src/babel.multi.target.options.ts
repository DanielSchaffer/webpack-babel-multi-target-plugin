import { BabelPresetOptions } from 'babel-loader';

import { TargetInfoMap }      from './babel.target.options';

/**
 * Options for configuring {@see BabelMultiTargetPlugin}.
 */
export interface Options {

    /**
     * A map of {@see TargetInfo} objects defining the targets for transpilation.
     */
    targets?: TargetInfoMap;

    /**
     * An array of globs which will be excluded from transpilation. By default, {@see BabelMultiTargetPlugin}
     * will attempt to automatically exclude any CommonJs modules, on the assumption that these modules will have
     * already been transpiled by their publisher.
     */
    ignore?: string[];

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
