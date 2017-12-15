/** @type {BabelPresetOptions} **/
const DEFAULT_PRESET_OPTIONS = {
    modules: false,
    useBuiltIns: 'usage',
};

const DEFAULT_PLUGINS = [
    '@babel/plugin-syntax-dynamic-import'
];

/**
 *
 * @param {Array<string>} browserList
 * @param {BabelPresetOptions} [presetOptions]
 * @param {Array<string>} [plugins]
 * @returns {TransformOptions}
 */
module.exports.configureBabelTransformOptions = (browserList, presetOptions = DEFAULT_PRESET_OPTIONS, plugins = DEFAULT_PLUGINS) => {
    if (!Array.isArray(browserList)) {
        throw new Error('browserList is required, and must be an array of strings');
    }

    const mergedPresetOptions = Object.assign({}, presetOptions, {
        targets: {
            browsers: browserList,
        },
    });

    return {
        presets: [
            [ '@babel/preset-env', mergedPresetOptions ],
        ],
        plugins,
    };
};

/**
 *
 * @param {Array<string>} browserList
 * @param {BabelPresetOptions} [presetOptions]
 * @param {Array<string>} [plugins]
 * @returns {NewLoader}
 */
module.exports.configureBabelLoader = (browserList, presetOptions = DEFAULT_PRESET_OPTIONS, plugins = DEFAULT_PLUGINS) => {

    return {
        loader: 'babel-loader',
        options: module.exports.configureBabelTransformOptions(browserList, presetOptions, plugins),
    };
};

module.exports.browserProfiles = require('./browser.profiles');

module.exports.excludedPackages = require('./babel.loader.excluded.packages');