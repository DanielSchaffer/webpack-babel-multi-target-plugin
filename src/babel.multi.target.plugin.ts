import { Compiler, Loader, Plugin } from 'webpack'

import { BabelMultiTargetHtmlUpdater }     from './babel.multi.target.html.updater'
import { Options }                         from './babel.multi.target.options'
import { BabelTarget, BabelTargetFactory } from './babel-target'
import { BabelTargetEntryOptionPlugin }    from './babel.target.entry.option.plugin'
import { BrowserProfileName }              from './browser.profile.name'
import { DEFAULT_TARGET_INFO }             from './defaults'
import { NormalizeCssChunksPlugin }        from './normalize.css.chunks.plugin'
import { NormalizeModuleIdsPlugin }        from './normalize.module.ids.plugin'
import { SafariNoModuleFixPlugin }         from './safari-nomodule-fix/safari.nomodule.fix.plugin'
import { TargetingPlugin }                 from './targeting.plugin'

export const BABEL_LOADER = 'babel-loader'

export class BabelMultiTargetPlugin implements Plugin {

  private readonly options: Options;
  private readonly targets: BabelTarget[];

  constructor(options: Options = {}) {

    if (!options.babel) {
      options.babel = {}
    }

    if (!options.babel.plugins) {
      options.babel.plugins = []
    }
    if (!options.babel.presetOptions) {
      options.babel.presetOptions = {}
    }

    if (!options.targets) {
      options.targets = DEFAULT_TARGET_INFO
    }

    if (!options.exclude) {
      options.exclude = []
    }

    this.options = options

    const targetFactory = new BabelTargetFactory(options.babel.presetOptions, options.babel.plugins)

    this.targets = Object.keys(options.targets)
      .reduce((result, profileName: BrowserProfileName) => {
        const targetOptions = options.targets[profileName]
        result.push(targetFactory.createBabelTarget(profileName, targetOptions, { cacheDirectory: options.babel.cacheDirectory }))
        return result
      }, [])

    if (!this.targets.length) {
      throw new Error('Must provide at least one target')
    }

    if (this.targets.filter(target => target.tagAssetsWithKey === false).length > 1) {
      throw new Error('Only one target may have the `tagAssetsWithKey` property set to `false`')
    }
    if (this.targets.filter(target => target.esModule).length > 1) {
      throw new Error('Only one target may have the `esModule` property set to `true`')
    }
    if (this.targets.filter(target => target.noModule).length > 1) {
      throw new Error('Only one target may have the `noModule` property set to `true`')
    }
  }

  public apply(compiler: Compiler) {

    // magic starts here!
    new BabelTargetEntryOptionPlugin(this.targets).apply(compiler)
    new TargetingPlugin(this.targets, this.options.exclude, this.options.doNotTarget, compiler.options.externals).apply(compiler)
    new NormalizeCssChunksPlugin().apply(compiler)
    new BabelMultiTargetHtmlUpdater(this.targets).apply(compiler)
    if (this.options.safari10NoModuleFix) {
      new SafariNoModuleFixPlugin(this.options.safari10NoModuleFix).apply(compiler)
    }
    if (this.options.normalizeModuleIds) {
      new NormalizeModuleIdsPlugin().apply(compiler)
    }
  }

  public static loader(loader: Loader = BABEL_LOADER): Loader {
    return TargetingPlugin.loader(loader)
  }

}
