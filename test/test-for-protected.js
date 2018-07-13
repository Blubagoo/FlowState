
const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server/server.js');
const {TEST_DATABASE_URL} = require('../env/config');
const {User} = require('../server/api/resources/users/userModel');

const {seedData,seedDynamic,seedUser,tearDownDb, populateDB} = require('./testCtrl');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Authorization Routes', function() {
	before(function() {
		return runServer(TEST_DATABASE_URL);
	});
	beforeEach(function() {
		return seedUser();
	});
	afterEach(function() {
		return tearDownDb();
	});

	after(function() {
		return closeServer();
	});
	
	it('should get user authenticated and send jwt', function() {
		const user = {
			username: "test",
			password: "123456789"
		}
		return chai.request(app)
			.post('/api/auth/login/test')
			.send(user)
			.set("Content-Type", "application/json")
			.then(function(res) {
				jwt = res.body.jwt;
				expect(res).to.have.status(201);
				expect(res).to.be.json;
				expect(res.body.jwt).to.be.a('string');
				expect(res.body).to.have.key('authToken');
			})
			.catch(function(err) {
				console.error('there is an error in authenticating', err);
			})
	});

	it('should validate JWT', function() {
		return chai.request(app)
			.get('/api/auth')
			.set("Authorization", `Bearer ${jwt}`)
			.then(function(res) {
				expect(res).to.have.status(200);
			})
			.catch(function(err) {
				console.error(err);
			})
	});

	it('should refresh token when necessary', function() {

		return chai.request(app)
			.post('/api/auth/refresh')
			.set("Authorization", `Bearer ${jwt}`)
			.then(function(res) {
				expect(res).to.have.status(201);
				expect(res).to.be.json;
				expect(res.body).to.have.key('authToken');
			})
			.catch(function(err) {
				console.error(err);
			})
	})

});