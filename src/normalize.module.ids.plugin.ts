import { AlterAssetTagsData, HtmlTag, HtmlWebpackPlugin } from 'html-webpack-plugin'
import { Compiler, Module, Plugin, compilation } from 'webpack'

import Compilation = compilation.Compilation;

import { BabelTarget } from './babel.target'

export class NormalizeModuleIdsPlugin implements Plugin {

  public apply(compiler: Compiler): void {
    this.applyModuleIdNormalizing(compiler)
    this.applyConditionJsonpCallback(compiler)
    this.applyHtmlWebpackTagOrdering(compiler)
  }

  private pluginName(desc?: string): string {
    return `${NormalizeModuleIdsPlugin.name}${desc ? ': ' : ''}${desc || ''}`
  }

  private applyModuleIdNormalizing(compiler: Compiler): void {
    compiler.hooks.compilation.tap(this.pluginName(), (compilation: Compilation) => {
      if (compilation.name) {
        return
      }
      compilation.hooks.moduleIds.tap(this.pluginName(), (modules: Module[]) => {
        modules.forEach((module: any) => {
          if (BabelTarget.isTaggedRequest(module.id)) {
            const queryIndex = module.id.indexOf('?')
            const ogId = module.id.substring(0, queryIndex)
            const query = module.id.substring(queryIndex + 1)
            const queryParts = query.split('&').filter((part: string) => !part.startsWith('babel-target'))
            if (!queryParts.length) {
              module.id = ogId
            } else {
              module.id = `${ogId}?${queryParts.join('&')}`
            }
          }
        })
      })
    })
  }

  private applyConditionJsonpCallback(compiler: Compiler): void {
    compiler.hooks.afterPlugins.tap(this.pluginName(), () => {
      compiler.hooks.thisCompilation.tap(this.pluginName(), (compilation: Compilation) => {
        if (compilation.name) {
          return
        }
        compilation.mainTemplate.hooks.beforeStartup.tap(this.pluginName('conditional jsonp callback'), (source: string) => {
          const insertPointCode = 'var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);\n'
          const insertPoint = source.indexOf(insertPointCode)
          if (insertPoint < 0) {
            return
          }
          const before = source.substring(0, insertPoint)
          const after = source.substring(insertPoint)
          return `${before}if (jsonpArray.push.name === 'webpackJsonpCallback') return;\n${after}`

        })
      })
      return compiler
    })
  }

  private applyHtmlWebpackTagOrdering(compiler: Compiler): void {

    compiler.hooks.afterPlugins.tap(this.pluginName(), () => {

      const htmlWebpackPlugin: HtmlWebpackPlugin = compiler.options.plugins
      // instanceof can act wonky since we don't actually keep our own dependency on html-webpack-plugin
      // should we?
        .find(plugin => plugin.constructor.name === 'HtmlWebpackPlugin') as any

      if (!htmlWebpackPlugin) {
        return
      }

      compiler.hooks.compilation.tap(this.pluginName(), (compilation: Compilation) => {

        if (compilation.name) {
          return
        }

        compilation.hooks.htmlWebpackPluginAlterAssetTags.tapPromise(this.pluginName('reorder asset tags'),
          async (htmlPluginData: AlterAssetTagsData) => {

            const tags = htmlPluginData.body.slice(0)

            // re-sort the tags so that es module tags are rendered first, otherwise maintaining the original order
            htmlPluginData.body.sort((a: HtmlTag, b: HtmlTag) => {
              const aIndex = tags.indexOf(a)
              const bIndex = tags.indexOf(b)
              if (a.tagName !== 'script' || b.tagName !== 'script' ||
                !a.attributes || !b.attributes ||
                !a.attributes.src || !b.attributes.src ||
                (a.attributes.type !== 'module' && b.attributes.type !== 'module')) {
                // use the original order
                return aIndex - bIndex
              }

              if (a.attributes.type === 'module') {
                return -1
              }
              return 1
            })

            htmlPluginData.body.forEach((tag: HtmlTag) => {
              if (tag.tagName === 'script' && tag.attributes && tag.attributes.nomodule) {
                tag.attributes.defer = true
              }
            })


            return htmlPluginData

          })

      })
    })
  }

}
