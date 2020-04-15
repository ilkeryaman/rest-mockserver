import express from 'express';
import https from 'https';
import fs from 'fs';
import logger from '../log/logger';
import configuration from '../configuration';

const app = express();
const port = configuration.port;

class ServerInitializer {
    startListening(routes) {
        let sslEnabled = configuration.sslEnabled;
        if (sslEnabled) {
            https.createServer(
                {
                    key: fs.readFileSync(configuration.certificateKeyFilePath),
                    cert: fs.readFileSync(configuration.certificateFilePath),
                },
                app
            ).listen(port, () => { logger.displayRouteInformation(routes, port, sslEnabled); });
        } else {
            app.listen(port, () => { logger.displayRouteInformation(routes, port, sslEnabled); });
        }
    }

    getServer() {
        return app;
    }
}

export default ServerInitializer;
