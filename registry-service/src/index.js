import express from 'express';
import bodyParser from 'body-parser';
import * as middlewares from 'json-api-error/middlewares';
import routes from './routes';


const app = express();

// configure
app.use(bodyParser.json());
app.use(middlewares.jsonApiErrorHandler);

console.log(middlewares.jsonApiErrorHandler);

const port = process.env.PORT || 3000;


// TODO: intialize route
routes.map((route) => {
  app[route.method.toLowerCase()](route.path, route.handler);
});

app.listen(port, () => {
  console.log('Registry Service is up.');
});
