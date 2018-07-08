'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const {User} = require('./userModel');

const router = express.Router();

const jsonParser = bodyParser.json();

//register new user



router.post('/', jsonParser, (req, res) => {
	console.log('post route targeted');
  const requiredFields = ['username', 'password'];
  console.log('1');
  const missingField = requiredFields.find(field => !(field in req.body));
  console.log('2');
  if(missingField) {
    console.log('first if');
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }
  console.log('3');
  const stringFields = ['username', 'password', 'firstName', 'lastName'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }
  console.log('4');
  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }
console.log('5');
  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 8,
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );
  console.log('6');
  if (tooSmallField || tooLargeField) {
    
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {username, password, firstName = '', lastName = ''} = req.body;
 
  firstName = firstName.trim();
  console.log(firstName);
  lastName = lastName.trim();
  console.log(lastName);
  console.log(username);
console.log('7');
  return User.find({username})
    .count()
    .then(count => {
    	console.log('user.find');
      
      if (count > 0) {
        
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      
      return User.hashPassword(password);
    })
    .then(hash => {
      
      return User.create({
        username,
        password: hash,
        firstName,
        lastName
      });
    })
    .then(user => {
      
      return res.status(201).json(user.serialize());
    })
    .catch(err => {
    	console.log(err);
      if (err.reason === 'ValidationError') {
        
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});




//get id
router.get('/:user', (req, res) => {
  
  return User.find({username: `${req.params.user}`})
    .then(users => res.json(users.map(user => user.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});



module.exports = router;
