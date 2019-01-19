declare module 'browserstack-local' {

  interface StartOptions {
    key: string
  }

  type StartCallback = (err: Error) => void

  class Local {
    start(options: StartOptions, callback?: StartCallback): void
  }

}
