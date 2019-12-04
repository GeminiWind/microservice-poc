import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import { jsonApiErrorHandler } from 'json-api-error/middlewares';
import { useStorage } from '@hai.dinh/service-libraries/middlewares';
import { logger, jwtPassport } from './lib';
import { loggingHttpRequest, malformedErrorHandler } from './lib/middlewares';
import routes from './routes';

const port = process.env.PORT || 3002;

const app = express();

app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(useStorage);
app.use(loggingHttpRequest);
// decorate library/utilities to request
app.use((req, _, next) => {
  req.instrumentation = logger;

  next();
});

// configure app for user JWT Passport
jwtPassport(passport);

// initialize routes
routes.map((route) => {
  app[route.method.toLowerCase()](route.path, route.middlewares || [], route.handler);
});

app.use(malformedErrorHandler);
app.use(jsonApiErrorHandler);

app.listen(port, () => {
  console.log(`Auth Service is up at ${port}.`);
});
