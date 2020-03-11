import express from 'express';
import bodyParser from 'body-parser';
import promMid from 'express-prometheus-middleware';
import { jsonApiErrorHandler } from 'json-api-error/middlewares';
import routes from './routes';

const app = express();

app.use(promMid({
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
  requestDurationBuckets: [0.1, 0.5, 1, 1.5],
}));

// configure
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

const port = process.env.PORT || 3000;

// TODO: intialize route
routes.map((route) => {
  app[route.method.toLowerCase()](route.path, route.handler);
});

app.use(jsonApiErrorHandler);

app.listen(port, () => {
  console.log('Registry Service is up.');
});
