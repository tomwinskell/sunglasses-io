const cartService = require('../services/cartService');

exports.getCartItems = (req, res) => {
  const { sub } = req.user;
  const cartItems = cartService.fetchCartItems(sub);
  res.status(200).json(cartItems);
};

exports.postItemToCart = (req, res) => {};

exports.deleteItemFromCart = (req, res) => {};

exports.updateItemInCart = (req, res) => {};
