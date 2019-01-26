const helpers = require('./build.helpers');

(async () => {

  const examples = await helpers.getExamplesList()
  const compiler = require('./compile')(examples)

  compiler.run((err, stats) => {
    if (err) {
      console.error(err)
    }
    console.log(stats.toString({ colors: true, errorDetails: true }))
  })
})()
