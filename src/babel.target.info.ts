import { StandardBrowserProfileName } from './browser.profile.name';

export interface BabelTargetInfo {
    key?: string;
    tagAssetsWithKey?: boolean;
    browsers: string[];
    esModule: boolean;
}

export type StandardTargetInfoMap = { [browserProfile in keyof typeof StandardBrowserProfileName]: BabelTargetInfo };
export type CustomTargetInfoMap = { [browserProfile: string]: BabelTargetInfo };
export type TargetInfoMap = StandardTargetInfoMap & CustomTargetInfoMap;
