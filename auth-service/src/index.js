import express from 'express';
import bodyParser from 'body-parser';
import promMid from 'express-prometheus-middleware';
import * as R from 'ramda';
import { StorageClient } from '@hai.dinh/service-libraries';
import compression from 'compression';
import { jsonApiErrorHandler } from 'json-api-error/middlewares';
import {
  useInstrumentation, useHttpLogger, traceRequest
} from '@hai.dinh/service-libraries/middlewares';
import { malformedErrorHandler } from './lib/middlewares';
import routes from './routes';

const port = process.env.PORT || 3002;

const app = express();

app.use(promMid({
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
  requestDurationBuckets: [0.1, 0.5, 1, 1.5]
}));

app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(traceRequest);
app.use(useInstrumentation);
app.use(useHttpLogger);
app.use(compression());

let storageClient;

app.use(async (req, _, next) => {
  if (!storageClient) {
    storageClient = await StorageClient.create();
  }
  req.storageClient = storageClient;

  next();
});

// security constraints
app.disable('x-powered-by');

// routes
R.forEach((route) => {
  app[route.method.toLowerCase()](route.path, route.middlewares || [], route.handler);
}, routes);

app.use(malformedErrorHandler);
app.use(jsonApiErrorHandler);

const server = app.listen(port, () => {
  console.log(`Auth Service is up at ${port}.`);
});

process.on('SIGINT', () => {
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0);
  });
});
