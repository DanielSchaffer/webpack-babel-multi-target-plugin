import { Compilation, Origin } from 'webpack';
import * as webpack from 'webpack';
import { Source } from 'webpack-sources';

declare module 'webpack' {

    import { Hash } from 'crypto';
    import { AsyncHook, AsyncSeriesHook, SyncBailHook, SyncHook } from 'tapable';
    import { Compiler, Entry, BuildModule, BuildModule, Record, Stats } from 'webpack';
    import { Source } from 'webpack-sources';
    import LoaderContext = webpack.loader.LoaderContext;
    /**
     * shouldEmit: new SyncBailHook(["compilation"]),
     done: new AsyncSeriesHook(["stats"]),
     additionalPass: new AsyncSeriesHook([]),
     beforeRun: new AsyncSeriesHook(["compilation"]),
     run: new AsyncSeriesHook(["compilation"]),
     emit: new AsyncSeriesHook(["compilation"]),
     afterEmit: new AsyncSeriesHook(["compilation"]),
     thisCompilation: new SyncHook(["compilation", "params"]),
     compilation: new SyncHook(["compilation", "params"]),
     normalModuleFactory: new SyncHook(["normalModuleFactory"]),
     contextModuleFactory: new SyncHook(["contextModulefactory"]),
     beforeCompile: new AsyncSeriesHook(["params"]),
     compile: new SyncHook(["params"]),
     make: new AsyncParallelHook(["compilation"]),
     afterCompile: new AsyncSeriesHook(["compilation"]),
     watchRun: new AsyncSeriesHook(["compiler"]),
     failed: new SyncHook(["error"]),
     invalid: new SyncHook(["filename", "changeTime"]),
     watchClose: SyncHook<void>;,

     // TODO the following hooks are weirdly located here
     // TODO move them for webpack 5
     environment: SyncHook<void>;,
     afterEnvironment: SyncHook<void>;,
     afterPlugins: new SyncHook(["compiler"]),
     afterResolvers: new SyncHook(["compiler"]),
     entryOption: new SyncBailHook(["context", "entry"])
     */

    export type CompilationParams = any;

    interface NormalModuleFactory {}

    interface ContextModuleFactory {}

    export type EntryContext = any;

    // interface Hooks {
    //     [hookName:string]: SyncHook & AsyncHook;
    // }

    interface CompilerHooks extends Hooks {
        shouldEmit: SyncBailHook<Compilation>;
        done: AsyncSeriesHook<Stats, void>;
        additionalPass: AsyncSeriesHook<void>;
        beforeRun: AsyncSeriesHook<Compilation, void>;
        run: AsyncSeriesHook<Compilation, void>;
        emit: AsyncSeriesHook<Compilation, void>;
        afterEmit: AsyncSeriesHook<Compilation, void>;
        thisCompilation: SyncHook<Compilation, CompilationParams, void>;
        compilation: SyncHook<Compilation, CompilationParams, void>;
        normalModuleFactory: SyncHook<NormalModuleFactory, void>;
        contextModuleFactory: SyncHook<ContextModuleFactory, void>;
        beforeCompile: AsyncSeriesHook<CompilationParams, void>;
        compile: SyncHook<CompilationParams, void>;
        make: AsyncParallelHook<Compilation, void>;
        afterCompile: AsyncSeriesHook<Compilation, void>;
        watchRun: AsyncSeriesHook<Compiler, void>;
        failed: SyncHook<Error, void>;
        invalid: SyncHook<string, Date, void>;
        watchClose: SyncHook<void>;

        environment: SyncHook<void>;
        afterEnvironment: SyncHook<void>;
        afterPlugins: SyncHook<Compiler, void>;
        afterResolvers: SyncHook<Compiler, void>;
        entryOption: SyncBailHook<EntryContext, Entry, void>;
    }

    class Entrypoint {

    }

    interface Compiler {
        hooks: CompilerHooks;
        runAsChild(handler?: Compiler.Handler): void;
        parentCompilation?: Compilation;
        context: string;
    }

    export type AssetPathData = any;

    interface CompilationHooks extends Hooks {
        buildModule: SyncHook<BuildModule, void>;
        rebuildModule: SyncHook<BuildModule, void>;
        failedModule: SyncHook<BuildModule, Error, void>;
        succeedModule: SyncHook<BuildModule>;

        finishModules: SyncHook<BuildModule[]>;
        finishRebuildingModule: SyncHook<BuildModule>;

        unseal: SyncHook<void>,
        seal: SyncHook<void>,

        optimizeDependenciesBasic: SyncBailHook<BuildModule[]>;
        optimizeDependencies: SyncBailHook<BuildModule[]>;
        optimizeDependenciesAdvanced: SyncBailHook<BuildModule[]>;
        afterOptimizeDependencies: SyncHook<BuildModule[], void>;

        optimize: SyncHook<void>,

        optimizeModulesBasic: SyncBailHook<BuildModule[]>;
        optimizeModules: SyncBailHook<BuildModule[]>;
        optimizeModulesAdvanced: SyncBailHook<BuildModule[]>;
        afterOptimizeModules: SyncHook<BuildModule[], void>;

        optimizeChunksBasic: SyncBailHook<Chunk[], ChunkGroup[]>;
        optimizeChunks: SyncBailHook<Chunk[], ChunkGroup[]>;
        optimizeChunksAdvanced: SyncBailHook<Chunk[], ChunkGroup[]>;
        afterOptimizeChunks: SyncHook<Chunk[], ChunkGroup[], void>;

        optimizeTree: AsyncSeriesHook<Chunk[], BuildModule[], void>;
        afterOptimizeTree: SyncHook<Chunk[], ChunkGroup[], void>;

        optimizeChunkModulesBasic: SyncBailHook<Chunk[], ChunkGroup[]>;
        optimizeChunkModules: SyncBailHook<Chunk[], ChunkGroup[]>;
        optimizeChunkModulesAdvanced: SyncBailHook<Chunk[], ChunkGroup[]>;
        afterOptimizeChunkModules: SyncHook<Chunk[], ChunkGroup[], void>;
        shouldRecord: SyncBailHook;

        reviveModules: SyncHook<Modules[], Record[]>;
        optimizeModuleOrder: SyncHook<BuildModule[], void>;
        advancedOptimizeModuleOrder: SyncHook<BuildModule[], void>;
        beforeModuleIds: SyncHook<BuildModule[], void>;
        moduleIds: SyncHook<BuildModule[], void>;
        optimizeModuleIds: SyncHook<BuildModule[], void>;
        afterOptimizeModuleIds: SyncHook<BuildModule[], void>;

        reviveChunks: SyncHook<Chunk[], Record[]>;
        optimizeChunkOrder: SyncHook<Chunk[], void>;
        beforeChunkIds: SyncHook<Chunk[], void>;
        optimizeChunkIds: SyncHook<Chunk[], void>;
        afterOptimizeChunkIds: SyncHook<Chunk[], void>;

        recordModules: SyncHook<Modules[], Record[]>;
        recordChunks: SyncHook<Chunk[], Record[]>;

        beforeHash: SyncHook<void>,
        afterHash: SyncHook<void>,

        recordHash: SyncHook<Record[], void>,

        record: SyncHook<Compilation, Record[]>;

        beforeModuleAssets: SyncHook<void>;
        shouldGenerateChunkAssets: SyncBailHook;
        beforeChunkAssets: SyncHook<void>;
        additionalChunkAssets: SyncHook<Chunk[], void>;

        records: SyncHook<Compilation, Record[]>;

        additionalAssets: AsyncSeriesHook<void>;
        optimizeChunkAssets: AsyncSeriesHook<Chunk[], void>;
        afterOptimizeChunkAssets: SyncHook<Chunk[], void>;
        optimizeAssets: AsyncSeriesHook<Source[], void>;
        afterOptimizeAssets: SyncHook<Source[], void>;

        needAdditionalSeal: SyncBailHook;
        afterSeal: AsyncSeriesHook<void>;

        chunkHash: SyncHook<Chunk, string, void>;
        moduleAsset: SyncHook<BuildModule, string, void>;
        chunkAsset: SyncHook<Chunk, string, void>;

        assetPath: SyncWaterfallHook<string, AssetPathData, void>;

        needAdditionalPass: SyncBailHook;
        childCompiler: SyncHook<Compiler, string, number, void>;

        normalModuleLoader: SyncHook<LoaderContext, BuildModule, void>;

        optimizeExtractedChunksBasic: SyncBailHook<Chunk[]>;
        optimizeExtractedChunks: SyncBailHook<Chunk[]>;
        optimizeExtractedChunksAdvanced: SyncBailHook<Chunk[]>;
        afterOptimizeExtractedChunks: SyncHook<Chunk[], void>;
    }

    class Chunk {
        constructor(name: string);
        id: string;
        ids: string[];
        debugId: number;
        name: string;
        files: string[];
        hash: string;
        renderedHash: string;
        rendered: boolean;
        chunkReason: string;
        extraAsync: boolean;
        size(arg: any): number;
        hasRuntime(): boolean;
        canBeInitial(): boolean;
        isOnlyInitial(): boolean;
        hasEntryModule(): boolean;
        addModule(module: BuildModule): boolean;
        removeModule(module: BuildModule): boolean;
        setModules(module: BuildModule[]): void;
        getNumberOfModules(): number;
        get modulesIterable(): BuildModule[];
        addGroup(chunkGroup: ChunkGroup): boolean;
        removeGroup(chunkGroup: ChunkGroup): boolean;
        isInGroup(chunkGroup: ChunkGroup): boolean;
        getNumberOfGroups(): number;
        get groupsIterable(): ChunkGroup[];
        compareTo(otherChunk: ChunkGroup): number;
        containsModule(module: BuildModule): boolean;
        getModules(): BuildModule[];
        getModulesIdent(): any; // FIXME: not sure what this returns
        remove(reason?: string): void;
        moveModule(module: BuildModule, otherChunk: ChunkGroup): void;
        integrate(otherChunk: ChunkGroup, reason?: string): boolean;
        split(newChunk: Chunk): void;
        isEmpty(): boolean;
        updateHash(hash: Hash): void;
        canBeIntegrated(otherChunk: ChunkGroup): boolean;
        addMultiplierAndOverhead(size: number, options?: SizeOptions): number;
        modulesSize(): number;
        size(options?: SizeOptions): number;
        sortModules(sortByFn: Function): void;
        sortItems(sortChunks?: any): void; // FIXME: why is sortChunks there? doesn't appear to be used
        getAllAsyncChunks(): Set<Chunk>;
        getChunkMaps(realHash: string): {
            hash: { [chunkId: string]: string };
            name: { [chunkId: string]: string };
        }
        getChunkModuleMaps(filterFn: Function): {
            id: { [chunkId: string]: string };
            hash: { [chunkId: string]: string };
        }
        hasModuleInGraph(filterFn: Function, filterChunkFn: Function): boolean;
        toString(): string;
    }

    interface SizeOptions {
        chunkOverhead: number;
        entryChunkMultiplicator: number;
    }

    interface Origin {
        loc: string;
        module?: BuildModule;
        request: string;
    }

    class ChunkGroup {
        constructor(name: string);
        groupDebugId: number;
        name: string;
        chunks: Chunk[];
        origins: Origin[];
        runtimeChunk?: Chunk;
        get debugId(): string;
        get id(): string;
        unshiftChunk(chunk: Chunk): boolean;
        insertChunk(chunk: Chunk, before: Chunk): boolean;
        pushChunk(chunk: Chunk): boolean;
        replaceChunk(oldChunk: Chunk, newChunk: Chunk): boolean;
        removeChunk(chunk: Chunk): boolean;
        isInitial(): boolean;
        addChild(chunk: Chunk): boolean;
        getChildren(): Chunk[]; // TODO are these actually chunks?
        getNumberOfChildren(): number;
        get childrenIterable(): Chunk[];
        removeChild(chunk: Chunk): boolean;
        addParent(chunkChunk: Chunk): boolean;
        getParents(): Chunk[];
        setParents(newParents: Chunk[]): void;
        hasParent(parent: Chunk): boolean;
        get parentsIterable(): Chunk[];
        removeParent(chunk: Chunk): boolean;
        getBlocks(): Block[];
        getNumberOfBlocks(): number;
        hasBlock(block: Block): boolean;
        get blocksIterable(): Block[];
        addBlock(block: Block): boolean;
        addOrigin(module: BuildModule, loc: string, request: string): void;
        containsModule(module: BuildModule): boolean;
        remove(reason?: string): void;
        sortItems(): void;
        checkContraints(): void;
    }

    interface Block {}

    interface Entrypoint extends ChunkGroup {
        runtimeChunk: Chunk;
    }

    interface Compilation {
        hooks: CompilationHooks;
        children?: Compilation[];
        name?: string;
        assets: { [src: string]: Source };
        hash: string;
        fullHash: string;
        chunkGroups: ChunkGroup[];
        entries: BuildModule[];
        fileDependencies: string[];
        modules: BuildModule[];
        errors?: any[];
        compiler: Compiler;
    }

    interface Dependency {
        module: BuildModule;
    }

    interface DependenciesBlock {
        dependencies: Dependency[];
        blocks: any[];
        variables: any[];
    }

    interface BuildModule extends DependenciesBlock {
        type: string;
        context: string;
        debugId: number;
        hash: string;
        renderedHash: string;
        resolveOptions: any;
        factoryMeta: any;
        warnings: any[];
        errors: any[];
        reasons: any[];
        buildMeta: any;
        buildInfo: any;
        id: string;
        index: number;
        index2: number;
        depth: number;
        issuer: BuildModule;
        profile: any;
        prefetched: boolean;
        built: boolean;
        used: any;
        usedExports: any;
        optimizationBailout: any[];
        request?: string;
    }

}
