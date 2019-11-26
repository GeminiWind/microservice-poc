import express from 'express';
import bodyParser from 'body-parser';
import { jsonApiErrorHandler } from 'json-api-error/middlewares';
import routes from './routes';


const app = express();

// configure
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

// TODO: intialize route
routes.map((route) => {
  app[route.method.toLowerCase()](route.path, route.handler);
});

app.use(jsonApiErrorHandler);

app.listen(port, () => {
  console.log('Registry Service is up.');
});
