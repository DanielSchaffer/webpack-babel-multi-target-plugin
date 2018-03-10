import { TransformOptions } from 'babel-core';

import { BabelTargetInfo }    from './babel.target.info';
import { BrowserProfileName } from './browser.profile.name';

/**
 * Represents a targeted transpilation output.
 *
 * Includes properties from {@see BabelTargetInfo}, but all properties are required.
 */
export type BabelTarget = { [p in keyof BabelTargetInfo]: BabelTargetInfo[p] } & {
    profileName: BrowserProfileName;
    options: TransformOptions;
};
