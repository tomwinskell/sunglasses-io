const brandService = require('../services/brandService');

exports.getAllBrands = (req, res) => {
  const brands = brandService.fetchAllBrands();
  res.status(200).json(brands);
};

exports.getProductsByBrandId = (req, res) => {
  // Get brandId from params
  const brandId = req.params.brandId;
  // Confirm valid brandId
  if (!brandService.isValidBrandId(brandId)) {
    return res.status(400).json({ error: 'Invalid brandId' });
  }
  // Fetch products

  const products = brandService.fetchProductsByBrandId();
}
