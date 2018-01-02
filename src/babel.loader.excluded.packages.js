// TODO: iterate through node_modules and build list from modules that don't list module or es2015 fields in their package.json
module.exports = [
    // webpack add-ins and webpack loaders
    /node_modules\/webpack/,
    /node_modules\/([\w-_]+)-loader/, // required for css-loader, to-string-loader, etc

    /node_modules\/regenerator-runtime/,

    // known misbehaving/already es5 packages
    /node_modules\/angular-2-local-storage/,
    /node_modules\/core-js/,
    /node_modules\/jquery/,
    /node_modules\/moment/,
    /node_modules\/oidc-client/,

];