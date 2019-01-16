declare module 'webpack/lib/dependencies/ModuleDependency' {
    import * as webpack from 'webpack';
    import Dependency = webpack.compilation.Dependency;

    class ModuleDependency extends Dependency {
        constructor(request: string);

        public request: string;
        public userRequest: string;
    }
    export = ModuleDependency;
}

declare module 'webpack/lib/Dependency' {
    import * as webpack from 'webpack';
    import Dependency = webpack.compilation.Dependency;
    export = Dependency;
}

declare module 'webpack/lib/ModuleTemplate' {
  import { Tapable } from 'tapable';
  import * as webpack from 'webpack';
  import { ModuleTemplateHooks } from 'webpack';
  import RuntimeTemplate = webpack.compilation.RuntimeTemplate;

  class ModuleTemplate extends Tapable {
    constructor(public runtimeTemplate: RuntimeTemplate, public type: string) {}
    hooks: ModuleTemplateHooks;
  }

  export = ModuleTemplate
}

declare module 'webpack/lib/MultiModuleFactory' {
    import * as webpack from 'webpack';
    class MultiModuleFactory {
        constructor();
    }
    export = MultiModuleFactory;
}

declare module 'webpack/lib/RuntimeTemplate' {
  import * as webpack from 'webpack';

  class RuntimeTemplate {
    constructor(public outputOptions: any, public requestShortener: any) {}
    moduleId({ module: Module, request: string }): string;
    moduleRaw({ module: Module, request: string }): string;
    missingModule({ request: string }): string;
    comment({ request: string }): string;
    outputOptions: any;
    requestShortener: any;
  }

  export = RuntimeTemplate
}

declare module 'webpack/lib/dependencies/SingleEntryDependency' {
    import * as webpack from 'webpack';
    import Dependency = require('webpack/lib/Dependency');
    class SingleEntryDependency extends Dependency {
        constructor(request: string) {}
    }
    export = SingleEntryDependency;
}
