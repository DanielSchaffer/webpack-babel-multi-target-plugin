declare module '@babel/core' {

  import { BabelFileResult, TransformOptions } from 'babel-core'

  type TransformCallback = (err?: Error, result?: BabelFileResult) => void;

  function transform(code: string, options?: TransformOptions, callback: TransformCallback): void;

}
