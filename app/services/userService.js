require('dotenv').config();
const fs = require('fs');
const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.getAllUserData = () => {
  return JSON.parse(fs.readFileSync('app/data/users.json', 'utf8'));
};

exports.getUserByUsername = (username) => {
  return this.getAllUserData().find((user) => user.login.username === username);
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
