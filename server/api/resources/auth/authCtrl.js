'use strict';

const passport = require('passport');

const jwt = require('jsonwebtoken');
const {JWT_SECRET, JWT_EXPIRY} = require('../../../../env/config.js');

const createAuthToken = function(user) {

  return jwt.sign({user}, `${JWT_SECRET}`, {
    subject: user.username,
    expiresIn: `${JWT_EXPIRY}`,
    algorithm: 'HS256'
  });
};

function authenticate() {
	return res.status(200).end();
}

function authenticateForLogin(req, user) {
	const authToken = createAuthToken(req.user.serialize());
  return res.status(200).json({
    url: `https://flow-state.herokuapp.com/dashboard.html?username=${user}`,
    local: `http://localhost:3000/dashboard.html?username=${user}`,
    user: `${user}`,
    authToken
    });
}

function refreshToken(req) {
	const authToken = createAuthToken(req.user);
	return res.json({authToken});
};