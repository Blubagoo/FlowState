'use strict';

const express = require('express');
const passport = require('passport');
const {authenticate, authenticateForLogin, refreshToken} = require('./authctrl');

const router = express.Router();

const localAuth = passport.authenticate('local', {session: false});

const jwtAuth = passport.authenticate('jwt', {session: false});

router.get('/', jwtAuth, (req, res) => {
  authenticate();
})

router.post('/login/:user', localAuth, (req, res) => {
  authenticateForLogin(req, `${req.params.user}`, res);  
});

router.post('/refresh', jwtAuth, (req, res) => {
	refreshToken(req);
});

module.exports = router;