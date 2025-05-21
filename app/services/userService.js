require('dotenv').config();
const fs = require('fs');
const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.getUserByUsername = (username) => {
  const users = JSON.parse(fs.readFileSync('app/data/users.json', 'utf8'));
  return users.find((user) => user.login.username === username);
};

exports.comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

exports.generateToken = ({ login, email }) => {
  const payload = { sub: login.username, email };
  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: '1h',
  });
  return token;
};
