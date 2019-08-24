declare module 'babel-loader' {
  import { TransformOptions } from 'babel-core'

  // eslint-disable-next-line no-magic-numbers
  type CoreJsVersion = 2 | 3

  export interface BabelPresetOptions {
    corejs?: CoreJsVersion | {
      version: CoreJsVersion
      proposals?: boolean
      shippedProposals?: boolean
    }
    spec?: boolean;
    loose?: boolean;
    modules?: 'amd' | 'umd' | 'systemjs' | 'commonjs' | false;
    debug?: boolean;
    include?: Array<string>;
    exclude?: Array<string>;
    useBuiltIns?: 'usage' | 'entry' | false;
    forceAllTransforms?: boolean;
    configPath?: string;
    ignoreBrowserslistConfig?: boolean;
    shippedProposals?: boolean;
    targets?: {
      browsers?: string[];
    }
  }

  export interface BabelLoaderTransformOptions extends TransformOptions {
    cacheDirectory?: boolean | string;
    cacheIdentifier?: string;
  }
}
