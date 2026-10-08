const authService = require('./auth.service');

const registerUser = async (req, res) => {
  const user = await authService.registerUser(req, res);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: user,
  });
};

const loginUser = async (req, res) => {
  const data = await authService.loginUser(req, res);

  res.status(200).json({
    success: true,
    message: 'User logged in successfully',
    data
  });
};

module.exports = {
  registerUser,
  loginUser,
};
