const shared = require('./setup');
const { agent, should } = shared;

before((done) => {
  agent
    .post('/api/login')
    .send({ username: 'yellowleopard753', password: 'jonjon' })
    .end((err, res) => {
      shared.jwt = res.body.token;
      done();
    });
});

describe('Cart', () => {
  it('access protected route, no token', (done) => {
    agent.get('/api/me/cart').end((err, res) => {
      res.should.have.status(401);
      res.body.should.have.property('error').which.equals('No token provided');
      done();
    });
  });

  it('add product to cart, get user cart to confirm product added', (done) => {
    agent
      .post('/api/me/cart')
      .set('Authorization', `Bearer ${shared.jwt}`)
      .send({ productId: '1' })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.property('productId').that.equals('1');
        res.body.should.have.property('quantity').that.equals(1);
        agent
          .get('/api/me/cart')
          .set('Authorization', `Bearer ${shared.jwt}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be
              .a('array')
              .that.include.deep.members([
                { productId: '1', name: 'Superglasses', quantity: 1 },
              ]);
            res.body.length.should.equals(1);
          });
        done();
      });
  });

  it('add invalid product', (done) => {
    agent
      .post('/api/me/cart')
      .set('Authorization', `Bearer ${shared.jwt}`)
      .send({ productId: '0' })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property('error')
          .which.equals('Invalid request body, valid productId required');
        done();
      });
  });

  it('add with no request body', (done) => {
    agent
      .post('/api/me/cart')
      .set('Authorization', `Bearer ${shared.jwt}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property('error')
          .which.equals('Invalid request body, valid productId required');
        done();
      });
  });

  it('add duplicate product', (done) => {
    agent
      .post('/api/me/cart')
      .set('Authorization', `Bearer ${shared.jwt}`)
      .send({ productId: '1' })
      .end((err, res) => {
        res.should.have.status(409);
        res.body.should.have
          .property('error')
          .which.equals('Product already in cart');
        done();
      });
  });

  it('add second product', (done) => {
    agent
      .post('/api/me/cart')
      .set('Authorization', `Bearer ${shared.jwt}`)
      .send({ productId: '2' })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.property('productId').that.equals('2');
        res.body.should.have.property('quantity').that.equals(1);
        done();
      });
  });

  it('two products that were added exist in users cart', (done) => {
    agent
      .get('/api/me/cart')
      .set('Authorization', `Bearer ${shared.jwt}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array').that.include.deep.members([
          { productId: '1', name: 'Superglasses', quantity: 1 },
          { productId: '2', name: 'Black Sunglasses', quantity: 1 },
        ]);
        res.body.length.should.equals(2);
        done();
      });
  });

  it('update product quantity', (done) => {
    agent
      .patch('/api/me/cart/1')
      .set('Authorization', `Bearer ${shared.jwt}`)
      .send({ quantity: 3 })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('productId').that.equals('1');
        res.body.should.have.property('quantity').that.equals(3);
        agent
          .get('/api/me/cart')
          .set('Authorization', `Bearer ${shared.jwt}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be
              .a('array')
              .that.include.deep.members([
                { productId: '1', name: 'Superglasses', quantity: 3 },
              ]);
            res.body.length.should.equals(2);
          });
        done();
      });
  });

  it('update product quantity, no request body', (done) => {
    agent
      .patch('/api/me/cart/1')
      .set('Authorization', `Bearer ${shared.jwt}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property('error')
          .which.equals('Invalid request body, valid quantity required');
        done();
      });
  });

  it('update product quantity, invalid param', (done) => {
    agent
      .patch('/api/me/cart/098765')
      .set('Authorization', `Bearer ${shared.jwt}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have
          .property('error')
          .which.equals('Product not found');
        done();
      });
  });

  it('delete product from cart, invalid param', (done) => {
    agent
      .delete('/api/me/cart/098765')
      .set('Authorization', `Bearer ${shared.jwt}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have
          .property('error')
          .which.equals('Product not found');
        done();
      });
  });

  it('delete product from cart, confirm deleted', (done) => {
    agent
      .delete('/api/me/cart/1')
      .set('Authorization', `Bearer ${shared.jwt}`)
      .end((err, res) => {
        res.should.have.status(204);
        agent
          .get('/api/me/cart')
          .set('Authorization', `Bearer ${shared.jwt}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.equals(1);
          });
        done();
      });
  });

  it('tidy up, delete other product from cart', (done) => {
    agent
      .delete('/api/me/cart/2')
      .set('Authorization', `Bearer ${shared.jwt}`)
      .end((err, res) => {
        res.should.have.status(204);
        done();
      });
  });
});
