const User = require('./users.model');

// Create a new user
const createUser = async (userData) => {
  const { username, email, password, role } = userData;

  // Check if username already exists
  const existingUsername = await User.findOne({ username });

  if (existingUsername) {
    throw new Error('Username already exists');
  }

  // Check if email already exists
  const existingEmail = await User.findOne({ email });

  if (existingEmail) {
    throw new Error('Email already exists');
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password,
    role,
  });

  return user;
};

// Find user by ID
const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

// Find user by email
const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

// Get all users
const getAllUsers = async (query = {}) => {
  const users = await User.find(query);

  return users;
};

// Update user
const updateUser = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

// Delete user
const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  getAllUsers,
  updateUser,
  deleteUser,
};
