import { readdirSync, statSync } from 'fs';
import { basename, join, resolve } from 'path';

function listAllExamples() {
  const contents = readdirSync(resolve(__dirname))
  return contents.filter(dir => statSync(join(__dirname, dir)).isDirectory())
}

export const getExamplesList = (): string[] => {

  if (process.env.EXAMPLES) {
    return process.env.EXAMPLES.split(',')
  }

  if (process.argv.length > 2) {
    // use the list of requested examples from the command line
    // e.g. npm run example es6-plain typescript-plain
    return process.argv.slice(2)
  }

  if (['examples', 'start', 'e2e', 'e2e-ci'].includes(process.env.npm_lifecycle_event)) {
    // build all examples - get the list of examples by reading the subdirectories for ./examples
    return listAllExamples()
  }

  // build the example in the current working directory
  // e.g. ./babel-multi-target-plugin/examples/es6-plain$ node ../build
  return [basename(process.cwd())]

}
