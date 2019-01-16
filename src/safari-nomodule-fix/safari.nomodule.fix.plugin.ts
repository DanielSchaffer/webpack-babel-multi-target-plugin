import { readFileSync } from 'fs';

import { AlterAssetTagsData, HtmlTag, HtmlWebpackPlugin } from 'html-webpack-plugin';
import { resolve } from 'path';
import * as webpack from 'webpack';
import { Compiler, Plugin } from 'webpack';
import { RawSource } from 'webpack-sources';

import Compilation = webpack.compilation.Compilation;

import { SafariNoModuleFix, SafariNoModuleFixOption } from '../babel.multi.target.options';
import { BabelTarget } from '../babel.target';
import { PLUGIN_NAME } from '../plugin.name';
import { SafariNoModuleFixDependency } from './safari.nomodule.fix.dependency';
import Chunk = webpack.compilation.Chunk;

export class SafariNoModuleFixPlugin implements Plugin {

  constructor(private mode: SafariNoModuleFixOption) {}

  public apply(compiler: Compiler) {
    compiler.hooks.afterPlugins.tap(PLUGIN_NAME, () => {

      if (this.mode === SafariNoModuleFix.bundled) {
        return this.initBundled(compiler);
      }

      if (this.mode === SafariNoModuleFix.external) {
        this.initExternal(compiler);
      }

      this.initHtmlUpdate(compiler);
    });
  }

  private initExternal(compiler: Compiler) {
    // set up the dependency to be handled by the NormalModuleFactory
    // compiler.hooks.compilation.tap(
    //   this.constructor.name,
    //   (compilation: Compilation, { normalModuleFactory }: { normalModuleFactory: NormalModuleFactory }) => {
    //     (compilation.dependencyFactories as Map<any, any>).set(
    //       SafariNoModuleFixDependency,
    //       normalModuleFactory
    //     );
    //   }
    // );
    //
    // // add the nomodule fix file as an additional entry so that it gets put into its own file
    // compiler.hooks.make.tapPromise(PLUGIN_NAME, (compilation: Compilation) => {
    //   const dep = new SafariNoModuleFixDependency();
    //   return new Promise((resolve, reject) => compilation.addEntry(dep.context, dep, dep.filename, (err: Error) => {
    //     if (err) {
    //       return reject();
    //     }
    //     resolve();
    //   }));
    // });

    /**
     * add the nomodule fix script as an additionalAsset
     * This has the benefit of avoiding the webpack bootstrap boilerplate getting added, which would be completely
     * useless and wasted bytes since it's not going to be loading any other dependencies. However, it also means skipping
     * the rest of the JS infrastructure, so no loaders or uglificiation :(
     *
     * TODO: maybe it's possible to conditionally mess with the mainTemplate so that it can be loaded like a real entry, but skip all the boilerplate
     */
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: Compilation) => {

      if (!compilation.name) {
        return;
      }

      compilation.hooks.additionalAssets.tapPromise(PLUGIN_NAME, async () => {
        compilation.assets[SafariNoModuleFixDependency.filename] = new RawSource(readFileSync(SafariNoModuleFixDependency.path, 'utf-8'));
        return;
      });

      const htmlWebpackPlugin: HtmlWebpackPlugin = compiler.options.plugins
      // instanceof can act wonky since we don't actually keep our own dependency on html-webpack-plugin
      // should we?
        .find(plugin => plugin.constructor.name === 'HtmlWebpackPlugin') as any;

      if (!htmlWebpackPlugin) {
        return;
      }
    });
  }

  private initBundled(compiler: Compiler) {

    // TODO: this won't actually work - all scripts get loaded at the same time, so it doesn't have
    //  time to prevent the duplicate scripts from loading
    //  an alternative would be to use mainTemplate hooks to inject logic to the default
    //  webpack bootstrap that uses each chunk's original ID to prevent duplicates from being loaded
    // TODO: also try loading esmodule scripts from <head>?

    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation: Compilation) => {
      if (compilation.name) {
        return;
      }

      compilation.mainTemplate.hooks.render.tap(PLUGIN_NAME, (source: any, chunk: Chunk, hash: any) => {
        const target = BabelTarget.getTargetFromChunk(chunk);
        if (target.esModule) {
          source.children.unshift(readFileSync(SafariNoModuleFixDependency.path, 'utf-8'))
        }
        return source;
      })
    })

    const htmlWebpackPlugin: HtmlWebpackPlugin = compiler.options.plugins
    // instanceof can act wonky since we don't actually keep our own dependency on html-webpack-plugin
    // should we?
      .find(plugin => plugin.constructor.name === 'HtmlWebpackPlugin') as any;

    if (!htmlWebpackPlugin) {
      return;
    }

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: Compilation) => {

      if (compilation.name) {
        return;
      }

      compilation.hooks.htmlWebpackPluginAlterAssetTags.tapPromise(`${PLUGIN_NAME} update asset tags`,
        async (htmlPluginData: AlterAssetTagsData) => {

        const tags = htmlPluginData.body.slice(0);

        // re-sort the tags so that es module tags are rendered first, otherwise maintaining the original order
        htmlPluginData.body.sort((a: HtmlTag, b: HtmlTag) => {
          const aIndex = tags.indexOf(a);
          const bIndex = tags.indexOf(b);
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
        });

        htmlPluginData.body.forEach((tag: HtmlTag) => {
          if (tag.tagName === 'script' && tag.attributes && tag.attributes.nomodule) {
            tag.attributes.defer = true
          }
        })


        return htmlPluginData;

      });

    });

  }

  private initHtmlUpdate(compiler: Compiler): void {
    const htmlWebpackPlugin: HtmlWebpackPlugin = compiler.options.plugins
    // instanceof can act wonky since we don't actually keep our own dependency on html-webpack-plugin
    // should we?
      .find(plugin => plugin.constructor.name === 'HtmlWebpackPlugin') as any;

    if (!htmlWebpackPlugin) {
      return;
    }

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: Compilation) => {

      if (compilation.name) {
        return;
      }

      compilation.hooks.htmlWebpackPluginAlterAssetTags.tapPromise(`${PLUGIN_NAME} add safari nomodule fix tags`,
        async (htmlPluginData: AlterAssetTagsData) => {
          htmlPluginData.head.unshift(this.createSafariNoModuleFixTag());
          return htmlPluginData;
        });

    });
  }

  private createSafariNoModuleFixTag(): HtmlTag {

    // TODO: minify the nomodule fix js
    const tag: HtmlTag  = {
      tagName: 'script',
      closeTag: true,
      attributes: {
        nomodule: true,
        type: 'application/javascript',
      },
    };

    if (this.mode === SafariNoModuleFix.external) {
      tag.attributes.src = '/' + SafariNoModuleFixDependency.filename;
      return tag;
    }

    const fixContent = readFileSync(resolve(__dirname, 'safari.nomodule.fix.js'));

    if (this.mode === true || this.mode === SafariNoModuleFix.inline) {
      tag.innerHTML = fixContent
        .toString('utf-8');
      return tag;
    }

    tag.attributes.src = 'data:application/javascript';
    const isBase64 = this.mode === SafariNoModuleFix.inlineDataBase64;
    if (isBase64) {
      tag.attributes.src += `;base64,${fixContent.toString('base64')}`;
      return tag;
    }

    tag.attributes.src += ',' + encodeURIComponent(fixContent.toString('utf-8')
      .replace(/\n/g, '')
      .replace(/\s{2,}/g, ' '));
    return tag;
  }

}
