import OGTapable = require('tapable');

declare module 'tapable' {

  interface TapOptionsObject {
    name: string;
  }

  abstract class Tapable extends OGTapable {
  }

  type TapableCallback<TResult = any> = (err?: Error, result?: TResult) => void;

  type TapOptions = string | TapOptionsObject;

  interface Hook {
    compile(options: TapOptions);
  }

  interface SyncHook {
    tap(options: TapOptions, fn: (...args: any[]) => any): void;
  }

  interface SyncHook<TResult> extends Hook {
    tap(options: TapOptions, fn: () => TResult): void;
  }

  interface SyncHook<TArg, TResult> extends Hook {
    tap(options: TapOptions, fn: (arg: TArg) => TResult): void;
  }

  interface SyncHook<TArg1, TArg2, TResult> extends Hook {
    tap(options: TapOptions, fn: (arg1: TArg1, arg2: TArg2) => TResult): void;
  }

  interface SyncHook<TArg1, TArg2, TArg3, TResult> extends Hook {
    tap(options: TapOptions, fn: (arg1: TArg1, arg2: TArg2, arg3: TArg3) => TResult): void;
  }

  interface AsyncHook {
    tapAsync(options: TapOptions, fn: (...args: any[], callback: TapableCallback) => void): void;

    tapPromise(options: TapOptions, fn: (...args: any[]) => Promise<any>): void;
  }

  interface AsyncHook<TResult> extends Hook {
    tapAsync(options: TapOptions, fn: (callback: TapableCallback<TResult>) => void): void;

    tapPromise(options: TapOptions, fn: () => Promise<TResult>);
  }

  interface AsyncHook<TArg, TResult> extends Hook {
    tapAsync(options: TapOptions, fn: (arg: TArg, callback: TapableCallback<TResult>) => void): void;

    tapPromise(options: TapOptions, fn: (arg: TArg) => Promise<TResult>): void;
  }

  interface AsyncHook<TArg1, TArg2, TResult> extends Hook {
    tapAsync(options: TapOptions, fn: (arg1: TArg1, arg2: TArg2, callback: TapableCallback<TResult>) => void): void;

    tapPromise(options: TapOptions, fn: (arg1: TArg1, arg2: TArg2) => Promise<TResult>): void;
  }

  interface AsyncHook<TArg1, TArg2, TArg3, TResult> extends Hook {
    tapAsync(options: TapOptions, fn: (arg1: TArg1, arg2: TArg2, arg3: TArg3, callback: TapableCallback<TResult>) => void): void;

    tapPromise(options: TapOptions, fn: (arg1: TArg1, arg2: TArg2, arg3: TArg3) => Promise<TResult>): void;
  }

  interface SyncBailHook extends SyncHook {
  }

  interface SyncBailHook extends SyncHook<any> {
  }

  interface SyncBailHook<TArg> extends SyncHook<TArg, any> {
  }

  interface SyncBailHook<TArg1, TArg2> extends SyncHook<TArg1, TArg2, any> {
  }

  interface SyncBailHook<TArg1, TArg2, TArg3, any> extends SyncHook<TArg1, TArg2, TArg3, any> {
  }

  interface AsyncSeriesHook extends AsyncHook {
  }

  interface AsyncSeriesHook<TResult> extends AsyncHook<TResult> {
  }

  interface AsyncSeriesHook<TArg, TResult> extends AsyncHook<TArg, TResult> {
  }

  interface AsyncSeriesHook<TArg1, TResult> extends AsyncHook<TArg1, TResult> {
  }

  interface AsyncSeriesHook<TArg1, TArg2, TResult> extends AsyncHook<TArg1, TArg2, TResult> {
  }

  interface AsyncSeriesHook<TArg1, TArg2, TArg3, TResult> extends AsyncHook<TArg1, TArg2, TArg3, TResult> {
  }


}
