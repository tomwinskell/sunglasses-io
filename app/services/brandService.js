const fs = require('fs');

exports.fetchAllBrands = () => {
  return JSON.parse(fs.readFileSync('app/data/brands.json', 'utf8'));
};

exports.isValidBrandId = (id) => {
  const brands = this.fetchAllBrands();
  return brands.some((brand) => brand.id === id);
};

exports.fetchProductsByBrandId = (id) => {
  const products = JSON.parse(
    fs.readFileSync('app/data/products.json', 'utf8')
  );
  return products.filter((product) => product.categoryId === id);
};

exports.fetchProductById = (productId) => {
  const products = this.fetchAllProducts();
  return products.find((product) => product.id === productId);
};

exports.fetchAllProducts = () => {
  return JSON.parse(fs.readFileSync('app/data/products.json', 'utf8'));
};
