import { Server } from 'http'
import { resolve } from 'path'

import * as compression from 'compression'
import * as cors from 'cors'
import { Express, Request, RequestHandler, Response } from 'express';
import * as express from 'express'
import { Compiler } from 'webpack'
import * as webpack from 'webpack'
import * as merge from 'webpack-merge'
import * as webpackMiddleware from 'webpack-dev-middleware'

const helpers = require('./build.helpers')
const commonConfig = require('./webpack.common')

const PUBLIC_PATH_BASE = '/examples'

interface Example {
  compiler: Compiler
  done: Promise<void>
  publicPath: string
}

interface ServerStart {
  ready: Promise<void>
  done: Promise<any>
}

export class DevServer {

  private app: Express
  private server: Server
  private serverStart: ServerStart

  public start(port: number, host: string): ServerStart {
    if (this.serverStart) {
      return this.serverStart
    }

    this.app = express()
      .use(cors())
      .use(compression())

    const examples = this.getExamples()
    const fallback = (mw: RequestHandler) => (req: Request, res: Response, next: (err?: any) => void) => {
      if (req.originalUrl.match(/\.\w+$/)) {
        return next()
      }
      return mw(req, res, next)
    }
    examples.forEach(example => {
      const mw = webpackMiddleware(example.compiler)
      this.app
        .use(`${example.publicPath}*`, fallback(mw))
        .use(example.publicPath, mw)

    })

    return this.serverStart = {
      ready: new Promise(resolve => this.server = this.app.listen(port, host, resolve)),
      done: Promise.all(examples.map(example => example.done)),
    }
  }

  public async stop() {
    if (!this.server) {
      return
    }

    return new Promise(resolve => {
      this.server.close(() => {
        this.server = null
        this.serverStart = null
        this.app = null
        resolve()
      })
    })
  }

  private getExamples(): Example[] {

    const exampleNames = helpers.getExamplesList()

    return exampleNames.map((example: string) => {

      const publicPath = `${PUBLIC_PATH_BASE}/${example}/`
      const workingDir = resolve(__dirname, example)
      const exampleConfig = require(resolve(workingDir, 'webpack.config.js'))
      let optionsConfig = {}
      try { optionsConfig = require(resolve(workingDir, 'options.config.js')) }
      catch(err) { /* ignore */ }
      const config = merge(
        commonConfig(workingDir, optionsConfig),
        exampleConfig,
        {
          output: {
            publicPath,
          },
        },
      )
      const compiler = webpack(config)
      const done = new Promise((resolve) => compiler.hooks.done.tap('dev-server', resolve))
      return {
        compiler,
        done,
        publicPath,
      }
    })

  }

}
