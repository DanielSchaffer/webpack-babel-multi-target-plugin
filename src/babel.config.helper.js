const WebpackBabelMultiTargetPlugin = require('./webpack.babel.multi.target.plugin');

/** @type {BabelPresetOptions} **/
const DEFAULT_PRESET_OPTIONS = {
    modules: false,
    useBuiltIns: 'usage',
};

const DEFAULT_PLUGINS = [
    '@babel/plugin-syntax-dynamic-import',
];

const BROWSER_PROFILES = require('./browser.profiles');
const DEFAULT_BROWSER_PROFILE = 'modern';
const EXCLUDED_PACKAGES = require('./babel.loader.excluded.packages');

class BabelConfigHelper {

    /**
     *
     * @param {BabelConfigHelperOptions} [options]
     */
    constructor({ babelPlugins, babelPresetOptions, browserProfile, browserProfiles, exclude } = {}) {

        if (!babelPlugins) {
            babelPlugins = [];
        }
        if (!babelPresetOptions) {
            babelPresetOptions = {};
        }
        if (!browserProfile) {
            browserProfile = DEFAULT_BROWSER_PROFILE;
        }

        if (!browserProfiles) {
            browserProfiles = BROWSER_PROFILES;
        }
        if (!browserProfiles.legacy) {
            browserProfiles.legacy = BROWSER_PROFILES.legacy;
        }
        if (!browserProfiles.modern) {
            browserProfiles.modern = BROWSER_PROFILES.modern;
        }

        if (!exclude) {
            exclude = [];
        }

        this.babelPlugins = babelPlugins;
        this.babelPresetOptions = babelPresetOptions;
        this.browserProfile = browserProfile;
        this.browserProfiles = browserProfiles;
        this.exclude = exclude;

    }

    /**
     *
     * @returns {TransformOptions}
     */
    createTransformOptions() {

        const mergedPresetOptions = Object.assign({}, DEFAULT_PRESET_OPTIONS, this.babelPresetOptions, {
            targets: {
                browsers: this.browserProfiles[this.browserProfile],
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
     * @returns {NewUseRule}
     */
    createBabelRule(test, loaders = []) {
        return {
            test,
            exclude: EXCLUDED_PACKAGES.concat(this.exclude),
            use: [
                this.createBabelLoader(),
                ...(loaders || []),
            ],
        };

    }

    /**
     *
     * @param {webpack.Loader[]} [loaders]
     * @returns {NewUseRule}
     */
    createBabelJsRule(loaders = []) {
        return this.createBabelRule(/\.js$/, loaders);
    }

    /**
     *
     * @param {webpack.Loader[]} [loaders]
     * @returns {NewUseRule}
     */
    createBabelTsRule(loaders = []) {
        return this.createBabelRule(/\.ts$/, loaders);
    }

    /**
     *
     * @param {webpack.Loader[]} [loaders]
     * @returns {NewUseRule}
     */
    createBabelAngularRule(loaders = []) {
        return this.createBabelRule(/\.ts$/, [
            '@ngtools/webpack',
            ...(loaders || []),
        ]);
    }

    /**
     *
     * @param {'modern'|'legacy'} browserProfile
     * @returns {BabelConfigHelper}
     */
    profile(browserProfile) {
        return new BabelConfigHelper({
            babelPlugins: this.babelPlugins,
            babelPresetOptions: this.babelPresetOptions,
            browserProfile,
            browserProfiles: this.browserProfiles,
            exclude: this.exclude,
        });
    }

    /**
     *
     * @param {string} [key]
     * @param {PluginsFn} plugins
     */
    multiTargetPlugin({ key, plugins }) {
        let browserProfile = this.browserProfile === 'modern' ? 'legacy' : 'modern';
        return new WebpackBabelMultiTargetPlugin({
            key,
            browserProfile,
            options: this.profile(browserProfile).createTransformOptions(),
            plugins,
        });
    }

}

BabelConfigHelper.excludedPackages = EXCLUDED_PACKAGES;

module.exports = BabelConfigHelper;
