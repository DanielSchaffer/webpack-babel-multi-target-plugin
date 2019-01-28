// specific packages that aren't detected automatically, and are already es5
export const KNOWN_EXCLUDED = [
  /node_modules\/jsrsasign/,
]

export const STANDARD_EXCLUDED = [

  // webpack add-ins and webpack loaders
  /node_modules\/webpack/,
  /node_modules\/([\w-_]+)-loader/, // required for css-loader, to-string-loader,

  // webpack dev server
  /node_modules\/webpack-dev-server/,
  /node_modules\/\(webpack\)-dev-server/,

  // polyfills
  /node_modules\/@babel\/runtime/,
  /node_modules\/core-js/,
  /node_modules\/regenerator-runtime/,

]
