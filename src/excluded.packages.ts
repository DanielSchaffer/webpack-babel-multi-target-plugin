import { join } from 'path'


function excludeNodeModulesPackage(...name: string[]): RegExp {
  return new RegExp(join('node_modules', ...name))
}

// specific packages that aren't detected automatically, and are already es5
export const KNOWN_EXCLUDED = [
  excludeNodeModulesPackage('jsrsasign'),
]

export const STANDARD_EXCLUDED = [

  // webpack add-ins and webpack loaders
  excludeNodeModulesPackage('webpack'),
  excludeNodeModulesPackage('([\\w-_]+)-loader'), // required for css-loader, to-string-loader,

  // webpack dev server
  excludeNodeModulesPackage('webpack-dev-server'),
  excludeNodeModulesPackage('\\(webpack\\)-dev-server'),

  // polyfills
  excludeNodeModulesPackage('@babel', 'runtime'),
  excludeNodeModulesPackage('core-js'),
  excludeNodeModulesPackage('regenerator-runtime'),

]
