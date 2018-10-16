import mongoose from 'mongoose';
import util from 'util';

// config should be imported before importing any other file
import config from './config/config';
import app from './config/express';
import worker from './worker/worker';

const debug = require('debug')('express-mongoose-es6-rest-api:index');

mongoose.Promise = global.Promise;

// connect to mongo db
const mongoUri = process.env.MONGO_URI || config.mongo.host;

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    reconnectTries: 5,
    reconnectInterval: 1000
});

mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${mongoUri}`);
});

// print mongoose logs in dev env
if (config.MONGOOSE_DEBUG) {
    mongoose.set('debug', (collectionName, method, query, doc) => {
        debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
    });
}

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
// listen on port config.port
    app.listen(process.env.PORT || config.port, () => {
        worker.start();
        console.info(`server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
    });
}

export default app;
