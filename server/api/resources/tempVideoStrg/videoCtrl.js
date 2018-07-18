'use strict';

const path = require('path');
const formidable = require('formidable');
const fs = require('fs');

function getVideo(fileName,req,res) {
  console.log('this is the file name', fileName)
  var file = __dirname + `/${fileName}`;
  return res.sendFile(file);
}

function postVideo(user, req, res) {
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
    return res.end('success');
  });
  form.parse(req);
}

function deleteVideo(user) {
  if(user === test.webm) {
    return res.status(204);
  }
  const filePath = path.join(__dirname, `/${user}.webm`);
  fs.unlink(filePath, (err) => {
    if (err) throw err
    console.log('file was deleted');
  });
}

module.exports = {getVideo, postVideo, deleteVideo};