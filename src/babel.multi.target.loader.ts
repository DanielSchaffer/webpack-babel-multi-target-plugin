import { Loader, NewLoader } from 'webpack'

export interface BabelMultiTargetLoaderOptions {
    isBabelMultiTargetLoader: true;
    loaderOptions?: { [key: string ]: any };
}

export class BabelMultiTargetLoader implements NewLoader {

    public readonly loader: string;
    public readonly options: BabelMultiTargetLoaderOptions;

    constructor(loader?: Loader) {
      if (typeof loader === 'string') {
        this.loader = loader
        this.options = {
          isBabelMultiTargetLoader: true,
        }
      } else {
        this.loader = loader.loader
        this.options = {
          isBabelMultiTargetLoader: true,
          loaderOptions: loader.options,
        }
      }
    }
}
