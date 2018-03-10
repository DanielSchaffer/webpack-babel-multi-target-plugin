import { TransformOptions } from 'babel-core';

import { BabelTargetInfo }    from './babel.target.info';
import { BrowserProfileName } from './browser.profile.name';

export interface BabelTarget extends BabelTargetInfo {

    profileName: BrowserProfileName;
    key: string;
    options: TransformOptions;
}
