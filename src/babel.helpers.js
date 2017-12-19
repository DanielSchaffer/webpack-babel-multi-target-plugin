/** @type {BabelPresetOptions} **/
const DEFAULT_PRESET_OPTIONS = {
    modules: false,
    useBuiltIns: 'usage',
};

const DEFAULT_PLUGINS = [
    '@babel/plugin-syntax-dynamic-import'
];

module.exports.browserProfiles = require('./browser.profiles');

module.exports.excludedPackages = require('./babel.loader.excluded.packages');

const DEFAULT_BROWSER_PROFILE = module.exports.browserProfiles.modern;

/**
 *
 * @param {Array<string>} browserList
 * @param {BabelPresetOptions} [presetOptions]
 * @param {Array<string>} [plugins]
 * @returns {TransformOptions}
 */
module.exports.configureBabelTransformOptions = (browserList = DEFAULT_BROWSER_PROFILE, presetOptions = DEFAULT_PRESET_OPTIONS, plugins = DEFAULT_PLUGINS) => {
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
module.exports.configureBabelLoader = (browserList = DEFAULT_BROWSER_PROFILE, presetOptions = DEFAULT_PRESET_OPTIONS, plugins = DEFAULT_PLUGINS) => ({

    loader: 'babel-loader',
    options: module.exports.configureBabelTransformOptions(browserList, presetOptions, plugins),

});

/**
 *
 * @param {webpack.Condition | webpack.Condition[]} test
 * @param {webpack.NewLoader[]} [loaders]
 * @param {Array<string>} browserList
 * @param {BabelPresetOptions} [babelPresetOptions]
 * @param {Array<string>} [babelPlugins]
 * @returns {UseRule}
 */
module.exports.configureBabelRule = (test, loaders = [], browserList = DEFAULT_BROWSER_PROFILE, babelPresetOptions = DEFAULT_PRESET_OPTIONS, babelPlugins = DEFAULT_PLUGINS) => ({

    test,
    exclude: module.exports.excludedPackages,
    use: [
        module.exports.configureBabelLoader(browserList, babelPresetOptions, babelPlugins),
        ...loaders,
    ],

});