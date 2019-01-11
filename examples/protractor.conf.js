exports.config = {
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
