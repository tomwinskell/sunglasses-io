const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const token = req.get('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const [scheme, tokenValue] = token.split(' ');
  if (scheme !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  jwt.verify(tokenValue, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;
