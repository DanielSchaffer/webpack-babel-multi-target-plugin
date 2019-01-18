const DevServer = require('./dev-server').DevServer;

(async () => {

  const devServer = new DevServer()

  const host = process.env.HOST || 'localhost'
  const port = process.env.PORT || 3002

  devServer.start(port, host)

})();
