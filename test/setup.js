const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app/server'); // Adjust the path as needed

chai.use(chaiHttp);

const shared = {
  should: chai.should(),
  agent: chai.request.agent(server),
  jwt: null,
};

module.exports = shared;
