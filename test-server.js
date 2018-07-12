'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server/server.js');

const expect = chai.expect;

chai.use(chaiHttp);



describe('index page', function() {
	
	before(function() {
		runServer();
	});

	after(function() {
		closeServer();
	})

	it('should exist', function() {

		return chai.request(app)
			.get('/')
			.then(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
			})
			.catch(err=> console.error(err));
	});
});

