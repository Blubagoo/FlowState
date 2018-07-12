'use stric';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

mongoose.Promise = global.Promise;

const { getUserData, getUserDynamic, 
        postNewData, postNewDynamic  } = require('./dataCtrl');


const router = express.Router();


router.get('/:user', (req, res) => {
  getUserData(`${req.params.user}`);
});

router.get('/dynamic/:user', (req, res) => {;
  getUserDynamic(`${req.params.user}`)
});

router.post('/:user', jsonParser, (req, res) => {
  postNewData(req, res);
});


router.post('/videoData/:user', jsonParser, (req, res) => {
	postNewDynamic(req, res)
});

module.exports = router;


