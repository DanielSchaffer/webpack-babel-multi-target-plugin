// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter')
const browserstack = require('browserstack-local')

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './e2e/**/*.e2e-spec.ts'
  ],
  'seleniumAddress': 'http://hub-cloud.browserstack.com/wd/hub',
  capabilities: {
    'browserstack.user': process.env.BROWSERSTACK_USER,
    'browserstack.key': process.env.BROWSERSTACK_KEY,
    'browserstack.local': true,
    // TODO: make this more generic to allow testing in multiple browsers and reuse by other examples
    'os': 'OS X',
    'os_version': 'Sierra',
    'browserName': 'Safari',
    'browser_version': '10.1',
    'project': require('../../package.json').name,
  },
  directConnect: false,
  baseUrl: 'http://localhost:3002/examples/angular/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  beforeLaunch: () => new Promise((resolve, reject) => {
    exports.bs_local = new browserstack.Local()
    exports.bs_local.start({ key: exports.config.capabilities['browserstack.key'] }, (err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  }),
  onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  },
  afterLaunch: () => new Promise(resolve => exports.bs_local.stop(resolve)),
};
