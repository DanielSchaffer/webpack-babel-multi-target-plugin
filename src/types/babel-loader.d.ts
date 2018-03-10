declare module 'babel-loader' {
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
}
