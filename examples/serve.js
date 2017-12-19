const DevServer = require('webpack-dev-server');

const compiler = require('./compile');

const devServerOptions = {
    host: '0.0.0.0',
    port: '3002',
    disableHostCheck: true,
    historyApiFallback: true,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
};

const server = new DevServer(compiler, devServerOptions);
server.listen(devServerOptions.port, devServerOptions.host, () => {
    console.log(`Starting server on http://${devServerOptions.host}:${devServerOptions.port}`);
});
