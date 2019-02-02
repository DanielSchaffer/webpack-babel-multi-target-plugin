declare module 'babel-loader' {
  import { TransformOptions } from 'babel-core'

  export interface BabelPresetOptions {
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
