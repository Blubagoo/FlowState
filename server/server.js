'use strict';

const express = require('express');
const mongoose = require('mongoose');
const appMiddleware = require('./middleware/middleware');
const videoRoutes = require('./api/resources/tempVideoStrg/videoRoutes');
const authRoutes = require('./api/resources/auth/authRouter');
const dataRoutes = require('./api/resources/users/userData/dataRoutes');
const {localStrategy, jwtStrategy} = require('./api/resources/auth/strategies');
const userRoutes = require('./api/resources/users/userRoutes');
const path = require('path');
const formidable = require('formidable');
const fs = require('fs');
const passport = require('passport');
const {DATABASE_URL,} = require('dotenv').config();



mongoose.Promise = global.Promise;

const app = express();

mongoose.connect("mongodb://server:Joedanger02@ds127771.mlab.com:27771/flow-state")
  .then(() => console.log('connected'))
  .catch(err => console.error('there was a connection error', err));

appMiddleware(app);

app.use(express.static('public'));

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
})



app.use('/api/video', videoRoutes);
app.use('/api/video/:id',videoRoutes);
app.use('/api/users/', userRoutes);
app.use('/api/users/analytics', dataRoutes)  
app.use('/api/auth/', authRoutes);


;

if (require.main === module) {
  app.listen(process.env.PORT || 8080, function() {
    console.info(`App listening on ${this.address().port}`);
  });
}

let server;

function runServer(databaseUrl, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
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


module.exports = {
	app, runServer, closeServer
};