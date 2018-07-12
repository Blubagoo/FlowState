'use strict';

const express = require('express');
const mongoose = require('mongoose');
const appMiddleware = require('./middleware/middleware');

const routes = require('./api/api');

const strategies = require('./api/resources/auth/strategies');
const {PORT, DATABASE_URL, TEST_DATABASE_URL} = require('../env/config');

mongoose.Promise = global.Promise;

const app = express();

appMiddleware(app);

app.use(express.static('public'));

strategies(app);
routes(app);

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
})


let server;

function runServer(databaseUrl, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(PORT, () => {
        console.log(`Your app is listening on port ${PORT}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
    runServer("mongodb://server:Joedanger02@ds127771.mlab.com:27771/flow-state").catch(err => console.error(err));
  };

module.exports = {
	app, runServer, closeServer
};