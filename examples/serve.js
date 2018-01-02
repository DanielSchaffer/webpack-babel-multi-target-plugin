const DevServer = require('webpack-dev-server');
const helpers = require('./build.helpers');

const PUBLIC_PATH_BASE = '/examples';

(async () => {

    const examples = await helpers.getExamplesList();
    const compiler = require('./compile')(examples);

    const publicPath = examples.length === 1 ? `${PUBLIC_PATH_BASE}/${examples[0]}` : PUBLIC_PATH_BASE;

    const devServerOptions = {
        host: '0.0.0.0',
        port: '3002',
        compress: true,
        publicPath,
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
        console.log(`Starting server at http://${devServerOptions.host}:${devServerOptions.port}${publicPath}`);
    });
})();