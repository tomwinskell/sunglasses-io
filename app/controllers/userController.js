const userService = require('../services/userService');

exports.getUserToken = (req, res) => {
  // Get username and password from body
  const { username, password } = req.body;
  // Validate username and password
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: 'Username and password are required' });
  }
  // Check if user exists and password is correct
  const user = userService.getUserByUsername(username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const isPasswordCorrect = userService.comparePassword(
    password,
    user.login.password
  );
  if (!isPasswordCorrect) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate token and return
  const token = userService.generateToken(user);
  res.status(200).json({ token });
};
