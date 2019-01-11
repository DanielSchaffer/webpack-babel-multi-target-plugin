// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts
const https = require('https')
const { SpecReporter } = require('jasmine-spec-reporter')
const browserstack = require('browserstack-local')

const localCapabilities = {
  'browserstack.user': process.env.BROWSERSTACK_USER,
  'browserstack.key': process.env.BROWSERSTACK_KEY,
  'browserstack.console': 'errors',
  'browserstack.networkLogs': true,
  'browserstack.local': true,
  'acceptSslCerts': true,
  'project': require('../../package.json').name,
  'build': `${require('./package.json').name}-${new Date().valueOf()}`,
}

let bsLocal

exports.config = Object.assign(require('../protractor.conf').config, {
  allScriptsTimeout: 11000,
  specs: [
    './e2e/**/*.e2e-spec.ts'
  ],
  'seleniumAddress': 'http://hub-cloud.browserstack.com/wd/hub',
  directConnect: false,
  baseUrl: 'http://bs-local.com:3002',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
  },
  beforeLaunch: () => new Promise((resolve, reject) => {
    bsLocal = new browserstack.Local()
    bsLocal.start({ key: localCapabilities['browserstack.key'] }, (err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  }),
  async onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    const session = await protractor.browser.driver.getSession()
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
    jasmine.getEnv().addReporter(new BrowserStackReporter(session))
  },
  afterLaunch: stopBsLocal,
})

exports.config.multiCapabilities.forEach(cap => Object.assign(cap, localCapabilities))

process.on('uncaughtException', (err) => {
  console.error(err.message, err.stack)
  return stopBsLocal()
})

process.on('close', () => {
  console.log('Processing closing')
})

function stopBsLocal() {
  return new Promise((resolve, reject) => {
    if (bsLocal) {
      console.warn('stopping BrowserStack local')
      return bsLocal.stop(resolve)
    }
    console.warn('BrowserStack local is not initialized')
    reject(new Error('BrowserStack local is not initialized'))
  })
}
class BrowserStackReporter {

  constructor(session) {
    this.errors = []
    this.failed = false
    this.session = session
  }

  async specDone(result) {
    this.errors.push(...result.failedExpectations.map(exp => `${result.fullName}: ${exp.message}`))
    if (result.status === 'failed') {
      this.failed = true
    }
  }

  async suiteDone(result) {
    this.errors.push(...result.failedExpectations.map(exp => exp.message))
    if (result.status === 'failed') {
      this.failed = true
    }
  }

  async jasmineDone() {
    // console.log('Complete!', result, session.id_)

    await this.mark()
    // console.log('Marked')
  }

  mark() {
    const body = { status: this.failed ? 'failed' :  'passed', reason: this.errors.join('\n') }
    const data = JSON.stringify(body)
    const options = {
      method: 'PUT',
      hostname: 'api.browserstack.com',
      path: `/automate/sessions/${this.session.id_}.json`,
      auth: `${localCapabilities['browserstack.user']}:${localCapabilities['browserstack.key']}`,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      },
    }
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        res.on('error', reject)
        res.on('data', (buf) => console.log('marked', res.statusCode, buf.toString()))
        res.on('end', resolve)
      })

      req.on('error', err => reject(err))
      console.log('marking', data)
      req.write(data)
      req.end()
    })
  }


}

process.on('exit', () => {
  if (bsLocal) {
    bsLocal.stop(() => {})
  }
})
