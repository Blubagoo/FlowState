'use strict';

const express = require('express');
const path = require('path');
const formidable = require('formidable');
const fs = require('fs');

const PORT = process.env.PORT || 8080;
const router = express.Router();

const appMiddleware = require('./middleware/middleware');

const app = express();

appMiddleware(app);

app.use(express.static('public'));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/api/resources/tempVideoStrg', function(req, res){
  var file = __dirname + `/api/resources/tempVideoStrg/tst-video.webm`;
  res.download(file); // Set disposition and send it.
});


app.post('/upload', function(req, res){
	var form = new formidable.IncomingForm();
  form.multiples = true;
  form.uploadDir = path.join(__dirname, '/api/resources/tempVideoStrg');
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });
  form.on('end', function() {
    res.end('success');
  });
  form.parse(req);
});






if (require.main === module) {
  app.listen(process.env.PORT || 8080, function() {
    console.info(`App listening on ${this.address().port}`);
  });
}

module.exports = {app};