'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server/server.js');

const expect = chai.expect;

chai.use(chaiHttp);
