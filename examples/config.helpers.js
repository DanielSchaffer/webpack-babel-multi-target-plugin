module.exports.babelTransformOptions = (browserlist) => {
    /** @type {TransformOptions} **/
    return {
        presets: [
            ['@babel/preset-env', {
                modules: false,
                useBuiltIns: 'usage',
                targets: {
                    browsers: browserlist,
                },
            }],
        ],
        plugins: [
            '@babel/plugin-syntax-dynamic-import'
        ],
    };
};
module.exports.babelExcludedPackages = [
    /lodash/,
    /moment/,
    /core-js/,
];