'use strict';

const express = require('express');

const {getVideo,postVideo,deleteVideo} = require('./videoCtrl');

const router = express.Router();

router.get('/:id', function(req, res){
  getVideo(`${req.params.id}`,req,res);
});

router.post('/:user', function(req, res){
  postVideo(`${req.params.user}`, req, res);
});

router.delete('/:user', function(req,res) {
  deleteVideo(`${req.params.user}`);
});

module.exports = router;
