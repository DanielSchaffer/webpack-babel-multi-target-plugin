/** @type {BabelPresetOptions} **/
const DEFAULT_PRESET_OPTIONS = {
    modules: false,
    useBuiltIns: 'usage',
};

const DEFAULT_PLUGINS = [
    '@babel/plugin-syntax-dynamic-import',
];

const HELPERS = {};

const BROWSER_PROFILES = require('./browser.profiles');
const DEFAULT_BROWSER_PROFILE = BROWSER_PROFILES.modern;
const EXCLUDED_PACKAGES = require('./babel.loader.excluded.packages');

class BabelConfigHelper {

    /**
     *
     * @param {{ babelPlugins?: Array<string>, babelPresetOptions?: BabelPresetOptions, browserList?: Array<string>}} [options]
     */
    constructor(options) {
        if (options) {
            this.init(options.babelPlugins, options.babelPresetOptions, options.browserList);
        } else {
            this.init();
        }
    }

    /**
     *
     * @param {Array<string>} [babelPlugins]
     * @param {BabelPresetOptions} [babelPresetOptions]
     * @param {Array<string>} [browserList]
     */
    init(babelPlugins, babelPresetOptions, browserList) {

        if (!babelPlugins) {
            babelPlugins = [];
        }
        if (!babelPresetOptions) {
            babelPresetOptions = {};
        }
        if (!browserList) {
            browserList = DEFAULT_BROWSER_PROFILE;
        }

        this.babelPlugins = babelPlugins;
        this.babelPresetOptions = babelPresetOptions;
        this.browserList = browserList;
    }

    /**
     *
     * @returns {TransformOptions}
     */
    createTransformOptions() {

        if (!Array.isArray(this.browserList)) {
            throw new Error('browserList is required, and must be an array of strings');
        }

        const mergedPresetOptions = Object.assign({}, DEFAULT_PRESET_OPTIONS, this.babelPresetOptions, {
            targets: {
                browsers: this.browserList,
            },
        });

        return {
            presets: [
                [ '@babel/preset-env', mergedPresetOptions ],
            ],
            plugins: DEFAULT_PLUGINS.concat(this.babelPlugins),
        };
    }

    /**
     *
     * @returns {NewLoader}
     */
    createBabelLoader() {
        return {
            loader: 'babel-loader',
            options: this.createTransformOptions(),
        };
    }

    /**
     *
     * @param {webpack.Condition | webpack.Condition[]} test
     * @param {webpack.Loader[]} [loaders]
     * @returns {UseRule}
     */
    createBabelRule(test, loaders = []) {
        return {
            test,
            exclude: EXCLUDED_PACKAGES,
            use: [
                this.createBabelLoader(),
                ...(loaders || []),
            ],
        };

    }

    /**
     *
     * @param {webpack.Loader[]} [loaders]
     * @returns {UseRule}
     */
    createBabelJsRule(loaders = []) {
        return this.createBabelRule(/\.js$/, loaders);
    }

    /**
     *
     * @param {webpack.Loader[]} [loaders]
     * @returns {UseRule}
     */
    createBabelTsRule(loaders = []) {
        return this.createBabelRule(/\.ts$/, loaders);
    }

    /**
     *
     * @param {webpack.Loader[]} [loaders]
     * @returns {UseRule}
     */
    createBabelAngularRule(loaders = []) {
        return this.createBabelRule(/(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/, [
            '@ngtools/webpack',
            ...(loaders || []),
        ]);
    }

    get browserProfiles() {
        return BROWSER_PROFILES;
    }

    /**
     *
     * @param {Array<string>} browserList
     * @returns {BabelConfigHelper}
     */
    profile(browserList) {
        let key = browserList.join('|');
        if (!HELPERS[key]) {
            HELPERS[key] = new BabelConfigHelper({
                babelPlugins: this.babelPlugins,
                babelPresetOptions: this.babelPresetOptions,
                browserList,
            });
        }
        return HELPERS[key];
    }

}

BabelConfigHelper.browserProfiles = BROWSER_PROFILES;
BabelConfigHelper.excludedPackages = EXCLUDED_PACKAGES;

module.exports = BabelConfigHelper;
