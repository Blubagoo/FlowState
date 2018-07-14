'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server/server.js');
const {TEST_DATABASE_URL} = require('../env/config');

const {Data} = require('../server/api/resources/users/userData/dataModel')
const {Dynamic} = require('../server/api/resources/users/userData/dynamicDataModel');
const {seedData,seedDynamic,seedUser,tearDownDb, populateDB} = require('./testCtrl');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Data Routes', function() {
	before(function() {
		return runServer(TEST_DATABASE_URL);
	});
	beforeEach(function() {
		seedData();
		seedDynamic();
		seedUser();
	});
	afterEach(function() {
		return tearDownDb();
	});

	after(function() {
		return closeServer();
	});

	it('should get user data', function() {

		return chai.request(app)
			.get('/api/users/analytics/test-user')
			.then(function(res) {
				console.log('this is res.body', res.body)
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body[0].user).to.be.a('string');
				expect(res.body[0].user).to.equal('test-user');
			});
	});

	it('should get dynamic user data', function() {

		return chai.request(app)
			.get('/api/users/analytics/dynamic/test-user')
			.then(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.a('array');
			})
	})

	it('should post user data', function() {
		const newUserData = seedData();
		return chai.request(app)
			.post('/api/users/analytics/test-user')
			.send(newUserData)
			.then(function(res) {
				expect(res).to.have.status(201);
				expect(res).to.be.json;
			})
			.catch(function(err) {
				console.error(err);
			})
	});

	it('should post dynamic user data', function() {
		const newDynamic = seedDynamic();
		return chai.request(app)
			.post('/api/users/analytics/videoData/test-user')
			.send(newDynamic)
			.then(function(res) {
				expect(res).to.have.status(201);
				expect(res).to.be.json;
			})
			.catch(function(err) {
				console.error(err);
			})
	})


})
