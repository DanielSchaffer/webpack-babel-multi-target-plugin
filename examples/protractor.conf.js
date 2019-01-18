// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts
const protractor = require('protractor')
const { SpecReporter } = require('jasmine-spec-reporter')

const DevServer = require('./dev-server').DevServer
const BrowserstackLocalManager = require('./browserstack-local-manager').BrowserstackLocalManager;
const getExamplesList = require('./build.helpers').getExamplesList
const BrowserStackReporter = require('./browserstack-reporter').BrowserStackReporter

const browsers = {
  multiCapabilities: [
    // latest browsers
    {
      browserName: 'Chrome',
      browser_version: '71.0'
    },
    {
      browserName: 'Firefox',
      browser_version: '64.0',
    },
    {
      browserName: 'Edge',
      browser_version: '18.0',
    },
    {
      os: 'Windows',
      os_version: '7',
      browserName: 'IE',
      browser_version: '11.0',
    },
    // {
    //   browserName: 'Safari',
    //   browser_version: '12.0',
    //  'browserstack.selenium_version': '3.13.0',
    // },

    // Safari 10/nomodule bug
    {
      'os': 'OS X',
      'os_version': 'Sierra',
      'browserName': 'Safari',
      'browser_version': '10.1',
    },
    {
      'device': 'iPhone 7',
      'os': 'iOS',
      'os_version': '10.0',
      'browserName': 'Safari',
      'realMobile': true,
    },
  ],
}

const browserStackUser = process.env.BROWSERSTACK_USER
const browserStackKey = process.env.BROWSERSTACK_KEY
const PORT = process.env.PORT || 3002
const HOST = process.env.HOST || '127.0.0.1'
const examples = getExamplesList();

const localCapabilities = {
  'browserstack.user': browserStackUser,
  'browserstack.key': browserStackKey,
  'browserstack.console': 'errors',
  'browserstack.networkLogs': true,
  'browserstack.local': true,
  'acceptSslCerts': true,
  'project': require('../package.json').name,
  'build': new Date().valueOf().toString(),
}

const bsLocal = new BrowserstackLocalManager(browserStackKey)
let server

exports.config = Object.assign(browsers, {
  allScriptsTimeout: 11000,
  specs: [
    './*.e2e-spec.ts',
    ...examples.map(example => `./${example}/e2e/**/*.e2e-spec.ts`)
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
    const session = await protractor.browser.driver.getSession()
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
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

exports.config.multiCapabilities.forEach(cap => Object.assign(cap, localCapabilities))

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
