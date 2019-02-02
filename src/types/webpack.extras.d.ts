declare module 'webpack/lib/dependencies/ModuleDependency' {
  import * as webpack from 'webpack'
  import Dependency = webpack.compilation.Dependency;

  class ModuleDependency extends Dependency {
    constructor(request: string);

    public request: string;
    public userRequest: string;
  }

  export = ModuleDependency;
}

declare module 'webpack/lib/Dependency' {
  import * as webpack from 'webpack'
  import Dependency = webpack.compilation.Dependency;
  export = Dependency;
}

declare module 'webpack/lib/MultiModuleFactory' {
  import * as webpack from 'webpack'

  class MultiModuleFactory {
    constructor();
  }

  export = MultiModuleFactory;
}

declare module 'webpack/lib/dependencies/SingleEntryDependency' {
  import * as webpack from 'webpack'
  import Dependency = require('webpack/lib/Dependency');

  class SingleEntryDependency extends Dependency {
    constructor(request: string) {
    }
  }

  export = SingleEntryDependency;
}
