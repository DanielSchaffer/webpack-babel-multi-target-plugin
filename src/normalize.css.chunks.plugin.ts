import { compilation, Compiler, Plugin } from 'webpack'

import Chunk = compilation.Chunk;
import Compilation = compilation.Compilation;
import Module = compilation.Module;

import { BabelTarget } from './babel-target'
import { PLUGIN_NAME } from './plugin.name'

// While CSS modules aren't duplicated by targeting the way code modules are, since they are referenced by targeted
// modules, they end up getting duplicated. Without intervention, we'd end up with one CSS file per target, which each
// file containing the exact same content. To fix this, we remove CSS modules from the targeted and move them into their
// own (non-targeted) chunks.

/**
 * @internalapi
 */
export class NormalizeCssChunksPlugin implements Plugin {

  public apply(compiler: Compiler) {

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: Compilation) => {

      if (compilation.name) {
        return
      }

      compilation.hooks.optimizeChunksBasic.tap(PLUGIN_NAME, this.extractCssChunks.bind(this, compilation))
      compilation.hooks.optimizeChunkAssets.tap(PLUGIN_NAME, this.cleanCssChunks.bind(this, compilation))

    })
  }

  public extractCssChunks(compilation: Compilation, chunks: Chunk[]): void {
    const cssModules: { [name: string]: Set<Module> } = {}
    let hasUntaggedTarget = false

    // first, find the CSS modules and remove them from their targeted chunks
    chunks.forEach(chunk => {

      // if `isGeneratedForBabelTargets` is present, we've already processed this chunk
      // the `optimizeChunksBasic` hook can get called more than once
      if ((chunk as any).isGeneratedForBabelTargets) {
        return
      }

      const target = BabelTarget.findTarget(chunk)
      if (!target) {
        // can probably skip these? maybe?
      }

      // don't mess with a chunk if it's not tagged with the target key
      if (target && !target.tagAssetsWithKey) {
        hasUntaggedTarget = true
        return
      }

      // get the original (untagged) name of the entry module so we can correctly
      // attribute any contained CSS modules to the entry
      const name = this.findEntryName(chunk)

      // track the original entry names to use later
      if (!cssModules[name]) {
        cssModules[name] = new Set<Module>()
      }

      chunk.modulesIterable.forEach(module => {

        if (module.constructor.name !== 'CssModule') {
          return
        }

        chunk.removeModule(module)

        // don't duplicate modules - we should only have one per imported/required CSS/SCSS/etc file
        cssModules[name].add(module)

      })
    })

    if (hasUntaggedTarget) {
      // untagged targets keep their CSS modules, so we don't need to create a fake one below
      return
    }

    // create chunks for the extracted modules
    Object.keys(cssModules).forEach(name => {
      const modules = cssModules[name]
      const cssGroup = compilation.addChunkInGroup(name)
      const cssChunk = cssGroup.chunks[cssGroup.chunks.length - 1]

      // HACK ALERT! fool HtmlWebpackPlugin into thinking this is an actual Entrypoint chunk so it
      // will include its assets by default (assuming the user hasn't filtered the name of the chunk)
      // somewhat relevant: BabelMultiTargetHtmlUpdater.mapChunkNames
      cssGroup.isInitial = () => true
      cssChunk.hasRuntime = () => false
      cssChunk.isInitial = () => true;
      (cssChunk as any).isGeneratedForBabelTargets = true

      modules.forEach(module => cssChunk.addModule(module))

    })
  }

  private findEntryName(chunk: Chunk): string {
    const entry = this.findEntryModule(chunk)
    if (entry) {
      return entry.reasons[0].dependency.originalName
    }

    throw new Error(`Could not determine entry module for chunk ${chunk.name}`)
  }

  private findEntryModule(chunk: Chunk): Module {
    if (chunk.entryModule) {
      return chunk.entryModule
    }

    // sure, fine, make me work for it...
    for (const group of chunk.groupsIterable) {
      for (const groupParent of group.parentsIterable) {
        for (const chunk of groupParent.chunks) {
          if (chunk.hasEntryModule()) {
            return chunk.entryModule
          }
        }
      }
    }

    // sure, fine, make me REALLY work for it...
    for (const module of chunk.modulesIterable) {
      const entry = this.getEntryFromModule(module)
      if (entry) {
        return entry
      }
    }
  }

  private getEntryFromModule(module: Module): any {
    for (const reason of module.reasons) {
      if (reason.dependency.babelTarget) {
        return module
      }
      return this.getEntryFromModule(reason.dependency.originModule || reason.dependency.module)
    }
  }

  // The extract process in extractCssChunks causes a small JavaScript loader file to get generated. Since the file
  // gets loaded by HtmlWebpackPlugin, we don't want this file cluttering up the assets, so it gets removed.
  public cleanCssChunks(compilation: Compilation, chunks: Chunk[]): void {
    chunks.forEach(chunk => {
      if (!(chunk as any).isGeneratedForBabelTargets) {
        return
      }

      chunk.files = chunk.files.reduce((result, file) => {
        if (file.endsWith('.js')) {
          delete compilation.assets[file]
        } else {
          result.push(file)
        }
        return result
      }, [])
    })
  }

}
