const fs = require('fs');
const { getUserByUsername } = require('./userService');

exports.fetchCartItems = (username) => {
  const user = getUserByUsername(username);
  if (!user) {
    throw new Error('User not found');
  }
  return user.cart;
};
