const fs = require('fs');
const { fetchProductById } = require('./brandService');
const { getUserByUsername } = require('./userService');

exports.duplicateCartItem = (username, productId) => {
  return this.fetchCartItems(username).some(
    (item) => item.productId === productId
  );
};

exports.fetchCartItems = (username) => {
  const user = getUserByUsername(username);
  if (!user) {
    throw new Error('User not found');
  }
  return user.cart;
};

exports.postItemToCart = (username, productId) => {
  const { id, name } = fetchProductById(productId);
  if (!id) {
    throw new Error('Product not found');
  }
  const productToAdd = {
    productId: id,
    name: name,
    quantity: 1,
  };
  // get all user data
  const data = JSON.parse(fs.readFileSync('app/data/users.json', 'utf8'));

  // find the user and update the cart
  const user = data.find((user) => user.login.username === username);
  if (user) {
    user.cart = [...user.cart, productToAdd];
  } else {
    throw new Error('User not found');
  }

  // write updated json back to file
  fs.writeFileSync('app/data/users.json', JSON.stringify(data));
  return productToAdd;
};
