const shared = require('./setup');
const { agent, should } = shared;

describe('Login', () => {
  it('login success', (done) => {
    agent
      .post('/api/login')
      .send({ username: 'yellowleopard753', password: 'jonjon' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('token').that.is.a('string');
        shared.jwt = res.body.token;
        done();
      });
  });

  it('no username provided', (done) => {
    agent
      .post('/api/login')
      .send({ password: 'jonjon' })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property('error')
          .which.equals('Username and password are required');
        done();
      });
  });

  it('no password provided', (done) => {
    agent
      .post('/api/login')
      .send({ username: 'yellowleopard753' })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property('error')
          .which.equals('Username and password are required');
        done();
      });
  });

  it('no request body provided', (done) => {
    agent.post('/api/login').end((err, res) => {
      res.should.have.status(400);
      res.body.should.have
        .property('error')
        .which.equals('Username and password are required');
      done();
    });
  });

  it('invalid credentials', (done) => {
    agent
      .post('/api/login')
      .send({ username: 'invalid', password: 'invalid' })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have
          .property('error')
          .which.equals('Invalid credentials');
        done();
      });
  });
});
