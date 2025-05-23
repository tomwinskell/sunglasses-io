const shared = require('./setup');
const { agent, should } = shared;

describe('Brands', () => {
  it('all brands in data', (done) => {
    agent.get('/api/brands').end((err, res) => {
      res.should.have.status(200);
      res.body.should.be
        .an('array')
        .that.include.deep.members([{ id: '1', name: 'Oakley' }]);
      done();
    });
  });

  it('products for brand id', (done) => {
    agent.get('/api/brands/1/products').end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.every((obj) => (obj.categoryId = '1')).should.be.true;
      done();
    });
  });

  it('400 invalid brandId', (done) => {
    agent.get('/api/brands/098765/products').end((err, res) => {
      res.should.have.status(400);
      res.body.should.have.property('error').which.equals('Invalid brandId');
      done();
    });
  });

  it('all products in data', (done) => {
    agent.get('/api/products').end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.length.should.equals(11);
      done();
    });
  });
});
