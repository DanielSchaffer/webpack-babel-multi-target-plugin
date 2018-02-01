// TODO: iterate through node_modules and build list from modules that don't list module or es2015 fields in their package.json
/** @type {Array.<string | RegExp>}) **/
module.exports = [

    // webpack add-ins and webpack loaders
    /node_modules\/webpack/,
    /node_modules\/([\w-_]+)-loader/, // required for css-loader, to-string-loader, etc

    // webpack-dev-server and dependencies
    /node_modules\/ansi-html/,
    /node_modules\/html-entities/,
    /node_modules\/loglevel/,
    /node_modules\/punycode/,
    /node_modules\/querystring-es3/,
    /node_modules\/sockjs-client/,
    /node_modules\/strip-ansi/,
    /node_modules\/url/,
    /node_modules\/webpack-dev-server/,
    /node_modules\/\(webpack\)-dev-server/,

    /node_modules\/regenerator-runtime/,

    // known misbehaving/already es5 packages
    /node_modules\/angular-2-local-storage/,
    /node_modules\/base64-js/,
    /node_modules\/buffer/, // prevents Cannot read property 'TYPED_ARRAY_SUPPORT' of undefined
    /node_modules\/core-js/,
    /node_modules\/date-fns/,
    /node_modules\/jquery/,
    /node_modules\/jsrsasign/,
    /node_modules\/moment/,

];
