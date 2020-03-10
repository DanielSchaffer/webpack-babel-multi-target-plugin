/* eslint-disable camelcase */
/* global jasmine */

// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts
const protractor = require('protractor')
const { SpecReporter } = require('jasmine-spec-reporter')

const DevServer = require('./_util/dev-server').DevServer
const BrowserstackLocalManager = require('./_util/browserstack-local-manager').BrowserstackLocalManager
const BrowserStackReporter = require('./_util/browserstack-reporter').BrowserStackReporter
const getExamplesList = require('./build.helpers').getExamplesList

function browserDef(name, version, options) {
  return Object.assign({
    browserName: name,
    browser_version: version,
  }, options)
}

const browsersByKey = {
  'chrome:latest': browserDef('Chrome', '71.0'),
  'firefox:latest': browserDef('Firefox', '64.0'),
  'edge:latest': browserDef('Edge', '18.0'),
  'ie:11': browserDef('IE', '11.0', {
    os: 'Windows',
    os_version: '7',
    'browserstack.selenium_version': '3.14.0',
  }),
  'safari:latest': browserDef('Safari', '12.0', {
    os: 'OS X',
    os_version: 'Mojave',
    'browserstack.selenium_version': '3.13.0',
  }),
  'safari:nomodule': browserDef('Safari', '10.1', {
    os: 'OS X',
    os_version: 'Sierra',
  }),
  'safari-mobile:nomodule': browserDef('Safari', undefined, {
    device: 'iPhone 7',
    os: 'iOS',
    os_version: '10.0',
    realMobile: true,
  }),
}

function selectBrowsers() {
  const BROWSERS = process.env.BROWSERS ? process.env.BROWSERS.split(',') : []
  console.log('BROWSERS', BROWSERS)
  return Object.keys(browsersByKey)
    .filter(key => {
      if (!BROWSERS.length) {
        return true
      }
      if (BROWSERS.includes(key)) {
        return true
      }
      // e.g. match BROWSERS=latest with *:latest
      if (BROWSERS.find(def => key.endsWith(`:${def}`))) {
        return true
      }
    })
    .map(key => browsersByKey[key])
}

const browsers = {
  multiCapabilities: selectBrowsers(),
}

if (process.env.npm_lifecycle_event) {
  console.log('browsers', process.env.BROWSERS || '(BROWSERS not set)', '=>', browsers.multiCapabilities)
}

const browserStackUser = process.env.BROWSERSTACK_USER
const browserStackKey = process.env.BROWSERSTACK_KEY
const PORT = process.env.PORT || 3002
const HOST = process.env.HOST || '127.0.0.1'
const examples = getExamplesList()

const localCapabilities = {
  'browserstack.user': browserStackUser,
  'browserstack.key': browserStackKey,
  'browserstack.console': 'errors',
  'browserstack.networkLogs': true,
  'browserstack.local': true,
  'acceptSslCerts': true,
  'project': `${require('../package.json').name}: ${process.env.npm_lifecycle_event || 'manual'}`,
  'build': new Date().valueOf().toString(),
  // 'browserstack.selenium_version': '3.14.0',
}

const bsLocal = new BrowserstackLocalManager(browserStackKey)
let server

exports.config = Object.assign(browsers, {
  allScriptsTimeout: 11000,
  specs: [
    './*.e2e-spec.ts',
    ...examples.map(example => `./${example}/e2e/**/*.e2e-spec.ts`),
  ],
  'seleniumAddress': 'http://hub-cloud.browserstack.com/wd/hub',
  directConnect: false,
  baseUrl: `http://bs-local.com:${PORT}`,
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
  },
  async beforeLaunch() {
    console.log('starting...')

    if (process.env.npm_lifecycle_event === 'e2e-ci') {
      server = new DevServer()
      const start = server.start(PORT, HOST)
      console.log('starting dev server...')
      await Promise.all([start.ready, start.done])
    }

    console.log('starting browserstack-local...')
    await bsLocal.start()

    console.log('ready.')
  },
  async onPrepare() {
    const caps = await protractor.browser.getCapabilities()

    const browserName = caps.get('browserName')
    const browserVersion = caps.get('browserVersion')
    if (browserName === 'Safari' && browserVersion === '12.0') {
      // eslint-disable-next-line require-atomic-updates
      protractor.browser.resetUrl = 'about:blank'
    }

    const session = await protractor.browser.driver.getSession()
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }))
    jasmine.getEnv().addReporter(new BrowserStackReporter(session, browserStackUser, browserStackKey))
  },
  async afterLaunch() {
    const tasks = [
      bsLocal.stop(),
    ]

    if (server) {
      tasks.push(server.stop())
    }

    await Promise.all(tasks)
  },
})

exports.config.multiCapabilities.forEach(cap => Object.assign(cap, localCapabilities, cap))

process.on('uncaughtException', (err) => {
  console.error(err.message, err.stack)
  return bsLocal.stop()
})

process.on('close', () => {
  console.log('Processing closing')
})

process.on('exit', () => {
  return bsLocal.stop()
})
