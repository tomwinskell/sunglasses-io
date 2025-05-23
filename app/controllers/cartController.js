const cartService = require('../services/cartService');
const brandService = require('../services/brandService');

exports.getCartItems = (req, res) => {
  const { sub } = req.user;
  const cartItems = cartService.fetchUserCart(sub);
  res.status(200).json(cartItems);
};

exports.postItemToCart = (req, res) => {
  const { sub } = req.user;
  // Validate productId
  const { productId } = req.body;
  const validProduct = brandService.fetchProductById(productId);
  if (!validProduct) {
    return res
      .status(400)
      .json({ error: 'Invalid request body, valid productId required' });
  }
  // Check for duplicate cart item
  if (cartService.productIndexInCart(sub, productId) !== -1) {
    return res.status(409).json({ error: 'Product already in cart' });
  }
  // Add product to cart, return added object
  const addedItem = cartService.postUpdateCartItem(sub, productId);
  res.status(201).json(addedItem);
};

exports.updateItemInCart = (req, res) => {
  const { sub } = req.user;
  // Get productId from params
  const productId = req.params.id;
  // Validate productId
  const validProduct = brandService.fetchProductById(productId);
  if (!validProduct) {
    return res.status(404).json({ error: 'Product not found' });
  }
  // get quantity from request body
  const { quantity } = req.body;
  const validQuantity = cartService.parseJsonInt(quantity);
  // validate quantity
  if (!validQuantity) {
    return res
      .status(400)
      .json({ error: 'Invalid request body, valid quantity required' });
  }

  const mutatedItem = cartService.postUpdateCartItem(
    sub,
    productId,
    validQuantity
  );
  res.status(200).json(mutatedItem);
};

exports.deleteItemFromCart = (req, res) => {
  const { sub } = req.user;
  // Get productId from params
  const productId = req.params.id;
  // Validate productId
  const validProduct = brandService.fetchProductById(productId);
  if (!validProduct) {
    return res.status(404).json({ error: 'Product not found' });
  }
  // Check for duplicate cart item
  if (cartService.productIndexInCart(sub, productId) === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  cartService.deleteCartItem(sub, productId);
  res.sendStatus(204);
};
