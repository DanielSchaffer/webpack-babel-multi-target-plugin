import { resolve } from 'path'

import ModuleDependency = require('webpack/lib/dependencies/ModuleDependency');

const SAFARI_NOMODULE_FIX_FILENAME = 'safari.nomodule.fix'

export class SafariNoModuleFixDependency extends ModuleDependency {

  public readonly type = 'safari nomodule fix';
  public static readonly context = __dirname;
  public static readonly modulename = SAFARI_NOMODULE_FIX_FILENAME;
  public static readonly filename = SAFARI_NOMODULE_FIX_FILENAME + '.js';
  public static readonly path = resolve(__dirname, SAFARI_NOMODULE_FIX_FILENAME + '.js');

  constructor() {
    super(resolve(__dirname, SAFARI_NOMODULE_FIX_FILENAME))
  }
}
