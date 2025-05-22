const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/me/cart', cartController.getCartItems);
router.post('/me/cart', cartController.postItemToCart);
router.delete('/me/cart/{productId}', cartController.deleteItemFromCart);
router.post('/me/cart/{productId}', cartController.updateItemInCart);

module.exports = router;
