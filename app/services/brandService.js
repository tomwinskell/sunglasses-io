const fs = require('fs');

exports.fetchAllBrands = () => {
  return JSON.parse(fs.readFileSync('app/data/brands.json', 'utf8'));
};
