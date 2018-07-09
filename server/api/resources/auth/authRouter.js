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

router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user.serialize());
  let username = req.body.username;
  res.json({authToken});
});

const jwtAuth = passport.authenticate('jwt', {session: false});

router.post('/refresh', jwtAuth, (req, res) => {
	console.log('refresh targeted');
	const authToken = createAuthToken(req.user);
	res.json({authToken});
});

router.get('/dashboard/:user/:jwt', jwtAuth, (req, res) => {
  console.log('redirecting')
	res.status(200).json({url: `https://flow-state.herokuapp.com/dashboard.html?username=${req.params.user}`});   
})
router.get('/private', (req, res) => {
  console.log('going to dashboard');
  res.location("http://localhost:8080/dashboard.html");
})

module.exports = router;