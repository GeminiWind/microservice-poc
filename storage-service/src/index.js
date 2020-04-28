import * as R from 'ramda';
import express from 'express';
import bodyParser from 'body-parser';
import { InternalError } from 'json-api-error';
import promMid from 'express-prometheus-middleware';
import compression from 'compression';
import { useInstrumentation, useHttpLogger, traceRequest } from '@hai.dinh/service-libraries/middlewares';
import { jsonApiErrorHandler } from 'json-api-error/middlewares';
import { MongoClient } from 'mongodb';
import routes from './routes';
import initMainCollection from './tasks/initMainCollection';
import { MAIN_COLLECTION_NAME } from './constants';

const app = express();

app.use(promMid({
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
  requestDurationBuckets: [0.1, 0.5, 1, 1.5]
}));

// configure
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(traceRequest);
app.use(useInstrumentation);
app.use(useHttpLogger);
app.use(compression());

const port = process.env.PORT || 3001;

let connector;

(async () => {
  try {
    const urlConnection = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`;
    const client = await MongoClient.connect(urlConnection);

    connector = client.db(process.env.DB_NAME);
    await initMainCollection(connector, MAIN_COLLECTION_NAME);
  } catch (err) {
    console.log('Error in establishing connection with database', err);

    throw new InternalError('Error in establishing connection with database');
  }
})();


app.use((req, _, next) => {
  req.connector = connector;

  next();
});

// security constraints
app.disable('x-powered-by');

// routes
R.forEach((route) => {
  app[route.method.toLowerCase()](route.path, route.middlewares || [], route.handler);
}, routes);

app.use(jsonApiErrorHandler);

const server = app.listen(port, () => {
  console.log(`Storage Service is up at ${port}.`);
});

process.on('SIGINT', () => {
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  server.close(() => {
    // force close all MongoDB connection
    MongoClient.close(true);
    process.exit(0);
  });
});
