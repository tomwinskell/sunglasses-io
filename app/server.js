const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const app = express();

app.use(bodyParser.json());

// Importing the data from JSON files
const users = require('../initial-data/users.json');
const brands = require('../initial-data/brands.json');
const products = require('../initial-data/products.json');

const authenticate = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
		const decoded = jwt.verify(token, 'yourSecretKey');
		req.userId = decoded.userId;
		next();
	} catch (error) {
		res.status(401).json({ message: 'Authentication failed' });
	}
};

// GET /api/brands
app.get('/api/brands', (req, res) => {
	res.status(200).json(brands);
});

// GET /api/brands/:id/products
app.get('/api/brands/:id/products', (req, res) => {
	const brandId = req.params.id;
	const brandProducts = products.filter(
		(product) => product.categoryId === brandId
	);
	res.status(200).json(brandProducts);
});

// GET /api/products
app.get('/api/products', (req, res) => {
	res.status(200).json(products);
});

// POST /api/login
app.post('/api/login', (req, res) => {
	const { username, password } = req.body;
	const user = users.find(
		(user) =>
			user.login.username === username && user.login.password === password
	);
	if (user) {
		const token = jwt.sign({ userId: user.id }, 'yourSecretKey'); // Replace 'yourSecretKey' with a real secret key
		res.status(200).json({ message: 'Login successful', token });
	} else {
		res.status(401).json({ message: 'Login failed' });
	}
});

// GET /api/me/cart
app.get('/api/me/cart', authenticate, (req, res) => {
	const { userId } = req;
	const user = users.find((user) => user.id === userId);
	res.status(200).json(user.cart);
});

// POST /api/me/cart
app.post('/api/me/cart', authenticate, (req, res) => {
	const { userId } = req;
	const user = users.find((user) => user.id === userId);
	const { productId, quantity } = req.body;
	const product = products.find((product) => product.id === productId);

	if (product) {
		user.cart.push({ productId, quantity });
		res.status(200).json({ message: 'Product added to cart', user });
	} else {
		res.status(404).json({ message: 'Product not found' });
	}
});

// DELETE /api/me/cart/:productId
app.delete('/api/me/cart/:productId', authenticate, (req, res) => {
	const { userId } = req;
	const user = users.find((user) => user.id === userId);
	const productId = req.params.productId;

	user.cart = user.cart.filter((item) => item.productId !== productId);
	res.status(200).json({ message: 'Product removed from cart', user });
});

// POST /api/me/cart/:productId
app.post('/api/me/cart/:productId', (req, res) => {
	const { userId } = req;
	const user = users.find((user) => user.id === userId);
	const productId = req.params.productId;
	const { quantity } = req.body;

	const cartItem = user.cart.find((item) => item.productId === productId);
	if (cartItem) {
		cartItem.quantity = quantity;
		res.status(200).json({ message: 'Cart updated', user });
	} else {
		res.status(404).json({ message: 'Product not in cart' });
	}
});

// Error handling
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

module.exports = app;
