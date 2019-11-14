import express from 'express';
import bodyParser from 'body-parser';

const app = express();

// configure
app.use(bodyParser.json())

const port = process.env.PORT || 3000;

// TODO: intialize route

app.use(port, () => {
  console.log('Registry Service is up.')
})
