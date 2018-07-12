'use strict';

const path = require('path');
const formidable = require('formidable');
const fs = require('fs');

function getVideo(user) {
  var file = __dirname + `/${user}`;
  return res.sendFile(file);
}

function postVideo(user, req) {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.uploadDir = path.join(__dirname, '/');
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, user + ".webm"));

  });
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });
  form.on('end', function() {
    res.end('success');
  });
  form.parse(req);
}

function deleteVideo(user) {
  const filePath = path.join(__dirname, `/${user}.webm`);
  fs.unlink(filePath, (err) => {
    if (err) throw err
    console.log('file was deleted');
  });
}

module.exports = {getVideo, postVideo, deleteVideo};