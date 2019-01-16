import * as webpack from 'webpack';
import { Compiler, Module, Plugin } from 'webpack';

import Compilation = webpack.compilation.Compilation;

import ModuleTemplate = require('webpack/lib/ModuleTemplate');
import RuntimeTemplate = require('webpack/lib/RuntimeTemplate');

import { BabelTarget } from './babel.target';

class DetargetedRuntimeTemplate extends RuntimeTemplate {
  constructor(outputOptions: any, requestShortener: any) {
    super(outputOptions, requestShortener);
  }

  public moduleId({ module, request }: { module: any, request: string }): string {

    if (!module) {
      return this.missingModule({
        request
      });
    }
    if (module.id === null) {
      throw new Error(
        `RuntimeTemplate.moduleId(): Module ${module.identifier()} has no id. This should not happen.`
      );
    }

    let id = module.id;
    if (BabelTarget.isTaggedRequest(id)) {
      const queryIndex = id.indexOf('?');
      const ogId = id.substring(0, queryIndex);
      const query = id.substring(queryIndex + 1);
      const queryParts = query.split('&').filter((part: string) => !part.startsWith('babel-target'));
      if (!queryParts.length) {
        id = ogId;
      } else {
        id = `${ogId}?${queryParts.join('&')}`;
      }
    }

    // TODO: try changing the IDs of the modules in another hook - beforeModuleIds? moduleIds? afterOptimizeModuleIds? afterSeal?
    return `${this.comment({ request })}${JSON.stringify(id)}`;
  }
}

export class PreventDuplicateChunksPlugin implements Plugin {

  constructor(private targets: BabelTarget[]) {}

  public apply(compiler: Compiler): void {
    compiler.hooks.thisCompilation.tap(PreventDuplicateChunksPlugin.name, (compilation: Compilation) => {

      compilation.runtimeTemplate = new DetargetedRuntimeTemplate(
        compilation.runtimeTemplate.outputOptions,
        compilation.runtimeTemplate.requestShortener,
      );

      compilation.moduleTemplates = {
        javascript: new ModuleTemplate(compilation.runtimeTemplate, "javascript"),
        webassembly: new ModuleTemplate(compilation.runtimeTemplate, "webassembly")
      };

    });
  }

}
