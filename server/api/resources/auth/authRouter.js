'use strict';

const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');


const router = express.Router();

router.use(bodyParser.json());

const localAuth = passport.authenticate('local', {session: false});

const jwtAuth = passport.authenticate('jwt', {session: false});

router.get('/', jwtAuth, (req, res) => {
  authenticate();
})

router.post('/login/:user', localAuth, (req, res) => {
  authenticateForLogin(req, `${req.params.user}`);  
});

router.post('/refresh', jwtAuth, (req, res) => {
	refreshToken(req);
});

module.exports = router;