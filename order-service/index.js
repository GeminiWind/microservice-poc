const express = require('express');

const app = express();

app.get('/', (req, res) => {
  console.log(`Logged user email ${req.headers['x-remote-user']}`);
  console.log(JSON.stringify(req.headers, null, 2));

  res.json({
    data: {
      type: 'orders'
    }
  }).sendStatus(200)
})

app.listen(3003, () => {
  console.log('order-service is running at port 3003 ...');
})
