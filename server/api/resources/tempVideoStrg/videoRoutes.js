'use strict';

const express = require('express');
const path = require('path');
const formidable = require('formidable');
const fs = require('fs');

const router = express.Router();

router.get('/:id', function(req, res){
  console.log('get route targeted');
  var file = __dirname + `/${req.params.id}`;
  console.log(file);
  res.sendFile(file); // Set disposition and send it.
});

router.post('/:user', function(req, res){
  console.log('post working');
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.uploadDir = path.join(__dirname, '/');
  let fileName = `${req.params.user}-${Date.now}`
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, req.params.user + ".webm"));

  });
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });
  form.on('end', function() {
    res.end('success');
  });
  form.parse(req);
});

router.delete('/:user', function(req,res) {
  console.log('trying to delete');
  const filePath = path.join(__dirname, `/${req.params.user}.webm`);
  fs.unlink(filePath, (err) => {
    if (err) throw err
    console.log('file was deleted');
  });
});






module.exports = router;
