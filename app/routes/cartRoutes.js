const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../authMiddleware');

router.get('/me/cart', authMiddleware, cartController.getCartItems);
router.post('/me/cart', authMiddleware, cartController.postItemToCart);
router.delete(
  '/me/cart/:id',
  authMiddleware,
  cartController.deleteItemFromCart
);
router.patch('/me/cart/:id', authMiddleware, cartController.updateItemInCart);

module.exports = router;
