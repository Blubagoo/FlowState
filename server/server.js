'use strict';

const express = require('express');
const appMiddleware = require('./middleware/middleware');
const PORT = process.env.PORT || 8080;
const router = express.Router();
const {VidSchema} = require('./api/resources/tempVideoStrg/tempStorageModel')


const app = express();

app.use(express.static('public'));


app.get('/:id', (req, res) => {
  res.json(VidSchema.get());
});



app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});




if (require.main === module) {
  app.listen(process.env.PORT || 8080, function() {
    console.info(`App listening on ${this.address().port}`);
  });
}

module.exports = {app};