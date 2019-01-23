import { StandardBrowserProfileName } from './browser.profile.name'

/**
 * Options for defining targets and their behavior
 */
export interface BabelTargetOptions {

  /**
   * Used to identify the target, and is appended to the filename of an asset if
   * {@link BabelTargetOptions.tagAssetsWithKey} is set to `true`. Defaults to the {@link BrowserProfileName}.
   */
  key?: string

  /**
   * Determines whether {@link BabelTargetOptions.key} is appended to the filename of this target's assets. Defaults to
   * `true` for {@link StandardBrowserProfileName.modern}, `false` for {@link StandardBrowserProfileName.legacy}. Only
   * one target can have this property set to `false`.
   */
  tagAssetsWithKey?: boolean

  /**
   * Determines the browser definitions used in `babel-loader`'s {@link BabelPresetOptions.targets.browsers}.
   *
   * Defaults:
   *     {@link StandardBrowserProfileName.modern}: {@link DEFAULT_MODERN_BROWSERS}
   *     {@link StandardBrowserProfileName.legacy}: {@link DEFAULT_LEGACY_BROWSERS}
   */
  browsers?: string[]

  /**
   * Determines whether this target can be referenced by a `<script type="module">` tag. Only one target may have this
   * property set to `true`.
   */
  esModule?: boolean

  /**
   * Determines whether this target can be referenced by a `<script nomodule>` tag. Only one target may have this
   * property set to `true`.
   */
  noModule?: boolean
}

/**
 * A map of {@link BabelTargetOptions} keyed by {@link StandardBrowserProfileName}.
 */
export type StandardTargetOptionsMap = { [browserProfile in keyof typeof StandardBrowserProfileName]: BabelTargetOptions }

/**
 * A map of {@link BabelTargetOptions} keyed by custom browser profile names.
 */
export type CustomTargetOptionsMap = { [browserProfile: string]: BabelTargetOptions }

/**
 * A map of {@link BabelTargetOptions} keyed by either {@link StandardBrowserProfileName} or custom profile names.
 */
export type TargetOptionsMap = StandardTargetOptionsMap & CustomTargetOptionsMap
