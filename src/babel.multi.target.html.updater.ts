import { readFileSync } from 'fs';

import { AlterAssetTagsData, HtmlTag, HtmlWebpackPlugin } from 'html-webpack-plugin';
import { resolve } from 'path';
import { compilation, Compiler, Plugin } from 'webpack';

import { SafariNoModuleFix, SafariNoModuleFixOption } from './babel.multi.target.options';
import { BabelTarget } from './babel.target';
import { PLUGIN_NAME } from './plugin.name';
import { TargetedChunkMap } from './targeted.chunk';
import Chunk = compilation.Chunk;
import ChunkGroup = compilation.ChunkGroup;
import Compilation = compilation.Compilation;

// Works with HtmlWebpackPlugin to make sure the targeted assets are referenced correctly
// Tags for assets whose target has `esModule` set are updated with the `"type"="module"` attribute
// Tags for assets whose target has `noModule` set are updated with the `"nomodule"` attribute

/**
 * @internalapi
 */
export class BabelMultiTargetHtmlUpdater implements Plugin {

  constructor(private targets: BabelTarget[], private safari10NoModuleFix: SafariNoModuleFixOption) {
  }

  public updateScriptTags(chunkMap: TargetedChunkMap, tags: HtmlTag[]): void {

    tags
      .forEach((tag: HtmlTag) => {
        if (tag.tagName !== 'script') {
          return;
        }
        const targetedChunks = chunkMap.get(tag.attributes.src);
        const targets = targetedChunks.map(targetedChunk => targetedChunk.target);

        if (!targets || !targets.length) {
          return;
        }

        // if this file is referenced by multiple targets, don't change the tag
        // this can happen with vendor chunks that don't get transpiled
        if (!targets.every((target, index) => index === 0 || target === targets[index - 1])) {
          return;
        }

        const target = targets[0];

        if (target.esModule) {
          tag.attributes.type = 'module';
          return;
        }

        if (target.noModule) {
          tag.attributes.nomodule = true;
        }
      });
  }

  public createSafariNoModuleFixTag(): HtmlTag {
    // TODO: minify the nomodule fix js
    const fixContent = readFileSync(resolve(__dirname, 'safari.nomodule.fix.js'));
    const tag: HtmlTag  = {
      tagName: 'script',
      closeTag: true,
      attributes: {
        type: 'application/javascript',
      },
    };

    if (this.safari10NoModuleFix === true || this.safari10NoModuleFix === SafariNoModuleFix.inline) {
      tag.innerHTML = fixContent
        .toString('utf-8');
      return tag;
    }

    tag.attributes.src = 'data:application/javascript';
    const isBase64 = this.safari10NoModuleFix === SafariNoModuleFix.inlineDataBase64;
    if (isBase64) {
      tag.attributes.src += `;base64,${fixContent.toString('base64')}`;
      return tag
    }

    tag.attributes.src += ',' + encodeURIComponent(fixContent.toString('utf-8')
      .replace(/\n/g, '')
      .replace(/\s{2,}/g, ' '));
    return tag
  }

  // expands any provided chunk names (for options.chunks or options.excludeChunks) to include the targeted versions
  // of each chunk. also includes the original chunk name if all targets are tagged so that CSS assets are included
  // or excluded as expected
  // also relevant: NormalizeCssChunks.extractCssChunks
  private mapChunkNames(chunkNames: string[]): string[] {
    const allTaggedWithKey = this.targets.every(target => target.tagAssetsWithKey);
    return chunkNames.reduce((result: string[], name: string) => {
      if (allTaggedWithKey) {
        result.push(name);
      }
      this.targets.forEach(target => {
        result.push(target.getTargetedAssetName(name));
      });


      return result;
    }, [] as string[]);
  }

  public apply(compiler: Compiler): void {

    compiler.hooks.afterPlugins.tap(PLUGIN_NAME, () => {
      const htmlWebpackPlugin: HtmlWebpackPlugin = compiler.options.plugins
      // instanceof can act wonky since we don't actually keep our own dependency on html-webpack-plugin
      // should we?
        .find(plugin => plugin.constructor.name === 'HtmlWebpackPlugin') as any;

      if (!htmlWebpackPlugin) {
        return;
      }

      // not sure if this is a problem since webpack will wait for dependencies to load, but sorting
      // by auto/dependency will result in a cyclic dependency error for lazy-loaded routes
      htmlWebpackPlugin.options.chunksSortMode = 'none';

      if ((htmlWebpackPlugin.options.chunks as any) !== 'all' &&
        htmlWebpackPlugin.options.chunks &&
        htmlWebpackPlugin.options.chunks.length
      ) {
        htmlWebpackPlugin.options.chunks = this.mapChunkNames(htmlWebpackPlugin.options.chunks as string[]);
      }

      if (htmlWebpackPlugin.options.excludeChunks &&
        htmlWebpackPlugin.options.excludeChunks.length) {
        htmlWebpackPlugin.options.excludeChunks = this.mapChunkNames(htmlWebpackPlugin.options.excludeChunks);
      }

      compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: Compilation) => {

        if (compilation.name) {
          return;
        }

        compilation.hooks.htmlWebpackPluginAlterAssetTags.tapPromise(`${PLUGIN_NAME} update asset tags`,
          async (htmlPluginData: AlterAssetTagsData) => {

            const chunkMap: TargetedChunkMap = compilation.chunkGroups.reduce((result: TargetedChunkMap, chunkGroup: ChunkGroup) => {
              chunkGroup.chunks.forEach((chunk: Chunk) => {
                chunk.files.forEach((file: string) => {
                  result.set(file, chunkGroup, chunk);
                });
              });
              return result;
            }, new TargetedChunkMap(compiler.options.output.publicPath));

            this.updateScriptTags(chunkMap, htmlPluginData.head);
            this.updateScriptTags(chunkMap, htmlPluginData.body);
            console.log(htmlPluginData.head, htmlPluginData.body)

            if (this.safari10NoModuleFix) {
              htmlPluginData.head.unshift(this.createSafariNoModuleFixTag())
            }

            return htmlPluginData;

          });

      });
    });
  }

}
