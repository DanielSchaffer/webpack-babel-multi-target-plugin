/** @type {BabelPresetOptions} **/
const DEFAULT_PRESET_OPTIONS = {
    modules: false,
    useBuiltIns: 'usage',
};

const DEFAULT_PLUGINS = [
    '@babel/plugin-syntax-dynamic-import',

    // breaks lodash isBuffer
    // 'babel-plugin-transform-commonjs-es2015-modules',
];

module.exports.browserProfiles = require('./browser.profiles');

module.exports.excludedPackages = require('./babel.loader.excluded.packages');

const DEFAULT_BROWSER_PROFILE = module.exports.browserProfiles.modern;

/**
 *
 * @param {Array<string>} browserList
 * @param {Array<string>} [plugins]
 * @param {BabelPresetOptions} [presetOptions]
 * @returns {TransformOptions}
 */
module.exports.configureBabelTransformOptions = (browserList = DEFAULT_BROWSER_PROFILE, plugins = [], presetOptions = {}) => {
    if (!browserList) {
        console.log('REPLACING BROWSERLIST WITH DEFAULT');
        browserList = DEFAULT_BROWSER_PROFILE;
    }
    if (!plugins) {
        plugins = [];
    }
    if (!presetOptions) {
        presetOptions = {};
    }

    if (!Array.isArray(browserList)) {
        throw new Error('browserList is required, and must be an array of strings');
    }

    // console.log('CONFIGURING BABEL TRANSFORM OPTIONS WITH BROWSERS', browserList);

    const mergedPresetOptions = Object.assign({}, DEFAULT_PRESET_OPTIONS, presetOptions, {
        targets: {
            browsers: browserList,
        },
    });

    return {
        presets: [
            [ '@babel/preset-env', mergedPresetOptions ],
        ],
        plugins: DEFAULT_PLUGINS.concat(plugins),
    };
};

/**
 *
 * @param {Array<string>} browserList
 * @param {Array<string>} [plugins]
 * @param {BabelPresetOptions} [presetOptions]
 * @returns {NewLoader}
 */
module.exports.configureBabelLoader = (browserList = DEFAULT_BROWSER_PROFILE, plugins = [], presetOptions = {}) => ({

    loader: 'babel-loader',
    options: module.exports.configureBabelTransformOptions(browserList, plugins, presetOptions),

});

/**
 *
 * @param {webpack.Condition | webpack.Condition[]} test
 * @param {webpack.Loader[]} [loaders]
 * @param {Array<string>} browserList
 * @param {Array<string>} [babelPlugins]
 * @param {BabelPresetOptions} [babelPresetOptions]
 * @returns {UseRule}
 */
module.exports.configureBabelRule = (test, loaders = [], browserList = DEFAULT_BROWSER_PROFILE, babelPlugins = [], babelPresetOptions = {}) => ({

    test,
    exclude: module.exports.excludedPackages,
    use: [
        module.exports.configureBabelLoader(browserList || DEFAULT_BROWSER_PROFILE, babelPlugins, babelPresetOptions),
        ...(loaders || []),
    ],

});