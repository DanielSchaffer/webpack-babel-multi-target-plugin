import { BabelPresetOptions } from 'babel-loader'

import { TargetOptionsMap }   from './babel.target.options'

export enum SafariNoModuleFix {
  external = 'external',
  inline = 'inline',
  inlineData = 'inline-data',
  inlineDataBase64 = 'inline-data-base64',
}

export type SafariNoModuleFixOption = boolean | SafariNoModuleFix

export type BabelLoaderCacheDirectoryOption = boolean | string | ((key: string) => string)

/**
 * Options for configuring {@link BabelMultiTargetPlugin}.
 */
export interface Options {

  /**
   * A map of {@link BabelTargetOptions} objects defining the targets for transpilation.
   */
  targets?: TargetOptionsMap

  /**
   * An array of `RegExp` patterns which will be excluded from transpilation. By default,
   * {@link BabelMultiTargetPlugin} will attempt to automatically exclude any CommonJs modules, on the assumption
   * that these modules will have already been transpiled by their publisher.
   */
  exclude?: RegExp[]

  /**
   * An array of `RegExp` patterns which will excluded from targeting.
   */
  doNotTarget?: RegExp[]

  /**
   * Options for configuring `babel-loader`.
   */
  babel?: {

    /**
     * A list of plugins to use. `@babel/plugin-syntax-dynamic-import` is included by default.
     */
    plugins?: string[]

    /**
     * A list of presets to use. `@babel/preset-env` is included by default.
     */
    presets?: string[]

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
    presetOptions?: BabelPresetOptions

    /**
     * overrides the default cacheDirectory setting for babel-loader
     */
    cacheDirectory?: BabelLoaderCacheDirectoryOption
  }

  /**
   * Embed a polyfill to work around Safari 10.1's missing support for <script nomodule>. Must be used with
   * HtmlWebpackPlugin to work, otherwise the script must be manually included in your HTML template.
   */
  safari10NoModuleFix?: SafariNoModuleFixOption

  /**
   * EXPERIMENTAL. Removes babel targeting query from module ids so they use what the module id would be without using
   * the BabelMultiTargetPlugin. This has the effect of preventing duplicate modules from running in instances where
   * the browser loads both bundles (e.g. Safari 10.1).
   */
  normalizeModuleIds?: boolean
}
