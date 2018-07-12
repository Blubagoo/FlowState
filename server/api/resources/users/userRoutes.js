'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const {postNewUser, getUser} = require('./userCtrl');

const router = express.Router();

const jsonParser = bodyParser.json();


router.post('/', jsonParser, (req, res) => {
  postNewUser(`${req.body}`);
});

router.get('/:user', (req, res) => {
  getUser(`${req.params.user}`)
});

module.exports = router;
