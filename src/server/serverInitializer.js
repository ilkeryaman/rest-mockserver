import express from 'express';
import bodyParser from 'body-parser';
import https from 'https';
import fs from 'fs';
import logger from '../log/logger';
import configuration from '../configuration';

const port = configuration.port;
const app = express();
app.use(bodyParser.json());

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
