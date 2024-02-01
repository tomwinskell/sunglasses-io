const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app/server'); // Adjust the path as needed

const should = chai.should();
chai.use(chaiHttp);

let token;

before((done) => {
	chai.request(server)
		.post('/api/login')
		.send({ username: 'yellowleopard753', password: 'jonjon' }) // Hardcoded valid credentials
		.end((err, res) => {
			token = res.body.token; // Store the token
			done();
		});
});

// Test for GET /api/brands
describe('Brands', () => {
	describe('/GET brands', () => {
		it('should GET all the brands', (done) => {
			chai.request(server)
				.get('/api/brands')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					done();
				});
		});
	});
});

// Test for POST /api/login
describe('Login', () => {
	describe('/POST login', () => {
		it('should login a user', (done) => {
			const user = {
				username: 'yellowleopard753',
				password: 'jonjon',
			};
			chai.request(server)
				.post('/api/login')
				.send(user)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property('token');
					done();
				});
		});

		it('should not login with wrong credentials', (done) => {
			let user = {
				username: 'wronguser',
				password: 'wrongpass',
			};
			chai.request(server)
				.post('/api/login')
				.send(user)
				.end((err, res) => {
					res.should.have.status(401);
					done();
				});
		});
	});
});

// Test for GET /api/me/cart
describe('Cart', () => {
	describe('/GET cart', () => {
		it('should not GET cart if not logged in', (done) => {
			chai.request(server)
				.get('/api/me/cart')
				.end((err, res) => {
					res.should.have.status(401);
					done();
				});
		});

		it('should GET cart if logged in', (done) => {
			chai.request(server)
				.post('/api/login')
				.set('Authorization', `Bearer ${token}`)
				.end((err, res) => {
					chai.request(server)
						.get('/api/me/cart')
						.set('Authorization', `Bearer ${token}`)
						.end((err, res) => {
							res.should.have.status(200);
							done();
						});
				});
		});

		it('should ADD product to cart', (done) => {
			chai.request(server)
				.post('/api/me/cart')
				.send({ productId: '1', quantity: 2 })
				.set('Authorization', `Bearer ${token}`)
				.end((err, res) => {
					res.should.have.status(200);

					res.body.user.cart[0].productId.should.be.eql('1');
					res.body.user.cart[0].quantity.should.be.eql(2);
					done();
				});
		});

		it('should increase the quantity of product to cart', (done) => {
			chai.request(server)
				.post('/api/me/cart/1')
				.send({ quantity: 2 })
				.set('Authorization', `Bearer ${token}`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.user.cart[0].productId.should.be.eql('1');
					res.body.user.cart[0].quantity.should.be.eql(2);
					done();
				});
		});

		it('should not ADD product to cart if product not found', (done) => {
			chai.request(server)
				.post('/api/me/cart')
				.send({ productId: '100', quantity: 2 })
				.set('Authorization', `Bearer ${token}`)
				.end((err, res) => {
					res.should.have.status(404);
					done();
				});
		});

		it('should not DELETE product from cart if not logged in', (done) => {
			chai.request(server)
				.delete('/api/me/cart/1')
				.end((err, res) => {
					res.should.have.status(401);
					done();
				});
		});

		it('should DELETE product from cart', (done) => {
			chai.request(server)
				.delete('/api/me/cart/1')
				.set('Authorization', `Bearer ${token}`)
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		});
	});
});
