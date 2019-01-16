import { resolve } from 'path';
import * as webpack from 'webpack';
import { ReplaceSource } from 'webpack-sources';

import ModuleDependency = require('webpack/lib/dependencies/ModuleDependency');
import Dependency = webpack.compilation.Dependency;
import RuntimeTemplate = webpack.compilation.RuntimeTemplate;

const SAFARI_NOMODULE_FIX_FILENAME = 'safari.nomodule.fix';

class Template {
  apply(dep: Dependency, source: ReplaceSource, runtime: RuntimeTemplate) {
    // use the provided webpack runtime template to fabricate a require statement for the nomodule fix
    // this actually executes the fix code
    // const content = runtime.moduleRaw({
    //   module: dep.module,
    //   request: dep.request
    // });
    // source.replace(-100, -101, content + ';\n');
  }
};

export class SafariNoModuleFixDependency extends ModuleDependency {

  public readonly type = 'safari nomodule fix';
  public static readonly context = __dirname;
  public static readonly modulename = SAFARI_NOMODULE_FIX_FILENAME;
  public static readonly filename = SAFARI_NOMODULE_FIX_FILENAME + '.js';
  public static readonly path = resolve(__dirname, SAFARI_NOMODULE_FIX_FILENAME + '.js');
  public static readonly Template = Template

  constructor() {
    super(resolve(__dirname, SAFARI_NOMODULE_FIX_FILENAME))
  }
}
