let devServerClientPath: string

const DEV_SERVER_CLIENT_RELPATH = 'webpack-dev-server/client/index'

try {
  devServerClientPath = require.resolve(DEV_SERVER_CLIENT_RELPATH, { paths: [process.cwd()] })
} catch (err) {
  // webpack-dev-server is not installed
  devServerClientPath = DEV_SERVER_CLIENT_RELPATH
}

export const DEV_SERVER_CLIENT = devServerClientPath
