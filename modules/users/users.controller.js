const userService = require('./users.service');

// Create user
const createUser = async (req, res) => {
  const user = await userService.createUser(req.body);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: user,
  });
};

// Get user by ID
const getUserById = async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  res.status(200).json({
    success: true,
    data: user,
  });
};

// Get user by email
const getUserByEmail = async (req, res) => {
  const user = await userService.getUserByEmail(req.query.email);

  res.status(200).json({
    success: true,
    data: user,
  });
};

// Get all users
const getAllUsers = async (req, res) => {
  const users = await userService.getAllUsers();

  res.status(200).json({
    success: true,
    data: users,
  });
};

// Update user
const updateUser = async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user,
  });
};

// Delete user
const deleteUser = async (req, res) => {
  await userService.deleteUser(req.params.id);

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  getAllUsers,
  updateUser,
  deleteUser,
};
