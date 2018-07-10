'use strict';

const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const {JWT_SECRET, JWT_EXPIRY} = require('dotenv').config();

const router = express.Router();

const createAuthToken = function(user) {

  return jwt.sign({user}, 'shade', {
    subject: user.username,
    expiresIn: '7d',
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', {session: false});

router.use(bodyParser.json());

const jwtAuth = passport.authenticate('jwt', {session: false});

router.get('/', jwtAuth, (req, res) => {
  res.status(200).end();
})

router.post('/login/:user', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user.serialize());
  res.status(200).json({
    url: `https://flow-state.herokuapp.com/dashboard.html?username=${req.params.user}`,
    local: `http://localhost:3000/dashboard.html?username=${req.params.user}`,
    user: `${req.params.user}`,
    authToken
    });  
});

router.post('/refresh', jwtAuth, (req, res) => {
	console.log('refresh targeted');
	const authToken = createAuthToken(req.user);
	res.json({authToken});
});

module.exports = router;