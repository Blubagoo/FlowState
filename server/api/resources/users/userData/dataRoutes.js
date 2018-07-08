'use stric';

const express = require('express');
const mongoose = require('mongoose');

const {Data} = require('./dataModel');

const router = express.Router();


router.get('/analytics/:user', (req, res) => {
  return Data
    .find({
      user: `${req.params.user}`
    })
    .then((stats) => Data.serialize(stats))
    .catch(err => console.error(err).pretty());
});

router.post('/analytics/:user', (req, res) => {
  Data
  .insert(req.body)
  .then(() => {
  	console.log(`updated db of ${req.params.user}`);
  	res.status(201).end();
  })
  .catch((err) => console.error(err).pretty());
});