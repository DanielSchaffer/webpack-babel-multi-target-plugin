const VERSION = parseVersion(require('../package.json').version)
const IS_MASTER = /^master$/
const IS_PRERELEASE = /^release\/\d+\.\d+\.\d+$/
const IS_LINUX = /^linux$/

function parseVersion(str) {
  const parts = str.split('-')
  const main = parts[0].split('.')
  const version = {
    major: main[0],
    minor: main[1],
    patch: main[2],
  }
  if (parts.length === 2) {
    version.pre = parts[1]
  }
  return version
}

function getVersionCommand(branch, version) {
  if (!IS_LINUX.test(process.env.TRAVIS_OS_NAME)) {
    return `echo "Only publishing from linux, not '${process.env.TRAVIS_OS_NAME}'"`
  }

  if (IS_PRERELEASE.test(branch)) {
    if (!version.pre) {
      return errorCommand('Please set the package.json version to the desired 0-index prerelease for the next release. For example, 2.2.0-alpha.0', 2)
    }
    return versionCommand('pre')
  }

  if (IS_MASTER.test(branch)) {
    if (!version.pre) {
      return errorCommand('Cannot release from master unless following a prerelease', 3)
    }
    return versionCommand(`${version.major}.${version.minor}.${version.patch}`)
  }

  return 'echo "Not on a branch for release or prerelease."'
}

function errorCommand(error, code) {
  return `echo "${error}" 1>&2; exit ${code}`
}

function versionCommand(version) {
  return `npm version ${version} -m "[skip ci] v%s"`
}

console.log(getVersionCommand(process.env.TRAVIS_BRANCH, VERSION))
