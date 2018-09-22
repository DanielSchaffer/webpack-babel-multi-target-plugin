import { BabelPresetOptions } from 'babel-loader';

import { TargetOptionsMap }   from './babel.target.options';

/**
 * Options for configuring {@link BabelMultiTargetPlugin}.
 */
export interface Options {

    /**
     * A map of {@link BabelTargetOptions} objects defining the targets for transpilation.
     */
    targets?: TargetOptionsMap;

    /**
     * An array of `RegExp` patterns which will be excluded from transpilation. By default,
     * {@link BabelMultiTargetPlugin} will attempt to automatically exclude any CommonJs modules, on the assumption
     * that these modules will have already been transpiled by their publisher.
     */
    exclude?: RegExp[];

    /**
     * An array of `RegExp` patterns which will excluded from targeting.
     */
    doNotTarget?: RegExp[];

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
