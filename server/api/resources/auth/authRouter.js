'use strict';

const express = require('express');
const passport = require('passport');
const {authenticate, authenticateForLogin, refreshToken} = require('./authCtrl');

const router = express.Router();

const localAuth = passport.authenticate('local', {session: false});

const jwtAuth = passport.authenticate('jwt', {session: false});

router.get('/', jwtAuth, (req, res) => {
	console.log(req);
	console.log(res)
  authenticate(req, res);
})

router.post('/login/:user', localAuth, (req, res) => {
  authenticateForLogin(req, `${req.params.user}`, res);  
});

router.post('/refresh', jwtAuth, (req, res) => {
	refreshToken(req, res);
});

module.exports = router;