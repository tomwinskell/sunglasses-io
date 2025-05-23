const fs = require('fs');
const { fetchProductById } = require('./brandService');
const { getUserByUsername, getAllUserData } = require('./userService');

exports.productIndexInCart = (username, productId) => {
  return this.fetchUserCart(username).findIndex(
    (item) => item.productId === productId
  );
};

exports.fetchUserCart = (username) => {
  return getUserByUsername(username).cart;
};

exports.convertToCartProduct = (productId, quantity) => {
  const { id, name } = fetchProductById(productId);
  if (!id) {
    throw new Error('Product not found');
  }
  return {
    productId: id,
    name: name,
    quantity,
  };
};

exports.returnMutatedCart = (username, productId, mutatedProduct) => {
  const indexOfProduct = this.productIndexInCart(username, productId);
  let usersCart = this.fetchUserCart(username);
  if (indexOfProduct !== -1) {
    usersCart = usersCart.filter((item) => item.productId !== productId);
  }
  if (!mutatedProduct) {
    return usersCart.filter((item) => item.productId !== productId);
  }
  return [...usersCart, mutatedProduct];
};

exports.updateStoredCart = (username, mutatedCart) => {
  const data = getAllUserData();
  // find the user and update the cart
  const user = data.find((user) => user.login.username === username);
  if (user) {
    user['cart'] = mutatedCart;
  } else {
    throw new Error('User not found');
  }
  // write updated json back to file
  fs.writeFileSync('app/data/users.json', JSON.stringify(data));
};

exports.postUpdateCartItem = (username, productId, quantity) => {
  if (!quantity) {
    quantity = 1;
  }
  // format product to add
  const mutatedProduct = this.convertToCartProduct(productId, quantity);
  const mutatedCart = this.returnMutatedCart(
    username,
    productId,
    mutatedProduct
  );
  this.updateStoredCart(username, mutatedCart);
  return mutatedProduct;
};

exports.deleteCartItem = (username, productId) => {
  // build mutatedCart without item
  const mutatedCart = this.returnMutatedCart(username, productId);
  // write mutatedCart to data
  this.updateStoredCart(username, mutatedCart);
  return;
};

exports.parseJsonInt = (value) => {
  const num = parseInt(value, 10);
  if (isNaN(num)) {
    return null;
  }
  return num;
};
