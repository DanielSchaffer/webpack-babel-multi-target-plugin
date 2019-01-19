import { Local } from 'browserstack-local';

export class BrowserstackLocalManager {

  private instance: any
  private starting: Promise<void>
  private stopping: Promise<void>

  constructor(private key: string) {}

  public start(): Promise<void> {
    if (this.starting) {
      return this.starting
    }
    return this.starting = new Promise((resolve, reject) => {
      this.instance = new Local()
      this.instance.start({ key: this.key }, (err: Error) => {
        this.starting = null
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  public stop(): Promise<void> {
    if (this.stopping) {
      return this.stopping
    }
    return this.stopping = new Promise((resolve, reject) => {
      if (this.instance) {
        console.warn('stopping BrowserStack local')
        return this.instance.stop(resolve)
      }
      this.stopping = null
      console.warn('BrowserStack local is not initialized')
      reject(new Error('BrowserStack local is not initialized'))
    })
  }
}
