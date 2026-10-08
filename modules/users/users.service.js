const User = require('./users.model');

// Create a new user
const createUser = async (userData) => {
  const { username, email, password, role } = userData;

  // Check if username or email already exists in a single query
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  }).select('_id username email').lean();

  if (existingUser) {
    if (existingUser.username === username) {
      throw new Error('Username already exists');
    }
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
  const user = await User.findById(userId).select('-password').lean();

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

// Find user by email
const getUserByEmail = async (email) => {
  const user = await User.findOne({ email }).select('-password').lean();

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

// Get all users
const getAllUsers = async (query = {}) => {
  const users = await User.find(query).select('-password').sort({ createdAt: -1 }).lean();

  return users;
};

// Update user
const updateUser = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select('-password').lean();

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
