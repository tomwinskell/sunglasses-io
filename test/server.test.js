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
      .end(async (err, res) => {
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
      .end(async (err, res) => {
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
      .end(async (err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error').which.equals('Invalid brandId');
        done();
      });
  });
});

describe('Login', () => {});

describe('Cart', () => {});
