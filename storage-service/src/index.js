import express from 'express';
import bodyParser from 'body-parser';
import { InternalError } from 'json-api-error';
import { MongoClient } from 'mongodb';
import routes from './routes';
import initMainCollection from './tasks/initMainCollection';
import { MAIN_COLLECTION_NAME } from './constants';

const app = express();

// configure
app.use(bodyParser.json());

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


// TODO: intialize route
routes.map((route) => {
  app[route.method.toLowerCase()](route.path, route.handler);
});

app.listen(port, () => {
  console.log(`Storage Service is up at ${port}.`);
});
