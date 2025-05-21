const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');

router.get('/brands', brandController.getAllBrands);
router.get('/brands/:id/products', brandController.getProductsByBrandId);
router.get('/products', brandController.getAllProducts);

module.exports = router;