'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server/server.js');
const {seedData,seedDynamic,seedUser,tearDownDb, populateDB} = require('./testCtrl');
const {TEST_DATABASE_URL} = require('../env/config');

const expect = chai.expect;

chai.use(chaiHttp);

describe("user database", function() {
	
	before(function() {
		return runServer(TEST_DATABASE_URL);
	})
	beforeEach(function() {
		seedData();
		seedDynamic();
		seedUser();
	})
	afterEach(function() {
		return tearDownDb();
	})
	after(function() {
		return closeServer();
	})
	

	it('should get users', function() {
		return chai.request(app)
			.get('/api/users/test-user')
			.then(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;	
			})
			.catch(function(err) {
				console.error(err);
			});
	});
	it('should post new user', function() {
		const newUser = {username: "johnDoe", password: "123456789"}
		return chai.request(app)
			.post('/api/users')
			.send(newUser)
			.then(function(res) {
				expect(res).to.have.status(201);
				expect(res).to.be.json;
				expect(res.body).to.have.keys("firstName","id","lastName","username");
				expect(res.body.id).to.be.a('string');
			})
			.catch(function(err) {
				console.error(err);
			})
	})


})
