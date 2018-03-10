import { StandardBrowserProfileName } from './browser.profile.name';

/**
 * Options for defining targets and their behavior
 */
export interface BabelTargetInfo {

    /**
     * Used to identify the target, and is appended to the filename of an asset if
     * {@see BabelTargetInfo.tagAssetsWithKey} is set to `true`. Defaults to the {@see BrowserProfileName}.
    */
    key?: string;

    /**
     * Determines whether {@see BabelTargetInfo.key} is appended to the filename of this target's assets. Defaults to
     * `true` for {@see StandardBrowserProfileName.modern}, `false` for {@see StandardBrowserProfileName.legacy}. Only
     * one target can have this property set to `false`.
     */
    tagAssetsWithKey?: boolean;

    /**
     * Determines the browser definitions used in `babel-loader`'s {@see BabelPresetOptions.targets.browsers}.
     *
     * Defaults:
     *     {@see StandardBrowserProfileName.modern}: {@see DEFAULT_MODERN_BROWSERS}
     *     {@see StandardBrowserProfileName.legacy}: {@see DEFAULT_LEGACY_BROWSERS}
     */
    browsers?: string[];

    /**
     * Determines whether this target can be referenced by a `<script type="module">` tag. Only one target may have this
     * property set to `true`.
     */
    esModule?: boolean;

    /**
     * Determines whether this target can be referenced by a `<script nomodule>` tag. Only one target may have this
     * property set to `true`.
     */
    noModule?: boolean;
}

/**
 * A map of {@see BabelTargetInfo} keyed by {@see StandardBrowserProfileName}.
 */
export type StandardTargetInfoMap = { [browserProfile in keyof typeof StandardBrowserProfileName]: BabelTargetInfo };

/**
 * A map of {@see BabelTargetInfo} keyed by custom browser profile names.
 */
export type CustomTargetInfoMap = { [browserProfile: string]: BabelTargetInfo };

/**
 * A map of {@see BabelTargetInfo} keyed by either {@see StandardBrowserProfileName} or custom profile names.
 */
export type TargetInfoMap = StandardTargetInfoMap & CustomTargetInfoMap;
