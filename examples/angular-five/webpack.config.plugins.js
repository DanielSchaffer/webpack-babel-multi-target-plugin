const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;

module.exports = () => ({

    plugins: [

        new AngularCompilerPlugin({
            tsConfigPath: 'tsconfig.json',
            entryModule: 'src/app/app.module#AppModule',
            sourceMap: true,
        }),

    ],

});
