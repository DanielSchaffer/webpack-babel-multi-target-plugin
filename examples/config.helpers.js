module.exports.babelTransformOptions = (browserlist) => {
    /** @type {TransformOptions} **/
    return {
        presets: [
            ['@babel/env', {
                modules: false,
                useBuiltIns: 'usage',
                targets: {
                    browsers: browserlist,
                },
            }],
        ],
    };
};