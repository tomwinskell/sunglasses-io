const cartService = require('../services/cartService');
const brandService = require('../services/brandService');

exports.getCartItems = (req, res) => {
  const { sub } = req.user;
  const cartItems = cartService.fetchCartItems(sub);
  res.status(200).json(cartItems);
};

exports.postItemToCart = (req, res) => {
  const { sub } = req.user;
  // Validate productId
  const { productId } = req.body;
  const validProduct = brandService.fetchProductById(productId);
  if (!validProduct) {
    return res.status(400).json({ error: 'Invalid request body, valid productId required' });
  }
  // Check for duplicate cart item
  if (cartService.duplicateCartItem(sub, productId)) {
    return res.status(409).json({ error: 'Product already in cart' });
  }
  // Add product to cart, return added object
  const addedItem = cartService.postItemToCart(sub, productId);
  res.status(201).json(addedItem);
};

exports.deleteItemFromCart = (req, res) => {};

exports.updateItemInCart = (req, res) => {};
