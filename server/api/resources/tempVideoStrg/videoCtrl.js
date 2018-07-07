'use strict';

const router = require('express').Router();
const {}

app.get('/api/resources/tempVideoStrg/:uid', function(req, res){
  var file = __dirname + `/api/resources/tempVideoStrg/${req.params.uid}`;
  console.log(file);
  res.sendFile(file); // Set disposition and send it.
});


app.post('/upload', function(req, res){
	var form = new formidable.IncomingForm();
  form.multiples = true;
  form.uploadDir = path.join(__dirname, '/api/resources/tempVideoStrg');
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, `${}-video.webm`));
  });
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });
  form.on('end', function() {
    res.end('success');
  });
  form.parse(req);
});


app.delete('/delete',function(req,res) {
 	const filePath = path.join(__dirname, '/api/resources/tempVideoStrg/name.webm');
	fs.unlink(filePath, (err) => {
  	if (err) throw err
  	console.log('file was deleted');
	});
})