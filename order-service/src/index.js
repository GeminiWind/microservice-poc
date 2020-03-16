import express from 'express';
import bodyParser from 'body-parser';
import promMid from 'express-prometheus-middleware';
import { jsonApiErrorHandler } from 'json-api-error/middlewares';
import { useStorage, useInstrumentation } from '@hai.dinh/service-libraries/middlewares';
import { loggingHttpRequest, malformedErrorHandler } from './lib/middlewares';
import routes from './routes';

const port = process.env.PORT || 3003;

const app = express();

app.use(promMid({
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
  requestDurationBuckets: [0.1, 0.5, 1, 1.5],
}));

app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(useStorage);
app.use(useInstrumentation);
app.use(loggingHttpRequest);

// initialize routes
routes.map((route) => {
  app[route.method.toLowerCase()](route.path, route.middlewares || [], route.handler);
});

app.use(malformedErrorHandler);
app.use(jsonApiErrorHandler);

app.listen(port, () => {
  console.log(`Order Service is up at ${port}.`);
});
