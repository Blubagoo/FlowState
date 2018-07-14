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



function authenticateForLogin(req, user, res) {
	const authToken = createAuthToken(req.user.serialize());
  return res.status(200).json({
    url: `https://flow-state.herokuapp.com/dashboard.html?username=${user}`,
    local: `http://localhost:3000/dashboard.html?username=${user}`,
    user: `${user}`,
    authToken
    });
}

function refreshToken(req,res) {
	const authToken = createAuthToken(req.user);
	return res.json({authToken});
};

module.exports = {
  authenticateForLogin, refreshToken
}