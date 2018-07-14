'use strict';

const express = require('express');
const passport = require('passport');
const {authenticateForLogin, refreshToken} = require('./authCtrl');
const {JWT_SECRET, JWT_EXPIRY, APP_KEY, APP_ID} = require('../../../../env/config.js');

const router = express.Router();

const localAuth = passport.authenticate('local', {session: false});

const jwtAuth = passport.authenticate('jwt', {session: false});

router.get('/', jwtAuth, (req, res) => {
	res.status(200).json({
    "APPkey": `${APP_KEY}`,
    "APPid": `${APP_ID}`
    })
    .then(function(res) {
      console.log(res.status);
    })
})

router.post('/login/:user', localAuth, (req, res) => {
  authenticateForLogin(req, `${req.params.user}`, res);  
});

router.post('/refresh', jwtAuth, (req, res) => {
	refreshToken(req, res);
});

module.exports = router;