'use stric';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

mongoose.Promise = global.Promise;

const {Data} = require('./dataModel');
const {Dynamic} = require('./DynamicDataModel');

const router = express.Router();


router.get('/:user', (req, res) => {
  return Data
    .find({
      user: `${req.params.user}`
    })
    .then(data =>	res.json(data))
    .catch(err => console.error(err).pretty());
});

router.get('/dynamic/:user', (req, res) => {;
  return Dynamic
    .find({
      user: `${req.params.user}`
    })
    .then(data =>	res.json(data))
    .catch(err => console.error(err).pretty());
});

router.post('/:user', jsonParser, (req, res) => {
  let newData = new Data(req.body);
  
  newData.save(err => {
  	if(err){
  		console.error(err);
  	}
  	res.status(201).json(newData).end();
  });
});


router.post('/videoData/:user', jsonParser, (req, res) => {
	console.log('this is the req.body', req.body);
  let newData = new Dynamic(req.body);
  console.log('this is after the new dynamic', newData);
  newData.save(err => {
  	if(err){
  		console.error(err);
  	}
  	res.status(201).json(newData);
  });
});

module.exports = router;


