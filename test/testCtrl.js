'use strict';

const mongoose = require('mongoose');
const {Dynamic} = require('../server/api/resources/users/userData/dynamicDataModel');
const {Data} = require('../server/api/resources/users/userData/dataModel');
const {User} = require('../server/api/resources/users/userModel');


function seedData() {
	console.log('seeding data')
	let testData =  {
    "user": "test-user",
    "anger": 3.584,
    "disgust": 0,
    "fear": 0,
    "joy": 0,
    "sadness": 4.301,
    "surprise": 0,
    "glances": 2,
    "dwell": 3,
    "attention": 100,
    "positive": 1,
    "negative": 2.971,
    "neutral": 1.971
	};
	let newData = new Data(testData);
  return newData.save(err => {
  	if(err){
  		console.error("there is a problem storing data",err);
  	}
  });
}

function seedDynamic() {
	let dynamicData =  {
    "user": "test-user",
    "frames": [
        {
            "anger": 0,
            "disgust": 0,
            "fear": 0,
            "joy": 0,
            "sadness": 0,
            "surprise": 0
        },
        {
            "anger": 0,
            "disgust": 0,
            "fear": 0,
            "joy": 0,
            "sadness": 0,
            "surprise": 0
        },
        {
            "anger": 0,
            "disgust": 0,
            "fear": 33.333,
            "joy": 0,
            "sadness": 0,
            "surprise": 0
        },
        {
            "anger": 0,
            "disgust": 0,
            "fear": 50,
            "joy": 0,
            "sadness": 25,
            "surprise": 0
        }]
	};
  let newData = new Dynamic(dynamicData);
  	return newData.save(err => {
  	if(err){
  		console.error('there is a problem storing dynamic data',err);
  	}
  });					
}
function seedUser() {
    console.log('')
	let user =  {
		username: 'test',
		password: '123456789'
	};
	return User.create(user)
        .then(function() {
            console.log('success on creating a user', user)
        })
        .catch(function(err) {
            console.error('there is a problem creating user', err)
        });
}
function tearDownDb() {
	console.warn('Deleting Database');
	return mongoose.connection.dropDatabase()
		.catch(function(err) {
			console.error('there is a problem with dropping the db',err);
		});
}



module.exports = {seedData,seedUser,seedDynamic,tearDownDb};