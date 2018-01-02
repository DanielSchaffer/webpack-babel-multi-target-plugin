const fs = require('fs');
const path = require('path');

function readdirAsync(path) {
    return new Promise((resolve, reject) =>
        fs.readdir(path, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        })
    );
}

async function listAllExamples() {
    const contents = await readdirAsync(path.resolve(__dirname));
    return contents.filter(dir => fs.statSync(path.join(__dirname, dir)).isDirectory());
}

module.exports.getExamplesList = async () => {

    if (process.argv.length > 2) {

        // use the list of requested examples from the command line
        // e.g. npm run example es6-plain typescript-plain
        return Promise.resolve(process.argv.slice(2));

    }

    if (['examples', 'start'].includes(process.env.npm_lifecycle_event)) {

        // build all examples - get the list of examples by reading the subdirectories for ./examples
        return await listAllExamples();

    }

    // build the example in the current working directory
    // e.g. ./babel-multi-target-plugin/examples/es6-plain$ node ../build
    return Promise.resolve([path.basename(process.cwd())]);

};