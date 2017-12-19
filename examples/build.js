const compiler = require('./compile');

compiler.run((err, stats) => {
    if (err) {
        console.error(err);
    }
    console.log(stats.toString({ colors: true, errorDetails: true }))
});