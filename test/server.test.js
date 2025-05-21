const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app/server'); // Adjust the path as needed

const should = chai.should();
chai.use(chaiHttp);

describe('Brands', () => {
  it('all brands in data', (done) => {
    chai
      .request(server)
      .get('/api/brands')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be
          .an('array')
          .that.include.deep.members([{ id: '1', name: 'Oakley' }]);
        done();
      });
  });

  it('products for brand id', (done) => {
    chai
      .request(server)
      .get('/api/brands/1/products')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.every((obj) => (obj.categoryId = '1')).should.be.true;
        done();
      });
  });

  it('400 invalid brandId', (done) => {
    chai
      .request(server)
      .get('/api/brands/098765/products')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error').which.equals('Invalid brandId');
        done();
      });
  });

  it('all products in data', (done) => {
    chai
      .request(server)
      .get('/api/products')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.equals(11);
        done();
      });
  });
});

describe('Login', () => {
  it('login success', (done) => {
    chai
      .request(server)
      .post('/api/login')
      .send({ username: 'yellowleopard753', password: 'jonjon' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('token').that.is.a('string');
        done();
      });
  });

  it('no username provided', (done) => {
    chai
      .request(server)
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
    chai
      .request(server)
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
    chai
      .request(server)
      .post('/api/login')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property('error')
          .which.equals('Username and password are required');
        done();
      });
  });

  it('invalid credentials', (done) => {
    chai
      .request(server)
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

describe('Cart', () => {});
