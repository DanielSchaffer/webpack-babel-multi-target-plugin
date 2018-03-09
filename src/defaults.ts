import { BabelPresetOptions } from 'babel-loader';

import { BrowserProfile, BrowserProfiles } from './browser.profiles';

export const DEFAULT_PRESET_OPTIONS: BabelPresetOptions = {
    modules: false,
    useBuiltIns: 'usage',
};

export const DEFAULT_PLUGINS: string[] = [
    '@babel/plugin-syntax-dynamic-import',
];

export const DEFAULT_BROWSER_PROFILE: BrowserProfile = BrowserProfile.modern;

export const DEFAULT_BROWSER_PROFILES: BrowserProfiles = {
    modern: [
        // The last two versions of each browser, excluding versions
        // that don't support <script type="module">.
        'last 2 Chrome versions', 'not Chrome < 60',
        'last 2 Safari versions', 'not Safari < 10.1',
        'last 2 iOS versions', 'not iOS < 10.3',
        'last 2 Firefox versions', 'not Firefox < 54',
        'last 2 Edge versions', 'not Edge < 15',
    ],
    legacy: [
        '> 1%',
        'last 2 versions',
        'Firefox ESR',
    ],
};
