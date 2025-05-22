const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app/server'); // Adjust the path as needed

const should = chai.should();
chai.use(chaiHttp);

const agent = chai.request.agent(server);
let jwt;

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

describe('Login', () => {
  it('login success', (done) => {
    agent
      .post('/api/login')
      .send({ username: 'yellowleopard753', password: 'jonjon' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('token').that.is.a('string');
        jwt = res.body.token;
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

describe('Cart', () => {

  it('access protected route, no token',
    (done) => {
      agent.get('/api/me/cart').end((err, res) => {
        res.should.have.status(401);
        res.body.should.have
          .property('error')
          .which.equals('No token provided');
        done();
      });
    });

  it('add product to cart', (done) => {
    agent
      .post('/api/me/cart')
      .set('Authorization', `Bearer ${jwt}`)
      .send({ productId: '1' })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.property('productId').that.equals('1');
        res.body.should.have.property('quantity').that.equals(1);
        done();
      });
  });

  it('add invalid product', (done) => {
    agent
      .post('/api/me/cart')
      .set('Authorization', `Bearer ${jwt}`)
      .send({ productId: '0' })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property('error')
          .which.equals('Invalid productId');
        done();
      });
  });

  it('add with no request body', (done) => {
    agent
      .post('/api/me/cart')
      .set('Authorization', `Bearer ${jwt}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property('error')
          .which.equals('Invalid request body, expected {productId}');
        done();
      });
  });

  it('add duplicate product', (done) => {
    agent
      .post('/api/me/cart')
      .set('Authorization', `Bearer ${jwt}`)
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
      .set('Authorization', `Bearer ${jwt}`)
      .send({ productId: '2' })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.property('productId').that.equals('2');
        res.body.should.have.property('quantity').that.equals(1);
        done();
      });
  });

  it('all products in cart', (done) => {
    agent
      .get('/api/me/cart')
      .set('Authorization', `Bearer ${jwt}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.equals(2);
        done();
      });
  });

  it('update product quantity', (done) => {
    agent
      .patch('/api/me/cart/1')
      .set('Authorization', `Bearer ${jwt}`)
      .send({ quantity: 3 })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('productId').that.equals('1');
        res.body.should.have.property('quantity').that.equals(3);
        done();
      });
  });

  it('update product quantity, no request body', (done) => {
    agent
      .patch('/api/me/cart/1')
      .set('Authorization', `Bearer ${jwt}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property('error')
          .which.equals('Invalid request body, expected {quantity}');
        done();
      });
  });

  it('update product quantity, invalid param', (done) => {
    agent
      .patch('/api/me/cart/098765')
      .set('Authorization', `Bearer ${jwt}`)
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
      .set('Authorization', `Bearer ${jwt}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have
          .property('error')
          .which.equals('Product not found');
        done();
      });
  });

  it('delete product from cart', (done) => {
    agent
      .delete('/api/me/cart/1')
      .set('Authorization', `Bearer ${jwt}`)
      .end((err, res) => {
        res.should.have.status(204);
      });
  });

  it('get products, confirm product deleted', (done) => {
    agent
      .get('/api/me/cart')
      .set('Authorization', `Bearer ${jwt}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.equals(1);
        done();
      });
  });
});
